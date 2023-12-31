import React,{useState,useEffect}from 'react';
import {Flex,Text,Button,Input,Image,Select,Divider,Popover,PopoverTrigger,PopoverContent,PopoverHeader,PopoverBody,PopoverFooter,PopoverArrow,PopoverCloseButton,PopoverAnchor,} from '@chakra-ui/react'
//components
import Header from '../components/Header.js'
import Fetching_Data_Loading_Animation from '../components/Fetching_Loading_animation.js';
//api
import Get_Clients from './api/clients/get_clients.js';
//utils
import {useRouter} from 'next/router'
//styles
import styles from '../styles/Inventory.module.css'
//icons
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import UnsubscribeIcon from '@mui/icons-material/Unsubscribe';
import BusinessIcon from '@mui/icons-material/Business';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
 
function Customers(){
	const router = useRouter();

	const [clients_data, set_clients_data] = useState([]);
	const [status,set_status] = useState('false')
	const [search_query,set_search_query] = useState('')
	const [sort,set_sort]=useState('desc')
	const [suspension_status,set_suspension_status]=useState('');

	const [is_fetching,set_is_fetching]=useState(null);

	useEffect(()=>{
		Get_Clients().then((response)=>{
			set_is_fetching(true);
			const data = response.data
			//console.log(data)
			if (sort == 'desc'){
				const sorted_result = data.sort((a, b) => a.first_name.localeCompare(b.first_name))
				const result_data = sorted_result?.filter((item) => item?.company_name.toLowerCase().includes(search_query.toLowerCase()) ||
																	item?.first_name.toLowerCase().includes(search_query.toLowerCase()))
				if(suspension_status === 'suspended'){
					const result = result_data?.filter((item) => item.suspension_status)
					//console.log(result)
					set_clients_data(result);
				}else if(suspension_status === 'all'){
					set_clients_data(result_data);
				}else{
					const result = result_data?.filter((item) => !item.suspension_status)
					//console.log(result)
					set_clients_data(result_data);
				}
			}else{
				const sorted_result = data.sort((a, b) => b.first_name.localeCompare(a.first_name))
				const result_data = sorted_result?.filter((item) => item?.company_name.toLowerCase().includes(search_query.toLowerCase()) ||
																	item?.first_name.toLowerCase().includes(search_query.toLowerCase()))
				if(suspension_status === 'suspended'){
					const result = result_data?.filter((item) => item.suspension_status)
					//console.log(result)
					set_clients_data(result);
				}else if(suspension_status === 'all'){
					set_clients_data(result_data);
				}else{
					const result = result_data?.filter((item) => !item.suspension_status)
					//console.log(result)
					set_clients_data(result_data);
				}
			}
		}).finally(()=>{
			set_is_fetching(false)
		})
	},[status,search_query,sort,suspension_status])
	return(
		<Flex direction='column'>
			<Header />
			<Flex direction='column'>
				<Text m='2' fontFamily='ClearSans-Bold' fontSize='24px' >Customers</Text>
				<Flex gap='2' p='2' align='center' mt='-4'>
					<Select placeholder='suspension status' w='100px' bg='#fff' color='#000' onChange={((e)=>{set_suspension_status(e.target.value)})}>
						<option value={'suspended'} >Suspended</option>
						<option value={'not suspended'} >not suspended</option>
						<option value={'all'} >All</option>
					</Select>
					<Select placeholder='sort' w='100px' onChange={((e)=>{set_sort(e.target.value)})}> 
						<option value='desc'>A - Z</option>
						<option value='asc'>Z - A</option>
					</Select>
				</Flex>
				<Flex gap='2' p='2' mt='-2'>
					<Input placeholder='search customers' bg='#fff' flex='1' onChange={((e)=>{set_search_query(e.target.value)})}/>
					<Button bg='#009393' color='#fff'><SearchIcon /></Button>
				</Flex>
				
				<Flex direction='column' gap='2' p='2' className={styles.products_container_body}>
						{is_fetching || clients_data.length == 0?
							<Flex flex='1' h='100%' m='2' justify={'center'} align='center' direction={'column-reverse'}>
								{clients_data.length == 0 ?
									<Flex justify='center' align='center'>
										<Text fontSize='' color='grey'>No items match your query</Text>
									</Flex>
									:
									null
								}
								<Fetching_Data_Loading_Animation width={'250px'} height={'250px'} color={'#009393'}/>
							</Flex>
						:
							<Flex className={styles.products_container} gap='1'>
								{clients_data?.map((client_data)=>{
									return(
										<div key={client_data?._id} >
											<Customer_Card_Item client_data={client_data}/>
										</div>
									)
								})}
							</Flex>
						}
				</Flex>
			</Flex>
		</Flex>
	)
}

export default Customers;

const Customer_Card_Item=({client_data})=>{
	const router = useRouter();
	const [is_view_active,set_is_view_active]=useState(false);
	return(
		<Flex gap='1' bg='#eee' borderRadius='5' align='center' justify='space-between' position='relative'>
			<Flex align='center' gap='2'>
				<Image 
					boxSize='50px' 
					src={client_data?.profile_photo_url == '' || !client_data?.profile_photo_url ? '../Pro.png' : client_data?.profile_photo_url} 
					bg='grey' alt='photo' 
					objectFit='cover' 
					border='1px solid #eee' 
					borderRadius='5'/>
					<Flex direction='column' >
						<Text fontWeight='bold' fontSize='16px'>{client_data?.first_name} {client_data?.last_name}</Text>
						<Text color='grey' fontSize='12px'>{client_data?.email_of_company}</Text>
					</Flex>
			</Flex>
			<Flex gap='1' mr='2' align={'center'}>
				{client_data?.suspension_status?
					<DisabledByDefaultRoundedIcon style={{fontSize:'20px',color:'red',cursor:'pointer'}}/>
					:
					null
				}
				{client_data?.valid_email_status?
					<MarkEmailReadIcon style={{fontSize:'16px',color:'#009393'}}/>
					:
					null
				}
				<Popover placement='left-start'>
					<PopoverTrigger>
						<MoreVertIcon style={{fontSize:'20px',color:'grey',cursor:'pointer'}}/>
					</PopoverTrigger>
					<PopoverContent>
						<PopoverArrow />
						<PopoverCloseButton />
						<PopoverHeader fontSize='14px'>
							<Text fontWeight='bold'>
								{client_data?.first_name} {client_data?.last_name}
							</Text>
						</PopoverHeader>
						<PopoverBody>
							<Flex direction='column' fontSize='10px' gap='1'>
								<Flex align='center' gap='1' fontSize='11px' fontWeight='bold' color='grey'>
									<PhoneAndroidIcon style={{fontSize:'18px'}}/>
									<Text >
										{client_data?.mobile_of_company? client_data?.mobile_of_company : '-'}
									</Text>
								</Flex>
								<Flex align='center' gap='1'>
									<BusinessIcon style={{fontSize:'20px'}}/>
									<Text fontWeight='bold'>{client_data?.company_name? client_data?.company_name : '-'}</Text>
								</Flex>
								{client_data?.valid_email_status?
									<Flex align='center' gap='1' color='#009393'>
										<MarkEmailReadIcon style={{fontSize:'20px'}}/>
										<Text fontWeight='bold'>Verified Email</Text>
									</Flex>
									:
									<Flex align='center' gap='1' color='grey'>
										<UnsubscribeIcon style={{fontSize:'20px'}}/>
										<Text textDecoration='1px solid line-through' fontWeight='bold'>Verified Email</Text>
									</Flex>
								}
								{client_data?.suspension_status?
									<Flex align='center' gap='1'>
										<DisabledByDefaultRoundedIcon style={{fontSize:'20px',color:'red'}}/>
										<Text color='red' fontWeight='bold'>Suspended</Text>
									</Flex>
									:
									<Flex align='center' gap='1' color='grey'>
										<DisabledByDefaultRoundedIcon style={{fontSize:'20px'}}/>
										<Text textDecoration='1px solid line-through' fontWeight='bold'>Suspended</Text>
									</Flex>
								}
								<Divider/>
								<Flex cursor='pointer' gap='2' align='center' onClick={(()=>{router.push(`/customer/${client_data?._id}`)})}>
									<VisibilityIcon style={{fontSize:'18px',color:'grey',cursor:'pointer'}}/>
									<Text>Manage this customer</Text>
								</Flex>
							</Flex>
						</PopoverBody>
					</PopoverContent>
				</Popover>
			</Flex>
			{is_view_active? 
				<Flex direction='column' boxShadow='lg' cursor='pointer' w='120px' bg='#fff' borderRadius='5' position='absolute' bottom='-30px' right='20px' p='2' zIndex='100'>
					<Flex align='center' onClick={(()=>{router.push(`/customer/${client_data?._id}`)})}>
						<Text>View</Text>
						<ArrowRightAltIcon style={{fontSize:'18px',color:'grey',cursor:'pointer'}}/>
					</Flex>
					<Divider/>
					{client_data?.suspension_status? <Text fontSize='12px' fontWeight='bold' color='red'>suspended</Text>:null}
				</Flex>
				:
			null}
		</Flex>
	)
}