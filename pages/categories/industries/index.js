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
    Tabs,
    TabList,
    Tab,
    TabIndicator,
    Avatar,
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
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
import New_Industry_Form from './new.js'
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
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CategoryIcon from '@mui/icons-material/Category';
//apis
import Get_Industries from '../../api/controls/get_industries';
import Delete_Industry from '../../api/controls/delete_industry.js';

import styles from '../../../styles/Inventory.module.css'
import Edit_Industry_Form from "./edit.js";
import View_Industry from "./view.js";

export default function IndustriesPage(){
    return(
        <Navigation >
            <Body/>
        </Navigation>
    )
}

const Body=()=>{
    const router = useRouter();
    const Add_industry_integrations = useDisclosure();

    const [Industries_data,set_Industries_data]=useState([]);
    const [is_refresh_data,set_is_refresh_data]=useState('')

    const cookies = new Cookies();
    let token = cookies.get('admin_token');
    const [auth_role,set_auth_role]=useState("")

	const [search_query,set_search_query] = useState('');

	const [sort,set_sort]=useState('');

    const [pending_approval_industries_data,set_pending_approval_industries_data]=useState(0);
    const [not_published_industries_data,set_not_published_industries_data]=useState(0);

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
		await Get_Industries().then((response)=>{
			//console.log(response.data)
			let fetched_data = response.data;

            const stats_data = (data)=>{
                const get_total_pending_approval_industries = data?.filter(v => !v.verification_status)
                set_pending_approval_industries_data(get_total_pending_approval_industries?.length);

                const get_total_not_published_industries = data?.filter(v => !v.publish_status)
                set_not_published_industries_data(get_total_not_published_industries?.length);
			}
            stats_data(fetched_data)

			const filtered_data = fetched_data.filter((item)=> item.title?.toLowerCase().includes(search_query.toLowerCase()));
			//console.log(filtered_data)
			if (sort == 'desc'){
				const sorted_result = filtered_data.sort((a, b) => a.title.localeCompare(b.title))	
				set_Industries_data(sorted_result)
			}else if(sort == 'pending approval'){
                const sorted_result = filtered_data.filter((item)=> !item.verification_status);
                set_Industries_data(sorted_result)
            }else{
				const sorted_result = filtered_data.sort((a, b) => b.title.localeCompare(a.title))
				set_Industries_data(sorted_result)
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
                        <BreadcrumbLink>industries</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
                <Button colorScheme="teal" leftIcon={<AddIcon />} onClick={Add_industry_integrations?.onOpen}>Industry</Button>
                <New_Industry_Form Add_industry_integrations={Add_industry_integrations} auth_role={auth_role} set_is_refresh_data={set_is_refresh_data}/>
            </HStack>
            <Box gap='2' bg='#fff' borderRadius={5} p='4' mt='2'>
                <Tabs className={styles.products_container} position="relative" variant='enclosed' size='md'  overflowX={'scroll'} overscroll={''}>
                    <TabList >
                        <Tab _selected={{ bg: 'gray.100' }} onClick={Clear_Filter_Options}>
                            All
                            <Tag bg='gray.600' color='#fff' ml='2'>
                                {Industries_data?.length}
                            </Tag>
                        </Tab>
                        <Tab _selected={{ bg: 'gray.400' }} onClick={(()=>{set_sort('pending approval')})}>
                            Pending approval
                            <Tag bg='gray.100' ml='2'>
                                {pending_approval_industries_data}
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
                        <Text fontWeight='bold' color='gray.800'>{Industries_data.length}</Text>
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
                            {Industries_data?.map((item)=>{
                                return(
                                    <Industry_Card key={item?._id} item={item} auth_role={auth_role} set_is_refresh_data={set_is_refresh_data}/>
                                )
                            })}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    )
}

const Industry_Card=({item,auth_role,set_is_refresh_data})=>{
    const View_industry_integrations = useDisclosure();
    const Edit_industry_integrations = useDisclosure();
    const Delete_industry_integrations = useDisclosure();
    const cancelRef = React.useRef();
    const toast = useToast();
	const cookies = new Cookies();

    const payload = {
		_id: item._id,
		auth_role
	}

	const handle_delete_industry=async()=>{
		await Delete_Industry(payload).then(()=>{
            toast({
              title: '',
              description: `${item?.title} has been deleted`,
              status: 'success',
              variant:'left-accent',
              position:'top-left',
              isClosable: true,
            });
            Delete_industry_integrations?.onClose()
            set_is_refresh_data('deleted an inustry')
          }).then(()=>{
              cookies.remove('ind_image_url', { path: '/' });
          }).catch((err)=>{
            //console.log(err)
            toast({
                      title: 'error while deleting this industry',
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
                        <MenuItem onClick={View_industry_integrations?.onOpen}>
                            View
                        </MenuItem>
                        <MenuItem onClick={Edit_industry_integrations?.onOpen}>
                            Edit
                        </MenuItem>
                        <MenuItem mt='2' onClick={Delete_industry_integrations?.onOpen} bg='red.200' borderRadius='md'>
                            Delete
                        </MenuItem>
                    </MenuList>
                </Menu>
            </Td>
            <AlertDialog
                isOpen={Delete_industry_integrations?.isOpen}
                leastDestructiveRef={cancelRef}
                onClose={Delete_industry_integrations?.onClose}
            >
                <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                        Delete {item?.title}
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        Are you sure you want to delete this industry? You can't undo this action afterwards.
                    </AlertDialogBody>

                    <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={Delete_industry_integrations?.onClose}>
                        Cancel
                    </Button>
                    <Button colorScheme='red' onClick={handle_delete_industry} ml={3}>
                        Delete
                    </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
            <Edit_Industry_Form set_is_refresh_data={set_is_refresh_data} Edit_industry_integrations={Edit_industry_integrations} item={item} auth_role={auth_role}/>
            <View_Industry View_industry_integrations={View_industry_integrations} item={item}/>
        </Tr>
    )
}