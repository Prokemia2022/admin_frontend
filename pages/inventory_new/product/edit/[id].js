import React, { useEffect, useState } from "react";
import {
    Text, 
    Box, 
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    VStack,
    Input,
    Textarea,
    HStack,
    Select,
    Divider,
    Wrap,
    Button,
    Tooltip,
    Heading,
    useToast,
    Menu,
    MenuButton,
    MenuList,
    IconButton,
    MenuItem,
    Image,
    Avatar,
    Popover,
    PopoverTrigger,
    Portal,
    PopoverContent,
    PopoverArrow,
    PopoverCloseButton,
    PopoverBody,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Switch,
} from '@chakra-ui/react';
import Navigation from '../../../../components/Navigation';
//utils
import {useRouter} from 'next/router';
import Cookies from 'universal-cookie';
import jwt_decode from "jwt-decode";
//components
import Edit_documents from "./edit_documents";
//apis
import Get_Technologies from '../../../api/controls/get_technologies'
import Get_Industries from '../../../api/controls/get_industries';
import Get_Distributors from '../../../api/distributors/get_distributors.js';
import Get_Manufacturers from '../../../api/manufacturers/get_manufacturers.js';
import Get_Product from '../../../api/Products/get_product.js';
import Edit_Product from '../../../api/Products/edit_product.js';
//icons
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import moment from "moment";


export default function Edit_Product_Page(){
    return(
        <Navigation >
            <Body/>
        </Navigation>
    )
}

const Body=()=>{
    const router = useRouter();
    return (
        <Box gap='2' p='2'>
            <Details/>
        </Box>
    )
}

const Details=()=>{
    /**
	 * Add_product: Form that enables the listing of a new product.
	 */
//modules
const toast = useToast();
const router = useRouter();
const cookies = new Cookies();
let token = cookies.get('admin_token');
//utils
const id = router.query;
const product_payload = {
    _id : id?.id
}

const [auth_role,set_auth_role]=useState("");
//apis
const get_Product_Data=async()=>{
    await Get_Product(product_payload).then((response)=>{
        set_product_data(response.data)
        //console.log(response.data)
    })
}
const get_Industries_Data=async()=>{
    await Get_Industries().then((response)=>{
        const data = response.data
        const result = data.filter(v => v.verification_status)
        set_industries_data(result)
    })
}
const get_Technology_Data=async()=>{
    await Get_Technologies().then((response)=>{
        const data = response.data
        const result = data.filter(v => v.verification_status)
        set_technologies_data(result)
    })
}
const get_Distributors_Data=async()=>{
    /** api call to fetch distributors data*/
    await Get_Distributors().then((response)=>{
        const data = response?.data;
        const result_data = data.filter((item)=> item?.verification_status && !item?.suspension_status); //filters users that are only verified and not suspended
        set_distributors_data(result_data); //
    })
}

const get_Manufacturers_Data=async()=>{
    /** api call to fetch manufacturers data*/
    await Get_Manufacturers().then((response)=>{
        const data = response?.data;
        const result_data = data.filter((item)=> item?.verification_status && !item?.suspension_status); //filters users that are only verified and not suspended
        set_manufacturers_data(result_data);
    })
}
//utils

//usestates

//data
const [industries_data, set_industries_data]=useState([]);
const [technologies_data, set_technologies_data]=useState([]);
const [distributors_data,set_distributors_data]=useState([]);
const [manufacturers_data,set_manufacturers_data]=useState([]);
const [product_data,set_product_data]=useState('');

const [joined_suppliers_data,set_joined_suppliers_data]=useState([]);


//states
const [is_submitting,set_is_submitting]=useState(false);
const [is_editfiles,set_iseditfiles]=useState(false);
const [short_on_expiry_status_info, set_short_on_expiry_status_info]=useState(false);

//payload 
    const [name_of_product,set_name_of_product]=useState(product_data?.name_of_product);
    const [short_on_expiry,set_short_on_expiry]=useState(product_data?.short_on_expiry);
    const [short_on_expiry_date,set_short_on_expiry_date]=useState(product_data?.short_on_expiry_date);
    //manufacturer information
    const [manufactured_by,set_manufactured_by]=useState(product_data?.manufactured_by);
    const [manufactured_by_id,set_manufactured_by_id]=useState(product_data?.manufactured_by_id);
    //seller information
    const [distributed_by,set_distributed_by]=useState(product_data?.distributed_by);
    const [distributed_by_id,set_distributed_by_id]=useState(product_data?.distributed_by_id);
    //lister
    const [listed_by_id,set_listed_by_id]=useState(product_data?.listed_by_id);
    //product information
    const [description_of_product,set_description_of_product]=useState(product_data?.description_of_product);
    const [chemical_name,set_chemical_name]=useState(product_data?.chemical_name);
    const [product_function,set_product_function]=useState(product_data?.product_function);
    const [brand,set_brand]=useState(product_data?.brand);
    const [features_of_product,set_features_of_product]=useState(product_data?.features_of_product);
    const [application_of_product,set_application_of_product]=useState(product_data?.application_of_product);
    const [packaging_of_product,set_packaging_of_product]=useState(product_data?.packaging_of_product);
    const [storage_of_product,set_storage_of_product]=useState(product_data?.storage_of_product);
    //category_of_product
    const [industry,set_industry]=useState(product_data?.industry);
    const [technology,set_technology]=useState(product_data?.technology);
    //website_link	
    const [website_link,set_website_link]=useState(product_data?.website_link)

    const payload = {
        _id: product_data?._id,
        name_of_product,
        short_on_expiry,
        short_on_expiry_date,
        manufactured_by,
        distributed_by,
        manufactured_by_id,
        distributed_by_id,
        listed_by_id,
        description_of_product,
        chemical_name,
        function : product_function,
        brand,
        features_of_product,
        application_of_product,
        packaging_of_product,
        storage_of_product,
        industry,
        technology,
        website_link_to_Seller : website_link,
        auth_role
    }

    const Handle_Edit_Product=async()=>{
        /**
         * Handle_Edit_Product: sends edited product payload to server to save product to db.
         * Props:
         * 		payload(obj): json data containing product details.
        */
        if (name_of_product === '' || industry === '' || technology === '' || manufactured_by === "" || distributed_by === "" || (short_on_expiry && short_on_expiry_date == '') ){
            /**
                Checks if the required fields have been filled and are not missing.
                Returns a alert modal to show the error.
            */
           if( short_on_expiry && short_on_expiry_date == ''){
                set_input_error(true)
                return toast({
                    title: '',
                    position: 'top-left',
                    variant:"subtle",
                    description: `Ensure all inputs are filled`,
                    status: 'info',
                    isClosable: true,
                });
            }else{
                set_input_error(true)
                return toast({
                    title: '',
                    position: 'top-left',
                    variant:"subtle",
                    description: `Ensure all inputs are filled`,
                    status: 'info',
                    isClosable: true,
                });
            }
        }
        set_is_submitting(true);
        //console.log(payload);
        const response = await Edit_Product(payload).then((res)=>{
            /**
                sends a payload data to server to edit product.
                payload (object): json obj containing information for the product.

                Return:
                    alerts user whether function runs successfully or not.
                catch:
                    alerts user when function fails
            */
                toast({
                    title: '',
                    position: 'top-left',
                    variant:"subtle",
                    description: `product has been edited successfully`,
                    status: 'success',
                    isClosable: true,
                });
                const response = {
                    _id : product_data?._id,
                    auth_role,
                    status: 200
                }
                router.back()
                //console.log(response)
                return response;
            }).catch((err)=>{
                //console.log(err)
                toast({
                    position: 'top-left',
                    variant:"subtle",
                    title: 'could not edit product',
                    description: err.response.data,
                    status: 'error',
                    isClosable: true,
                })
                const response = {
                    status: err.response.status
                }
                return response;
            }).finally(()=>{
                set_is_submitting(false);
            })
        //console.log(response)
        return response;
    }
    //useEffects
		useEffect(()=>{
			if (payload._id || id.id ){
				let decoded = jwt_decode(token);
				//console.log(decoded);
				set_auth_role(decoded?.role);
				get_Industries_Data()
				get_Technology_Data()
				get_Product_Data()
                
			  }
		},[])
		useEffect(()=>{
			get_Distributors_Data()
		},[distributed_by])
		useEffect(()=>{
			get_Manufacturers_Data()
		},[manufactured_by])
        useEffect(()=>{
			set_joined_suppliers_data([...manufacturers_data, ...distributors_data]);
		},[listed_by_id])

    //input error handlers
    const [input_error,set_input_error]=useState(false);
    return(
        <Box py='2'>
            <VStack justifyContent={'space-between'} align='flex-start'>
                <Text fontSize='32px' fontWeight={'medium'}>Edit product</Text>
                <Breadcrumb spacing='5px' alignItems={'center'} fontSize={'sm'} fontWeight={'semibold'}>
                    <BreadcrumbItem>
                        <BreadcrumbLink href='/dashboard_new'>Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                        <BreadcrumbLink href='/inventory_new'>inventory</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem onClick={(()=>{router.back()})}>
                        <BreadcrumbLink >Product</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem isCurrentPage>
                        <BreadcrumbLink color='gray.400'>{product_data?.name_of_product}</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
            </VStack>
            {is_editfiles?
                <Box bg='#fff' borderRadius={8} mt='4' p='4' py='4'>
                    <Text fontWeight={'bold'} fontSize={'2xl'} color='teal.400' >Documents</Text>
                    <Edit_documents 
                        product_data={product_data} 
                        set_iseditfiles={set_iseditfiles}
                        auth_role={auth_role}
                    />
                </Box>
                :
                <Box>
                    <Box bg='#fff' borderRadius={8} mt='4' p='4'>
                        <Text fontWeight={'bold'} fontSize={'lg'} color='#009393'>Details</Text>
                        <Divider/>
                        <FormControl mt='2' isRequired isInvalid={input_error && name_of_product == '' ? true : false}>
                            <FormLabel>Name</FormLabel>
                            <Input value={name_of_product} placeholder={product_data?.name_of_product} type='text' onChange={((e)=>{set_name_of_product(e.target.value)})}/>
                            {input_error && name_of_product == '' ? 
                                <FormErrorMessage>Name of the product is required.</FormErrorMessage>
                               : (
                                null
                            )}
                        </FormControl>
                        <FormControl mt='2' isRequired isInvalid={input_error && description_of_product == '' ? true : false}>
                            <FormLabel>Description</FormLabel>
                            <Textarea value={description_of_product} type='text' placeholder={product_data?.description_of_product} onChange={((e)=>{set_description_of_product(e.target.value)})}/>
                            {input_error && description_of_product == '' ? 
                                <FormErrorMessage>Description of the product is required.</FormErrorMessage>
                               : (
                                null
                            )}
                        </FormControl>
                    </Box>
                    <Box bg='#fff' borderRadius={8} mt='4' p='4'>
                        <Text fontWeight={'bold'} fontSize={'lg'} color='#009393'>Listing details</Text>
                        <Divider/>
                        <Wrap mt='2'>
                            <FormControl isRequired isInvalid={input_error && manufactured_by == '' ? true : false}>
                                <FormLabel>Manufactured_by</FormLabel>
                                <HStack>
                                    <Input value={manufactured_by} type='text' placeholder={product_data?.manufactured_by} onChange={((e)=>{set_manufactured_by(e.target.value);})}/>
                                    <Popover placement={'auto'}>
                                        <PopoverTrigger bg='gray.200' p='1' borderRadius={5}>
                                            <PersonSearchIcon />
                                        </PopoverTrigger>
                                        <Portal>
                                            <PopoverContent>
                                                <PopoverArrow />
                                                <PopoverCloseButton />
                                                    <PopoverBody>
                                                    {manufacturers_data?.map((manufacturer)=>{
                                                        return(
                                                            <HStack cursor={'pointer'} minH='48px' key={manufacturer?._id} onClick={(()=>{set_manufactured_by(manufacturer?.company_name);set_manufactured_by_id(manufacturer?._id)})}>
                                                                <Avatar
                                                                    boxSize='2rem'
                                                                    borderRadius='full'
                                                                    src={manufacturer?.profile_photo_url}
                                                                    name={manufacturer?.company_name}
                                                                    objectFit={'cover'}
                                                                    mr='12px'
                                                                />
                                                                <Text>{manufacturer.company_name}</Text>
                                                            </HStack>
                                                        )
                                                    })}
                                                    </PopoverBody>
                                            </PopoverContent>
                                        </Portal>
                                    </Popover>
                                </HStack>
                                {input_error && manufactured_by == '' ? 
                                    <FormErrorMessage>A manufacturer account is required.</FormErrorMessage>
                                : (
                                    null
                                )}
                            </FormControl>
                            <FormControl isRequired isInvalid={input_error && distributed_by == '' ? true : false}>
                                <FormLabel>Distributed by</FormLabel>
                                <HStack>
                                    <Input value={distributed_by} type='text' placeholder={product_data?.distributed_by} onChange={((e)=>{set_distributed_by(e.target.value);})}/>
                                    <Popover placement={'auto'}>
                                        <PopoverTrigger bg='gray.200' p='1' borderRadius={5}>
                                            <PersonSearchIcon />
                                        </PopoverTrigger>
                                        <Portal>
                                            <PopoverContent>
                                                <PopoverArrow />
                                                <PopoverCloseButton />
                                                    <PopoverBody>
                                                    {distributors_data?.map((distributor)=>{
                                                        return(
                                                            <HStack cursor={'pointer'} minH='48px' key={distributor?._id} onClick={(()=>{set_distributed_by(distributor?.company_name);set_distributed_by_id(distributor?._id)})}>
                                                                <Avatar
                                                                    boxSize='2rem'
                                                                    borderRadius='full'
                                                                    src={distributor?.profile_photo_url}
                                                                    name={distributor?.company_name}
                                                                    objectFit={'cover'}
                                                                    mr='12px'
                                                                />
                                                                <Text>{distributor.company_name}</Text>
                                                            </HStack>
                                                        )
                                                    })}
                                                    </PopoverBody>
                                            </PopoverContent>
                                        </Portal>
                                    </Popover>
                                </HStack>
                                {input_error && distributed_by == '' ? 
                                    <FormErrorMessage>A distributor account is required.</FormErrorMessage>
                                : (
                                    null
                                )}
                            </FormControl>
                            <FormControl isRequired isInvalid={input_error && distributed_by == '' ? true : false}>
                                <FormLabel>Listed by</FormLabel>
                                <HStack>
                                    <Input value={listed_by_id} type='text' placeholder={product_data?.listed_by_id} onChange={((e)=>{set_listed_by_id(e.target.value);})}/>
                                    <Popover placement={'auto'}>
                                        <PopoverTrigger bg='gray.200' p='1' borderRadius={5}>
                                            <PersonSearchIcon />
                                        </PopoverTrigger>
                                        <Portal>
                                            <PopoverContent>
                                                <PopoverArrow />
                                                <PopoverCloseButton />
                                                    <PopoverBody>
                                                    {joined_suppliers_data?.map((supplier)=>{
                                                        return(
                                                            <HStack cursor={'pointer'} minH='48px' key={supplier?._id} onClick={(()=>{set_listed_by_id(supplier?._id)})}>
                                                                <Avatar
                                                                    boxSize='2rem'
                                                                    borderRadius='full'
                                                                    src={supplier?.profile_photo_url}
                                                                    name={supplier?.company_name}
                                                                    objectFit={'cover'}
                                                                    mr='12px'
                                                                />
                                                                <Text>{supplier.company_name}</Text>
                                                            </HStack>
                                                        )
                                                    })}
                                                    </PopoverBody>
                                            </PopoverContent>
                                        </Portal>
                                    </Popover>
                                </HStack>
                                {input_error && distributed_by == '' ? 
                                    <FormErrorMessage>A supplier account is required to show who owns the product.</FormErrorMessage>
                                : (
                                    null
                                )}
                            </FormControl>
                        </Wrap>
                    </Box>
                    <Box bg='#fff' borderRadius={8} mt='4' p='4'>
                        <Text fontWeight={'bold'} fontSize={'lg'} color='#009393'>Identification & Functionality</Text>
                        <Divider/>
                        <FormControl mt='2'>
                            <FormLabel>Brand name</FormLabel>
                            <Input value={brand} placeholder={product_data?.brand} type="text" onChange={((e)=>{set_brand(e.target.value)})}/>
                        </FormControl>
                        <FormControl mt='2'>
                            <FormLabel>Chemical Family</FormLabel>
                            <Input type='text' value={chemical_name} placeholder={product_data?.chemical_name} onChange={((e)=>{set_chemical_name(e.target.value)})}/>
                        </FormControl>
                        <Wrap mt='2'>
                            <FormControl isRequired isInvalid={input_error && industry == '' ? true : false}>
                                <FormLabel>Industry</FormLabel>
                                <Select value={industry} placeholder='select industry product will be categorized' onChange={((e)=>{set_industry(e.target.value)})}>
                                    {industries_data?.map((item)=>{
                                        return(
                                            <option key={item?._id} value={item?.title}>{item?.title}</option>
                                        )
                                    })}
                                </Select>
                                {input_error && industry == '' ? 
                                    <FormErrorMessage>A industry is required.</FormErrorMessage>
                                : (
                                    null
                                )}
                            </FormControl>
                            <FormControl isRequired isInvalid={input_error && technology == '' ? true : false}>
                                <FormLabel>Technology</FormLabel>
                                <Select value={technology} placeholder='select technology product will be categorized' onChange={((e)=>{set_technology(e.target.value)})} >
                                    {technologies_data?.map((item)=>{
                                        return(
                                            <option key={item?._id} value={item?.title}>{item?.title}</option>

                                        )
                                    })}
                                </Select>
                                {input_error && technology == '' ? 
                                    <FormErrorMessage>A technology is required.</FormErrorMessage>
                                : (
                                    null
                                )}
                            </FormControl>
                        </Wrap>
                    </Box>
                    <Box bg='#fff' borderRadius={8} mt='4' p='4'>
                        <Text fontWeight={'bold'} fontSize={'lg'} color='#009393'>Application & Uses</Text>
                        <Divider/>
                        <FormControl mt='2'>
                            <FormLabel>Function</FormLabel>
                            <Textarea type='text' value={product_function} placeholder={product_data?.function} onChange={((e)=>{set_product_function(e.target.value)})}/>
                        </FormControl>
                        <FormControl mt='2'>
                            <FormLabel>Applications</FormLabel>
                            <Textarea type='text' value={application_of_product} placeholder={product_data?.application_of_product} onChange={((e)=>{set_application_of_product(e.target.value)})}/>
                        </FormControl>
                        <FormControl mt='2'>
                            <FormLabel>Features and Benefits</FormLabel>
                            <Textarea type='text' value={features_of_product}  placeholder={product_data?.features_of_product} onChange={((e)=>{set_features_of_product(e.target.value)})}/>
                        </FormControl>
                    </Box>
                    <Box bg='#fff' borderRadius={8} mt='4' p='4'>
                        <Text fontWeight={'bold'} fontSize={'lg'} color='#009393'>Regulatory and compliance</Text>
                        <Divider/>
                        <FormControl mt='2'>
                            <FormLabel>Packaging & availability</FormLabel>
                            <Textarea type='text' value={packaging_of_product} placeholder={product_data?.packaging_of_product} onChange={((e)=>{set_packaging_of_product(e.target.value)})}/>
                        </FormControl>
                        <FormControl mt='2'>
                            <FormLabel>Storage & Handling</FormLabel>
                            <Textarea type='text' value={storage_of_product} placeholder={product_data?.storage_of_product} onChange={((e)=>{set_storage_of_product(e.target.value)})}/>
                        </FormControl>
                        {short_on_expiry_date !== ''?
                            <Text mt='2'>Expiring on: { moment( product_data?.short_on_expiry_date).format("MMM Do YY")}</Text>
                            :
                            null
                        }
                        {short_on_expiry_status_info?
                            <Alert status='info' mt='1'>
                                <AlertIcon />
                                <AlertTitle>Short on expiry status!</AlertTitle>
                                <AlertDescription>
                                    Toggling this button will list the product as expiring soon.
                                </AlertDescription>
                            </Alert>
                            :
                            null
                        }
                        <FormControl display='flex' alignItems='center' mt='2' gap='2'>
                            <InfoOutlinedIcon style={{cursor:'pointer'}} onClick={(()=>{set_short_on_expiry_status_info(!short_on_expiry_status_info)})}/>
                            <FormLabel htmlFor='short_on_expiry_status' mb='0'>
                                List this product as short on expiry
                            </FormLabel>
                            <Switch id='short_on_expiry_status' isChecked={short_on_expiry} onChange={(()=>{set_short_on_expiry(!short_on_expiry);set_short_on_expiry_date('')})}/>
                        </FormControl>
                        {short_on_expiry?
                            <FormControl mt='2' isRequired isInvalid={input_error && short_on_expiry_date == '' &&  short_on_expiry ? true : false}>
                                <FormLabel>Short on expiry date</FormLabel>
                                <Input type='date' value={short_on_expiry_date} placeholder='storage and handling  of the product' onChange={((e)=>{set_short_on_expiry_date(e.target.value)})}/>
                                {input_error && short_on_expiry_date == '' &&  short_on_expiry ? 
                                    <FormErrorMessage>An expiration date is required.</FormErrorMessage>
                                : (
                                    null
                                )}
                            </FormControl>
                            :
                            null
                        }
                    </Box>
                    <Box bg='#fff' borderRadius={8} mt='4' p='4'>
                        <Text fontWeight={'bold'} fontSize={'lg'} color='#009393'>Company external details</Text>
                        <Divider/>
                        <FormControl mt='2'>
                            <FormLabel>Website link</FormLabel>
                            <Input type='url' value={website_link} placeholder='website link to the company' onChange={((e)=>{set_website_link(e.target.value)})}/>
                        </FormControl>
                    </Box>
                    <Box mt='2' align='end' gap='2'>
                        <Tooltip hasArrow label='proceed to edit documents' placement='auto' >
                            <Button onClick={(()=>{set_iseditfiles(true)})}>Edit documents</Button>
                        </Tooltip>
                        <Tooltip hasArrow label='Save product details'  placement='auto'>
                            <Button ml={'2'} bg='#009393' color='#fff' onClick={Handle_Edit_Product}>Save product</Button>
                        </Tooltip>
                    </Box>
                </Box>
            }
        </Box>
    )
}