import React, { useEffect, useRef, useState } from "react";
import {
    Text, 
    Box, 
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
    TableContainer,
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
    Badge,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button,
    HStack,
    Input,
    InputGroup,
    InputLeftElement,
    SimpleGrid,
    Select,
    InputRightElement,
    CircularProgress,
    Tag,
    TagLabel,
    TagCloseButton,
    Grid,
    Flex,
    Wrap,
    GridItem,
    Heading,
    VStack,
    Divider,
    useToast,
    Link,
    Tooltip,
    Avatar,
    Popover,
    Portal,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverArrow,
    PopoverCloseButton,
    PopoverBody,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    useDisclosure,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter
} from '@chakra-ui/react';
import Navigation from '../../../components/Navigation';
//utils
import {useRouter} from 'next/router';
import Cookies from 'universal-cookie';
import jwt_decode from "jwt-decode";
import moment from 'moment';
//icons
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditNoteIcon from '@mui/icons-material/EditNote';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import InventoryRoundedIcon from '@mui/icons-material/InventoryRounded';
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded';
import StarOutlineRoundedIcon from '@mui/icons-material/StarOutlineRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ShareIcon from '@mui/icons-material/Share';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import PersonIcon from '@mui/icons-material/Person';
import MailIcon from '@mui/icons-material/Mail';
import PhoneIcon from '@mui/icons-material/Phone';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
//api
import Get_Order from '../../api/orders/get_order.js';
import Edit_Order from '../../api/orders/edit_order.js';
import Delete_Order from '../../api/orders/delete_order.js'
//components
import Edit_Order_Form from "./edit";
import Create_Invoice_PDF from "../../api/orders/create_invoice_pdf";

export default function Order(){
    return(
        <Navigation >
            <Body/>
        </Navigation>
    )
}

const Body=()=>{
    const { isOpen, onOpen, onClose } = useDisclosure()
    const router = useRouter();
	const toast = useToast();

	const id = router.query;
	const cookies = new Cookies();
    let token = cookies.get('admin_token');
    const [auth_role,set_auth_role]=useState("");
	const [is_submitting,set_is_submitting]=useState(false);
    const [is_refresh_data,set_is_refresh_data]=useState(false);


	const payload = {
		_id : id.id,
		auth_role
	}
	const [order_data,set_order_data]=useState('');

	const get_Data=async(payload)=>{
		await Get_Order(payload).then((response)=>{
			set_order_data(response.data)
		})
	}
	useEffect(()=>{
		if (payload || id ){
			get_Data(payload)
		}
		if (!token){
			toast({
				title: '',
				position: 'top-left',
				variant:"subtle",
				description: `You need to signed in, to have access`,
				status: 'info',
				isClosable: true,
			});
	        router.push("/")
	      }else{
	        let decoded = jwt_decode(token);
	        //console.log(decoded);
	        set_auth_role(decoded?.role)
	      }
	},[id,is_submitting,is_refresh_data]);

	let delivery_date = moment(order_data?.delivery_date).format("MMM Do YY")

	const handle_create_invoice=async()=>{
		const order_payload = {
		_id: order_data?._id,
		//client-info
		name_of_client: order_data?.name_of_client,
		company_name_of_client: order_data?.company_name_of_client,
		mobile_of_client: order_data?.mobile_of_client,
		email_of_client: order_data?.email_of_client,
		location_of_client: order_data?.location_of_client,
		//product info
		name_of_product: order_data?.name_of_product,
		volume_of_items: order_data?.volume_of_items,
		unit_price: order_data?.unit_price,
		total: order_data?.volume_of_items * order_data?.unit_price,
		//payment&delivery
		createdAt:date,
		delivery_date: moment(order_data?.delivery_date).format("MMM Do YY"),
		delivery_terms: order_data?.delivery_terms,
		payment_terms: order_data?.payment_terms
    }
		Create_Invoice_PDF(order_payload)
		await Approve_Order(payload).then(()=>{
			router.reload()
		})
	}

	const handle_download_invoice=()=>{
		const order_payload = {
			_id: order_data?._id,
			//client-info
			name_of_client: order_data?.name_of_client,
			company_name_of_client: order_data?.company_name_of_client,
			mobile_of_client: order_data?.mobile_of_client,
			email_of_client: order_data?.email_of_client,
			location_of_client: order_data?.location_of_client,
			//product info
			name_of_product: order_data?.name_of_product,
			volume_of_items: order_data?.volume_of_items,
			unit_price: order_data?.unit_price,
			total: order_data?.volume_of_items * order_data?.unit_price,
			//payment&delivery
			createdAt:moment(order_data?.createdAt).format("MMM Do YY"),
			delivery_date: delivery_date,
			delivery_terms: order_data?.delivery_terms,
			payment_terms: order_data?.payment_terms
		}
		Create_Invoice_PDF(order_payload)
	}

	const Handle_Reject_Order=async()=>{
		set_is_submitting(true)
		await Reject_Order(payload).then(()=>{
			toast({
				title: '',
				position: 'top-left',
				variant:"subtle",
				description: `${payload?.name_of_product} has successfully been rejected`,
				status: 'success',
				isClosable: true,
			});
		}).catch((err)=>{
			toast({
				title: '',
				position: 'top-left',
				variant:"subtle",
				description: err.response.data,
				status: 'error',
				isClosable: true,
			});
		}).finally(()=>{
			set_is_submitting(false)
		})
	}

	const Handle_Approve_Order=async()=>{
		set_is_submitting(true)
		await Approve_Order(payload).then(()=>{
			toast({
				title: '',
				position: 'top-left',
				variant:"subtle",
				description: `${payload?.name_of_product} has successfully been approved`,
				status: 'success',
				isClosable: true,
			});
		}).catch((err)=>{
			toast({
				title: '',
				position: 'top-left',
				variant:"subtle",
				description: err.response.data,
				status: 'error',
				isClosable: true,
			});
		}).finally(()=>{
			set_is_submitting(false)
		})
	}
	const Handle_Delete_Order=async()=>{
		set_is_submitting(true);
		await Delete_Order(payload).then(()=>{
			toast({
				title: '',
				position: 'top-left',
				variant:"subtle",
				description: `${order_data?.name_of_product} has successfully been deleted`,
				status: 'success',
				isClosable: true,
			});
			router.back()
		}).catch((err)=>{
			toast({
				title: '',
				position: 'top-left',
				variant:"subtle",
				description: err.response.data,
				status: 'error',
				isClosable: true,
			});
		}).finally(()=>{
			set_is_submitting(false)
		})
	}
    const vat_total = order_data?.total*0.16;
    const total = vat_total+order_data?.total;
    const cancelRef =useRef()
    return (
        <Box gap='2' m={{
            base:'0',
            md:'8'
        }}>
            <HStack justifyContent={'space-between'}>
                <Breadcrumb spacing='5px' alignItems={'center'} fontSize={'sm'} fontWeight={'semibold'}>
                    <BreadcrumbItem>
                        <ChevronLeftIcon style={{fontSize:'20px',marginTop:'2'}}/>
                        <BreadcrumbLink onClick={(()=>{router.back()})}>Back</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
                <HStack>
                    <Menu>
                        <MenuButton colorScheme="teal" as={Button} rightIcon={<ExpandMoreIcon />}>
                            Actions
                        </MenuButton>
                        <MenuList p='2'>
                            <MenuItem _hover={{bg:'gray.300',borderRadius:'5',}} onClick={(()=>{router.push(`/orders_new/order/edit/${order_data?._id}`)})}>
                                <HStack>
                                    <EditNoteIcon/>
                                    <Text>Edit order</Text>
                                </HStack>
                            </MenuItem>
                            <MenuItem _hover={{bg:'gray.300',borderRadius:'5',}} onClick={handle_download_invoice}>
                                <HStack>
                                    <CloudDownloadIcon/>
                                    <Text>Download invoice</Text>
                                </HStack>
                            </MenuItem>
                            <Divider/>
                            <MenuItem _hover={{bg:'gray.300',borderRadius:'5',}} onClick={onOpen} >
                                <HStack>
                                    <DeleteRoundedIcon style={{color:'red'}}/>
                                    <Text>Delete this order</Text>
                                </HStack>
                            </MenuItem>
                            <AlertDialog
                                motionPreset='slideInBottom'
                                leastDestructiveRef={cancelRef}
                                onClose={onClose}
                                isOpen={isOpen }
                                isCentered
                            >
                                <AlertDialogOverlay>
                                <AlertDialogContent>
                                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                                        Delete Order
                                    </AlertDialogHeader>

                                    <AlertDialogBody>
                                        Are you sure? You can't undo this action afterwards.
                                    </AlertDialogBody>

                                    <AlertDialogFooter>
                                    <Button ref={cancelRef} onClick={onClose}>
                                        Cancel
                                    </Button>
                                    <Button colorScheme='red' onClick={Handle_Delete_Order} ml={3}>
                                        Delete
                                    </Button>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                                </AlertDialogOverlay>
                            </AlertDialog>
                        </MenuList>
                    </Menu>
                </HStack>
            </HStack>
            <Box alignItems='center'>
                <Heading>Order</Heading>
                <Text mt='1' fontWeight='bold' color='gray.400' fontSize='sm'>#{order_data?._id}</Text>
                <Tag mt='1' bg={order_data?.order_status == 'completed' ? 'green.200' : 'orange.200' }>{order_data?.order_status}</Tag>
                <HStack mt='1'>
                    <CalendarMonthIcon fontSize='16'/>
                    <Text fontSize={'sm'} mt='1'>{moment(order_data?.createdAt).format("MMM Do YY")}</Text>
                </HStack>
            </Box>
            <Grid
                templateRows='repeat(2, 1fr)'
                templateColumns='repeat(5, 1fr)'
                gap={4}
                mt='4'
            >
                <GridItem 
                    colSpan={{
                        base: "5",
                        md: "4",
                    }}
                >
                    <Box 
                        bg='#fff'
                        borderRadius={10}
                        boxShadow={'sm'}
                        p='4'
                    >
                        <Text fontSize={'lg'} fontWeight={'bold'}>Details</Text>
                        <HStack justify={'space-between'} borderBottom={'2px'} borderColor={'gray.200'} borderStyle={'dashed'} py='6' px='4'>
                            <Text fontSize={'xl'} color='#009393' fontWeight={'bold'}>{order_data?.name_of_product}</Text>
                            <HStack gap='8'>
                                <Text>x{order_data?.volume_of_items}</Text>
                                <Text fontWeight={'bold'}>KES {order_data?.unit_price}</Text>
                            </HStack>
                        </HStack>
                        <Box>
                            <HStack gap='2' w='full' justify={'space-between'} p='4'>
                                <Text fontWeight={'medium'} color='gray.400'>Subtotal</Text>
                                <Text fontWeight={'bold'}>KES {order_data?.total}</Text>
                            </HStack>
                            <HStack gap='2' w='full' justify={'space-between'} p='4'>
                                <Text fontWeight={'medium'} color='gray.400'>vat (16%)</Text>
                                <Text fontWeight={'bold'} color='gray.400'>KES {vat_total}</Text>
                            </HStack>
                            <HStack gap='2' w='full' justify={'space-between'} p='4'>
                                <Text fontWeight={'medium'} color='gray.400'>Total</Text>
                                <Text fontWeight={'bold'}>KES {total}</Text>
                            </HStack>
                        </Box>
                    </Box>
                    <Box 
                        bg='#fff'
                        borderRadius={10}
                        boxShadow={'sm'}
                        p='4'
                        mt='2'
                    >
                        <Text fontSize={'lg'} fontWeight={'bold'}>Delivery Terms</Text>
                        <Text>{order_data?.delivery_terms}</Text>
                        <HStack color='gray.400' fontSize={'sm'}>
                            <Text >Date:</Text>
                            <Text >{moment(order_data?.delivery_date).format("MMM Do YY")}</Text>
                        </HStack>
                    </Box>
                    <Box 
                        bg='#fff'
                        borderRadius={10}
                        boxShadow={'sm'}
                        p='4'
                        mt='2'
                    >
                        <Text fontSize={'lg'} fontWeight={'bold'}>Payment</Text>
                        <Text>{order_data?.payment_terms ? order_data?.payment_terms : '-'}</Text>
                    </Box>
                </GridItem>
                <GridItem 
                    colSpan={{
                        base: "5",
                        md: "1",
                    }} 
                    rowSpan={{
                        base: "0",
                        md: "1",
                    }} 
                >
                    <Box 
                        bg='#fff'
                        borderRadius={10}
                        boxShadow={'sm'}
                        p='4'
                    >
                        <HStack justify={'space-between'}>
                            <Text fontSize={'lg'} fontWeight={'bold'}>Customer Info</Text>
                            <Popover placement={'auto'}>
                                <PopoverTrigger _hover={{
                                    bg:'blue.100',
                                    cursor:'pointer'
                                }}>
                                    <InfoOutlinedIcon style={{cursor:'pointer'}}/>
                                </PopoverTrigger>
                                <Portal>
                                    <PopoverContent bg='blue.100'>
                                    <PopoverArrow />
                                    <PopoverHeader>Customer information</PopoverHeader>
                                    <PopoverCloseButton />
                                    <PopoverBody >
                                        <Text fontWeight={'semibold'} fontSize={'sm'}>This card shows the details of the receiver the order is targeted to. The details are arranged as follows:- name of the Compamy, the email of the company, the name of the person handling the order, mobile and location of the company respectively.</Text>
                                    </PopoverBody>
                                    </PopoverContent>
                                </Portal>
                            </Popover>
                        </HStack>
                        <HStack mt='2' gap='2'>
                            <Avatar name={order_data?.company_name_of_client} size='md' borderRadius={'md'}/>
                            <Text fontSize={'md'}>{order_data?.company_name_of_client? order_data?.company_name_of_client : '-'}</Text>
                        </HStack>
                        <Box mt='2'>
                            <HStack mt='1' fontSize={'sm'} color='gray.500'>
                                <MailIcon style={{fontSize:'18'}}/>
                                <Text >{order_data?.email_of_client? order_data?.email_of_client : '-'}</Text>
                            </HStack>
                            <HStack mt='1' fontSize={'sm'} color='gray.500'>
                                <PersonIcon style={{fontSize:'18'}}/>
                                <Text >{order_data?.name_of_client? order_data?.name_of_client : '-'}</Text>
                            </HStack>
                            <HStack mt='1' fontSize={'sm'} color='gray.500'>
                                <PhoneIcon style={{fontSize:'18'}}/>
                                <Text >{order_data?.mobile_of_client? order_data?.mobile_of_client : '-'}</Text>
                            </HStack>
                            <HStack mt='1' fontSize={'sm'} color='gray.500'>
                                <FmdGoodIcon style={{fontSize:'18'}}/>
                                <Text >{order_data?.location_of_client? order_data?.location_of_client : '-'}</Text>
                            </HStack>
                        </Box>
                    </Box>
                    <Box 
                        bg='#fff'
                        borderRadius={10}
                        boxShadow={'sm'}
                        p='4'
                        mt='2'
                    >
                        <HStack justify={'space-between'}>
                            <Text fontSize={'lg'} fontWeight={'bold'}>Salesperson Info</Text>
                            <Popover placement={'auto'}>
                                <PopoverTrigger _hover={{
                                    bg:'blue.100',
                                    cursor:'pointer'
                                }}>
                                    <InfoOutlinedIcon style={{cursor:'pointer'}}/>
                                </PopoverTrigger>
                                <Portal>
                                    <PopoverContent bg='blue.100'>
                                    <PopoverArrow />
                                    <PopoverHeader>Seller information</PopoverHeader>
                                    <PopoverCloseButton />
                                    <PopoverBody >
                                        <Text fontWeight={'semibold'} fontSize={'sm'}>This card shows the details of the salesperson. The details are arranged as follows:- name of the seller, the email of the seller and mobile of the seller respectively.</Text>
                                    </PopoverBody>
                                    </PopoverContent>
                                </Portal>
                            </Popover>
                        </HStack>
                        <HStack mt='2' gap='2'>
                            <Avatar bg='gray.300' size='md' borderRadius={'md'}/>
                            <Text fontSize={'lg'} >{order_data?.creator_name? order_data?.creator_name : '-'}</Text>
                        </HStack>
                        <Box mt='2'>
                            <HStack mt='1' fontSize={'sm'} color='gray.500'>
                                <MailIcon style={{fontSize:'18'}}/>
                                <Text >{order_data?.email_of_creator? order_data?.email_of_creator : '-'}</Text>
                            </HStack>
                            <HStack mt='1' fontSize={'sm'} color='gray.500'>
                                <PhoneIcon style={{fontSize:'18'}}/>
                                <Text >{order_data?.mobile_of_creator? order_data?.mobile_of_creator : '-'}</Text>
                            </HStack>
                            <HStack mt='1' fontSize={'sm'} color='teal.500' cursor='pointer' onClick={(()=>{router.push(`/salespeople_new/client/${order_data?.creator_id}`)})}>
                                <VisibilityIcon style={{fontSize:'18'}}/>
                                <Text > view this profile</Text>
                            </HStack>                            
                        </Box>
                    </Box>
                </GridItem>
            </Grid>
        </Box>
    )
}