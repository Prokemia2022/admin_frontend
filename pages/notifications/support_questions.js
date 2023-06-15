import React,{useState,useEffect} from 'react'
import {Flex,Text,Input,Button,Select,Link,useToast} from '@chakra-ui/react'
import {useRouter} from 'next/router';
//api
import Get_Support_questions from '../api/Support/fetch_support_questions.js';
import Mark_Support_As_Solved from '../api/Support/mark_support_as_solved.js';
import Un_Mark_Support_As_Solved from '../api/Support/un_mark_support_as_solved.js';
import Delete_Support_Question from '../api/Support/delete_support_question.js';
//icons
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded';
//styles
import styles from '../../styles/Notifications.module.css'
//utils
import moment from 'moment';
import Cookies from 'universal-cookie';
import jwt_decode from "jwt-decode";

export default function Support_Questions(){
	const router = useRouter();
    const cookies = new Cookies();
    let token = cookies.get('admin_token');
    const [auth_role,set_auth_role]=useState("")
	
	const [support_data, set_support_data]=useState([]);
	const [total, set_total]=useState([]);
	const [query, set_query]=useState('');
    const [refresh, set_refresh]=useState(null);

	const fetch_support_data=async()=>{
		await Get_Support_questions().then((response)=>{
			//console.log(response.data)
			const data = response.data;
			set_total(data.length);
			const result = data?.filter((item) => item?.name.toLowerCase().includes(query.toLowerCase()) || item?.email.toLowerCase().includes(query.toLowerCase()));
			set_support_data(result);
		})
	}
	
	useEffect(()=>{
		fetch_support_data()
	},[query,refresh])
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
	        set_auth_role(decoded?.role)
	      }
	},[])
	return(
		<Flex direction='column' gap='3' p='2' w='100%'>
			<Flex justify='space-between'>
				<Text fontSize='32px' fontWeight='bold' color='#009393'>Support</Text>
                <Input bg='#fff' placeholder='search...' value={query} w='30%' onChange={((e)=>{set_query(e.target.value)})}/>
			</Flex>
			<Text fontSize='12px' fontWeight='bold' color='grey'>showing <span style={{color:'#009393',cursor:"pointer"}}>{support_data?.length}</span> of <span style={{color:'#009393',cursor:"pointer"}}>{total}</span> support questions</Text>			
			{support_data?.length === 0?
				<Flex justify='center' align='center' h='40vh' direction='column' gap='2' textAlign='center' bg='#eee' borderRadius='5'>
					<Text>You dont have new support</Text>
				</Flex>
			:
				<Flex className={styles.item_card_container} gap='2'>
					{support_data?.map((item)=>{
						return(
							<Support_Card_Item key={item?._id} item={item} auth_role={auth_role} set_refresh={set_refresh} refresh={refresh}/>
						)
					})}
				</Flex>
			}
		</Flex>
	)
}

const Support_Card_Item=({item,auth_role,set_refresh,refresh})=>{
    let time = moment(item?.createdAt).format('MMM Do YYYY, h:mm a');
    const toast = useToast()
	const payload = {
		_id : item?._id,
		auth_role
	}
    const Handle_Mark_As_Solved=async()=>{
        await Mark_Support_As_Solved(payload).then((res)=>{
            toast({
				title: 'Support question has been updated successfully',
				position: 'top-left',
				variant:"subtle",
				description: `Support question has been marked as solved`,
				status: 'success',
				isClosable: true,
			});
		}).then(()=>{
            set_refresh(!refresh)
        }).catch((err)=>{
			toast({
				title: 'Support question update failed',
				position: 'top-left',
				variant:"subtle",
				description: err.response.data,
				status: 'error',
				isClosable: true,
			});
		})
    }
    const Handle_Un_Mark_As_Solved=async()=>{
        await Un_Mark_Support_As_Solved(payload).then((res)=>{
            toast({
				title: 'Support question has been updated successfully',
				position: 'top-left',
				variant:"subtle",
				description: `Support question has been unmarked as solved`,
				status: 'success',
				isClosable: true,
			});
		}).then(()=>{
            set_refresh(!refresh)
        }).catch((err)=>{
			toast({
				title: 'Support question update failed',
				position: 'top-left',
				variant:"subtle",
				description: err.response.data,
				status: 'error',
				isClosable: true,
			});
		})
    }
    const Handle_Delete=async()=>{
        await Delete_Support_Question(payload).then((res)=>{
            toast({
				title: 'Support question has been deleted successfully',
				position: 'top-left',
				variant:"subtle",
				description: ``,
				status: 'success',
				isClosable: true,
			});
		}).then(()=>{
            set_refresh(!refresh)
        }).catch((err)=>{
			toast({
				title: 'Support question deletion failed',
				position: 'top-left',
				variant:"subtle",
				description: err.response.data,
				status: 'error',
				isClosable: true,
			});
		})
    }
	return(
		<Flex direction={'column'} p='2' bg={item?.solved?'#c1ffc1':'#eee'} borderRadius='5' >
            <Flex justify='space-between'>
                <Flex gap='2' align='center'>
                    <AccountCircleIcon style={{fontSize:'42px',color:'grey'}}/>
                    <Flex direction={'column'}>
                        <Text fontSize={'12px'} color=''>{item?.name}</Text>
                        <Text fontSize={'10px'} color='grey'>{item?.email}</Text>
                    </Flex>
                </Flex>
                <Text fontSize='8px' color='#000'>{time}</Text>
            </Flex>
            <Text p='2'>{item?.message}</Text>
            <Flex p='2' gap='2'>
                <Link fontSize='12px' bg='#009393' pl='1' pr='1' fontWeight='bold' color='#fff' href={`mailto: ${item?.email}`} isExternal>
                    reply
                </Link>
                {item?.solved?
                    <Text cursor='pointer' textDecoration='underline dotted #009393' color='red' fontWeight='bold' fontSize='12px' onClick={Handle_Un_Mark_As_Solved}>unmark as solved</Text>
                    :
                    <Text cursor='pointer' textDecoration='underline dotted #009393' color='#009393' fontSize='12px' onClick={Handle_Mark_As_Solved}>mark as solved</Text>
                }
                <Text cursor='pointer' color='red' fontSize='12px' fontWeight='bold' onClick={Handle_Delete}>Delete</Text>
			</Flex>
		</Flex>
	)
}