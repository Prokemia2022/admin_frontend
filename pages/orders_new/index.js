import React, { useEffect, useState } from "react";
import {
    Text, 
    Box, 
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
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
    Avatar,
    Tabs,
    Tab,
    TabList,
    TabIndicator,
    Divider,
    IconButton
} from '@chakra-ui/react';
import Navigation from '../../components/Navigation';
//utils
import {useRouter} from 'next/router';
import moment from "moment";
//icons
import TuneIcon from '@mui/icons-material/Tune';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
//apis
import Get_SalesPeople from '../api/salespeople/get_salespeople.js';
import Get_Orders from '../api/orders/get_orders.js';

import styles from '../../styles/Inventory.module.css'

export default function Orders(){
    return(
        <Navigation >
            <Body/>
        </Navigation>
    )
}

const Body=()=>{
    const router = useRouter();
    const [orders_data,set_orders]=useState([]);

    const [all_orders_data,set_all_orders_data]=useState(0);
    const [completed_orders_data,set_completed_orders_data]=useState(0);
    const [pending_orders_data,set_pending_orders_data]=useState(0);
    const [rejected_orders_data,set_rejected_orders_data]=useState(0);

    const [fromDate,set_fromDate]=useState('');
	const [toDate,set_toDate]=useState(moment(new Date()).format("YYYY-MM-DD"));
	const [search_query,set_search_query] = useState('');

	const [is_fetching,set_is_fetching]=useState(false);


    const [sort_value,set_sort_value]=useState('desc');
    const [status_query,set_status_query] = useState('');

    useEffect(()=>{
        Fetch_Data()
		
	},[search_query,sort_value,status_query,fromDate,toDate]);
    //
    const Fetch_Data=async()=>{
        await Get_Orders().then((response)=>{
            set_is_fetching(true)
			//console.log(response.data)
			const data = response.data;
            set_all_orders_data(data?.length)
			const res_data = data?.filter((item) => item?.order_status.toLowerCase().includes(status_query.toLowerCase()));

            let completed_orders = data?.filter((item) => item?.order_status.toLowerCase().includes('completed'))
            set_completed_orders_data(completed_orders?.length)

            let pending_orders = data?.filter((item) => item?.order_status.toLowerCase().includes('pending'))
            set_pending_orders_data(pending_orders?.length)

            let rejected_orders = data?.filter((item) => item?.order_status.toLowerCase().includes('rejected'))
            set_rejected_orders_data(rejected_orders?.length)

			const result_data = res_data?.filter((item) => 	item?.name_of_client.toLowerCase().includes(search_query.toLowerCase()) ||
															item?.company_name_of_client.toLowerCase().includes(search_query.toLowerCase()) ||
															item?.creator_name.toLowerCase().includes(search_query.toLowerCase()) ||
															item?.name_of_product.toLowerCase().includes(search_query.toLowerCase()) ||
															item?.email_of_creator.toLowerCase().includes(search_query.toLowerCase()) || 
															item?._id.includes(search_query.toLowerCase()))
			if (sort_value == 'desc'){
				const sorted_result = result_data.sort((a, b) => a.company_name_of_client.localeCompare(b.company_name_of_client))	
				set_orders(sorted_result)
			}else if(sort_value == 'asc'){
				const sorted_result = result_data.sort((a, b) => b.company_name_of_client.localeCompare(a.company_name_of_client))
				set_orders(sorted_result)
			}
            //filter with date
			if (fromDate !== '' && toDate !== ''){
				//console.log(fromDate,toDate)
				let filtered_by_date = result_data?.filter((item)=>{
					return new Date(item?.createdAt).getTime() >= new Date(fromDate).getTime() && new Date(item?.createdAt).getTime() <= new Date(toDate).getTime()
				});
				//console.log(filtered_by_date)
				set_orders(filtered_by_date);
			}else{
				set_orders(result_data)
			}
		}).then(()=>{
            setTimeout(()=>{
                set_is_fetching(false)
            },3000);
            return ;
        })
    }
	//functions
    const Clear_Filter=()=>{
        set_sort_value('desc');
        set_status_query('');
        set_fromDate('');
		set_toDate(moment(new Date()).format("YYYY-MM-DD"))
    }
    return (
        <Box gap='2'>
            <HStack justifyContent={'space-between'}>
                <Breadcrumb spacing='5px' alignItems={'center'} fontSize={'sm'} fontWeight={'semibold'}>
                    <BreadcrumbItem>
                        <BreadcrumbLink href='/dashboard_new'>Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem isCurrentPage>
                        <BreadcrumbLink>orders</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
            </HStack>
            <Box gap='2' bg='#fff' borderRadius={5} p='4' mt='4'>
                <Tabs mb='2' className={styles.products_container} position="relative" variant='enclosed' size='md'  overflowX={'scroll'} overscroll={''}>
                    <TabList >
                        <Tab _selected={{ bg: 'gray.100' }} onClick={Clear_Filter}>
                            All
                            <Tag bg='gray.600' color='#fff' ml='2'>
                                {all_orders_data}
                            </Tag>
                        </Tab>
                        <Tab _selected={{ bg: 'green.100' }} onClick={(()=>{set_status_query('completed')})}>
                            Completed
                            <Tag bg='gray.100' ml='2'>
                                {completed_orders_data}
                            </Tag>
                        </Tab>
                        <Tab _selected={{ bg: 'gray.400' }} onClick={(()=>{set_status_query('pending')})}>
                            Pending
                            <Tag bg='gray.100' ml='2'>
                                {pending_orders_data}
                            </Tag>
                        </Tab>
                        <Tab _selected={{ bg: 'red.100' }} onClick={(()=>{set_status_query('rejected')})}>
                            Rejected
                            <Tag bg='gray.100' ml='2'>
                                {rejected_orders_data}
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
                <Divider/>
                <SimpleGrid minChildWidth='250px' spacing='20px' mt='4' bg='#fff' p='2' borderRadius='lg' alignItems='end'>
                    <Box>
                        <Text>From date</Text>
                        <Input value={fromDate} placeholder="Select Date and Time" size="md" type="datetime-local"  onChange={((e)=>{set_fromDate(e.target.value)})}/>
                    </Box>
                    <Box>
                        <Text>To date</Text>
                        <Input value={toDate} placeholder="Select Date and Time" size="md" type="datetime-local" onChange={((e)=>{set_toDate(e.target.value)})}/>
                    </Box>
                    <InputGroup flex='1'>
                        <InputLeftElement pointerEvents='none' color='gray' alignItems={'center'}>
                            <SearchIcon style={{marginTop:'8px'}} />
                        </InputLeftElement>
                        <Input type='text' placeholder='Search...' size="md" onChange={((e)=>{set_search_query(e.target.value)})}/>
                        {is_fetching? 
                            <InputRightElement>
                                <CircularProgress isIndeterminate color='gray' size={'20px'} />
                            </InputRightElement>
                            :
                            null
                        }
                    </InputGroup>
                </SimpleGrid>
                <Flex gap='2'>
                    {fromDate !== ''? 
                        <Flex mt='2' gap='1' border={'1px'} borderStyle={'dashed'} borderColor={'gray.200'} borderRadius={5} p='2'>
                            <Text fontWeight={'semibold'} fontSize={'sm'}>
                                from:
                            </Text>
                            <Tag
                                size={'md'}
                                borderRadius='md'
                                variant='subtle'
                                bg='black'
                                color={'#fff'}
                                onClick={(()=>{set_fromDate('')})}
                            >
                                <TagLabel>{fromDate}</TagLabel>
                                <TagCloseButton />
                            </Tag>
                        </Flex>
                        : 
                        null
                    }
                    {fromDate !== ''?
                        <Tag my='1' onClick={Clear_Filter} size='lg' gap='1' _hover={{bg:'red.100'}} bg='gray:200' color='red' borderRadius='md' cursor={'pointer'}>
                            <DeleteSweepIcon/>
                            <TagLabel>clear</TagLabel>
                        </Tag>
                        :
                        null
                    }
                </Flex>
                <TableContainer bg='#fff' mt='4' borderRadius={5}>
                    <Table variant='simple'>
                        <Thead bg='#eee' borderRadius={'5'}>
                            <Tr>
                                <Th>Name of product</Th>
                                <Th>Sold by</Th>
                                <Th>Company name</Th>
                                <Th>Amount</Th>
                                <Th>status</Th>
                                <Th>Created</Th>
                                <Th>Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {orders_data?.map((item)=>{
                                return(
                                    <Tr key={item?._id} align={'center'} fontWeight={'regular'}>
                                        <Td>{item?.name_of_product}</Td>
                                        <Td>{item?.creator_name}</Td>
                                        <Td>{item.company_name_of_client? item.company_name_of_client : '-'}</Td>
                                        <Td>{item.total? item.total : '-'}</Td>
                                        <Td>
                                            <Badge variant='subtle' colorScheme={item?.order_status === 'completed' ? 'green':'orange'}>
                                                {item.order_status? item.order_status : '-'}
                                            </Badge>
                                        </Td>
                                        <Td>{moment( item?.createdAt).format("MMM Do YY")}</Td>
                                        <Td>
                                        <Menu >
                                            <MenuButton >
                                                <MoreVertIcon/>
                                            </MenuButton>
                                            <MenuList>
                                                <MenuItem onClick={(()=>{router.push(`orders_new/order/${item?._id}`)})}>View</MenuItem>
                                                
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