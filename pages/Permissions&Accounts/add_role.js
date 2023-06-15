import React,{useEffect, useState,} from 'react'
import {Flex,Text,Button,Input,Textarea,useToast} from '@chakra-ui/react';
import Header from '../../components/Header.js';
import Add_Role from '../api/admin_roles/add_role.js';
import jwt_decode from "jwt-decode";
import Cookies from 'universal-cookie';
import {useRouter} from 'next/router';
import styles from '../../styles/Permissions&Accounts.module.css';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import InfoIcon from '@mui/icons-material/Info';

export default function Add_New_Role(){

    const [is_role_description_active,set_is_role_description_active]=useState(false);
    const [is_scope_description_active,set_is_scope_description_active]=useState(false);
	const [title,set_title]=useState('');
    const [description,set_description]=useState('');
    const [auth_role,set_auth_role]=useState("")
    
    const [customers_scopes,set_customers_scopes]=useState([]);
    const [manufacturers_scopes,set_manufacturers_scopes]=useState([]);
    const [distributors_scopes,set_distributors_scopes]=useState([]);
    const [salespeople_scopes,set_salespeople_scopes]=useState([]);

    const Handle_Client_Scope = (event,title) =>{
        const isChecked = event.target.checked;
        switch(title) {
            case "Customers":
                if(isChecked){
                    set_customers_scopes([...customers_scopes,event.target.value]);
                }else{
                    let index = customers_scopes.indexOf(event.target.value);
                    customers_scopes.splice(index, 1);
                    set_customers_scopes(customers_scopes);
                }
              break;
            case "Manufacturers":
                if(isChecked){
                    set_manufacturers_scopes([...manufacturers_scopes,event.target.value]);
                }else{
                    let index = manufacturers_scopes.indexOf(event.target.value);
                    manufacturers_scopes.splice(index, 1);
                    set_manufacturers_scopes(manufacturers_scopes);
                }
              break;
            case "Distributors":
                if(isChecked){
                    set_distributors_scopes([...distributors_scopes,event.target.value]);
                }else{
                    let index = distributors_scopes.indexOf(event.target.value);
                    distributors_scopes.splice(index, 1);
                    set_distributors_scopes(distributors_scopes);
                }
              break;
            case "Salespeople":
                if(isChecked){
                    set_salespeople_scopes([...salespeople_scopes,event.target.value]);
                }else{
                    let index = salespeople_scopes.indexOf(event.target.value);
                    salespeople_scopes.splice(index, 1);
                    set_salespeople_scopes(salespeople_scopes);
                }
              break;
            default:
              return ;
          }
    }

    const [product_scopes,set_product_scopes]=useState([]);
    const [orders_scopes,set_orders_scopes]=useState([]);
    const [requests_scopes,set_requests_scopes]=useState([]);
    const [support_questions_scopes,set_support_questions_scopes]=useState([]);
    const [request_demo_scopes,set_request_demo_scopes]=useState([]);

    const Handle_Utils_Scope = (event,title) =>{
        const isChecked = event.target.checked;
        switch(title) {
            case "Product":
                if(isChecked){
                    set_product_scopes([...product_scopes,event.target.value]);
                }else{
                    let index = product_scopes.indexOf(event.target.value);
                    product_scopes.splice(index, 1);
                    set_product_scopes(product_scopes);
                }
              break;
            case "Orders":
                if(isChecked){
                    set_orders_scopes([...orders_scopes,event.target.value]);
                }else{
                    let index = orders_scopes.indexOf(event.target.value);
                    orders_scopes.splice(index, 1);
                    set_orders_scopes(orders_scopes);
                }
              break;
            case "Manufacturer requests":
                if(isChecked){
                    set_requests_scopes([...requests_scopes,event.target.value]);
                }else{
                    let index = requests_scopes.indexOf(event.target.value);
                    requests_scopes.splice(index, 1);
                    set_requests_scopes(requests_scopes);
                }
              break;
            case "Support Questions":
                if(isChecked){
                    set_support_questions_scopes([...support_questions_scopes,event.target.value]);
                }else{
                    let index = support_questions_scopes.indexOf(event.target.value);
                    support_questions_scopes.splice(index, 1);
                    set_support_questions_scopes(support_questions_scopes);
                }
              break;
            case "Request Demo Tickets":
                if(isChecked){
                    set_request_demo_scopes([...request_demo_scopes,event.target.value]);
                }else{
                    let index = request_demo_scopes.indexOf(event.target.value);
                    request_demo_scopes.splice(index, 1);
                    set_request_demo_scopes(request_demo_scopes);
                }
              break;
            default:
              return ;
          }
    }

    const [industries_scopes,set_industries_scopes]=useState([]);
    const [technologies_scopes,set_technologies_scopes]=useState([]);
    const [careers_scopes,set_careers_scopes]=useState([]);

    const Handle_Controls_Scope = (event,title) =>{
        const isChecked = event.target.checked;
        switch(title) {
            case "Industries":
                if(isChecked){
                    set_industries_scopes([...industries_scopes,event.target.value]);
                }else{
                    let index = industries_scopes.indexOf(event.target.value);
                    industries_scopes.splice(index, 1);
                    set_industries_scopes(industries_scopes);
                }
              break;
            case "Technologies":
                if(isChecked){
                    set_technologies_scopes([...technologies_scopes,event.target.value]);
                }else{
                    let index = technologies_scopes.indexOf(event.target.value);
                    technologies_scopes.splice(index, 1);
                    set_technologies_scopes(technologies_scopes);
                }
              break;
            case "Careers":
                if(isChecked){
                    set_careers_scopes([...careers_scopes,event.target.value]);
                }else{
                    let index = careers_scopes.indexOf(event.target.value);
                    careers_scopes.splice(index, 1);
                    set_careers_scopes(careers_scopes);
                }
              break;
            default:
              return ;
          }
    }

    const [administrator_scopes,set_administrator_scopes]=useState([]);
    const [roles_management_scopes,set_roles_management_scopes]=useState([]);

    const Handle_Administrator_Scope = (event,title) =>{
        const isChecked = event.target.checked;
        switch(title) {
            case "Administrator Accounts Management":
                if(isChecked){
                    set_administrator_scopes([...administrator_scopes,event.target.value]);
                }else{
                    let index = administrator_scopes.indexOf(event.target.value);
                    administrator_scopes.splice(index, 1);
                    set_administrator_scopes(administrator_scopes);
                }
              break;
            case "Roles Management":
                if(isChecked){
                    set_roles_management_scopes([...roles_management_scopes,event.target.value]);
                }else{
                    let index = roles_management_scopes.indexOf(event.target.value);
                    roles_management_scopes.splice(index, 1);
                    set_roles_management_scopes(roles_management_scopes);
                }
              break;
            default:
              return ;
          }
    }

    let payload = {
        title,
        description,
        customers_scopes,
        manufacturers_scopes,
        distributors_scopes,
        salespeople_scopes,
        product_scopes,
        orders_scopes,
        requests_scopes,
        industries_scopes,
        technologies_scopes,
        careers_scopes,
        administrator_scopes,
        roles_management_scopes,
        support_questions_scopes,
        request_demo_scopes,
        auth_role
    }
    //console.log(payload);

	const cookies = new Cookies();
    const toast = useToast();
	const router = useRouter();
	let token = cookies.get('admin_token');

    const Submit_Add_New_Role=async()=>{
        if (payload.title == '' || payload.description == ''){
            toast({
                title: '',
                position: 'top-left',
                variant:"subtle",
                description: 'title and description inputs are required.',
                status: 'info',
                isClosable: true,
            });
            return ;
        }
        await Add_Role(payload).then((res)=>{
            toast({
                title: '',
                position: 'top-left',
                variant:"subtle",
                description: res.data,
                status: 'success',
                isClosable: true,
            });
            router.back()
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

	return(
		<Flex direction='column' h='100vh'>
			<Header />
			<Flex direction='column' p='2' gap='2' bg='#eee' h='100vh'>
				<Flex className={styles.page_infomation_details_Body} gap='3' >
					<Flex className={styles.page_infomation_details_Description} >
						<Text fontSize='28px' fontWeight='bold' className={styles.page_infomation_details_Title}>Add Role</Text>
						<Flex fontSize={'12px'} color='grey' gap='1' fontWeight={'bold'} className={styles.page_infomation_details_Link} wrap={'Wrap'}>
							<Text cursor='pointer' color='#009393' onClick={(()=>{router.push('/dashboard')})}>Dashboard</Text>
							<Text>&gt;</Text>
							<Text>Permissions&Accounts</Text>
                            <Text>&gt;</Text>
							<Text cursor='pointer' color='#009393' onClick={(()=>{router.push('/Permissions&Accounts/Role_Management')})}>Roles Management</Text>
							<Text>&gt;</Text>
							<Text>Add Roles</Text>		
						</Flex>
					</Flex>
				</Flex>
				<Flex direction={'column'} pt='2' pb='2' className={styles.fetched_data_body}>
					<Flex direction='column' gap='1' p='2' className={styles.fetched_data_container} bg='#fff'>
                        <Flex align='center' gap='1' onClick={(()=>{set_is_role_description_active(!is_role_description_active)})} cursor={'pointer'}>
                            <Text fontWeight={'bold'} color='#009393'>How to create a new role</Text>
                            <InfoIcon style={{fontSize:'18px',color:'#009393',cursor:'pointer',border:'2px dotted #009393',}} />
                        </Flex>
                        {is_role_description_active?
                            <Flex direction={'column'} p='1' gap='1' color='grey' fontSize={'14px'}>
                                <Text>A role defines the level of accessibility a user has in the administrator site.</Text>
                                <Text>e.g. a sales person only needs access to products and orders. </Text>
                                <Text>e.g. a manager needs all access to the entire functionality.</Text>
                                <Text>title -           refers to the name of the role created.</Text>
                                <Text>description -     defines what the role aims to achieve.</Text>
                                <Text>scopes -          are the areas in which a user is set to operate in.</Text>
                            </Flex>
                            :null
                        }
                        <Flex direction='column' gap='2'>
                            <Text fontWeight={'bold'}>Title</Text>
                            <Input type='text' placeholder='title' variant='filled' onChange={((e)=>{set_title(e.target.value)})}/>
                        </Flex>
                        <Flex direction='column' gap='2'>
                            <Text fontWeight={'bold'}>Description</Text>
                            <Textarea type='text' placeholder='description' variant='filled' onChange={((e)=>{set_description(e.target.value)})}/>
                        </Flex>
                        <Flex align='center' gap='1' onClick={(()=>{set_is_scope_description_active(!is_scope_description_active)})} cursor={'pointer'}>
                            <Text fontWeight={'bold'} color='#009393'>Scopes</Text>
                            <QuestionMarkIcon style={{fontSize:'18px',color:'#009393',cursor:'pointer',border:'2px dotted #009393',}} />
                        </Flex>
                        {is_scope_description_active?
                            <Flex direction={'column'} p='1' gap='1' color='grey' fontSize={'14px'}>
                                <Text>read -            users will be able to view information about a selected category. e.g get information about manufacturers.</Text> 
                                <Text>add -             users will be able to add a new item to the database in a selected category. e.g add a new manufacturer.</Text> 
                                <Text>edit -            users will be able to edit an item in a selected category. e.g edit a manufacturer profile.</Text>
                                <Text>delete -          users will be able to delete an item in a selected category. e.g delete a manufacturer profile.</Text> 
                                <Text>approve -         users will be able to approve an item in a selected category. e.g approved listed products after review.</Text> 
                                <Text>decline -         users will be able to decline an item in a selected category. e.g decline listed products after review.</Text> 
                                <Text>suspend -         users will be able to suspend an item in a selected category. e.g suspend a manufacturer profile.</Text> 
                                <Text>un-suspend -      users will be able to suspend an item in a selected category. e.g un-suspend a manufacturer profile.</Text> 
                                <Text>verify -          users will be able to verify a product. e.g verify listed products after review.</Text> 
                                <Text>un-verify -       users will be able to un-verify a product. e.g un-verify listed products after review.</Text> 
                                <Text>subscribe -       users will be able to upgrade an item in a selected category. e.g upgrade a manufacturer to a premium.</Text>
                                <Text>un-subscribe -    users will be able to downgrade an item in a selected category. e.g downgrade a manufacturer from a premium.</Text> 
                                <Text>feature -         users will be able to feature an item in a selected category. e.g featuring a product.</Text>
                                <Text>un-feature -      users will be able to un-feature an item in a selected category. e.g un-featuring a product.</Text> 
                            </Flex>
                            :null
                        }
                        <Text fontWeight={'bold'} mt='2' borderTop='1px solid #eee' color='orange'>Client Users scopes</Text>
                        {client_users_scopes?.map((item,index)=>{
                            return(
                                <Flex direction={'column'} key={index}>
                                    <Text>{item?.title}</Text>
                                    <Flex gap='2' bg='#eee' p='2' wrap='Wrap' borderRadius='5px'>
                                        {item?.scope_content.map((content,index)=>{
                                            return(
                                                <Flex gap='1' align='center' key={index}>
                                                    <input type="checkbox" value={content} onChange={((e)=>{Handle_Client_Scope(e,item?.title)})}/> 
                                                    {content}
                                                </Flex>
                                            )
                                        })}
                                                                               
                                    </Flex>
                                </Flex>
                            )
                        })}
                        <Text fontWeight={'bold'} mt='2' borderTop='1px solid #eee' color='orange'>Utils scopes</Text>
                        {util_scopes?.map((item,index)=>{
                            return(
                                <Flex direction={'column'} key={index}>
                                    <Text>{item?.title}</Text>
                                    <Flex gap='2' bg='#eee' p='2' wrap='Wrap' borderRadius='5px'>
                                        {item?.scope_content.map((content,index)=>{
                                            return(
                                                <Flex gap='1' align='center' key={index}>
                                                    <input type="checkbox" value={content} onChange={((e)=>{Handle_Utils_Scope(e,item?.title)})}/> 
                                                    {content}
                                                </Flex>
                                            )
                                        })}
                                                                               
                                    </Flex>
                                </Flex>
                            )
                        })}
                        <Text fontWeight={'bold'} mt='2' borderTop='1px solid #eee' color='orange'>Controls scopes</Text>
                        {util_controls_scopes?.map((item,index)=>{
                            return(
                                <Flex direction={'column'} key={index}>
                                    <Text>{item?.title}</Text>
                                    <Flex gap='2' bg='#eee' p='2' wrap='Wrap' borderRadius='5px'>
                                        {item?.scope_content.map((content,index)=>{
                                            return(
                                                <Flex gap='1' align='center' key={index}>
                                                    <input type="checkbox" value={content} onChange={((e)=>{Handle_Controls_Scope(e,item?.title)})}/> 
                                                    {content}
                                                </Flex>
                                            )
                                        })}
                                                                               
                                    </Flex>
                                </Flex>
                            )
                        })}
                        <Text fontWeight={'bold'} mt='2' borderTop='1px solid #eee' color='orange'>Administrators scopes</Text>
                        {Admin_scopes?.map((item,index)=>{
                            return(
                                <Flex direction={'column'} key={index}>
                                    <Text>{item?.title}</Text>
                                    <Flex gap='2' bg='#eee' p='2' wrap='Wrap' borderRadius='5px'>
                                        {item?.scope_content.map((content,index)=>{
                                            return(
                                                <Flex gap='1' align='center' key={index}>
                                                    <input type="checkbox" value={content} onChange={((e)=>{Handle_Administrator_Scope(e,item?.title)})}/> 
                                                    {content}
                                                </Flex>
                                            )
                                        })}
                                                                               
                                    </Flex>
                                </Flex>
                            )
                        })}
					</Flex>
				</Flex>
                <Flex gap='2'>
                    <Button flex='1' bg='#009393' color='#fff' onClick={Submit_Add_New_Role}>Add New Role</Button>
                    <Button flex='1' bg='#fff' color='#000' border='1px solid #000' onClick={(()=>{router.push('/Permissions&Accounts/Role_Management')})}>Cancel</Button>
                </Flex>
			</Flex>
		</Flex>
	)
}


const client_users_scopes = [
    {
        title:'Customers',
        scope_content:['suspend','un-suspend','delete'],
    },
    {
        title:'Manufacturers',
        scope_content:['add','edit','delete','approve','decline','suspend','un-suspend','subscribe','un_subscribe']
    },
    {
        title:'Distributors',
        scope_content:['add','edit','delete','approve','decline','suspend','un-suspend','subscribe','un_subscribe']
    },
    {
        title:'Salespeople',
        scope_content:['add','edit','delete','approve','decline','suspend','un-suspend']
    },
]

const util_controls_scopes = [
    {
        title:'Industries',
        scope_content:['add','edit','delete','approve','decline']
    },
    {
        title:'Technologies',
        scope_content:['add','edit','delete','approve','decline']
    },
    {
        title:'Careers',
        scope_content:['add','edit','delete']
    },
    
]

const util_scopes = [
    {
        title:'Product',
        description:'',
        scope_content:['add','edit','delete','verify','unverify','feature','un-feature']
    },
    {
        title:'Orders',
        scope_content:['add','edit','delete','approve','decline','reject']
    },
    {
        title:'Manufacturer requests',
        scope_content:['edit','approve','decline']
    },
    {
        title:'Support Questions',
        scope_content:['mark_as_solved','un_mark_as_solved','delete']
    },
    {
        title:'Request Demo Tickets',
        scope_content:['mark_as_solved','un_mark_as_solved','delete']
    },
]

const Admin_scopes = [
    {
        title:'Administrator Accounts Management',
        scope_content:['add','edit','delete','suspend','un-suspend']
    },
    {
        title:'Roles Management',
        scope_content:['add','edit','delete']
    },
]