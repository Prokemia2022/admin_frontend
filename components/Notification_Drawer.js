import React from "react";
import {
    Text, 
    Box,
    HStack,
    Drawer,
    DrawerOverlay,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    Button,
    Image,
    Wrap,
    Avatar,
    Badge,
} from '@chakra-ui/react';
//api
//utils
import moment from 'moment';
//icons
import CategoryIcon from '@mui/icons-material/Category';
import {Receipt} from '@mui/icons-material';
import {useRouter} from 'next/router';

function Notification_Drawer({View_notifications_integrations,notifications}){
    const router = useRouter();
	return(
        <Drawer
            isOpen={View_notifications_integrations.isOpen}
            placement='right'
            onClose={View_notifications_integrations.onClose}
            size={{
                base:'full',
                md:'md'
            }}
        >
            <DrawerOverlay />
            <DrawerContent bg='#eee'>
            <DrawerCloseButton />
            <DrawerHeader>
                <HStack>
                    <Text>
                        Notifications 
                    </Text>
                    <Badge bg='orange.200'>
                        {notifications?.total}
                    </Badge>
                </HStack>
            </DrawerHeader>
            <DrawerBody bg='#eee'>
                {notifications?.orders?.map((item)=>{
                    return(
                        <Order_Card item={item} router={router} key={item?._id}/>
                    )
                })}
                {notifications?.products?.map((item)=>{
                    return(
                        <Product_Card item={item} router={router} key={item?._id}/>
                    )
                })}
                {notifications?.distributors?.map((item)=>{
                    return(
                        <Distributor_Card item={item} router={router} key={item?._id}/>
                    )
                })}
                {notifications?.manufacturers?.map((item)=>{
                    return(
                        <Manufacturer_Card item={item} router={router} key={item?._id}/>
                    )
                })}
                {notifications?.industries?.map((item)=>{
                    return(
                        <Industry_Card item={item} router={router} key={item?._id}/>
                    )
                })}
                {notifications?.technologies?.map((item)=>{
                    return(
                        <Technology_Card item={item} router={router} key={item?._id}/>
                    )
                })}
            </DrawerBody>
            <DrawerFooter>
                <Button variant='outline' mr={3} onClick={View_notifications_integrations.onClose}>
                    Back
                </Button>
            </DrawerFooter>
            </DrawerContent>
        </Drawer>
	)
}

export default Notification_Drawer;

const Product_Card=({item,router})=>{
    return(
        <Box bg='#fff' p='2' borderRadius={'md'} _hover={{bg:'#eee'}} cursor='pointer' mt='1' onClick={(()=>{router.push(`/inventory_new/product/${item?._id}`)})}>
            <HStack>
                <Image w='50px' h='50px' borderRadius='10px' objectFit='cover' src='../../Pro.png' alt='next'/>
                <Box color='grey' fontSize={'sm'}>
                    <Wrap>
                        <Text color='#009393' fontWeight={'bold'}>{item?.name_of_product}</Text>
                        <Text color='#000'>is waiting to be approved</Text>
                    </Wrap>
                    <HStack fontSize='xs'>
					    <Text>{item?.industry ? item?.industry : "-"}</Text>
					    <Text borderLeft='1px solid grey' paddingLeft='2'>{item?.technology? item?.technology : "-"}</Text>
                    </HStack>
                    <HStack alignItems={'center'} mt='1' fontSize='xs'>
                        <Text>{moment(item?.created_At).fromNow(true)} ago</Text>
                        <Text>.</Text>
                        <Text>Product</Text>
                    </HStack>
				</Box>
            </HStack>
        </Box>
    )
}

const Distributor_Card=({item,router})=>{
    return(
        <Box bg='#fff' p='2' borderRadius={'md'} _hover={{bg:'#eee'}} cursor='pointer' mt='1' onClick={(()=>{router.push(`/suppliers_new/distributors/client/${item?._id}`)})}>
            <HStack>
                <Avatar name={item?.company_name}/>
                <Box color='grey' fontSize={'sm'}>
                    <Wrap>
                        <Text color='#009393' fontWeight={'bold'}>{item?.company_name}</Text>
                        <Text color='#000'>is waiting to be approved</Text>
                    </Wrap>
                    <HStack fontSize='xs'>
					    <Text>{item?.email_of_company ? item?.email_of_company : "-"}</Text>
					    <Text>{item?.mobile_of_company? item?.mobile_of_company : "-"}</Text>
                    </HStack>
                    <HStack alignItems={'center'} mt='1' fontSize='xs'>
                        <Text>{moment(item?.created_At).fromNow(true)} ago</Text>
                        <Text>.</Text>
                        <Text>distributor</Text>
                    </HStack>
				</Box>
            </HStack>
        </Box>
    )
}

const Manufacturer_Card=({item,router})=>{
    return(
        <Box bg='#fff' p='2' borderRadius={'md'} _hover={{bg:'#eee'}} cursor='pointer' mt='1' onClick={(()=>{router.push(`/suppliers_new/manufacturers/client/${item?._id}`)})}>
            <HStack>
                <Avatar name={item?.company_name}/>
                <Box color='grey' fontSize={'sm'}>
                    <Wrap>
                        <Text color='#009393' fontWeight={'bold'}>{item?.company_name}</Text>
                        <Text color='#000'>is waiting to be approved</Text>
                    </Wrap>
                    <HStack fontSize='xs'>
					    <Text>{item?.email_of_company ? item?.email_of_company : "-"}</Text>
					    <Text>{item?.mobile_of_company? item?.mobile_of_company : "-"}</Text>
                    </HStack>
                    <HStack alignItems={'center'} mt='1' fontSize='xs'>
                        <Text>{moment(item?.created_At).fromNow(true)} ago</Text>
                        <Text>.</Text>
                        <Text>manufacturer</Text>
                    </HStack>
				</Box>
            </HStack>
        </Box>
    )
}

const Industry_Card=({item,router})=>{
    return(
        <Box bg='#fff' p='2' borderRadius={'md'} _hover={{bg:'#eee'}} cursor='pointer' mt='1' onClick={(()=>{router.push(`/categories/industries`)})}>
            <HStack>
                <Box w='50px' alignItems='center' justifyContent={'center'}>
                    <CategoryIcon style={{width:'100%',color:'gray'}}/>
                </Box>
                <Box color='grey' fontSize={'sm'}>
                    <Wrap>
                        <Text color='#009393' fontWeight={'bold'}>{item?.title}</Text>
                        <Text color='#000'>is waiting to be approved</Text>
                    </Wrap>
                    <HStack alignItems={'center'} mt='1' fontSize='xs'>
                        <Text>{moment(item?.createdAt).fromNow(true)} ago</Text>
                        <Text>.</Text>
                        <Text>industry</Text>
                    </HStack>
				</Box>
            </HStack>
        </Box>
    )
}

const Technology_Card=({item,router})=>{
    return(
        <Box bg='#fff' p='2' borderRadius={'md'} _hover={{bg:'#eee'}} cursor='pointer' mt='1' onClick={(()=>{router.push(`/categories/technologies`)})}>
            <HStack>
                <Box w='50px' alignItems='center' justifyContent={'center'}>
                    <CategoryIcon style={{width:'100%',color:'gray'}}/>
                </Box>
                <Box color='grey' fontSize={'sm'}>
                    <Wrap>
                        <Text color='#009393' fontWeight={'bold'}>{item?.title}</Text>
                        <Text color='#000'>is waiting to be approved</Text>
                    </Wrap>
                    <HStack alignItems={'center'} mt='1' fontSize='xs'>
                        <Text>{moment(item?.createdAt).fromNow(true)} ago</Text>
                        <Text>.</Text>
                        <Text>technologies</Text>
                    </HStack>
				</Box>
            </HStack>
        </Box>
    )
}

const Order_Card=({item,router})=>{
    return(
        <Box bg='#fff' p='2' borderRadius={'md'} _hover={{bg:'#eee'}} cursor='pointer' mt='1' onClick={(()=>{router.push(`orders_new/order/${item?._id}`)})}>
            <HStack>
                <Box w='50px' alignItems='center' justifyContent={'center'}>
                    <Receipt style={{width:'100%',color:'gray'}}/>
                </Box>
                <Box color='grey' fontSize={'sm'}>
                    <Wrap>
                        <Text color='#009393' fontWeight={'bold'}>{item?.name_of_product}</Text>
                        <Text color='#000'>is waiting to be approved</Text>
                    </Wrap>
                    <HStack fontSize='xs'>
					    <Text>{item?.creator_name ? item?.creator_name : "-"}</Text>
					    <Text>{item?.company_name_of_client? item?.company_name_of_client : "-"}</Text>
                    </HStack>
                    <HStack alignItems={'center'} mt='1' fontSize='xs'>
                        <Text>{moment(item?.created_At).fromNow(true)} ago</Text>
                        <Text>.</Text>
                        <Text>orders</Text>
                    </HStack>
				</Box>
            </HStack>
        </Box>
    )
}