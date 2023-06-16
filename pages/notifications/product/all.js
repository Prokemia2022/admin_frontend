import React,{useState,useEffect} from 'react'
import {Flex,Image,Text,Input,Button,Select,Circle} from '@chakra-ui/react'
import {useRouter} from 'next/router'
import DoneAllIcon from '@mui/icons-material/DoneAll';
import AddIcon from '@mui/icons-material/Add';
import Get_Products from '../../api/Products/get_products.js'
import styles from '../../../styles/Notifications.module.css'

export default function Products(){
	const router = useRouter();
	const [products_data,set_products]=useState([])
	const get_Products_Data=async()=>{
		await Get_Products().then((response)=>{
			//console.log(response.data)
			const data = response.data
			const result = data.filter(v => !v.verification_status);
			set_products(result)
		})
	}
	useEffect(()=>{
		get_Products_Data()
	},[])
	return(
		<Flex direction='column' gap='3' p='2' w='100%'>
			<Text fontSize='32px' fontWeight='bold' color ='#009393'>Products</Text>
			{products_data?.length === 0?
				<Flex justify='center' align='center' h='40vh' direction='column' gap='2' textAlign='center' bg='#eee' borderRadius='5'>
					<Text>You dont have any new products to verify.</Text>
				</Flex>
				:
				<Flex className={styles.item_card_container}>
					{products_data?.map((product)=>{
						return(
							<div key={product._id} style={{margin:'5px'}}>
								<Product_Item product={product} router={router}/>
							</div>
						)
					})}
				</Flex>
			}
		</Flex>
	)
}

const Product_Item=({product})=>{
	const router = useRouter()
	return(
		<Flex bg='#fff' borderRadius='5px' boxShadow='lg' justify='space-between' flex='1'>
			<Flex direction='column' p='2'>
				<Text fontSize='16px' fontFamily='ClearSans-Bold' color='#009393'>{product.name_of_product}</Text>
				<Text fontSize='14px'>{product.distributed_by}</Text>
				<Flex gap='2' fontSize='10px' color='grey' align='center'>
					<Text >{product.industry? product.industry : '-'}</Text>
					<Text borderLeft='1px solid grey' paddingLeft='2'>{product.technology? product.technology : '-'}</Text>
				</Flex>
			</Flex>
			<Text textAlign='center' fontWeight='bold' color='#fff' bg='#009393' p='1' borderRadius='5' boxShadow='lg' cursor='pointer' onClick={(()=>{router.push(`/notifications/product/${product?._id}`)})}>View</Text>
		</Flex>
	)
}
