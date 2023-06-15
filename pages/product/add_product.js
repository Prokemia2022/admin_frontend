//modules imports
import React,{useState,useEffect} from 'react'
import {Flex,Text,Button,Input,Textarea,Select,useToast} from '@chakra-ui/react'
import {useRouter} from 'next/router'
//api calls 
import Add_New_Product from '../api/Products/add_new_product.js'
import Get_Technologies from '../api/controls/get_technologies'
import Get_Industries from '../api/controls/get_industries';
import Get_Distributors from '../api/distributors/get_distributors.js';
import Get_Manufacturers from '../api/manufacturers/get_manufacturers.js';
//components imports
import Loading from '../../components/Loading.js'
import Header from '../../components/Header';
import Upload_File from './upload_files_test.js'
//styles
import styles from '../../styles/Home.module.css';
//utils
import Cookies from 'universal-cookie';
import jwt_decode from "jwt-decode";


export default function Add_Product(){
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
			//console.log(response.data)
			const data = response.data
			const result = data.filter(v => v.verification_status)
			//console.log(data.filter(v => v.verification_status))
			set_industries_data(result)
		})
	}
	const get_Technology_Data=async()=>{
		await Get_Technologies().then((response)=>{
			//console.log(response.data)
			const data = response.data
			const result = data.filter(v => v.verification_status)
			//console.log(data.filter(v => v.verification_status))
			set_technologies_data(result)
		})
	}
	const get_Distributors_Data=async()=>{
		/** api call to fetch distributors data*/
		await Get_Distributors().then((response)=>{
			const data = response?.data;
			const result_data = data.filter((item)=> item?.verification_status && !item?.suspension_status); //filters users that are only verified and not suspended
			let filtered_data = result_data.filter((item) =>item?.company_name.toLowerCase().includes(distributed_by.toLowerCase()))
			//console.log(filtered_data.length)
			set_distributors_data(filtered_data); //
			if (filtered_data.length === 0) {
				set_distributed_by_suggestion_query_modal(false);
			}
		})
	}
	
	const get_Manufacturers_Data=async()=>{
		/** api call to fetch manufacturers data*/
		await Get_Manufacturers().then((response)=>{
			const data = response?.data;
			const result_data = data.filter((item)=> item?.verification_status && !item?.suspension_status); //filters users that are only verified and not suspended
			let filtered_data = result_data.filter((item) =>item?.company_name.toLowerCase().includes(manufactured_by.toLowerCase()))
			//console.log(filtered_data.length)
			set_manufacturers_data(filtered_data);
			if (filtered_data.length === 0) {
				set_manufactured_by_suggestion_query_modal(false);
			}
		})
	}
	//utils
//usestates:
	const [distributed_by_suggestion_query_modal,set_distributed_by_suggestion_query_modal]=useState(false);
	const [manufactured_by_suggestion_query_modal,set_manufactured_by_suggestion_query_modal]=useState(false);

	//data
	const [industries_data, set_industries_data]=useState([]);
	const [technologies_data, set_technologies_data]=useState([]);
	const [distributors_data,set_distributors_data]=useState([]);
	const [manufacturers_data,set_manufacturers_data]=useState([]);


	//states
	const [is_submitting,set_is_submitting]=useState(false)
	const [isfileupload,set_isfileupload]=useState(false);
	
	//payload 
		const [name_of_product,set_name_of_product]=useState('');
		const [email_of_lister,set_email_of_lister]=useState('');
		const [listed_by_id,set_listed_by_id]=useState("admin");
		const [short_on_expiry,set_short_on_expiry]=useState(false);
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
			auth_role
		}

		const handle_add_new_product=async()=>{
			/**
			 * handle_add_new_product: sends product payload to server to save product to db.
			 * Props:
			 * 		payload(obj): json data containing product details.
			*/
			if (name_of_product === '' || industry === '' || technology === '' || manufactured_by === "" || distributed_by === ""){
				/**
					Checks if the required fields have been filled and are not missing.
					Returns a alert modal to show the error.
				*/
				return toast({
					title: '',
					position: 'top-left',
					variant:"subtle",
					description: `Ensure all inputs are filled`,
					status: 'info',
					isClosable: true,
				});
			}
			if(name_of_product && industry && technology && manufactured_by && distributed_by){
				/**
					Checks if the important fields have been filled and are not missing.
					Returns a alert modal to show the error.
				*/
				set_is_submitting(true);
				//console.log(payload);
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
	return(
		<Flex direction='column'>
			<Header />
			{isfileupload?
				<Flex h='90vh' justify='center' align='center'>
					<Upload_File 
						handle_add_new_product={handle_add_new_product}
						set_isfileupload={set_isfileupload}
					/>
				</Flex>
			:
				<Flex className={styles.productbody} direction='column' p='3' gap='3'>
					<Text fontSize='32px' fontWeight='bold'>Add New Product</Text>
					<Flex direction='column'>
						<Text>Name/Title of product</Text>
						<Input type='text' value={name_of_product} placeholder='Name of product' variant='filled' onChange={((e)=>{set_name_of_product(e.target.value)})}/>
					</Flex>
					<Flex direction='column'>
						<Text>Brand Name</Text>
						<Input type='text' value={brand} placeholder='Brand Name' variant='filled' onChange={((e)=>{set_brand(e.target.value)})}/>
					</Flex>
					<Flex direction='column'>
						<Text>Chemical Family</Text>
						<Input type='text' value={chemical_name} placeholder='Chemical Family' variant='filled' onChange={((e)=>{set_chemical_name(e.target.value)})}/>
					</Flex>
					<Flex direction='column'>
						<Text>Description</Text>
						<Textarea type='text' value={description_of_product} placeholder='Description' variant='filled' onChange={((e)=>{set_description_of_product(e.target.value)})}/>
					</Flex>
					<Flex gap='2'>
						<Flex direction='column' flex='1' position='relative'>
							<Text>Manufactured by:</Text>
							<Input type='text' placeholder='manufactured by' value={manufactured_by} variant='filled' onChange={((e)=>{set_manufactured_by(e.target.value);set_manufactured_by_suggestion_query_modal(true)})}/>
							{manufactured_by !== '' && manufactured_by_suggestion_query_modal?
								<>
								{manufacturers_data.length === 0? null : 
									<Flex direction='column' w='100%' h='15vh' boxShadow='dark-lg' padding='2' borderRadius='5' mt='2' position='absolute' bg='#fff' zIndex='99' top='60px' overflowY='scroll'>
										{manufacturers_data?.map((manufacturer)=>{
											return(
												<Text key={manufacturer?._id} cursor='pointer' bg='#eee' p='1' m='1' borderRadius='5' onClick={(()=>{set_manufactured_by(manufacturer?.company_name);set_manufactured_by_suggestion_query_modal(false)})} fontSize='14px' fontFamily='ClearSans-Bold'>{manufacturer.company_name}</Text>
											)
										})}
									</Flex>}
								</>
							: null}
						</Flex>
						<Flex direction='column' flex='1' position='relative'>
							<Text>Sold by</Text>
							<Input type='text' placeholder='Sold by' value={distributed_by} variant='filled' onChange={((e)=>{set_distributed_by(e.target.value);set_distributed_by_suggestion_query_modal(true)})} />
							{distributed_by_suggestion_query_modal && distributed_by !== ''?
								<>
								{distributors_data.length === 0? null : 
									<Flex direction='column' w='100%' h='15vh' boxShadow='dark-lg' padding='2' borderRadius='5' mt='2' position='absolute' bg='#fff' zIndex='99' top='60px' overflowY='scroll'>
										{distributors_data?.map((distributor)=>{
											return(
												<Text key={distributor?._id} cursor='pointer' bg='#eee' p='1' m='1' borderRadius='5' onClick={(()=>{set_distributed_by(distributor?.company_name);set_distributed_by_suggestion_query_modal(false)})} fontSize='14px' fontFamily='ClearSans-Bold'>{distributor.company_name}</Text>
											)
										})}
									</Flex>}
								</>
							: null}
						</Flex>
					</Flex>
					<Flex direction='column'>
						<Text>Contact Email of company</Text>
						<Input type='email' value={email_of_lister} placeholder='Contact to be used' variant='filled' onChange={((e)=>{set_email_of_lister(e.target.value)})}/>
					</Flex>
					<Flex gap='1'>
						<Flex direction='column' gap='2' flex='1'>
							<Text fontFamily='ClearSans-Bold'>Industry</Text>
							<Select variant='filled' value={industry} placeholder='Select Industry' onChange={((e)=>{set_industry(e.target.value)})}>
								{industries_data?.map((item)=>{
										return(
											<option key={item?._id} value={item?.title}>{item?.title}</option>

										)
									})}
							</Select>
						</Flex>
						<Flex direction='column' gap='2' flex='1'>
							<Text fontFamily='ClearSans-Bold'>Technology</Text>
							<Select variant='filled' value={technology} placeholder='Select Technology' onChange={((e)=>{set_technology(e.target.value)})}>
								{technologies_data?.map((item)=>{
									return(
										<option key={item?._id} value={item?.title}>{item?.title}</option>

									)
								})}
							</Select>
						</Flex>
					</Flex>
					<Flex direction='column'>
						<Text>Function</Text>
						<Textarea type='text' value={product_function} placeholder='Function' variant='filled' onChange={((e)=>{set_product_function(e.target.value)})}/>
					</Flex>				
					<Flex direction='column'>
						<Text>Features & Benefits</Text>
						<Textarea type='text' value={features_of_product} placeholder='features and Benefits of products' variant='filled' onChange={((e)=>{set_features_of_product(e.target.value)})}/>
					</Flex>
					<Flex direction='column'>
						<Text>Application</Text>
						<Textarea type='text' value={application_of_product} placeholder='use commas to separate different applications' variant='filled' onChange={((e)=>{set_application_of_product(e.target.value)})}/>
					</Flex>
					<Flex direction='column'>
						<Text>Packaging</Text>
						<Textarea type='text' value={packaging_of_product} placeholder='packaging infomation' variant='filled' onChange={((e)=>{set_packaging_of_product(e.target.value)})}/>
					</Flex>
					<Flex direction='column'>
						<Text>Storage & Handling</Text>
						<Textarea type='text' value={storage_of_product} placeholder='storage and product handling information' variant='filled' onChange={((e)=>{set_storage_of_product(e.target.value)})}/>
					</Flex>
					<Flex direction='column'>
						<Text>Website_link</Text>
						<Input type='text' value={website_link} placeholder='link to website' variant='filled' onChange={((e)=>{set_website_link(e.target.value)})}/>
					</Flex>
					<Flex direction='column' gap='3' flex='1'>
						<Text fontFamily='ClearSans-Bold'>Short on Expiry</Text>
						<Select variant='filled' value={short_on_expiry? 'Product will be expiring soon':'Product is not set to expire soon'} placeholder='List As Short on Expiry' onChange={((e)=>{e.target.value === 'true'? set_short_on_expiry(true): set_short_on_expiry(false)})}>
							<option value='false'>Product is not set to expire soon</option>
							<option value='true'>Product will be expiring soon</option>
						</Select>
					</Flex>
					{is_submitting? 
						<Button
							bg='#009393'
							borderRadius='0' 
							flex='1'
							color='#fff'
							align='center'
						>
							<Loading width='40px' height='40px' color='#ffffff'/>
							saving product...
						</Button>
						:
							<>
								<Flex gap='2'>
									<Button 
										onClick={handle_add_new_product} 
										bg='#009393'
										borderRadius='0' 
										flex='1'
										color='#fff'
										align='center'
									>Add product</Button>
									<Button flex='1' bg='#000' borderRadius='0' color='#fff' onClick={(()=>{set_isfileupload(true)})}>Continue to upload files</Button>
								</Flex>
								<Button bg='#eee' borderRadius='0' color='red' onClick={(()=>{router.back();Clean_input_data()})}>Cancel</Button>
							</>							
					}
				</Flex>
			}
		</Flex>
	)
}