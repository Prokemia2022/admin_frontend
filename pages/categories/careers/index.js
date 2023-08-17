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
import Navigation from '../../../components/Navigation';
import View_Career from "./view.js";
import Edit_Career_Form from "./edit.js";
import New_Career_Form from "./new";
//utils
import {useRouter} from 'next/router';
import Cookies from 'universal-cookie';
import jwt_decode from "jwt-decode";
import moment from "moment";
//icons
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
//apis
import Get_Vacancies from '../../api/careers/get_vacancies.js';
import Delete_Vacancy from '../../api/careers/delete_vacancy.js';

export default function CareersPage(){
    return(
        <Navigation >
            <Body/>
        </Navigation>
    )
}

const Body=()=>{
    const router = useRouter();
    const Add_careers_integrations = useDisclosure();

    const [careers_data,set_careers__data]=useState([]);
    const [is_refresh_data,set_is_refresh_data]=useState('')

    const cookies = new Cookies();
    let token = cookies.get('admin_token');
    const [auth_role,set_auth_role]=useState("")

	const [search_query,set_search_query] = useState('');

	const [sort,set_sort]=useState('');

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
		await Get_Vacancies().then((response)=>{
			console.log(response.data)
			let fetched_data = response.data;

			const filtered_data = fetched_data.filter((item)=> item.title?.toLowerCase().includes(search_query.toLowerCase()) || item.company?.toLowerCase().includes(search_query.toLowerCase()));
			//console.log(filtered_data)
			if (sort == 'desc'){
				const sorted_result = filtered_data.sort((a, b) => a.title.localeCompare(b.title))	
				set_careers__data(sorted_result)
			}else{
				const sorted_result = filtered_data.sort((a, b) => b.title.localeCompare(a.title))
				set_careers__data(sorted_result)
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
                        <BreadcrumbLink>careers</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
                <Button colorScheme="teal" leftIcon={<AddIcon />} onClick={Add_careers_integrations.onOpen}>Career</Button>
                <New_Career_Form Add_careers_integrations={Add_careers_integrations} auth_role={auth_role} set_is_refresh_data={set_is_refresh_data}/>
            </HStack>
            <Box gap='2' bg='#fff' borderRadius={5} p='4' mt='2'>
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
                        <Text fontWeight='bold' color='gray.800'>{careers_data.length}</Text>
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
                                <Th >
                                    <Flex align={'center'}>
                                        <Text>
                                            Title
                                        </Text>
                                        {sort == 'asc'?
                                            <ArrowUpwardIcon onClick={(()=>{set_sort('desc')})} style={{fontSize:'20px',cursor:'pointer'}}/>
                                        :
                                            <ArrowDownwardIcon onClick={(()=>{set_sort('asc')})} style={{fontSize:'20px',cursor:'pointer'}}/>
                                        }
                                    </Flex>
                                </Th>
                                <Th>company</Th>
                                <Th>Valid till</Th>
                                <Th>Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {careers_data?.map((item)=>{
                                return(
                                    <Career_Card key={item?._id} item={item} auth_role={auth_role} set_is_refresh_data={set_is_refresh_data}/>
                                )
                            })}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    )
}

const Career_Card=({item,auth_role,set_is_refresh_data})=>{
    const View_career_integrations = useDisclosure();
    const Edit_career_integrations = useDisclosure();
    const Delete_career_integrations = useDisclosure();
    const cancelRef = React.useRef();
    const toast = useToast();
	const cookies = new Cookies();

    const payload = {
		_id: item._id,
		auth_role
	}

	const handle_delete_career=async()=>{
		await Delete_Vacancy(payload).then(()=>{
            toast({
              title: '',
              description: `career post by ${item?.company} has been deleted`,
              status: 'success',
              variant:'left-accent',
              position:'top-left',
              isClosable: true,
            });
            Delete_career_integrations.onClose()
            set_is_refresh_data('deleted a career')
          }).catch((err)=>{
            console.log(err)
            toast({
                      title: 'error while deleting this career',
                      description: err.response?.data,
                      status: 'error',
                      isClosable: true,
                  })
          })
	}
    return(
        <Tr align={'center'} fontWeight={'regular'}>
            <Td 
                color='#009393' 
                fontWeight={'semibold'}
                _hover={{
                    textDecoration:'underline dotted',
                    cursor:'pointer'
                }}
            >{item?.title}</Td>
            <Td>{item?.company}</Td>
            <Td>{moment( item?.valid_till).format("MMM Do YY")}</Td>
            <Td>
                <Menu >
                    <MenuButton >
                        <MoreVertIcon/>
                    </MenuButton>
                    <MenuList p='2'>
                        <MenuItem onClick={View_career_integrations.onOpen}>
                            View
                        </MenuItem>
                        <MenuItem onClick={Edit_career_integrations.onOpen}>
                            Edit
                        </MenuItem>
                        <MenuItem mt='2' onClick={Delete_career_integrations.onOpen} bg='red.200' borderRadius='md'>
                            Delete
                        </MenuItem>
                    </MenuList>
                </Menu>
            </Td>
            <AlertDialog
                isOpen={Delete_career_integrations.isOpen}
                leastDestructiveRef={cancelRef}
                onClose={Delete_career_integrations.onClose}
            >
                <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                        Delete {item?.title}
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        Are you sure you want to delete this career? You can't undo this action afterwards.
                    </AlertDialogBody>

                    <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={Delete_career_integrations.onClose}>
                        Cancel
                    </Button>
                    <Button colorScheme='red' onClick={handle_delete_career} ml={3}>
                        Delete
                    </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
            <Edit_Career_Form set_is_refresh_data={set_is_refresh_data} Edit_career_integrations={Edit_career_integrations} item={item} auth_role={auth_role}/>
            <View_Career View_career_integrations={View_career_integrations} item={item}/>
        </Tr>
    )
}