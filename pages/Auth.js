import React,{useState,useEffect} from 'react'
import {Flex,Heading,Text,Button,Input,InputGroup,InputRightElement,useToast} from '@chakra-ui/react'
import styles from '../styles/Auth.module.css'
import {Room,Visibility,VisibilityOff} from '@mui/icons-material'
import {useRouter} from 'next/router'
import SignIn from './api/auth/signin.js'
import Cookies from 'universal-cookie';
import Loading from '../components/Loading'

export default function AuthHandler(){
	/**
	 * Handles user sign in
	 * 
	 */
	const [show, setShow] = useState(false);
  	const handleClick = () => setShow(!show);
  	const router = useRouter();
	const toast = useToast();

	const [user_password,set_user_password]=useState('');
	const [user_name,setuser_name]=useState('');
	const [window,setwindow]=useState(null);
	const [is_loading,set_is_loading]=useState(false);
	const cookies = new Cookies();
  	let token = cookies.get('admin_token');

	const payload = {
		user_name,
		user_password
	}

	useEffect(()=>{
		const client = {
			width: document.documentElement.clientWidth,
			height: document.documentElement.clientHeight
		}
		//console.log(client.width)
		if (client.width > 500){
			setwindow(true)
		}
		if(token && token !== 'undefined'){
			router.push('/dashboard_new');
			return ;
		}
	},[token]) 
  	const handleSignIn=async(event)=>{
		set_is_loading(true);
		/**
		 * Handles user sign in.
		 * 
		 * user_password (any): password for the user.
		 * user_name (String): name for user.
		 * paylaod (obj): user credentials. 
		 * token (string): jwt user token.
		 * 
		 * Return:
		 *  	redirects to dashboard on success else
		 * 			alerts an error.
		 */
		//console.log(payload)
		event.preventDefault();
  		if(user_password === '' || user_name === ''){
			toast({
				title: '',
				description: 'All inputs are required',
				status: 'info',
				isClosable: true,
			});
		}else {
			await SignIn(payload).then((response)=>{
				//console.log(response)
				if (response.status === 200){
					toast({
						  title: '',
						  description: 'Successfully Logged in',
						  status: 'success',
						  isClosable: true,
						});
					router.push("/dashboard_new");
					return ;
				}
				else{
					return toast({
							title: 'Error logging in',
							description: response.data,
							status: 'error',
							isClosable: true,
						})
				}
			}).catch((err)=>{
				return toast({
					title: 'Error logging in',
					description: '',
					status: 'error',
					isClosable: true,
				  })
			}).finally(()=>{
				setTimeout(()=>{
					set_is_loading(false)					
				},3000)
			})
		}
  	}

	return(
		<Flex className={styles.AuthBody}>
			<div className={styles.Auth_Image}/>
			<Flex className={styles.Form_Body}>
				<Flex className={styles.Form} gap='3' direction='column'>
					<Heading as='h2' mb='0' onClick={(()=>{router.push('/')})} fontSize='28px' color='#00e0c6'>Pro<span style={{color:"#000"}}>Kemia</span><span style={{fontSize:'16px',color:'grey',marginTop:'17px'}}>.admin</span></Heading>
					<Heading as='h6' fontWeight={'bold'}>SignIn </Heading>
					<Flex direction='column' gap='2'>
						<Text fontWeight='bold'>Username</Text>
						<Input required type='text' placeholder='Username' variant='filled' onChange={((e)=>{setuser_name(e.target.value)})}/>
					</Flex>
					<Text fontWeight='bold'>Password</Text>
					<InputGroup size='md'>
						<Input
						pr='4.5rem'
						type={show ? 'text' : 'password'}
						placeholder='Enter password'
						variant='filled'
						onChange={((e)=>{set_user_password(e.target.value)})}
						required
						/>
							<InputRightElement width='4.5rem'>
							<Button h='1.75rem' size='sm' onClick={handleClick} bg='#fff'>
							{show ? <VisibilityOff/> : <Visibility/>}
							</Button>
						</InputRightElement>
					</InputGroup>
					<Button 
						type="submit" 
						onClick={handleSignIn} 
						bg='#009393' 
						color='#fff' 
						disabled={is_loading? true : false}
						align='center'
					>
							{is_loading? <Loading width='40px' height='40px' color='#ffffff'/> : null}
							{is_loading? 'signing in...' : 'Sign in'}
					</Button>
				</Flex>
			</Flex>
		</Flex>
	)
}