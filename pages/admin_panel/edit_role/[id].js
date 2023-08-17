import React,{useEffect, useState,} from 'react'
import {Flex,Text,Button,Input,Textarea,useToast} from '@chakra-ui/react';
import Header from '../../../components/Header.js';
import Get_Role from '../../api/admin_roles/get_role.js';
import Edit_Role from '../../api/admin_roles/edit_role.js';
import jwt_decode from "jwt-decode";
import Cookies from 'universal-cookie';
import {useRouter} from 'next/router';
import styles from '../../../styles/Permissions&Accounts.module.css';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

import Navigation from '../../../components/Navigation';

export default function Edit_Role_Page(){
    return(
        <Navigation >
            <Body/>
        </Navigation>
    )
}

function Body(){
    const [data,set_data]=useState('')
	const [title,set_title]=useState(data?.title);
    const [description,set_description]=useState(data?.description);
    const [is_scope_description_active,set_is_scope_description_active]=useState(false);
    const [auth_role,set_auth_role]=useState("")
    //console.log(payload);

	const cookies = new Cookies();
    const toast = useToast();
	const router = useRouter();
    let token = cookies.get('admin_token');

    const Handle_Edit_role=async()=>{
        const payload = {
            _id:data?._id,
            title,
            description,
            auth_role
        }
        if (payload.title == data?.title && payload.description == data?.description){
            toast({
                title: '',
                position: 'top-left',
                variant:"subtle",
                description: 'No changes have been made.',
                status: 'info',
                isClosable: true,
            });
            return ;
        }
        await Edit_Role(payload).then((res)=>{
            toast({
                title: '',
                position: 'top-left',
                variant:"subtle",
                description: res.data,
                status: 'success',
                isClosable: true,
            });
            router.back();
        }).catch((err)=>{
            //console.log(err)
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

    const query = router.query;
	const id = query?.id
	
	useEffect(()=>{
        if (id === undefined){
			toast({
              title: '',
              description: `...broken link, taking you back`,
              status: 'info',
              isClosable: true,
            });
			router.back()
		}else{
			fetch_role()
		}
	},[]);
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
            if(decoded?.role === 'Manager' || decoded?.role === 'Tech Support'){
                return ;
            }else{
                router.push('/dashboard_new')
                setTimeout(()=>{
                    toast({
                        title: '',
                        description: `You do not have access to this page`,
                        status: 'info',
                        isClosable: true,
                        variant:'left-accent',
                        position:'top-left'
                    });
                },5000)
            }
          }
    },[])

    const fetch_role=async()=>{
        const payload = {
            _id:id
        }
        await Get_Role(payload).then((res)=>{
            set_data(res?.data)
            //console.log(res.data)
        }).catch((err)=>{
            //console.log(err)
        })
    }
	return(
		<Flex direction='column' h='100vh'>
			<Flex direction='column'     p='2' gap='2' bg='#eee' h='100vh'>
				<Flex className={styles.page_infomation_details_Body} gap='3' >
					<Flex className={styles.page_infomation_details_Description} >
						<Text fontSize='28px' fontWeight='bold' className={styles.page_infomation_details_Title}>Edit Role</Text>
						<Flex fontSize={'12px'} color='grey' gap='1' fontWeight={'bold'} className={styles.page_infomation_details_Link} wrap={'Wrap'}>
							<Text cursor='pointer' color='#009393' onClick={(()=>{router.push('/dashboard')})}>Dashboard</Text>
							<Text>&gt;</Text>
							<Text>Admin Panel</Text>
                            <Text>&gt;</Text>
							<Text cursor='pointer' color='#009393' onClick={(()=>{router.push('/admin_panel/role_management')})}>Roles Management</Text>
							<Text>&gt;</Text>
							<Text>edit Roles</Text>		
						</Flex>
					</Flex>
				</Flex>
				<Flex direction={'column'} pt='2' pb='2' className={styles.fetched_data_body} gap='1'>
					<Flex direction='column' gap='1' p='2' className={styles.fetched_data_container} bg='#fff' >
                        <Flex direction='column' gap='2'>
                            <Text fontWeight={'bold'}>Title</Text>
                            <Input type='text' placeholder={data?.title} variant='filled' onChange={((e)=>{set_title(e.target.value)})}/>
                        </Flex>
                        <Flex direction='column' gap='2'>
                            <Text fontWeight={'bold'}>Description</Text>
                            <Textarea type='text' placeholder={data?.description} variant='filled' onChange={((e)=>{set_description(e.target.value)})}/>
                        </Flex>
                        <Flex align='center' gap='1' onClick={(()=>{set_is_scope_description_active(!is_scope_description_active)})} cursor={'pointer'}>
                            <Text fontWeight={'bold'} color='#009393'>Scopes</Text>
                            <QuestionMarkIcon style={{fontSize:'18px',color:'#009393',cursor:'pointer',border:'2px dotted #009393',}} />
                        </Flex>
                        {is_scope_description_active?
                            <Flex direction={'column'} p='1' gap='1' color='grey' fontSize={'14px'} bg='#eee'>
                                <Text>Editing of scopes is currently unavailable at the moment.Contact support for any issues.</Text> 
                            </Flex>
                            :null
                        }
                    </Flex>
                    <Flex gap='2'>
                        <Button flex='1' bg='#009393' color='#fff' onClick={Handle_Edit_role}>Edit Role</Button>
                        <Button flex='1' bg='#fff' color='#000' border='1px solid #000' onClick={(()=>{router.back()})}>Cancel</Button>
                    </Flex>
			    </Flex>
            </Flex>
		</Flex>
	)
}