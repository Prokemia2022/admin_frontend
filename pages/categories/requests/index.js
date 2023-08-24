import React, { useEffect, useState } from "react";
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
    Tabs,
    TabList,
    Tab,
    TabIndicator,
    Avatar,
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    useToast,
    AccordionItem,
    AccordionButton,
    AccordionIcon,
    AccordionPanel,
    Link,
    Accordion,
} from '@chakra-ui/react';
//components
import Navigation from '../../../components/Navigation';
import {useRouter} from 'next/router';
//api
import Fetch_Tickets from '../../api/Support/Request_Demo_Tickets/fetch_tickets.js';
import Mark_Ticket_As_Solved from '../../api/Support/Request_Demo_Tickets/mark_ticket_as_solved.js';
import Un_Mark_Ticket_As_Solved from '../../api/Support/Request_Demo_Tickets/un_mark_ticket_as_solved.js';
import Delete_Ticket from '../../api/Support/Request_Demo_Tickets/delete_ticket.js';
//icons
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded';
import EmailIcon from '@mui/icons-material/Email';
//utils
import moment from 'moment';
import Cookies from 'universal-cookie';
import jwt_decode from "jwt-decode";

export default function Requests(){
    return(
        <Navigation >
            <Body/>
        </Navigation>
    )
}

const Body=()=>{
    const router = useRouter();
    const cookies = new Cookies();
    let token = cookies.get('admin_token');
    const [auth_role,set_auth_role]=useState("")
    const [auth_user_name,set_auth_user_name]=useState("")
	
	const [ticket_data, set_ticket_data]=useState([]);
	const [total, set_total]=useState([]);
	const [query, set_query]=useState('');
    const [sort, set_sort]=useState('');
    const [refresh, set_refresh]=useState(null);

	const fetch_data=async()=>{
		await Fetch_Tickets().then((response)=>{
			//console.log(response.data)
			const data = response.data.reverse();
            const sorted_data =(result)=>{
				switch (sort){
					case 'descending':
						return result.sort((a, b) => a.name.localeCompare(b.name))
					case 'ascending':
						return result.sort((a, b) => b.name.localeCompare(a.name))
					case 'completed':
						return result?.filter((item) => item.completed_status)
					case 'not completed':
						return result?.filter((item) => !item.completed_status)
					default:
						return result.sort((a, b) => a.name.localeCompare(b.name))
				}
			}
			set_total(data.length);
			const result = data?.filter((item) => item?.name.toLowerCase().includes(query.toLowerCase()) || item?.email.toLowerCase().includes(query.toLowerCase()));
            const sorted_result = sorted_data(result);
			set_ticket_data(sorted_result);
		})
	}
	
	useEffect(()=>{
		fetch_data()
	},[query,refresh,sort])

    useEffect(()=>{
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
	        set_auth_role(decoded?.role);
            set_auth_user_name(decoded?.user_name);
	      }
	},[])
    const Clear_Filter=()=>{
        set_sort('');
        set_query('');
    }
    return (
        <Box gap='2'>
            <HStack justifyContent={'space-between'}>
                <Breadcrumb spacing='5px' alignItems={'center'} fontSize={'sm'} fontWeight={'semibold'}>
                    <BreadcrumbItem>
                        <BreadcrumbLink href='/dashboard_new'>Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem isCurrentPage>
                        <BreadcrumbLink>Demo requests</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
            </HStack>
            <Box gap='2' bg='#fff' borderRadius={5} p='4' mt='2'>
                {ticket_data?.map((item)=>{
                    return(
                        <Ticket_Card_Item key={item?._id} item={item} auth_role={auth_role} set_refresh={set_refresh} refresh={refresh} auth_user_name={auth_user_name}/>
                    )
                })}
            </Box>
        </Box>
    )
}

const Ticket_Card_Item=({item,auth_role,set_refresh,refresh,auth_user_name})=>{
    let time = moment(item?.createdAt).format('MMM Do YYYY, h:mm a');
    const toast = useToast()
	const payload = {
		_id : item?._id,
		auth_role,
        completed_by:auth_user_name
	}
    const Handle_Mark_As_Solved=async()=>{
        await Mark_Ticket_As_Solved(payload).then((res)=>{
            toast({
				title: 'Ticket has been updated successfully',
				position: 'top-left',
				variant:"subtle",
				description: `Ticket has been marked as solved`,
				status: 'success',
				isClosable: true,
			});
		}).then(()=>{
            set_refresh(!refresh)
        }).catch((err)=>{
			toast({
				title: 'Ticket update failed',
				position: 'top-left',
				variant:"subtle",
				description: err.response.data,
				status: 'error',
				isClosable: true,
			});
		})
    }
    const Handle_Un_Mark_As_Solved=async()=>{
        await Un_Mark_Ticket_As_Solved(payload).then((res)=>{
            toast({
				title: 'Ticket has been updated successfully',
				position: 'top-left',
				variant:"subtle",
				description: `Ticket has been unmarked as solved`,
				status: 'success',
				isClosable: true,
			});
		}).then(()=>{
            set_refresh(!refresh)
        }).catch((err)=>{
			toast({
				title: 'Ticket update failed',
				position: 'top-left',
				variant:"subtle",
				description: err.response.data,
				status: 'error',
				isClosable: true,
			});
		})
    }
    const Handle_Delete=async()=>{
        await Delete_Ticket(payload).then((res)=>{
            toast({
				title: 'Ticket has been deleted successfully',
				position: 'top-left',
				variant:"subtle",
				description: ``,
				status: 'success',
				isClosable: true,
			});
		}).then(()=>{
            set_refresh(!refresh)
        }).catch((err)=>{
			toast({
				title: 'Ticket deletion failed',
				position: 'top-left',
				variant:"subtle",
				description: err.response.data,
				status: 'error',
				isClosable: true,
			});
		})
    }
	return(
        <Accordion allowToggle>
            <AccordionItem borderLeft={item?.completed_status?'2px':''} borderColor={item?.completed_status?'green.200':''}>
                <AccordionButton>
                    <HStack justify='space-between' flex='1' >
                        <HStack flex='1'  >
                            <Avatar size='sm' icon={<PersonIcon fontSize='1.5rem' />} name={item.name}/>
                            <Box align='start'>
                                <Text fontWeight='bold' fontSize='lg'>{item.name}</Text>
                                <Text fontSize='sm' color='gray.400'>{item.email}</Text>
                                <Text fontSize='sm' color='#000'>{moment(item?.createdAt).format('MMM Do YYYY, h:mm a')}</Text>
                            </Box>
                        </HStack>
                        <AccordionIcon />
                    </HStack>
                </AccordionButton>
                <AccordionPanel pb={4}>
                    <HStack alignItems='center' mt='2'>
                        <Text fontSize='lg'>Works as : {item?.job_function ? item?.job_function : '-'}</Text>
                    </HStack>
                    <HStack alignItems='center' mt='2'>
                        <EmailIcon style={{fontSize:'16'}}/>
                        <Link fontSize='sm' href={`mailto: ${item?.email}`} isExternal>{item?.email ? item?.email : '-'}</Link>
                    </HStack>
                    {item?.completed_by?
                        <Text color='grey' fontSize='md' mt='2'>Resolved by: {item?.completed_by}</Text>
                        :
                        null
                    }
                    <HStack alignItems='center' mt='3'>
                        {item?.completed_status?
                            <Button bg='teal.200' onClick={Handle_Un_Mark_As_Solved}>
                               Un Resolve ticket
                            </Button>
                            :
                            <Button bg='teal.200' onClick={Handle_Mark_As_Solved}>
                                Resolve ticket
                            </Button>
                        }
                    </HStack>
                </AccordionPanel>
            </AccordionItem>
        </Accordion>		
    )
}