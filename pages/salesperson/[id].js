//modules imports
import React,{useState,useEffect}from 'react';
import {Flex,Text,Button,Image,Link,useToast,Select, Input,Divider} from '@chakra-ui/react';
import {useRouter} from 'next/router';
//comsponents imports
import Header from '../../components/Header.js'
import SuspendAccountModal from '../../components/modals/suspendAccount.js';
import Un_Suspend_AccountModal from '../../components/modals/Un_Suspend_Account.js';
import Delete_Account_Modal from '../../components/modals/delete_account.js'
//icons imports
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import FiberManualRecordRoundedIcon from '@mui/icons-material/FiberManualRecordRounded';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import ArrowDropUpRoundedIcon from '@mui/icons-material/ArrowDropUpRounded';
//api calls
import Get_SalesPerson from '../api/salespeople/get_salesperson.js'
import Get_Orders from '../api/orders/get_orders.js';
//utils
import Cookies from 'universal-cookie';
import jwt_decode from "jwt-decode";
import moment from 'moment';
//styles
import styles from '../../styles/Inventory.module.css'

function Salesperson(){
	const [is_delete_Modalvisible,set_is_delete_Modal_visible]=useState(false);
	const [issuspendModalvisible,setissuspendModalvisible]=useState(false);
	const [is_un_suspend_Modal_visible,set_is_un_suspend_Modal_visible]=useState(false);

	const toast = useToast();
	const router = useRouter();
	const query = router.query
	const id = query.id

	const [salesperson_data,set_salesperson_data] = useState('');
	const [sort_value,set_sort_value]=useState('')
	const [orders_data,set_orders]=useState([]);
	const [total_orders,set_total_orders]=useState(0);
	const [fromDate,set_fromDate]=useState('');
	const [toDate,set_toDate]=useState(moment(new Date()).format("YYYY-MM-DD"));
	const [total,set_total]=useState(0);

	//view info
	const [view_bio_active,set_view_bio_active]=useState(false);
	const [view_payment_info_active,set_view_payment_info_active]=useState(false);
	const [view_sales_summary_info_active,set_view_sales_summary_info_active]=useState(false);
	const [view_sales_active,set_view_sales_active]=useState(false);

	const cookies = new Cookies();
    let token = cookies.get('admin_token');
    const [auth_role,set_auth_role]=useState("")

	const payload = {
		_id : id,
		auth_role
	}

	const get_data=async(payload)=>{
		await Get_SalesPerson(payload).then((response)=>{
			console.log(response.data)
			const email = response.data?.email_of_salesperson
			set_salesperson_data(response.data)
			fetch_orders(email)
		})
	}

	const fetch_orders=async(email)=>{
		await Get_Orders().then((response)=>{
			//console.log(response.data)
			const data = response.data
			//console.log(data)
			const fetched_salesperson_orders_data = data?.filter((item) => 	item?.email_of_creator.toLowerCase().includes(email?.toLowerCase()))
			const result_data = fetched_salesperson_orders_data?.filter((item) => item?.order_status.includes(sort_value.toLowerCase()) )
			set_total_orders(fetched_salesperson_orders_data?.length)
			//filter with date
			if (fromDate !== '' && toDate !== ''){
				//console.log(fromDate,toDate)
				let filtered_by_date = result_data?.filter((item)=>{
					return new Date(item?.createdAt).getTime() >= new Date(fromDate).getTime() && new Date(item?.createdAt).getTime() <= new Date(toDate).getTime()
				});
				//console.log(filtered_by_date)
				set_orders(filtered_by_date)

				const completed_orders = filtered_by_date?.filter((item)=>item.order_status.includes('completed'))
				const completed_sales_data = completed_orders.map((item)=> item.total)
				let total_sales = Intl.NumberFormat().format(completed_sales_data.reduce((a, b) => a + b, 0));
				set_total(total_sales)
			}else{
				set_orders(result_data)
				const completed_orders = result_data?.filter((item)=>item.order_status.includes('completed'))
				const completed_sales_data = completed_orders.map((item)=> item.total)
				let total_sales = Intl.NumberFormat().format(completed_sales_data.reduce((a, b) => a + b, 0));
				set_total(total_sales)
			}
		})
	}

	useEffect(()=>{
		if (!payload || id === undefined){
			toast({
              title: '',
              description: `...broken link, redirecting you.`,
              status: 'info',
              isClosable: true,
            });
			router.push('/salespersons')
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
	},[sort_value,toDate,fromDate])
	const Clear_Filter=()=>{
		set_sort_value('')
		set_fromDate('')
		set_toDate(moment(new Date()).format("YYYY-MM-DD"))
	}
	return(
		<Flex direction='column' gap='2'>
			<Delete_Account_Modal is_delete_Modalvisible={is_delete_Modalvisible} set_is_delete_Modal_visible={set_is_delete_Modal_visible} salesperson_data={salesperson_data} acc_type={"salespersons"} payload={payload}/>
			<SuspendAccountModal issuspendModalvisible={issuspendModalvisible} setissuspendModalvisible={setissuspendModalvisible} salesperson_data={salesperson_data} acc_type={"salespersons"} payload={payload}/>
			<Un_Suspend_AccountModal is_un_suspend_Modal_visible={is_un_suspend_Modal_visible} set_is_un_suspend_Modal_visible={set_is_un_suspend_Modal_visible} salesperson_data={salesperson_data} acc_type={"salespersons"} payload={payload}/>
			<Header />
			<Flex p='1' direction='column'>
				<Flex mt='-2' p='2' mb={'-2'} fontSize={'10px'} color='grey' gap='1' fontWeight={'bold'}>
					<Text cursor='pointer' color='#009393' onClick={(()=>{router.push('/dashboard')})}>Dashboard</Text>
					<Text>&gt;</Text>
					<Text onClick={(()=>{router.back()})} cursor={'pointer'}>salespeople</Text>
					<Text>&gt;</Text>
					<Text>{salesperson_data?._id}</Text>		
				</Flex>
				<Flex p='1' align='center' cursor={'pointer'} onClick={(()=>{router.back()})}>
					<ArrowBackRoundedIcon style={{fontSize:'20px'}}/>
					<Text>back</Text>
				</Flex>
				<Flex justify='space-between' gap='4'>
					<Flex gap='2' p='2'>
						{salesperson_data?.profile_photo_url == '' || !salesperson_data?.profile_photo_url? 
							<Flex gap='2' >
								<AccountCircleIcon style={{fontSize:'100px',backgroundColor:"#eee",borderRadius:'150px'}} />
							</Flex>
						: 
							<Flex gap='2' >
								<Image borderRadius='5' boxSize='100px' src={salesperson_data?.profile_photo_url} alt='profile photo' boxShadow='lg' objectFit='cover'/>
							</Flex>
						}
						<Flex fontSize={'12px'} direction='column' ml='2'>
							<Text fontSize='20px' fontWeight='bold'>{salesperson_data?.first_name} {salesperson_data?.last_name}</Text>
							{salesperson_data?.suspension_status? 
								<Flex align='center' gap='2' cursor='pointer'>
									<NoAccountsIcon style={{fontSize:'16px',color:'grey'}}/>
									<Text fontWeight='bold' color='red'>suspended</Text>
								</Flex>
								: 
								<Flex align='center' gap='2' cursor='pointer'>
									<AccountCircleRoundedIcon style={{fontSize:'16px',color:'grey'}}/>
									<Text fontWeight='bold' color='green'>active</Text>
								</Flex>
							}
							{salesperson_data?.open_to_consultancy? 
								<Flex align='center' gap='2'>
									<FiberManualRecordRoundedIcon style={{fontSize:'16px',color:'#009393'}}/>
									<Text fontWeight='bold' color='grey' >Open for Cosultancy</Text>
								</Flex>
							:
								<Flex align='center' gap='2'>
									<FiberManualRecordRoundedIcon style={{fontSize:'16px',color:'grey'}}/>
									<Text textDecoration={'1px solid line-through grey'} fontWeight='bold' color='grey' >Open for Cosultancy</Text>
								</Flex>
							}
						</Flex>
					</Flex>
				</Flex>
				<Flex flex='1' gap='1' fontSize='14px' p='2' direction='column' bg='#fff' m='2' borderRadius='5px' boxShadow='md'>
					<Text><span style={{color:'grey'}}>Email:</span>&ensp;&ensp;&ensp;&ensp;&ensp;{salesperson_data?.email_of_salesperson}</Text>
					<Text><span style={{color:'grey'}}>Mobile:</span>&ensp;&ensp;&ensp;&ensp;{salesperson_data?.mobile_of_salesperson}</Text>
					<Text><span style={{color:'grey'}}>Company:</span>&ensp;&nbsp;{salesperson_data?.company_name}</Text>
					<Text><span style={{color:'grey'}}>Address</span>&ensp;&ensp;&ensp;&nbsp;{salesperson_data?.address}</Text>
					<Text><span style={{color:'grey'}}>Joined in:</span>&ensp;&nbsp;&nbsp;{moment( salesperson_data?.joined_in).format("MMM Do YY")}</Text>
				</Flex>
 				<Flex direction='column' gap='1' p='2' fontSize={'14px'}>
					<Flex gap='' align='center'>
							<Text fontWeight='bold'>Bio</Text>
							{view_bio_active? 
								<ArrowDropUpRoundedIcon style={{fontSize:'24px',color:'grey',cursor:'pointer'}} onClick={(()=>{set_view_bio_active(false)})}/>	
								:
								<ArrowDropDownRoundedIcon style={{fontSize:'24px',color:'grey',cursor:'pointer'}} onClick={(()=>{set_view_bio_active(true)})}/>
							}
						</Flex>
						{view_bio_active? 
							<Text p='2' bg='#eee' borderRadius='5' boxShadow='lg'>{salesperson_data?.bio}</Text>
							:
							null
						}
					</Flex>
					<Divider/>
					<Flex direction='column' gap='1' p='2' fontSize={'14px'}>
						<Flex gap='' align='center'>
							<Text fontWeight='bold'>Payment Method</Text>
							{view_payment_info_active? 
								<ArrowDropUpRoundedIcon style={{fontSize:'24px',color:'grey',cursor:'pointer'}} onClick={(()=>{set_view_payment_info_active(false)})}/>	
								:
								<ArrowDropDownRoundedIcon style={{fontSize:'24px',color:'grey',cursor:'pointer'}} onClick={(()=>{set_view_payment_info_active(true)})}/>
							}
						</Flex>
						{view_payment_info_active? 
							<Text p='2' bg='#eee' borderRadius='5' boxShadow='lg'>{salesperson_data?.payment_method}</Text>
							:
							null
						}
					</Flex>
					<Divider/>
					<Flex direction='column' gap='1' p='2' fontSize={'14px'}>
						<Flex gap='' align='center'>
							<Text fontWeight='bold'>Sales summary</Text>
							{view_sales_summary_info_active? 
								<ArrowDropUpRoundedIcon style={{fontSize:'24px',color:'grey',cursor:'pointer'}} onClick={(()=>{set_view_sales_summary_info_active(false)})}/>	
								:
								<ArrowDropDownRoundedIcon style={{fontSize:'24px',color:'grey',cursor:'pointer'}} onClick={(()=>{set_view_sales_summary_info_active(true)})}/>
							}
						</Flex>
						{view_sales_summary_info_active? 
							<Flex direction='column' gap='2' bg='#eee' p='1' boxShadow='lg'>
								<Text><span style={{fontWeight:'bold'}}>Number of sales</span>: {orders_data?.length}</Text>
								<Text> <span style={{fontWeight:'bold'}}>Total</span> : KES {total}</Text>
							</Flex>
							:
							null
						}
					</Flex>
					<Divider/>
					<Flex direction='column' gap='1' p='2' fontSize={'14px'}>
						<Flex gap='' align='center'>
							<Text fontWeight='bold'>Sales</Text>
							{view_sales_active? 
								<ArrowDropUpRoundedIcon style={{fontSize:'24px',color:'grey',cursor:'pointer'}} onClick={(()=>{set_view_sales_active(false)})}/>	
								:
								<ArrowDropDownRoundedIcon style={{fontSize:'24px',color:'grey',cursor:'pointer'}} onClick={(()=>{set_view_sales_active(true)})}/>
							}
						</Flex>
						{view_sales_active? 
							<Flex direction='column' bg='#eee' borderRadius='5'>
								<Flex gap='2' p='2' align='center'>
										<Text >Status</Text>
										<Select w='150px' bg='#fff' value={sort_value} placeholder='sort sales' onChange={((e)=>{set_sort_value(e.target.value)})}>
											<option value=''>All </option>
											<option value='pending'>Pending </option>
											<option value='completed'>Completed</option>
											<option value='rejected'>Rejected</option>
										</Select>
										{sort_value || fromDate !== '' ? <Text color='#000' cursor='pointer' onClick={Clear_Filter}>clear filter</Text>:null}
								</Flex>
								<Flex gap='2' p='2' direction='column'>
									<Flex align='center' gap='2'>
										<Text>From</Text>
										<Input bg='#fff' value={fromDate} w='150px' type='date' onChange={((e)=>{set_fromDate(e.target.value)})}/>
									</Flex>
									<Flex align='center' gap='7'>
										<Text>To</Text>
										<Input bg='#fff' value={toDate} w='150px' type='date' onChange={((e)=>{set_toDate(e.target.value)})}/>
									</Flex>
								</Flex>
								<Divider/>
								<Flex className={styles.products_container_body} p='1'>
										{orders_data?.length == 0? 
											<Flex justify='center' align='center' bg='#eee' p='2' borderRadius='5' w='100%' gap='2'>
												{total_orders === 0 ? <Text>The User has not made any sales yet.</Text> : <Text>No Items meet your query</Text>}
											</Flex>
										:
											<Flex gap='1' className={styles.products_container}>
												{orders_data.map((order)=>{
													return(
														<OrderItem key={order?._id} order={order}/>
													)
												})}
											</Flex>		
									}
								</Flex>
							</Flex>
							:
							null
						}
					</Flex>
					<Flex p='3' gap='2' direction={'column'} mt='-4'>
						<Text color='grey'>Actions</Text>
						<Divider/>
						<Flex gap='3' align='center'>
							<MarkEmailUnreadIcon style={{fontSize:'16px',color:'grey'}}/>
							<Link color='grey' fontSize='14px' href={`mailto: ${salesperson_data?.email_of_salesperson}`} isExternal>Email salesperson</Link>
						</Flex>
						{salesperson_data?.suspension_status? 
							<Flex align='center' gap='2' cursor='pointer' onClick={(()=>{set_is_un_suspend_Modal_visible(true)})}>
								<AccountCircleRoundedIcon style={{fontSize:'20px',color:'grey'}}/>
								<Text color='grey' fontSize='14px'>Un suspend account</Text>
							</Flex>
								: 
							<Flex align='center' gap='2' cursor='pointer' onClick={(()=>{setissuspendModalvisible(true)})}>
								<NoAccountsIcon style={{fontSize:'20px',color:'grey'}}/>
								<Text color='grey' fontSize='14px'>Suspend Account</Text>
							</Flex>
						}
						<Flex align='center' gap='2' cursor='pointer' onClick={(()=>{set_is_delete_Modal_visible(true)})}>
							<DeleteRoundedIcon style={{fontSize:'20px',color:'grey'}}/>
							<Text color='red' fontWeight='bold'>Delete Account</Text>
						</Flex>
					</Flex>
			</Flex>
		</Flex>
	)
}

export default Salesperson;

const OrderItem=({order})=>{
	const router = useRouter();
	return(
		<Flex boxShadow='lg' p='2' bg='#fff' onClick={(()=>{router.push(`/order/${order?._id}`)})} cursor='pointer' borderRadius='5px' direction='column' position='relative'>
			<Text fontSize='20px' fontWeight='bold'>Company name: {order?.company_name_of_client}</Text>
			<Text>Product Name: {order?.name_of_product}</Text>
			<Text>Total: {order?.total}</Text>
			<Flex gap='1'>
				<Text>Order Status:</Text>
				<Text color={order?.order_status === 'completed'? 'green' : 'orange'}>{order?.order_status}</Text>
			</Flex>
		</Flex>
	)
}
