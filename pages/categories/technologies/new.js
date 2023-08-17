import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
    Text, 
    Box,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    HStack,
    Divider,
    useToast,
    Drawer,
    DrawerOverlay,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    Button,
    Editable,
    EditableInput,
    EditableTextarea,
    EditablePreview,
    Textarea,
    Switch,
    Popover,
    PopoverTrigger,
    Portal,
    PopoverContent,
    PopoverArrow,
    PopoverHeader,
    PopoverCloseButton,
    PopoverBody,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
} from '@chakra-ui/react';
//api
import Add_Technology from '../../../pages/api/controls/add_new_technology.js';
//utils
import Cookies from 'universal-cookie';
import {storage} from '../../../components/firebase.js';
import {ref,uploadBytes,getDownloadURL} from 'firebase/storage';
//icons
import DoneIcon from '@mui/icons-material/Done';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

function New_Technology_Form({Add_technology_integrations,auth_role,set_is_refresh_data}){
    const toast = useToast();
    const cookies = new Cookies();

    const [title,set_title]=useState('');
    const [description,set_description]=useState('');
    const [publish_status, set_publish_status]=useState(false);
    const [publish_status_info, set_publish_status_info]=useState(false);

    const [image,set_image]=useState('')
    const [image_url,set_image_url]=useState('')
    const [image_uploaded,set_image_uploaded]=useState(false);
    const [is_submitting,set_is_submitting]=useState(false);
    const [is_retry,set_is_retry]=useState(false);

    const payload = {
      title:                title,
      description:          description,
      cover_image:          image_url,
      verification_status:  publish_status,
      publish_status:       publish_status,
      auth_role
    }

    const handle_image_upload=async()=>{
      if (image.name == undefined){
        return toast({
          title: '',
          description: `could not process image, try again.`,
          status: 'info',
          isClosable: true,
          variant:'left-accent',
          position:'top-left'
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
        if (!title || !description){
            set_input_error(true);
            return toast({
                title: '',
                position: 'top-left',
                variant:"subtle",
                description: `Ensure required inputs are filled`,
                status: 'info',
                variant:'left-accent',
                position:'top-left'
            });
        }
        if (payload.cover_image == ''){
          set_image_url(cookies.get("tech_image_url"))
          set_is_retry(true)
        }else{
          Add_Technology(payload).then((response)=>{
            ClearInputs()
              set_is_refresh_data('added new technology');
              return toast({
                  title: '',
                  description: `Successfully added ${payload.title} to technologies`,
                  status: 'success',
                  isClosable: true,
                  variant:'left-accent',
                  position:'top-left'
                });
                
            }).then(()=>{
              cookies.remove('tech_image_url', { path: '/' });
            }).catch((err)=>{
              console.log(err)
              toast({
                  title: 'Error while adding a new Technology',
                  description: err.response.data,
                  status: 'error',
                  isClosable: true,
                  variant:'left-accent',
                  position:'top-left'
                })
            })
          set_is_retry(false)
          set_is_submitting(false);
          set_image_uploaded(false);
          Add_technology_integrations?.onClose()
        }
      }
    const ClearInputs=()=>{
        set_title('');
        set_description('');
        set_image('');
        set_publish_status(false)
        set_publish_status_info(false)
    }
    //input error handlers
    const [input_error,set_input_error]=useState(false);
	return(
        <Drawer
            isOpen={Add_technology_integrations?.isOpen}
            placement='right'
            onClose={Add_technology_integrations?.onClose}
            size={{
                base:'full',
                md:'md'
            }}
        >
            <DrawerOverlay />
            <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Create a new Technology</DrawerHeader>
            <DrawerBody>
                <FormControl mt='2' isRequired isInvalid={input_error && title == '' ? true : false}>
                    <FormLabel>Name of the technology</FormLabel>
                    <Input value={title} placeholder="Name of the technology is required." type='text' onChange={((e)=>{set_title(e.target.value)})}/>
                    {input_error && title == '' ? 
                        <FormErrorMessage>Name of the technology is required.</FormErrorMessage>
                    : (
                        null
                    )}
                </FormControl>
                <FormControl mt='2' isRequired isInvalid={input_error && description == '' ? true : false}>
                    <FormLabel>Description of the technology</FormLabel>
                    <Textarea value={description} placeholder="Description of the technology is required." type='text' onChange={((e)=>{set_description(e.target.value)})}/>
                    {input_error && description == '' ?  
                        <FormErrorMessage>Description of the technology is required.</FormErrorMessage>
                    : (
                        null
                    )}
                </FormControl>
                {image_uploaded?
                    <Uploaded_Card_Item name={image.name}/>
                  :
                  <FormControl mt='4'>
                    <FormLabel fontWeight={'bold'}>Cover Image</FormLabel>
                    <Input type='file' p='1' accept='.jpeg,.jpg,.png' onChange={((e)=>{set_image(e.target.files[0])})}/>
                </FormControl>
                }
                {publish_status_info?
                    <Alert status='info' mt='2'>
                        <AlertIcon />
                        <AlertTitle>Publish Status!</AlertTitle>
                        <AlertDescription>
                            Toggling this button will directly publish the technology to product without review.
                        </AlertDescription>
                    </Alert>
                    :
                    null
                }
                <FormControl display='flex' alignItems='center' mt='4' gap='2'>
                    <InfoOutlinedIcon style={{cursor:'pointer'}} onClick={(()=>{set_publish_status_info(!publish_status_info)})}/>
                    <FormLabel htmlFor='email-alerts' mb='0'>
                        Publish
                    </FormLabel>
                    <Switch id='email-alerts' isChecked={publish_status} onChange={(()=>{set_publish_status(!publish_status)})}/>
                </FormControl>
            </DrawerBody>
            <DrawerFooter>
                <Button variant='outline' mr={3} onClick={Add_technology_integrations?.onClose}>
                Cancel
                </Button>
                {is_retry?
                    <Button bg='gray.500' onClick={handle_add_new_Technology}>Finish Uploading</Button>
                    :
                    <Button colorScheme='teal' onClick={Upload_File}>Save</Button>
                }
            </DrawerFooter>
            </DrawerContent>
        </Drawer>
	)
}

export default New_Technology_Form;

const Uploaded_Card_Item=({name})=>{
	return(
		<HStack mt='2' justify='space-between' border='1px' borderColor='#eee' borderStyle='solid' p='2' borderRadius='md'>
            <Text>{name} {name? 'has been uploaded' : 'no document found:status saved'}</Text>
            <DoneIcon style={{color:"green"}}/>
        </HStack>
	)
}