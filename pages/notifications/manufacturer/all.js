import React,{useState,useEffect} from 'react'
import {Flex,Image,Text,Input,Button,Select,Circle} from '@chakra-ui/react'
import {useRouter} from 'next/router';
// import Get_Products from '../../api/Products/get_products.js'
import Get_Manufacturers from '../../api/manufacturers/get_manufacturers.js';
import styles from '../../../styles/Notifications.module.css'
import Item_Card from '../../../components/Accounts_Notification_Card.js';

export default function Manufacturers(){
	const router = useRouter();
	
	const [manufacturers_data, set_manufacturers_data]=useState([]);

	const get_Manufacturers_Data=async()=>{
		await Get_Manufacturers().then((response)=>{
			//console.log(response.data)
			const data = response.data
			const result = data.filter(v => !v.verification_status)
			//console.log(data.filter(v => !v.verification_status))
			set_manufacturers_data(result)
		})
	}
	
	useEffect(()=>{
		get_Manufacturers_Data()
	},[])
	return(
		<Flex direction='column' gap='3' p='2' w='100%'>
			<Text fontSize='32px' fontWeight='bold' color ='#009393'>Manufacturers</Text>
			{manufacturers_data?.length === 0?
				<Flex justify='center' align='center' h='40vh' direction='column' gap='2' textAlign='center' bg='#eee' borderRadius='5'>
					<Text>You dont have new manufacturers to verify.</Text>
				</Flex>
			:
				<Flex className={styles.item_card_container}>
					{manufacturers_data?.map((item)=>{
						return(
							<Item_Card item={item} key={item._id} link={`/notifications/manufacturer/${item?._id}`}/>
						)
					})}
				</Flex>
			}
		</Flex>
	)
}