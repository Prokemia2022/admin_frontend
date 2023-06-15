//modules
import React,{useState,useEffect}from 'react';
import {Flex,Text,Button,Input,Image,Select, Divider} from '@chakra-ui/react'
import {useRouter} from 'next/router'
//api
import Get_Distributors from '../pages/api/distributors/get_distributors.js';
import Get_Industries from '../pages/api/controls/get_industries';
import Get_Technologies from '../pages/api/controls/get_technologies'
//icons
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import TuneIcon from '@mui/icons-material/Tune';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded';
import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';
//components
import Header from '../components/Header.js';
import Fetching_Data_Loading_Animation from '../components/Fetching_Loading_animation.js'
//styles
import styles from '../styles/Notifications.module.css'

export default function Distributors(){
	const router = useRouter();
	
	const [distributors_data, set_distributors_data]=useState([]);
	const [industries_data, set_industries_data]=useState([]);
	const [technologies_data, set_technologies_data]=useState([]);
	
	const [suspension_status,set_suspension_status] = useState('all');
	const [subscription_status,set_subscription_status] = useState('');
	const [search_query,set_search_query] = useState('');
	const [industry,set_industry] = useState('');
	const [technology,set_technology] = useState('');

	const [sort,set_sort]=useState('descending');
	const [is_fetching,set_is_fetching]=useState(null);
	
	
	//api
	const get_Industries_Data=async()=>{
		await Get_Industries().then((response)=>{
			//console.log(response.data)
			const data = response.data
			const result = data.filter(v => v.verification_status)
			//console.log(data.filter(v => v.verification_status))
			set_industries_data(result)
		}).catch((err)=>{
			set_industry([])
		})
	}

	const get_Technology_Data=async()=>{
		await Get_Technologies().then((response)=>{
			//console.log(response.data)
			const data = response.data
			const result = data.filter(v => v.verification_status)
			//console.log(data.filter(v => v.verification_status))
			set_technologies_data(result)
		}).catch((err)=>{
			set_technology([])
		})
	}

	const Clear_Filter_Options=()=>{
		set_sort('descending');
		set_search_query('');
		set_suspension_status('all')
		set_subscription_status('')
	}

	const handle_get_distributors=async()=>{
		await Get_Distributors().then((response)=>{
			set_is_fetching(true);
			//console.log(response.data)
			const data = response.data;
			const sorted_data =(result)=>{
				switch (sort){
					case 'descending':
						return result.filter(v => v.verification_status).sort((a, b) => a.company_name.localeCompare(b.company_name))
					case 'ascending':
						return result.filter(v => v.verification_status).sort((a, b) => b.company_name.localeCompare(a.company_name))
					case 'subscribed':
						return result?.filter((item) => item.subscription)
					case 'not subscribed':
						return result?.filter((item) => !item.subscription)
					default:
						return result.filter(v => v.verification_status).sort((a, b) => a.company_name.localeCompare(b.company_name))
				}
			}
			const search_queried_data =(sorted_result)=>{
				return sorted_result.filter((item) => item?.email_of_company?.toLowerCase().includes(search_query.toLowerCase()) ||
					item?.company_name?.toLowerCase().includes(search_query.toLowerCase()) || 
					item?.first_name?.toLowerCase().includes(search_query.toLowerCase()) ||
					item?.industry?.toLowerCase().includes(industry.toLowerCase()) ||
					item?.technology?.toLowerCase().includes(technology.toLowerCase()) ||
					item?.mobile_of_company?.includes(search_query) ||
					item?.last_name?.toLowerCase().includes(search_query.toLowerCase()))
			}
			if (suspension_status === 'suspended'){
				let result = data?.filter((item) => item.suspension_status)
				let sorted_result = sorted_data(result);
				let queried_result = search_queried_data(sorted_result);
				console.log(queried_result);
				set_distributors_data(queried_result)
			}else if(suspension_status === 'not suspended'){
				let result = data?.filter((item) => !item.suspension_status)
				let sorted_result = sorted_data(result);
				let queried_result = search_queried_data(sorted_result);
				console.log(queried_result);
				set_distributors_data(queried_result)
			}else if(suspension_status === 'all'){
				let result = data?.filter((item) => item.verification_status)
				let sorted_result = sorted_data(result);
				let queried_result = search_queried_data(sorted_result);
				console.log(queried_result);
				set_distributors_data(queried_result)
			}else{
				let result = data?.filter((item) => item.verification_status)
				let sorted_result = sorted_data(result);
				let queried_result = search_queried_data(sorted_result);
				console.log(queried_result);
				set_distributors_data(queried_result)
			}
		}).catch((err)=>{
			//console.log(err)
			set_distributors_data([])
		}).finally(()=>{
			set_is_fetching(null);
		})
	}
	//functions
	//useEffect
	useEffect(()=>{
		handle_get_distributors()
	},[suspension_status,subscription_status,search_query,sort])

	return(
		<Flex direction='column' h='100vh'>
			<Header />
			<Text m='2' fontFamily='ClearSans-Bold' fontSize='24px' >Distributors({distributors_data?.length})</Text>
			<Flex gap='2' p='2' align='center'>
				<Select placeholder='suspension status' w='100px' bg='#fff' color='#000' onChange={((e)=>{set_suspension_status(e.target.value)})}>
					<option value={'suspended'} >Suspended</option>
					<option value={'not suspended'} >not suspended</option>
					<option value={'all'} >All</option>
				</Select>
				<Select placeholder='sort' w='100px' onChange={((e)=>{set_sort(e.target.value)})}> 
					<option value='descending'>A - Z</option>
					<option value='ascending'>Z - A</option>
				</Select>
				<Select placeholder='subscription status' w='100px' onChange={((e)=>{set_sort(e.target.value)})}> 
					<option value='subscribed'>subscribed</option>
					<option value='not subscribed'>not subscribed</option>
				</Select>
				{search_query !== '' || suspension_status !== 'all' || suspension_status === '' || subscription_status !== '' || sort !== 'descending'? 
					<Text color='grey' onClick={Clear_Filter_Options} fontSize='14px' cursor='pointer'>Clear filter</Text> : 
					null
				}
			</Flex>
			<Flex p='2' gap='2'>
				{suspension_status !== 'all' || suspension_status !== ''? 
					<Flex align='center'bg='#eee' p='1' boxShadow='md' cursor='pointer' onClick={(()=>{set_suspension_status('all')})}>
						<Text align='center' >{suspension_status}</Text>
						<CloseIcon style={{fontSize:'16px',paddingTop:'3px'}}/>
					</Flex>
					: 
					null
				}
				{sort !== '' && sort !== 'descending'? 
					<Flex align='center'bg='#eee' p='1' boxShadow='md' cursor='pointer' onClick={(()=>{set_sort('descending')})}>
						<Text align='center' >{sort}</Text>
						<CloseIcon style={{fontSize:'16px',paddingTop:'3px'}}/>
					</Flex>
					: 
					null
				}
				{subscription_status === 'false'? 
					<Flex align='center'bg='#eee' p='1' boxShadow='md' cursor='pointer' onClick={(()=>{set_subscription_status('true')})}>
						<Text >Not subscribed</Text>
						<CloseIcon style={{fontSize:'14px',paddingTop:'3px'}}/>
					</Flex>
					: 
					null
				}
			</Flex>
			<Flex gap='2' p='2'>
				<Input placeholder='search Distributors' value={search_query} bg='#fff' flex='1' onChange={((e)=>{set_search_query(e.target.value)})}/>
				<Button bg='#009393' color='#fff'><SearchIcon /></Button>
			</Flex>
			{is_fetching || distributors_data.length == 0?
					<Flex flex='1' h='100%' m='2' justify={'center'} align='center' direction={'column-reverse'}>
						{distributors_data.length == 0 ?
							<Flex justify='center' align='center'>
								<Text fontSize='' color='grey'>No items match your query</Text>
							</Flex>
							:
							null
						}
						<Fetching_Data_Loading_Animation width={'250px'} height={'250px'} color={'#009393'}/>
					</Flex>
				:
				<>
					{distributors_data.length == 0 ?
						<Flex h='40vh' justify='center' align='center'>
							<Text fontSize='28px' fontWeight='bold' color='grey'>No items match your query</Text>
						</Flex>
					:
						<Flex className={styles.item_card_container}>
							{distributors_data?.map((distributor_data)=>{
								return(
									<div key={distributor_data?._id} >
										<Distributor_Card_Item distributor_data={distributor_data}/>
									</div>
								)
							})}
						</Flex>
					}
				</>
			}
		</Flex>
	)
}
const Distributor_Card_Item=({distributor_data})=>{
	const router = useRouter();
	const [is_view_active,set_is_view_active]=useState(false);
	return(
		<Flex m='2' gap='1' bg='#eee' borderRadius='5' align='center' justify='space-between' position='relative'>
			<Flex align='center' gap='2'>
				<Image 
					boxSize='50px' 
					src={distributor_data?.profile_photo_url == '' || !distributor_data?.profile_photo_url ? './Pro.png' : distributor_data?.profile_photo_url} 
					bg='grey' alt='photo' 
					objectFit='cover' 
					border='1px solid #eee' 
					borderRadius='5'/>
					<Flex direction='column' >
						<Text fontWeight='bold' fontSize='16px'>{distributor_data?.company_name}</Text>
						<Text color='grey' fontSize='12px'>{distributor_data?.email_of_company}</Text>
					</Flex>
			</Flex>
			<Flex gap='' mr='2'>
				{distributor_data?.suspension_status?
					<DisabledByDefaultRoundedIcon style={{fontSize:'20px',color:'red',cursor:'pointer'}} onClick={(()=>{set_is_view_active(!is_view_active)})}/>
					:
					null
				}
				{distributor_data?.subscription?
					<StarRateRoundedIcon style={{fontSize:'20px',color:'#009393',cursor:'pointer'}} onClick={(()=>{set_is_view_active(!is_view_active)})}/>
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
					<Flex align='center' onClick={(()=>{router.push(`/distributor/${distributor_data?._id}`)})}>
						<Text>View</Text>
						<ArrowRightAltIcon style={{fontSize:'18px',color:'grey',cursor:'pointer'}}/>
					</Flex>
					<Divider/>
					{distributor_data?.subscription? <Text fontSize='12px' fontWeight='bold' color='#009393'>subscribed</Text>:null}
					<Divider/>
					{distributor_data?.suspension_status? <Text fontSize='12px' fontWeight='bold' color='red'>suspended</Text>:null}
				</Flex>
				:
			null}
		</Flex>
	)
}