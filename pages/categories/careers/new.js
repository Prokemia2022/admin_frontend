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
    Textarea
} from '@chakra-ui/react';
//api
import Add_vacancy from '../../../pages/api/careers/add_vacancy';


function New_Career_Form({Add_careers_integrations,auth_role,set_is_refresh_data}){
    const toast = useToast();

    const [title,set_title]=useState('')
    const [description,set_description]=useState('')
    const [requirements,set_requirements]=useState('')
    const [link,setlink]=useState('')
    const [company,setcompany]=useState('')
    const [status,setstatus]=useState('')
    const [valid_till,setvalid_till]=useState('');

    const payload = {
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
        if (!title || !description || !requirements || !company || !status || !valid_till){
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
        await Add_vacancy(payload).then((response)=>{
            
          if (response.status === 200){
            set_is_refresh_data('new career added')
            Add_careers_integrations.onClose()
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
            isOpen={Add_careers_integrations.isOpen}
            placement='right'
            onClose={Add_careers_integrations.onClose}
            size={{
                base:'full',
                md:'md'
            }}
        >
            <DrawerOverlay />
            <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>New Career</DrawerHeader>
            <DrawerBody>
                <FormControl mt='2' isRequired isInvalid={input_error && title == '' ? true : false}>
                    <FormLabel>Title of the career</FormLabel>
                    <Input placeholder='Title of the career' value={title} type='text' onChange={((e)=>{set_title(e.target.value)})}/>
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
                    <Textarea placeholder='Description of the career' value={description} type='text' onChange={((e)=>{set_description(e.target.value)})}/>
                    {input_error && description == '' ?  
                        <FormErrorMessage>Description of the career is required.</FormErrorMessage>
                    : (
                        null
                    )}
                </FormControl>
                <FormControl mt='2' isRequired isInvalid={input_error && description == '' ? true : false}>
                    <FormLabel>Requirements of the career</FormLabel>
                    <Textarea placeholder='Requirements of the career' value={requirements} type='text' onChange={((e)=>{set_requirements(e.target.value)})}/>
                    {input_error && description == '' ?  
                        <FormErrorMessage>Requirements of the career is required.</FormErrorMessage>
                    : (
                        null
                    )}
                </FormControl>
                <FormControl mt='2'>
                    <FormLabel>Link to company</FormLabel>
                    <Input placeholder='Link to company' value={link} type='text' onChange={((e)=>{setlink(e.target.value)})}/>
                </FormControl>
                <FormControl mt='2' isRequired isInvalid={input_error && status == '' ? true : false}>
                    <FormLabel>Status of the career</FormLabel>
                    <Textarea placeholder='Status of the career' value={status} type='text' onChange={((e)=>{setstatus(e.target.value)})}/>
                    {input_error && status == '' ?  
                        <FormErrorMessage>Status of the career is required.</FormErrorMessage>
                    : (
                        null
                    )}
                </FormControl>
                <FormControl mt='2' isRequired isInvalid={input_error && valid_till == '' ? true : false}>
                    <FormLabel>Career listing is valid till</FormLabel>
                    <Input type={'date'} placeholder='Career listing is valid till' value={valid_till} onChange={((e)=>{setvalid_till(e.target.value)})}/>
                    {input_error && valid_till == '' ?  
                        <FormErrorMessage>Valid date of the career listing is required.</FormErrorMessage>
                    : (
                        null
                    )}
                </FormControl>
            </DrawerBody>
            <DrawerFooter>
                <Button variant='outline' mr={3} onClick={Add_careers_integrations.onClose}>
                    Cancel
                </Button>
                <Button colorScheme='teal' onClick={Handle_edit_vacancy}>Save</Button>
            </DrawerFooter>
            </DrawerContent>
        </Drawer>
	)
}

export default New_Career_Form;