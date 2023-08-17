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
import Get_Support_questions from '../../api/Support/fetch_support_questions.js';
import Mark_Support_As_Solved from '../../api/Support/mark_support_as_solved.js';
import Un_Mark_Support_As_Solved from '../../api/Support/un_mark_support_as_solved.js';
import Delete_Support_Question from '../../api/Support/delete_support_question.js';
//icons
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded';
import EmailIcon from '@mui/icons-material/Email';
//utils
import moment from 'moment';
import Cookies from 'universal-cookie';
import jwt_decode from "jwt-decode";

export default function Tickets(){
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
	
	const [support_data, set_support_data]=useState([]);
	const [total, set_total]=useState([]);
	const [query, set_query]=useState('');
    const [refresh, set_refresh]=useState(null);

	const fetch_support_data=async()=>{
		await Get_Support_questions().then((response)=>{
			//console.log(response.data)
			const data = response.data;
			set_total(data.length);
			const result = data?.filter((item) => item?.name.toLowerCase().includes(query.toLowerCase()) || item?.email.toLowerCase().includes(query.toLowerCase()));
			set_support_data(result);
		})
	}
	
	useEffect(()=>{
		fetch_support_data()
	},[query,refresh])
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
	        set_auth_role(decoded?.role)
	      }
	},[])
    
    return (
        <Box gap='2'>
            <HStack justifyContent={'space-between'}>
                <Breadcrumb spacing='5px' alignItems={'center'} fontSize={'sm'} fontWeight={'semibold'}>
                    <BreadcrumbItem>
                        <BreadcrumbLink href='/dashboard_new'>Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem isCurrentPage>
                        <BreadcrumbLink>tickets</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
            </HStack>
            <Box gap='2' bg='#fff' borderRadius={5} p='4' mt='2'>
                {support_data?.map((item)=>{
                    return(
                        <Support_Card_Item key={item?._id} item={item} auth_role={auth_role} set_refresh={set_refresh} refresh={refresh}/>
                    )
                })}
                
            </Box>
        </Box>
    )
}

const Support_Card_Item=({item,auth_role,set_refresh,refresh})=>{
    let time = moment(item?.createdAt).format('MMM Do YYYY, h:mm a');
    const toast = useToast()
	const payload = {
		_id : item?._id,
		auth_role
	}
    const Handle_Mark_As_Solved=async()=>{
        await Mark_Support_As_Solved(payload).then((res)=>{
            toast({
				title: 'Support question has been updated successfully',
				position: 'top-left',
				variant:"subtle",
				description: `Support question has been marked as solved`,
				status: 'success',
				isClosable: true,
			});
		}).then(()=>{
            set_refresh(!refresh)
        }).catch((err)=>{
			toast({
				title: 'Support question update failed',
				position: 'top-left',
				variant:"subtle",
				description: err.response.data,
				status: 'error',
				isClosable: true,
			});
		})
    }
    const Handle_Un_Mark_As_Solved=async()=>{
        await Un_Mark_Support_As_Solved(payload).then((res)=>{
            toast({
				title: 'Support question has been updated successfully',
				position: 'top-left',
				variant:"subtle",
				description: `Support question has been unmarked as solved`,
				status: 'success',
				isClosable: true,
			});
		}).then(()=>{
            set_refresh(!refresh)
        }).catch((err)=>{
			toast({
				title: 'Support question update failed',
				position: 'top-left',
				variant:"subtle",
				description: err.response.data,
				status: 'error',
				isClosable: true,
			});
		})
    }
    const Handle_Delete=async()=>{
        await Delete_Support_Question(payload).then((res)=>{
            toast({
				title: 'Support question has been deleted successfully',
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
				title: 'Support question deletion failed',
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
            <AccordionItem borderLeft={item?.solved?'2px':''} borderColor={item?.solved?'green.200':''}>
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
                        <Text fontSize='lg'>{item?.message ? item?.message : '-'}</Text>
                    </HStack>
                    <HStack alignItems='center' mt='2'>
                        <EmailIcon style={{fontSize:'16'}}/>
                        <Link fontSize='sm' href={`mailto: ${item?.email}`} isExternal>{item?.email ? item?.email : '-'}</Link>
                    </HStack>
                    <HStack alignItems='center' mt='3'>
                        {item?.solved?
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