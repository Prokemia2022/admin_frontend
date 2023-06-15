import React,{useState,useEffect} from 'react'
import {Flex, Text,Button,Stack,Divider,useToast,Image} from '@chakra-ui/react'
import {Menu,Receipt,Close,Add,Settings,Groups,Tune,Widgets,FactCheck,Inventory,Chat} from '@mui/icons-material';
import {useRouter} from 'next/router'
import styles from '../styles/Header.module.css'
import Cookies from 'universal-cookie';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import jwt_decode from "jwt-decode";
import Get_Admin_User from '../pages/api/auth/get_admin_user.js'
import Edit_Admin_User from '../pages/api/auth/edit_admin_user.js'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import CircleIcon from '@mui/icons-material/Circle';

export default function Header(){
	const [showmenubar,setshowmenubar]=useState(false);
	const router = useRouter();
	const toast = useToast();
	const cookies = new Cookies();
  	let token = cookies.get('admin_token');
	const [user_data,set_user_data] = useState('')

  	useEffect(()=>{
	    if (!token){
	    	toast({
              title: '',
              description: `You need to signed in, to have access`,
              status: 'info',
              isClosable: true,
            });
	    	router.push("/")
			return;
	    }else{
			let decoded = jwt_decode(token);
			//console.log(decoded);
			let id = decoded?.id
			fetch_user_details(id)
		}
	},[]);

	const handle_LogOut=async()=>{
		const payload ={
			_id : user_data?._id,
			login_status : false
		}
		await Edit_Admin_User(payload).then(()=>{
			cookies.remove('admin_token', { path: '/' });
			toast({
              title: 'successfully logged out',
              description: ``,
              status: 'success',
              isClosable: true,
            });
		}).then(()=>{
			router.push('/')
		}).catch((err)=>{
			toast({
              title: 'error while logging out',
              description: ``,
              status: 'error',
              isClosable: true,
            });
			//console.log(err);
		})
	}

	const fetch_user_details=async(id)=>{
		////console.log(id)
		const payload = {
			_id : id
		}
		//console.log(payload)
		await Get_Admin_User(payload).then((res)=>{
			//console.log(res.data)
			if (res.data?.login_status){
				set_user_data(res.data);
			}else{
				router.push('/');
				cookies.remove('admin_token', { path: '/' });
				toast({
					title: 'You have been signed out.',
					description: `For any issues contact support or the administrator.`,
					position: 'top-left',
					variant: 'subtle',
					isClosable: true,
				});
				return ;
			}
		}).catch((err)=>{
			if (err.response?.status == 500){
				toast({
					title: 'Error while logging in.',
					description: `${err.response?.data}`,
					status: 'error',
					position: 'top-left',
					variant: 'subtle',
					isClosable: true,
				});
				router.push('/')
				return ;
			}
			//console.log(err)
		})
	}
	return(
		<Flex cursor='pointer' bg='#fff' fontFamily='ClearSans-Bold' h='70px' p='2' justify='space-between' align='center' position='sticky' top='0px' zIndex='10'>
			<Flex p='2' align='center' gap='1' borderRadius='5' color='#fff' onClick={(()=>{router.push(`/profile/${user_data?._id}`)})}>
				{user_data?.user_image == '' || !user_data?.user_image? <AccountCircleIcon style={{color:'grey',fontSize:'35px'}}/> : <Image src={user_data?.user_image} objectFit='cover' boxSize='50px' boxShadow='lg' borderRadius='5px' alt='pp'/>}
			</Flex>
			<Flex align='center' gap='3'>
				<Button w='120%' p='3' fontSize='14px' bg='#009393' color='#fff' onClick={(()=>{router.push(`/product/add_product`)})}>
					<Add style={{fontSize:'18px'}}/>
					Add Product
				</Button>
				<Button w='100%' bg='#000' color='#fff' onClick={handle_LogOut}>Log-out</Button>
				{showmenubar ? 
					<Close onClick={(()=>{setshowmenubar(!showmenubar)})}/>
						:
					<Menu onClick={(()=>{setshowmenubar(!showmenubar)})}/> 
				}
				{showmenubar ? 
					<MenuBar setshowmenubar={setshowmenubar} showmenubar={showmenubar} user_data={user_data}/>
						:
					null 
				}
			</Flex>
		</Flex>
	)
}

const navigation=[
	{
		id:1,
		title:'Inventory',
		link:'inventory',
		logo:<Inventory/>
	},
	{
		id:2,
		title:'Orders',
		link:'orders',
		logo:<Receipt/>
	},
	{
		id:3,
		title:'Salespersons',
		link:'salespersons',
		logo:<Groups/>
	},
	{
		id:4,
		title:'Customers',
		link:'customers',
		logo:<Groups/>
	},
	{
		id:5,
		title:'Control',
		link:'util_controls',
		logo:<Tune/>
	},
]
const suppliers_navigation=[
	{
		id:1,
		title:'Distributors',
		link:'suppliers/distributors',
		logo:<Groups/>
	},
	{
		id:2,
		title:'Manufacturers',
		link:'suppliers/manufacturers',
		logo:<Groups/>
	},
]
const MenuBar=({setshowmenubar,showmenubar,user_data})=>{
	const router = useRouter();
	const [handle_persmission_sub_menu,set_handle_persmission_sub_menu]=useState(false);
	return(
		<Flex className={styles.Menu_Bar_Body} gap='2' p='4'>
			<Flex gap='2'>
				<Flex direction='column' flex='1' align='center' p='2' bg='#fff' borderRadius='5' onClick={(()=>{router.push("/dashboard");setshowmenubar(!showmenubar)})}>
					<Widgets />
					<Text fontSize='14px'  mb='0' >Dashboard</Text>
				</Flex>
				<Flex direction='column' flex='1' align='center' p='2' bg='#fff' borderRadius='5' onClick={(()=>{router.push("/notifications");setshowmenubar(!showmenubar)})}>
					<NotificationsActiveIcon />
					<Text fontSize='14px'  mb='0' >Notifications</Text>
				</Flex>
			</Flex>
			<Flex className={styles.Menu_items_container} direction='column' p='2'>
			{navigation.map((item)=>{
				return(
					<Flex borderBottom='1px solid grey' p='2' _hover={{transition:'ease-out 0.9s all',backgroundColor:"#fff",color:"#000",borderRadius:'5'}} key={item?.id} align='center' color='#fff' onClick={(()=>{router.push(`/${item.link}`);setshowmenubar(!showmenubar)})}>
					{item.logo}
					<Text  p='2' fontSize='20px'  mb='0' >{item.title}</Text>
					</Flex>
					)
				})}
				{suppliers_navigation.map((item)=>{
					return(
						<Flex borderBottom='1px solid grey' p='2' _hover={{transition:'ease-out 0.9s all',backgroundColor:"#fff",color:"#000",borderRadius:'5'}} key={item?.id} align='center' color='#fff' onClick={(()=>{window.location=(`/${item.link}`);setshowmenubar(!showmenubar)})}>
							{item.logo}
							<Text  p='2' fontSize='20px'  mb='0' >{item.title}</Text>
						</Flex>
					)
				})}	
				<Flex borderBottom='1px solid grey' p='2' _hover={{transition:'ease-out 0.9s all',backgroundColor:"#fff",color:"#000",borderRadius:'5'}} align='center' color='#fff' onClick={(()=>{router.push(`/profile/${user_data?._id}`);setshowmenubar(!showmenubar)})}>
					<AccountCircleIcon/>
					<Text  p='2' fontSize='20px'  mb='0' >Profile</Text>
				</Flex>
				{user_data?.role === 'Manager' || user_data?.role === 'Tech Support'?
					<>
						<Flex justify='space-between' borderBottom='1px solid grey' p='2' _hover={{transition:'ease-out 0.9s all',backgroundColor:"#fff",color:"#000",borderRadius:'5'}} align='center' color='#fff' onClick={(()=>{set_handle_persmission_sub_menu(!handle_persmission_sub_menu)})}>
							<Flex align='center'>
								<ManageAccountsIcon/>
								<Text  p='2' fontSize='20px'  mb='0' >Permissions&Accounts</Text>
							</Flex>
							{handle_persmission_sub_menu?
								<KeyboardArrowUpIcon/>
								:<KeyboardArrowDownIcon/>
							}
						</Flex>
						{handle_persmission_sub_menu?
							<Permission_accounts_controllers setshowmenubar={setshowmenubar} showmenubar={showmenubar}/>
							:null
						}
					</>
					:null}
			</Flex>
		</Flex>
	)
}

const Permission_accounts_controllers=({setshowmenubar,showmenubar})=>{
	const router = useRouter()
	return(
		<Flex direction='column' ml='5%' color='#fff' gap='2' mt='2'>
			<Flex align='center' gap=''>
				<CircleIcon style={{fontSize:'10px'}}/>
				<Text  p='2' fontSize=''  mb='0' onClick={(()=>{router.push(`/Permissions&Accounts/User_Management`);setshowmenubar(!showmenubar)})}>User Management</Text>
			</Flex>
			<Divider/>
			<Flex align='center' gap=''>
				<CircleIcon style={{fontSize:'10px'}}/>
				<Text  p='2' fontSize=''  mb='0' onClick={(()=>{router.push(`/Permissions&Accounts/Role_Management`);setshowmenubar(!showmenubar)})}>Role Management</Text>
			</Flex>
		</Flex>
	)
}