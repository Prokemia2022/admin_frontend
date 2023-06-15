import React,{useState,useEffect}from 'react';
import {Flex,Text,Button,Image,Input,useToast} from '@chakra-ui/react';
import Header from '../../components/Header.js'
import {useRouter} from 'next/router';
import Get_Order from '../api/orders/get_order.js';
import Edit_Order from '../api/orders/edit_order.js';
import Create_Invoice_PDF from '../api/orders/create_invoice_pdf.js';
import Reject_Order from '../api/orders/reject_order.js'
import Approve_Order from '../api/orders/approve_order.js'
import Delete_Order from '../api/orders/delete_order.js'
import Cookies from 'universal-cookie';
import jwt_decode from "jwt-decode";
import Loading from '../../components/Loading.js';
import moment from 'moment';

export default function Order(){
	const router = useRouter();
	const toast = useToast();

	const id = router.query;
	const cookies = new Cookies();
    let token = cookies.get('admin_token');
    const [auth_role,set_auth_role]=useState("");
	const [is_submitting,set_is_submitting]=useState(false);

	const payload = {
		_id : id.id,
		auth_role
	}
	const [order_data,set_order_data]=useState('')
	const [edit,set_edit]=useState(false)

	const get_Data=async(payload)=>{
		await Get_Order(payload).then((response)=>{
			set_order_data(response.data)
			//console.log(response.data)
		})
	}
	useEffect(()=>{
		if (!payload || id === undefined){
			toast({
				title: '',
				position: 'top-left',
				variant:"subtle",
				description: `...broken link, redirecting you`,
				status: 'info',
				isClosable: true,
			});
			router.push('/orders')
		}else{
			//console.log(payload)
			get_Data(payload)
		}
		if (!token){
			toast({
				title: '',
				position: 'top-left',
				variant:"subtle",
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
	},[id,is_submitting])
	let date = moment(order_data?.createdAt).format("MMM Do YY")
	let today = new Date().toLocaleDateString()
	let delivery_date = moment(order_data?.delivery_date).format("MMM Do YY")

	const handle_create_invoice=async()=>{
		const order_payload = {
		_id: order_data?._id,
		//client-info
		name_of_client: order_data?.name_of_client,
		company_name_of_client: order_data?.company_name_of_client,
		mobile_of_client: order_data?.mobile_of_client,
		email_of_client: order_data?.email_of_client,
		location_of_client: order_data?.location_of_client,
		//product info
		name_of_product: order_data?.name_of_product,
		volume_of_items: order_data?.volume_of_items,
		unit_price: order_data?.unit_price,
		total: order_data?.volume_of_items * order_data?.unit_price,
		//payment&delivery
		createdAt:date,
		delivery_date: delivery_date,
		delivery_terms: order_data?.delivery_terms,
		payment_terms: order_data?.payment_terms
    }
		Create_Invoice_PDF(order_payload)
		await Approve_Order(payload).then(()=>{
			router.reload()
		})
	}

	const handle_download_invoice=()=>{
		const order_payload = {
			_id: order_data?._id,
			//client-info
			name_of_client: order_data?.name_of_client,
			company_name_of_client: order_data?.company_name_of_client,
			mobile_of_client: order_data?.mobile_of_client,
			email_of_client: order_data?.email_of_client,
			location_of_client: order_data?.location_of_client,
			//product info
			name_of_product: order_data?.name_of_product,
			volume_of_items: order_data?.volume_of_items,
			unit_price: order_data?.unit_price,
			total: order_data?.volume_of_items * order_data?.unit_price,
			//payment&delivery
			createdAt:date,
			delivery_date: delivery_date,
			delivery_terms: order_data?.delivery_terms,
			payment_terms: order_data?.payment_terms
		}
		Create_Invoice_PDF(order_payload)
	}

	const Handle_Reject_Order=async()=>{
		set_is_submitting(true)
		await Reject_Order(payload).then(()=>{
			toast({
				title: '',
				position: 'top-left',
				variant:"subtle",
				description: `${payload?.name_of_product} has successfully been rejected`,
				status: 'success',
				isClosable: true,
			});
		}).catch((err)=>{
			toast({
				title: '',
				position: 'top-left',
				variant:"subtle",
				description: err.response.data,
				status: 'error',
				isClosable: true,
			});
		}).finally(()=>{
			set_is_submitting(false)
		})
	}

	const Handle_Approve_Order=async()=>{
		set_is_submitting(true)
		await Approve_Order(payload).then(()=>{
			toast({
				title: '',
				position: 'top-left',
				variant:"subtle",
				description: `${payload?.name_of_product} has successfully been approved`,
				status: 'success',
				isClosable: true,
			});
		}).catch((err)=>{
			toast({
				title: '',
				position: 'top-left',
				variant:"subtle",
				description: err.response.data,
				status: 'error',
				isClosable: true,
			});
		}).finally(()=>{
			set_is_submitting(false)
		})
	}
	const Handle_Delete_Order=async()=>{
		set_is_submitting(true)
		await Delete_Order(payload).then(()=>{
			toast({
				title: '',
				position: 'top-left',
				variant:"subtle",
				description: `${order_data?.name_of_product} has successfully been deleted`,
				status: 'success',
				isClosable: true,
			});
			router.push('/orders')
		}).catch((err)=>{
			toast({
				title: '',
				position: 'top-left',
				variant:"subtle",
				description: err.response.data,
				status: 'error',
				isClosable: true,
			});
		}).finally(()=>{
			set_is_submitting(false)
		})
	}
	return(
		<Flex direction='column' gap='2'>
			<Header />
			{edit?
				<Edit_Order_Item order_data={order_data} set_edit={set_edit} auth_role={auth_role}/>
			:
				<Flex p='4' direction='column' gap='2'>
					<Flex boxShadow='lg' p='2' bg='#eee' borderRadius='5px' direction='column' position='relative' gap='2'>
						<Text fontSize='28px' fontWeight='bold'>{order_data?.name_of_product}</Text>
						<Text fontSize='18px'>Order Id: {order_data?._id}</Text>						
						<Flex bg='#fff' p='1' borderRadius='5' direction='column' gap='1' boxShadow='lg'>
							<Text fontWeight='bold'>Sales details</Text>
							<Text>Name: <span style={{color:'#009393',textDecoration:'underline',cursor:'pointer'}} onClick={(()=>{router.push(`/salesperson/${order_data?.creator_id}`)})}>{order_data?.creator_name}</span></Text>
							<Text>Email: {order_data?.email_of_creator}</Text>
							<Text>Mobile: {order_data?.mobile_of_creator}</Text>
						</Flex>
						<Flex bg='#fff' p='1' borderRadius='5' direction='column' gap='1' boxShadow='lg'>
							<Text fontWeight='bold'>Client details</Text>
							<Text>Name: {order_data?.name_of_client}</Text>
							<Text>Compamy Name: {order_data?.company_name_of_client}</Text>
							<Text>Email: {order_data?.email_of_client}</Text>
							<Text>Mobile: {order_data?.mobile_of_client}</Text>
							<Text>Company_location: {order_data?.location_of_client}</Text>
						</Flex>
						<Flex bg='#fff' p='1' borderRadius='5' direction='column' gap='1' boxShadow='lg'>
							<Text fontWeight='bold'>Product details</Text>
							<Text>Volume: {order_data?.volume_of_items}</Text>
							<Text>Unit Price: {order_data?.unit_price}</Text>
							<Text>Total: KSH {order_data?.total}</Text>
						</Flex>
						<Flex bg='#fff' p='1' borderRadius='5' direction='column' gap='1' boxShadow='lg'>
							<Text>Delivery_terms: {order_data?.delivery_terms}</Text>
							<Text>Delivery_date: {delivery_date}</Text>
							<Text>Payment_terms: {order_data?.payment_terms}</Text>
						</Flex>
						<Flex bg='#fff' p='1' borderRadius='5' direction='column' gap='1' boxShadow='lg'>
							<Text>Created_date: {date}</Text>
							<Flex gap='1'>
								<Text>Order Status:</Text>
								<Text color={order_data?.order_status === 'completed'? 'green' : 'orange'}>{order_data?.order_status}</Text>
							</Flex>
						</Flex>
					</Flex>
					{order_data?.order_status === 'completed'?
						<>
							<Flex justify='center' gap='2' align='center' m='2'>
								<Button bg='#009393' color='#fff' flex='1' onClick={handle_download_invoice}>Download Invoice</Button>
								<Button bg='#eee' color='green' flex='1' >Order Completed</Button>
							</Flex>
							<Button m='2' mt='0' bg='red' color='#fff' border='1px solid red' onClick={Handle_Delete_Order}>Delete Order</Button>
							<Button m='2' mt='0' h='40px' border='1px solid #000' color='#000'  onClick={(()=>{router.back()})}>Go back to orders</Button>
						</>
					:
						<Flex direction='column' gap='2'>
							{is_submitting? 
								<Button
									bg='#009393'
									borderRadius='0' 
									flex='1'
									color='#fff'
									align='center'
								>
									<Loading width='40px' height='40px' color='#ffffff'/>
									saving order...
								</Button>
								:
									<>
										{order_data.order_status === 'rejected'?
											null
										:
											<Flex justify='center' gap='2'>
												<Button bg='#009393' color='#fff' flex='1' onClick={handle_create_invoice}>Create Invoice</Button>
												<Button bg='#000' color='#fff' flex='1' onClick={(()=>{set_edit(true)})}>Edit Order</Button>
											</Flex>
										}
										{order_data.order_status === 'rejected'?
											<Flex gap='2'>
												<Button flex='1' bg='#009393' color='#fff' onClick={Handle_Approve_Order}>Approve Order</Button>
												<Button flex='1' bg='#fff' color='red' border='1px solid red' onClick={Handle_Delete_Order}>Delete Order</Button>
											</Flex>
										:
											<Button bg='#fff' color='red' border='1px solid red' onClick={Handle_Reject_Order}>Reject Order</Button>	
										}
										<Button mt='0' h='40px' border='1px solid #000' color='#000'  onClick={(()=>{router.back()})}>Go back to orders</Button>
									</>							
							}
						</Flex>
					}
				</Flex>
			}
		</Flex>
	)
}

const Edit_Order_Item=({order_data,set_edit,auth_role})=>{
	const toast= useToast()
    //client_information
    const [name_of_client,set_name_of_client]=useState(order_data?.name_of_client);
    const [company_name_of_client,set_company_name_of_client]=useState(order_data?.company_name_of_client);
    const [mobile_of_client,set_mobile_of_client]=useState(order_data?.mobile_of_client);    
    const [email_of_client,set_email_of_client]=useState(order_data?.email_of_client);
    const [location_of_client,set_location_of_client]=useState(order_data?.location_of_client);
    //product information
    const [name_of_product,set_name_of_product]=useState(order_data?.name_of_product);
    const [volume_of_items,set_volume_of_items]=useState(order_data?.volume_of_items);
    const [unit_price,set_unit_price]=useState(order_data?.unit_price);
    //payment&delivery
    const [delivery_terms,set_delivery_terms]=useState(order_data?.delivery_terms);
    const [payment_terms,set_payment_terms]=useState(order_data?.payment_terms);
    const [delivery_date,set_delivery_date]=useState(order_data?.delivery_date);

	const payload = {
		_id: order_data?._id,
		//client-info
		name_of_client,
		company_name_of_client,
		mobile_of_client,
		email_of_client,
		location_of_client,
		//product info
		name_of_product,
		volume_of_items,
		unit_price,
		total: volume_of_items * unit_price,
		//payment&delivery
		delivery_date,
		delivery_terms,
		payment_terms,
		auth_role
    }

	const handle_edit=async()=>{
		//console.log(payload)
		await Edit_Order(payload).then(()=>{
			toast({
				title: '',
				position: 'top-left',
				variant:"subtle",
				description: `${payload?.name_of_product} has been edited successfully`,
				status: 'success',
				isClosable: true,
			});
			set_edit(false)
		}).catch((err)=>{
			//console.log(err)
			toast({
				position: 'top-left',
				variant:"subtle",
				title: 'Error while editing order',
				description: err.response.data,
				status: 'error',
				isClosable: true,
			})
		})		
	}
	return(
		<Flex boxShadow='lg' p='2' bg='#fff' gap='2' borderRadius='5px' direction='column' position='relative' border='2px dashed #009393' m='2'>
			<Flex direction='column'>
			  <Text>Name of Client</Text>
			  <Input type='text' placeholder={order_data?.name_of_client} variant='filled' onChange={((e)=>{set_name_of_client(e.target.value)})}/>
			</Flex>
			<Flex direction='column'>
			  <Text>Email of Client:</Text>
			  <Input type='Email' placeholder={order_data?.email_of_client} variant='filled' onChange={((e)=>{set_email_of_client(e.target.value)})}/>
			</Flex>
			<Flex direction='column'>
			  <Text>Mobile of Client</Text>
			  <Input type='text' placeholder={order_data?.mobile_of_client} variant='filled' onChange={((e)=>{set_mobile_of_client(e.target.value)})}/>
			</Flex>
			<Flex direction='column'>
			  <Text>Company location of Client</Text>
			  <Input type='text' placeholder={order_data?.location_of_client} variant='filled' onChange={((e)=>{set_location_of_client(e.target.value)})}/>
			</Flex>
			<Flex direction='column'>
			  <Text>Company Name of Client</Text>
			  <Input type='text' placeholder={order_data?.company_name_of_client} variant='filled' onChange={((e)=>{set_company_name_of_client(e.target.value)})}/>
			</Flex>
			<Flex direction='column'>
				<Text>Product Name:</Text>
				<Input variant='filled' placeholder={order_data?.name_of_product} onChange={((e)=>{set_name_of_product(e.target.value)})}/>
			</Flex>
			<Flex direction='column'>
				<Text>Unit Price:</Text>
				<Input variant='filled' placeholder={order_data?.unit_price} onChange={((e)=>{set_unit_price(e.target.value)})}/>
			</Flex>
			<Flex direction='column'>
				<Text>Volume of Items:</Text>
				<Input variant='filled' placeholder={order_data?.volume_of_items} onChange={((e)=>{set_volume_of_items(e.target.value)})}/>
			</Flex>
			<Flex direction='column'>
				<Text>Email of Client:</Text>
				<Input variant='filled' placeholder={order_data?.email_of_client} onChange={((e)=>{set_email_of_client(e.target.value)})}/>
			</Flex>
			<Flex direction='column'>
				<Text>Delivery_terms:</Text>
				<Input variant='filled' placeholder={order_data?.delivery_terms} onChange={((e)=>{set_delivery_terms(e.target.value)})}/>
			</Flex>
			<Flex direction='column'>
				<Text>Delivery_date</Text>
				<Input type='date' variant='filled' placeholder={order_data?.delivery_date} onChange={((e)=>{set_delivery_date(e.target.value)})}/>
			</Flex>
			<Flex direction='column'>
				<Text>Payment_terms:</Text>
				<Input variant='filled' placeholder={order_data?.payment_terms} onChange={((e)=>{set_payment_terms(e.target.value)})}/>
			</Flex>
			<Flex gap='2'>
				<Button onClick={handle_edit} bg='#009393' mt='2' color='#fff' flex='1'>Save</Button>
				<Button onClick={(()=>{set_edit(false)})} bg='#fff' border='1px solid red' mt='2' color='#000' flex='1'>Cancel</Button>
			</Flex>
		</Flex>
	)
}