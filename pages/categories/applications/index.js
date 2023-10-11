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
    Divider,
} from '@chakra-ui/react';
//components
import Navigation from '../../../components/Navigation';
import {useRouter} from 'next/router';
//api
import Get_Applications from "../../api/careers/get_applications";
//icons
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded';
import EmailIcon from '@mui/icons-material/Email';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
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
	
	const [applications_data, set_applications_data]=useState([]);
	const [total, set_total]=useState([]);
	const [query, set_query]=useState('');
    const [refresh, set_refresh]=useState(null);

	const fetch_data=async()=>{
		await Get_Applications().then((response)=>{
			//console.log(response.data)
			const data = response.data;
			set_total(data.length);
            set_applications_data(data);
		})
	}
	
	useEffect(()=>{
		fetch_data()
	},[query,refresh]);

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
                        <BreadcrumbLink>applications</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
            </HStack>
            <Box gap='2' bg='#fff' borderRadius={5} p='4' mt='2'>
                {applications_data?.map((item)=>{
                    return(
                        <Application_Card_Item key={item?._id} item={item} auth_role={auth_role} set_refresh={set_refresh} refresh={refresh}/>
                    )
                })}
                
            </Box>
        </Box>
    )
}

const Application_Card_Item=({item,auth_role,set_refresh,refresh})=>{
    let time = moment(item?.createdAt).format('MMM Do YYYY, h:mm a');
	return(
        <Accordion allowToggle>
            <AccordionItem >
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
                        <EmailIcon style={{fontSize:'16'}}/>
                        <Link fontSize='sm' href={`mailto: ${item?.email}`} isExternal>{item?.email ? item?.email : '-'}</Link>
                    </HStack>
                    <HStack alignItems='center' mt='2'>
                        <Text fontSize='md'>Address {item?.address ? item?.address : '-'}</Text>
                    </HStack>
                    <HStack alignItems='center' mt='2'>
                        <Text fontSize='md'>Gender: {item?.gender ? item?.gender : '-'}</Text>
                    </HStack>
                    <HStack alignItems='center' mt='2'>
                        <Text fontSize='md'>Mobile: {item?.mobile ? item?.mobile : '-'}</Text>
                    </HStack>
                    <HStack alignItems='center' my='2'>
                        <Text fontSize='md'>LinkedIn: {item?.linkedInUrl ? item?.linkedInUrl : '-'}</Text>
                    </HStack>
                    <Link href={item?.resume_url} bg='#fff' border='1px' borderColor='grey' borderRadius={5} p='2' mt='2' flex='1' w='full' alignItems={'center'} isExternal>
                        <InsertDriveFileIcon style={{color:'#EA9DB0',fontSize:'20px'}} /> 
                        Resume/Application letter
                    </Link>
                    <HStack alignItems='center' my='2'>
                        <Text fontSize='md'>{item?.cover_head ? item?.cover_head : '-'}</Text>
                    </HStack>
                    <Text color='#009393' my='2' fontWeight='bold'>Job Details</Text>
                    <Divider/>
                    <HStack alignItems='center' mt='2'>
                        <Text fontSize='md' fontWeight='bold'>{item?.career_title ? item?.career_title : '-'}</Text>
                    </HStack>
                    <HStack alignItems='center' mt='2'>
                        <Text fontSize='md'>{item?.career_description ? item?.career_description : '-'}</Text>
                    </HStack>
                    
                </AccordionPanel>
            </AccordionItem>
        </Accordion>		
    )
}