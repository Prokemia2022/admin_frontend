import React, { useEffect, useState } from "react";
import {
    Text, 
    Box, 
    Card, 
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer, 
    CardBody, 
    Heading, 
    SimpleGrid, 
    Badge,
    Menu,
   MenuButton,
  MenuList,
  MenuItem,
  CardHeader,
  Avatar,
  Flex,
  HStack,
} from '@chakra-ui/react';
import Navigation from '../components/Navigation';
//utils
import {useRouter} from 'next/router';
import Cookies from 'universal-cookie';
//apis
import Get_Clients from './api/clients/get_clients.js';
import Get_Distributors from './api/distributors/get_distributors.js';
import Get_Manufacturers from './api/manufacturers/get_manufacturers.js';
import Get_SalesPeople from './api/salespeople/get_salespeople.js';
import Get_Orders from './api/orders/get_orders.js';
import Get_Products from './api/Products/get_products.js';

import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function Dashboard(){
    return(
        <Navigation >
            <Body />
        </Navigation>
    )
}

const Body=()=>{
    const cookies = new Cookies();

    const notifications_obj = {
        products: 0,
        orders: 0,
        salespeople: 0,
        distributors: 0,
        manufacturers: 0,
        industries: 0,
        technologies: 0,
    }
    
    const router = useRouter();

    const [clients_data, set_clients_data] = useState([]);
	const [distributors_data, set_distributors_data]=useState([]);
	const [manufacturers_data, set_manufacturers_data]=useState([]);
	const [salespeople_data, set_salespeople_data]=useState([]);
	const [orders_data,set_orders]=useState([]);
	const [products,set_products]=useState([]);

    useEffect(()=>{
	    Get_Clients().then((response)=>{
            const data = response?.data.reverse()
            set_clients_data(data.filter(v => v.valid_email_status))
        })
        Get_Distributors().then((response)=>{
                const data = response?.data.reverse()
                set_distributors_data(data.filter(v => v.verification_status));
        })
        Get_Manufacturers().then((response)=>{
                const data = response?.data.reverse()
                set_manufacturers_data(data.filter(v => v.verification_status))                
        })
        Get_SalesPeople().then((response)=>{
                const data = response?.data.reverse()
                set_salespeople_data(data.filter(v => v.verification_status))
                
        })
        Get_Orders().then((response)=>{
                const data = response?.data;
                set_orders(data.filter(v => v.order_notification_status))
        })
        Get_Products().then((response)=>{
                const data = response?.data;                
                set_products(data.filter(v => v.verification_status && v.sponsored))
        })
	  },[])
    return (
        <Box gap='2'>
            <Box p='4' borderRadius={'5'} bg='rgb(0, 147, 147,0.6)' mb='2'>
                <Text fontWeight={'bold'} color='#fff'>Hi, Welcome back!</Text>
            </Box>
            <Box gap='2'>
                <SimpleGrid minChildWidth='150px' spacing='20px'>
                    <Card bg='#fff' color=''>
                        <CardBody>
                        <Box alignItems={'center'} textAlign={'center'}>
                            <Heading size='xl' textTransform='uppercase'>
                                {clients_data?.length}
                            </Heading>
                            <Text pt='2' fontSize='sm'>
                                Customers
                            </Text>
                        </Box>
                        </CardBody>
                    </Card>
                    <Card bg='#fff' color=''>
                        <CardBody>
                        <Box alignItems={'center'} textAlign={'center'}>
                            <Heading size='xl' textTransform='uppercase'>
                                {manufacturers_data?.length}
                            </Heading>
                            <Text pt='2' fontSize='sm'>
                                Manufacturers
                            </Text>
                        </Box>
                        </CardBody>
                    </Card>
                    <Card bg='#fff' color=''>
                        <CardBody>
                        <Box alignItems={'center'} textAlign={'center'}>
                            <Heading size='xl' textTransform='uppercase'>
                                {distributors_data?.length}
                            </Heading>
                            <Text pt='2' fontSize='sm'>
                                Distributors
                            </Text>
                        </Box>
                        </CardBody>
                    </Card>
                    <Card bg='#fff' color=''>
                        <CardBody>
                        <Box alignItems={'center'} textAlign={'center'}>
                            <Heading size='xl' textTransform='uppercase'>
                                {salespeople_data?.length}
                            </Heading>
                            <Text pt='2' fontSize='sm'>
                                Salespeople
                            </Text>
                        </Box>
                        </CardBody>
                    </Card>
                </SimpleGrid>
                <SimpleGrid minChildWidth='250px' spacing='20px' mt='4'>
                    <Card bg='#fff' flex={1}>
                        <CardHeader>
                            <Heading size='md'>Salespeople</Heading>
                        </CardHeader>
                        <CardBody>
                            {salespeople_data?.slice(0,4).map((item)=>{
                                return(
                                    <Flex key={item?._id} flex='1' gap='4' alignItems='center' flexWrap='wrap' mt='2' justify={'space-between'}>
                                        <HStack>
                                            <Avatar name={item?.first_name} src={item?.profile_photo_url} />
                                            <Box>
                                                <Heading size='sm'>{item?.first_name}{item?.last_name}</Heading>
                                                <Text color='grey' fontSize={'sm'}>{item?.email_of_salesperson}</Text>
                                            </Box>
                                        </HStack>
                                        <Menu >
                                            <MenuButton >
                                                <MoreVertIcon/>
                                            </MenuButton>
                                            <MenuList>
                                                <MenuItem onClick={(()=>{router.push(`/salespeople_new/client/${item?._id}`)})}>View</MenuItem>
                                            </MenuList>
                                        </Menu>
                                    </Flex>
                                )
                            })}
                        </CardBody>
                    </Card>
                    <TableContainer bg='papayawhip' borderRadius={5} flex='2'>
                        <Text p='4' fontWeight={'regular'}>{orders_data?.length} Orders</Text>
                        <Table variant='simple'>
                            <Thead bg='#eee' borderRadius={'5'}>
                                <Tr>
                                    <Th>Name</Th>
                                    <Th>Volume</Th>
                                    <Th>Status</Th>
                                    <Th>Action</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                            {orders_data?.slice(0,4).map((item)=>{
                                return(
                                    <Tr key={item?._id} align={'center'} fontWeight={'semibold'}>
                                        <Td>{item?.name_of_product}</Td>
                                        <Td>{item?.volume_of_items}</Td>
                                        <Td>
                                            <Badge variant='subtle' colorScheme={item?.order_status === 'completed'? 'green':'orange'}>
                                                {item?.order_status}
                                            </Badge>
                                        </Td>
                                        <Td>
                                            <Menu >
                                                <MenuButton >
                                                    <MoreVertIcon/>
                                                </MenuButton>
                                                <MenuList>
                                                    <MenuItem onClick={(()=>{router.push(`/orders_new/order/${item?._id}`)})}>View</MenuItem>
                                                </MenuList>
                                            </Menu>
                                        </Td>
                                    </Tr>)
                            })}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </SimpleGrid>
                <TableContainer bg='#fff' mt='4' borderRadius={5}>
                        <Text p='4' fontWeight={'bold'}>Products</Text>
                        <Table variant='simple'>
                            <Thead bg='#eee' borderRadius={'5'}>
                                <Tr>
                                    <Th>Name</Th>
                                    <Th>Industry</Th>
                                    <Th>Status</Th>
                                    <Th>Actions</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {products?.slice(0,4).map((item)=>{
                                    return(
                                        <Tr key={item?._id} align={'center'} fontWeight={'semibold'}>
                                            <Td>{item?.name_of_product}</Td>
                                            <Td>{item?.industry}</Td>
                                            <Td>
                                                <Badge variant='subtle' colorScheme={item?.sponsored? 'green':'orange'}>
                                                    {item?.sponsored? 'Featured':'not featured'}
                                                </Badge>
                                            </Td>
                                            <Td>
                                            <Menu >
                                                <MenuButton >
                                                    <MoreVertIcon/>
                                                </MenuButton>
                                                <MenuList>
                                                    <MenuItem onClick={(()=>{router.push(`/inventory_new/product/${item?._id}`)})}>View</MenuItem>
                                                    <MenuItem>Share</MenuItem>
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