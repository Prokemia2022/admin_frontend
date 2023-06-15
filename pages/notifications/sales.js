import React,{useState,useEffect} from 'react'
import {Flex,Image,Text,Input,Button,Select,Circle} from '@chakra-ui/react'
import {useRouter} from 'next/router';
import styles from '../../styles/Notifications.module.css'
// import Get_Products from '../../api/Products/get_products.js'
import Get_Orders from '../api/orders/get_orders.js';
import moment from 'moment';

export default function Sales_Inventory(){
	const router = useRouter();
	
	const [orders_data,set_orders]=useState([]);

	const get_Orders_Data=async()=>{
		await Get_Orders().then((response)=>{
			let data = response.data
			//console.log(data)
			const result = data.filter((item)=> !item.order_notification_status)
			set_orders(result)
		})
	}
	
	useEffect(()=>{
		get_Orders_Data()
	},[])
	return(
		<Flex direction='column' gap='3' p='2' w='100%'>
			<Text fontSize='32px' fontWeight='bold' color ='#009393'>Sales</Text>
			{orders_data?.length === 0?
				<Flex justify='center' align='center' h='40vh' direction='column' gap='2' textAlign='center' bg='#eee' borderRadius='5'>
					<Text>You dont have any orders to view.</Text>
				</Flex>
			:
				<Flex className={styles.item_card_container} gap='2'>
					{orders_data?.map((item)=>{
						return(
							<OrderItem order={item} key={item._id}/>
						)
					})}
				</Flex>
			}
		</Flex>
	)
}

const OrderItem=({order})=>{
	const router = useRouter();
	const date = moment(order?.createdAt).format("MMM Do YY")
	return(
		<Flex boxShadow='lg' p='2' bg='#fff' onClick={(()=>{router.push(`/order/${order?._id}`)})} cursor='pointer' borderRadius='5px' direction='column' position='relative' border='2px dashed #009393'>
			<Text fontSize='20px' fontWeight='bold'>Company name: {order?.company_name_of_client}</Text>
			<Text>Product Name: {order?.name_of_product}</Text>
			<Text>Total: KES {order?.total}</Text>
			<Text>Date: {date}</Text>
			<Flex gap='1'>
				<Text>Order Status:</Text>
				<Text color={order?.order_status === 'completed'? 'green' : 'orange'}>{order?.order_status}</Text>
			</Flex>
		</Flex>
	)
}
