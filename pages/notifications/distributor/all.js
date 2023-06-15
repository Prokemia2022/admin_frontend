import React,{useState,useEffect} from 'react'
import {Flex,Text} from '@chakra-ui/react'
import {useRouter} from 'next/router'
import Get_Distributors from '../../api/distributors/get_distributors.js';
//components
import Item_Card from '../../../components/Accounts_Notification_Card.js';
//styles
import styles from '../../../styles/Notifications.module.css'

export default function Distributors(){
	const router = useRouter();
	
	const [distributors_data, set_distributors_data]=useState([]);

	const get_Distributors_Data=async()=>{
		await Get_Distributors().then((response)=>{
			//console.log(response.data)
			const data = response.data
			const result = data.filter(v => !v.verification_status)
			//console.log(data.filter(v => !v.verification_status))
			set_distributors_data(result)
		})
	}
	
	useEffect(()=>{
		get_Distributors_Data()
	},[])
	return(
		<Flex direction='column' gap='3' p='2' w='100%'>
			<Text fontSize='32px' fontWeight='bold' color ='#009393'>Distributors</Text>
			{distributors_data?.length === 0?
				<Flex justify='center' align='center' h='40vh' direction='column' gap='2' textAlign='center' bg='#eee' borderRadius='5'>
					<Text>You dont have new distributors to verify.</Text>
				</Flex>
			:
				<Flex className={styles.item_card_container}>
					{distributors_data?.map((item)=>{
						return(
							<Item_Card item={item} key={item._id} link={`/notifications/distributor/${item?._id}`}/>
						)
					})}
				</Flex>
			}
		</Flex>
	)
}