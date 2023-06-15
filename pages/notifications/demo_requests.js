import React,{useState,useEffect} from 'react'
import {Flex,Text,Input,Button,Select,Link,useToast} from '@chakra-ui/react'
import {useRouter} from 'next/router';
//api
import Fetch_Tickets from '../api/Support/Request_Demo_Tickets/fetch_tickets.js';
import Mark_Ticket_As_Solved from '../api/Support/Request_Demo_Tickets/mark_ticket_as_solved.js';
import Un_Mark_Ticket_As_Solved from '../api/Support/Request_Demo_Tickets/un_mark_ticket_as_solved.js';
import Delete_Ticket from '../api/Support/Request_Demo_Tickets/delete_ticket.js';
// import Un_Mark_Support_As_Solved from '../api/Support/un_mark_support_as_solved.js';
// import Delete_Support_Question from '../api/Support/delete_support_question.js';
//icons
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded';
//styles
import styles from '../../styles/Notifications.module.css'
//utils
import moment from 'moment';
import Cookies from 'universal-cookie';
import jwt_decode from "jwt-decode";

export default function Request_Demo_Tickets(){
	const router = useRouter();
    const cookies = new Cookies();
    let token = cookies.get('admin_token');
    const [auth_role,set_auth_role]=useState("")
    const [auth_user_name,set_auth_user_name]=useState("")
	
	const [ticket_data, set_ticket_data]=useState([]);
	const [total, set_total]=useState([]);
	const [query, set_query]=useState('');
    const [sort, set_sort]=useState('');
    const [refresh, set_refresh]=useState(null);

	const fetch_data=async()=>{
		await Fetch_Tickets().then((response)=>{
			//console.log(response.data)
			const data = response.data.reverse();
            const sorted_data =(result)=>{
				switch (sort){
					case 'descending':
						return result.sort((a, b) => a.name.localeCompare(b.name))
					case 'ascending':
						return result.sort((a, b) => b.name.localeCompare(a.name))
					case 'completed':
						return result?.filter((item) => item.completed_status)
					case 'not completed':
						return result?.filter((item) => !item.completed_status)
					default:
						return result.sort((a, b) => a.name.localeCompare(b.name))
				}
			}
			set_total(data.length);
			const result = data?.filter((item) => item?.name.toLowerCase().includes(query.toLowerCase()) || item?.email.toLowerCase().includes(query.toLowerCase()));
            const sorted_result = sorted_data(result);
			set_ticket_data(sorted_result);
		})
	}
	
	useEffect(()=>{
		fetch_data()
	},[query,refresh,sort])

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
            set_auth_user_name(decoded?.user_name);
	      }
	},[])
    const Clear_Filter=()=>{
        set_sort('');
        set_query('');
    }
	return(
		<Flex direction='column' gap='3' p='2' w='100%'>
			<Flex justify='space-between'>
				<Text fontSize='24px' fontWeight='bold' color='#009393'>Request Demo</Text>
                <Input bg='#fff' placeholder='search...' value={query} w='30%' onChange={((e)=>{set_query(e.target.value)})}/>
			</Flex>
            <Flex gap='2' align='center'>
                <Select value={sort} placeholder='sort' w='100px' onChange={((e)=>{set_sort(e.target.value)})}> 
					<option value='descending'>A - Z</option>
					<option value='ascending'>Z - A</option>
				</Select>
				<Select value={sort} placeholder='completed status' w='100px' onChange={((e)=>{set_sort(e.target.value)})}> 
					<option value='completed'>completed</option>
					<option value='not completed'>not completed</option>
				</Select>
                {query || sort ? <Text color='grey' cursor='pointer' onClick={Clear_Filter}>Clear filter</Text>:null}
            </Flex>
			<Text fontSize='12px' fontWeight='bold' color='grey'>showing <span style={{color:'#009393',cursor:"pointer"}}>{ticket_data?.length}</span> of <span style={{color:'#009393',cursor:"pointer"}}>{total}</span> tickets</Text>			
			{ticket_data?.length === 0?
				<Flex justify='center' align='center' h='40vh' direction='column' gap='2' textAlign='center' bg='#eee' borderRadius='5'>
					<Text>You dont have new tickets</Text>
				</Flex>
			:
				<Flex className={styles.item_card_container} gap='2' >
					{ticket_data?.map((item)=>{
						return(
							<Ticket_Card_Item key={item?._id} item={item} auth_role={auth_role} set_refresh={set_refresh} refresh={refresh} auth_user_name={auth_user_name}/>
						)
					})}
				</Flex>
			}
		</Flex>
	)
}

const Ticket_Card_Item=({item,auth_role,set_refresh,refresh,auth_user_name})=>{
    let time = moment(item?.createdAt).format('MMM Do YYYY, h:mm a');
    const toast = useToast()
	const payload = {
		_id : item?._id,
		auth_role,
        completed_by:auth_user_name
	}
    const Handle_Mark_As_Solved=async()=>{
        await Mark_Ticket_As_Solved(payload).then((res)=>{
            toast({
				title: 'Ticket has been updated successfully',
				position: 'top-left',
				variant:"subtle",
				description: `Ticket has been marked as solved`,
				status: 'success',
				isClosable: true,
			});
		}).then(()=>{
            set_refresh(!refresh)
        }).catch((err)=>{
			toast({
				title: 'Ticket update failed',
				position: 'top-left',
				variant:"subtle",
				description: err.response.data,
				status: 'error',
				isClosable: true,
			});
		})
    }
    const Handle_Un_Mark_As_Solved=async()=>{
        await Un_Mark_Ticket_As_Solved(payload).then((res)=>{
            toast({
				title: 'Ticket has been updated successfully',
				position: 'top-left',
				variant:"subtle",
				description: `Ticket has been unmarked as solved`,
				status: 'success',
				isClosable: true,
			});
		}).then(()=>{
            set_refresh(!refresh)
        }).catch((err)=>{
			toast({
				title: 'Ticket update failed',
				position: 'top-left',
				variant:"subtle",
				description: err.response.data,
				status: 'error',
				isClosable: true,
			});
		})
    }
    const Handle_Delete=async()=>{
        await Delete_Ticket(payload).then((res)=>{
            toast({
				title: 'Ticket has been deleted successfully',
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
				title: 'Ticket deletion failed',
				position: 'top-left',
				variant:"subtle",
				description: err.response.data,
				status: 'error',
				isClosable: true,
			});
		})
    }
	return(
		<Flex direction={'column'} p='2' bg={item?.completed_status?'#c1ffc1':'#eee'} borderRadius='5' >
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
            <Text p='2'>{item?.job_function}</Text>
            {item?.completed_by?
                <Text color='grey' fontSize='12px' pl='2'>{item?.completed_by}</Text>
                :
                null
            }
            <Flex p='2' gap='2'>
                <Link fontSize='12px' bg='#009393' pl='1' pr='1' fontWeight='bold' color='#fff' href={`mailto: ${item?.email}`} isExternal>
                    reply
                </Link>
                {item?.completed_status?
                    <Text cursor='pointer' textDecoration='underline dotted #009393' color='red' fontWeight='bold' fontSize='12px' onClick={Handle_Un_Mark_As_Solved}>unmark as completed</Text>
                    :
                    <Text cursor='pointer' textDecoration='underline dotted #009393' color='#009393' fontSize='12px' onClick={Handle_Mark_As_Solved}>mark as completed</Text>
                }
                <Text cursor='pointer' color='red' fontSize='12px' fontWeight='bold' onClick={Handle_Delete}>Delete</Text>
			</Flex>
		</Flex>
	)
}