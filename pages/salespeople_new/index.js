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

import styles from '../../styles/Inventory.module.css'

export default function SalespeoplePage(){
    return(
        <Navigation >
            <Body/>
        </Navigation>
    )
}

const Body=()=>{
    const router = useRouter();
    const [salespeople_data, set_salespeople_data]=useState([]);

    const [all_salespeople_data,set_all_salespeople_data]=useState(0);
    const [active_salespeople_data,set_active_salespeople_data]=useState(0);
    const [pending_approval_salespeople_data,set_pending_approval_salespeople_data]=useState(0);
    const [suspended_salespeople_data,set_suspended_salespeople_data]=useState(0);
    const [open_to_consult_salespeople_data,set_open_to_consult_salespeople_data]=useState(0);

	const [suspension_status,set_suspension_status] = useState('all');
	const [search_query,set_search_query] = useState('');
	const [sort,set_sort]=useState('desc');

	const [is_fetching,set_is_fetching]=useState(null);

	const handle_get_salespeople=async()=>{
		await Get_SalesPeople().then((response)=>{
			set_is_fetching(true);
			const data = response.data
			//console.log(data)
            const stats_data = (data)=>{
				const result = data.filter((item) => item?.email_of_salesperson.toLowerCase());
                const get_total_salespeople = result?.length;
                set_all_salespeople_data(get_total_salespeople);

                const get_total_active_salespeople = result?.filter((item) => !item.suspension_status);
                set_active_salespeople_data(get_total_active_salespeople?.length);

                const get_total_suspended_salespeople = result?.filter((item) => item.suspension_status);
                set_suspended_salespeople_data(get_total_suspended_salespeople?.length);

                const get_total_pending_approval_salespeople = result?.filter(v => !v.verification_status)
                set_pending_approval_salespeople_data(get_total_pending_approval_salespeople?.length);

                const get_total_open_to_consult_salespeople = result?.filter(v => v.open_to_consultancy)
                set_open_to_consult_salespeople_data(get_total_open_to_consult_salespeople?.length);
			}
            stats_data(data);
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
			}else if(sort == 'open to consult'){
                const filtered_result = data?.filter((item) => item.open_to_consultancy)
                const sorted_result = filtered_result.sort((a, b) => b.first_name.localeCompare(a.first_name))
                set_salespeople_data(sorted_result);
            }else if(sort == 'pending approval'){
                const filtered_result = data?.filter((v) => !v.verification_status)
                const sorted_result = filtered_result.sort((a, b) => b.first_name.localeCompare(a.first_name))
                set_salespeople_data(sorted_result);
            }else if(sort == 'active'){
                const filtered_result = data?.filter((v) => v.verification_status)
                const filtered_result_active = filtered_result?.filter((v) => !v.suspension_status)
                const sorted_result = filtered_result_active.sort((a, b) => b.first_name.localeCompare(a.first_name))
                set_salespeople_data(sorted_result);
            }else{
				const sorted_result = data.sort((a, b) => b.first_name.localeCompare(a.first_name))
				if (suspension_status === 'suspended'){
					const sorted_result_data = sorted_result?.filter((item) => item.suspension_status)
					let queried_result = queried_data(sorted_result_data);
					set_salespeople_data(queried_result)
				}else if(suspension_status === 'not suspended' && sort !== 'open to consult'){
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
    const Clear_Filter=()=>{
        set_suspension_status('all');
        set_sort('')
    }
	//useEffect
	useEffect(()=>{
		handle_get_salespeople()
	},[suspension_status,search_query,sort])
    return (
        <Box gap='2'>
            <HStack justifyContent={'space-between'}>
                <Breadcrumb spacing='5px' alignItems={'center'} fontSize={'sm'} fontWeight={'semibold'}>
                    <BreadcrumbItem>
                        <BreadcrumbLink href='/dashboard_new'>Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem isCurrentPage>
                        <BreadcrumbLink>salespeople</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
            </HStack>
            <Box gap='2' bg='#fff' borderRadius={5} p='4' mt='4'>
                <Tabs className={styles.products_container} position="relative" variant='enclosed' size='md'  overflowX={'scroll'} overscroll={''}>
                    <TabList >
                        <Tab _selected={{ bg: 'gray.100' }} onClick={Clear_Filter}>
                            All
                            <Tag bg='gray.600' color='#fff' ml='2'>
                                {all_salespeople_data}
                            </Tag>
                        </Tab>
                        <Tab _selected={{ bg: 'green.100' }} onClick={(()=>{set_sort('active')})}>
                            Active
                            <Tag bg='gray.100' ml='2'>
                                {active_salespeople_data}
                            </Tag>
                        </Tab>
                        <Tab _selected={{ bg: 'gray.400' }} onClick={(()=>{set_sort('pending approval')})}>
                            Pending approval
                            <Tag bg='gray.100' ml='2'>
                                {pending_approval_salespeople_data}
                            </Tag>
                        </Tab>
                        <Tab _selected={{ bg: 'blue.100' }} onClick={(()=>{set_sort('open to consult')})}>
                            Open to consult
                            <Tag bg='gray.100' ml='2'>
                                {open_to_consult_salespeople_data}
                            </Tag>
                        </Tab>
                        <Tab _selected={{ bg: 'red.100' }} onClick={(()=>{set_suspension_status('suspended')})}>
                            Suspended
                            <Tag bg='gray.100' ml='2'>
                                {suspended_salespeople_data}
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
                                <Th >Company name</Th>
                                <Th >Consultancy</Th>
                                <Th >
                                    <Flex align={'center'}>
                                        <Text>
                                            status
                                        </Text>
                                        {suspension_status === 'suspended'?
                                            <CheckBoxIcon onClick={(()=>{set_suspension_status('not suspended')})}/>
                                        :
                                            <CheckBoxOutlineBlankIcon onClick={(()=>{set_suspension_status('suspended')})}/>
                                        }
                                    </Flex>
                                </Th>
                                <Th>Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {salespeople_data?.map((item)=>{
                                return(
                                    <Tr key={item?._id} bg={!item?.verification_status? 'gray.100':'none'} align={'center'} fontWeight={'regular'}>
                                        <Td>
                                            <HStack>
                                                <Avatar name={item?.first_name} src={item?.profile_photo_url} />
                                                <Box>
                                                    <Text>
                                                        {item?.first_name}{item?.last_name}
                                                    </Text>
                                                    <Text fontSize={'sm'} color='gray.400' fontWeight={''}>
                                                        {item?.email_of_salesperson}
                                                    </Text>
                                                </Box>
                                            </HStack>
                                        </Td>
                                        <Td>{item.mobile_of_salesperson? item.mobile_of_salesperson : '-'}</Td>
                                        <Td>{item.company_name? item.company_name : '-'}</Td>
                                        <Td>
                                            <Badge variant='subtle' bg={item?.open_to_consultancy? 'blue.200':'orange.200'} borderRadius={'md'}>
                                                {item?.open_to_consultancy? 'Open':'closed'}
                                            </Badge>
                                        </Td>
                                        <Td>
                                            {!item?.verification_status?
                                                <Badge variant='subtle' bg={'gray.400'} borderRadius={'md'}>
                                                    not approved
                                                </Badge>
                                                :
                                                <Badge variant='subtle' bg={!item?.suspension_status? 'green.200':'red.200'} borderRadius={'md'}>
                                                    {!item?.suspension_status? 'Active':'suspended'}
                                                </Badge>
                                            }
                                        </Td>
                                        <Td>
                                        <Menu >
                                            <MenuButton >
                                                <MoreVertIcon/>
                                            </MenuButton>
                                            <MenuList>
                                                <MenuItem onClick={(()=>{router.push(`salespeople_new/client/${item?._id}`)})}>View</MenuItem>
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