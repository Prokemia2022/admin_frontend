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
import {Done,DriveFileRenameOutline,ArrowBack,Close,InsertDriveFile,PostAdd,Description} from '@mui/icons-material';
//api
import Edit_Product from '../../../api/Products/edit_product.js'
//utils
import Cookies from 'universal-cookie';
import {storage} from '../../../../components/firebase.js';
import {ref,uploadBytes,getDownloadURL} from 'firebase/storage';
import { useRouter } from 'next/router.js';

function Edit_documents({set_iseditfiles,product_data,auth_role}) {
    /**
     * Edit_documents: Handles the upload and update of files.
     * Files: data sheet, safety data sheet, formulation document
     * Props:
     *      set_iseditfiles (Boolean): handles the state of visibility of file upload.
     * 
     */
    //utils
    const toast = useToast();
    const cookies = new Cookies();
    const router = useRouter();

    //Existing file
	const [is_data_sheet_existing,set_is_data_sheet_existing]=useState(product_data?.data_sheet);
    const [is_safety_data_sheet_existing,set_is_safety_data_sheet_existing]=useState(product_data?.safety_data_sheet);
    const [is_formulation_document_existing,set_is_formulation_document_existing]=useState(product_data?.formulation_document);

	//Change file
	const [is_change_data_sheet,set_is_change_data_sheet]=useState(false);
    const [is_change_safety_data_sheet,set_is_change_safety_data_sheet]=useState(false);
    const [is_change_formulation_document,set_is_change_formulation_document]=useState(false);

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

	//loading Status
	const [is_submitting,set_is_submitting]=useState(false);

	const files ={
        data_sheet_url,
        safety_data_sheet_url,
        formulation_document_url
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
	// handles uploaded urls
	const fetch_file_urls=async()=>{
        if (data_sheet){
            let get_data_sheet_file_url = await data_sheet_file_upload_to_firebase_storage();
            console.log(get_data_sheet_file_url);
            set_data_sheet_url(get_data_sheet_file_url);
            files.data_sheet_url = get_data_sheet_file_url;
        }else{
			files.data_sheet_url = product_data?.data_sheet;
		}
        if (safety_data_sheet){
            let get_safety_data_sheet_file_url = await safety_data_sheet_file_upload_to_firebase_storage();
            console.log(get_safety_data_sheet_file_url);
            set_safety_data_sheet_url(get_safety_data_sheet_file_url)
            files.safety_data_sheet_url = get_safety_data_sheet_file_url;
        }else{
			files.safety_data_sheet_url = product_data?.safety_data_sheet;
		}
        if (formulation_document){
            let get_formulation_document_file_url = await formulation_document_file_upload_to_firebase_storage();
            console.log(get_formulation_document_file_url);
            set_formulation_document_url(get_formulation_document_file_url);
            files.formulation_document_url = get_formulation_document_file_url;
        }else{
			files.formulation_document_url = product_data?.formulation_document;
		}
        
    }
	const Handle_Upload_Documents=async()=>{
        /**
         * Handles the process of uploading the documents to the product in db.
         * Control the uploading of individual files.
         */
        set_is_submitting(true);
                        
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
            let confirmation = prompt("Are you sure you want to edit only the files you have changed? Confirm by typing [ yes ] below.");
            if (confirmation === 'yes'){
                //Edit product
				fetch_file_urls().then(()=>{
					Update_Product_Details()
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
            fetch_file_urls().then(()=>{
				Update_Product_Details()
			}).catch((err)=>{
				console.log(err);
				set_is_submitting(false)
			})
        }
    }
	const Update_Product_Details=async()=>{
        let payload = {
            data_sheet_url: files?.data_sheet_url,
			safety_data_sheet_url: files?.safety_data_sheet_url,
			formulation_document_url: files?.formulation_document_url,
            _id: product_data?._id,
            auth_role: auth_role
        }
        console.log(payload);
        await Edit_Product(payload).then(()=>{
			/**
				sends a payload data to server to update the product.
				payload (object): json obj containing information for the product.

				Return:
					alerts user whether function runs successfully or not.
				catch:
					alerts user when function fails
			*/
				toast({
					title: '',
					position: 'top-left',
					variant:"subtle",
					description: `file(s) have been edited successfully`,
					status: 'success',
					isClosable: true,
				});
				set_is_data_sheet_uploaded(true);
				set_is_safety_data_sheet_uploaded(true);
				set_is_formulation_document_uploaded(true);
				setTimeout(()=>{
					set_iseditfiles(false);
					router.back()
					Clean_input_data();
				},2000);
			}).catch((err)=>{
				console.log(err)
				toast({
					position: 'top-left',
					variant:"subtle",
					title: 'Error while uploading files',
					description: 'your files could not be edited, contact support',
					status: 'error',
					isClosable: true,
				})
			}).finally(()=>{
				set_is_submitting(false);
			})
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
		//clear file is changing status
        set_is_change_data_sheet(false);
        set_is_change_safety_data_sheet(false);
        set_is_change_formulation_document(false);
		//clear file existing status
        set_is_data_sheet_existing(false);
        set_is_safety_data_sheet_existing(false);
        set_is_formulation_document_existing(false);
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
                {is_change_data_sheet?
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
                    :
                    <>
                        {is_data_sheet_existing === ''?
                            <HStack mt='2'>
                                <Text bg='#eee' p='2' borderRadius='5' flex='1'>No Technical Data sheet has been uploaded</Text>
                                <Tooltip label={'Add document'} placement='auto'>
                                    <IconButton aria-label='Change File' icon={<PostAdd />} onClick={(()=>{set_is_change_data_sheet(true)})}/>
                                </Tooltip>
                            </HStack>
                        :
                            <Existing_files_Card_Item name='Data sheet document' link={product_data?.data_sheet} set_is_change_data_sheet={set_is_change_data_sheet} />
                        }
                        
                    </>
                }
            </>
        }
        {is_safety_data_sheet_uploaded?
            <Uploaded_Card_Item name={safety_data_sheet?.name}/>
            :
            <>
                {is_change_safety_data_sheet?
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
                    :
                    <>
                        {is_safety_data_sheet_existing === ''?
                            <HStack mt='2'>
                                <Text bg='#eee' p='2' borderRadius='5' flex='1'>No Safety Data sheet has been uploaded</Text>
                                <Tooltip label={'Add document'} placement='auto'>
                                    <IconButton aria-label='Change File' icon={<PostAdd />} onClick={(()=>{set_is_change_safety_data_sheet(true)})}/>
                                </Tooltip>
                            </HStack>
                        :
                        <Existing_files_Card_Item name='Safety Data sheet document' link={product_data?.safety_data_sheet} set_is_change_safety_data_sheet={set_is_change_safety_data_sheet} />
                        }
                        
                    </>
                }
            </>
        }
        {is_formulation_document_uploaded?
            <Uploaded_Card_Item name={formulation_document?.name}/>
            :
            <>
                {is_change_formulation_document?
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
                    :
                    <>
                        {is_formulation_document_existing === ''?
                            <HStack mt='2'>
                                <Text bg='#eee' p='2' borderRadius='5' flex='1'>No formulation document file has been uploaded</Text>
                                <Tooltip label={'Add document'} placement='auto'>
                                    <IconButton aria-label='Change File' icon={<PostAdd />} onClick={(()=>{set_is_change_formulation_document(true)})}/>
                                </Tooltip>
                            </HStack>
                        :
                            <Existing_files_Card_Item name='Formulation document' link={product_data?.formulation_document} set_is_change_formulation_document={set_is_change_formulation_document} />
                        }
                        
                    </>
                }
            </>
            
        }
        <Box mt='2' align='end' gap='2'>
            <Tooltip hasArrow label='Go back to editing the product details'  placement='auto' >
                <Button leftIcon={<ArrowBack />} onClick={(()=>{set_iseditfiles(false)})}>Edit product</Button>
            </Tooltip>
            <Tooltip hasArrow label='Finish and create product. This will save the files too.'  placement='auto'>
                <Button ml={'2'} bg='#009393' color='#fff' onClick={Handle_Upload_Documents}>Save Files </Button>
            </Tooltip>
        </Box>
    </Box>
  )
}

export default Edit_documents;

const Uploaded_Card_Item=({name})=>{
	return(
		<HStack mt='2' justify='space-between' border='1px' borderColor='#eee' borderStyle='solid' p='2' borderRadius='md'>
            <Text>{name} {name? 'has been uploaded' : 'no document found:status saved'}</Text>
            <Done style={{color:"green"}}/>
        </HStack>
	)
}

const Existing_files_Card_Item=({name,set_is_change_data_sheet,set_is_change_safety_data_sheet,set_is_change_formulation_document})=>{
    const handle_file_change=()=>{
		switch(name) {
            case "Data sheet document":
                set_is_change_data_sheet(true);
              break;
            case "Safety Data sheet document":
                set_is_change_safety_data_sheet(true);
              break;
            case "Formulation document":
                set_is_change_formulation_document(true);
              break;
            default:
              return ;
          }
	}
	return(
		<HStack justify='space-between' mt='2' border='1px' borderColor='gray.200' p='2' borderRadius='md'>
            <HStack>
                <InsertDriveFile style={{color:"orange"}}/>
                <Text w='100%' >{name}</Text>
            </HStack>
            <HStack>
                <Tooltip label={`Change ${name}`} placement='auto'>
                    <IconButton aria-label='Change File' icon={<DriveFileRenameOutline />} onClick={handle_file_change}/>
                </Tooltip>
            </HStack>
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