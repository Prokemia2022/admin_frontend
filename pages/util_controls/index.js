//modules imports
import React,{useState,useEffect} from 'react';
import {Flex,Text,Button,Input} from '@chakra-ui/react';
//components imports
import styles from '../../styles/Home.module.css';
import Header from '../../components/Header.js';
//icon imports

/*page sections*/
import Industries from './industries.js'
import Technologies from './technologies.js'
import Careers from './careers.js'

 
export default function Page_Handler(){
	const [currentvalue,setCurrentValue] = useState('industries')
	
	if (currentvalue == 'industries')
	{   
		return(
				<Flex direction='column' h='100vh'>
					<Header/>
					<Flex className={styles.consolebody} >
						<Navbar currentvalue={currentvalue} setCurrentValue={setCurrentValue}/>
						<Industries/>
					</Flex>
				</Flex>
			)
	}else if (currentvalue == 'technologies')
	{
		return(
				<Flex direction='column' h='100vh'>
					<Header/>
					<Flex className={styles.consolebody}>
						<Navbar  currentvalue={currentvalue} setCurrentValue={setCurrentValue}/>
						<Technologies/>
					</Flex>
				</Flex>
			)
	}else if (currentvalue == 'careers'){
		return (
			<Flex direction='column' h='100vh'>
				<Header/>
				<Flex className={styles.consolebody}>
					<Navbar currentvalue={currentvalue} setCurrentValue={setCurrentValue}/>
					<Careers/>
				</Flex>
			</Flex>
		)
	}else{
		return(
			<Flex direction='column' h='100vh'>
				<Header/>
				<Flex className={styles.consolebody} >
					<Navbar currentvalue={currentvalue} setCurrentValue={setCurrentValue}/>
					<Industries/>
				</Flex>
			</Flex>
		)
	}
}

const navItems = [
	 {
	 	id:1,
		 title:'Industries',
		 link:'industries',
	 },
	 {
	 	id:2,
		title:'Technologies',
		link:'technologies'
	 },
	 {
	 	id:3,
		 title:'Careers',
		 link:'careers',
	 }
 ]

const Navbar=({setCurrentValue,currentvalue,setActive})=>{
	return(
		<Flex p='2' gap='3' className={styles.consoleNavigation} cursor='pointer'>
			{navItems.map((content)=>{
				return (
					<Flex key={content.id} color={currentvalue === content.title.toLowerCase() ? '#009393': '#fff'} align='center' p='2' gap='3' className={styles.consoleNavItem} onClick={(()=>{setCurrentValue(content.link)})}>
						{content.icon}
						<Text fontSize='20px' p='1.5' mb='0'>{content.title}</Text>
					</Flex>
				)
			})}
		</Flex>
	)
}