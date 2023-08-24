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
import Get_SalesPeople from '../api/salespeople/get_salespeople.js';
import Get_Clients from '../api/clients/get_clients.js';

import styles from '../../styles/Inventory.module.css'

export default function CustomersPage(){
    return(
        <Navigation >
            <Body/>
        </Navigation>
    )
}

const Body=()=>{
    const router = useRouter();
    const [salespeople_data, set_salespeople_data]=useState([]);
    const [clients_data, set_clients_data] = useState([]);

    const [all_customers_data,set_all_customers_data]=useState(0);
    const [active_customers_data,set_active_customers_data]=useState(0);
    const [email_pending_approval_customers_data,set_email_pending_approval_customers_data]=useState(0);
    const [suspended_customers_data,set_suspended_customers_data]=useState(0);

	const [suspension_status,set_suspension_status] = useState('all');
	const [search_query,set_search_query] = useState('');
	const [sort,set_sort]=useState('desc');

	const [is_fetching,set_is_fetching]=useState(null);

	const handle_get_clients=async()=>{
		await Get_Clients().then((response)=>{
			set_is_fetching(true);
			const data = response.data
			//console.log(data)
            const stats_data = (data)=>{
				const result = data.filter((item) => item?.email_of_company.toLowerCase());
                const get_total_customers = data?.length;
                set_all_customers_data(get_total_customers);

                const get_total_active_customers = data?.filter((item) => !item.suspension_status);
                set_active_customers_data(get_total_active_customers?.length);

                const get_total_suspended_customers = data?.filter((item) => item.suspension_status);
                set_suspended_customers_data(get_total_suspended_customers?.length);

                const get_total_pending_email_approval_customers = data?.filter(v => !v.valid_email_status);
                set_email_pending_approval_customers_data(get_total_pending_email_approval_customers?.length);
			}
            stats_data(data);
			const queried_data = (sorted_result_data)=>{
				const result = sorted_result_data.filter((item) => 
                    item?.email_of_company.toLowerCase().includes(search_query.toLowerCase()) ||
					item?.company_name.toLowerCase().includes(search_query.toLowerCase()) ||
					item?.first_name.toLowerCase().includes(search_query.toLowerCase()) ||
                    item?.position.toLowerCase().includes(search_query.toLowerCase()) ||
					item?.last_name.toLowerCase().includes(search_query.toLowerCase()));
				return result;
			}
			if (sort === 'desc'){
				const sorted_result = data.sort((a, b) => a.first_name.localeCompare(b.first_name))
				//console.log(sorted_result)
				if (suspension_status === 'suspended'){
					const sorted_result_data = sorted_result?.filter((item) => item.suspension_status)
					let queried_result = queried_data(sorted_result_data);
					set_clients_data(queried_result)
				}else if(suspension_status === 'not suspended'){
					const sorted_result_data = sorted_result?.filter((item) => !item.suspension_status)
					let queried_result = queried_data(sorted_result_data);
					set_clients_data(queried_result)
				}else{
					let queried_result = queried_data(sorted_result);
					set_clients_data(queried_result)
				}
			}else if(sort == 'pending email approval'){
                const filtered_result = data?.filter((v) => !v.valid_email_status)
                const sorted_result = filtered_result.sort((a, b) => b.first_name.localeCompare(a.first_name))
                set_clients_data(sorted_result);
            }else if(sort == 'active'){
                const filtered_result = data?.filter((v) => v.valid_email_status)
                const filtered_result_active = filtered_result?.filter((v) => !v.suspension_status)
                const sorted_result = filtered_result_active.sort((a, b) => b.first_name.localeCompare(a.first_name))
                set_clients_data(sorted_result);
            }else{
				const sorted_result = data.sort((a, b) => b.first_name.localeCompare(a.first_name))
				if (suspension_status === 'suspended'){
					const sorted_result_data = sorted_result?.filter((item) => item.suspension_status)
					let queried_result = queried_data(sorted_result_data);
					set_clients_data(queried_result)
				}else if(suspension_status === 'not suspended' && sort !== 'pending email approval'){
					const sorted_result_data = sorted_result?.filter((item) => !item.suspension_status)
					let queried_result = queried_data(sorted_result_data);
					set_clients_data(queried_result)
				}else{
					let queried_result = queried_data(sorted_result);
					set_clients_data(queried_result)
				}
			}
		}).catch((err)=>{
			set_clients_data([])
		}).finally(()=>{
			set_is_fetching(false);
		})
	}
	//functions
    const Clear_Filter=()=>{
        set_suspension_status('all');
        set_sort('')
    }
	//useEffect
	useEffect(()=>{
		handle_get_clients()
	},[suspension_status,search_query,sort])
    return (
        <Box gap='2'>
            <HStack justifyContent={'space-between'}>
                <Breadcrumb spacing='5px' alignItems={'center'} fontSize={'sm'} fontWeight={'semibold'}>
                    <BreadcrumbItem>
                        <BreadcrumbLink href='/dashboard_new'>Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem isCurrentPage>
                        <BreadcrumbLink>customers</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
            </HStack>
            <Box gap='2' bg='#fff' borderRadius={5} p='4' mt='4'>
                <Tabs className={styles.products_container} position="relative" variant='enclosed' size='md'  overflowX={'scroll'} overscroll={''}>
                    <TabList >
                        <Tab _selected={{ bg: 'gray.100' }} onClick={Clear_Filter}>
                            All
                            <Tag bg='gray.600' color='#fff' ml='2'>
                                {all_customers_data}
                            </Tag>
                        </Tab>
                        <Tab _selected={{ bg: 'green.100' }} onClick={(()=>{set_sort('')})}>
                            Active
                            <Tag bg='gray.100' ml='2'>
                                {active_customers_data}
                            </Tag>
                        </Tab>
                        <Tab _selected={{ bg: 'gray.400' }} onClick={(()=>{set_sort('pending email approval')})}>
                            Pending email approval
                            <Tag bg='gray.100' ml='2'>
                                {email_pending_approval_customers_data}
                            </Tag>
                        </Tab>
                        <Tab _selected={{ bg: 'red.100' }} onClick={(()=>{set_suspension_status('suspended')})}>
                            Suspended
                            <Tag bg='gray.100' ml='2'>
                                {suspended_customers_data}
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
                <TableContainer bg='#fff' mt='4' borderRadius={5}>
                    <Table variant='simple'>
                        <Thead bg='#eee' borderRadius={'5'}>
                            <Tr>
                                <Th >
                                    <Flex align={'center'}>
                                        <Text>
                                            Name
                                        </Text>
                                        {sort == 'asc'?
                                            <ArrowUpwardIcon onClick={(()=>{set_sort('desc')})} style={{fontSize:'20px',cursor:'pointer'}}/>
                                        :
                                            <ArrowDownwardIcon onClick={(()=>{set_sort('asc')})} style={{fontSize:'20px',cursor:'pointer'}}/>
                                        }
                                    </Flex>
                                </Th>
                                <Th>Phone number</Th>
                                <Th>Company name</Th>
                                <Th>valid email</Th>
                                <Th>status</Th>
                                <Th>Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {clients_data?.map((item)=>{
                                return(
                                    <Tr key={item?._id} bg={!item?.valid_email_status? 'gray.100':'none'} align={'center'} fontWeight={'regular'}>
                                        <Td>
                                            <HStack>
                                                <Avatar name={item?.first_name} src={item?.profile_photo_url} />
                                                <Box>
                                                    <Text>
                                                        {item?.first_name}{item?.last_name}
                                                    </Text>
                                                    <Text fontSize={'sm'} color='gray.400' fontWeight={''}>
                                                        {item?.email_of_company}
                                                    </Text>
                                                </Box>
                                            </HStack>
                                        </Td>
                                        <Td>{item.mobile_of_company? item.mobile_of_company : '-'}</Td>
                                        <Td>{item.company_name? item.company_name : '-'}</Td>
                                        <Td>
                                            <Badge variant='subtle' bg={item?.valid_email_status? 'blue.200':'orange.200'} borderRadius={'md'}>
                                                {item?.valid_email_status? 'valid':'not valid'}
                                            </Badge>
                                        </Td>
                                        <Td>
                                            <Badge variant='subtle' bg={!item?.suspension_status? 'green.200':'red.200'} borderRadius={'md'}>
                                                {!item?.suspension_status? 'Active':'suspended'}
                                            </Badge>
                                        </Td>
                                        <Td>
                                            <Menu >
                                                <MenuButton >
                                                    <MoreVertIcon/>
                                                </MenuButton>
                                                <MenuList>
                                                    <MenuItem onClick={(()=>{router.push(`customers_new/client/${item?._id}`)})}>View</MenuItem>
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