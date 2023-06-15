import React,{useState,useEffect} from 'react'
import {Flex,Image,Text,Input,Button,Select,Circle} from '@chakra-ui/react'
import {useRouter} from 'next/router';
//api
import Get_FeedBacks from '../api/Support/fetch_feedbacks.js';
//icons
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded';
//styles
import styles from '../../styles/Notifications.module.css'

export default function Feedbacks(){
	const router = useRouter();
	
	const [feedback_data, set_feedback_data]=useState([]);
	const [total, set_total]=useState([]);
	const [query, set_query]=useState('');

	const fetch_feedback_data=async()=>{
		await Get_FeedBacks().then((response)=>{
			//console.log(response.data)
			const data = response.data;
			set_total(data.length);
			const result = data?.filter((item) => item?.rate.toString().includes(query));
			set_feedback_data(result);
		})
	}
	
	useEffect(()=>{
		fetch_feedback_data()
	},[query])
	return(
		<Flex direction='column' gap='3' p='2' w='100%'>
			<Flex justify='space-between'>
				<Text fontSize='32px' fontWeight='bold' color='#009393'>Feedbacks</Text>
				<Select bg='#fff' placeholder='rate' value={query} w='120px' onChange={((e)=>{set_query(e.target.value)})}> 
					<option value='1'>1</option>
					<option value='2'>2</option>
					<option value='3'>3</option>
					<option value='4'>4</option>
					<option value='5'>5</option>
				</Select>
			</Flex>
			<Text fontSize='12px' fontWeight='bold' color='grey'>showing <span style={{color:'#009393',cursor:"pointer"}}>{feedback_data?.length}</span> of <span style={{color:'#009393',cursor:"pointer"}}>{total}</span> feedbacks</Text>			
			{feedback_data?.length === 0?
				<Flex justify='center' align='center' h='40vh' direction='column' gap='2' textAlign='center' bg='#eee' borderRadius='5'>
					<Text>You dont have new feedbacks</Text>
				</Flex>
			:
				<Flex className={styles.item_card_container} gap='2'>
					{feedback_data?.map((item)=>{
						return(
							<Feedback_Card_Item key={item?._id} item={item} />
						)
					})}
				</Flex>
			}
		</Flex>
	)
}

const Feedback_Card_Item=({item})=>{
	let jsx = [];
	for (let index = 0; index < item?.rate; index++) {
        jsx.push('index'+index)
    }
	return(
		<Flex direction={'column'} p='2' bg='#eee'>
			<Flex gap='2' align='center'>
				<AccountCircleIcon style={{fontSize:'42px',color:'grey'}}/>
				<Flex direction={'column'}>
					<Flex>
						{jsx.map((index)=>(
							<StarRateRoundedIcon key={index} style={{fontSize:'14px',color:'#009393'}}/>
						))}
					</Flex>
					<Text fontSize={'12px'} color='grey'>{item?.email}</Text>
				</Flex>
			</Flex>
			<Flex p='2'>
				<Text>{item?.feedback}</Text>
			</Flex>
		</Flex>
	)
}