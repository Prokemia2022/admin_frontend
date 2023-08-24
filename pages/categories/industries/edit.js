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
    Image,
} from '@chakra-ui/react';
//api
import Edit_Industry from '../../../pages/api/controls/edit_industry';
//utils
import Cookies from 'universal-cookie';
import {storage} from '../../../components/firebase.js';
import {ref,uploadBytes,getDownloadURL} from 'firebase/storage';
//icons
import DoneIcon from '@mui/icons-material/Done';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

function Edit_Industry_Form({Edit_industry_integrations,auth_role,item,set_is_refresh_data}){
    const toast = useToast();
    const cookies = new Cookies();

    const [title,set_title]=useState(item?.title);
    const [description,set_description]=useState(item?.description);
    const [publish_status, set_publish_status]=useState(item?.publish_status);
    const [publish_status_info, set_publish_status_info]=useState(false);

    const [image,set_image]=useState('')
    const [image_url,set_image_url]=useState(item?.cover_image)
    const [image_uploaded,set_image_uploaded]=useState(false);
    const [is_submitting,set_is_submitting]=useState(false);
    const [is_retry,set_is_retry]=useState(false);

    const payload = {
      _id: item?._id,
      title:                title,
      description:          description,
      cover_image:          image_url,
      verification_status:  publish_status,
      publish_status:       publish_status,
      auth_role
    }

    const handle_image_upload=async()=>{
        if (image.name == undefined){
          return alert('could not process image, try again.')
        }else{
          console.log(image.name)
          const image_documentRef = ref(storage, `industry_images/${image?.name}`);
          const snapshot= await uploadBytes(image_documentRef,image)
          set_image_uploaded(true)
          const file_url = await getDownloadURL(snapshot.ref)
          cookies.set('ind_image_url', file_url, { path: '/' });
          set_image_url(file_url)
          return file_url
        }
      }
  
      //edit to new changes
      const handle_edit_Industry=async()=>{
          set_is_submitting(true)
          //check if inputs changed; if so exit function
          if (title == item?.title && description == item?.description && image == '' && publish_status == item?.publish_status){
              alert("No changes have been made to update industry.")
              set_is_submitting(false)
              return;
          }
          //check if image has been selected: 
          //image shows that the image file status has changed 
          // image_url stores the return url
          if (image !== ''){
              //if image file input status has changed then upload the file first then edit the industry
              await handle_image_upload().then((res)=>{
                  console.log(res)
                  if (res){
                      //checks if the url has been updated to the payload
                      const payload = {
                          _id: item?._id,
                          title: title,
                          description: description,
                          cover_image: res,
                          auth_role
                      }
                      //Edit the technology
                      Edit_Industry(payload).then(()=>{
                          toast({
                            title: '',
                            description: `${payload.title} has been edited successfuly`,
                            status: 'success',
                            isClosable: true,
                          });
                      })
                      Edit_industry_integrations?.onClose()
                      set_is_refresh_data(true)
                      return ;
                  }else{
                      //fetches the url from cookies and reassigns the url to the image url
                      set_image_url(cookies.get("ind_image_url"))
                      set_is_retry(true)// this initiates the step to allow re-upload
                      return ;
                  }                
              })
          }else{
              //if the image status has not changed then proceed to edit the technology
              await Edit_Industry(payload).then(()=>{
                  set_is_submitting(false)
                  Edit_industry_integrations?.onClose()
                  set_is_refresh_data(true)
                  return toast({
                    title: '',
                    description: `${payload.title} has been edited successfuly`,
                    status: 'success',
                    isClosable: true,
                  });
              }).catch((err)=>{
                  toast({
                    title: 'Error while editing an industry',
                    description: err.response?.data,
                    status: 'error',
                    isClosable: true,
                  });
              })
              return ;
          }
          Edit_industry_integrations?.onClose()
      }
    //input error handlers
    const [input_error,set_input_error]=useState(false);
	return(
        <Drawer
            isOpen={Edit_industry_integrations?.isOpen}
            placement='right'
            onClose={Edit_industry_integrations?.onClose}
            size={{
                base:'full',
                md:'md'
            }}
        >
            <DrawerOverlay />
            <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Edit Industry</DrawerHeader>
            <DrawerBody>
                <Image src={item?.cover_image} borderRadius='md' w='full' h='80' objectFit='cover' alt='industry_cover_image' fallbackSrc='../Pro.png'/>
                <FormControl mt='2' isRequired isInvalid={input_error && title == '' ? true : false}>
                    <FormLabel>Name of the industry</FormLabel>
                    <Input placeholder={title} type='text' onChange={((e)=>{set_title(e.target.value)})}/>
                    {input_error && title == '' ? 
                        <FormErrorMessage>Name of the industry is required.</FormErrorMessage>
                    : (
                        null
                    )}
                </FormControl>
                <FormControl mt='2' isRequired isInvalid={input_error && description == '' ? true : false}>
                    <FormLabel>Description of the industry</FormLabel>
                    <Textarea placeholder={description} type='text' onChange={((e)=>{set_description(e.target.value)})}/>
                    {input_error && description == '' ?  
                        <FormErrorMessage>Description of the industry is required.</FormErrorMessage>
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
                            Toggling this button will directly publish the industry to production without review.
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
                <Button variant='outline' mr={3} onClick={Edit_industry_integrations?.onClose}>
                Cancel
                </Button>
                {is_retry?
                    <Button bg='gray.500' onClick={handle_edit_Industry}>Finish Uploading</Button>
                    :
                    <Button colorScheme='teal' onClick={handle_edit_Industry}>Save</Button>
                }
            </DrawerFooter>
            </DrawerContent>
        </Drawer>
	)
}

export default Edit_Industry_Form;

const Uploaded_Card_Item=({name})=>{
	return(
		<HStack mt='2' justify='space-between' border='1px' borderColor='#eee' borderStyle='solid' p='2' borderRadius='md'>
            <Text>{name} {name? 'has been uploaded' : 'no document found:status saved'}</Text>
            <DoneIcon style={{color:"green"}}/>
        </HStack>
	)
}