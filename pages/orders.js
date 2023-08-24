import React,{useState,useEffect}from 'react';
import {Flex,Text,Button,Input,Select} from '@chakra-ui/react'
import Header from '../components/Header.js'
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {useRouter} from 'next/router';
import Get_Orders from './api/orders/get_orders.js';
import CloseIcon from '@mui/icons-material/Close';

export default function Orders(){
	/**
	 * Orders: Lists all orders from db.
	 */
	const [isfilterproductModalvisible,setisfilterproductModalvisible]=useState(false);
	const [isvieworderModalvisible,setisvieworderModalvisible]=useState(false);
	
	const [orders_data,set_orders]=useState([]); 
	const [sort_value,set_sort_value]=useState('desc')
	const [search_query,set_search_query] = useState('');
	const [status_query,set_status_query] = useState('');

	useEffect(()=>{
		Get_Orders().then((response)=>{
			//console.log(response.data)
			const data = response.data;
			const res_data = data?.filter((item) => item?.order_status.toLowerCase().includes(status_query.toLowerCase()))
			const result_data = res_data?.filter((item) => 	item?.name_of_client.toLowerCase().includes(search_query.toLowerCase()) ||
															item?.company_name_of_client.toLowerCase().includes(search_query.toLowerCase()) ||
															item?.creator_name.toLowerCase().includes(search_query.toLowerCase()) ||
															item?.name_of_product.toLowerCase().includes(search_query.toLowerCase()) ||
															item?.email_of_creator.toLowerCase().includes(search_query.toLowerCase()) || 
															item?._id.includes(search_query.toLowerCase()))
			if (sort_value == 'desc'){
				const sorted_result = result_data.sort((a, b) => a.company_name_of_client.localeCompare(b.company_name_of_client))	
				set_orders(sorted_result)
			}else if(sort_value == 'asc'){
				const sorted_result = result_data.sort((a, b) => b.company_name_of_client.localeCompare(a.company_name_of_client))
				set_orders(sorted_result)
			}
			
		})
	},[search_query,sort_value,status_query]);

	const Clear_Filter_Options=()=>{
		set_sort_value('desc');
		set_search_query('');
		set_status_query('');
	}

	return(
		<Flex direction='column'>
			<Header/>
			<Text m='2' fontFamily='ClearSans-Bold' fontSize='24px' >Orders({orders_data?.length})</Text>
			<Flex gap='2' p='2' align='center'>
				<Select placeholder='sort' value={sort_value} w='120px' onChange={((e)=>{set_sort_value(e.target.value)})}> 
					<option value='desc'>A - Z</option>
					<option value='asc'>Z - A</option>
				</Select>
				<Select w='150px' value={status_query} placeholder='Filter' onChange={((e)=>{set_status_query(e.target.value)})}>
					<option value=''>All </option>
					<option value='pending'>Pending </option>
					<option value='disbursed'>Disbursed</option>
					<option value='completed'>Completed</option>
					<option value='rejected'>Rejected</option>
				</Select>
				{search_query !== '' || sort_value !== 'desc' || status_query !== ''? 
					<Text color='grey' onClick={Clear_Filter_Options} ml='3' cursor='pointer'>Clear Filter</Text> : 
					null
				}
			</Flex>
			<Flex gap='2' p='2'>
				{status_query !== ''? 
					<Flex align='center'bg='#eee' p='1' boxShadow='md' cursor='pointer' onClick={(()=>{set_status_query('')})}>
						<Text align='center' >{status_query}</Text>
						<CloseIcon style={{fontSize:'16px',paddingTop:'3px'}}/>
					</Flex>
					: 
					null
				}
				{sort_value !== 'desc'? 
					<Flex align='center'bg='#eee' p='1' boxShadow='md' cursor='pointer' onClick={(()=>{set_sort_value('desc')})}>
						<Text align='center' >ascending</Text>
						<CloseIcon style={{fontSize:'16px',paddingTop:'3px'}}/>
					</Flex>
					: 
					null
				}
			</Flex>
			<Flex gap='2' p='2' flex='1'>
				<Input placeholder='search Orders by product, client, salesperson, company name, order id' value={search_query} bg='#fff' flex='1' onChange={((e)=>{set_search_query(e.target.value)})}/>
				<Button bg='#009393' color='#fff'><SearchIcon /></Button>
			</Flex>
			<Flex wrap='flex' direction='column' p='2' gap='2' mb='2' overflowY='scroll' h='80vh'>
				{orders_data?.length === 0?
					<Flex justify='center' h='40vh' align='center' direction='column' gap='2' textAlign='center'>
						<Text fontWeight={'bold'} color='grey'>No items meet your search terms</Text>
					</Flex>
				:
					<Flex direction='column' gap='2'>
						{orders_data.map((order)=>{
							return(
								<OrderItem key={order?._id} search_query={search_query} order={order}/>
							)
						})}
					</Flex>
				}
			</Flex>
		</Flex>
	)
}

const OrderItem=({search_query,order})=>{
	const router = useRouter();
	return(
		<Flex boxShadow='lg' p='2' bg='#fff' cursor='pointer' borderRadius='5px' direction='column' position='relative' gap='1'>
			<Text 
				fontSize='12px' 
				fontWeight='bold' 
				p={search_query == order?._id? '1':''}
				color={search_query == order?._id? '#fff':'grey'}
				bg={search_query == order?._id? 'orange':null}
				w='180px'>
				{order?._id}
			</Text>	
			<Text 
				fontSize='20px'
				fontWeight='bold'>
				{order?.company_name_of_client}
			</Text>
			<Text color='grey'>Product: <span style={{color:'#009393'}}>{order?.name_of_product}</span></Text>
			<Flex gap='2'>
				<Text color='grey'>Client: <span style={{color:'#000'}}>{order?.name_of_client}</span></Text>
				<Text color='grey'>Sale by: <span style={{color:'#009393',textDecoration:'underline'}} onClick={(()=>{router.push(`/salesperson/${order?._id}`)})}>{order?.creator_name}</span></Text>
			</Flex>
			<Flex p='1' w='110px' bg='#009393' justify='center' fontWeight='bold' borderRadius='5' color='#fff' onClick={(()=>{router.push(`/order/${order?._id}`)})}>
				<Text >view order </Text>
				<ArrowForwardIcon style={{fontSize:'16px',marginTop:'5px'}}/>
			</Flex>
			<Text position='absolute' top='2' right='3' fontWeight='bold' color={order?.order_status === 'completed'? 'green' : 'orange'}>{order?.order_status}</Text>
		</Flex>
	)
}
