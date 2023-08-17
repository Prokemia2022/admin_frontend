import React, { useEffect, useState } from "react";
import {
    Text, 
    Box, 
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
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
    Tag,
    TagLabel,
    TagCloseButton,
    Grid,
    Wrap,
    GridItem,
    Divider,
    useToast,
    Link,
    Tooltip,
    Avatar,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    WrapItem,
    CircularProgress, 
    CircularProgressLabel,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Skeleton,
    IconButton,
    Flex
} from '@chakra-ui/react';
import Navigation from '../../../components/Navigation';
//utils
import {useRouter} from 'next/router';
import Cookies from 'universal-cookie';
import jwt_decode from "jwt-decode";
import moment from 'moment';
//icons
import EmailIcon from '@mui/icons-material/Email';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import PersonIcon from '@mui/icons-material/Person';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import PhoneIcon from '@mui/icons-material/Phone';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import ScheduleIcon from '@mui/icons-material/Schedule';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import UnsubscribeIcon from '@mui/icons-material/Unsubscribe';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';

//api
import Get_SalesPerson from '../../api/salespeople/get_salesperson.js'
import Get_Orders from '../../api/orders/get_orders.js';
import Verify_Salesperson_Email from '../../api/salespeople/verify_salesperson_email'
import Un_Verify_Salesperson_Email from '../../api/salespeople/un_verify_salesperson_email.js';
import Approve_Salesperson from '../../api/salespeople/approve_salesperson.js'
//components
import SuspendAccountModal from '../../../components/modals/suspendAccount.js';
import Un_Suspend_AccountModal from '../../../components/modals/Un_Suspend_Account.js';
import Delete_Account_Modal from '../../../components/modals/delete_account.js'


export default function Client(){
    return(
        <Navigation >
            <Body/>
        </Navigation>
    )
}

const Body=()=>{
    const [is_delete_Modalvisible,set_is_delete_Modal_visible]=useState(false);
	const [issuspendModalvisible,setissuspendModalvisible]=useState(false);
	const [is_un_suspend_Modal_visible,set_is_un_suspend_Modal_visible]=useState(false);

	const [is_refresh_data,set_is_refresh]=useState(null);

	const toast = useToast();
	const router = useRouter();
	const query = router.query
	const id = query.id

	const [salesperson_data,set_salesperson_data] = useState('');
	const [sort_value,set_sort_value]=useState('')
	const [orders_data,set_orders]=useState([]);

    //orders
    const [total_orders_by_seller,set_total_orders_by_seller]=useState([]);
    const [total_amount__of_orders_by_seller,set_total_amount__of__orders_by_seller]=useState(0);

    const [total_completed_orders_by_seller,set_completed_total_orders_by_seller]=useState([]);
    const [total_completed_amount__of_orders_by_seller,set_completed_total_amount__of__orders_by_seller]=useState(0);

    const [total_pending_orders_by_seller,set_pending_total_orders_by_seller]=useState([]);
    const [total_pending_amount__of_orders_by_seller,set_pending_total_amount__of__orders_by_seller]=useState(0);

    const [total_rejected_orders_by_seller,set_rejected_total_orders_by_seller]=useState([]);
    const [total_rejected_amount__of_orders_by_seller,set_rejected_total_amount__of__orders_by_seller]=useState(0);

	const [fromDate,set_fromDate]=useState('');
	const [toDate,set_toDate]=useState(moment(new Date()).format("YYYY-MM-DD"));

	const cookies = new Cookies();
    let token = cookies.get('admin_token');
    const [auth_role,set_auth_role]=useState("")

	const payload = {
		_id : id,
		auth_role
	}

	const get_data=async(payload)=>{
		await Get_SalesPerson(payload).then((response)=>{
			//console.log(response.data)
			const email = response.data?.email_of_salesperson
			set_salesperson_data(response.data)
			fetch_orders(email)
		})
	}

	const fetch_orders=async(email)=>{
		await Get_Orders().then((response)=>{
			//console.log(response.data)
			const data = response.data
			//console.log(data)
			const fetched_salesperson_orders_data = data?.filter((item) => 	item?.email_of_creator.toLowerCase().includes(email?.toLowerCase()));

            set_total_orders_by_seller(fetched_salesperson_orders_data);
            const sales_data = fetched_salesperson_orders_data.map((item)=> item.total)
            let sales = Intl.NumberFormat().format(sales_data.reduce((a, b) => a + b, 0));
            set_total_amount__of__orders_by_seller(sales)


            const completed_orders = fetched_salesperson_orders_data?.filter((item)=>item.order_status.includes('completed'))
            set_completed_total_orders_by_seller(completed_orders);
            const completed_sales_data = completed_orders.map((item)=> item.total)
            let completed_sales_total = Intl.NumberFormat().format(completed_sales_data.reduce((a, b) => a + b, 0));
            set_completed_total_amount__of__orders_by_seller(completed_sales_total)

            const pending_orders = fetched_salesperson_orders_data?.filter((item)=>item.order_status.includes('pending'))
            set_pending_total_orders_by_seller(pending_orders);
            const pending_sales_data = pending_orders.map((item)=> item.total)
            let pending_sales_total = Intl.NumberFormat().format(pending_sales_data.reduce((a, b) => a + b, 0));
            set_pending_total_amount__of__orders_by_seller(pending_sales_total)

            const rejected_orders = fetched_salesperson_orders_data?.filter((item)=>item.order_status.includes('rejected'))
            set_rejected_total_orders_by_seller(rejected_orders);
            const rejected_sales_data = rejected_orders.map((item)=> item.total)
            let rejected_sales_total = Intl.NumberFormat().format(rejected_sales_data.reduce((a, b) => a + b, 0));
            set_rejected_total_amount__of__orders_by_seller(rejected_sales_total)

			const result_data = fetched_salesperson_orders_data?.filter((item) => item?.order_status.includes(sort_value.toLowerCase()) )

			//filter with date
			if (fromDate !== '' && toDate !== ''){
				//console.log(fromDate,toDate)
				let filtered_by_date = result_data?.filter((item)=>{
					return new Date(item?.createdAt).getTime() >= new Date(fromDate).getTime() && new Date(item?.createdAt).getTime() <= new Date(toDate).getTime()
				});
				//console.log(filtered_by_date)
				set_orders(filtered_by_date);
			}else{
				set_orders(result_data)
			}
		})
	}

    const handle_approve_salesperson=async()=>{
		await Approve_Salesperson(payload).then(()=>{
			toast({
              title: '',
              description: `${salesperson_data.first_name} ${salesperson_data.last_name} has been approved`,
              status: 'info',
              variant:'left-accent',
              position:'top-left',
              isClosable: true,
            });
            set_is_refresh(true)
		}).catch((err)=>{
			toast({
              title: '',
              description: err.response?.data,
              status: 'error',
              isClosable: true,
            });
		})
	}

	const handle_verify_email_account=async()=>{
		await Verify_Salesperson_Email(payload).then(()=>{
			toast({
				title: '',
				description: `${salesperson_data?.first_name}'s email has been verified.`,
				status: 'info',
                variant:'left-accent',
                position:'top-left',
				isClosable: true,
			});
		}).catch((err)=>{
			////console.log(err)
			toast({
				title: '',
				description: err.response?.data,
				status: 'error',
				isClosable: true,
			});
		}).finally(()=>{
			set_is_refresh(!is_refresh_data)
		})
	}

	const handle_un_verify_email_account=async()=>{
		await Un_Verify_Salesperson_Email(payload).then(()=>{
			toast({
				title: '',
				description: `${salesperson_data?.first_name}'s email has been un verified.`,
				status: 'info',
                variant:'left-accent',
                position:'top-left',
				isClosable: true,
			});
		}).catch((err)=>{
			////console.log(err)
			toast({
				title: '',
				description: err.response?.data,
				status: 'error',
				isClosable: true,
			});
		}).finally(()=>{
			set_is_refresh(!is_refresh_data)
		})
	}

	useEffect(()=>{
		if (id){
			get_data(payload)
		}
		if (!token){
	        toast({
	              title: '',
	              description: `You need to signed in, to have access`,
	              status: 'info',
                  variant:'left-accent',
                  position:'top-left',
	              isClosable: true,
	            });
	        router.push("/")
	      }else{
	        let decoded = jwt_decode(token);
	        //console.log(decoded);
	        set_auth_role(decoded?.role)
	      }
	},[sort_value,toDate,fromDate,is_refresh_data]);

	const Clear_Filter=()=>{
		set_sort_value('')
		set_fromDate('');
		set_toDate(moment(new Date()).format("YYYY-MM-DD"))
	}

    return(
        <Box gap='2' m={{
            base:'0',
            md:'8'
        }}>
            <Delete_Account_Modal is_delete_Modalvisible={is_delete_Modalvisible} set_is_delete_Modal_visible={set_is_delete_Modal_visible} salesperson_data={salesperson_data} acc_type={"salespersons"} payload={payload} set_is_refresh={set_is_refresh} is_refresh_data={is_refresh_data}/>
            <SuspendAccountModal issuspendModalvisible={issuspendModalvisible} setissuspendModalvisible={setissuspendModalvisible} salesperson_data={salesperson_data} acc_type={"salespersons"} payload={payload} set_is_refresh={set_is_refresh} is_refresh_data={is_refresh_data}/>
            <Un_Suspend_AccountModal is_un_suspend_Modal_visible={is_un_suspend_Modal_visible} set_is_un_suspend_Modal_visible={set_is_un_suspend_Modal_visible} salesperson_data={salesperson_data} acc_type={"salespersons"} payload={payload} set_is_refresh={set_is_refresh} is_refresh_data={is_refresh_data}/>
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
                            <MenuItem _hover={{bg:'gray.300',borderRadius:'5',}} onClick={(()=>{router.push(`/inventory_new/product/edit/${product_data?._id}`)})}>
                                <HStack>
                                    <MarkEmailUnreadIcon/>
                                    <Link color='grey' fontSize='14px' href={`mailto: ${salesperson_data?.email_of_salesperson}`} isExternal>Email this user</Link>
                                </HStack>
                            </MenuItem>
                            <Divider/>
                            {salesperson_data?.verification_status?
                                <>
                                    {salesperson_data?.valid_email_status? 
                                            <MenuItem _hover={{bg:'gray.300',borderRadius:'5',}} onClick={handle_un_verify_email_account}>
                                                <HStack>
                                                    <UnsubscribeIcon/>
                                                    <Text>Un verify this user's email</Text>
                                                </HStack>
                                            </MenuItem>
                                            : 
                                            <MenuItem _hover={{bg:'gray.300',borderRadius:'5',}} onClick={handle_verify_email_account}>
                                                <HStack>
                                                    <MarkEmailReadIcon/>
                                                    <Text>Verify this user's email</Text>
                                                </HStack>
                                            </MenuItem>
                                    }
                                    <Divider/>
                                    {salesperson_data?.suspension_status? 
                                        <MenuItem _hover={{bg:'gray.300',borderRadius:'5',}} onClick={(()=>{set_is_un_suspend_Modal_visible(true)})}>
                                            <HStack>
                                                <AccountCircleRoundedIcon/>
                                                <Text>Activate this user</Text>
                                            </HStack>
                                        </MenuItem>
                                            : 
                                        <MenuItem _hover={{bg:'gray.300',borderRadius:'5',}} onClick={(()=>{setissuspendModalvisible(true)})}>
                                            <HStack>
                                                <NoAccountsIcon/>
                                                <Text>Suspend this user</Text>
                                            </HStack>
                                        </MenuItem>
                                    }
                                </>
                                :
                                <MenuItem _hover={{bg:'gray.300',borderRadius:'5',}} onClick={handle_approve_salesperson}>
                                    <HStack>
                                        <HowToRegIcon/>
                                        <Text>Approve this user's account</Text>
                                    </HStack>
                                </MenuItem>
                            }
                            <Divider/>
                            <MenuItem _hover={{bg:'gray.300',borderRadius:'5',}} onClick={(()=>{set_is_delete_Modal_visible(true)})}>
                                <HStack >
                                    <DeleteRoundedIcon style={{color:'red'}}/>
                                    <Text>Delete this user</Text>
                                </HStack>
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </HStack>
            </HStack>
            {salesperson_data?.suspension_status? 
                <Alert status='error' mt='2' borderRadius='md'>
                    <AlertIcon />
                    <AlertTitle>Account Status</AlertTitle>
                    <AlertDescription>This account has been suspended.</AlertDescription>
                </Alert>
                : null
            }
            {!salesperson_data?.verification_status? 
                <Alert status='info' mt='2' borderRadius='md'>
                    <AlertIcon />
                    <AlertTitle>Account Status</AlertTitle>
                    <AlertDescription>This account is awaiting approval.</AlertDescription>
                </Alert>
                : null
            }
            <Box 
                bg='#fff' 
                borderRadius='xl'
                boxShadow='sm'
                mt='2'
                p='4'
            >
                <HStack alignItems='center'>
                    <Avatar 
                        size={{
                            base:'lg',
                            md:'2xl'
                        }} 
                        src={salesperson_data?.profile_photo_url}
                        name={salesperson_data?.first_name}/>
                    <Box >
                        <Text 
                            fontSize={{
                                base:'lg',
                                md:'xl'
                            }} 
                            fontWeight='bold'
                        >
                            {salesperson_data?.first_name} {salesperson_data?.last_name}
                        </Text>
                        <Text
                            fontSize={{
                                base:'sm',
                                md:'md'
                            }} 
                        >
                            {salesperson_data?.email_of_salesperson ? salesperson_data?.email_of_salesperson : '-'}
                        </Text>
                        <Wrap>
                            {salesperson_data?.valid_email_status? <Badge colorScheme='green' borderRadius='sm'>verified email</Badge> : null}
                            {salesperson_data?.open_to_consultancy? <Badge bg='gray.200' borderRadius='sm'>Open to consult</Badge> : null}
                        </Wrap>
                        
                    </Box>
                </HStack>
            </Box>
            <Grid
                templateColumns='repeat(5, 1fr)'
                gap={4}
                mt='4'
            >
                <GridItem 
                    colSpan={{
                        base: "5",
                        md: "1",
                    }} 
                >
                    <Box bg='#fff' p='4' borderRadius={'xl'} boxShadow={'md'}>
                        <Text fontWeight='bold' fontSize='lg'>Profile</Text>
                        <Box bg='#fff' borderRadius='lg' mt='2' mb='2'>
                            <Text fontWeight='bold'>Bio</Text>
                            <Text>{salesperson_data?.bio ? salesperson_data?.bio : '-'}</Text>
                        </Box>
                        <HStack alignItems='center' mt='2'>
                            <EmailIcon/>
                            <Text fontSize='sm'>{salesperson_data?.email_of_salesperson ? salesperson_data?.email_of_salesperson : '-'}</Text>
                        </HStack>
                        <HStack alignItems='center' mt='3'>
                            <PhoneIcon/>
                            <Text fontSize='sm' fontWeight='light'>{salesperson_data?.mobile_of_salesperson ? salesperson_data?.mobile_of_salesperson : '-'}</Text>
                        </HStack>
                        <HStack alignItems='center' mt='3'>
                            <FmdGoodIcon/>
                            <Text fontSize='sm' fontWeight='light'>{salesperson_data?.address ? salesperson_data?.address : '-'}</Text>
                        </HStack>
                        <HStack alignItems='center' mt='2'>
                            <BusinessCenterIcon/>
                            <Text fontSize='sm' fontWeight='light'>works at <span style={{fontWeight:'bold'}}>{salesperson_data?.company_name ? salesperson_data?.company_name : '-'}</span></Text>
                        </HStack>
                        <HStack alignItems='center' mt='2'>
                            <PersonIcon/>
                            <Text fontSize='sm' fontWeight='light'>{salesperson_data?.gender ? salesperson_data?.gender : '-'}</Text>
                        </HStack>
                        <HStack alignItems='center' mt='2'>
                            <InsertInvitationIcon/>
                            <Text fontSize='sm' fontWeight='light'>{moment( salesperson_data?.joined_in).format("MMM Do YY")}</Text>
                        </HStack>
                        <HStack alignItems='center' mt='2'>
                            <PaymentIcon/>
                            <Text fontSize='sm' fontWeight='light'>{salesperson_data?.payment_method ? salesperson_data?.payment_method : '-'}</Text>
                        </HStack>
                    </Box>
                </GridItem>
                {!salesperson_data?.verification_status? 
                    <GridItem 
                        colSpan={{
                            base: "5",
                            md: "4",
                        }}
                    > 
                        <Skeleton 
                            h='full'
                            borderRadius='md'
                        >
                            <div>contents wrapped</div>
                            <div>won't be visible</div>
                        </Skeleton>
                    </GridItem>
                    :
                    <GridItem 
                        colSpan={{
                            base: "5",
                            md: "4",
                        }}
                    >   
                        <Wrap bg='#fff' p='4' borderRadius='lg' justify='space-between'>
                            <WrapItem alignItems='center' gap='2'>
                                <CircularProgress value={total_amount__of_orders_by_seller} size='50px' color='blue.300' thickness='4px'>
                                    <CircularProgressLabel>
                                        <ReceiptLongIcon/>
                                    </CircularProgressLabel>
                                </CircularProgress>
                                <Stat >
                                    <StatLabel>Total</StatLabel>
                                    <StatNumber fontSize='md'>Ksh {total_amount__of_orders_by_seller}</StatNumber>
                                    <StatHelpText>{total_orders_by_seller?.length} orders</StatHelpText>
                                </Stat>
                            </WrapItem>
                            <WrapItem alignItems='center' gap='2'>
                                <CircularProgress max={100} value={total_completed_amount__of_orders_by_seller?.length/100} min={0} size='50px' color='green.300' thickness='4px'>
                                    <CircularProgressLabel>
                                        <PlaylistAddCheckIcon/>
                                    </CircularProgressLabel>
                                </CircularProgress>
                                <Stat >
                                    <StatLabel>Paid</StatLabel>
                                    <StatNumber fontSize='md'>Ksh {total_completed_amount__of_orders_by_seller}</StatNumber>
                                    <StatHelpText>{total_completed_orders_by_seller?.length} orders</StatHelpText>
                                </Stat>
                            </WrapItem>
                            <WrapItem alignItems='center' gap='2'>
                                <CircularProgress max={100} value={total_pending_orders_by_seller?.length/100} min={0} size='50px' color='orange.300' thickness='4px'>
                                    <CircularProgressLabel>
                                        <ScheduleIcon/>
                                    </CircularProgressLabel>
                                </CircularProgress>
                                <Stat >
                                    <StatLabel>Pending</StatLabel>
                                    <StatNumber fontSize='md'>Ksh {total_pending_amount__of_orders_by_seller}</StatNumber>
                                    <StatHelpText>{total_pending_orders_by_seller?.length} orders</StatHelpText>
                                </Stat>
                            </WrapItem>
                            <WrapItem alignItems='center' gap='2'>
                                <CircularProgress max={100} value={total_rejected_orders_by_seller?.length/100} min={0} size='50px' color='gray.300' thickness='4px'>
                                    <CircularProgressLabel>
                                        <HighlightOffIcon/>
                                    </CircularProgressLabel>
                                </CircularProgress>
                                <Stat >
                                    <StatLabel>Rejected</StatLabel>
                                    <StatNumber fontSize='md'>Ksh {total_rejected_amount__of_orders_by_seller}</StatNumber>
                                    <StatHelpText>{total_rejected_orders_by_seller?.length} orders</StatHelpText>
                                </Stat>
                            </WrapItem>
                        </Wrap>
                        <Box bg='#fff' p='4' my='2' borderRadius='md'>
                            <Wrap minChildWidth='250px' spacing='20px' mt='4'  borderRadius='lg' alignItems='end'>
                                <Flex alignItems='center' gap='2' flex='1'>
                                    <Text>From</Text>
                                    <Input value={fromDate} placeholder="Select Date and Time" size="md" type="datetime-local"  onChange={((e)=>{set_fromDate(e.target.value)})}/>
                                </Flex>
                                <Flex alignItems='center' gap='2' flex='1'>
                                    <Text>To</Text>
                                    <Input value={toDate} placeholder="Select Date and Time" size="md" type="datetime-local" onChange={((e)=>{set_toDate(e.target.value)})}/>
                                </Flex>
                            </Wrap>
                            <Flex gap='2'>
                            {fromDate !== ''? 
                                <Flex mt='2' gap='1' border={'1px'} borderStyle={'dashed'} borderColor={'gray.200'} borderRadius={5} p='2'>
                                    <Text fontWeight={'semibold'} fontSize={'sm'}>
                                        from:
                                    </Text>
                                    <Tag
                                        size={'md'}
                                        borderRadius='md'
                                        variant='subtle'
                                        bg='black'
                                        color={'#fff'}
                                        onClick={(()=>{set_fromDate('')})}
                                    >
                                        <TagLabel>{fromDate}</TagLabel>
                                        <TagCloseButton />
                                    </Tag>
                                </Flex>
                                : 
                                null
                            }
                            {fromDate !== ''?
                                <Tag my='1' onClick={Clear_Filter} size='lg' gap='1' _hover={{bg:'red.100'}} bg='gray:200' color='red' borderRadius='md' cursor={'pointer'}>
                                    <DeleteSweepIcon/>
                                    <TagLabel>clear</TagLabel>
                                </Tag>
                                :
                                null
                            }
                            </Flex>
                        </Box>
                        <TableContainer bg='#fff' mt='4' borderRadius={5}>
                            <Table variant='simple'>
                                <Thead bg='#eee' borderRadius={'5'}>
                                    <Tr>
                                        <Th>Name of product</Th>
                                        <Th>Company name</Th>
                                        <Th>Amount</Th>
                                        <Th>status</Th>
                                        <Th>Created</Th>
                                        <Th>Actions</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {orders_data?.map((item)=>{
                                        return(
                                            <Tr key={item?._id} align={'center'} fontWeight={'regular'}>
                                                <Td>{item?.name_of_product}</Td>
                                                <Td>{item.company_name_of_client? item.company_name_of_client : '-'}</Td>
                                                <Td>{item.total? item.total : '-'}</Td>
                                                <Td>
                                                    <Badge variant='subtle' colorScheme={item?.order_status === 'completed' ? 'green':'orange'}>
                                                        {item.order_status? item.order_status : '-'}
                                                    </Badge>
                                                </Td>
                                                <Td>{moment( item?.createdAt).format("MMM Do YY")}</Td>
                                                <Td>
                                                <Menu >
                                                    <MenuButton >
                                                        <MoreVertIcon/>
                                                    </MenuButton>
                                                    <MenuList>
                                                        <MenuItem onClick={(()=>{router.push(`/orders_new/order/${item?._id}`)})}>View</MenuItem>
                                                    </MenuList>
                                                    </Menu>
                                                </Td>
                                            </Tr>)
                                    })}
                                    
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </GridItem>
                }
            </Grid>
        </Box>
    )
}