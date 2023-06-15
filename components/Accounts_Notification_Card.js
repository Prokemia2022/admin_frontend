import React from 'react'
import {Flex,Text,Button,Image} from '@chakra-ui/react'
import {useRouter} from 'next/router'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import styles from '../styles/Notifications.module.css'

export default function Item_Card({item,link}){
	const router = useRouter();
	return(
		<Flex className={styles.item_card} gap='1'>
            <Flex gap='2' align={'center'}>
                {item?.profile_photo_url == '' || !item?.profile_photo_url? <AccountCircleIcon style={{color:'grey',fontSize:'35px'}}/> : <Image src={item?.profile_photo_url} boxSize='40px' boxShadow='lg' borderRadius={'5'} alt='pp' objectFit={'cover'}/>}
				<Flex className={styles.item_card_info}>
                    <Text fontWeight='bold' fontSize='16px'>{item?.company_name || item?.first_name} {item?.last_name}</Text>
                    <Text fontSize='12px'>{item?.email_of_company || item?.email_of_salesperson}</Text>
                </Flex>
			</Flex>
			<Button onClick={(()=>{router.push(link)})} bg='#000' color='#fff'>View</Button>
		</Flex>
	)
}