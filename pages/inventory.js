//modules import
import React,{useState,useEffect}from 'react';
import {Flex,Text,Button,Input,Select,Circle,} from '@chakra-ui/react'
import {useRouter} from 'next/router'
//icons imports
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import VerifiedIcon from '@mui/icons-material/Verified';
//components imports
import Header from '../components/Header.js';
import Fetching_Data_Loading_Animation from '../components/Fetching_Loading_animation.js'
//api-calls
import Get_Products from './api/Products/get_products.js'
import Get_Industries from './api/controls/get_industries';
import Get_Technologies from './api/controls/get_technologies';
//styles
import styles from '../styles/Inventory.module.css'

export default function Inventory(){
	const router = useRouter();
	const [products,set_products]=useState([]);
	const [total_products,set_Total_products]=useState(0);
	const [filter_active, set_filter_active] = useState(false);
	const [search_query,set_search_query] = useState('');
	const [industry,set_industry] = useState('');
	const [technology,set_technology] = useState('');
	const [sort,set_sort]=useState('desc');
	const [is_fetching,set_is_fetching]=useState(false);

	const [industries_data, set_industries_data]=useState([]);
	const [technologies_data, set_technologies_data]=useState([]);

	//console.log()
	useEffect(()=>{
		//console.log(search_query,industry,technology)
		get_Industries_Data()
		get_Technology_Data()
		get_Products_Data()
		

	},[search_query,industry,technology,sort])

	const get_Products_Data=async()=>{
		set_is_fetching(true);
		await Get_Products().then((response)=>{
			//console.log(response.data)
			const data = response.data;
			set_Total_products(data?.length);
			const result =  data.filter(v => v.verification_status)
			const result_data = result?.filter((item) => 	item?.industry.toLowerCase().includes(search_query.toLowerCase()) ||
														item?.technology.toLowerCase().includes(search_query.toLowerCase()) ||
														item?.email_of_lister.toLowerCase().includes(search_query.toLowerCase()) ||
														item?.name_of_product.toLowerCase().includes(search_query.toLowerCase()) ||
														item?.brand.toLowerCase().includes(search_query.toLowerCase()) ||
														item?.function.toLowerCase().includes(search_query.toLowerCase()) ||
														item?.chemical_name.toLowerCase().includes(search_query.toLowerCase()) ||
														item?.features_of_product.toLowerCase().includes(search_query.toLowerCase()) ||
														item?.manufactured_by.toLowerCase().includes(search_query.toLowerCase()) ||
														item?.description_of_product.toLowerCase().includes(search_query.toLowerCase()))	

			//console.log(result_data)
			if (sort == 'desc'){
				const sorted_result = result_data.sort((a, b) => a.name_of_product.localeCompare(b.name_of_product))	
				set_products(sorted_result)
			}else if(sort == 'asc'){
				const sorted_result = result_data.sort((a, b) => b.name_of_product.localeCompare(a.name_of_product))
				set_products(sorted_result)
			}else if(sort == 'featured'){
				const sorted_result = result_data.filter(v => v.sponsored)
				set_products(sorted_result)
			}else if(sort == 'un_featured'){
				const sorted_result = result_data.filter(v => !v.sponsored)
				set_products(sorted_result)
			}
		}).catch((err)=>{
			console.log(err)
		}).finally(()=>{
			set_is_fetching(false);
		})
	}
	const get_Industries_Data=async()=>{
		await Get_Industries().then((response)=>{
			//console.log(response.data)
			const data = response.data
			const result = data.filter(v => v.verification_status)
			//console.log(data.filter(v => v.verification_status))
			set_industries_data(result.sort((a, b) => a.title.localeCompare(b.title)))
		})
	}
	const get_Technology_Data=async()=>{
		await Get_Technologies().then((response)=>{
			//console.log(response.data)
			const data = response.data
			const result = data.filter(v => v.verification_status)
			//console.log(data.filter(v => v.verification_status))
			set_technologies_data(result.sort((a, b) => a.title.localeCompare(b.title)))
		})
	}
	//console.log(products)
	const Clear_Filter_Options=()=>{
		set_sort('desc')
		set_search_query('');
		set_industry('');
		set_technology('');
	}

	return(
		<Flex direction='column' position='relative' h='100vh' bg='#eee'>
			<Header/>
			<Flex direction='column' className={styles.products_filter_body}>
				<Text m='1' fontFamily='ClearSans-Bold' fontSize='28px' >Inventory</Text>
				{filter_active? 
					<FilterBar technologies_data={technologies_data} industries_data={industries_data} set_filter_active={set_filter_active} set_industry={set_industry} set_technology={set_technology} set_search_query={set_search_query}/>
					: null
				}
				<Flex gap='2' p='1' align='center' mt='-2'>
					<Button bg='#fff' p='4' onClick={(()=>{set_filter_active(true)})}>Filter<TuneIcon/></Button>
					<Select bg='#fff' placeholder='sort' value={sort} w='120px' onChange={((e)=>{set_sort(e.target.value)})}> 
						<option value='desc'>A - Z</option>
						<option value='asc'>Z - A</option>
						<option value='featured'>Featured</option>
						<option value='un_featured'>Un-Featured</option>
					</Select>
					{search_query !== '' || industry !== '' || technology !== '' || sort !== 'desc'? 
						<Text color='grey' onClick={Clear_Filter_Options} ml='3' cursor='pointer'>Clear Filter</Text> : 
						null
					}
				</Flex>
				<Flex gap='2' p='1'>
					{sort !== 'desc'? 
						<Flex align='center' bg='#fff' p='1' boxShadow='md' cursor='pointer' onClick={(()=>{set_sort('desc')})}>
							<Text align='center' >{sort}</Text>
							<CloseIcon style={{fontSize:'16px',paddingTop:'3px'}}/>
						</Flex>
						: 
						null
					}
				</Flex>
				<Flex gap='2' p='1' mt='-2'>
					<Input placeholder='search Products by Name, Industry, Technology...' value={search_query} bg='#fff' flex='1' onChange={((e)=>{set_search_query(e.target.value)})}/>
					<Button bg='#009393' color='#fff'><SearchIcon /></Button>
				</Flex>
				<Flex bg='#fff' borderRadius={'0px'} m='1' p='2'>
					<Text m='2' fontSize='12px' color='grey'>showing <span style={{color:"#009393",fontWeight:'bold'}}>{products?.length}</span> of <span style={{color:"#009393",fontWeight:'bold'}}>{total_products}</span></Text>
				</Flex>
			</Flex>
			<Flex className={styles.products_container_body} p='1'>
				{is_fetching || products?.length == 0 ?
						<Flex justify={'center'} flex='1' align='center' direction={'column-reverse'}>
							{products?.length == 0 ?
								<Flex justify='center' align='center'>
									<Text fontSize='' color='grey'>No items match your query</Text>
								</Flex>
								:
								null
							}
							<Fetching_Data_Loading_Animation width={'250px'} height={'250px'} color={'#009393'}/>
						</Flex>
					:
						<Flex gap='1' flex='1' className={styles.products_container}>
							{products?.map((product)=>{
								return(
									<Product_Item product={product} key={product._id} search_query={search_query}/>
								)
							})}
						</Flex>		
				}
			</Flex>
		</Flex>
	)
}

const FilterBar=({set_filter_active,set_industry,set_technology,set_search_query,industries_data,technologies_data})=>{
	const Handle_Clear=()=>{
		set_search_query('')
		set_filter_active(false)
	}
	return(
			<Flex color='#fff' direction='column' gap='3' p='4' w='70vw' h='90vh' bg='#090F14' position='fixed' top='75px' left='0px' zIndex='2' boxShadow='dark-lg'>
				<Flex justify='space-between' p='2'>
					<Text>Filter results</Text>
					<Text cursor='pointer' onClick={(()=>{set_filter_active(false)})}>Close</Text>
				</Flex>
				<Flex direction='column' >
					<Text>Industry</Text>
					<Select placeholder='Industry' bg='#fff' color='#000' onChange={((e)=>{set_search_query(e.target.value);set_filter_active(false)})}>
						<option value=''>all</option>
						{industries_data?.map((item)=>{
								return(
									<option key={item._id} value={item.title}>{item.title}</option>

								)
							})}
					</Select>
				</Flex>
				<Flex direction='column' >
					<Text>Technology</Text>
					<Select placeholder='Technology' bg='#fff' color='#000' onChange={((e)=>{set_search_query(e.target.value);set_filter_active(false)})}>
					<option value=''>all</option>	
					{technologies_data?.map((item)=>{
							return(
								<option key={item._id} value={item.title}>{item.title}</option>
							)
						})}
					</Select>
				</Flex>
				<Flex gap='2'>
					<Button flex='1' bg='#009393' color='#fff' onClick={(()=>{set_filter_active(false)})}>Filter Results</Button>
					<Button flex='1' bg='#fff' color='#000' onClick={Handle_Clear}>Clear Filter Results</Button>
				</Flex>
			</Flex>
	)
}

const Product_Item=({product,search_query})=>{
	let query_highlight = search_query.toLowerCase();
	let industry_highlight = product.industry.toLowerCase();
	let technology_highlight = product.technology.toLowerCase();
	const router = useRouter()
	return(
		<Flex bg='#fff' borderLeft={product?.sponsored === true ?'4px solid gold': null} borderRadius={'0px'} justify='space-between' flex='' position='relative'>
			{product?.suspension_status? <Flex bg={product?.suspension_status? 'red': '#fff'} zIndex='' h='100%' w='100%' position='absolute' top='0' right='0' opacity='0.3' onClick={(()=>{router.push(`product/${product?._id}`)})}/>: null}
			<Flex direction='column' p='2'>
				<Text fontSize='16px' fontFamily='ClearSans-Bold' color='#009393'>{product.name_of_product}</Text>
				<Text fontSize='14px'>{product.distributed_by}</Text>
				<Flex gap='2' fontSize='10px' color='grey' align='center'>
					<Text bg={query_highlight === industry_highlight? '#009393':null} color={query_highlight === industry_highlight? '#fff':'grey'} p={query_highlight === industry_highlight? '1':null}>{product.industry? product.industry : '-'}</Text>
					<Text borderLeft='1px solid grey' paddingLeft='2' bg={query_highlight === technology_highlight? '#009393':null} color={query_highlight === technology_highlight? '#fff':'grey'} p={query_highlight === technology_highlight? '1':null}>{product.technology? product.technology : '-'}</Text>
				</Flex>
			</Flex>
			<Flex direction='column' justify='space-around' p='2' textAlign='center'>
				{product?.sponsored ? 
					<Flex bg='#fff' p='1' borderRadius='5' cursor='pointer' boxShadow='lg' align='center'>
						<Text fontWeight='bold' >Featured</Text>
						<VerifiedIcon style={{color:'gold'}}/>
					</Flex>
					:
					<Text fontWeight='bold' >Not Featured</Text>				
				}
				<Text fontWeight='bold' color='#fff' bg='#009393' p='1' borderRadius='5' boxShadow='lg' cursor='pointer' onClick={(()=>{router.push(`product/${product?._id}`)})}>View</Text>
			</Flex>
		</Flex>
	)
}