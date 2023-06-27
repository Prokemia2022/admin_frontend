//import { useSearchParams } from 'next/navigatipn';
import React,{useState,useEffect}from 'react';
//module imports
import {Flex,Text,Button,Image,useToast,Link,Divider} from '@chakra-ui/react';
import {useRouter} from 'next/router'
//components imports
import Header from '../../components/Header.js'
import SuspendAccountModal from '../../components/modals/suspendAccount.js';
import Un_Suspend_AccountModal from '../../components/modals/Un_Suspend_Account.js';
import Delete_Account_Modal from '../../components/modals/delete_account.js'
//api calls
import Get_Distributor from '../api/distributors/get_distributor.js';
import Get_Manufacturer from '../api/manufacturers/get_manufacturer.js'

import Subscribe_Distriutor from '../api/distributors/subscribe_account.js'
import Un_Subscribe_Distriutor from '../api/distributors/un_subscribe_account.js';
import Subscribe_Manufacturer from '../api/manufacturers/subscribe_account.js'
import Un_Subscribe_Manufacturer from '../api/manufacturers/un_subscribe_manufacturer_account.js';

import Verify_Distributor_Email from '../api/distributors/verify_distributor_email.js';
import Un_Verify_Distributor_Email from '../api/distributors/un_verify_distributor_email.js';
import Verify_Manufacturer_Email from '../api/manufacturers/verify_manufacturer_email.js';
import Un_Verify_Manufacturer_Email from '../api/manufacturers/un_verify_manufacturer_email.js';

import Get_Products from '../api/Products/get_products.js'
//icons
import VerifiedIcon from '@mui/icons-material/Verified';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import ArrowDropUpRoundedIcon from '@mui/icons-material/ArrowDropUpRounded';
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded';
import StarOutlineRoundedIcon from '@mui/icons-material/StarOutlineRounded';

import EditNoteIcon from '@mui/icons-material/EditNote';
import BusinessIcon from '@mui/icons-material/Business';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import UnsubscribeIcon from '@mui/icons-material/Unsubscribe';
import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';
//utils
import Cookies from 'universal-cookie';
import jwt_decode from "jwt-decode";
import moment from 'moment';
//styles
import styles from '../../styles/Inventory.module.css'

export default function Supplier(){
	//utils
	const router = useRouter();
    const toast = useToast();

	const query = router.query
	const supplier_id = query?.id;
    const supplier_type = query?.supplier;

    const supplier_details = {
        id: supplier_id,
        type: supplier_type
    }

	//modal states
	const [is_delete_Modalvisible,set_is_delete_Modal_visible]=useState(false);
	const [issuspendModalvisible,setissuspendModalvisible]=useState(false);
	const [is_un_suspend_Modal_visible,set_is_un_suspend_Modal_visible]=useState(false);

	const [is_refresh_data,set_is_refresh]=useState(null);

	const [supplier_data,set_supplier_data] = useState('')
	const [products,set_products]=useState([]);
	const [industries,set_industries]=useState([]);

    //view info
	const [view_bio_active,set_view_bio_active]=useState(false);
	const [view_industries_active,set_view_industries_active]=useState(false);
    const [view_products_active,set_view_products_active]=useState(false);
	const [view_experts_active,set_view_experts_active]=useState(false);

	const cookies = new Cookies();
    let token = cookies.get('admin_token');
    const [auth_role,set_auth_role]=useState("")

	const payload = {
		_id : supplier_details.id,
        type: supplier_details.type,
		email: supplier_data?.email_of_company,	
		auth_role
	}
	//useEffects
	//functions

    const get_supplier_data=async(payload)=>{
		//console.log(payload)
        if(payload?.type == 'distributor'){
			await Get_Distributor(payload).then((response)=>{
				//console.log(response.data)
				set_supplier_data(response?.data)
				const email = response?.data?.email_of_company
				get_products_data(email)
			}).catch((err)=>{
				//console.log(err)
				toast({
					title: '',
					description: `${err}`,
					status: 'error',
					isClosable: true,
				});
			})
		}else if(payload?.type == 'manufacturer'){
			await Get_Manufacturer(payload).then((response)=>{
				//console.log(response)
				set_supplier_data(response?.data)
				const email = response?.data?.email_of_company
				get_products_data(email)
			}).catch((err)=>{
				////console.log(err)
				toast({
					title: '',
					description: `${err}`,
					status: 'error',
					isClosable: true,
				});
			})
		}else{
			//console.log('error')
		}
	}
	const get_products_data=async(email)=>{
		await Get_Products().then((response)=>{
			const data = response?.data
			//console.log(data)
			const result = data?.filter((item)=> item?.email_of_lister.toLowerCase().includes(email.toLowerCase()))
			set_products(result)

			const industry_values = result.map(item=>item?.industry)
			//console.log([...new Set(industry_values)])
			set_industries([...new Set(industry_values)])
			//console.log(result)
		}).catch((err)=>{
			////console.log(err)
			toast({
				title: '',
				description: `${err.data}`,
				status: 'error',
				isClosable: true,
			});
		})
	}

	const handle_subscribe_account=async()=>{
		if (supplier_details?.type == 'distributor'){
			await Subscribe_Distriutor(payload).then(()=>{
				toast({
					title: '',
					description: `${supplier_data?.company_name} account has been upgraded.`,
					status: 'info',
					isClosable: true,
				});
			}).catch((err)=>{
				////console.log(err)
				toast({
					title: '',
					description: err.response?.data,
					status: 'error',
					isClosable: true,
				});
			}).finally(()=>{
				set_is_refresh(!is_refresh_data)
			})
		}else if(supplier_details?.type == 'manufacturer'){
			await Subscribe_Manufacturer(payload).then(()=>{
				toast({
					title: '',
					description: `${supplier_data?.company_name} account has been upgraded.`,
					status: 'info',
					isClosable: true,
				});
			}).catch((err)=>{
				////console.log(err)
				toast({
					title: '',
					description: err.response?.data,
					status: 'error',
					isClosable: true,
				});
			}).finally(()=>{
				set_is_refresh(!is_refresh_data)
			})
		}
	}
	const handle_un_subscribe_account=async()=>{
		if (supplier_details?.type == 'distributor'){
			await Un_Subscribe_Distriutor(payload).then(()=>{
				toast({
					title: '',
					description: `${supplier_data?.company_name} account has been unsubscribed.`,
					status: 'info',
					isClosable: true,
				});
			}).catch((err)=>{
				////console.log(err)
				toast({
					title: '',
					description: err.response?.data,
					status: 'error',
					isClosable: true,
				});
			}).finally(()=>{
				set_is_refresh(!is_refresh_data)
			})
		}else if(supplier_details?.type == 'manufacturer'){
			await Un_Subscribe_Manufacturer(payload).then(()=>{
				toast({
					title: '',
					description: `${supplier_data?.company_name} account has been unsubscribed.`,
					status: 'info',
					isClosable: true,
				});
			}).catch((err)=>{
				////console.log(err)
				toast({
					title: '',
					description: err.response?.data,
					status: 'error',
					isClosable: true,
				});
			}).finally(()=>{
				set_is_refresh(!is_refresh_data)
			})
		}
	}

	const handle_verify_email_account=async()=>{
		if (supplier_details?.type == 'distributor'){
			await Verify_Distributor_Email(payload).then(()=>{
				toast({
					title: '',
					description: `${supplier_data?.company_name}'s email has been verified.`,
					status: 'info',
					isClosable: true,
				});
			}).catch((err)=>{
				////console.log(err)
				toast({
					title: '',
					description: err.response?.data,
					status: 'error',
					isClosable: true,
				});
			}).finally(()=>{
				set_is_refresh(!is_refresh_data)
			})
		}else if(supplier_details?.type == 'manufacturer'){
			await Verify_Manufacturer_Email(payload).then(()=>{
				toast({
					title: '',
					description: `${supplier_data?.company_name}'s email has been verified.`,
					status: 'info',
					isClosable: true,
				});
			}).catch((err)=>{
				////console.log(err)
				toast({
					title: '',
					description: err.response?.data,
					status: 'error',
					isClosable: true,
				});
			}).finally(()=>{
				set_is_refresh(!is_refresh_data)
			})
		}
	}

	const handle_un_verify_email_account=async()=>{
		if (supplier_details?.type == 'distributor'){
			await Un_Verify_Distributor_Email(payload).then(()=>{
				toast({
					title: '',
					description: `${supplier_data?.company_name}'s email has been un verified.`,
					status: 'info',
					isClosable: true,
				});
			}).catch((err)=>{
				////console.log(err)
				toast({
					title: '',
					description: err.response?.data,
					status: 'error',
					isClosable: true,
				});
			}).finally(()=>{
				set_is_refresh(!is_refresh_data)
			})
		}else if(supplier_details?.type == 'manufacturer'){
			await Un_Verify_Manufacturer_Email(payload).then(()=>{
				toast({
					title: '',
					description: `${supplier_data?.company_name}'s email has been un verified.`,
					status: 'info',
					isClosable: true,
				});
			}).catch((err)=>{
				////console.log(err)
				toast({
					title: '',
					description: err.response?.data,
					status: 'error',
					isClosable: true,
				});
			}).finally(()=>{
				set_is_refresh(!is_refresh_data)
			})
		}
	}

	useEffect(()=>{
		if (!supplier_details?.id ){
			toast({
				title: '',
				description: `...broken link,we are redirecting you`,
				status: 'info',
				isClosable: true,
			});
			router.back()
		}else{
			get_supplier_data(payload)
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
	},[supplier_details?.id,is_refresh_data])
	return(
		<Flex direction='column' gap='2'>
			<Header />
			<Delete_Account_Modal is_delete_Modalvisible={is_delete_Modalvisible} set_is_delete_Modal_visible={set_is_delete_Modal_visible} supplier_data={supplier_data} acc_type={supplier_details?.type} payload={payload} set_is_refresh={set_is_refresh} is_refresh_data={is_refresh_data}/>
			<SuspendAccountModal issuspendModalvisible={issuspendModalvisible} setissuspendModalvisible={setissuspendModalvisible} supplier_data={supplier_data} acc_type={supplier_details?.type} payload={payload} set_is_refresh={set_is_refresh} is_refresh_data={is_refresh_data}/>
			<Un_Suspend_AccountModal is_un_suspend_Modal_visible={is_un_suspend_Modal_visible} set_is_un_suspend_Modal_visible={set_is_un_suspend_Modal_visible} supplier_data={supplier_data} acc_type={supplier_details?.type} payload={payload} set_is_refresh={set_is_refresh} is_refresh_data={is_refresh_data}/>
			<Flex direction='column' p='2'>
				<Flex p='1' direction='column' gap='1'>
                    <Flex mt='-2' p='2' mb={'-2'} fontSize={'10px'} color='grey' gap='1' fontWeight={'bold'}>
                        <Text cursor='pointer' color='#009393' onClick={(()=>{router.push('/dashboard')})}>Dashboard</Text>
                        <Text>&gt;</Text>
                        <Text onClick={(()=>{router.back()})} cursor={'pointer'}>{supplier_details?.type}s</Text>
                        <Text>&gt;</Text>
                        <Text>{supplier_data?.company_name}</Text>		
                    </Flex>
                    <Flex p='1' align='center' cursor={'pointer'} onClick={(()=>{router.back()})}>
                        <ArrowBackRoundedIcon style={{fontSize:'20px'}}/>
                        <Text>back</Text>
                    </Flex>
                    <Flex gap='2' p='2'>
						{supplier_data?.profile_photo_url == '' || !supplier_data?.profile_photo_url? 
							<Flex gap='2' >
								<AccountCircleIcon style={{fontSize:'100px',backgroundColor:"#eee",borderRadius:'150px'}} />
							</Flex>
						: 
							<Flex gap='2' >
								<Image borderRadius='5' boxSize='100px' src={supplier_data?.profile_photo_url} alt='profile photo' boxShadow='lg' objectFit='cover'/>
							</Flex>
						}
						<Flex fontSize={'12px'} direction='column' ml='2' gap=''>
							<Text fontSize='20px' fontWeight='bold'>{supplier_data?.company_name}</Text>
							{supplier_data?.valid_email_status?
								<Flex align='center' gap='1' color='#009393'>
									<MarkEmailReadIcon style={{fontSize:'18px'}}/>
									<Text >Verified Email</Text>
								</Flex>
								:
								<Flex align='center' gap='1' color='grey'>
									<UnsubscribeIcon style={{fontSize:'18px'}}/>
									<Text textDecoration='1px solid line-through' >Verified Email</Text>
								</Flex>
							}
							{supplier_data?.suspension_status?
								<Flex align='center' gap='1'>
									<DisabledByDefaultRoundedIcon style={{fontSize:'18px',color:'red'}}/>
									<Text color='red' >Suspended</Text>
								</Flex>
								:
								<Flex align='center' gap='1' color='grey'>
									<DisabledByDefaultRoundedIcon style={{fontSize:'18px'}}/>
									<Text textDecoration='1px solid line-through' >Suspended</Text>
								</Flex>
							}
							{supplier_data?.subscription? 
								<Flex align='center' gap='2'>
									<StarRateRoundedIcon style={{fontSize:'18px',color:'#009393'}}/>
									<Text fontWeight='bold' color='grey'>subscribed</Text>
								</Flex>
							:
								<Flex align='center' gap='2'>
									<StarOutlineRoundedIcon style={{fontSize:'18px',color:'grey'}}/>
									<Text textDecoration={'1px solid line-through grey'} fontWeight='bold' color='grey' >subscribed</Text>
								</Flex>
							}
						</Flex>
					</Flex>
                    <Flex m='2' mt='-2' flex='1' gap='1' fontSize='14px' p='2' direction='column' bg='#fff' borderRadius='5px' boxShadow='md'>
                        <Text fontWeight='bold' fontSize='16px'>Company Details</Text>
                        <Text><span style={{color:'grey'}}>Email:</span>&ensp;&ensp;&ensp;&ensp;&ensp;{supplier_data?.email_of_company}</Text>
                        <Text><span style={{color:'grey'}}>Mobile:</span>&ensp;&ensp;&ensp;&ensp;{supplier_data?.mobile_of_company}</Text>
                        <Text><span style={{color:'grey'}}>Company:</span>&ensp;&nbsp;{supplier_data?.company_name}</Text>
                        <Text><span style={{color:'grey'}}>Address</span>&ensp;&ensp;&ensp;&nbsp;{supplier_data?.address_of_company}</Text>
                        <Text><span style={{color:'grey'}}>Joined in:</span>&ensp;&nbsp;&nbsp;{moment( supplier_data?.createdAt).format("MMM Do YY")}</Text>
                    </Flex>
                    <Flex m='2' mt='-2' flex='1' gap='1' fontSize='14px' p='2' direction='column' bg='#fff' borderRadius='5px' boxShadow='md'>
                        <Text fontWeight='bold' fontSize='16px'>Key contact information</Text>
                        <Text><span style={{color:'grey'}}>Name:</span>&emsp;&emsp;&nbsp;{supplier_data?.contact_person_name}</Text>
                        <Text><span style={{color:'grey'}}>Mobile:</span>&ensp;&ensp;&ensp;&ensp;{supplier_data?.contact_mobile}</Text>
                        <Text><span style={{color:'grey'}}>Email:</span>&ensp;&ensp;&ensp;&ensp;&ensp;{supplier_data?.contact_email}</Text>                                                
                    </Flex>
                    <Flex direction='column' gap='1' p='2' fontSize={'14px'}>
                        <Flex gap='' align='center'>
							<Text fontWeight='bold'>Description</Text>
							{view_bio_active? 
								<ArrowDropUpRoundedIcon style={{fontSize:'24px',color:'grey',cursor:'pointer'}} onClick={(()=>{set_view_bio_active(false)})}/>	
								:
								<ArrowDropDownRoundedIcon style={{fontSize:'24px',color:'grey',cursor:'pointer'}} onClick={(()=>{set_view_bio_active(true)})}/>
							}
						</Flex>
						{view_bio_active? 
                            <>
                                {supplier_data?.description === ''? 
                                    <Flex justify='center' align='center' h='15vh' bg='#eee' borderRadius='5'>
                                        <Text>The User has not added a description of their company</Text>
                                    </Flex>
                                    :
                                    <Flex mt='2' bg='#eee' p='2' borderRadius='5' boxShadow='lg' gap='2'>
                                        <Text>{supplier_data?.description}</Text>
                                    </Flex>
                                }
                            </>
							:
							null
						}
                        <Divider/>
					</Flex>
                    <Flex direction='column' gap='1' p='2' fontSize={'14px'}>
                        <Flex gap='' align='center'>
							<Text fontWeight='bold'>Industries [{industries?.length}]</Text>
							{view_industries_active? 
								<ArrowDropUpRoundedIcon style={{fontSize:'24px',color:'grey',cursor:'pointer'}} onClick={(()=>{set_view_industries_active(false)})}/>	
								:
								<ArrowDropDownRoundedIcon style={{fontSize:'24px',color:'grey',cursor:'pointer'}} onClick={(()=>{set_view_industries_active(true)})}/>
							}
						</Flex>
						{view_industries_active? 
                            <>
                                {industries?.length === 0 ?
                                        <Flex justify='center' align='center' h='15vh' bg='#eee' p='2' borderRadius='5' boxShadow='lg' gap='2'>
                                            <Text>The user has not seletected an industry to specialize in yet</Text>
                                        </Flex>
                                        :
                                        <Flex direction='column' bg='#eee' borderRadius='5' p='2'> 
                                            {industries?.map((item,index)=>{
                                                return(
                                                    <Industry key={index} item={item}/>
                                                )
                                            })}
                                    </Flex>
                                }
                            </>
							:
							null
						}
                        <Divider/>
					</Flex>
                    <Flex direction='column' gap='1' p='2' fontSize={'14px'}>
                        <Flex gap='' align='center'>
							<Text fontWeight='bold'>Experts [{supplier_data?.experts?.length}]</Text>
							{view_experts_active? 
								<ArrowDropUpRoundedIcon style={{fontSize:'24px',color:'grey',cursor:'pointer'}} onClick={(()=>{set_view_experts_active(false)})}/>	
								:
								<ArrowDropDownRoundedIcon style={{fontSize:'24px',color:'grey',cursor:'pointer'}} onClick={(()=>{set_view_experts_active(true)})}/>
							}
						</Flex>
						{view_experts_active? 
                                <Flex className={styles.products_container_body} p='1'>
                                    {supplier_data?.experts?.length === 0 ?
                                            <Flex justify='center' align='center' w='100%' bg='#eee' p='2' borderRadius='5' gap='2'>
                                                <Text w='50%' textAlign='center'>This account has not listed any experts</Text>
                                            </Flex>
                                        :
                                            <Flex gap='2' className={styles.products_container}>
                                                {supplier_data?.experts?.map((item,index)=>{
                                                    return(
                                                        <Flex key={index} direction='' bg='#eee' p='2' borderRadius='5' boxShadow='sm' cursor='pointer'>
                                                            <Flex direction='column'>
                                                                <Text fontWeight='bold'>Name:&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;{item.name}</Text>
                                                                <Text >Email:&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;{item.email}</Text>
                                                                <Text>Mobile:&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;{item.mobile}</Text>
                                                                <Text>Role:&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;{item.role}</Text>
                                                                <Text>Description:&ensp;&ensp;&ensp;{item.description}</Text>
                                                            </Flex>
                                                        </Flex>
                                                    )
                                                })}
                                            </Flex>		
                                    }
                                </Flex>
                            :
                            null
                        }
                        <Divider/>
					</Flex>
                    <Flex direction='column' gap='1' p='2' fontSize={'14px'}>
                        <Flex gap='' align='center'>
							<Text fontWeight='bold'>Products  [{products?.length}]</Text>
							{view_products_active? 
								<ArrowDropUpRoundedIcon style={{fontSize:'24px',color:'grey',cursor:'pointer'}} onClick={(()=>{set_view_products_active(false)})}/>	
								:
								<ArrowDropDownRoundedIcon style={{fontSize:'24px',color:'grey',cursor:'pointer'}} onClick={(()=>{set_view_products_active(true)})}/>
							}
						</Flex>
						{view_products_active? 
                                <Flex className={styles.products_container_body} p='1'>
                                        {products?.length === 0?
                                            <Flex justify='center' align='center' w='100%' bg='#eee' p='2' borderRadius='5' gap='2'>
                                                <Text w='50%' textAlign='center'>This account has not listed any product</Text>
                                            </Flex>
                                        :
                                            <Flex gap='2' className={styles.products_container}>
                                                {products?.map((product)=>{
                                                    return(
                                                        <Product_Item product={product} key={product?._id}/>
                                                    )
                                                })}
                                            </Flex>		
                                    }
                                </Flex>
							:
							null
						}
					</Flex>
					<Flex p='2' gap='2' direction={'column'} bg='#e3e3e3' borderRadius={'5'}>
						<Flex fontWeight={'bold'} borderBottom={'1px solid #fff'} pb='2'>
							<EditNoteIcon/>
							<Text >Actions</Text>
						</Flex>
						<Flex gap='3' align='center' borderBottom={'1px solid #fff'} pb='2'>
							<MarkEmailUnreadIcon style={{fontSize:'16px',}}/>
							<Link color='grey' fontSize='14px' href={`mailto: ${supplier_data?.email_of_company}`} isExternal>Email this supplier</Link>
						</Flex>
						{supplier_data?.subscription? 
							<Flex align='center' gap='2' cursor='pointer' onClick={handle_un_subscribe_account} borderBottom={'1px solid #fff'} pb='2'>
								<StarOutlineRoundedIcon style={{fontSize:'20px',}}/>
								<Text color='grey' fontSize='14px'>Un subscribe this supplier</Text>
							</Flex>
								: 
							<Flex align='center' gap='2' cursor='pointer'onClick={handle_subscribe_account} borderBottom={'1px solid #fff'} pb='2'>
								<StarRateRoundedIcon style={{fontSize:'20px',}}/>
								<Text color='grey' fontSize='14px'>Subscribe this supplier</Text>
							</Flex>
						}
						{supplier_data?.valid_email_status? 
							<Flex align='center' gap='2' cursor='pointer' onClick={handle_un_verify_email_account} borderBottom={'1px solid #fff'} pb='2'>
								<UnsubscribeIcon style={{fontSize:'20px',}}/>
								<Text color='grey' fontSize='14px'>Un verify email from this supplier</Text>
							</Flex>
								: 
							<Flex align='center' gap='2' cursor='pointer'onClick={handle_verify_email_account} borderBottom={'1px solid #fff'} pb='2'>
								<MarkEmailReadIcon style={{fontSize:'20px',}}/>
								<Text color='grey' fontSize='14px'>verify email from this supplier</Text>
							</Flex>
						}
						{supplier_data?.suspension_status? 
							<Flex align='center' gap='2' cursor='pointer' onClick={(()=>{set_is_un_suspend_Modal_visible(true)})} borderBottom={'1px solid #fff'} pb='2'>
								<BusinessIcon style={{fontSize:'20px',}}/>
								<Text color='grey' fontSize='14px'>Un suspend this supplier</Text>
							</Flex>
								: 
							<Flex align='center' gap='2' cursor='pointer' onClick={(()=>{setissuspendModalvisible(true)})} borderBottom={'1px solid #fff'} pb='2'>
								<BusinessIcon style={{fontSize:'20px',}}/>
								<Text color='grey' fontSize='14px'>Suspend this supplier</Text>
							</Flex>
						}
						<Flex align='center' gap='2' cursor='pointer' onClick={(()=>{set_is_delete_Modal_visible(true)})}>
							<DeleteRoundedIcon style={{fontSize:'20px',}}/>
							<Text color='red' fontWeight='bold'>Delete this supplier</Text>
						</Flex>
					</Flex>		
				</Flex>
			</Flex>
		</Flex>
	)
}

const Industry=({item})=>{
	return(
		<Text fontSize='14px'>- {item? item : '-'}</Text>
	)
}

const Product_Item=({product})=>{
	const router = useRouter()
	return(
		<Flex h='80px' borderRight={product?.sponsored === true ?'4px solid gold': null} bg='#eee' borderRadius='5px' boxShadow='sm' justify='space-between' position='relative'>
			{product?.suspension_status? <Flex bg={product?.suspension_status? 'red': '#fff'} zIndex='' h='100%' w='100%' position='absolute' top='0' right='0' opacity='0.3' />: null}
			<Flex direction='column' p='2'>
				<Text fontSize='16px' fontFamily='ClearSans-Bold' color='#009393'>{product.name_of_product}</Text>
				<Text fontSize='14px'>{product.distributed_by}</Text>
				<Flex gap='2' fontSize='10px' color='grey' align='center'>
					<Text color='grey' p='1'>{product.industry? product.industry : '-'}</Text>
					<Text borderLeft='1px solid grey' paddingLeft='2' color='grey' p='1'>{product.technology? product.technology : '-'}</Text>
				</Flex>
			</Flex>
			<Flex direction='column' justify='space-around' p='2' textAlign='center'>
				{product?.sponsored ? 
					<Flex bg='#fff' p='1' borderRadius='5' cursor='pointer' boxShadow='lg' align='center'>
						<Text fontWeight='bold' >Featured</Text>
						<VerifiedIcon style={{color:'gold'}}/>
					</Flex>
					:
					<Text fontWeight='bold' >Not Featured</Text>				
				}
				<Text fontWeight='bold' color='#fff' bg='#009393' p='1' borderRadius='5' boxShadow='lg' cursor='pointer' onClick={(()=>{router.push(`/product/${product?._id}`)})}>View</Text>
			</Flex>
		</Flex>
	)
}
