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
    Flex,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionIcon,
    AccordionPanel,
    VStack
} from '@chakra-ui/react';
import Navigation from '../../../../components/Navigation';
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
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded';
import StarOutlineRoundedIcon from '@mui/icons-material/StarOutlineRounded';


//api
import Approve_Distributor from '../../../api/distributors/approve_distributor.js';
import Verify_Distributor_Email from '../../../api/distributors/verify_distributor_email.js';
import Un_Verify_Distributor_Email from '../../../api/distributors/un_verify_distributor_email.js';
import Get_Distributor from '../../../api/distributors/get_distributor.js';
import Get_Products from '../../../api/Products/get_products.js'
import Subscribe_Distriutor from '../../../api/distributors/subscribe_account.js'
import Un_Subscribe_Distriutor from '../../../api/distributors/un_subscribe_account.js';

//components
import SuspendAccountModal from '../../../../components/modals/suspendAccount.js';
import Un_Suspend_AccountModal from '../../../../components/modals/Un_Suspend_Account.js';
import Delete_Account_Modal from '../../../../components/modals/delete_account.js'


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
    const [products,set_products]=useState([]);
    const [industries,set_industries]=useState([]);


    const cookies = new Cookies();
    let token = cookies.get('admin_token');
    const [auth_role,set_auth_role]=useState("")

	const payload = {
		_id : id,
		auth_role
	}

	const get_data=async(payload)=>{
		await Get_Distributor(payload).then((response)=>{
            const email = response?.data?.email_of_company
			get_products_data(email);
			return set_client_data(response?.data)
		})
	}
    const handle_approve_distributor=async()=>{
		await Approve_Distributor(payload).then(()=>{
			toast({
              title: '',
              description: `${client_data.company_name} has been approved`,
              status: 'success',
              position:'top-left',
              variant:'left-accent',
              isClosable: true,
            });
            set_is_refresh(!is_refresh_data)
		}).catch((err)=>{
            console.log(err)
			toast({
              title: '',
              description: err.response?.data,
              status: 'error',
              isClosable: true,
            });
		})
	}
	const handle_verify_email_account=async()=>{
		await Verify_Distributor_Email(payload).then(()=>{
			toast({
				title: '',
				description: `${client_data?.company_name}'s email has been verified.`,
				status: 'success',
                position:'top-left',
                variant:'left-accent',
                isClosable: true,
			});
		}).catch((err)=>{
			console.log(err)
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
		await Un_Verify_Distributor_Email(payload).then(()=>{
			toast({
				title: '',
				description: `${client_data?.company_name}'s email has been un verified.`,
				status: 'success',
                position:'top-left',
                variant:'left-accent',
                isClosable: true,
			});
		}).catch((err)=>{
			console.log(err)
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
	},[id,is_refresh_data]);

    const handle_subscribe_account=async()=>{
		await Subscribe_Distriutor(payload).then(()=>{
            toast({
                title: '',
                description: `${client_data?.company_name} account has been subscribed.`,
                status: 'success',
                position:'top-left',
                variant:'left-accent',
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
	const handle_un_subscribe_account=async()=>{
		await Un_Subscribe_Distriutor(payload).then(()=>{
            toast({
                title: '',
                description: `${client_data?.company_name} account has been unsubscribed.`,
                status: 'success',
                position:'top-left',
                variant:'left-accent',
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

    const get_products_data=async(email)=>{
		await Get_Products().then((response)=>{
			const data = response?.data
			//console.log(data)
			const result = data?.filter((item)=> item?.email_of_lister.toLowerCase().includes(email.toLowerCase()))
			set_products(result)

			const industry_values = result.map(item=>item?.industry)
			//console.log([...new Set(industry_values)])
			set_industries([...new Set(industry_values)])
			//console.log(result)
		}).catch((err)=>{
			console.log(err)
			toast({
				title: '',
				description: `${err.data}`,
				status: 'error',
				isClosable: true,
			});
		})
	}

    return(
        <Box gap='2' m={{
            base:'0',
            md:'8'
        }}>
            <Delete_Account_Modal is_delete_Modalvisible={is_delete_Modalvisible} set_is_delete_Modal_visible={set_is_delete_Modal_visible} distributor_data={client_data} acc_type={"distributor"} payload={payload} set_is_refresh={set_is_refresh} is_refresh_data={is_refresh_data}/>
            <SuspendAccountModal issuspendModalvisible={issuspendModalvisible} setissuspendModalvisible={setissuspendModalvisible} distributor_data={client_data} acc_type={"distributor"} payload={payload} set_is_refresh={set_is_refresh} is_refresh_data={is_refresh_data}/>
            <Un_Suspend_AccountModal is_un_suspend_Modal_visible={is_un_suspend_Modal_visible} set_is_un_suspend_Modal_visible={set_is_un_suspend_Modal_visible} distributor_data={client_data} acc_type={"distributor"} payload={payload} set_is_refresh={set_is_refresh} is_refresh_data={is_refresh_data}/>
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
                            <MenuItem _hover={{bg:'gray.300',borderRadius:'5',}}>
                                <HStack>
                                    <MarkEmailUnreadIcon/>
                                    <Link color='grey' fontSize='14px' href={`mailto: ${client_data?.email_of_company}`} isExternal>Email this user</Link>
                                </HStack>
                            </MenuItem>
                            <Divider/>
                            {client_data?.verification_status?  
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
                                    <Divider/>  
                                    {client_data?.subscription? 
                                        <MenuItem _hover={{bg:'gray.300',borderRadius:'5',}} onClick={handle_un_subscribe_account}>
                                            <HStack>
                                                <StarOutlineRoundedIcon/>
                                                <Text>Remove Subscription from this user</Text>
                                            </HStack>
                                        </MenuItem>
                                            : 
                                        <MenuItem _hover={{bg:'gray.300',borderRadius:'5',}} onClick={handle_subscribe_account}>
                                            <HStack>
                                                <StarRateRoundedIcon/>
                                                <Text>Subscribe this user</Text>
                                            </HStack>
                                        </MenuItem>
                                    }                                    
                                </Box>
                                :
                                (
                                    <MenuItem _hover={{bg:'gray.300',borderRadius:'5',}} onClick={handle_approve_distributor}>
                                        <HStack>
                                            <MarkEmailReadIcon/>
                                            <Text>Approve this user's acount</Text>
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
            {client_data?.suspension_status && client_data?.verification_status? 
                <Alert status='error' mt='2' borderRadius='md'>
                    <AlertIcon />
                    <AlertTitle>Account Status</AlertTitle>
                    <AlertDescription>This account has been suspended.</AlertDescription>
                </Alert>
                : null
            }
            {!client_data?.verification_status? 
                <Alert status='warning' mt='2' borderRadius='md'>
                    <AlertIcon />
                    <AlertTitle>Account Status</AlertTitle>
                    <AlertDescription>This account has not been approved.</AlertDescription>
                </Alert>
                : null
            }
            {!client_data?.valid_email_status ?
                <Alert status='warning' mt='2' borderRadius='md'>
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
                        name={client_data?.company_name}/>
                    <Box >
                        <Text 
                            fontSize={{
                                base:'lg',
                                md:'xl'
                            }} 
                            fontWeight='bold'
                        >
                            {client_data?.company_name}
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
                            {client_data?.valid_email_status? 
                                    <Badge bg='green.200' borderRadius='sm'>valid email</Badge> : 
                                    <Badge bg='gray.400' borderRadius='sm'>not valid email</Badge>
                            }
                            {client_data?.subscription? 
                                    <Badge bg='green.200' borderRadius='sm'>Subscribed</Badge> : 
                                    <Badge bg='gray.400' borderRadius='sm'>not Subscribed</Badge>
                            }
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
                        <Text fontWeight='bold' fontSize='lg'>Company Profile</Text>
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
                            <Text fontSize='sm' fontWeight='light'>{client_data?.address_of_company ? client_data?.address_of_company : '-'}</Text>
                        </HStack>
                        <HStack alignItems='center' mt='2'>
                            <InsertInvitationIcon/>
                            <Text fontSize='sm' fontWeight='light'>{moment( client_data?.joined_in).format("MMM Do YY")}</Text>
                        </HStack>
                    </Box>
                    <Box bg='#fff' p='4' borderRadius={'xl'} boxShadow={'md'} mt='2'>
                        <Text fontWeight='bold' fontSize='lg'>Account handler</Text>
                        <HStack alignItems='center' mt='2'>
                            <PersonIcon/>
                            <Text fontSize='sm' fontWeight='light'>{client_data?.contact_person_name ? client_data?.contact_person_name : '-'}</Text>
                        </HStack>
                        <HStack alignItems='center' mt='2'>
                            <EmailIcon/>
                            <Text fontSize='sm'>{client_data?.contact_email ? client_data?.contact_email : '-'}</Text>
                        </HStack>
                        <HStack alignItems='center' mt='3'>
                            <PhoneIcon/>
                            <Text fontSize='sm' fontWeight='light'>{client_data?.contact_mobile ? client_data?.contact_mobile : '-'}</Text>
                        </HStack>
                    </Box>
                </GridItem>
                {!client_data?.valid_email_status || !client_data?.verification_status? 
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
                        <Tabs>
                            <TabList>
                                <Tab>Details</Tab>
                                <Tab>Products</Tab>
                            </TabList>

                            <TabPanels>
                                <TabPanel>
                                    <Box
                                        p='4'
                                        bg='#fff'
                                        borderRadius='md'
                                        boxShadow='sm'
                                    >
                                    <HStack mb='2'>
                                        <Text fontWeight={'semibold'}>Viewed :</Text>
                                        <Text color='grey'>{client_data?.views}</Text>
                                    </HStack>
                                        <Text fontWeight='bold' fontSize='lg'>About</Text>
                                        <Text>{client_data?.description ? client_data?.description : '-'}</Text>
                                    </Box>
                                    <Box
                                        p='4'
                                        bg='#fff'
                                        borderRadius='md'
                                        boxShadow='sm'
                                        mt='2'
                                    >
                                        <Text fontWeight='bold' fontSize='lg'>Industries</Text>
                                        <Wrap>
                                            {industries?.map((item,index)=>{
                                                return(
                                                    <HStack>
                                                        <FiberManualRecordIcon style={{fontSize:'10'}}/>
                                                        <Text fontSize='sm' key={index}>{item}</Text>
                                                    </HStack>
                                                )
                                            })}
                                        </Wrap>
                                    </Box>
                                    <Box
                                        p='4'
                                        bg='#fff'
                                        borderRadius='md'
                                        boxShadow='sm'
                                        mt='2'      
                                    >
                                        <Text fontWeight='bold' fontSize='lg'>Experts</Text>
                                        <Accordion allowToggle>
                                            {client_data?.experts?.map((item,index)=>{
                                                return(
                                                    <AccordionItem key={index}>
                                                        <AccordionButton>
                                                            <HStack justify='space-between' flex='1'>
                                                                <HStack flex='1'>
                                                                    <Avatar name={item.name} size='md'/>
                                                                    <Box align='start'>
                                                                        <Text fontWeight='bold' fontSize='lg'>{item.name}</Text>
                                                                        <Text fontSize='sm' color='gray.400'>{item.email}</Text>
                                                                    </Box>
                                                                </HStack>
                                                                <AccordionIcon />
                                                            </HStack>
                                                        </AccordionButton>
                                                        <AccordionPanel pb={4}>
                                                            <HStack alignItems='center' mt='2'>
                                                                <EmailIcon style={{fontSize:'16'}}/>
                                                                <Text fontSize='sm'>{item?.email ? item?.email : '-'}</Text>
                                                            </HStack>
                                                            <HStack alignItems='center' mt='3'>
                                                                <PhoneIcon style={{fontSize:'16'}}/>
                                                                <Text fontSize='sm' fontWeight='light'>{item?.mobile ? item?.mobile : '-'}</Text>
                                                            </HStack>
                                                            <HStack alignItems='center' mt='2'>
                                                                <BusinessCenterIcon style={{fontSize:'16'}}/>
                                                                <Text fontSize='sm' fontWeight='light'>works as <span style={{fontWeight:'bold'}}>{item?.role ? item?.role : '-'}</span></Text>
                                                            </HStack>
                                                            <Text fontSize='md' mt='2' fontWeight='light'>{item?.description ? item?.description : '-'}</Text>
                                                        </AccordionPanel>
                                                    </AccordionItem>
                                                    )
                                                })}
                                        </Accordion>
                                    </Box>
                                    <Box
                                        p='4'
                                        bg='#fff'
                                        borderRadius='md'
                                        boxShadow='sm'
                                        mt='2'      
                                    >
                                        <Text fontWeight='bold' fontSize='lg'>Manufacturers</Text>
                                        <Accordion allowToggle>
                                            {client_data?.manufacturers?.map((item,index)=>{
                                                return(
                                                    <AccordionItem key={index}>
                                                        <AccordionButton>
                                                            <HStack justify='space-between' flex='1'>
                                                                <HStack flex='1'>
                                                                
                                                                    <Avatar size='md' icon={<HomeWorkIcon fontSize='1.5rem' />}/>
                                                                    <Box align='start'>
                                                                        <Text fontWeight='bold' fontSize='lg'>{item.name}</Text>
                                                                        <Text fontSize='sm' color='gray.400'>{item.email}</Text>
                                                                    </Box>
                                                                </HStack>
                                                                <AccordionIcon />
                                                            </HStack>
                                                        </AccordionButton>
                                                        <AccordionPanel pb={4}>
                                                            <HStack alignItems='center' mt='2'>
                                                                <EmailIcon style={{fontSize:'16'}}/>
                                                                <Text fontSize='sm'>{item?.email ? item?.email : '-'}</Text>
                                                            </HStack>
                                                            <HStack alignItems='center' mt='3'>
                                                                <PhoneIcon style={{fontSize:'16'}}/>
                                                                <Text fontSize='sm' fontWeight='light'>{item?.mobile ? item?.mobile : '-'}</Text>
                                                            </HStack>
                                                        </AccordionPanel>
                                                    </AccordionItem>
                                                    )
                                                })}
                                        </Accordion>
                                    </Box>
                                </TabPanel>
                                <TabPanel>
                                    <Box
                                        mt='2'      
                                    >
                                        {products?.map((item)=>{
                                            return(
                                                <HStack
                                                    bg='#fff'
                                                    borderRadius='md'
                                                    boxShadow='sm'
                                                    p='4'
                                                    my='2'
                                                    justify='space-between'
                                                >
                                                    <Box>
                                                        <Text 
                                                            color='#009393'
                                                            fontWeight='bold'
                                                        >
                                                            {item.name_of_product}
                                                        </Text>
                                                        
                                                        <HStack fontSize='xs' color='gray.400'>
                                                            <HStack>
                                                                <FiberManualRecordIcon style={{fontSize:'10'}}/>
                                                                <Text>{item.industry? item.industry : '-'}</Text>
                                                            </HStack>
                                                            <HStack>
                                                                <FiberManualRecordIcon style={{fontSize:'10'}}/>
                                                                <Text>{item.technology? item.technology : '-'}</Text>
                                                            </HStack>                                                            
                                                        </HStack>
                                                        {item?.sponsored ? 
                                                            (
                                                                <Tag bg='green.100'>
                                                                    featured
                                                                </Tag>
                                                            )
                                                            :(
                                                                <Tag bg='gray.200'>
                                                                    not featured
                                                                </Tag>
                                                            )
                                                        }
                                                    </Box>
                                                    <Menu >
                                                        <MenuButton >
                                                            <MoreVertIcon/>
                                                        </MenuButton>
                                                        <MenuList onClick={(()=>{router.push(`/inventory_new/product/${item?._id}`)})}>
                                                            <MenuItem >View</MenuItem>
                                                        </MenuList>
                                                    </Menu>
                                                </HStack>
                                            )
                                        })}                                       
                                    </Box>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </GridItem>
                }
            </Grid>
        </Box>
    )
}