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
    InputRightElement,
    CircularProgress,
    Tag,
    TagLabel,
    Flex,
    Wrap,
    Tabs,
    TabList,
    Tab,
    Avatar,
    useDisclosure,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    useToast,
} from '@chakra-ui/react';
//components
import New_Technology_Form from './new.js'
import Navigation from '../../../components/Navigation';
//utils
import {useRouter} from 'next/router';
import Cookies from 'universal-cookie';
import jwt_decode from "jwt-decode";
//icons
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CategoryIcon from '@mui/icons-material/Category';
//apis
import Get_Technologies from '../../api/controls/get_technologies.js';
import Delete_Technology from '../../api/controls/delete_technology.js';

import styles from '../../../styles/Inventory.module.css'
import Edit_Technology_Form from "./edit.js";
import View_Technology from './view.js'

export default function TechnologiesPage(){
    return(
        <Navigation >
            <Body/>
        </Navigation>
    )
}

const Body=()=>{
    const router = useRouter();
    const Add_technology_integrations = useDisclosure();

    const [Technologies_data,set_Technologies_data]=useState([]);
    const [is_refresh_data,set_is_refresh_data]=useState('')

    const cookies = new Cookies();
    let token = cookies.get('admin_token');
    const [auth_role,set_auth_role]=useState("")

	const [search_query,set_search_query] = useState('');

	const [sort,set_sort]=useState('');

    const [pending_approval_technologies_data,set_pending_approval_technologies_data]=useState(0);
    const [not_published_technologies_data,set_not_published_technologies_data]=useState(0);

	let [is_fetching,set_is_fetching]=useState(false);

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
	},[token,sort,search_query,is_refresh_data]);

    const Get_Data=async()=>{
		set_is_fetching(true);
		await Get_Technologies().then((response)=>{
			console.log(response.data)
			let fetched_data = response.data;

            const stats_data = (data)=>{
                const get_total_pending_approval_technologies = data?.filter(v => !v.verification_status)
                set_pending_approval_technologies_data(get_total_pending_approval_technologies?.length);

                const get_total_not_published_technologies = data?.filter(v => !v.publish_status)
                set_not_published_technologies_data(get_total_not_published_technologies?.length);
			}
            stats_data(fetched_data)

			const filtered_data = fetched_data.filter((item)=> item.title?.toLowerCase().includes(search_query.toLowerCase()));
			//console.log(filtered_data)
			if (sort == 'desc'){
				const sorted_result = filtered_data.sort((a, b) => a.title.localeCompare(b.title))	
				set_Technologies_data(sorted_result)
			}else if(sort == 'pending approval'){
                const sorted_result = filtered_data.filter((item)=> !item.verification_status);
                set_Technologies_data(sorted_result)
            }else{
				const sorted_result = filtered_data.sort((a, b) => b.title.localeCompare(a.title))
				set_Technologies_data(sorted_result)
			}
		}).then(()=>{
			set_is_fetching(false);
		}).catch((err)=>{
			console.error(err);
		});
	}

    const Clear_Filter_Options=()=>{
		set_sort('')
		set_search_query('');
	}

    return (
        <Box gap='2'>
            
            <HStack justifyContent={'space-between'}>
                <Breadcrumb spacing='5px' alignItems={'center'} fontSize={'sm'} fontWeight={'semibold'}>
                    <BreadcrumbItem>
                        <BreadcrumbLink href='/dashboard_new'>Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem isCurrentPage>
                        <BreadcrumbLink>technologies</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
                <Button colorScheme="teal" leftIcon={<AddIcon />} onClick={Add_technology_integrations.onOpen}>Technology</Button>
                <New_Technology_Form Add_technology_integrations={Add_technology_integrations} auth_role={auth_role} set_is_refresh_data={set_is_refresh_data}/>
            </HStack>
            <Box gap='2' bg='#fff' borderRadius={5} p='4' mt='2'>
                <Tabs className={styles.products_container} position="relative" variant='enclosed' size='md'  overflowX={'scroll'} overscroll={''}>
                    <TabList >
                        <Tab _selected={{ bg: 'gray.100' }} onClick={Clear_Filter_Options}>
                            All
                            <Tag bg='gray.600' color='#fff' ml='2'>
                                {Technologies_data?.length}
                            </Tag>
                        </Tab>
                        <Tab _selected={{ bg: 'gray.400' }} onClick={(()=>{set_sort('pending approval')})}>
                            Pending approval
                            <Tag bg='gray.100' ml='2'>
                                {pending_approval_technologies_data}
                            </Tag>
                        </Tab>
                    </TabList>
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
                <Wrap align='center' spacing='20px' mt='4'>
                    <Flex fontSize={'sm'} gap='2'>
                        <Text fontWeight='bold' color='gray.800'>{Technologies_data?.length}</Text>
                        <Text fontWeight='light' color='gray.400'>results found</Text>
                    </Flex>
                    {search_query !== '' || sort !== ''? 
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
                                <Th>Image</Th>
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
                                <Th>Status</Th>
                                <Th>Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {Technologies_data?.map((item)=>{
                                return(
                                    <Technology_Card key={item?._id} item={item} auth_role={auth_role} set_is_refresh_data={set_is_refresh_data}/>
                                )
                            })}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    )
}

const Technology_Card=({item,auth_role,set_is_refresh_data})=>{
    const View_technology_integrations = useDisclosure();
    const Edit_technology_integrations = useDisclosure();
    const Delete_technology_integrations = useDisclosure();
    const cancelRef = React.useRef();
    const toast = useToast();
	const cookies = new Cookies();

    const payload = {
		_id: item._id,
		auth_role
	}

	const handle_delete_technology=async()=>{
		await Delete_Technology(payload).then(()=>{
            toast({
              title: '',
              description: `${item?.title} has been deleted`,
              status: 'success',
              variant:'left-accent',
              position:'top-left',
              isClosable: true,
            });
            Delete_technology_integrations.onClose()
            set_is_refresh_data('deleted an inustry')
          }).then(()=>{
              cookies.remove('technology_image_url', { path: '/' });
          }).catch((err)=>{
            console.log(err)
            toast({
                      title: 'error while deleting this technology',
                      description: err.response?.data,
                      status: 'error',
                      isClosable: true,
                  })
          })
	}
    return(
        <Tr key={item?._id} bg={!item?.verification_status? 'gray.100':'none'} align={'center'} fontWeight={'regular'}>
            <Td>
                <Avatar borderRadius={'md'} src={item?.cover_image} icon={<CategoryIcon fontSize='1.5rem' />}/>
            </Td>
            <Td
                color='#009393' 
                fontWeight={'semibold'}
                _hover={{
                    textDecoration:'underline dotted',
                    cursor:'pointer'
                }}
            >{item?.title}</Td>
            <Td>
                <Badge variant='subtle' bg={item?.verification_status? 'green.200':'gray.300'}>
                    {item?.verification_status? 'Approved':'not approved'}
                </Badge>
            </Td>
            <Td>
                <Menu >
                    <MenuButton >
                        <MoreVertIcon/>
                    </MenuButton>
                    <MenuList p='2'>
                        <Text color='#009393' my='2' fontWeight='bold'>{item?.title}</Text>
                        <MenuItem onClick={View_technology_integrations.onOpen}>
                            View
                        </MenuItem>
                        <MenuItem onClick={Edit_technology_integrations.onOpen}>
                            Edit
                        </MenuItem>
                        <MenuItem mt='2' onClick={Delete_technology_integrations.onOpen} bg='red.200' borderRadius='md'>
                            Delete
                        </MenuItem>
                    </MenuList>
                </Menu>
            </Td>
            <AlertDialog
                isOpen={Delete_technology_integrations.isOpen}
                leastDestructiveRef={cancelRef}
                onClose={Delete_technology_integrations.onClose}
            >
                <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                        Delete {item?.title}
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        Are you sure you want to delete this technology? You can't undo this action afterwards.
                    </AlertDialogBody>

                    <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={Delete_technology_integrations.onClose}>
                        Cancel
                    </Button>
                    <Button colorScheme='red' onClick={handle_delete_technology} ml={3}>
                        Delete
                    </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
            <Edit_Technology_Form set_is_refresh_data={set_is_refresh_data} Edit_technology_integrations={Edit_technology_integrations} item={item} auth_role={auth_role}/>
            <View_Technology View_technology_integrations={View_technology_integrations} item={item}/>
        </Tr>
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