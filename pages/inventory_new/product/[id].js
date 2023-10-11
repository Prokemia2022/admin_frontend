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
    GridItem,
    Heading,
    VStack,
    Divider,
    useToast,
    Link,
    Tooltip
} from '@chakra-ui/react';
import Navigation from '../../../components/Navigation';
//utils
import {useRouter} from 'next/router';
import Cookies from 'universal-cookie';
import jwt_decode from "jwt-decode";
import moment from 'moment';
//icons
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditNoteIcon from '@mui/icons-material/EditNote';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import InventoryRoundedIcon from '@mui/icons-material/InventoryRounded';
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded';
import StarOutlineRoundedIcon from '@mui/icons-material/StarOutlineRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ShareIcon from '@mui/icons-material/Share';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LanguageIcon from '@mui/icons-material/Language';
//api
import Get_Product from '../../api/Products/get_product.js';
import Feature_Product from '../../api/Products/feature_product';
import Un_Feature_Product from '../../api/Products/un_feature_product';
import Decline_Product from '../../api/Products/decline_product';
import Approve_Product from '../../api/Products/approve_product';
//components
import Delete_Product from '../../../components/modals/Product_Modals/Delete_Product.js';
import QuotationModal from '../../../components/modals/Quotation';
import SampleModal from '../../../components/modals/Sample.js';
import { RWebShare } from "react-web-share";

export default function Product(){
    return(
        <Navigation >
            <Body/>
        </Navigation>
    )
}

const Body=()=>{
    const router = useRouter();
    const toast = useToast()
    const id = router.query;
    const cookies = new Cookies();
    let token = cookies.get('admin_token');

    const [isquotationModalvisible,setisquotationModalvisible]=useState(false);
	const [issampleModalvisible,setissampleModalvisible]=useState(false);
    const [is_delete_product_Modalvisible,set_is_delete_product_Modalvisible]=useState(false);
	

    const [product_data,set_product_data]=useState('');

    const [is_submitting,set_is_submitting]=useState(false);
    const [refresh_data,set_refresh_data]=useState(false);

    const [auth_role,set_auth_role]=useState("");

	const payload = {
		_id : id?.id,
		auth_role
	}

    const [created_by_name,set_created_by_name]=useState('');

	const get_Data=async(payload)=>{
		await Get_Product(payload).then((response)=>{
			set_product_data(response.data)
			//console.log(response.data)
            if (response.data?.manufactured_by_id === response.data?.listed_by_id){
                set_created_by_name(response.data?.manufactured_by)
            }else if(response.data?.distributed_by_id === response.data?.listed_by_id){
                set_created_by_name(response.data?.distributed_by)
            }else{
                set_created_by_name(response.data?.listed_by_id)
            }
		})
	}
	useEffect(()=>{
		if (payload._id || id.id ){
			get_Data(payload);
		}
	},[id,is_submitting,refresh_data]);

	useEffect(()=>{
		if (token){
			let decoded = jwt_decode(token);
			set_auth_role(decoded?.role);
            return;
		  }
	},[token]);

    const Handle_Suspend_Product=async()=>{
		set_refresh_data(true)
		await Decline_Product(payload).then((res)=>{
			toast({
				position: 'top-left',
				variant:"subtle",
				title: '',
				description: `Successfully suspended ${product_data?.name_of_product}`,
				status: 'success',
				isClosable: true,
			});
		}).catch((err)=>{
			toast({
				position: 'top-left',
				variant:"subtle",
				title: 'Error while suspending this product',
				description: err.response.data,
				status: 'error',
				isClosable: true,
			});
			//console.log(err.response.data)
		}).finally(()=>{
			setTimeout(()=>{set_refresh_data(false)},1000)
		})
	}
	const Handle_approve_Product=async()=>{
		set_refresh_data(true)
		await Approve_Product(payload).then((res)=>{
			toast({
				position: 'top-left',
				variant:"subtle",
				title: '',
				description: `Successfully approved ${product_data?.name_of_product}`,
				status: 'success',
				isClosable: true,
			});
		}).catch((err)=>{
			toast({
				position: 'top-left',
				variant:"subtle",
				title: 'Error while approving this product',
				description: err.response.data,
				status: 'error',
				isClosable: true,
			});
			//console.log(err.response.data)
		}).finally(()=>{
			setTimeout(()=>{set_refresh_data(false)},1000)
		})
	}
    const Handle_Feature_Product=async()=>{
		set_is_submitting(true)
		await Feature_Product(payload).then((res)=>{
			toast({
				position: 'top-left',
				variant:"subtle",
				title: '',
				description: `Successfully featured ${product_data?.name_of_product}`,
				status: 'success',
				isClosable: true,
			});
		}).catch((err)=>{
			toast({
				position: 'top-left',
				variant:"subtle",
				title: 'Error while featuring this product',
				description: err.response.data,
				status: 'error',
				isClosable: true,
			});
			//console.log(err.response.data)
		}).finally(()=>{
			setTimeout(()=>{set_is_submitting(false)},1000)
		})
	}
	const Handle_Un_Feature_Product=async()=>{
		set_is_submitting(true)
		await Un_Feature_Product(payload).then((res)=>{
			toast({
				position: 'top-left',
				variant:"subtle",
				title: '',
				description: `Successfully un-featured ${product_data?.name_of_product}`,
				status: 'success',
				isClosable: true,
			});
		}).catch((err)=>{
			toast({
				position: 'top-left',
				variant:"subtle",
				title: 'Error while un-featuring this product',
				description: err.response.data,
				status: 'error',
				isClosable: true,
			});
			//console.log(err.response.data)
		}).finally(()=>{
			setTimeout(()=>{set_is_submitting(false)},1000)
		})
	}

    
    return (
        <Box gap='2' m={{
            base:'0',
            md:'8'
        }}>
        <QuotationModal isquotationModalvisible={isquotationModalvisible} setisquotationModalvisible={setisquotationModalvisible} product_data={product_data}/>
			<SampleModal issampleModalvisible={issampleModalvisible} setissampleModalvisible={setissampleModalvisible} product_data={product_data}/>
            <Delete_Product is_delete_product_Modalvisible={is_delete_product_Modalvisible} set_is_delete_product_Modalvisible={set_is_delete_product_Modalvisible} product_data={product_data}/>
            <HStack justifyContent={'space-between'}>
                <Breadcrumb spacing='5px' alignItems={'center'} fontSize={'sm'} fontWeight={'semibold'}>
                    <BreadcrumbItem>
                        <ChevronLeftIcon style={{fontSize:'20px',marginTop:'2'}}/>
                        <BreadcrumbLink onClick={(()=>{router.back()})}>Back</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
                <HStack>
                    <Tooltip label='Share this product'>
                        <Box align='center' p='1' borderRadius='5' bg='gray.200' px='2'>
                            <RWebShare
                                data={{
                                    title: `${product_data?.name_of_product}`,
                                    text: `${product_data?.description_of_product}`,
                                    url: `https://prokemia.com/product/${product_data?._id}`,
                                }}
                            >
                                <ShareIcon style={{fontSize:24,marginTop:2,marginBottom:'-1'}}/>
                            </RWebShare>
                        </Box>
                    </Tooltip>
                    <Menu>
                        <MenuButton colorScheme="teal" as={Button} rightIcon={<ExpandMoreIcon />}>
                            Actions
                        </MenuButton>
                        <MenuList p='2'>
                            <MenuItem _hover={{bg:'gray.300',borderRadius:'5',}} onClick={(()=>{router.push(`/inventory_new/product/edit/${product_data?._id}`)})}>
                                <HStack>
                                    <EditNoteIcon/>
                                    <Text>Edit Product</Text>
                                </HStack>
                            </MenuItem>
                            <Divider/>
                            <MenuItem _hover={{bg:'gray.300',borderRadius:'5',}}>
                                <HStack onClick={(()=>{set_is_delete_product_Modalvisible(true)})}>
                                    <DeleteRoundedIcon style={{color:'red'}}/>
                                    <Text>Delete this product</Text>
                                </HStack>
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </HStack>
            </HStack>
            <Grid
                templateRows='repeat(2, 1fr)'
                templateColumns='repeat(5, 1fr)'
                gap={4}
                mt='4'
            >
                <GridItem 
                    colSpan={{
                        base: "5",
                        md: "4",
                    }}
                >
                    <Box
                        bg='#fff'
                        borderRadius={10}
                        boxShadow={'sm'}
                        p='4'
                    >
                        <Wrap mb='2'>
                            {product_data?.sponsored?
                                <Tag size='lg' variant='solid' bg='gray.200' color='gray.800'>
                                    Featured
                                </Tag>
                            :
                                null
                            }
                            {!product_data?.verification_status?
                                <Tag size='lg' variant='solid' bg='red.200' >
                                    Suspended
                                </Tag>
                            :
                                null
                            }
                            {product_data?.short_on_expiry?
                                <Tag size='lg' variant='solid' bg='orange.200' color='#000'>
                                    Expiring soon
                                </Tag>
                            :
                                null
                            }
                        </Wrap>
                        <Divider/>
                        <Wrap>
                            <HStack align={'start'}>
                                <Text fontWeight={'bold'}>Industry</Text>
                                <Text color='#009393' cursor='pointer'>{product_data?.industry}</Text>
                            </HStack>
                            <Divider orientation='vertical' />
                            <Divider orientation='vertical' />
                            <HStack>
                                <Text fontWeight={'bold'}>Technology:</Text>
                                <Text color='#009393' cursor='pointer'>{product_data?.technology}</Text>
                            </HStack>
                        </Wrap>
                        <Heading as='h3' my='4' color='#009393'>{product_data?.name_of_product}</Heading>
                        <Box my='2' >
                            <Text fontWeight={'semibold'}>Product Description</Text>
                            <Text my='2'>{product_data?.description_of_product}</Text>
                        </Box>
                        <Box mt='2'>
                            <Text fontWeight={'semibold'}>Manufactured by:</Text>
                            {product_data?.manufactured_by_id ?
                                <Text 
                                    onClick={(()=>{router.push(`/suppliers_new/manufacturers/client/${product_data?.manufactured_by_id}`)})} 
                                    color='#009393'
                                    cursor='pointer'
                                > 
                                    {product_data?.manufactured_by}
                                </Text>
                                :
                                <Text 
                                    color='grey'
                                    cursor='pointer'
                                > 
                                    {product_data?.manufactured_by}
                                </Text>
                            }
                        </Box>
                        <Box mt='2'>
                            <Text fontWeight={'semibold'}>Distributed by:</Text>
                            {product_data?.distributed_by_id ?
                                <Text
                                    onClick={(()=>{router.push(`/suppliers_new/distributors/client/${product_data?.distributed_by_id}`)})} 
                                    color='#009393'
                                    cursor='pointer'
                                > 
                                    {product_data?.distributed_by}
                                </Text>
                                :
                                <Text 
                                    color='grey'
                                    cursor='pointer'
                                > 
                                    {product_data?.distributed_by}
                                </Text>
                            }
                        </Box>
                        <Box mt='2'>
                            <Text fontWeight={'semibold'}>Brand:</Text>
                            <Text color='grey'>{product_data?.brand}</Text>
                        </Box>
                        <Box mt='2'>
                            <Text fontWeight={'semibold'}>Chemical name:</Text>
                            <Text color='grey'>{product_data?.chemical_name}</Text>
                        </Box>
                        <Box mt='2'>
                            <Text fontWeight={'semibold'}>Functions:</Text>
                            <Text color='grey'>{product_data?.function}</Text>
                        </Box>
                        <Box mt='2'>
                            <Text fontWeight={'semibold'}>Features & Benefits:</Text>
                            <Text color='grey'>{product_data?.features_of_product}</Text>
                        </Box>
                        <Box mt='2'>
                            <Text fontWeight={'semibold'}>Applications and benefits:</Text>
                            <Text color='grey'>{product_data?.application_of_product}</Text>
                        </Box>
                        <Box mt='2'>
                            <Text fontWeight={'semibold'}>Packaging:</Text>
                            <Text color='grey'>{product_data?.packaging_of_product}</Text>
                        </Box>
                        <Box mt='2'>
                            <Text fontWeight={'semibold'}>Storage & Handling:</Text>
                            <Text color='grey'>{product_data?.storage_of_product}</Text>
                        </Box>
                        <Box mt='2'>
                            <Text fontWeight={'semibold'}>Expiry Date:</Text>
                            <Text color='grey'>{product_data?.short_on_expiry_date ? moment( product_data?.short_on_expiry_date).format("MMM Do YY") : '-'}</Text>
                        </Box>
                    </Box>
                </GridItem>
                <GridItem 
                    colSpan={{
                        base: "5",
                        md: "1",
                    }} 
                    rowSpan={{
                        base: "0",
                        md: "1",
                    }} 
                    
                >
                    <Box 
                        bg='#fff'
                        borderRadius='5'
                        p='2'
                    >
                        <Box 
                            direction='column' 
                            gap='2' 
                            mt='2' 
                            mb='2'
                            
                        >
                            <Box mt='2'>
                                <Text fontWeight={'bold'}>Website</Text>
                                <HStack color='teal' my='2' fontSize='sm'>
                                    <LanguageIcon mx='2px' />
                                    <a href={`${product_data?.website_link_to_Seller}`} target="_blank" rel="noopener noreferrer" style={{width:'200px'}}>{product_data?.website_link_to_Seller}</a>
                                </HStack>
                            </Box>
                            <Box mb='2'>
                                <Text fontWeight={'semibold'}>Created by:</Text>
                                <Text color='grey'>{created_by_name}</Text>
                            </Box>
                            <HStack mb='2'>
                                <Text fontWeight={'semibold'}>Viewed :</Text>
                                <Text color='grey'>{product_data?.views}</Text>
                            </HStack>
                            <HStack mb='2'>
                                <CalendarMonthIcon/>
                                <Text color='gray.600' fontWeight={'semibold'}>{moment( product_data?.created_At).format("MMM Do YY")}</Text>
                            </HStack>
                            <Text fontWeight='bold'>Documents</Text>
                            <Divider/>
                            <VStack align={'flex-start'} flex='1'>
                                {product_data?.data_sheet === ''?
                                    <HStack opacity='0.5' bg='#fff' border='1px' borderColor='grey' borderRadius={5} p='2' mt='2' flex='1' w='full' alignItems={'center'}>
                                        <InsertDriveFileIcon style={{color:'#EA9DB0',fontSize:'20px'}} />
                                        <Tooltip label='Technical Data Sheet missing' placement={'auto'}>
                                            <Text fontWeight={'semibold'}>Technical Data Sheet</Text>
                                        </Tooltip>
                                    </HStack> 
                                    : 
                                    <Link href={product_data?.data_sheet} bg='#fff' border='1px' borderColor='grey' borderRadius={5} p='2' mt='2' flex='1' w='full' alignItems={'center'}>
                                        <InsertDriveFileIcon style={{color:'#EA9DB0',fontSize:'20px'}} /> 
                                        Technical Data Sheet
                                    </Link>
                                }
                                {product_data?.formulation_document === ''?
                                    <HStack opacity='0.5' bg='#fff' border='1px' borderColor='grey' borderRadius={5} p='2' mt='2' flex='1' w='full' alignItems={'center'}>
                                        <InsertDriveFileIcon style={{color:'teal',fontSize:'20px'}} />
                                        <Tooltip label='Fomulation Document missing' placement={'auto'}>
                                            <Text fontWeight={'semibold'}>Fomulation Document</Text>
                                        </Tooltip>
                                    </HStack> 
                                    : 
                                    <Link href={product_data?.formulation_document} bg='#fff' border='1px' borderColor='grey' borderRadius={5} p='2' mt='2' flex='1' w='full' alignItems={'center'}>
                                        <InsertDriveFileIcon style={{color:'teal',fontSize:'20px'}} />
                                        Fomulation Document
                                    </Link>
                                }
                                {product_data?.safety_data_sheet === ''?
                                    <HStack opacity='0.5' bg='#fff' border='1px' borderColor='grey' borderRadius={5} p='2' mt='2' flex='1' w='full' alignItems={'center'}>
                                        <InsertDriveFileIcon style={{color:'grey',fontSize:'20px'}} />
                                        <Tooltip label='Safety Data Sheet missing' placement={'auto'}>
                                            <Text fontWeight={'semibold'}>Safety Data Sheet</Text>
                                        </Tooltip>
                                    </HStack> 
                                    : 
                                    <Link href={product_data?.safety_data_sheet} bg='#fff' border='1px' borderColor='grey' borderRadius={5} p='2' mt='2' flex='1' w='full' alignItems={'center'}>
                                        <InsertDriveFileIcon style={{color:'grey',fontSize:'20px'}} /> 
                                        Safety Data Sheet
                                    </Link>
                                } 
                            </VStack>
                        </Box>
                        <Text fontWeight='bold'>Actions</Text>
                        <Divider/>
                        <HStack bg='gray.100' borderRadius={5} p='2' mt='2' flex='1' w='full' alignItems={'center'} _hover={{bg:'#009393',color:'#fff'}} cursor={'pointer'} transition={'1s ease'} onClick={(()=>{router.push(`/inventory_new/product/edit/${product_data?._id}`)})}>
                            <EditNoteIcon/>
                            <Text>Edit Product</Text>
                        </HStack>
                        <HStack bg='gray.100' borderRadius={5} p='2' mt='2' flex='1' w='full' alignItems={'center'} _hover={{bg:'#009393',color:'#fff'}} cursor={'pointer'} transition={'1s ease'}>
                            <MarkEmailUnreadIcon/>
                            <Text>Email lister</Text>
                        </HStack>
                        {!product_data?.verification_status?
                            <HStack bg='gray.100' borderRadius={5} p='2' mt='2' flex='1' w='full' alignItems={'center'} _hover={{bg:'#009393',color:'#fff'}} cursor={'pointer'} transition={'1s ease'} onClick={Handle_approve_Product}>
                                <InventoryRoundedIcon/>
                                <Text>Un Suspend this product</Text>
                            </HStack>
                            :
                            <HStack  bg='gray.100' borderRadius={5} p='2' mt='2' flex='1' w='full' alignItems={'center'} _hover={{bg:'#009393',color:'#fff'}} cursor={'pointer'} transition={'1s ease'} onClick={Handle_Suspend_Product}>
                                <HighlightOffRoundedIcon/>
                                <Text>Suspend this product</Text>
                            </HStack>
                        }
                        {product_data?.sponsored?
                            <HStack bg='gray.100' borderRadius={5} p='2' mt='2' flex='1' w='full' alignItems={'center'} _hover={{bg:'#009393',color:'#fff'}} cursor={'pointer'} transition={'1s ease'} onClick={Handle_Un_Feature_Product}>
                                <StarOutlineRoundedIcon/>
                                <Text>Un Feature this product</Text>
                            </HStack>
                            :
                            <HStack bg='gray.100' borderRadius={5} p='2' mt='2' flex='1' w='full' alignItems={'center'} _hover={{bg:'#009393',color:'#fff'}} cursor={'pointer'} transition={'1s ease'} onClick={Handle_Feature_Product}>
                                <StarRateRoundedIcon/>
                                <Text>Feature this product</Text>
                            </HStack>
                        }
                        <HStack bg='red.100' borderRadius={5} p='2' mt='2' flex='1' w='full' alignItems={'center'} _hover={{bg:'red.400',color:'#fff'}} cursor={'pointer'} transition={'1s ease'} onClick={(()=>{set_is_delete_product_Modalvisible(true)})}>
                            <DeleteRoundedIcon style={{color:'red'}}/>
                            <Text>Delete this product</Text>
                        </HStack>
                    </Box>
                </GridItem>
            </Grid>
        </Box>
    )
}