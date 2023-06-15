//modules
import React,{useState,useEffect}from 'react'
import {Flex,Text} from '@chakra-ui/react'
//icons
//api
import Get_Clients from './api/clients/get_clients.js';
import Get_Distributors from '../pages/api/distributors/get_distributors.js';
import Get_Manufacturers from '../pages/api/manufacturers/get_manufacturers.js';
import Get_SalesPeople from '../pages/api/salespeople/get_salespeople.js';
import Get_Orders from './api/orders/get_orders.js';
import Get_Products from './api/Products/get_products.js';
//utils
import {useRouter} from 'next/router';
import jwt_decode from "jwt-decode";
import Cookies from 'universal-cookie';
//styles
//components
import Header from '../components/Header.js';

export default function Dashboard(){	
	//utils
	const router = useRouter();
	const cookies = new Cookies();
  	let token = cookies.get('admin_token');
	//data

	const [clients_data, set_clients_data] = useState([]);
	const [distributors_data, set_distributors_data]=useState([]);
	const [manufacturers_data, set_manufacturers_data]=useState([]);
	const [salespeople_data, set_salespeople_data]=useState([]);
	const [orders_data,set_orders]=useState([]);
	const [products,set_products]=useState([]);

	const [user_name,set_user_name] = useState("");
	//
  	useEffect(()=>{
	    if(token){
	      let decoded = jwt_decode(token);
	      //console.log(decoded);
	      set_user_name(decoded.user_name)
		    Get_Clients().then((response)=>{
		  		const data = response?.data.reverse()
		  		set_clients_data(data.filter(v => v.valid_email_status))
			})
			Get_Distributors().then((response)=>{
		  		const data = response?.data.reverse()
		  		set_distributors_data(data.filter(v => v.verification_status))
		  		//console.log(data)
		  		
			})
			Get_Manufacturers().then((response)=>{
		  		const data = response?.data.reverse()
		  		set_manufacturers_data(data.filter(v => v.verification_status))
		  		
			})
			Get_SalesPeople().then((response)=>{
		  		const data = response?.data.reverse()
		  		set_salespeople_data(data.filter(v => v.verification_status))
		  		//console.log(data)
		  		
			})
			Get_Orders().then((response)=>{
		  		const data = response?.data
		  		set_orders(data.filter(v => v.order_notification_status))
		  		//console.log(data)
		  		
			})
			Get_Products().then((response)=>{
		  		const data = response?.data
		  		set_products(data.filter(v => v.verification_status))
		  		
			})
			
		}else{
			router.push('/')
		}
	  },[token])
	return(
		<Flex direction='column' bg='#eee'>
			<Header/>
			<Flex direction='column' position='relative'>
				<Text ml='2' fontWeight='bold' fontSize='24px' color='#000' textTransform={"capitalize"}>Welcome, <br/>{user_name}</Text>
			</Flex>
			<Flex w='100%' justify='center'>
				<Revenue_Tag orders_data={orders_data}/>
				<Flex w='30vw' justify='space-around' direction='column' mr='3'>
					<Flex w='100%' h='50%' gap='2' bg='#fff' borderRadius='10' boxShadow='lg' m='2' p='2' align='center' justify='center' >
						<Text color='#009393' fontSize='20px'>{products?.length}</Text>
						<Text>Products</Text>
					</Flex>
					<Flex w='100%' h='50%' gap='2' bg='#fff' borderRadius='10' boxShadow='lg' m='2' p='2' align='center' justify='center' >
						<Text color='#009393' fontSize='20px'>{orders_data?.length}</Text>
						<Text>Orders</Text>
					</Flex>
				</Flex>
			</Flex>
			<Flex>
				<Flex w='20vw' color='#fff' borderRadius='5' boxShadow='lg' p='1' m='1' align='center' justify='center' direction='column' gap='4' h='150px' bg='rgb(0, 147, 147,0.6)' textAlign='center'>
					<Text fontSize='32px' >{clients_data?.length}</Text>
					<Text fontWeight='bold'>clients</Text>
				</Flex>
				<Flex flex='1' direction='column' bg='#fff' borderRadius='10' boxShadow='lg' m='2' p='2' gap='1' justify='space-between'>
					{clients_data?.slice(0,2).map((item)=>{return(<Text key={item?._id} boxShadow='lg' onClick={(()=>{router.push(`/customer/${item._id}`)})} bg='#eee' p='2' borderRadius='5' cursor='pointer'>{item?.first_name} {item?.last_name}</Text>)})}
					<Text cursor='pointer' color='#009393' onClick={(()=>{router.push('/customers')})}>view all</Text>					
				</Flex>
			</Flex>
			<Flex>
				<Flex w='20vw' color='#000' borderRadius='5' boxShadow='lg' p='1' m='1' align='center' justify='center' direction='column' gap='4' h='150px' bg='#fff' textAlign='center'>
					<Text fontSize='32px' >{manufacturers_data?.length}</Text>
					<Text fontWeight='bold' w='100%'>Manufacturers</Text>
				</Flex>
				<Flex flex='1' direction='column' bg='#fff' borderRadius='10' boxShadow='lg' m='2' p='2' gap='1' justify='space-between'>
					{manufacturers_data?.slice(0,2).map((item)=>{return(<Text key={item?._id} boxShadow='lg' onClick={(()=>{router.push(`/manufacturer/${item._id}`)})} bg='#eee' p='2' borderRadius='5' cursor='pointer'>{item?.company_name}</Text>)})}
					<Text cursor='pointer' color='#009393' onClick={(()=>{router.push('suppliers/manufacturers')})}>view all</Text>						
				</Flex>
			</Flex>
			<Flex>
				<Flex w='20vw' color='#000' borderRadius='5' boxShadow='lg' p='1' m='1' align='center' justify='center' direction='column' gap='4' h='150px' bg='#fff' textAlign='center'>
					<Text fontSize='32px' >{salespeople_data?.length}</Text>
					<Text fontWeight='bold' w='100%'>Salespersons</Text>
				</Flex>
				<Flex flex='1' direction='column' bg='#fff' borderRadius='10' boxShadow='lg' m='2' p='2' gap='1' justify='space-between'>
					{salespeople_data?.slice(0,2).map((item)=>{return(<Text key={item?._id} boxShadow='lg' onClick={(()=>{router.push(`/salesperson/${item._id}`)})} bg='#eee' p='2' borderRadius='5' cursor='pointer'>{item?.first_name} {item?.last_name}</Text>)})}
					<Text cursor='pointer' color='#009393' onClick={(()=>{router.push('/salespersons')})}>view all</Text>						
				</Flex>
			</Flex>
			<Flex>
				<Flex w='20vw' color='#fff' borderRadius='5' boxShadow='lg' p='1' m='1' align='center' justify='center' direction='column' gap='4' h='150px' bg='rgb(101, 78, 163,0.5)' textAlign='center'>
					<Text fontSize='32px' >{distributors_data?.length}</Text>
					<Text fontWeight='bold' w='100%'>Distributors</Text>
				</Flex>
				<Flex flex='1' direction='column' bg='#fff' borderRadius='10' boxShadow='lg' m='2' p='2' gap='1' justify='space-between'>
					{distributors_data?.slice(0,2).map((item)=>{return(<Text key={item?._id} boxShadow='lg' onClick={(()=>{router.push(`/distributor/${item._id}`)})} bg='#eee' p='2' borderRadius='5' cursor='pointer'>{item?.company_name}</Text>)})}
					<Text cursor='pointer' color='#009393' onClick={(()=>{router.push('suppliers/distributors')})}>view all</Text>						
				</Flex>
			</Flex>
		</Flex>
)}

const Revenue_Tag=({orders_data})=>{
//	//console.log(orders_data)090F14bg='rgb(0, 147, 147,0.6)'
	const completed_orders = orders_data?.filter((item)=>item.order_status.includes('completed'))
	const data = completed_orders.map((item)=> item.total)
	let total = Intl.NumberFormat().format(data.reduce((a, b) => a + b, 0));
	
	return(
		<Flex flex='1' margin='2' color={'#fff'} borderRadius='5' boxShadow='lg' p='2' direction='column' gap='' h='150px' bg={'#009393'} justify='space-between'>
			<Text fontSize='38px' fontWeight='bold'>KES {total}</Text>
			<Text fontWeight='bold'>completed-sales:  {completed_orders?.length}</Text>
		</Flex>
	)
}
