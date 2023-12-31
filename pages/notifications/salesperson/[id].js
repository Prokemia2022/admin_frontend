import React,{useState,useEffect}from 'react';
import {Flex,Text,Button,Image,useToast} from '@chakra-ui/react';
import Header from '../../../components/Header.js'
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import {useRouter} from 'next/router';
import SuspendAccountModal from '../../../components/modals/suspendAccount.js';
import Get_SalesPerson from '../../api/salespeople/get_salesperson.js'
import Approve_Salesperson from '../../api/salespeople/approve_salesperson.js'
import Cookies from 'universal-cookie';
import jwt_decode from "jwt-decode";

function Salesperson(){
	const router = useRouter();
	const toast = useToast();
	const [issuspendModalvisible,setissuspendModalvisible]=useState(false);

	const [salesperson_data,set_salesperson_data] = useState('')
	const [recents,set_recents]=useState(salesperson_data?.recents)

	const query = router.query
	const id = query?.id
	const cookies = new Cookies();
    let token = cookies.get('admin_token');
    const [auth_role,set_auth_role]=useState("")

	const payload = {
		_id : id,
		auth_role
	}

	const get_data=async(payload)=>{
		await Get_SalesPerson(payload).then((response)=>{
			//console.log(response)
			return set_salesperson_data(response.data)
		})
	}
	const handle_approve_salesperson=async()=>{
		await Approve_Salesperson(payload).then(()=>{
			toast({
              title: '',
              description: `${salesperson_data.company_name} has been approved`,
              status: 'info',
              isClosable: true,
            });
			router.back()
		}).catch((err)=>{
			toast({
              title: '',
              description: err.response?.data,
              status: 'error',
              isClosable: true,
            });
		})
	}

	useEffect(()=>{
		if (!payload || id === undefined){
			alert("missing info could not fetch data")
			router.push("/salespersons")
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
			<SuspendAccountModal issuspendModalvisible={issuspendModalvisible} setissuspendModalvisible={setissuspendModalvisible} salesperson_data={salesperson_data} payload={payload} acc_type='salespersons'/>
			<Header />
			<Flex p='1' direction='column' gap='2'>
				<Flex justify='space-between' gap='4'>
					<Flex direction='column' align='center'>
						<AccountBoxIcon style={{fontSize:'150px'}}/>
						<Text fontWeight='bold' fontSize='20px'>{salesperson_data?.first_name} {salesperson_data?.last_name}</Text>
						{salesperson_data?.suspension_status? 
							<Text fontSize='16px' opacity='.6' border='1px solid red' w='100px' p='1' m='1'>Suspended</Text>
							: 
							null
						}
					</Flex>
					<Flex flex='1' direction='column' bg='#eee' p='2' borderRadius='5' boxShadow='lg' gap='2'>
							<Text><span style={{fontWeight:"bold"}}>Email:</span> {salesperson_data?.email_of_salesperson}</Text>
							<Text><span style={{fontWeight:"bold"}}>Mobile:</span>  {salesperson_data?.mobile_of_salesperson}</Text>
							<Text><span style={{fontWeight:"bold"}}>Address:</span> {salesperson_data?.address}</Text>
							<Text><span style={{fontWeight:"bold"}}>Company:</span>  {salesperson_data?.company_name}</Text>
							<Text><span style={{fontWeight:"bold"}}>Joined in:</span> {salesperson_data?.joined_in}</Text>
					</Flex>
 				</Flex>
				<Button bg='#009393' color='#fff' onClick={handle_approve_salesperson}>Approve Salesperson Account</Button>
				<Button bg='#fff' color='red' border='1px solid red' onClick={(()=>{setissuspendModalvisible(true)})}>Decline Salesperson Account</Button>
			</Flex>
		</Flex>
	)
}

export default Salesperson;

const Industry=({item})=>{
	return(
		<Flex w='170px' borderRadius='5' h='225px' m='1' position='relative' bg='#000'>
			<Image borderRadius='10px' objectFit='cover' src='' alt='next'/>
			<Text position='absolute' bottom='10px' left='10px' fontSize='20px' color='#fff' fontFamily='ClearSans-Bold'>{item}</Text>
		</Flex>
	)
}

const industries=['Personal Care','H&I','Industrial','Cleaning ingredients']