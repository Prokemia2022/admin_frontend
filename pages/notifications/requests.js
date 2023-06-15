import React,{useState,useEffect} from 'react'
import {Flex,Image,Text,Input,Button,Select,Circle,useToast} from '@chakra-ui/react'
import {useRouter} from 'next/router'
import Get_Requests from '../api/manufacturers/get_requests'
import Complete_Requests from '../api/manufacturers/complete_requests';
import Delete_Requests from '../api/manufacturers/delete_request';
import styles from '../../styles/Notifications.module.css'
import moment from 'moment';
import Cookies from 'universal-cookie';
import jwt_decode from "jwt-decode";

export default function Requests(){
	const router = useRouter();
	const toast = useToast();
	
	const [requests_data, set_requests_data]=useState([]);
	const cookies = new Cookies();
    let token = cookies.get('admin_token');
    const [auth_role,set_auth_role]=useState("")
	const [refresh,set_refresh]=useState(null)

	const get_Request_Data=async()=>{
		await Get_Requests().then((response)=>{
			//console.log(response.data)
			const data = response.data
			const result = data.filter(v => !v.complete_request)
			//// console.log(data.filter(v => !v.verification_status))
			set_requests_data(result)
		})
	}
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
	useEffect(()=>{
		get_Request_Data()
	},[refresh])
	return(
		<Flex direction='column' gap='3' p='2' w='100%' bg='#fff'>
			<Text fontSize='32px' fontWeight='bold' color ='#009393'>Requests</Text>
			{requests_data?.length === 0?
				<Flex justify='center' align='center' h='40vh' direction='column' gap='2' textAlign='center' bg='#eee' borderRadius='5'>
					<Text>You dont have new requests to verify.</Text>
				</Flex>
			:
				<Flex className={styles.item_card_container} gap='2'>
					{requests_data?.map((item)=>{
						return(
							<Requests_Item item={item} key={item._id} router={router} auth_role={auth_role} set_refresh={set_refresh}/>
						)
					})}
				</Flex>
			}
		</Flex>
	)
}

const Requests_Item=({item,router,auth_role,set_refresh})=>{
	const toast = useToast()
	const payload = {
		_id : item._id,
		auth_role
	}
	const handle_complete_request=async()=>{
		await Complete_Requests(payload).then(()=>{
			toast({
				title: '',
				position: 'top-left',
				variant:"subtle",
				description: `Request completed successfully`,
				status: 'success',
				isClosable: true,
			});
		}).then(()=>{
			set_refresh(true);
		}).catch((err)=>{
			toast({
				title: 'Request completed failed',
				position: 'top-left',
				variant:"subtle",
				description: err.response.data,
				status: 'error',
				isClosable: true,
			});
		})
	}
	const handle_delete_request=async()=>{
		await Delete_Requests(payload).then(()=>{
			toast({
				title: '',
				position: 'top-left',
				variant:"subtle",
				description: `Request deleted successfully`,
				status: 'success',
				isClosable: true,
			});
		}).then(()=>{
			set_refresh(true);
		}).catch((err)=>{
			toast({
				title: 'Request deletion failed',
				position: 'top-left',
				variant:"subtle",
				description: err.response.data,
				status: 'error',
				isClosable: true,
			});
		})
	}
	return(
		<Flex direction='column' bg='#eee' borderRadius='5' p='2' w='100%' justify='space-between'>
			<Flex direction='column'>
				<Flex gap='2' fontSize='14px' color='grey' align='center'>
					<Text cursor='pointer' >{item.industry? item.industry : '-'}</Text>
					<Text cursor='pointer' borderLeft='1px solid grey' paddingLeft='2'>{item.technology? item.technology : '-'}</Text>
				</Flex>	
				<Text color='#009393' onClick={(()=>{router.push(`/manufacturer/${item?.id_of_requester}`)})} cursor='pointer' fontSize={'24px'}>{item?.name_of_requester}</Text>
				<Text>Region: <span style={{fontWeight:"bold"}}>{item?.region}</span></Text>
				<Text>{item?.description}</Text>
			</Flex>
			<Flex gap='2'>
				<Button bg='#009393' color='#fff' onClick={handle_complete_request}>Complete</Button>
				<Button bg='#fff' border='1px solid #000' color='#000' onClick={handle_delete_request}>Cancel</Button>
			</Flex>
		</Flex>
	)
}