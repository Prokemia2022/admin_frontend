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
import Un_Verify_Salesperson_Email from '../../api/salespeople/un_verify_salesperson_email.js';
import Approve_Salesperson from '../../api/salespeople/approve_salesperson.js'

import Get_Client from '../../api/clients/get_client.js';
import Verify_Client_Email from '../../api/clients/verify_client_email.js';
import Un_Verify_Client_Email from '../../api/clients/un_verify_client_email.js';
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

	const [client_data,set_client_data] = useState('');

    const cookies = new Cookies();
    let token = cookies.get('admin_token');
    const [auth_role,set_auth_role]=useState("")

	const payload = {
		_id : id,
		auth_role
	}

	const get_data=async(payload)=>{
		await Get_Client(payload).then((response)=>{
			return set_client_data(response?.data)
		})
	}

	const handle_verify_email_account=async()=>{
		await Verify_Client_Email(payload).then(()=>{
			toast({
				title: '',
				description: `${client_data?.first_name}'s email has been verified.`,
				status: 'info',
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
		await Un_Verify_Client_Email(payload).then(()=>{
			toast({
				title: '',
				description: `${client_data?.first_name}'s email has been un verified.`,
				status: 'info',
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
		//console.log(id)
		if (id ){
			get_data(payload)
		}
		if (!token){
	        toast({
	              title: '',
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
	},[id,is_refresh_data])

    return(
        <Box gap='2' m={{
            base:'0',
            md:'8'
        }}>
            <Delete_Account_Modal is_delete_Modalvisible={is_delete_Modalvisible} set_is_delete_Modal_visible={set_is_delete_Modal_visible} client_data={client_data} acc_type={"client"} payload={payload} set_is_refresh={set_is_refresh} is_refresh_data={is_refresh_data}/>
            <SuspendAccountModal issuspendModalvisible={issuspendModalvisible} setissuspendModalvisible={setissuspendModalvisible} client_data={client_data} acc_type={"client"} payload={payload} set_is_refresh={set_is_refresh} is_refresh_data={is_refresh_data}/>
            <Un_Suspend_AccountModal is_un_suspend_Modal_visible={is_un_suspend_Modal_visible} set_is_un_suspend_Modal_visible={set_is_un_suspend_Modal_visible} client_data={client_data} acc_type={"client"} payload={payload} set_is_refresh={set_is_refresh} is_refresh_data={is_refresh_data}/>
            <HStack justifyContent={'space-between'}>
                <Breadcrumb spacing='5px' alignItems={'center'} fontSize={'sm'} fontWeight={'semibold'}>
                    <BreadcrumbItem>
                        <ChevronLeftIcon style={{fontSize:'20px',marginTop:'2'}}/>
                        <BreadcrumbLink href='/customers_new'>Back</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
                <HStack>
                    <Menu>
                        <MenuButton colorScheme="teal" as={Button} rightIcon={<ExpandMoreIcon />}>
                            Actions
                        </MenuButton>
                        <MenuList p='2'>
                            <MenuItem _hover={{bg:'gray.300',borderRadius:'5',}} onClick={(()=>{router.push(`/customers_new/client/edit/${client_data?._id}`)})}>
                                <HStack>
                                    <MarkEmailUnreadIcon/>
                                    <Link color='grey' fontSize='14px' href={`mailto: ${client_data?.email_of_company}`} isExternal>Email this user</Link>
                                </HStack>
                            </MenuItem>
                            <Divider/>
                            {client_data?.valid_email_status? 
                                <Box>
                                    {client_data?.valid_email_status? 
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
                                    {client_data?.suspension_status? 
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
                                </Box>
                                :
                                (
                                    <MenuItem _hover={{bg:'gray.300',borderRadius:'5',}} onClick={handle_verify_email_account}>
                                        <HStack>
                                            <MarkEmailReadIcon/>
                                            <Text>Verify this user's email</Text>
                                        </HStack>
                                    </MenuItem>
                                )
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
            {client_data?.suspension_status? 
                <Alert status='error' mt='2' borderRadius='md'>
                    <AlertIcon />
                    <AlertTitle>Account Status</AlertTitle>
                    <AlertDescription>This account has been suspended.</AlertDescription>
                </Alert>
                : null
            }
            {!client_data?.valid_email_status? 
                <Alert status='info' mt='2' borderRadius='md'>
                    <AlertIcon />
                    <AlertTitle>Account Status</AlertTitle>
                    <AlertDescription>This account has not verified their email.</AlertDescription>
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
                        src={client_data?.profile_photo_url}
                        name={client_data?.first_name}/>
                    <Box >
                        <Text 
                            fontSize={{
                                base:'lg',
                                md:'xl'
                            }} 
                            fontWeight='bold'
                        >
                            {client_data?.first_name} {client_data?.last_name}
                        </Text>
                        <Text
                            fontSize={{
                                base:'sm',
                                md:'md'
                            }} 
                        >
                            {client_data?.email_of_company ? client_data?.email_of_company : '-'}
                        </Text>
                        <Wrap>
                            {client_data?.valid_email_status? <Badge colorScheme='green' borderRadius='sm'>verified email</Badge> : null}
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
                        <HStack alignItems='center' mt='2'>
                            <EmailIcon/>
                            <Text fontSize='sm'>{client_data?.email_of_company ? client_data?.email_of_company : '-'}</Text>
                        </HStack>
                        <HStack alignItems='center' mt='3'>
                            <PhoneIcon/>
                            <Text fontSize='sm' fontWeight='light'>{client_data?.mobile_of_company ? client_data?.mobile_of_company : '-'}</Text>
                        </HStack>
                        <HStack alignItems='center' mt='3'>
                            <FmdGoodIcon/>
                            <Text fontSize='sm' fontWeight='light'>{client_data?.address ? client_data?.address : '-'}</Text>
                        </HStack>
                        <HStack alignItems='center' mt='2'>
                            <BusinessCenterIcon/>
                            <Text fontSize='sm' fontWeight='light'>works at <span style={{fontWeight:'bold'}}>{client_data?.company_name ? client_data?.company_name : '-'}</span></Text>
                        </HStack>
                        <HStack alignItems='center' mt='2'>
                            <BusinessCenterIcon/>
                            <Text fontSize='sm' fontWeight='light'>works as a <span style={{fontWeight:'bold'}}>{client_data?.position ? client_data?.position : '-'}</span></Text>
                        </HStack>
                        <HStack alignItems='center' mt='2'>
                            <PersonIcon/>
                            <Text fontSize='sm' fontWeight='light'>{client_data?.gender ? client_data?.gender : '-'}</Text>
                        </HStack>
                        <HStack alignItems='center' mt='2'>
                            <InsertInvitationIcon/>
                            <Text fontSize='sm' fontWeight='light'>{moment( client_data?.joined_in).format("MMM Do YY")}</Text>
                        </HStack>
                    </Box>
                </GridItem>
                {!client_data?.valid_email_status? 
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
                        p='4'
                        bg='#fff'
                        borderRadius='md'
                        boxShadow='sm'
                    >
                        <Text>Recently Viewed</Text>
                    </GridItem>
                }
            </Grid>
        </Box>
    )
}