import React,{useState,useEffect} from 'react'
import {Flex,Image,Text,Input,Button,Select,Circle} from '@chakra-ui/react'
import {useRouter} from 'next/router'
import Get_SalesPeople from '../../api/salespeople/get_salespeople.js';
//components
import Item_Card from '../../../components/Accounts_Notification_Card.js';
//styles
import styles from '../../../styles/Notifications.module.css'

export default function Salespeople(){
	const router = useRouter();
	
	const [salespeople_data, set_salespeople_data]=useState([]);

	const get_SalesPeople_Data=async()=>{
		await Get_SalesPeople().then((response)=>{
			//console.log(response.data)
			const data = response.data
			const result = data.filter(v => !v.verification_status)
			//console.log(data.filter(v => !v.verification_status))
			set_salespeople_data(result)
		})
	}
	
	useEffect(()=>{
		get_SalesPeople_Data()
	},[])
	return(
		<Flex direction='column' gap='3' p='2' w='100%'>
			<Text fontSize='32px' fontWeight='bold' color ='#009393'>Salespeople</Text>
			{salespeople_data?.length === 0?
				<Flex justify='center' align='center' h='40vh' direction='column' gap='2' textAlign='center' bg='#eee' borderRadius='5'>
					<Text>You dont have new salespeople to verify.</Text>
				</Flex>
			:
				<Flex className={styles.item_card_container}>
					{salespeople_data?.map((item)=>{
						return(
							<Item_Card item={item} key={item._id} link={`/notifications/salesperson/${item?._id}`}/>
						)
					})}
				</Flex>
			}
		</Flex>
	)
}