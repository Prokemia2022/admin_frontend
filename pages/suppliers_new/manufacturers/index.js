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
import Navigation from '../../../components/Navigation';
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
import Get_Manufacturers from '../../api/manufacturers/get_manufacturers.js';

import styles from '../../../styles/Inventory.module.css'
import moment from "moment";

export default function ManufacturersPage(){
    return(
        <Navigation >
            <Body/>
        </Navigation>
    )
}

const Body=()=>{
    const router = useRouter();
    const [manufacturers_data, set_manufacturers_data]=useState([]);

    const [all_manufacturers_data,set_all_manufacturers_data]=useState(0);
    const [active_manufacturers_data,set_active_manufacturers_data]=useState(0);
    const [pending_approval_manufacturers_data,set_pending_approval_manufacturers_data]=useState(0);
    const [suspended_manufacturers_data,set_suspended_manufacturers_data]=useState(0);
    const [subscribed_manufacturers_data,set_subscribed_manufacturers_data]=useState(0);

	const [suspension_status,set_suspension_status] = useState('');
    const [subscription_status,set_subscription_status] = useState('');
	const [search_query,set_search_query] = useState('');
	const [sort,set_sort]=useState('descending');

    const [fromDate,set_fromDate]=useState('');
	const [toDate,set_toDate]=useState(moment(new Date()).format("YYYY-MM-DD"));


	const [is_fetching,set_is_fetching]=useState(null);

    const [search_value,set_search_value]=useState('');
	const debounce_search_value = useDebounceValue(search_value);

    const Clear_Filter_Options=()=>{
		set_sort('descending');
		set_search_query('');
		set_suspension_status('all')
		set_subscription_status('')
	}

	const handle_get_manufacturers=async()=>{
		await Get_Manufacturers().then((response)=>{
			set_is_fetching(true);
			//console.log(response.data)
			const data = response.data;
            const stats_data = (data)=>{
                const get_total_manufacturers = data?.length;
                set_all_manufacturers_data(get_total_manufacturers);

                const get_total_active_manufacturers = data?.filter((item) => !item.suspension_status);
                set_active_manufacturers_data(get_total_active_manufacturers?.length);

                const get_total_suspended_manufacturers = data?.filter((item) => item.suspension_status);
                set_suspended_manufacturers_data(get_total_suspended_manufacturers?.length);

                const get_total_pending_approval_manufacturers = data?.filter(v => !v.verification_status)
                set_pending_approval_manufacturers_data(get_total_pending_approval_manufacturers?.length);

                const get_total_subscribed_manufacturers = data?.filter(v => v.subscription)
                set_subscribed_manufacturers_data(get_total_subscribed_manufacturers?.length);
			}
            stats_data(data);
			const sorted_data =(result)=>{
				switch (sort){
					case 'descending':
						return result.sort((a, b) => a.company_name.localeCompare(b.company_name))
					case 'ascending':
						return result.sort((a, b) => b.company_name.localeCompare(a.company_name))
					case 'subscribed':
						return result?.filter((item) => item.subscription)
                    case 'pending approval':
						return result?.filter((item) => !item.verification_status)
                    case 'active':
                            return result?.filter((item) => !item.suspension_status)
					case 'not subscribed':
						return result?.filter((item) => !item.subscription)
                    case 'suspended':
						return result?.filter((item) => item.suspension_status)
                    case 'not suspended':
                        return result?.filter((item) => !item.suspension_status)
					default:
						return result.filter(v => v.verification_status).sort((a, b) => a.company_name.localeCompare(b.company_name))
				}
			}
			const search_queried_data =(sorted_result)=>{
				return sorted_result.filter((item) => item?.email_of_company?.toLowerCase().includes(debounce_search_value?.toLowerCase()) ||
					item?.company_name?.toLowerCase().includes(debounce_search_value?.toLowerCase()) || 
                    item?._id?.toLowerCase().includes(debounce_search_value?.toLowerCase()) || 
					item?.first_name?.toLowerCase().includes(debounce_search_value?.toLowerCase()) ||
					item?.industry?.toLowerCase().includes(industry.toLowerCase()) ||
					item?.technology?.toLowerCase().includes(technology.toLowerCase()) ||
					item?.mobile_of_company?.includes(debounce_search_value) ||
					item?.last_name?.toLowerCase().includes(debounce_search_value?.toLowerCase()))
			}
            let sorted_result = sorted_data(data);
            let queried_result = search_queried_data(sorted_result);
            if (fromDate !== '' && toDate !== ''){
				//console.log(fromDate,toDate)
				let filtered_by_date = queried_result?.filter((item)=>{
					return new Date(item?.createdAt).getTime() >= new Date(fromDate).getTime() && new Date(item?.createdAt).getTime() <= new Date(toDate).getTime()
				});
				//console.log(filtered_by_date)
				set_manufacturers_data(filtered_by_date)
			}else{
				set_manufacturers_data(queried_result)
			}
            //console.log(queried_result);
            //set_manufacturers_data(queried_result)
			// if (suspension_status === 'suspended'){
			// 	let result = data?.filter((item) => item.suspension_status)
			// 	let sorted_result = sorted_data(result);
			// 	let queried_result = search_queried_data(sorted_result);
			// 	//console.log(queried_result);
			// 	set_manufacturers_data(queried_result)
			// }else if(suspension_status === 'not suspended'){
			// 	let result = data?.filter((item) => !item.suspension_status)
			// 	let sorted_result = sorted_data(result);
			// 	let queried_result = search_queried_data(sorted_result);
			// 	//console.log(queried_result);
			// 	set_manufacturers_data(queried_result)
			// }else{
			// 	let sorted_result = sorted_data(data);
			// 	let queried_result = search_queried_data(sorted_result);
			// 	//console.log(queried_result);
			// 	set_manufacturers_data(queried_result)
			// }
		}).catch((err)=>{
			console.log(err)
			set_manufacturers_data([])
		}).finally(()=>{
			set_is_fetching(null);
		})
	}
	//useEffect
	useEffect(()=>{
        if(search_query?.length > 0){
            set_search_value(search_query)
        }
        (async ()=>{
            //console.log(debounce_search_value);
            if (debounce_search_value.length == 0){
                handle_get_manufacturers();
            }
            if (debounce_search_value.length > 0){
                handle_get_manufacturers();
            }
        })();
	},[suspension_status,subscription_status,debounce_search_value,search_query,sort,fromDate,toDate])

    const Clear_Filter=()=>{
        set_search_query('')
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
                        <BreadcrumbLink>manufacturers</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
            </HStack>
            <Box gap='2' bg='#fff' borderRadius={5} p='4' mt='4'>
                <Tabs className={styles.products_container} position="relative" variant='enclosed' size='md'  overflowX={'scroll'} overscroll={''}>
                    <TabList >
                        <Tab _selected={{ bg: 'gray.100' }} onClick={Clear_Filter_Options}>
                            All
                            <Tag bg='gray.600' color='#fff' ml='2'>
                                {all_manufacturers_data}
                            </Tag>
                        </Tab>
                        <Tab _selected={{ bg: 'green.100' }} onClick={(()=>{set_sort('active')})}>
                            Active
                            <Tag bg='gray.100' ml='2'>
                                {active_manufacturers_data}
                            </Tag>
                        </Tab>
                        <Tab _selected={{ bg: 'gray.400' }} onClick={(()=>{set_sort('pending approval')})}>
                            Pending approval
                            <Tag bg='gray.100' ml='2'>
                                {pending_approval_manufacturers_data}
                            </Tag>
                        </Tab>
                        <Tab _selected={{ bg: 'blue.100' }} onClick={(()=>{set_sort('subscribed')})}>
                            Subscribed
                            <Tag bg='gray.100' ml='2'>
                                {subscribed_manufacturers_data}
                            </Tag>
                        </Tab>
                        <Tab _selected={{ bg: 'red.100' }} onClick={(()=>{set_sort('suspended')})}>
                            Suspended
                            <Tag bg='gray.100' ml='2'>
                                {suspended_manufacturers_data}
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
                                <Th >
                                    <Flex align={'center'}>
                                        <Text>
                                            Name
                                        </Text>
                                        {sort == 'ascending'?
                                            <ArrowUpwardIcon onClick={(()=>{set_sort('descending')})} style={{fontSize:'20px',cursor:'pointer'}}/>
                                        :
                                            <ArrowDownwardIcon onClick={(()=>{set_sort('ascending')})} style={{fontSize:'20px',cursor:'pointer'}}/>
                                        }
                                    </Flex>
                                </Th>
                                <Th>Phone number</Th>
                                <Th>Verification status</Th>
                                <Th>Valid email</Th>
                                <Th>Subscription</Th>
                                <Th >
                                    <Flex align={'center'}>
                                        <Text>
                                            status
                                        </Text>
                                        {sort === 'suspended'?
                                            <CheckBoxIcon onClick={(()=>{set_sort('not suspended')})}/>
                                        :
                                            <CheckBoxOutlineBlankIcon onClick={(()=>{set_sort('suspended')})}/>
                                        }
                                    </Flex>
                                </Th>
                                <Th>Joined</Th>
                                <Th>Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {manufacturers_data?.map((item)=>{
                                return(
                                    <Tr key={item?._id} bg={!item?.verification_status? 'gray.100':'none'} align={'center'} fontWeight={'regular'}>
                                        <Td>
                                            <HStack>
                                                <Avatar name={item?.company_name} src={item?.profile_photo_url} />
                                                <Box>
                                                    <Text>
                                                        {item?.company_name}
                                                    </Text>
                                                    <Text fontSize={'sm'} color='gray.400' fontWeight={''}>
                                                        {item?.email_of_company}
                                                    </Text>
                                                </Box>
                                            </HStack>
                                        </Td>
                                        <Td>{item.mobile_of_company? item.mobile_of_company : '-'}</Td>
                                        <Td>
                                            {!item?.verification_status?
                                                <Badge variant='subtle' bg={'gray.400'} borderRadius={'md'}>
                                                    not approved
                                                </Badge>
                                                :
                                                <Badge variant='subtle' bg={'green.100'} borderRadius={'md'}>
                                                    approved
                                                </Badge>
                                            }
                                        </Td>
                                        <Td>
                                            {item?.valid_email_status?
                                                <Badge variant='subtle' bg={'green.100'} borderRadius={'md'}>
                                                    valid email
                                                </Badge>
                                                :
                                                <Badge variant='subtle' bg={'orange.100'} borderRadius={'md'}>
                                                    not valid
                                                </Badge>
                                            }
                                        </Td>
                                        <Td>
                                            {item?.subscription?
                                                <Badge variant='subtle' bg={'blue.100'} borderRadius={'md'}>
                                                    subscribed
                                                </Badge>
                                                :
                                                <Badge variant='subtle' bg={'orange.100'} borderRadius={'md'}>
                                                    not subscribed
                                                </Badge>
                                            }
                                        </Td>
                                        <Td>
                                            {!item?.suspension_status?
                                                <Badge variant='subtle' bg={'green.200'} borderRadius={'md'}>
                                                    active
                                                </Badge>
                                                :
                                                <Badge variant='subtle' bg={'red.300'} borderRadius={'md'}>
                                                    suspended
                                                </Badge>
                                            }
                                        </Td>
                                        <Td>{moment( item?.createdAt).format("MMM Do YY")}</Td>
                                        <Td>
                                        <Menu >
                                            <MenuButton >
                                                <MoreVertIcon/>
                                            </MenuButton>
                                            <MenuList onClick={(()=>{router.push(`/suppliers_new/manufacturers/client/${item?._id}`)})}>
                                                <MenuItem >View</MenuItem>
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