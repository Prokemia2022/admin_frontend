import {useState,useEffect} from 'react';
import {Flex,Text,Button,Link,useToast,Divider} from '@chakra-ui/react';
import {useRouter} from 'next/router';
//icons
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DescriptionIcon from '@mui/icons-material/Description';
import VerifiedIcon from '@mui/icons-material/Verified'; 
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import FiberManualRecordRoundedIcon from '@mui/icons-material/FiberManualRecordRounded';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import ArrowDropUpRoundedIcon from '@mui/icons-material/ArrowDropUpRounded';
import InventoryRoundedIcon from '@mui/icons-material/InventoryRounded';
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded';
import StarOutlineRoundedIcon from '@mui/icons-material/StarOutlineRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
//components
import Header from '../../../components/Header.js';
import Delete_Product from '../../../components/modals/Product_Modals/Delete_Product.js';
import Loading from '../../../components/Loading.js';
//api
import Get_Product from '../../api/Products/get_product.js';
import Approve_Product from '../../api/Products/approve_product.js'
//utils
import Cookies from 'universal-cookie';
import jwt_decode from "jwt-decode";
import styles from '../../../styles/Home.module.css';

export default function Product(){
	const router = useRouter();
	const id = router.query;
	const cookies = new Cookies();
	const toast = useToast()
    let token = cookies.get('admin_token');
    const [auth_role,set_auth_role]=useState("");
	const [is_delete_product_Modalvisible,set_is_delete_product_Modalvisible]=useState(false);

	const [product_data,set_product_data]=useState('')
	const [is_submitting,set_is_submitting]=useState(false)

	const get_Data=async(payload)=>{
		await Get_Product(payload).then((response)=>{
			set_product_data(response.data)
			//console.log(response.data)
		})
	}
	useEffect(()=>{
		if (!payload || payload._id === undefined){
			toast({
              title: '',
              description:`missing info could not fetch data`,
              status: 'info',
              isClosable: true,
            });
			router.back()
		}else{
			//console.log(payload)
			get_Data(payload)
		}
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
	        //////console.log(decoded);
	        set_auth_role(decoded?.role)
	      }
	},[id]);
	const payload = {
		_id : id.id,
		auth_role,
		name_of_product:product_data?.name_of_product
	}
	console.log(payload)

	const handle_approve_product=async()=>{
		await Approve_Product(payload).then(()=>{
			toast({
              title: '',
              description:`${product_data.name_of_product} has been approved`,
              status: 'success',
              isClosable: true,
            });
			router.back()
		}).catch((err)=>{
			toast({
			      title: '',
			      description: err.response?.data,
			      status: 'error',
			      isClosable: true,
			    });
		})
	}
	return(
		<Flex  direction='column'>
			<Delete_Product is_delete_product_Modalvisible={is_delete_product_Modalvisible} set_is_delete_product_Modalvisible={set_is_delete_product_Modalvisible} product_data={product_data}/>
			<Header/>
			<Flex direction='column' gap='2' className={styles.productbody}>
			<Flex p='2' direction='column' gap='2' className={styles.productsection1} position='relative'>
				<Flex align='center' cursor={'pointer'} onClick={(()=>{router.back()})}>
					<ArrowBackRoundedIcon style={{fontSize:'20px'}}/>
					<Text>back</Text>
				</Flex>
				{product_data?.sponsored ? 
					<Flex bg='#fff' p='1' borderRadius='5' cursor='pointer' boxShadow='lg' align='center' position='absolute' top='15px' right='15px'>
						<Text fontWeight='bold' >Featured</Text>
						<VerifiedIcon style={{color:'gold'}}/>
					</Flex>
					:
					null
				}
				<Flex gap='2' fontSize={'14px'} color='grey'>
					<Flex direction={'column'}>
						<Text fontWeight={'bold'}>Industry:</Text>
						<Text color='#009393' cursor='pointer' >{product_data?.industry}</Text>
					</Flex>
					<Flex direction={'column'} borderLeft='1px solid grey' pl='2'>
						<Text fontWeight={'bold'}>Technology:</Text>
						<Text color='#009393' cursor='pointer' >{product_data?.technology}</Text>
					</Flex>
				</Flex>
				<Text fontFamily='ClearSans-Bold' fontSize='32px' color='#009393'>{product_data?.name_of_product}</Text>
				<Text>{product_data?.description_of_product}</Text>
				<Flex gap='2'>
					<Text fontWeight={'bold'}>Manufactured by:</Text>
					<Text color='grey'>{product_data?.manufactured_by}</Text>
				</Flex>
				<Flex gap='2'>
					<Text fontWeight={'bold'}>Distributed by:</Text>
					<Text color='grey'>{product_data?.distributed_by}</Text>
				</Flex>
				<Text fontWeight='bold'>Chemical_name:</Text>
				<Flex direction='column'  borderRadius='5' p=''>
					<Text>{product_data?.chemical_name}</Text>
				</Flex>
				<Text fontWeight='bold'>Functions:</Text>
				<Flex direction='column'  borderRadius='5' p=''>
					<Text>{product_data?.function}</Text>
				</Flex>
				<Flex direction='column' gap='2' mt='2' mb='2'>
					<Text fontWeight='bold'>Attachments</Text>
					{product_data?.data_sheet === ''? <Text bg='#eee' p='2' textAlign='center' borderRadius='5'>No data sheet attached</Text> : <Link href={product_data?.data_sheet} bg='' border='1px solid #eee' borderRadius='5' boxShadow='lg' color='#000' align='center' p='1' isExternal fontSize='20px'><DescriptionIcon style={{color:'#EA9DB0',fontSize:'18px'}} /> Product Data Sheet</Link>}
					{product_data?.formulation_document === ''? <Text bg='#eee' p='2' textAlign='center' borderRadius='5'>No formulation document attached</Text> : <Link href={product_data?.formulation_document} bg='' border='1px solid #eee' borderRadius='5' boxShadow='lg' color='#000' align='center' p='1' isExternal fontSize='20px'><DescriptionIcon style={{color:'#5D95B4',fontSize:'18px'}} /> Fomulation document</Link>}
					{product_data?.safety_data_sheet === ''? <Text bg='#eee' p='2' textAlign='center' borderRadius='5'>No safety data sheet attached</Text> : <Link href={product_data?.safety_data_sheet} bg='' border='1px solid #eee' borderRadius='5' boxShadow='lg' color='#000' align='center' p='1' isExternal fontSize='20px'><DescriptionIcon style={{color:'#8c52ff',fontSize:'18px'}} /> Safety Data Sheet</Link>}
				</Flex>
				<Text fontWeight='bold'>Features & Benefits:</Text>
				<Flex direction='column'  borderRadius='5' p=''>
					<Text>{product_data?.features_of_product}</Text>
				</Flex>
				<Text fontWeight='bold'>Applications and benefits:</Text>
				<Flex direction='column'  borderRadius='5' p=''>
					<Text>{product_data?.application_of_product}</Text>
				</Flex>
				<Text fontWeight='bold'>Packaging:</Text>
				<Flex direction='column'  borderRadius='5' p=''>
					<Text>{product_data?.packaging_of_product}</Text>
				</Flex>
				<Text fontWeight='bold'>Storage & Handling:</Text>
				<Flex direction='column'  borderRadius='5' p=''>
					<Text>{product_data?.storage_of_product}</Text>
				</Flex>
			</Flex>
			{is_submitting? 
                <Button
                    bg='#009393' 
                    flex='1'
                    color='#fff'
                    align='center'
					m='2'
					mb='4'
                >
                    <Loading width='40px' height='40px' color='#ffffff'/>
                    saving product...
                </Button>
                :
					<Flex p='3' gap='2' direction={'column'} mt='-4' mb='4'>
						<Text color='grey'>Actions</Text>
						<Divider/>
						<Flex align='center' gap='2' cursor='pointer' onClick={(()=>{router.push(`/product/edit_config/${product_data?._id}`)})}>
							<EditNoteRoundedIcon style={{fontSize:'20px',color:'grey'}}/>
							<Text color='grey' fontSize='14px'>Edit product</Text>
						</Flex>
						<Flex gap='3' align='center'>
							<MarkEmailUnreadIcon style={{fontSize:'16px',color:'grey'}}/>
							<Link color='grey' fontSize='14px' href={`mailto: ${product_data?.email_of_lister}`} isExternal>Email lister</Link>
						</Flex>
						<Flex align='center' gap='2' cursor='pointer' onClick={handle_approve_product}>
							<InventoryRoundedIcon style={{fontSize:'20px',color:'grey'}}/>
							<Text color='grey' fontSize='14px'>Approve this product</Text>
						</Flex>
						<Flex align='center' gap='2' cursor='pointer' onClick={(()=>{set_is_delete_product_Modalvisible(true)})}>
							<DeleteRoundedIcon style={{fontSize:'20px',color:'grey'}}/>
							<Text color='red' fontWeight='bold'>Delete this product</Text>
						</Flex>
					</Flex>
				}
			</Flex>
		</Flex>
	)
}
