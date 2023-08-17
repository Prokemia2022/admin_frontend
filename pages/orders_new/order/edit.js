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
} from '@chakra-ui/react';
//api
import Edit_Order from '../../api/orders/edit_order.js';
import Get_Order from '../../api/orders/get_order.js';

function Edit_Order_Form({isOpen,onClose,auth_role,id}){
    const [is_refresh_data,set_is_refresh_data]=useState(false);
    let [order_data,set_order_data]=useState({});
    console.log(id)

    const get_Data=async({id})=>{
        console.log(id)
        const payload = {
            _id : id,
            auth_role
        }
		await Get_Order(payload).then((response)=>{
			set_order_data(response.data)
			console.log(response.data)
		})
	}
    //get_Data(id)

    useEffect(()=>{
        if(id && isOpen){
            get_Data(id)
        }
    },[])

    const toast= useToast()
    //client_information
    let [name_of_client,set_name_of_client]=useState(order_data?.name_of_client);
    let [company_name_of_client,set_company_name_of_client]=useState(order_data?.company_name_of_client);
    let [mobile_of_client,set_mobile_of_client]=useState(order_data?.mobile_of_client);    
    let [email_of_client,set_email_of_client]=useState(order_data?.email_of_client);
    let [location_of_client,set_location_of_client]=useState(order_data?.location_of_client);
    //product information
    let [name_of_product,set_name_of_product]=useState(order_data?.name_of_product);
    let [volume_of_items,set_volume_of_items]=useState(order_data?.volume_of_items);
    let [unit_price,set_unit_price]=useState(order_data?.unit_price);
    //payment&delivery
    let [delivery_terms,set_delivery_terms]=useState(order_data?.delivery_terms);
    let [payment_terms,set_payment_terms]=useState(order_data?.payment_terms);
    let [delivery_date,set_delivery_date]=useState(order_data?.delivery_date);

	const payload = {
		_id: order_data?._id,
		//client-info
		name_of_client,
		company_name_of_client,
		mobile_of_client,
		email_of_client,
		location_of_client,
		//product info
		name_of_product,
		volume_of_items,
		unit_price,
		total: volume_of_items * unit_price,
		//payment&delivery
		delivery_date,
		delivery_terms,
		payment_terms,
		auth_role
    }

    

	const handle_edit_order=async()=>{
		//console.log(payload)
        if (
                company_name_of_client === '' || 
                name_of_client === '' || 
                mobile_of_client === '' || 
                email_of_client === "" || 
                name_of_product === "" ||
                location_of_client === "" ||
                volume_of_items === 0 ||
                unit_price === 0 ||
                delivery_terms === '' ||
                delivery_date === '' ||
                payment_terms === '0'
            ){
            /**
                Checks if the required fields have been filled and are not missing.
                Returns a alert modal to show the error.
            */
            set_input_error(true)
            return toast({
                title: '',
                position: 'top-left',
                variant:"subtle",
                description: `Ensure all inputs are filled`,
                status: 'info',
                isClosable: true,
            });
        }else{
            await Edit_Order(payload).then(()=>{
                toast({
                    title: '',
                    position: 'top-left',
                    variant:"left-accent",
                    description: `${payload?.name_of_product} has been edited successfully`,
                    status: 'success',
                    isClosable: true,
                });
                set_is_refresh_data(!is_refresh_data)
                onClose()
            }).catch((err)=>{
                //console.log(err)
                toast({
                    position: 'top-left',
                    variant:"left-accent",
                    title: 'Error while editing order',
                    description: err.response.data,
                    status: 'error',
                    isClosable: true,
                })
            })		
        }
	}
    //input error handlers
    const [input_error,set_input_error]=useState(false);
    
	return(
        <Drawer isOpen={isOpen} onClose={onClose} 
            size={{
                base:'full',
                md:'md'
            }}
        >
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Edit Order</DrawerHeader>

                <DrawerBody>
                    <Box>
                        <Box bg='#fff' borderRadius={8} mt='4'>
                            <Text fontWeight={'bold'} fontSize={'lg'} color='#009393'>Customer Details</Text>
                            <Divider/>
                            <FormControl mt='2' isRequired isInvalid={input_error && company_name_of_client == '' ? true : false}>
                                <FormLabel>Company name for customer</FormLabel>
                                <Input value={company_name_of_client} placeholder='Company name for customer' type='text' onChange={((e)=>{set_company_name_of_client(e.target.value)})}/>
                                {input_error && company_name_of_client == '' ? 
                                    <FormErrorMessage>Company name for customer is required.</FormErrorMessage>
                                : (
                                    null
                                )}
                            </FormControl>
                            <FormControl mt='2' isRequired isInvalid={input_error && name_of_client == '' ? true : false}>
                                <FormLabel>Name of Customer</FormLabel>
                                <Input value={name_of_client} placeholder='Name of the Customer' type='text' onChange={((e)=>{set_name_of_client(e.target.value)})}/>
                                {input_error && name_of_client == '' ? 
                                    <FormErrorMessage>Name of the Customer is required.</FormErrorMessage>
                                : (
                                    null
                                )}
                            </FormControl>
                            <FormControl mt='2' isRequired isInvalid={input_error && email_of_client == 0 ? true : false}>
                                <FormLabel>Email of the customer</FormLabel>
                                <Input value={email_of_client} placeholder='Email of the customer' type={'email'} onChange={((e)=>{set_email_of_client(e.target.value)})}/>
                                {input_error && email_of_client == '' ? 
                                    <FormErrorMessage>Email of the customer is required.</FormErrorMessage>
                                : (
                                    null
                                )}
                            </FormControl>
                            <FormControl mt='2' isRequired isInvalid={input_error && mobile_of_client == 0 ? true : false}>
                                <FormLabel>Mobile of the customer</FormLabel>
                                <Input value={mobile_of_client} placeholder='Mobile of the customer' type={'tel'} onChange={((e)=>{set_mobile_of_client(e.target.value)})}/>
                                {input_error && mobile_of_client == 0 ? 
                                    <FormErrorMessage>Mobile of the customer is required.</FormErrorMessage>
                                : (
                                    null
                                )}
                            </FormControl>
                            <FormControl mt='2' isRequired isInvalid={input_error && location_of_client == 0 ? true : false}>
                                <FormLabel>Address of the customer</FormLabel>
                                <Input value={location_of_client} placeholder='Address of the customer' type={'text'} onChange={((e)=>{set_location_of_client(e.target.value)})}/>
                                {input_error && location_of_client == '' ? 
                                    <FormErrorMessage>Address of the customer is required.</FormErrorMessage>
                                : (
                                    null
                                )}
                            </FormControl>
                        </Box>
                        <Box bg='#fff' borderRadius={8} mt='4'>
                            <Text fontWeight={'bold'} fontSize={'lg'} color='#009393'>Product Details</Text>
                            <Divider/>
                            <FormControl mt='2' isRequired isInvalid={input_error && name_of_product == '' ? true : false}>
                                <FormLabel>Name of product</FormLabel>
                                <Input value={name_of_product} placeholder='Name of the product' type='text' onChange={((e)=>{set_name_of_product(e.target.value)})}/>
                                {input_error && name_of_product == '' ? 
                                    <FormErrorMessage>Name of the product is required.</FormErrorMessage>
                                : (
                                    null
                                )}
                            </FormControl>
                            <HStack>
                                <FormControl mt='2' isRequired isInvalid={input_error && unit_price == 0 ? true : false}>
                                    <FormLabel>Unit price of product</FormLabel>
                                    <Input value={unit_price} placeholder='Unit price of the product' type={'number'} onChange={((e)=>{set_unit_price(e.target.value)})}/>
                                    {input_error && unit_price == 0 ? 
                                        <FormErrorMessage>unit price of the product cannot be zero.</FormErrorMessage>
                                    : (
                                        null
                                    )}
                                </FormControl>
                                <FormControl mt='2' isRequired isInvalid={input_error && volume_of_items == 0 ? true : false}>
                                    <FormLabel>Quantity of products</FormLabel>
                                    <Input value={volume_of_items} placeholder='Quantity of products' type={'number'} onChange={((e)=>{set_volume_of_items(e.target.value)})}/>
                                    {input_error && volume_of_items == 0 ? 
                                        <FormErrorMessage>amount of the products cannot be zero.</FormErrorMessage>
                                    : (
                                        null
                                    )}
                                </FormControl>
                            </HStack>
                            <FormControl mt='2' isInvalid={input_error && delivery_terms == '' ? true : false}>
                                <FormLabel>Delivery terms</FormLabel>
                                <Input value={delivery_terms} placeholder='Delivery terms for the product' type={'text'} onChange={((e)=>{set_delivery_terms(e.target.value)})}/>
                                {input_error && delivery_terms == '' ? 
                                    <FormErrorMessage>Delivery terms for the product is required.</FormErrorMessage>
                                : (
                                    null
                                )}
                            </FormControl>
                            <FormControl mt='2' isInvalid={input_error && delivery_date == '' ? true : false}>
                                <FormLabel>Delivery date</FormLabel>
                                <Input value={delivery_date} placeholder='Delivery date for the product' type='date' onChange={((e)=>{set_delivery_date(e.target.value)})}/>
                                {input_error && delivery_date == '' ? 
                                    <FormErrorMessage>Delivery date for the product is required.</FormErrorMessage>
                                : (
                                    null
                                )}
                            </FormControl>
                        </Box>
                        <Box bg='#fff' borderRadius={8} mt='4'>
                            <Text fontWeight={'bold'} fontSize={'lg'} color='#009393'>Salesperson Details</Text>
                            <Divider/>
                            <FormControl mt='2' isRequired isInvalid={input_error && payment_terms == '' ? true : false}>
                                <FormLabel>Payment details for the salesperson</FormLabel>
                                <Input value={payment_terms} placeholder='Payment details for the salesperson' type='text' onChange={((e)=>{set_payment_terms(e.target.value)})}/>
                                {input_error && payment_terms == '' ? 
                                    <FormErrorMessage>Payment details for the salesperson is required.</FormErrorMessage>
                                : (
                                    null
                                )}
                            </FormControl>
                        </Box>
                    </Box>
                </DrawerBody>
                <DrawerFooter>
                    <Button type='submit' onClick={handle_edit_order}>
                    Save
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
	)
}

export default Edit_Order_Form;