//modules imports
import React,{useState,useEffect}from 'react';
import {Flex,Text,Button,Image,useToast,Select,Input,Circle} from '@chakra-ui/react';
import {useRouter} from 'next/router'
//components imports
import AddnewCareer from '../../components/modals/addNewCareerModal.js';
import View_Vacancy from '../../components/modals/View_Vacancy_Modal.js';
//api_calls
import Delete_Vacancy from '../api/careers/delete_vacancy.js';
import Get_Vacancies from '../api/careers/get_vacancies.js';
import Cookies from 'universal-cookie';
import jwt_decode from "jwt-decode";
import AddIcon from '@mui/icons-material/Add';
import styles from '../../styles/Notifications.module.css'

export default function Careers(){
	const [isaddcareerModalvisible,setisaddcareerModalvisible]=useState(false);

	const [careers_data,set_careers__data]=useState([]);
	const [searchquery,set_searchquery]=useState('');
	const [sort,set_sort]=useState('desc');
	const [is_loading, set_isloading]=useState(true);

	const cookies = new Cookies();
	const router = useRouter()
    let 	token = cookies.get('admin_token');
    const [auth_role,set_auth_role]=useState("")

	useEffect(()=>{
		Get_Data()
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
	        set_auth_role(decoded?.role)
	      }
	},[token,sort,searchquery]);

	const Get_Data=async()=>{
		set_isloading(true);
		await Get_Vacancies().then((response)=>{
			//console.log(response.data)
			let fetched_data = response.data
			const filtered_data = fetched_data.filter((item)=> item.title?.toLowerCase().includes(searchquery.toLowerCase()) || item.company?.toLowerCase().includes(searchquery.toLowerCase()));
			//console.log(filtered_data)
			if (sort == 'desc'){
				const sorted_result = filtered_data.sort((a, b) => a.title.localeCompare(b.title))	
				set_careers__data(sorted_result)
			}else{
				const sorted_result = filtered_data.sort((a, b) => b.title.localeCompare(a.title))
				set_careers__data(sorted_result)
			}
		}).then(()=>{
			set_isloading(false);
		}).catch((err)=>{
			throw new Error("Fetching error");
			console.error(err)
		});
	}

	return(
		<Flex direction='column' w='100%'>
			<AddnewCareer isaddcareerModalvisible={isaddcareerModalvisible} setisaddcareerModalvisible={setisaddcareerModalvisible} auth_role={auth_role}/>
			<Flex direction='column' gap='2' p='2'>
				<Text color='#009393' fontSize='32px' fontWeight='bold'>Careers <span style={{color:"#000",fontSize:'18px'}}>({careers_data?.length})</span></Text>
				<Flex gap='2'>
					<Select placeholder='sort' w='100px' onChange={((e)=>{set_sort(e.target.value)})}> 
						<option value='desc'>A - Z</option>
						<option value='asc'>Z - A</option>
					</Select>
					<Input placeholder='search careers by title, company' onChange={((e)=>{set_searchquery(e.target.value)})}/>
				</Flex>
				{is_loading?
					<>
						<Item_Loading/>
						<Item_Loading/>
					</>
					:
					<Flex className={styles.item_card_container} bg='#eee'>
						{careers_data?.map((item)=>{
							return (
								<Career_Item key={item._id} item={item} auth_role={auth_role}/>
							)
						})}
					</Flex>
				}
				<Circle _hover={{transform:"scale(1.03)",transition:'ease-out 0.9s all'}} onClick={(()=>{setisaddcareerModalvisible(true)})} boxShadow='dark-lg' cursor='pointer' color='#fff' boxSize='60px' bg='#009393' position='fixed' bottom='20px' right='20px'><AddIcon/></Circle>

			</Flex>
		</Flex>
	)
}

const Career_Item=({item,auth_role})=>{
	const toast = useToast();
	const router = useRouter()
	const [is_view_vacancy_Modalvisible,set_is_view_vacancy_Modalvisible]=useState(false);
	const payload = {
		_id: item._id,
		auth_role
	}

	const handle_delete_vacancy=async()=>{
		let response =  prompt(`Are you sure you want to delete this career? Enter, the company of the career post: ${item.company} to confirm.`);
		if (response === item.company){
			await Delete_Vacancy(payload).then(()=>{
	            toast({
	              title: '',
	              description: `career post by ${item?.company} has been deleted`,
	              status: 'info',
	              isClosable: true,
	            });
	          }).then(()=>{
	          	router.refresh()
	          }).catch((err)=>{
	            console.log(err)
	            toast({
	                      title: 'error while deleting this career',
	                      description: '',
	                      status: 'error',
	                      isClosable: true,
	                  })
	          })
	      }else{
	      	 toast({
	              title: `Deletion for this careet has been cancelled.`,
	              description: `Input titles do not match`,
	              status: 'info',
	              isClosable: true,
	            });
	      }
	}
	return(
		<Flex borderRadius='5' bg='#fff' p='2' gap='1' direction='column' boxShadow={'lg'} m='2'>
			<Text fontSize='24px' fontWeight='bold' color='#009393'>{item.title}</Text>
			<Flex gap='2'>
				<Text fontWeight='bold'>Posted by:</Text>
				<Text>{item.company}</Text>
			</Flex>
			<Flex gap='2'>
				<Text fontWeight='bold'>Requirements: </Text>
				<Text>{item.requirements}</Text>
			</Flex>
			<Flex gap='2'>
				<Text fontWeight='bold'>Description: </Text>
				<Text>{item.description}</Text>
			</Flex>
			<Flex gap='2'>
				<Text fontWeight='bold'>Status: </Text>
				<Text>{item.status}</Text>
			</Flex>
			<Flex gap='2'>
				<Text fontWeight='bold'>Valid_till: </Text>
				<Text>{item.valid_till}</Text>
			</Flex>
			<Flex gap='2'>
				<Button flex='1' bg='#009393' color='#fff' onClick={(()=>{set_is_view_vacancy_Modalvisible(true)})} cursor='pointer'>Edit details</Button>
				<Button flex='1' bg='#fff' border='1px solid red' color='red' onClick={handle_delete_vacancy} cursor='pointer'>Delete</Button>
			</Flex>
			<View_Vacancy is_view_vacancy_Modalvisible={is_view_vacancy_Modalvisible} set_is_view_vacancy_Modalvisible={set_is_view_vacancy_Modalvisible} item={item}/>
		</Flex>
	)
}

const Item_Loading=()=>{
	return(
		<Flex bg='#fff' direction='column' borderRadius='5px' boxShadow='lg' justify='space-between' position='relative' p='2' gap='2'>
			<Flex bg='#eee' w='80%' h='25px' borderRadius='5px'/>
			<Flex gap='2'>
				<Flex bg='#eee' w='50px' h='25px' borderRadius='5px'/>
				<Flex bg='#eee' w='120px' h='25px' borderRadius='5px'/>
			</Flex>
			<Flex gap='2'>
				<Flex bg='#eee' w='50px' h='25px' borderRadius='5px'/>
				<Flex bg='#eee' w='120px' h='25px' borderRadius='5px'/>
			</Flex>
			<Flex bg='#eee' position='absolute' top='10px' right='15px' w='25px' h='25px' borderRadius='5px'/>
			<Flex gap='2'>
				<Flex bg='#eee' w='120px' h='35px' borderRadius='5px'/>
				<Flex bg='#eee' w='120px' h='35px' borderRadius='5px'/>
			</Flex>
		</Flex>
	)
}