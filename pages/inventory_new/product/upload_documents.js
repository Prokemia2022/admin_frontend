import React, { useState } from 'react';
import { 
    Box, 
    Button, 
    Divider, 
    FormControl, 
    FormLabel, 
    HStack, 
    IconButton, 
    Input, 
    Text, 
    Tooltip, 
    useToast
} from '@chakra-ui/react';
import {Done,Description,ArrowBack,Close} from '@mui/icons-material';
//api
import Edit_Product from '../../api/Products/edit_product.js'
//utils
import Cookies from 'universal-cookie';
import {storage} from '../../../components/firebase.js';
import {ref,uploadBytes,getDownloadURL} from 'firebase/storage';

function Upload_documents({set_isfileupload,handle_add_new_product}) {
    /**
     * Upload_documents: Handles the upload and update of files.
     * Files: data sheet, safety data sheet, formulation document
     * Props:
     *      set_isfileupload (Boolean): handles the state of visibility of file upload section.
     * 
     */
    //utils
    const toast = useToast();
    const cookies = new Cookies();

     //upload status of each file
     const [is_data_sheet_uploaded,set_is_data_sheet_uploaded]=useState(false);
     const [is_safety_data_sheet_uploaded,set_is_safety_data_sheet_uploaded]=useState(false);
     const [is_formulation_document_uploaded,set_is_formulation_document_uploaded]=useState(false);
 
     //input data state handlers
     const [data_sheet,set_data_sheet]=useState(''); //handles the state of data sheet file selection
     const [safety_data_sheet,set_safety_data_sheet]=useState('');  //handles the state of safety data sheet file selection
     const [formulation_document,set_formulation_document]=useState(''); //handles the state of formulation document file selection
 
     //url file state handlers
     const [data_sheet_url,set_data_sheet_url]=useState(''); //handles the state of data sheet file selection
     const [safety_data_sheet_url,set_safety_data_sheet_url]=useState('');  //handles the state of safety data sheet file selection
     const [formulation_document_url,set_formulation_document_url]=useState(''); //handles the state of formulation document file selection
 
     const files ={
         data_sheet_url,
         safety_data_sheet_url,
         formulation_document_url
     }
     //loading Status
    const [is_submitting,set_is_submitting]=useState(false)

    //Functions
    const Handle_Continue_Product_Upload=()=>{
        /**
         * Handle_Continue_Product_Upload: Skip for now will upload details that were already filled and will route to form section.
         */
        set_isfileupload(false);
        setTimeout(()=>{
            handle_add_new_product();
        },1500)
    }

    const data_sheet_file_upload_to_firebase_storage=async()=>{
        if (data_sheet?.name == undefined){
            toast({
                position: 'top-left',
                variant:"subtle",
                title: '',
                description: 'could not find data sheet file, try re-uploading it.',
                status: 'error',
                isClosable: true,
            })
			return ;
		}else{
			const data_sheet_documentRef = ref(storage, `data_sheet/${data_sheet?.name}`);
			const snapshot= await uploadBytes(data_sheet_documentRef,data_sheet);
			const file_url = await getDownloadURL(snapshot.ref);
			cookies.set('data_sheet_url', file_url, { path: '/' });
			return file_url;
		}
	}
    const safety_data_sheet_file_upload_to_firebase_storage=async()=>{
        if (safety_data_sheet?.name == undefined){
			toast({
                position: 'top-left',
                variant:"subtle",
                title: '',
                description: 'could not find safety data sheet file, try re-uploading it.',
                status: 'error',
                isClosable: true,
            });
			return ;
		}else{
			const safety_data_sheet_documentRef = ref(storage, `safety_data_sheet/${safety_data_sheet?.name}`);
			const snapshot= await uploadBytes(safety_data_sheet_documentRef,safety_data_sheet);
			const file_url = await getDownloadURL(snapshot.ref);
			cookies.set('safety_data_sheet_url', file_url, { path: '/' });
			return file_url
		}
	}
    const formulation_document_file_upload_to_firebase_storage=async()=>{
        if (formulation_document?.name == undefined){
			toast({
                position: 'top-left',
                variant:"subtle",
                title: '',
                description: 'could not find formulation document file, try re-uploading it.',
                status: 'error',
                isClosable: true,
            });
            return ;
		}else{
			const formulation_document_documentRef = ref(storage, `formulation_document/${formulation_document?.name}`);
			const snapshot= await uploadBytes(formulation_document_documentRef,formulation_document);
			const file_url = await getDownloadURL(snapshot.ref);;
			cookies.set('formulation_document_url', file_url, { path: '/' });
			return file_url
		}
	}
    
    const fetch_file_urls=async()=>{
        if (data_sheet){
            let get_data_sheet_file_url = await data_sheet_file_upload_to_firebase_storage();
            console.log(get_data_sheet_file_url);
            set_data_sheet_url(get_data_sheet_file_url);
            files.data_sheet_url = get_data_sheet_file_url;
        }
        if (safety_data_sheet){
            let get_safety_data_sheet_file_url = await safety_data_sheet_file_upload_to_firebase_storage();
            console.log(get_safety_data_sheet_file_url);
            set_safety_data_sheet_url(get_safety_data_sheet_file_url)
            files.safety_data_sheet_url = get_safety_data_sheet_file_url;
        }
        if (formulation_document){
            let get_formulation_document_file_url = await formulation_document_file_upload_to_firebase_storage();
            console.log(get_formulation_document_file_url);
            set_formulation_document_url(get_formulation_document_file_url);
            files.formulation_document_url = get_formulation_document_file_url;
        }
        
    }

    const Handle_Upload_Documents=async()=>{
        /**
         * Handles the process of uploading the documents to the saved product in db.
         * It calls the handle_add_new_product() that awaits the id of the saved product.
         */
        set_is_submitting(true);
        
        if ((!data_sheet) && !safety_data_sheet && !formulation_document){
            toast({
                title: '',
                position: 'top-left',
                variant:"subtle",
                description: `You have not selected any files.`,
                status: 'info',
                isClosable: true,
            });
            set_is_submitting(false)
            return ;
        }
                
        let file_checker = File_Type_Checker()

        if (file_checker){
            set_is_submitting(false);
            return ;
        }
        if ((!data_sheet) || !safety_data_sheet || !formulation_document){
            /**
             * Checks the existence of all files and asks if the user wishes to upload only the uploaded documents
             * if so the files are uploaded and the product is edited
             * elsewise the user goes to edit the files.
             * 
            */
            let confirmation = prompt("Are you sure you want to upload only the files you have selected? Confirm by typing [ yes ] below.");
            if (confirmation === 'yes'){
                //Create product
                handle_add_new_product().then((res)=>{
                    console.log(res)
                    if (res.status === 200){
                        fetch_file_urls().then(()=>{
                            Update_Product_Details(res)
                        })
                    }else{
                        set_is_submitting(false)
                    }
                    // if (res.status !== 200){
                    //     alert(res.status);
                    // }
                }).catch((err)=>{
                    console.log(err);
                    set_is_submitting(false)
                })
            }else{
                set_is_submitting(false);
                return ;
            }
        }else{
            //Create product
            handle_add_new_product().then((res)=>{
                console.log(res)
                if (res.status === 200){
                    fetch_file_urls().then(()=>{
                        Update_Product_Details(res)
                    })
                }else{
                    set_is_submitting(false)
                }
            }).catch((err)=>{
                console.log(err);
                set_is_submitting(false)
            })
        }
    }

    const Update_Product_Details=async(res)=>{
        let payload = {
            data_sheet_url: files?.data_sheet_url,
			safety_data_sheet_url: files?.safety_data_sheet_url,
			formulation_document_url: files?.formulation_document_url,
            _id: res?._id,
            auth_role: res?.auth_role
        }
        //console.log(payload);
        if (res){
            await Edit_Product(payload).then(()=>{
                /**
                    sends a payload data to server to update the product.
                    payload (object): json obj containing information for the new product.
    
                    Return:
                        alerts user whether function runs successfully or not.
                    catch:
                        alerts user when function fails
                */
                    toast({
                        title: '',
                        position: 'top-left',
                        variant:"subtle",
                        description: `file(s) have been added successfully`,
                        status: 'success',
                        isClosable: true,
                    });
                    set_is_data_sheet_uploaded(true);
                    set_is_safety_data_sheet_uploaded(true);
                    set_is_formulation_document_uploaded(true);
                    setTimeout(()=>{
                        set_isfileupload(false);
                        Clean_input_data();
                    },2000);
                }).catch((err)=>{
                    console.log(err)
                    toast({
                        position: 'top-left',
                        variant:"subtle",
                        title: 'Error while uploading files',
                        description: 'your product has been been saved and files could be edited later from inventory',
                        status: 'error',
                        isClosable: true,
                    })
                }).finally(()=>{
                    set_is_submitting(false);
                })
        }

    }
    const File_Type_Checker=()=>{
        /**
         * File_Type_Checker: Checks if the uploaded files are of pdf format.
         * Returns:
         *      true if any files are not of the correct format
         *      false if the files are of the right format.
        */
       const check_data_sheet=()=>{
           if ((data_sheet.type !== 'application/pdf' && data_sheet)) {
                toast({
                    position: 'top-left',
                    variant:"subtle",
                    title: 'Data sheet file:wrong file type selected',
                    description: 'only pdf files are allowed',
                    status: 'info',
                    isClosable: true,
                });
                return true;       
            }else{
                return false;
            }
        }
       const check_safety_data_sheet=()=>{
            if ((safety_data_sheet.type !== 'application/pdf' && safety_data_sheet)){
                toast({
                    position: 'top-left',
                    variant:"subtle",
                    title: 'Safety Data sheet file:wrong file type selected',
                    description: 'only pdf files are allowed',
                    status: 'info',
                    isClosable: true,
                });
                return true;
            }else{
                return false;
            }
        }
        const check_formulation_document=()=>{
            if ((formulation_document.type !== 'application/pdf' && formulation_document)){
                toast({
                    position: 'top-left',
                    variant:"subtle",
                    title: 'Formulation document: wrong file type selected',
                    description: 'only pdf files are allowed',
                    status: 'info',
                    isClosable: true,
                });
                return true;
            }else{
                return false;
            }
        }
        let data_sheet_checker = check_data_sheet();
        let safety_data_sheet_checker = check_safety_data_sheet();
        let formulation_document_checker = check_formulation_document();
        if (data_sheet_checker || safety_data_sheet_checker || formulation_document_checker){
            return true;
        }else{
            return false;
        }
    }
    const Clean_input_data=()=>{
        //clear file urls
        set_data_sheet_url('');
        set_safety_data_sheet_url('');
        set_formulation_document_url('');
        //clear file data
        set_data_sheet('');
        set_safety_data_sheet('');
        set_formulation_document('');
        //clear file selection status
        set_is_data_sheet_uploaded(false);
        set_is_safety_data_sheet_uploaded(false);
        set_is_formulation_document_uploaded(false);
        //clear files obj
        files.data_sheet_url = '';
        files.safety_data_sheet_url = '';
        files.formulation_document_url = '';
    }
  return (
    <Box>
        {is_data_sheet_uploaded?
            <Uploaded_Card_Item name={data_sheet?.name}/>
            :
            <>
                {data_sheet?
                    <Box border='1px' borderColor='#eee' borderStyle='solid' p='2' borderRadius='md' >
                        <Text fontWeight={'bold'} mb='2'>Technical data sheet</Text>
                        <Divider/>
                        <Selected_Card_Item is_submitting={is_submitting} name={data_sheet?.name} file_type='data_sheet' set_data_sheet={set_data_sheet}/>
                    </Box>
                :
                    <FormControl mt='4'>
                        <FormLabel fontWeight={'bold'}>Technical data sheet</FormLabel>
                        <Input type='file' p='1' onChange={((e)=>{set_data_sheet(e.target.files[0])})}/>
                    </FormControl>
                }
            </>
        }
        {is_safety_data_sheet_uploaded?
            <Uploaded_Card_Item name={safety_data_sheet?.name}/>
            :
            <>
                {safety_data_sheet?
                    <Box border='1px' borderColor='#eee' borderStyle='solid' p='2' borderRadius='md' >
                        <Text fontWeight={'bold'} mb='2'>Safety data sheet</Text>
                        <Divider/>
                        <Selected_Card_Item is_submitting={is_submitting} name={safety_data_sheet?.name} file_type='safety_data_sheet' set_safety_data_sheet={set_safety_data_sheet}/>
                    </Box>
                :
                    <FormControl mt='4'>
                        <FormLabel fontWeight={'bold'}>Safety data sheet</FormLabel>
                        <Input type='file' p='1' onChange={((e)=>{set_safety_data_sheet(e.target.files[0])})}/>
                    </FormControl>
                }
            </>
        }
        {is_formulation_document_uploaded?
            <Uploaded_Card_Item name={formulation_document?.name}/>
            :
            <>
                {formulation_document?
                    <Box border='1px' borderColor='#eee' borderStyle='solid' p='2' borderRadius='md' >
                        <Text fontWeight={'bold'} mb='2'>Formulation document</Text>
                        <Divider/>
                        <Selected_Card_Item is_submitting={is_submitting} name={formulation_document?.name} file_type='formulation_document' set_formulation_document={set_formulation_document}/>
                    </Box>
                :
                    <FormControl mt='4'>
                        <FormLabel fontWeight={'bold'}>Formulation document</FormLabel>
                        <Input type='file' p='1' onChange={((e)=>{set_formulation_document(e.target.files[0])})}/>
                    </FormControl>
                }
            </>
        }
        <Box mt='2' align='end' gap='2'>
            <Tooltip hasArrow label='Go back to editing the product details'  placement='auto' >
                <Button leftIcon={<ArrowBack />} onClick={(()=>{set_isfileupload(false)})}>Edit product</Button>
            </Tooltip>
            {!data_sheet && !safety_data_sheet && !formulation_document ?
                <Tooltip hasArrow label='Create product and add files later.'  placement='auto'>
                    <Button ml={'2'} bg='#009393' color='#fff' onClick={Handle_Continue_Product_Upload}>Skip and save product</Button>
                </Tooltip>
                :
                <Tooltip hasArrow label='Finish and create product. This will save the files too.'  placement='auto'>
                    <Button ml={'2'} bg='#009393' color='#fff' onClick={Handle_Upload_Documents}>Finish creating </Button>
                </Tooltip>
            }
        </Box>
    </Box>
  )
}

export default Upload_documents;

const Uploaded_Card_Item=({name})=>{
	return(
		<HStack mt='2' justify='space-between' border='1px' borderColor='#eee' borderStyle='solid' p='2' borderRadius='md'>
            <Text>{name} {name? 'has been uploaded' : 'no document found:status saved'}</Text>
            <Done style={{color:"green"}}/>
        </HStack>
	)
}

const Selected_Card_Item=({name,file_type,set_data_sheet,set_formulation_document,set_safety_data_sheet,is_submitting})=>{
    const handle_remove_file=()=>{
        switch(file_type) {
            case "data_sheet":
                set_data_sheet('')
              break;
            case "safety_data_sheet":
                set_safety_data_sheet('')
              break;
            case "formulation_document":
                set_formulation_document('')
              break;
            default:
              return ;
          }
    }
	return(
		<HStack justify='space-between'>
            <HStack>
                <Description style={{color:"orange"}}/>
                <Text w='100%' >{name}</Text>
            </HStack>
            <Tooltip label={`Remove ${file_type}`} placement='auto'>
                <IconButton aria-label='Remove File' icon={<Close />} onClick={handle_remove_file}/>
            </Tooltip>
        </HStack>
	)
}
