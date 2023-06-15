import React,{useEffect, useState} from 'react'
import {Flex,Text,Button,Input,Image,InputGroup,InputRightElement,useToast} from '@chakra-ui/react';
import Header from '../../components/Header.js';
import RemoveAdmin from '../../components/modals/Admin/RemoveAdmin.js';
import Get_Roles from '../api/admin_roles/get_roles.js';
import jwt_decode from "jwt-decode";
import Cookies from 'universal-cookie';
import {useRouter} from 'next/router'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {Visibility,VisibilityOff} from '@mui/icons-material'
import CircleIcon from '@mui/icons-material/Circle';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import styles from '../../styles/Permissions&Accounts.module.css';
import LogoutIcon from '@mui/icons-material/Logout';
import Edit_Admin_User from '../api/auth/edit_admin_user.js';
//icons
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
//api
import Delete_Role from '../api/admin_roles/delete_role.js';

export default function Role_Management(){
	const [is_add_new_role_modal_visible,set_is_add_new_role_modal_visible]=useState(false);
	
	const [roles,set_roles]=useState([]);
	const [total_roles,set_total_roles]=useState([]);
	const [query,set_query]=useState('');
	const [auth_role,set_auth_role]=useState("")

	const cookies = new Cookies();
	const router = useRouter	();
	let token = cookies.get('admin_token');
	
	useEffect(()=>{
		fetch_roles()
	},[query]);

	useEffect(()=>{
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
            set_auth_role(decoded?.role);
          }
    },[])

	const fetch_roles=async()=>{
		Get_Roles().then((response)=>{
			set_total_roles(response?.data)
			let sorted_roles = response.data.sort((a, b) => b.title - a.title);
			let filtered_roles = sorted_roles.filter((role) => 	role?.title.toLowerCase().includes(query.toLowerCase()))
			set_roles(filtered_roles);
			//console.log(filtered_roles);
		}).catch((err)=>{
			console.log(err)
		})
	}
	return(
		<Flex direction='column' h='100vh'>
			<Header />
			<Flex direction='column' p='2' gap='2' bg='#eee' h='100vh'>
				<Flex className={styles.page_infomation_details_Body} gap='3'>
					<Flex className={styles.page_infomation_details_Description}>
						<Text fontSize='28px' fontWeight='bold' className={styles.page_infomation_details_Title}>Roles Management</Text>
						<Flex fontSize={'12px'} color='grey' gap='1' fontWeight={'bold'} className={styles.page_infomation_details_Link}>
							<Text cursor='pointer' color='#009393' onClick={(()=>{router.push('/dashboard')})}>Dashboard</Text>
							<Text>&gt;</Text>
							<Text>Permissions&Accounts</Text>
							<Text>&gt;</Text>
							<Text>Roles Management</Text>		
						</Flex>
					</Flex>
					<Flex gap='2' mr='2' className={styles.page_infomation_details_Search}>
						<InputGroup size='md' bg='#fff' borderRadius={'5px'} fontWeight={'bold'} >
							<Input
							type='text'
							placeholder='Search Roles'
							fontWeight={'bold'}
							value={query}
							onChange={((e)=>{set_query(e.target.value)})}
							/>
							<InputRightElement >
								{query.length > 0? <CloseIcon cursor='pointer' onClick={(()=>{set_query('')})}/> : <SearchIcon/>}
							</InputRightElement>
						</InputGroup>
						<Button bg='#009393' onClick={(()=>{router.push('/Permissions&Accounts/add_role')})}>
							<Text color='#fff' >Add Role</Text>
						</Button>
					</Flex>
				</Flex>
				<Flex direction={'column'} pt='2' pb='2' className={styles.fetched_data_body}>
					<Flex p='2' pt='4' pb='4' bg='#fff'>
						<Text fontSize={'12px'} color='grey'>showing <span style={{color:'#009393',fontWeight:'bold'}}>{roles?.length}</span> of <span style={{color:'#009393',fontWeight:'bold'}}>{total_roles?.length}</span> total roles</Text>
					</Flex>
					<Flex direction='column' gap='1' className={styles.fetched_data_container}>
						{roles.map((item)=>{
							return(
								<Admin_Role_Card_Item key={item?._id} role={item} auth_role={auth_role}/>
							)
						})}
					</Flex>
				</Flex>
			</Flex>
		</Flex>
	)
}

const Admin_Role_Card_Item=({role,auth_role})=>{
	const [view_scopes,set_view_scopes]=useState(false);
	const [is_delete,set_is_delete]=useState(false);
	const router = useRouter();
	const toast = useToast();
	const payload = {
		_id:role._id,
		auth_role
	}
	const handle_delete_role=async()=>{
		await Delete_Role(payload).then((res)=>{
			toast({
                title: '',
                position: 'top-left',
                variant:"subtle",
                description: res.data,
                status: 'success',
                isClosable: true,
            });
			
		}).then(()=>{
			setTimeout(()=>{
				router.reload()
			},1000)
		}).catch((err)=>{
			toast({
                title: '',
                position: 'top-left',
                variant:"subtle",
                description: err.response.data,
                status: 'error',
                isClosable: true,
            });
		})
	}
	return(
		<Flex gap='2' borderTop='1px solid #eee' className={styles.role_card_item_body}>
			{is_delete?
				<Flex direction='column'>
					<Text fontSize='16px' fontWeight='bold'>{role?.title}</Text>
					<Text color='grey' fontSize='14px'>Are you sure you want to remove this role?</Text>
					<Flex gap='2'>						
						<Button bg='#fff' border='1px solid red' color='red' cursor='pointer' onClick={handle_delete_role}>Remove role</Button>
						<Button bg='#fff' color='#000' border='1px solid #000' cursor='pointer' onClick={(()=>{set_is_delete(false)})}>Cancel</Button>
					</Flex>
				</Flex>
			:
				<Flex direction='column'>
					<Text fontWeight='bold' >{role.title}</Text>
					<Text fontSize='14px' color='grey'>{role.description}</Text>
					<Flex gap='1' fontSize='12px' fontWeight='bold' color='#009393' align='center' cursor='pointer' onClick={(()=>{set_view_scopes(!view_scopes)})}>
						<Text>Scopes</Text>
						{view_scopes? <KeyboardArrowUpIcon style={{fontSize:'12px'}}/>:<KeyboardArrowDownIcon style={{fontSize:'12px'}}/>}
					</Flex>
					{view_scopes?
						<Flex direction='column' >
							{role?.administrator_scopes?.length == 0?  null :
								<Administrator_Scope_Card_Item role={role} />
							}
							{role?.roles_scopes?.length == 0?  null :
								<Roles_Scope_Card_Item role={role} />
							}
							{role?.product_scopes?.length == 0?  null :
								<Product_Scope_Card_Item role={role} />
							}
							{role?.client_scopes?.length == 0?  null :
								<Client_Scope_Card_Item role={role} />
							}
							{role?.manufacturers_scopes?.length == 0?  null :
								<Manufacturers_Scope_Card_Item role={role} />
							}
							{role?.distributors_scopes?.length == 0?  null :
								<Distributors_Scope_Card_Item role={role} />
							}
							{role?.salespeople_scopes?.length == 0?  null :
								<SalesPeople_Scope_Card_Item role={role} />
							}
							{role?.orders_scopes?.length == 0?  null :
								<Orders_Scope_Card_Item role={role} />
							}
							{role?.industries_scopes?.length == 0?  null :
								<Industries_Scope_Card_Item role={role} />
							}
							{role?.technologies_scopes?.length == 0?  null :
								<Technologies_Scope_Card_Item role={role} />
							}
							{role?.careers_scopes?.length == 0?  null :
								<Careers_Scope_Card_Item role={role} />
							}
							{role?.manufacturer_request_scopes?.length == 0?  null :
								<Request_Scope_Card_Item role={role} />
							}
							{role?.support_questions_scopes?.length == 0?  null :
								<Support_Question_Scope_Card_Item role={role} />
							}
							{role?.request_demo_scopes?.length == 0?  null :
								<Request_Demo_Tickets_Scope_Card_Item role={role} />
							}
						</Flex>
						:null
					}
					<Flex gap='2' mt='2'>
						<Text fontSize='12px' cursor='pointer' borderRadius='5' bg='#eee' p='1' fontWeight='bold' color='' onClick={(()=>{router.push(`/Permissions&Accounts/edit_role/${role._id}`)})}>Edit</Text>
						<Text fontSize='12px' cursor='pointer' borderRadius='5' border='1px solid red' bg='#fff' p='1' fontWeight='bold' color='' onClick={(()=>{set_is_delete(true)})}>Remove</Text>
					</Flex>
				</Flex>
			}
		</Flex>
	)
}

const Product_Scope_Card_Item=({role})=>{
	return(
		<>
			<Text fontWeight='bold' fontSize='12px' color='orange'>Product scopes</Text>
			<Flex gap='2' wrap='Wrap'>
				{role?.product_scopes?.map((scope,index)=>{
					return(
						<Text key={index} fontSize='10px' color='grey' border='1px solid #eee' p='1'>{scope}</Text>
					)
				})}
			</Flex>
		</>
	)
}

const Client_Scope_Card_Item=({role})=>{
	return(
		<>
			<Text fontWeight='bold' fontSize='12px' color='orange'>Client scopes</Text>
			<Flex gap='2' wrap='Wrap'>
				{role?.client_scopes?.map((scope,index)=>{
					return(
						<Text key={index} fontSize='10px' color='grey' border='1px solid #eee' p='1'>{scope}</Text>
					)
				})}
			</Flex>
		</>
	)
}
const Manufacturers_Scope_Card_Item=({role})=>{
	return(
		<>
			<Text fontWeight='bold' fontSize='12px' color='orange'>Manufacturers scopes</Text>
			<Flex gap='2' wrap='Wrap'>
				{role?.manufacturers_scopes?.map((scope,index)=>{
					return(
						<Text key={index} fontSize='10px' color='grey' border='1px solid #eee' p='1'>{scope}</Text>
					)
				})}
			</Flex>
		</>
	)
}
const Distributors_Scope_Card_Item=({role})=>{
	return(
		<>
			<Text fontWeight='bold' fontSize='12px' color='orange'>Distributors scopes</Text>
			<Flex gap='2' wrap='Wrap'>
				{role?.distributors_scopes?.map((scope,index)=>{
					return(
						<Text key={index} fontSize='10px' color='grey' border='1px solid #eee' p='1'>{scope}</Text>
					)
				})}
			</Flex>
		</>
	)
}
const SalesPeople_Scope_Card_Item=({role})=>{
	return(
		<>
			<Text fontWeight='bold' fontSize='12px' color='orange'>SalesPeople scopes</Text>
			<Flex gap='2' wrap='Wrap'>
				{role?.salespeople_scopes?.map((scope,index)=>{
					return(
						<Text key={index} fontSize='10px' color='grey' border='1px solid #eee' p='1'>{scope}</Text>
					)
				})}
			</Flex>
		</>
	)
}
const Orders_Scope_Card_Item=({role})=>{
	return(
		<>
			<Text fontWeight='bold' fontSize='12px' color='orange'>Orders scopes</Text>
			<Flex gap='2' wrap='Wrap'>
				{role?.orders_scopes?.map((scope,index)=>{
					return(
						<Text key={index} fontSize='10px' color='grey' border='1px solid #eee' p='1'>{scope}</Text>
					)
				})}
			</Flex>
		</>
	)
}
const Administrator_Scope_Card_Item=({role})=>{
	return(
		<>
			<Text fontWeight='bold' fontSize='12px' color='orange'>Administrator scopes</Text>
			<Flex gap='2' wrap='Wrap'>
				{role?.administrator_scopes?.map((scope,index)=>{
					return(
						<Text key={index} fontSize='10px' color='grey' border='1px solid #eee' p='1'>{scope}</Text>
					)
				})}
			</Flex>
		</>
	)
}
const Roles_Scope_Card_Item=({role})=>{
	return(
		<>
			<Text fontWeight='bold' fontSize='12px' color='orange'>Roles scopes</Text>
			<Flex gap='2' wrap='Wrap'>
				{role?.roles_scopes?.map((scope,index)=>{
					return(
						<Text key={index} fontSize='10px' color='grey' border='1px solid #eee' p='1'>{scope}</Text>
					)
				})}
			</Flex>
		</>
	)
}
const Industries_Scope_Card_Item=({role})=>{
	return(
		<>
			<Text fontWeight='bold' fontSize='12px' color='orange'>Industries scopes</Text>
			<Flex gap='2' wrap='Wrap'>
				{role?.industries_scopes?.map((scope,index)=>{
					return(
						<Text key={index} fontSize='10px' color='grey' border='1px solid #eee' p='1'>{scope}</Text>
					)
				})}
			</Flex>
		</>
	)
}
const Technologies_Scope_Card_Item=({role})=>{
	return(
		<>
			<Text fontWeight='bold' fontSize='12px' color='orange'>Technologies scopes</Text>
			<Flex gap='2' wrap='Wrap'>
				{role?.technologies_scopes?.map((scope,index)=>{
					return(
						<Text key={index} fontSize='10px' color='grey' border='1px solid #eee' p='1'>{scope}</Text>
					)
				})}
			</Flex>
		</>
	)
}
const Careers_Scope_Card_Item=({role})=>{
	return(
		<>
			<Text fontWeight='bold' fontSize='12px' color='orange'>Careers scopes</Text>
			<Flex gap='2' wrap='Wrap'>
				{role?.careers_scopes?.map((scope,index)=>{
					return(
						<Text key={index} fontSize='10px' color='grey' border='1px solid #eee' p='1'>{scope}</Text>
					)
				})}
			</Flex>
		</>
	)
}
const Request_Scope_Card_Item=({role})=>{
	return(
		<>
			<Text fontWeight='bold' fontSize='12px' color='orange'>Manufacturer request scopes</Text>
			<Flex gap='2' wrap='Wrap'>
				{role?.manufacturer_request_scopes?.map((scope,index)=>{
					return(
						<Text key={index} fontSize='10px' color='grey' border='1px solid #eee' p='1'>{scope}</Text>
					)
				})}
			</Flex>
		</>
	)
}
const Support_Question_Scope_Card_Item=({role})=>{
	return(
		<>
			<Text fontWeight='bold' fontSize='12px' color='orange'>Support Questions scopes</Text>
			<Flex gap='2' wrap='Wrap'>
				{role?.support_questions_scopes?.map((scope,index)=>{
					return(
						<Text key={index} fontSize='10px' color='grey' border='1px solid #eee' p='1'>{scope}</Text>
					)
				})}
			</Flex>
		</>
	)
}
const Request_Demo_Tickets_Scope_Card_Item=({role})=>{
	return(
		<>
			<Text fontWeight='bold' fontSize='12px' color='orange'>Request Demo Tickets scopes</Text>
			<Flex gap='2' wrap='Wrap'>
				{role?.request_demo_scopes?.map((scope,index)=>{
					return(
						<Text key={index} fontSize='10px' color='grey' border='1px solid #eee' p='1'>{scope}</Text>
					)
				})}
			</Flex>
		</>
	)
}
