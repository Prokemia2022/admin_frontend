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
    AlertTitle,
    AlertDescription,
    Switch,
    AlertIcon,
} from '@chakra-ui/react';
import Navigation from '../../../components/Navigation';
//utils
import {useRouter} from 'next/router';
import Cookies from 'universal-cookie';
import jwt_decode from "jwt-decode";
//components
import Upload_documents from "./upload_documents";
//apis
import Add_New_Product from '../../api/Products/add_new_product.js'
import Get_Technologies from '../../api/controls/get_technologies'
import Get_Industries from '../../api/controls/get_industries';
import Get_Distributors from '../../api/distributors/get_distributors.js';
import Get_Manufacturers from '../../api/manufacturers/get_manufacturers.js';
//icons
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';


export default function New_Product(){
    return(
        <Navigation >
            <Body/>
        </Navigation>
    )
}

const Body=()=>{
    return (
        <Box gap='2' p='2'>
            <VStack justifyContent={'space-between'} align='flex-start'>
                <Text fontSize='32px' fontWeight={'medium'}>Create a new product</Text>
                <Breadcrumb spacing='5px' alignItems={'center'} fontSize={'sm'} fontWeight={'semibold'}>
                    <BreadcrumbItem>
                        <BreadcrumbLink href='/dashboard_new'>Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                        <BreadcrumbLink href='/inventory_new'>inventory</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem isCurrentPage>
                        <BreadcrumbLink color='gray.400'>New Product</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
            </VStack>
            <Box>
                <Details/>
            </Box>
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

    const [auth_role,set_auth_role]=useState("")
//apis
const get_Industries_Data=async()=>{
    await Get_Industries().then((response)=>{
        const data = response.data;
        const result = data.filter(v => v.verification_status);
        set_industries_data(result);
    })
}
const get_Technology_Data=async()=>{
    await Get_Technologies().then((response)=>{
        const data = response.data;
        const result = data.filter(v => v.verification_status);
        set_technologies_data(result);
    })
}
const get_Distributors_Data=async()=>{
    /** api call to fetch distributors data*/
    await Get_Distributors().then((response)=>{
        const data = response?.data;
        const result_data = data.filter((item)=> item?.verification_status && !item?.suspension_status); //filters suppliers that are only verified and not suspended
        set_distributors_data(result_data); //
    })
}

const get_Manufacturers_Data=async()=>{
    /** api call to fetch manufacturers data*/
    await Get_Manufacturers().then((response)=>{
        const data = response?.data;
        const result_data = data.filter((item)=> item?.verification_status && !item?.suspension_status); //filters suppliers that are only verified and not suspended
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


//states
const [is_submitting,set_is_submitting]=useState(false)
const [isfileupload,set_isfileupload]=useState(false);

const [publish_status, set_publish_status]=useState(false);
const [publish_status_info, set_publish_status_info]=useState(false);
const [short_on_expiry_status_info, set_short_on_expiry_status_info]=useState(false);


//payload 
    const [name_of_product,set_name_of_product]=useState('');
    const [email_of_lister,set_email_of_lister]=useState('');
    const [listed_by_id,set_listed_by_id]=useState("admin");
    const [short_on_expiry,set_short_on_expiry]=useState(false);
    const [short_on_expiry_date,set_short_on_expiry_date]=useState('');
    //manufacturer information
    const [manufactured_by,set_manufactured_by]=useState('');
    //seller information
    const [distributed_by,set_distributed_by]=useState('');
    //product information
    const [description_of_product,set_description_of_product]=useState('');
    const [chemical_name,set_chemical_name]=useState('');
    const [product_function,set_product_function]=useState('');
    const [brand,set_brand]=useState('');
    const [features_of_product,set_features_of_product]=useState('');
    const [application_of_product,set_application_of_product]=useState('');
    const [packaging_of_product,set_packaging_of_product]=useState('');
    const [storage_of_product,set_storage_of_product]=useState('');
    //category_of_product
    const [industry,set_industry]=useState('');
    const [technology,set_technology]=useState('');
    //website_link	
    const [website_link,set_website_link]=useState('')

    const payload = {
        name_of_product,
        email_of_lister,
        listed_by_id ,
        short_on_expiry,
        short_on_expiry_date,
        manufactured_by,
        distributed_by,
        description_of_product,
        chemical_name,
        function : product_function,
        brand,
        features_of_product,
        application_of_product,
        packaging_of_product,
        storage_of_product,
        data_sheet_url:'',
        safety_data_sheet_url:'',
        formulation_document_url:'',
        industry,
        technology,
        website_link,
        verification_status: publish_status,
        auth_role
    }

    const handle_add_new_product=async()=>{
        /**
         * handle_add_new_product: sends product payload to server to save product to db.
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
        if(name_of_product && industry && technology && manufactured_by && distributed_by ){
            /**
                Checks if the important fields have been filled and are not missing.
                Returns a alert modal to show the error.
            */
            set_is_submitting(true);
            console.log(payload);
            const response = await Add_New_Product(payload).then((res)=>{
                /**
                    sends a payload data to server to add new product.
                    payload (object): json obj containing information for the new product.
    
                    Return:
                        alerts user whether function runs successfully or not.
                    catch:
                        alerts user when function fails
                */
                
                    toast({
                        title: '',
                        position: 'top-left',
                        variant:"subtle",
                        description: `${payload.name_of_product} has been created`,
                        status: 'success',
                        isClosable: true,
                    });
                    //router.back();
                    Clean_input_data();
                    //set_product_id(response?.data?._id)
                    const response = {
                        _id : res?.data?._id, //saved new_product id
                        auth_role,
                        status: 200
                    }
                    //console.log(response)
                    cookies.set('saved_product_payload', response, { path: '/' });
                    return response;
                }).catch((err)=>{
                    //console.log(err)
                    toast({
                        position: 'top-left',
                        variant:"subtle",
                        title: 'could not create a new product',
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
    }
    const Clean_input_data=()=>{
        set_name_of_product('');
        set_email_of_lister('');
        set_listed_by_id('admin');
        set_short_on_expiry(false);
        set_short_on_expiry_date('');
        //manufacturer information
        set_manufactured_by('');
        //seller information
        set_distributed_by('');
        //product information
        set_description_of_product('');
        set_chemical_name('');
        set_product_function('');
        set_brand('');
        set_features_of_product('');
        set_application_of_product('');
        set_packaging_of_product('');
        set_storage_of_product('');
        //category_of_product
        set_industry('');
        set_technology('');
        //website_link	
        set_website_link('');
    }
    //useEffects
    useEffect(()=>{
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
            //console.log(decoded);
            set_auth_role(decoded?.role);
            get_Industries_Data()
            get_Technology_Data()
          }
    },[])
    useEffect(()=>{
        get_Distributors_Data()
    },[distributed_by])
    useEffect(()=>{
        get_Manufacturers_Data()
    },[manufactured_by])

    //input error handlers
    const [input_error,set_input_error]=useState(false);
    return(
        <Box py='2'>
            {isfileupload?
                <Box bg='#fff' borderRadius={8} mt='4' p='4' py='4'>
                    <Text fontWeight={'bold'} fontSize={'2xl'} color='teal.400' >Documents</Text>
                    <Upload_documents
                        set_isfileupload={set_isfileupload}
                        handle_add_new_product={handle_add_new_product}
                    />
                </Box>
                :
                <Box>
                    <Box bg='#fff' borderRadius={8} mt='4' p='4'>
                        <Text fontWeight={'bold'} fontSize={'lg'} color='#009393'>Details</Text>
                        <Divider/>
                        <FormControl mt='2' isRequired isInvalid={input_error && name_of_product == '' ? true : false}>
                            <FormLabel>Name</FormLabel>
                            <Input value={name_of_product} placeholder='Name of the product' type='text' onChange={((e)=>{set_name_of_product(e.target.value)})}/>
                            {input_error && name_of_product == '' ? 
                                <FormErrorMessage>Name of the product is required.</FormErrorMessage>
                               : (
                                null
                            )}
                        </FormControl>
                        <FormControl mt='2' isRequired isInvalid={input_error && description_of_product == '' ? true : false}>
                            <FormLabel>Description</FormLabel>
                            <Textarea value={description_of_product} type='text' placeholder='Give a detailed description of the product' onChange={((e)=>{set_description_of_product(e.target.value)})}/>
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
                        <FormControl mt='2' isRequired isInvalid={input_error && email_of_lister == '' ? true : false}>
                            <FormLabel>Contact email of the company</FormLabel>
                            <Input value={email_of_lister} type='text' placeholder='This contact will be used to request quotations and samples' onChange={((e)=>{set_email_of_lister(e.target.value)})}/>
                            {input_error && email_of_lister == '' ? 
                                <FormErrorMessage>Contact email of the company is required.</FormErrorMessage>
                               : (
                                null
                            )}
                        </FormControl>
                        <Wrap mt='2'>
                            <FormControl isRequired isInvalid={input_error && manufactured_by == '' ? true : false}>
                                <FormLabel>Manufactured_by</FormLabel>
                                <HStack>
                                    <Input value={manufactured_by} type='text' placeholder='This product is manufactured by' onChange={((e)=>{set_manufactured_by(e.target.value);})}/>
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
                                                            <HStack cursor={'pointer'} minH='48px' key={manufacturer?._id} onClick={(()=>set_manufactured_by(manufacturer?.company_name))}>
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
                                    <Input value={distributed_by} type='text' placeholder='This product is distributed by' onChange={((e)=>{set_distributed_by(e.target.value);})}/>
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
                                                            <HStack cursor={'pointer'} minH='48px' key={distributor?._id} onClick={(()=>set_distributed_by(distributor?.company_name))}>
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
                        </Wrap>
                    </Box>
                    <Box bg='#fff' borderRadius={8} mt='4' p='4'>
                        <Text fontWeight={'bold'} fontSize={'lg'} color='#009393'>Identification & Functionality</Text>
                        <Divider/>
                        <FormControl mt='2'>
                            <FormLabel>Brand name</FormLabel>
                            <Input value={brand} placeholder='Brand name' type="text" onChange={((e)=>{set_brand(e.target.value)})}/>
                        </FormControl>
                        <FormControl mt='2'>
                            <FormLabel>Chemical Family</FormLabel>
                            <Input type='text' value={chemical_name} placeholder='Chemical Family' onChange={((e)=>{set_chemical_name(e.target.value)})}/>
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
                            <Textarea type='text' value={product_function} placeholder='function of the product' onChange={((e)=>{set_product_function(e.target.value)})}/>
                        </FormControl>
                        <FormControl mt='2'>
                            <FormLabel>Applications</FormLabel>
                            <Textarea type='text' value={application_of_product} placeholder='application of the product' onChange={((e)=>{set_application_of_product(e.target.value)})}/>
                        </FormControl>
                        <FormControl mt='2'>
                            <FormLabel>Features and Benefits</FormLabel>
                            <Textarea type='text' value={features_of_product}  placeholder='Features of the product' onChange={((e)=>{set_features_of_product(e.target.value)})}/>
                        </FormControl>
                    </Box>
                    <Box bg='#fff' borderRadius={8} mt='4' p='4'>
                        <Text fontWeight={'bold'} fontSize={'lg'} color='#009393'>Regulatory and compliance</Text>
                        <Divider/>
                        <FormControl mt='2'>
                            <FormLabel>Packaging & availability</FormLabel>
                            <Textarea type='text' value={packaging_of_product} placeholder='packaging availability of the product' onChange={((e)=>{set_packaging_of_product(e.target.value)})}/>
                        </FormControl>
                        <FormControl mt='2'>
                            <FormLabel>Storage & Handling</FormLabel>
                            <Textarea type='text' value={storage_of_product} placeholder='storage and handling  of the product' onChange={((e)=>{set_storage_of_product(e.target.value)})}/>
                        </FormControl>
                        {short_on_expiry_status_info?
                            <Alert status='info' mt='2'>
                                <AlertIcon />
                                <AlertTitle>Short on expiry status!</AlertTitle>
                                <AlertDescription>
                                    Toggling this button will list the product as expiring soon.
                                </AlertDescription>
                            </Alert>
                            :
                            null
                        }
                        <FormControl display='flex' alignItems='center' mt='4' gap='2'>
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
                    <Box bg='#fff' borderRadius={8} mt='4' p='4'>
                        <Text fontWeight={'bold'} fontSize={'lg'} color='#009393'>Listing status</Text>
                        {publish_status_info?
                            <Alert status='info' mt='2'>
                                <AlertIcon />
                                <AlertTitle>Publish Status!</AlertTitle>
                                <AlertDescription>
                                    Toggling this button will directly publish the product without review.
                                </AlertDescription>
                            </Alert>
                            :
                            null
                        }
                        <FormControl display='flex' alignItems='center' mt='4' gap='2'>
                            <InfoOutlinedIcon style={{cursor:'pointer'}} onClick={(()=>{set_publish_status_info(!publish_status_info)})}/>
                            <FormLabel htmlFor='publish_status' mb='0'>
                                Publish
                            </FormLabel>
                            <Switch id='publish_status' isChecked={publish_status} onChange={(()=>{set_publish_status(!publish_status)})}/>
                        </FormControl>
                    </Box>
                    <Box mt='2' align='end' gap='2'>
                        <Tooltip hasArrow label='proceed to add documents' placement='auto' >
                            <Button onClick={(()=>{set_isfileupload(true)})}>Add documents</Button>
                        </Tooltip>
                        <Tooltip hasArrow label='Save product details and add files later'  placement='auto'>
                            <Button ml={'2'} bg='#009393' color='#fff' onClick={handle_add_new_product} >Create product</Button>
                        </Tooltip>
                    </Box>
                </Box>
            }
        </Box>
    )
}
  