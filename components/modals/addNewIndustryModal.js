//modules imports
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    Text,
    Flex,
    Center,
    Textarea,
    Input,
    Select,
    InputGroup,Heading,
    Stack,
    useToast, Checkbox, CheckboxGroup
  } from '@chakra-ui/react';
import { useEffect,useState } from 'react';
//api-calls
import Add_Industry from '../../pages/api/controls/add_new_industry.js';
import {storage} from '../firebase';
import {ref,uploadBytes,getDownloadURL} from 'firebase/storage';
import Cookies from 'universal-cookie';
import DoneIcon from '@mui/icons-material/Done';

function AddnewIndustry({isaddindustryModalvisible,setisaddindustryModalvisible,auth_role}){
    const cookies = new Cookies();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const HandleModalOpen=()=>{
      if(isaddindustryModalvisible !== true){
      }else{
        onOpen();
        setisaddindustryModalvisible(false)
      }
    }

    useEffect(()=>{
      HandleModalOpen();
    },[isaddindustryModalvisible])

    const [title,set_title]=useState('')
    const [description,set_description]=useState('')
    const [image,set_image]=useState('')
    const [image_url,set_image_url]=useState('')
    const [image_uploaded,set_image_uploaded]=useState(false);
    const [is_submitting,set_is_submitting]=useState(false);
    const [is_retry,set_is_retry]=useState(false);
    const [pasted_image_link,set_pasted_image_link]=useState('')

    const payload = {
      title:              title,
      description:        description,
      cover_image:        image_url,
      auth_role
    }

    const image_file_upload_to_firebase_storage=async()=>{
      if (image?.name == undefined){
          toast({
              position: 'top-left',
              variant:"subtle",
              title: '',
              description: 'could not find image file, try re-uploading it.',
              status: 'error',
              isClosable: true,
          })
        return ;
      }else{
        const image_documentRef = ref(storage, `industry_images/${image?.name}`);
        const snapshot= await uploadBytes(image_documentRef,image)
        const file_url = await getDownloadURL(snapshot.ref)
        cookies.set('ind_image_url', file_url, { path: '/' });
        return file_url;
      }
    }

    const Upload_File=async()=>{
      set_is_submitting(true);
      await image_file_upload_to_firebase_storage().then(()=>{
        handle_add_new_Industry()
      })
    }

    const handle_add_new_Industry=()=>{
      if (payload.cover_image == ''){
        set_image_url(cookies.get("ind_image_url"))
        set_is_retry(true)
      }else{
        Add_Industry(payload).then((response)=>{
            return toast({
                title: '',
                description: `Successfully added ${payload.title} to industries`,
                status: 'success',
                isClosable: true,
              });
          }).then(()=>{
            cookies.remove('ind_image_url', { path: '/' });
          }).catch((err)=>{
            console.log(err)
            toast({
                title: 'Error while adding a new Industry',
                description: err.response.data,
                status: 'error',
                isClosable: true,
              })
          })
        set_is_retry(false)
        set_is_submitting(false);
        set_image_uploaded(false);
        onClose()
      }
    }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text>Add new Industry</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <Flex direction='column'>
                <Text>Industry</Text>
                <Input type='text' placeholder='Industry' variant='filled' onChange={((e)=>{set_title(e.target.value)})}/>
              </Flex>
              <Flex direction='column'>
                <Text>Description</Text>
                <Textarea type='text' placeholder='describe the industry' variant='filled' onChange={((e)=>{set_description(e.target.value)})}/>
              </Flex>
              {image_uploaded?
                <Uploaded name={image.name}/>
              :
                <Flex direction='column'>
                  <Text>Industry_image_cover</Text>
                  <Input type='file' accept='.jpeg,.jpg,.png' placeholder='Industry_image_cover' variant='filled' onChange={((e)=>{set_image(e.target.files[0])})}/>
                </Flex>
              }
              {is_retry?
                <Button bg='#000' borderRadius='0' color='#fff' onClick={handle_add_new_Industry}>Finish Uploading</Button>
              :
                <Button bg='#009393' borderRadius='0' color='#fff' onClick={Upload_File} disabled={is_submitting?true:false}>Upload Industry details</Button>
              }
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}   

export default AddnewIndustry;

const Uploaded=({name})=>{
  return(
    <Flex boxShadow='lg' borderRadius='5' p='2' borderRight='2px solid green'>
      <Text w='100%' >{name} uploaded</Text>
      <DoneIcon style={{color:"green"}}/>
    </Flex>
  )
}