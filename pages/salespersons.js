//modules imports
import React,{useState,useEffect} from 'react'
import {Flex,Text,Button,Input,Image,Select,Divider} from '@chakra-ui/react'
import {useRouter} from 'next/router'
//components imports
import Header from '../components/Header.js'
//icons imports
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import TuneIcon from '@mui/icons-material/Tune';
import Person2Icon from '@mui/icons-material/Person2';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
//api-calls imports
import Get_SalesPeople from '../pages/api/salespeople/get_salespeople.js';
import { RWebShare } from "react-web-share";
import Fetching_Data_Loading_Animation from '../components/Fetching_Loading_animation.js';
//styles
import styles from '../styles/Inventory.module.css'

function SalesPersons(){
	const router = useRouter();

	const [salespeople_data, set_salespeople_data]=useState([]);

	const [suspension_status,set_suspension_status] = useState('all');
	const [search_query,set_search_query] = useState('');
	const [sort,set_sort]=useState('desc');

	const [is_fetching,set_is_fetching]=useState(null);

	const handle_get_salespeople=async()=>{
		await Get_SalesPeople().then((response)=>{
			set_is_fetching(true);
			const data = response.data
			const queried_data = (sorted_result_data)=>{
				const result = sorted_result_data.filter((item) => item?.email_of_salesperson.toLowerCase().includes(search_query.toLowerCase()) ||
					item?.company_name.toLowerCase().includes(search_query.toLowerCase()) ||
					item?.first_name.toLowerCase().includes(search_query.toLowerCase()) ||
					item?.last_name.toLowerCase().includes(search_query.toLowerCase()));

				return result;
			}
			if (sort === 'desc'){
				const sorted_result = data.sort((a, b) => a.first_name.localeCompare(b.first_name))
				//console.log(sorted_result)
				if (suspension_status === 'suspended'){
					const sorted_result_data = sorted_result?.filter((item) => item.suspension_status)
					let queried_result = queried_data(sorted_result_data);
					set_salespeople_data(queried_result)
				}else if(suspension_status === 'not suspended'){
					const sorted_result_data = sorted_result?.filter((item) => !item.suspension_status)
					let queried_result = queried_data(sorted_result_data);
					set_salespeople_data(queried_result)
				}else{
					let queried_result = queried_data(sorted_result);
					set_salespeople_data(queried_result)
				}
			}else{
				const sorted_result = data.sort((a, b) => b.first_name.localeCompare(a.first_name))
				if (suspension_status === 'suspended'){
					const sorted_result_data = sorted_result?.filter((item) => item.suspension_status)
					let queried_result = queried_data(sorted_result_data);
					set_salespeople_data(queried_result)
				}else if(suspension_status === 'not suspended'){
					const sorted_result_data = sorted_result?.filter((item) => !item.suspension_status)
					let queried_result = queried_data(sorted_result_data);
					set_salespeople_data(queried_result)
				}else{
					let queried_result = queried_data(sorted_result);
					set_salespeople_data(queried_result)
				}
			}
		}).catch((err)=>{
			set_salespeople_data([])
		}).finally(()=>{
			set_is_fetching(false);
		})
	}
	//functions
	//useEffect
	useEffect(()=>{
		handle_get_salespeople()
	},[suspension_status,search_query,sort])
	return(
		<Flex direction='column'>
			<Header />
			<Flex align={'center'}>
				<Text m='2' fontFamily='ClearSans-Bold' fontSize='24px' >Salespeople</Text>
				<RWebShare
					data={{
						text: "Account Sign Up Link.",
						url: "https://prokemia.com/signup/sales",
						title: "Signup Link",
					}}>
					<Text fontSize={'12px'} textDecoration={'1px underline dotted #009393'} cursor='pointer'>signup link 🔗</Text>
				</RWebShare>
			</Flex>
			<Flex mt='-2' gap='1' p='2' align='center'>
				<Select placeholder='suspension status' w='100px' bg='#fff' color='#000' onChange={((e)=>{set_suspension_status(e.target.value)})}>
					<option value={'suspended'} >Suspended</option>
					<option value={'not suspended'} >not suspended</option>
					<option value={'all'} >All</option>
				</Select>
				<Select placeholder='sort' w='100px' onChange={((e)=>{set_sort(e.target.value)})}> 
					<option value='desc'>A - Z</option>
					<option value='asc'>Z - A</option>
				</Select>
			</Flex>
			<Flex p='2' mt='-3' gap='2'>
				{suspension_status === 'suspended'? 
					<Flex align='center'bg='#eee' p='1' boxShadow='md' cursor='pointer' onClick={(()=>{set_suspension_status('all')})}>
						<Text align='center' >suspended</Text>
						<CloseIcon style={{fontSize:'16px',paddingTop:'3px'}}/>
					</Flex>
					: 
					null
				}
				{sort !== 'desc'? 
					<Flex align='center'bg='#eee' p='1' boxShadow='md' cursor='pointer' onClick={(()=>{set_sort('desc')})}>
						<Text align='center' >ascending</Text>
						<CloseIcon style={{fontSize:'16px',paddingTop:'3px'}}/>
					</Flex>
					: 
					null
				}
			</Flex>
			<Flex gap='2' p='2' mt='-2'>
				<Input placeholder='search salespeople' bg='#fff' flex='1' onChange={((e)=>{set_search_query(e.target.value)})}/>
				<Button bg='#009393' color='#fff'><SearchIcon /></Button>
			</Flex>
			<Flex direction='column' gap='2' p='2' className={styles.products_container_body}>
					{is_fetching || salespeople_data.length == 0?
						<Flex flex='1' h='100%' m='2' justify={'center'} align='center' direction={'column-reverse'}>
							{salespeople_data.length == 0 ?
								<Flex justify='center' align='center'>
									<Text fontSize='' color='grey'>No items match your query</Text>
								</Flex>
								:
								null
							}
							<Fetching_Data_Loading_Animation width={'250px'} height={'250px'} color={'#009393'}/>
						</Flex>
					:
						<Flex className={styles.products_container} gap='1'>
							{salespeople_data?.map((salesperson_data)=>{
								return(
									<div key={salesperson_data?._id} >
										<SalesPerson_Card_Item salesperson_data={salesperson_data}/>
									</div>
								)
							})}
						</Flex>
					}
			</Flex>
		</Flex>
	)
}

export default SalesPersons;

const SalesPerson_Card_Item=({salesperson_data})=>{
	const router = useRouter();
	const [is_view_active,set_is_view_active]=useState(false);
	return(
		<Flex gap='1' bg='#eee' borderRadius='5' align='center' justify='space-between' position='relative'>
			<Flex align='center' gap='2'>
				<Image 
					boxSize='50px' 
					src={salesperson_data?.profile_photo_url == '' || !salesperson_data?.profile_photo_url ? '../Pro.png' : salesperson_data?.profile_photo_url} 
					bg='grey' alt='photo' 
					objectFit='cover' 
					border='1px solid #eee' 
					borderRadius='5'/>
					<Flex direction='column' >
						<Text fontWeight='bold' fontSize='16px'>{salesperson_data?.first_name} {salesperson_data?.last_name}</Text>
						<Text color='grey' fontSize='12px'>{salesperson_data?.email_of_salesperson}</Text>
					</Flex>
			</Flex>
			<Flex gap='' mr='2'>
				{salesperson_data?.suspension_status?
					<DisabledByDefaultRoundedIcon style={{fontSize:'20px',color:'red',cursor:'pointer'}} onClick={(()=>{set_is_view_active(!is_view_active)})}/>
					:
					null
				}
				{is_view_active?
					<MoreVertIcon style={{fontSize:'20px',color:'#009393',cursor:'pointer'}} onClick={(()=>{set_is_view_active(!is_view_active)})}/>
					:
					<MoreVertIcon style={{fontSize:'20px',color:'grey',cursor:'pointer'}} onClick={(()=>{set_is_view_active(!is_view_active)})}/>
				}
			</Flex>
			{is_view_active? 
				<Flex direction='column' boxShadow='lg' cursor='pointer' w='120px' bg='#fff' borderRadius='5' position='absolute' bottom='-30px' right='20px' p='2' zIndex='100'>
					<Flex align='center' onClick={(()=>{router.push(`/salesperson/${salesperson_data?._id}`)})}>
						<Text>View</Text>
						<ArrowRightAltIcon style={{fontSize:'18px',color:'grey',cursor:'pointer'}}/>
					</Flex>
					<Divider/>
					{salesperson_data?.suspension_status? <Text fontSize='12px' fontWeight='bold' color='red'>suspended</Text>:null}
				</Flex>
				:
			null}
		</Flex>
	)
}