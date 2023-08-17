import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    useToast,
    Drawer,
    DrawerOverlay,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    Button,
    Textarea,
    HStack,
    IconButton,
    Tooltip,
    Text,
} from '@chakra-ui/react';
//api
import Edit_Vacancy from '../../../pages/api/careers/edit_vacancy';
//utils
import Cookies from 'universal-cookie';
import moment from "moment";
//icons
import EditNoteIcon from '@mui/icons-material/EditNote';


function Edit_Career_Form({Edit_career_integrations,auth_role,item,set_is_refresh_data}){
    const toast = useToast();
    const cookies = new Cookies();

    const [title,set_title]=useState(item?.title)
    const [description,set_description]=useState(item?.description)
    const [requirements,set_requirements]=useState(item?.requirements)
    const [link,setlink]=useState(item?.link)
    const [company,setcompany]=useState(item?.company)
    const [status,setstatus]=useState(item?.status)
    const [valid_till,setvalid_till]=useState(item?.valid_till);

    const [edit_data,set_edit_data]=useState(false);

    const payload = {
      _id: item?._id,
      title,
      description,
      requirements,
      link,
      company,
      status,
      valid_till,
      auth_role
    }

    const Handle_edit_vacancy=async()=>{        
        if (!title || !description || !requirements || !link || !company || !status || !valid_till){
            set_input_error(true);
            return toast({
                title: '',
                position: 'top-left',
                variant:"subtle",
                description: `Ensure required inputs are filled`,
                status: 'info',
                isClosable: true,
            });
        }
        await Edit_Vacancy(payload).then((response)=>{
            Edit_career_integrations.onClose()
          if (response.status === 200){
            return toast({
                      title: '',
                      description: 'Successfully edited this vacancy',
                      status: 'success',
                      isClosable: true,
                    });
          }
          else{
            return toast({
                            title: 'Error while editing vacancy.',
                            description: response.data,
                            status: 'error',
                            isClosable: true,
                          })
          }
  
        })
      }
    //input error handlers
    const [input_error,set_input_error]=useState(false);
	return(
        <Drawer
            isOpen={Edit_career_integrations.isOpen}
            placement='right'
            onClose={Edit_career_integrations.onClose}
            size={{
                base:'full',
                md:'md'
            }}
        >
            <DrawerOverlay />
            <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Edit Career</DrawerHeader>
            <DrawerBody>
                <FormControl mt='2' isRequired isInvalid={input_error && title == '' ? true : false}>
                    <FormLabel>Title of the career</FormLabel>
                    <Input placeholder={title} type='text' onChange={((e)=>{set_title(e.target.value)})}/>
                    {input_error && title == '' ? 
                        <FormErrorMessage>Title of the career is required.</FormErrorMessage>
                    : (
                        null
                    )}
                </FormControl>
                <FormControl mt='2' isRequired isInvalid={input_error && company == '' ? true : false}>
                    <FormLabel>Name of the company</FormLabel>
                    <Input placeholder='Name of the company' value={company} type='text' onChange={((e)=>{setcompany(e.target.value)})}/>
                    {input_error && company == '' ? 
                        <FormErrorMessage>Name of the company is required.</FormErrorMessage>
                    : (
                        null
                    )}
                </FormControl>
                <FormControl mt='2' isRequired isInvalid={input_error && description == '' ? true : false}>
                    <FormLabel>Description of the career</FormLabel>
                    <Textarea placeholder={description} type='text' onChange={((e)=>{set_description(e.target.value)})}/>
                    {input_error && description == '' ?  
                        <FormErrorMessage>Description of the career is required.</FormErrorMessage>
                    : (
                        null
                    )}
                </FormControl>
                <FormControl mt='2' isRequired isInvalid={input_error && description == '' ? true : false}>
                    <FormLabel>Requirements of the career</FormLabel>
                    <Textarea placeholder={requirements} type='text' onChange={((e)=>{set_requirements(e.target.value)})}/>
                    {input_error && description == '' ?  
                        <FormErrorMessage>Requirements of the career is required.</FormErrorMessage>
                    : (
                        null
                    )}
                </FormControl>
                <FormControl mt='2'>
                    <FormLabel>Link to company</FormLabel>
                    <Input placeholder={link} type='text' onChange={((e)=>{setlink(e.target.value)})}/>
                </FormControl>
                <FormControl mt='2'>
                    <FormLabel>Status of the career</FormLabel>
                    <Textarea placeholder={status} type='text' onChange={((e)=>{setstatus(e.target.value)})}/>
                </FormControl>
                <FormControl mt='2'>
                    <FormLabel>Career listing is valid till</FormLabel>
                    <HStack>
                        <Tooltip label='Click to edit date' placement="auto">
                            <IconButton aria-label='Edit date' icon={<EditNoteIcon />} onClick={(()=>{set_edit_data(true)})}/>
                        </Tooltip>
                        <Text>{moment(item?.valid_till).format("MMM Do YY")}</Text>
                    </HStack>
                    {edit_data?
                        <Input type={'date'} value={valid_till} placeholder={moment(item?.valid_till).format("MMM Do YY")} onChange={((e)=>{setvalid_till(e.target.value)})}/>
                        :
                        null
                    }
                </FormControl>
            </DrawerBody>
            <DrawerFooter>
                <Button variant='outline' mr={3} onClick={Edit_career_integrations.onClose}>
                    Cancel
                </Button>
                <Button colorScheme='teal' onClick={Handle_edit_vacancy}>Save</Button>
            </DrawerFooter>
            </DrawerContent>
        </Drawer>
	)
}

export default Edit_Career_Form;