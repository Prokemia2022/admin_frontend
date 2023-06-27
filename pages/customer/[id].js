import React,{useState,useEffect}from 'react';
import {Flex,Text,Button,useToast,Image,Link,Divider} from '@chakra-ui/react';
import {useRouter} from 'next/router'
import { RWebShare } from "react-web-share";
//comoponents imports
import Header from '../../components/Header.js';
import SuspendAccountModal from '../../components/modals/suspendAccount.js';
import Un_Suspend_AccountModal from '../../components/modals/Un_Suspend_Account.js';
import Delete_Account_Modal from '../../components/modals/delete_account.js';
//api calls
import Get_Client from '../api/clients/get_client.js';
import Verify_Client_Email from '../api/clients/verify_client_email.js';
import Un_Verify_Client_Email from '../api/clients/un_verify_client_email.js';
//icons
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';

import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import UnsubscribeIcon from '@mui/icons-material/Unsubscribe';
import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';
import EditNoteIcon from '@mui/icons-material/EditNote';
//utils
import jwt_decode from "jwt-decode";
import Cookies from 'universal-cookie';
import moment from 'moment';

function Customer(){
	const [issuspendModalvisible,setissuspendModalvisible]=useState(false);
	const [is_un_suspend_Modal_visible,set_is_un_suspend_Modal_visible]=useState(false);
	const [is_delete_Modalvisible,set_is_delete_Modal_visible]=useState(false);

	const router = useRouter()
	const query = router.query;
	const toast = useToast();
	const id = query?.id

	const [client_data,set_client_data] = useState('');
	const [is_refresh_data,set_is_refresh]=useState(null);

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
		if (!id ){
			toast({
              title: '',
              description: `...broken link, taking you back`,
              status: 'info',
			  variant:'subtle',
			  position:'top-left',
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
	},[id,is_refresh_data])
	return(
		<Flex direction='column' gap='2'>
			<SuspendAccountModal issuspendModalvisible={issuspendModalvisible} setissuspendModalvisible={setissuspendModalvisible} client_data={client_data} acc_type={"client"} payload={payload} set_is_refresh={set_is_refresh} is_refresh_data={is_refresh_data}/>
			<Un_Suspend_AccountModal is_un_suspend_Modal_visible={is_un_suspend_Modal_visible} set_is_un_suspend_Modal_visible={set_is_un_suspend_Modal_visible} client_data={client_data} acc_type={"client"} payload={payload} set_is_refresh={set_is_refresh} is_refresh_data={is_refresh_data}/>
			<Delete_Account_Modal is_delete_Modalvisible={is_delete_Modalvisible} set_is_delete_Modal_visible={set_is_delete_Modal_visible} client_data={client_data} acc_type={"client"} payload={payload}/>
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
					<Flex direction='column' pl='2' fontSize='14px'>
						<Text fontSize='24px' fontWeight='bold'>{client_data?.first_name} {client_data?.last_name}</Text>
						{client_data?.valid_email_status?
							<Flex align='center' gap='1' color='#009393'>
								<MarkEmailReadIcon style={{fontSize:'18px'}}/>
								<Text >Verified Email</Text>
							</Flex>
							:
							<Flex align='center' gap='1' color='grey'>
								<UnsubscribeIcon style={{fontSize:'18px'}}/>
								<Text textDecoration='1px solid line-through' >Verified Email</Text>
							</Flex>
						}
						{client_data?.suspension_status?
							<Flex align='center' gap='1'>
								<DisabledByDefaultRoundedIcon style={{fontSize:'18px',color:'red'}}/>
								<Text color='red' >Suspended</Text>
							</Flex>
							:
							<Flex align='center' gap='1' color='grey'>
								<DisabledByDefaultRoundedIcon style={{fontSize:'18px'}}/>
								<Text textDecoration='1px solid line-through' >Suspended</Text>
							</Flex>
						}
					</Flex>
				</Flex>
				<Flex flex='1' gap='2' p='2' direction='column' bg='#fff' m='2' borderRadius='5px' boxShadow='sm'>
					<Text><span style={{color:'grey'}}>Email:</span>&ensp;&ensp;&ensp;&ensp;&ensp;{client_data?.email_of_company}</Text>
					<Text><span style={{color:'grey'}}>Mobile:</span>&ensp;&ensp;&ensp;&ensp;{client_data?.mobile_of_company}</Text>
					<Text><span style={{color:'grey'}}>Gender:</span>&ensp;&ensp;&ensp;&ensp;{client_data?.gender}</Text>
					<Text><span style={{color:'grey'}}>Company:</span>&ensp;&nbsp;{client_data?.company_name}</Text>
					<Text><span style={{color:'grey'}}>Address</span>&ensp;&ensp;&ensp;&nbsp;{client_data?.address}</Text>
					<Text><span style={{color:'grey'}}>Joined in:</span>&ensp;&nbsp;&nbsp;{moment( client_data?.joined_in).format("MMM Do YY")}</Text>
				</Flex>
				<Flex flex='1' gap='2' p='2' direction='column' bg='#fff' m='2' borderRadius='5px' boxShadow='sm'>
					<Text><span style={{color:'grey'}}>Position:</span>&ensp;&ensp;&nbsp;{client_data?.position}</Text>
				</Flex>
				<Flex p='2' gap='2' direction={'column'} bg='#e3e3e3' borderRadius={'5'}>
					<Flex fontWeight={'bold'} borderBottom={'1px solid #fff'} pb='2'>
						<EditNoteIcon/>
						<Text >Actions</Text>
					</Flex>
					<Flex gap='3' align='center' borderBottom={'1px solid #fff'} pb='2'>
						<MarkEmailUnreadIcon style={{fontSize:'16px',}}/>
						<Link color='grey' fontSize='14px' href={`mailto: ${client_data?.email_of_company}`} isExternal>Email customer</Link>
					</Flex>
					{client_data?.valid_email_status? 
						<Flex align='center' gap='2' cursor='pointer' onClick={handle_un_verify_email_account} borderBottom={'1px solid #fff'} pb='2'>
							<UnsubscribeIcon style={{fontSize:'20px',}}/>
							<Text color='grey' fontSize='14px'>Un verify email from this customer</Text>
						</Flex>
							: 
						<Flex align='center' gap='2' cursor='pointer'onClick={handle_verify_email_account} borderBottom={'1px solid #fff'} pb='2'>
							<MarkEmailReadIcon style={{fontSize:'20px',}}/>
							<Text color='grey' fontSize='14px'>verify email from this customer</Text>
						</Flex>
					}
					{client_data?.suspension_status? 
						<Flex align='center' gap='2' cursor='pointer' onClick={(()=>{set_is_un_suspend_Modal_visible(true)})} borderBottom={'1px solid #fff'} pb='2'>
							<AccountCircleRoundedIcon style={{fontSize:'20px',}}/>
							<Text color='grey' fontSize='14px'>Un suspend this account</Text>
						</Flex>
							: 
						<Flex align='center' gap='2' cursor='pointer' onClick={(()=>{setissuspendModalvisible(true)})} borderBottom={'1px solid #fff'} pb='2'>
							<NoAccountsIcon style={{fontSize:'20px',}}/>
							<Text color='grey' fontSize='14px'>Suspend this account</Text>
						</Flex>
					}
					<Flex align='center' gap='2' cursor='pointer' onClick={(()=>{set_is_delete_Modal_visible(true)})}>
						<DeleteRoundedIcon style={{fontSize:'20px',}}/>
						<Text color='red' fontWeight='bold'>Delete this account</Text>
					</Flex>
				</Flex>
				
			</Flex>
		</Flex>
	)
}

export default Customer