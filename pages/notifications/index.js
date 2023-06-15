//modules imports
import React,{useState,useEffect} from 'react';
import {Flex,Text,Button,Input} from '@chakra-ui/react';
//components imports
import styles from '../../styles/Notifications.module.css';
import Header from '../../components/Header.js';
//icon imports
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
/*page sections*/
import Products from './product/all.js'
import Distributors from './distributor/all.js'
import Manufacturers from './manufacturer/all.js'
import Salespeople from './salesperson/all.js'
import Sales from './sales.js'
import Requests from './requests.js'
import Industries from './industries.js'
import Technologies from './technologies.js';
import Feedbacks from './feedbacks';
import Support_Questions from './support_questions';
import Request_Demo_Tickets from './demo_requests';

 
export default function Page_Handler(){
	const [currentvalue,setCurrentValue] = useState('products');
	
	if (currentvalue == 'products')
	{   
		return(
			<Flex className={styles.notification_body}>
					<Header/>
					<Flex className={styles.navigation_body} >
						<Navbar currentvalue={currentvalue} setCurrentValue={setCurrentValue}/>
						<Products />
					</Flex>
				</Flex>
			)
	}else if (currentvalue == 'distributors')
	{
		return(
				<Flex className={styles.notification_body}>
					<Header/>
					<Flex className={styles.navigation_body}>
						<Navbar  currentvalue={currentvalue} setCurrentValue={setCurrentValue}/>
						<Distributors/>
					</Flex>
				</Flex>
			)
	}else if (currentvalue == 'manufacturers')
	{
		return (
			<Flex className={styles.notification_body}>
				<Header/>
				<Flex className={styles.navigation_body}>
					<Navbar currentvalue={currentvalue} setCurrentValue={setCurrentValue}/>
					<Manufacturers/>
				</Flex>
			</Flex>
		)
	}else if (currentvalue == 'salespeople')
	{
		return (
			<Flex className={styles.notification_body}>
				<Header/>
				<Flex className={styles.navigation_body}>
					<Navbar currentvalue={currentvalue} setCurrentValue={setCurrentValue}/>
					<Salespeople/>
				</Flex>
			</Flex>
		)
	}else if (currentvalue == 'sales')
	{
		return(
			<Flex className={styles.notification_body}>
				<Header/>
				<Flex className={styles.navigation_body}>
					<Navbar  currentvalue={currentvalue} setCurrentValue={setCurrentValue}/>
					<Sales />
				</Flex>
			</Flex>
			)
	}else if (currentvalue == 'requests')
	{
		return (
			<Flex className={styles.notification_body}>
				<Header/>
				<Flex className={styles.navigation_body}>
					<Navbar currentvalue={currentvalue} setCurrentValue={setCurrentValue}/>
					<Requests/>
				</Flex>
			</Flex>
		)
	}else if (currentvalue == 'industries')
	{
		return (
			<Flex className={styles.notification_body}>
				<Header/>
				<Flex className={styles.navigation_body}>
					<Navbar currentvalue={currentvalue} setCurrentValue={setCurrentValue}/>
					<Industries/>
				</Flex>
			</Flex>
		)
	}else if (currentvalue == 'technologies')
	{
		return (
			<Flex className={styles.notification_body}>
				<Header/>
				<Flex className={styles.navigation_body}>
					<Navbar currentvalue={currentvalue} setCurrentValue={setCurrentValue}/>
					<Technologies/>
				</Flex>
			</Flex>
		)
	}else if (currentvalue == 'feedbacks')
	{
		return (
			<Flex className={styles.notification_body}>
				<Header/>
				<Flex className={styles.navigation_body}>
					<Navbar currentvalue={currentvalue} setCurrentValue={setCurrentValue}/>
					<Feedbacks/>
				</Flex>
			</Flex>
		)
	}else if (currentvalue == 'support_questions')
	{
		return (
			<Flex className={styles.notification_body}>
				<Header/>
				<Flex className={styles.navigation_body}>
					<Navbar currentvalue={currentvalue} setCurrentValue={setCurrentValue}/>
					<Support_Questions/>
				</Flex>
			</Flex>
		)
	}else if (currentvalue == 'demo_requests')
	{
		return (
			<Flex className={styles.notification_body}>
				<Header/>
				<Flex className={styles.navigation_body}>
					<Navbar currentvalue={currentvalue} setCurrentValue={setCurrentValue}/>
					<Request_Demo_Tickets/>
				</Flex>
			</Flex>
		)
	}else{
		return(
			<Flex className={styles.notification_body}>
					<Header/>
					<Flex className={styles.navigation_body} >
						<Navbar currentvalue={currentvalue} setCurrentValue={setCurrentValue}/>
						<Products/>
					</Flex>
			</Flex>
		)
	}
}

const navItems = [
 {
 	id:1,
	 title:'Products',
	 link:'products',
 },
 {
 	id:2,
	title:'Distributors',
	link:'distributors'
 },
 {
 	id:3,
	 title:'Manufacturers',
	 link:'manufacturers',
 },{
 	id:4,
	 title:'Salespeople',
	 link:'salespeople',
 },
 {
 	id:5,
	 title:'Sales',
	 link:'sales',
 },
 {
 	id:6,
	 title:'Requests',
	 link:'requests',
 },
  {
 	id:7,
	 title:'Industries',
	 link:'industries',
 },
  {
 	id:8,
	 title:'Technologies',
	 link:'technologies',
 },{
	id: 9,
	title: 'Support_questions',
	link: 'support_questions'
 },{
	id:10,
	title:'Feedbacks',
	link:'feedbacks',
},{
	id:11,
	title:'Request_Demos',
	link:'demo_requests',
}
 ]

const Navbar=({setCurrentValue,currentvalue,})=>{
	return(
		<Flex className={styles.navigation_body_Items} cursor='pointer' gap='4'>
			<Flex className={styles.navigation_body_Items_Container} gap='2'>
				{navItems.map((content)=>{
					return (
						<Text 
							key={content.id}
							fontSize='20px' 
							color={currentvalue === content.title.toLowerCase() ? '#009393': '#fff'}
							className={styles.navigation_Item} 
							onClick={(()=>{setCurrentValue(content.link)})}
							fontWeight={'bold'}
						>
							{content.title}
						</Text>
					)
				})}
			</Flex>
		</Flex>
	)
}