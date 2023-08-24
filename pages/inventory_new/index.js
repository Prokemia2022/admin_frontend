import React, { useEffect, useState } from "react";
import {
    Text, 
    Box, 
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    TableContainer,
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
    Badge,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button,
    HStack,
    Input,
    InputGroup,
    InputLeftElement,
    SimpleGrid,
    Select,
    InputRightElement,
    CircularProgress,
    Tag,
    TagLabel,
    TagCloseButton,
    Grid,
    Flex,
    Wrap,
    Tabs,
    TabList,
    Tab,
    TabIndicator
} from '@chakra-ui/react';
import Navigation from '../../components/Navigation';
//utils
import {useRouter} from 'next/router';
//icons
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
//apis
import Get_Products from '../api/Products/get_products.js'
import Get_Industries from '../api/controls/get_industries';
import Get_Technologies from '../api/controls/get_technologies';

import styles from '../../styles/Inventory.module.css'
import moment from "moment";

export default function Inventory(){
    return(
        <Navigation >
            <Body/>
        </Navigation>
    )
}

const Body=()=>{
    const router = useRouter();
    const [products,set_products]=useState([]);

	const [search_query,set_search_query] = useState('');
	const debounce_search_value = useDebounceValue(search_query);

	const [industry,set_industry] = useState('');
	const [technology,set_technology] = useState('');
	const [sort,set_sort]=useState('');
	const [featured_status,set_featured_status]=useState(false);
    const [approved_status,set_approved_status]=useState(false);

	let [is_fetching,set_is_fetching]=useState(false);

	const [industries_data, set_industries_data]=useState([]);
	const [technologies_data, set_technologies_data]=useState([]);
    
    useEffect(()=>{
        set_is_fetching(true);
		Fetch_Products_Data();
        setTimeout(()=>{
            set_is_fetching(false)
        },3000)
	},[debounce_search_value,industry,technology,sort,featured_status,approved_status]);

    useEffect(()=>{
		get_Industries_Data()
		get_Technology_Data()
	},[]);

    const filter_industries=(data)=>{
		//console.log(data)
		return data?.filter((item) => item?.industry.toLowerCase().includes(industry.toLowerCase()))
	}
	const filter_technologies=(data)=>{
		//console.log(data)
		return data?.filter((item) => item?.technology.toLowerCase().includes(technology.toLowerCase()))
	}
    const [all_products_data,set_all_products_data]=useState(0);
    const [pending_approval_products_data,set_pending_approval_products_data]=useState(0);
    const [featured_products_data,set_featured_products_data]=useState(0);

    const Fetch_Products_Data=async()=>{
		await Get_Products().then((response)=>{
			const data = response?.data;
            //console.log(data)
            const stats_data = (data)=>{
                const get_total_products = data?.length;
                set_all_products_data(get_total_products);

                const get_total_pending_approval_products = data?.filter(v => !v.verification_status)
                set_pending_approval_products_data(get_total_pending_approval_products?.length);

                const get_total_featured_products = data?.filter(v => v.sponsored)
                set_featured_products_data(get_total_featured_products?.length);
			}
            stats_data(data)
			//Multi-filter Functions
            if (industry == '' && technology == '' && !featured_status && !approved_status && sort == '' && search_query == ''){
                //console.log(data)
                set_products(data)
                return ;
            }else{
                //console.log(debounce_search_value)
                const queried_data = (data)=>{
                    //console.log(debounce_search_value)
                    const result = data?.filter((item) => item?.email_of_lister.toLowerCase().includes(debounce_search_value.toLowerCase()) ||
                                    item?.name_of_product.toLowerCase().includes(debounce_search_value.toLowerCase()) ||
                                    item?.brand.toLowerCase().includes(debounce_search_value.toLowerCase()) ||
                                    item?.function.toLowerCase().includes(debounce_search_value.toLowerCase()) ||
                                    item?.chemical_name.toLowerCase().includes(debounce_search_value.toLowerCase()) ||
                                    item?.features_of_product.toLowerCase().includes(debounce_search_value.toLowerCase()) ||
                                    item?.manufactured_by.toLowerCase().includes(debounce_search_value.toLowerCase()) ||
                                    item?.distributed_by.toLowerCase().includes(debounce_search_value.toLowerCase()) ||
                                    item?.description_of_product.toLowerCase().includes(debounce_search_value.toLowerCase()))
                    //console.log(result)
                    return result;
                }
                if (sort === 'desc'){
                    const sorted_result = data?.sort((a, b) => a.name_of_product.localeCompare(b.name_of_product))
                    //console.log(sorted_result)
                    if (featured_status){
                        const result_data = sorted_result?.filter((item) => item.sponsored)
                        if(industry){
                            let industry_result = filter_industries(result_data);
                            if(technology){
                                let technology_result = filter_technologies(industry_result);
                                let queried_result = queried_data(technology_result);
                                set_products(queried_result)
                            }else{
                                let queried_result = queried_data(industry_result);
                                set_products(queried_result)
                            }
                        }else{
                            if(technology){
                                let technology_result = filter_technologies(result_data);
                                let queried_result = queried_data(technology_result);
                                set_products(queried_result)
                            }else{
                                let queried_result = queried_data(result_data);
                                set_products(queried_result)
                            }
                        }
                    }else if(approved_status){
                        const result_data = sorted_result?.filter((item) => !item.verification_status)
                        if(industry){
                            let industry_result = filter_industries(result_data);
                            if(technology){
                                let technology_result = filter_technologies(industry_result);
                                let queried_result = queried_data(technology_result);
                                set_products(queried_result)
                            }else{
                                let queried_result = queried_data(industry_result);
                                set_products(queried_result)
                            }
                        }else{
                            if(technology){
                                let technology_result = filter_technologies(result_data);
                                let queried_result = queried_data(technology_result);
                                set_products(queried_result)
                            }else{
                                let queried_result = queried_data(result_data);
                                set_products(queried_result)
                            }
                        }
                    }else{
                        if(industry){
                            let industry_result = filter_industries(sorted_result);
                            if(technology){
                                let technology_result = filter_technologies(industry_result);
                                let queried_result = queried_data(technology_result);
                                set_products(queried_result)
                            }else{
                                let queried_result = queried_data(industry_result);
                                set_products(queried_result)
                            }
                        }else{
                            if(technology){
                                let technology_result = filter_technologies(result_data);
                                let queried_result = queried_data(technology_result);
                                set_products(queried_result)
                            }else{
                                let queried_result = queried_data(result_data);
                                set_products(queried_result)
                            }
                        }
                    }
                }else{
                    const sorted_result = data?.sort((a, b) => b.name_of_product.localeCompare(a.name_of_product))
                    //console.log(sorted_result)
                    if (featured_status){
                        const result_data = sorted_result?.filter((item) => item.sponsored)
                        if(industry){
                            let industry_result = filter_industries(result_data);
                            if(technology){
                                let technology_result = filter_technologies(industry_result);
                                let queried_result = queried_data(technology_result);
                                set_products(queried_result)
                            }else{
                                let queried_result = queried_data(industry_result);
                                set_products(queried_result)
                            }
                        }else{
                            if(technology){
                                let technology_result = filter_technologies(result_data);
                                let queried_result = queried_data(technology_result);
                                set_products(queried_result)
                            }else{
                                let queried_result = queried_data(result_data);
                                set_products(queried_result)
                            }
                        }
                    }else if(approved_status){
                        const result_data = sorted_result?.filter((item) => !item.verification_status)
                        if(industry){
                            let industry_result = filter_industries(result_data);
                            if(technology){
                                let technology_result = filter_technologies(industry_result);
                                let queried_result = queried_data(technology_result);
                                set_products(queried_result)
                            }else{
                                let queried_result = queried_data(industry_result);
                                set_products(queried_result)
                            }
                        }else{
                            if(technology){
                                let technology_result = filter_technologies(result_data);
                                let queried_result = queried_data(technology_result);
                                set_products(queried_result)
                            }else{
                                let queried_result = queried_data(result_data);
                                set_products(queried_result)
                            }
                        }
                    }else{
                        if(industry){
                            let industry_result = filter_industries(sorted_result);
                            if(technology){
                                let technology_result = filter_technologies(industry_result);
                                let queried_result = queried_data(technology_result);
                                set_products(queried_result)
                            }else{
                                let queried_result = queried_data(industry_result);
                                set_products(queried_result)
                            }
                        }else{
                            if(technology){
                                let technology_result = filter_technologies(result_data);
                                let queried_result = queried_data(technology_result);
                                set_products(queried_result)
                            }else{
                                let queried_result = queried_data(data);
                                set_products(queried_result)
                            }
                        }
                    }
                }
            }
		}).catch((err)=>{
			return ;
		})
	}

    const get_Industries_Data=async()=>{
		await Get_Industries().then((response)=>{
			////console.log(response.data)
			const data = response.data
			const result = data.filter(v => v.verification_status)
			////console.log(data.filter(v => v.verification_status))
			set_industries_data(result.sort((a, b) => a.title.localeCompare(b.title)))
		})
	}
	const get_Technology_Data=async()=>{
		await Get_Technologies().then((response)=>{
			////console.log(response.data)
			const data = response.data
			const result = data.filter(v => v.verification_status)
			////console.log(data.filter(v => v.verification_status))
			set_technologies_data(result.sort((a, b) => a.title.localeCompare(b.title)))
		})
	}

    const Clear_Filter_Options=()=>{
		set_sort('')
		set_search_query('');
		set_industry('');
		set_technology('');
        set_featured_status(false);
        set_approved_status(false)
	}

    return (
        <Box gap='2'>
            <HStack justifyContent={'space-between'}>
                <Breadcrumb spacing='5px' alignItems={'center'} fontSize={'sm'} fontWeight={'semibold'}>
                    <BreadcrumbItem>
                        <BreadcrumbLink href='/dashboard_new'>Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem isCurrentPage>
                        <BreadcrumbLink>inventory</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
                <Button colorScheme="teal" leftIcon={<AddIcon />} onClick={(()=>{router.push('/inventory_new/product/new')})}>New Product</Button>
            </HStack>
            <Box gap='2' bg='#fff' borderRadius={5} p='4' mt='2'>
                <Tabs className={styles.products_container} position="relative" variant='enclosed' size='md'  overflowX={'scroll'} overscroll={''}>
                    <TabList >
                        <Tab _selected={{ bg: 'gray.100' }} onClick={Clear_Filter_Options}>
                            All
                            <Tag bg='gray.600' color='#fff' ml='2'>
                                {all_products_data}
                            </Tag>
                        </Tab>
                        <Tab _selected={{ bg: 'gray.400' }} onClick={(()=>{set_approved_status(true)})}>
                            Pending approval
                            <Tag bg='gray.100' ml='2'>
                                {pending_approval_products_data}
                            </Tag>
                        </Tab>
                        <Tab _selected={{ bg: 'orange.100' }} onClick={(()=>{set_featured_status(true)})}>
                            Featured
                            <Tag bg='gray.100' ml='2'>
                                {featured_products_data}
                            </Tag>
                        </Tab>
                    </TabList>
                    <TabIndicator
                        mt="5px"
                        height="2px"
                        bg="teal.500"
                        borderRadius="1px"
                    />
                </Tabs>
                <SimpleGrid minChildWidth='250px' spacing='20px' mt='4'>
                    <Select value={industry} placeholder='Industry' size='lg' onChange={((e)=>{set_industry(e.target.value)})}>
                    {industries_data?.map((item)=>{
                        return(
                            <option key={item._id} value={item.title}>{item.title}</option>

                        )
                    })}
                    </Select>
                    <Select value={technology} placeholder='Technologies' size='lg' onChange={((e)=>{set_technology(e.target.value)})}>
                        {technologies_data?.map((item)=>{
                            return(
                                <option key={item._id} value={item.title}>{item.title}</option>
                            )
                        })}
                    </Select>
                    <InputGroup alignItems={'center'}>
                        <InputLeftElement pointerEvents='none' color='gray' alignItems={'center'}>
                            <SearchIcon style={{marginTop:'8px'}} />
                        </InputLeftElement>
                        <Input type='text' placeholder='Search...' size='lg' value={search_query} onChange={((e)=>{set_search_query(e.target.value)})}/>
                        {is_fetching? 
                            <InputRightElement>
                                <CircularProgress isIndeterminate color='gray' size={'20px'} />
                            </InputRightElement>
                            :
                            null
                        }
                    </InputGroup>
                </SimpleGrid>
                <Wrap align='center' spacing='20px' mt='4'>
                    <Flex fontSize={'sm'}>
                        <Text fontWeight='bold' color='gray.800'>{products.length}</Text>
                        <Text fontWeight='light' color='gray.400'>results found</Text>
                    </Flex>
                    {industry !== ''? 
                        <Flex gap='1' border={'1px'} borderStyle={'dashed'} borderColor={'gray.200'} borderRadius={5} p='2'>
                            <Text fontWeight={'semibold'} fontSize={'sm'}>
                                Industry:
                            </Text>
                            <Tag
                                size={'md'}
                                borderRadius='md'
                                variant='subtle'
                                bg='black'
                                color={'#fff'}
                                onClick={(()=>{set_industry('')})}
                            >
                                <TagLabel>{industry}</TagLabel>
                                <TagCloseButton />
                            </Tag>
                        </Flex>
						: 
						null
					}
                    
                    {technology !== ''? 
                        <Flex gap='1' border={'1px'} borderStyle={'dashed'} borderColor={'gray.200'} borderRadius={5} p='2'>
                            <Text fontWeight={'semibold'} fontSize={'sm'}>
                                Technology:
                            </Text>
                            <Tag
                                size={'md'}
                                borderRadius='md'
                                variant='subtle'
                                bg='black'
                                color={'#fff'}
                                onClick={(()=>{set_technology('')})}
                            >
                                <TagLabel>{technology}</TagLabel>
                                <TagCloseButton />
                            </Tag>
                        </Flex>
						: 
						null
					}
                    {search_query !== '' || industry !== '' || technology !== '' || sort !== ''? 
                        <Tag  onClick={Clear_Filter_Options} size='lg' gap='1' _hover={{bg:'red.100'}} bg='gray:200' color='red' borderRadius='md' cursor={'pointer'}>
                            <DeleteSweepIcon/>
                            <TagLabel>clear</TagLabel>
                        </Tag>
                        :
                        null
					}
                </Wrap>
                <TableContainer bg='#fff' mt='4' borderRadius={5}>
                    <Table variant='simple'>
                        <Thead bg='#eee' borderRadius={'5'}>
                            <Tr>
                                <Th >
                                    <Flex align={'center'}>
                                        <Text>
                                            Product
                                        </Text>
                                        {sort == 'asc'?
                                            <ArrowUpwardIcon onClick={(()=>{set_sort('desc')})} style={{fontSize:'20px',cursor:'pointer'}}/>
                                        :
                                            <ArrowDownwardIcon onClick={(()=>{set_sort('asc')})} style={{fontSize:'20px',cursor:'pointer'}}/>
                                        }
                                    </Flex>
                                </Th>
                                <Th>Distributed by</Th>
                                <Th>Industry</Th>
                                <Th >Technology</Th>
                                <Th >
                                    <Flex align={'center'}>
                                        <Text>
                                            Featured status
                                        </Text>
                                        {featured_status?
                                            <CheckBoxIcon onClick={(()=>{set_featured_status(false)})}/>
                                        :
                                            <CheckBoxOutlineBlankIcon onClick={(()=>{set_featured_status(true)})}/>
                                        }
                                    </Flex>
                                </Th>
                                <Th >Pending approval</Th>
                                <Th >Expiring</Th>
                                <Th>Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {products?.map((item)=>{
                                return(
                                    <Tr key={item?._id} bg={!item?.verification_status? 'gray.100':'none'} align={'center'} fontWeight={'regular'}>
                                        <Td 
                                            onClick={(()=>{router.push(`/inventory_new/product/${item?._id}`)})}
                                            color='#009393' 
                                            fontWeight={'semibold'}
                                            _hover={{
                                                textDecoration:'underline dotted',
                                                cursor:'pointer'
                                            }}
                                        >{item?.name_of_product}</Td>
                                        <Td>{item.distributed_by? item.distributed_by : '-'}</Td>
                                        <Td>{item.industry? item.industry : '-'}</Td>
                                        <Td>{item.technology? item.technology : '-'}</Td>
                                        <Td>
                                            <Badge variant='subtle' bg={item?.sponsored? 'green.200':'orange.200'}>
                                                {item?.sponsored? 'Featured':'not featured'}
                                            </Badge>
                                        </Td>
                                        <Td>
                                            <Badge variant='subtle' bg={item?.verification_status? 'green.200':'gray.300'}>
                                                {item?.verification_status? 'Approved':'not approved'}
                                            </Badge>
                                        </Td>
                                        <Td>
                                            <Badge variant='subtle' bg={item?.short_on_expiry? 'orange.200':''}>
                                                {item?.short_on_expiry_date ? moment( item?.short_on_expiry_date).format("MMM Do YY") : '-'}
                                            </Badge>
                                        </Td>
                                        <Td>
                                        <Menu >
                                            <MenuButton >
                                                <MoreVertIcon/>
                                            </MenuButton>
                                            <MenuList>
                                                <MenuItem onClick={(()=>{router.push(`/inventory_new/product/${item?._id}`)})}>View</MenuItem>
                                                
                                            </MenuList>
                                            </Menu>
                                        </Td>
                                    </Tr>)
                            })}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    )
}

const useDebounceValue=(value, time = 500)=>{
	const [debounceValue, setDebounceValue]=useState(value);

	useEffect(()=>{
		const timeout = setTimeout(()=>{
			setDebounceValue(value);
		}, time);

		return () => {
			clearTimeout(timeout);
		}
	},[value, time]);

	return debounceValue;
}