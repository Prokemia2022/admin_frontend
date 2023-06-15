import {useState,useEffect} from 'react';
import {Flex,Text,Button,Link,useToast,Divider} from '@chakra-ui/react';
import {useRouter} from 'next/router';
//icons
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
import QuotationModal from '../../components/modals/Quotation';
import SampleModal from '../../components/modals/Sample.js';
import Header from '../../components/Header.js';
import Delete_Product from '../../components/modals/Product_Modals/Delete_Product.js';
import Loading from '../../components/Loading';
//api
import Get_Product from '../api/Products/get_product.js';
import Feature_Product from '../api/Products/feature_product';
import Un_Feature_Product from '../api/Products/un_feature_product';
import Decline_Product from '../api/Products/decline_product';
import Approve_Product from '../api/Products/approve_product';
//utils
import Cookies from 'universal-cookie';
import jwt_decode from "jwt-decode";
//styles
import styles from '../../styles/Home.module.css';

export default function Product(){
	const router = useRouter();
	const id = router.query;
	const toast = useToast()
	const [isquotationModalvisible,setisquotationModalvisible]=useState(false);
	const [issampleModalvisible,setissampleModalvisible]=useState(false);
    const [is_delete_product_Modalvisible,set_is_delete_product_Modalvisible]=useState(false);
	const cookies = new Cookies();
    let token = cookies.get('admin_token');

	//loading Status
    const [is_submitting,set_is_submitting]=useState(false)

    const [auth_role,set_auth_role]=useState("")

	const payload = {
		_id : id?.id,
		auth_role
	}
	const [product_data,set_product_data]=useState('')

	const get_Data=async(payload)=>{
		await Get_Product(payload).then((response)=>{
			set_product_data(response.data)
			console.log(response.data)
		})
	}
	useEffect(()=>{
		if (!payload._id == undefined || id.id === undefined){
			toast({
              title: 'This link is broken,',
              description: 'we are taking you back',
              status: 'info',
              isClosable: true,
            });
			router.back()
		}else{
			get_Data(payload)
		}
	},[id,is_submitting]);
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
		  }
	},[])

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
	const Handle_Suspend_Product=async()=>{
		set_is_submitting(true)
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
			setTimeout(()=>{set_is_submitting(false)},1000)
		})
	}
	const Handle_approve_Product=async()=>{
		set_is_submitting(true)
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
			setTimeout(()=>{set_is_submitting(false)},1000)
		})
	}
	return(
		<Flex  direction='column'>
			<QuotationModal isquotationModalvisible={isquotationModalvisible} setisquotationModalvisible={setisquotationModalvisible} product_data={product_data}/>
			<SampleModal issampleModalvisible={issampleModalvisible} setissampleModalvisible={setissampleModalvisible} product_data={product_data}/>
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
				{!product_data?.verification_status?
					<Flex bg='#fff' p='1' borderRadius='5' cursor='pointer' boxShadow='lg' align='center' position='absolute' top='50px' right='15px'>
					<Text fontWeight='bold' color='red'>Suspended</Text>
					</Flex>
					:null
				}
				<Flex fontSize={'10px'} color='grey' gap='1' fontWeight={'bold'}>
					<Text cursor='pointer' color='#009393' onClick={(()=>{router.push('/dashboard')})}>Dashboard</Text>
					<Text>&gt;</Text>
					<Text onClick={(()=>{router.back()})} cursor={'pointer'}>inventory</Text>
					<Text>&gt;</Text>
					<Text>{product_data?.name_of_product}</Text>		
				</Flex>
				<Flex gap='2' fontSize={'14px'} color='grey'>
					<Flex direction={'column'}>
						<Text fontWeight={'bold'}>Industry:</Text>
						<Text color='#009393' cursor='pointer'>{product_data?.industry}</Text>
					</Flex>
					<Flex direction={'column'} borderLeft='1px solid grey' pl='2'>
						<Text fontWeight={'bold'}>Technology:</Text>
						<Text color='#009393' cursor='pointer'>{product_data?.technology}</Text>
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
						{!product_data?.verification_status? 
							<Flex align='center' gap='2' cursor='pointer' onClick={Handle_approve_Product}>
								<InventoryRoundedIcon style={{fontSize:'20px',color:'grey'}}/>
								<Text color='grey' fontSize='14px'>Un suspend this product</Text>
							</Flex>
								: 
							<Flex align='center' gap='2' cursor='pointer'  onClick={Handle_Suspend_Product}>
								<HighlightOffRoundedIcon style={{fontSize:'20px',color:'grey'}}/>
								<Text color='grey' fontSize='14px'>Suspend this product</Text>
							</Flex>
						}
						{product_data?.sponsored? 
							<Flex align='center' gap='2' cursor='pointer' onClick={Handle_Un_Feature_Product}>
								<StarOutlineRoundedIcon style={{fontSize:'20px',color:'grey'}}/>
								<Text color='grey' fontSize='14px'>Un feature this product</Text>
							</Flex>
								: 
							<Flex align='center' gap='2' cursor='pointer' onClick={Handle_Feature_Product}>
								<StarRateRoundedIcon style={{fontSize:'20px',color:'grey'}}/>
								<Text color='grey' fontSize='14px'>Feature this product</Text>
							</Flex>
						}
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
