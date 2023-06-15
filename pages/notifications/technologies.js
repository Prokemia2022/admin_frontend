import React,{useState,useEffect} from 'react'
import {Flex,Image,Text,Input,Button,Select,Circle,useToast} from '@chakra-ui/react'
import {useRouter} from 'next/router'
import Get_Technologies from '../api/controls/get_technologies.js'
import Approve_Technology from '../api/controls/approve_technology.js'
import Delete_Technology from '../api/controls/delete_technology.js';
import Cookies from 'universal-cookie';
import jwt_decode from "jwt-decode";

import styles from '../../styles/Notifications.module.css';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Technologies(){
	const router = useRouter();
	const cookies = new Cookies();
    let token = cookies.get('admin_token');
    const [auth_role,set_auth_role]=useState("")
	
	const [technologies_data, set_technologies_data]=useState([]);
	const [refresh,set_refresh]=useState(null);

	const get_Technology_Data=async()=>{
		await Get_Technologies().then((response)=>{
			//console.log(response.data)
			const data = response.data
			const result = data.filter(v => !v.verification_status)
			//console.log(data.filter(v => !v.verification_status))
			set_technologies_data(result)
		})
	}
	
	useEffect(()=>{
		get_Technology_Data()
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
	},[refresh])
	return(
		<Flex direction='column' gap='3' p='2' w='100%' bg='#fff'>
			<Text fontSize='32px' fontWeight='bold' color ='#009393'>Technologies</Text>
			{technologies_data?.length === 0?
				<Flex justify='center' align='center' h='40vh' direction='column' gap='2' textAlign='center' bg='#eee' borderRadius='5' >
					<Text>You dont have new technologies to verify.</Text>
				</Flex>
			:
				<Flex className={styles.item_card_container} gap='2'>
					{technologies_data?.map((item)=>{
						return(
							<Technology_Item item={item} key={item._id} auth_role={auth_role} set_refresh={set_refresh}/>
						)
					})}
				</Flex>
			}
		</Flex>
	)
}

const Technology_Item=({item,auth_role,set_refresh})=>{
	const router = useRouter();
	const toast = useToast()

	const payload = {
		_id : item?._id,
		auth_role
	}
	const handle_approve_technology=async()=>{
		await Approve_Technology(payload).then(()=>{
			toast({
				title: 'Approval request success',
				position: 'top-left',
				variant:"subtle",
				description: `${item?.title} has been approved`,
				status: 'success',
				isClosable: true,
            });
		}).then(()=>{
			set_refresh(true);
		}).catch((err)=>{
			toast({
				title: 'Approval request failed',
				position: 'top-left',
				variant:"subtle",
				description: err.response?.data,
				status: 'error',
				isClosable: true,
            });
		})
	}
	const handle_delete_technology=async()=>{
		await Delete_Technology(payload).then(()=>{
			toast({
				title: 'Deletion request success',
				position: 'top-left',
				variant:"subtle",
				description: `${item?.title} has been deleted`,
				status: 'success',
				isClosable: true,
            });
		}).then(()=>{
			set_refresh(true);
		}).catch((err)=>{
			//console.log(err)
			toast({
				title: 'Technology deletion failed',
				position: 'top-left',
				variant:"subtle",
				description: err.response.data,
				status: 'error',
				isClosable: true,
            });
		})
	}
	return(
		<Flex direction='column' bg='#eee' borderRadius='5' p='2' gap='2'>
			<Flex justify='space-between'>
				<Text fontWeight='bold' fontSize='20px'>{item?.title}</Text>
				<Flex gap='2'>
					<CheckBoxIcon style={{color:"#009393",fontSize:'30px',cursor:'pointer'}} onClick={handle_approve_technology}/>
					<DeleteIcon style={{color:"crimson",fontSize:'30px',cursor:'pointer'}} onClick={handle_delete_technology}/>
				</Flex>
			</Flex>
			<Text fontSize='14px'>{item?.description}</Text>
		</Flex>
	)
}