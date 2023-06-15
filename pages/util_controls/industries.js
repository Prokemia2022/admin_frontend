//modules imports
import React,{useState,useEffect}from 'react';
import {Flex,Text,Button,Image,useToast,Select,Input,Circle} from '@chakra-ui/react';
import {useRouter} from 'next/router'
//components imports
import AddNewIndustryModal from '../../components/modals/addNewIndustryModal.js';
import Edit_Industry from '../../components/modals/edit_industry.js';
//api_calls
import Get_Industries from '../api/controls/get_industries.js';
import Delete_Industry from '../api/controls/delete_industry.js';
import Cookies from 'universal-cookie';
import jwt_decode from "jwt-decode";
import AddIcon from '@mui/icons-material/Add';
import styles from '../../styles/Notifications.module.css'

export default function Industry(){
	const [isaddindustryModalvisible,setisaddindustryModalvisible]=useState(false);
	const [is_edit_industry_Modalvisible,set_is_edit_industry_Modalvisible]=useState(false);

	const [Industries_data,set_Industries_data]=useState([]);
	const [searchquery,set_searchquery]=useState('');
	const [sort,set_sort]=useState('desc');
	const [is_loading, set_isloading]=useState(true);

	const cookies = new Cookies();
	const router = useRouter()
    let token = cookies.get('admin_token');
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
		await Get_Industries().then((response)=>{
			//console.log(response.data)
			let fetched_data = response.data
			const filtered_data = fetched_data.filter((item)=> item.verification_status && item.title?.toLowerCase().includes(searchquery.toLowerCase()));
			//console.log(filtered_data)
			if (sort == 'desc'){
				const sorted_result = filtered_data.sort((a, b) => a.title.localeCompare(b.title))	
				set_Industries_data(sorted_result)
			}else{
				const sorted_result = filtered_data.sort((a, b) => b.title.localeCompare(a.title))
				set_Industries_data(sorted_result)
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
			<AddNewIndustryModal isaddindustryModalvisible={isaddindustryModalvisible} setisaddindustryModalvisible={setisaddindustryModalvisible} auth_role={auth_role}/>
			<Flex direction='column' gap='2' p='2'>
				<Text color='#009393' fontSize='32px' fontWeight='bold'>Industries <span style={{color:"#000",fontSize:'18px'}}>({Industries_data?.length})</span></Text>
				<Flex gap='2'>
					<Select placeholder='sort' w='100px' onChange={((e)=>{set_sort(e.target.value)})}> 
						<option value='desc'>A - Z</option>
						<option value='asc'>Z - A</option>
					</Select>
					<Input placeholder='search industry' onChange={((e)=>{set_searchquery(e.target.value)})}/>
				</Flex>
				{is_loading?
					<>
						<Item_Loading/>
						<Item_Loading/>
					</>
					:
					<Flex className={styles.item_card_container} bg='#eee'>
						{Industries_data?.map((item)=>{
							return (
								<Industry_Item key={item._id} item={item} auth_role={auth_role}/>
							)
						})}
					</Flex>
				}
				<Circle _hover={{transform:"scale(1.03)",transition:'ease-out 0.9s all'}} onClick={(()=>{setisaddindustryModalvisible(true)})} boxShadow='dark-lg' cursor='pointer' color='#fff' boxSize='60px' bg='#009393' position='fixed' bottom='20px' right='20px'><AddIcon/></Circle>

			</Flex>
		</Flex>
	)
}

const Industry_Item=({item,auth_role})=>{
	const toast = useToast();
	const router = useRouter();
	const cookies = new Cookies();
	const [is_edit_industry_Modalvisible,set_is_edit_industry_Modalvisible]=useState(false);
	const payload = {
		_id: item._id,
		auth_role
	}

	const handle_delete_industry=async()=>{
		let response =  prompt(`Are you sure you want to delete this industry? Enter, the title of the industry: ${item.title} to confirm.`);
		if (response === item.title){
			await Delete_Industry(payload).then(()=>{
	            toast({
	              title: '',
	              description: `${item?.title} has been deleted`,
	              status: 'info',
	              isClosable: true,
	            });
	          }).then(()=>{
	          	cookies.remove('ind_image_url', { path: '/' });
	          }).catch((err)=>{
	            console.log(err)
	            toast({
	                      title: 'error while deleting this industry',
	                      description: err.response?.data,
	                      status: 'error',
	                      isClosable: true,
	                  })
	          })
	      }else{
	      	 toast({
	              title: `Deletion for ${item?.title} has been cancelled.`,
	              description: `Input titles do not match`,
	              status: 'info',
	              isClosable: true,
	            });
	      }
		
	}
	return(
		<Flex borderRadius='5' bg='#fff'gap='1' mb='2' justify='space-between'>
			<Image src={item.cover_image} alt='industry photo' boxSize='100px' objectFit='cover' borderRadius='5'/>
			<Flex direction='column' flex='1' p='2' gap='2' h='100px'>
				<Text fontWeight='bold' color='#009393'>{item?.title}</Text>
				<Text h='60%' overflow='hidden'>{item?.description}</Text>
			</Flex>
			<Flex gap='2' justify='space-between' direction='column' p='2'>
				<Text p='1' borderRadius='5px' border='1px solid #000' onClick={(()=>{set_is_edit_industry_Modalvisible(true)})} cursor='pointer'>Edit</Text>
				<Text p='1' borderRadius='5px' color='red' border='1px solid red' cursor='pointer' onClick={handle_delete_industry}>Delete</Text>
			</Flex>
			<Edit_Industry is_edit_industry_Modalvisible={is_edit_industry_Modalvisible} set_is_edit_industry_Modalvisible={set_is_edit_industry_Modalvisible} item={item} auth_role={auth_role}/>
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