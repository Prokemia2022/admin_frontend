import React,{useEffect, useState} from 'react'
import {Flex,Text,Button,Input,Image,InputGroup,InputRightElement,useToast,Link} from '@chakra-ui/react';
import Header from '../../components/Header.js';
import AddNewAdmin from '../../components/modals/Admin/AddNewAdmin.js';
import RemoveAdmin from '../../components/modals/Admin/RemoveAdmin.js';
import Edit_Admin_User_Modal from '../../components/modals/Admin/Edit_Admin_User.js';
import Get_Admin_Users from '../api/auth/get_admin_users?.js';
import jwt_decode from "jwt-decode";
import Cookies from 'universal-cookie';
import {useRouter} from 'next/router'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {Visibility,VisibilityOff} from '@mui/icons-material'
import CircleIcon from '@mui/icons-material/Circle';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import styles from '../../styles/Permissions&Accounts.module.css';
import LogoutIcon from '@mui/icons-material/Logout';
import Edit_Admin_User from '../api/auth/edit_admin_user.js';

export default function User_Management(){
	const [isaddnewadminModalvisible,setisaddnewadminModalvisible]=useState(false);
	
	const [users,set_users]=useState([]);
	const [total_users,set_total_users]=useState([]);
	const [auth_role,set_auth_role]=useState("")
	const [query,set_query]=useState('');
	const [is_refresh,set_is_refresh]=useState(null);

	const cookies = new Cookies();
	const router = useRouter	();
	let token = cookies.get('admin_token');
	
	useEffect(()=>{
		let decoded = jwt_decode(token);
		
		//console.log(decoded)
		if (decoded.role === 'Tech Support' || decoded.role === 'Manager'){
			set_auth_role(decoded.role)
			fetch_users()
		}else{
			router.back()
		}
	},[query,is_refresh]);

	const fetch_users=async()=>{
		Get_Admin_Users().then((response)=>{
			////console.log(response.data.sort((a, b) => b.login_status - a.login_status))
			set_total_users(response?.data);
			let sorted_users = response.data.sort((a, b) => b.login_status - a.login_status);
			let filtered_users = sorted_users.filter((user) => 	user?.user_name.toLowerCase().includes(query.toLowerCase()) || user?.user_email?.includes(query) || user?.role.toLowerCase().includes(query.toLowerCase()))
			////console.log(filtered_users)
			set_users(filtered_users)
		}).catch((err)=>{
			//console.log(err)
		})
	}
	return(
		<Flex direction='column' h='100vh'>
			<Header />
			<AddNewAdmin isaddnewadminModalvisible={isaddnewadminModalvisible} setisaddnewadminModalvisible={setisaddnewadminModalvisible}/>
			<Flex direction='column' p='2' gap='2' bg='#eee' h='100vh'>
				<Flex className={styles.page_infomation_details_Body} gap='3'>
					<Flex className={styles.page_infomation_details_Description} >
						<Text fontSize='28px' fontWeight='bold' className={styles.page_infomation_details_Title}>User Management</Text>
						<Flex fontSize={'12px'} color='grey' gap='1' fontWeight={'bold'} className={styles.page_infomation_details_Link}>
							<Text cursor='pointer' color='#009393' onClick={(()=>{router.push('/dashboard')})}>Dashboard</Text>
							<Text>&gt;</Text>
							<Text>Permissions&Accounts</Text>
							<Text>&gt;</Text>
							<Text>User Management</Text>		
						</Flex>
					</Flex>
					<Flex gap='2' mr='2' className={styles.page_infomation_details_Search}>
						<InputGroup size='md' bg='#fff' borderRadius={'5px'} fontWeight={'bold'}>
							<Input
								type='text'
								placeholder='Search User'
								fontWeight={'bold'}
								value={query}
								onChange={((e)=>{set_query(e.target.value)})}
							/>
							<InputRightElement >
								{query.length > 0? <CloseIcon cursor='pointer' onClick={(()=>{set_query('')})}/> : <SearchIcon/>}
							</InputRightElement>
						</InputGroup>
						<Button bg='#009393' onClick={(()=>{setisaddnewadminModalvisible(true)})}>
							<Text color='#fff' >Add User</Text>
						</Button>
					</Flex>
				</Flex>
				<Flex direction={'column'} pt='2' pb='2' className={styles.fetched_data_body}>
					<Flex p='2' pt='4' pb='4' bg='#fff'>
						<Text fontSize={'12px'} color='grey'>showing <span style={{color:'#009393',fontWeight:'bold'}}>{users?.length}</span> of <span style={{color:'#009393',fontWeight:'bold'}}>{total_users?.length}</span> total users</Text>
					</Flex>
					<Flex direction='column' gap='1' className={styles.fetched_data_container}>
						{users?.map((user)=>{
							return(
								<Admin_User_Card_Item set_is_refresh={set_is_refresh} user={user} key={user?._id} auth_role={auth_role}/>
							)
						})}
					</Flex>
				</Flex>
			</Flex>
		</Flex>
	)
}

const Admin_User_Card_Item=({user,auth_role,set_is_refresh})=>{
	const router = useRouter();
    const toast = useToast();

	const [isremoveModalvisible,setisremoveModalvisible]=useState(false);
	const [is_edit_admin_Modalvisible,set_is_edit_admin_Modalvisible]=useState(false);
	const payload = {
		_id: user?._id,
        login_status: false,
        auth_role
    }
	const Logout_User=async()=>{
		await Edit_Admin_User(payload).then(()=>{
			toast({
				position: 'top-left',
				variant:"subtle",
				title:'',
				description: `${user?.user_name} account has been signed out`,
				status: 'success',
				isClosable: true,
			});
		  }).catch((err)=>{
			//console.log(err)
				toast({
					position: 'top-left',
					variant:"subtle",
					title: '',
					description: err.response.data,
					status: 'error',
					isClosable: true,
				})
			}).finally(()=>{
				set_is_refresh(true);
			})
	}
	return(
		<Flex gap='2' borderTop='1px solid #eee' className={styles.user_card_item_body}>
			<RemoveAdmin isremoveModalvisible={isremoveModalvisible} setisremoveModalvisible={setisremoveModalvisible} admin_data={user}/>
			<Edit_Admin_User_Modal is_edit_admin_Modalvisible={is_edit_admin_Modalvisible} set_is_edit_admin_Modalvisible={set_is_edit_admin_Modalvisible} admin_data={user}/>
			<Flex gap='1' align='center'>
				{user.login_status? <CircleIcon style={{fontSize:'12px',color:'#5eff00'}}/> : <CircleIcon style={{fontSize:'12px',color:'red'}}/>}
				<Image src={user?.user_image ? user?.user_image :'/Pro.png' } alt='pp' boxSize='42px' borderRadius='99px' objectFit={'cover'}/>
				<Flex direction='column'>
					<Text fontWeight='bold' fontSize='18px'>{user?.user_name}</Text>
					{user?.user_email?  
						<Link href={`mailto: ${user?.user_email}`} isExternal color='#009393' cursor='pointer' fontSize='10px'>{user?.user_email}</Link>
						:
						'-'
					}
					<Text color='grey' fontSize='10px'>{user?.user_mobile? `${user?.user_mobile}` : '-'}</Text>
				</Flex>
			</Flex>
			<Flex className={styles.user_card_item_control}>
				<Text fontWeight='bold' color={user.role == 'IT' || user.role == 'Manager' || user.role == 'Supervisor'? "#009393" : 'orange'} cursor='pointer' p='1' borderRadius='5px'>{user.role}</Text>
				<Flex gap='2' ml='2'>
					<Flex border='1px solid grey' p='1' borderRadius='5px' color='grey' align='center' gap='1' cursor='pointer' onClick={(()=>{set_is_edit_admin_Modalvisible(true)})}>
						<ManageAccountsIcon/>
						<Text fontSize='12px'>Modify Roles</Text>
					</Flex>
					<Flex border='1px solid grey' p='1' borderRadius='5px' color='grey' align='center' gap='1' cursor='pointer' onClick={(()=>{setisremoveModalvisible(true)})}>
						<PersonRemoveIcon/>
						<Text fontSize='12px' >Remove user</Text>
					</Flex>
					{user.login_status? 
						<Flex border='1px solid grey' p='1' borderRadius='5px' color='grey' align='center' gap='1' cursor='pointer' onClick={Logout_User}>
							<LogoutIcon/>
						</Flex> 
						: 
						<Flex border='1px solid grey' p='1' borderRadius='5px' color='grey' align='center' gap='1' cursor='pointer' opacity='0.3'>
							<LogoutIcon/>
						</Flex>	
					}
				</Flex>
			</Flex>
		</Flex>
	)
}