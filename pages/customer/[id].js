import React,{useState,useEffect}from 'react';
import {Flex,Text,Button,useToast,Image,Link,Divider} from '@chakra-ui/react';
import {useRouter} from 'next/router'
import { RWebShare } from "react-web-share";
//comoponents imports
import Header from '../../components/Header.js';
import SuspendAccountModal from '../../components/modals/suspendAccount.js';
import Un_Suspend_AccountModal from '../../components/modals/Un_Suspend_Account.js';
//api calls
import Get_Client from '../api/clients/get_client.js';
import Suspend_Client from '../api/clients/suspend_client_account.js'
//icons
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
//utils
import jwt_decode from "jwt-decode";
import Cookies from 'universal-cookie';
import moment from 'moment';

function Customer(){
	const [issuspendModalvisible,setissuspendModalvisible]=useState(false);
	const [is_un_suspend_Modal_visible,set_is_un_suspend_Modal_visible]=useState(false);
	const router = useRouter()
	const query = router.query;
	const toast = useToast();
	const id = query?.id

	const [client_data,set_client_data] = useState('')
	const [recents,set_recents]=useState(client_data?.recents);

	const cookies = new Cookies();
    let token = cookies.get('admin_token');
    const [auth_role,set_auth_role]=useState("")

	const payload = {
		_id : id,
		auth_role
	}
	//console.log(payload)

	const get_data=async(payload)=>{
		await Get_Client(payload).then((response)=>{
			console.log(response?.data)
			return set_client_data(response?.data)
		})
	}
	useEffect(()=>{
		if (!payload || id === undefined){
			toast({
              title: '',
              description: `...broken link, taking you back`,
              status: 'info',
              isClosable: true,
            });
			router.push('/customers')
		}else{
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
	},[])
	return(
		<Flex direction='column' gap='2'>
			<SuspendAccountModal issuspendModalvisible={issuspendModalvisible} setissuspendModalvisible={setissuspendModalvisible} client_data={client_data} acc_type={"client"} payload={payload}/>
			<Un_Suspend_AccountModal is_un_suspend_Modal_visible={is_un_suspend_Modal_visible} set_is_un_suspend_Modal_visible={set_is_un_suspend_Modal_visible} client_data={client_data} acc_type={"client"} payload={payload}/>
			<Header />
			<Flex direction='column' p='1'>
				<Flex mt='-2' p='2' mb={'-2'} fontSize={'10px'} color='grey' gap='1' fontWeight={'bold'}>
					<Text cursor='pointer' color='#009393' onClick={(()=>{router.push('/dashboard')})}>Dashboard</Text>
					<Text>&gt;</Text>
					<Text onClick={(()=>{router.back()})} cursor={'pointer'}>customers</Text>
					<Text>&gt;</Text>
					<Text>{client_data?._id}</Text>		
				</Flex>
				<Flex p='1' align='center' cursor={'pointer'} onClick={(()=>{router.back()})}>
					<ArrowBackRoundedIcon style={{fontSize:'20px'}}/>
					<Text>back</Text>
				</Flex>
				<Flex gap='2' p='2'>
					{client_data?.profile_photo_url == '' || !client_data?.profile_photo_url? 
						<Flex gap='2' >
							<AccountCircleIcon style={{fontSize:'150px',backgroundColor:"#eee",borderRadius:'150px'}} />
						</Flex>
					: 
						<Flex gap='2' >
							<Image borderRadius='5' boxSize='150px' src={client_data?.profile_photo_url} alt='profile photo' boxShadow='lg' objectFit='cover'/>
						</Flex>
					}
					<Flex direction='column'>
						<Text fontSize='24px' ml='2' fontWeight='bold'>{client_data?.first_name} {client_data?.last_name}</Text>
						{client_data?.suspension_status? 
							<Text fontWeight='bold' color='red' p='1' m='1'>Suspended</Text>
							: null
						}
					</Flex>
				</Flex>
				<Flex flex='1' gap='2' p='2' direction='column' bg='#fff' m='2' borderRadius='5px' boxShadow='md'>
					<Text><span style={{color:'grey'}}>Email:</span>&ensp;&ensp;&ensp;&ensp;&ensp;{client_data?.email_of_company}</Text>
					<Text><span style={{color:'grey'}}>Mobile:</span>&ensp;&ensp;&ensp;&ensp;{client_data?.mobile_of_company}</Text>
					<Text><span style={{color:'grey'}}>Company:</span>&ensp;&nbsp;{client_data?.company_name}</Text>
					<Text><span style={{color:'grey'}}>Address</span>&ensp;&ensp;&ensp;&nbsp;{client_data?.address}</Text>
					<Text><span style={{color:'grey'}}>Joined in:</span>&ensp;&nbsp;&nbsp;{moment( client_data?.joined_in).format("MMM Do YY")}</Text>
				</Flex>
				<Flex flex='1' gap='2' p='2' direction='column' bg='#fff' m='2' borderRadius='5px' boxShadow='md'>
					<Text><span style={{color:'grey'}}>Position:</span>&ensp;&ensp;&nbsp;{client_data?.position}</Text>
				</Flex>
				<Flex p='3' gap='2' direction={'column'} mt='-4'>
					<Text color='grey'>Actions</Text>
					<Divider/>
					<Flex gap='3' align='center'>
						<MarkEmailUnreadIcon style={{fontSize:'16px',color:'grey'}}/>
						<Link color='grey' fontSize='14px' href={`mailto: ${client_data?.email_of_salesperson}`} isExternal>Email salesperson</Link>
					</Flex>
					{client_data?.suspension_status? 
						<Flex align='center' gap='2' cursor='pointer' onClick={(()=>{set_is_un_suspend_Modal_visible(true)})}>
							<AccountCircleRoundedIcon style={{fontSize:'20px',color:'grey'}}/>
							<Text color='grey' fontSize='14px'>Un suspend account</Text>
						</Flex>
							: 
						<Flex align='center' gap='2' cursor='pointer' onClick={(()=>{setissuspendModalvisible(true)})}>
							<NoAccountsIcon style={{fontSize:'20px',color:'grey'}}/>
							<Text color='grey' fontSize='14px'>Suspend Account</Text>
						</Flex>
					}
					<Flex align='center' gap='2' cursor='pointer'>
						<DeleteRoundedIcon style={{fontSize:'20px',color:'grey'}}/>
						<Text color='red' fontWeight='bold'>Delete Account</Text>
					</Flex>
				</Flex>
				
			</Flex>
		</Flex>
	)
}

export default Customer