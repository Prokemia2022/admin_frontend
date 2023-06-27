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
import Add_Technology from '../../pages/api/controls/add_new_technology.js';
import {storage} from '../firebase';
import {ref,uploadBytes,getDownloadURL} from 'firebase/storage';
import Cookies from 'universal-cookie';
import DoneIcon from '@mui/icons-material/Done';

function AddnewTechnology({isaddtechnologyModalvisible,setisaddtechnologyModalvisible,auth_role}){
    const cookies = new Cookies();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const HandleModalOpen=()=>{
      if(isaddtechnologyModalvisible !== true){
      }else{
        onOpen();
        setisaddtechnologyModalvisible(false)
      }
    }

    useEffect(()=>{
      HandleModalOpen();
    },[isaddtechnologyModalvisible])

    const [title,set_title]=useState('')
    const [description,set_description]=useState('')
    const [image,set_image]=useState('')
    const [image_url,set_image_url]=useState('')
    const [image_uploaded,set_image_uploaded]=useState(false);
    const [is_submitting,set_is_submitting]=useState(false);
    const [is_retry,set_is_retry]=useState(false);

    const payload = {
      title:              title,
      description:        description,
      cover_image:        image_url,
      auth_role
    }

    const handle_image_upload=async()=>{
      if (image.name == undefined){
        return toast({
          title: '',
          description: `could not process image, try again.`,
          status: 'info',
          isClosable: true,
        });
      }else{
        console.log(image.name)
        const image_documentRef = ref(storage, `technology_images/${image?.name}`);
        const snapshot= await uploadBytes(image_documentRef,image)
        set_image_uploaded(true)
        const file_url = await getDownloadURL(snapshot.ref)
        cookies.set('tech_image_url', file_url, { path: '/' });
        set_image_url(file_url)
        return file_url
      }
    }

    const Upload_File=async()=>{
      set_is_submitting(true)
      await handle_image_upload().then(()=>{
        handle_add_new_Technology()
      })
    }

    const handle_add_new_Technology=()=>{
      if (payload.cover_image == ''){
        set_image_url(cookies.get("tech_image_url"))
        set_is_retry(true)
      }else{
        Add_Technology(payload).then((response)=>{
              return toast({
                title: '',
                description: `Successfully added ${payload.title} to technologies`,
                status: 'success',
                isClosable: true,
              });
          }).catch((err)=>{
            console.log(err)
            toast({
                title: 'Error while adding a new Technology',
                description: err.response.data,
                status: 'error',
                isClosable: true,
              })
          })
        set_is_retry(false)
        set_is_submitting(false)
        onClose()
      }
    }

    return (
      <>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <Text>Add new Technology</Text>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing={4}>
                <Flex direction='column'>
                  <Text>Technology</Text>
                  <Input type='text' placeholder='Technology title' variant='filled' onChange={((e)=>{set_title(e.target.value)})}/>
                </Flex>
                <Flex direction='column'>
                  <Text>Description</Text>
                  <Textarea type='text' placeholder='describe the technology' variant='filled' onChange={((e)=>{set_description(e.target.value)})}/>
                </Flex>
                {image_uploaded?
                  <Uploaded name={image.name}/>
                :
                  <Flex direction='column'>
                    <Text>Technology_image_cover</Text>
                    <Input type='file' accept='.jpeg,.jpg,.png' placeholder='Technology_image_cover' variant='filled' onChange={((e)=>{set_image(e.target.files[0])})}/>
                  </Flex>
                }
                {is_retry?
                  <Button bg='#000' borderRadius='0' color='#fff' onClick={handle_add_new_Technology}>Finish Uploading</Button>
                :
                  <Button bg='#009393' borderRadius='0' color='#fff' onClick={Upload_File} disabled={is_submitting?true:false}>Upload Technology details</Button>
                }
            </Stack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    )
}   

export default AddnewTechnology;

const Uploaded=({name})=>{
  return(
    <Flex boxShadow='lg' borderRadius='5' p='2' borderRight='2px solid green'>
      <Text w='100%' >{name} uploaded</Text>
      <DoneIcon style={{color:"green"}}/>
    </Flex>
  )
}