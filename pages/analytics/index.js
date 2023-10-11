import React, { useEffect, useState } from "react";
import {
    Text, 
    Box,
    Heading,
    HStack,
} from '@chakra-ui/react';
import Navigation from '../../components/Navigation';
//utils
import {useRouter} from 'next/router';
//apis
import Get_Clients from '../api/clients/get_clients.js';
import Get_Distributors from '../api/distributors/get_distributors.js';
import Get_Manufacturers from '../api/manufacturers/get_manufacturers.js';
import Get_SalesPeople from '../api/salespeople/get_salespeople.js';
import Get_Orders from '../api/orders/get_orders.js';
import Get_Products from '../api/Products/get_products.js';

import { 
    Chart as ChartJS, 
    ArcElement, 
    Tooltip,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';


ChartJS.register(
    ArcElement, Tooltip,
);

export default function Dashboard(){
    return(
        <Navigation >
            <Body/>
        </Navigation>
    )
}

const Body=()=>{   
    const router = useRouter();

    // clients
    const [clients_data, set_clients_data] = useState([]);
    const [active_clients,set_active_clients]=useState(0)
    const [pending_approval_clients,set_pending_approval_clients]=useState(0)
    const [suspended_clients,set_suspended_clients]=useState(0)

    // distributors
	const [distributors_data, set_distributors_data]=useState([]);
    const [active_distributors,set_active_distributors]=useState(0)
    const [pending_approval_distributors,set_pending_approval_distributors]=useState(0)
    const [suspended_distributors,set_suspended_distributors]=useState(0)
    // manufacturers
	const [manufacturers_data, set_manufacturers_data]=useState([]);
    const [active_manufacturers,set_active_manufacturers]=useState(0)
    const [pending_approval_manufacturers,set_pending_approval_manufacturers]=useState(0)
    const [suspended_manufacturers,set_suspended_manufacturers]=useState(0)

    // salespeople
	const [salespeople_data, set_salespeople_data]=useState([]);
    const [active_salespeople,set_active_salespeople]=useState(0)
    const [pending_approval_salespeople,set_pending_approval_salespeople]=useState(0)
    const [suspended_salespeople,set_suspended_salespeople]=useState(0)

    // products
	const [products_data, set_products_data]=useState([]);
    const [active_products,set_active_products]=useState(0)
    const [pending_approval_products,set_pending_approval_products]=useState(0)
    const [suspended_products,set_suspended_products]=useState(0)

	// const [orders_data,set_orders]=useState([]);
	// const [products,set_products]=useState([]);

    useEffect(()=>{
	    Get_Clients().then((response)=>{
            const data = response?.data.reverse()
            set_clients_data(data);

            const active = data?.filter((item) => !item.suspension_status)
            const suspended = data?.filter((item) => item.suspension_status)
            const pending = data?.filter(v => !v.valid_email_status);
            
            set_active_clients(active?.length)
            set_pending_approval_clients(pending?.length)
            set_suspended_clients(suspended?.length)
        })
        Get_Distributors().then((response)=>{
                const data = response?.data.reverse()
                set_distributors_data(data);

                const active = data?.filter((item) => !item.suspension_status)
                const suspended = data?.filter((item) => item.suspension_status)
                const pending = data?.filter(v => !v.verification_status);
                
                set_active_distributors(active?.length)
                set_pending_approval_distributors(pending?.length)
                set_suspended_distributors(suspended?.length)
        })
        Get_Manufacturers().then((response)=>{
                const data = response?.data.reverse()
                set_manufacturers_data(data.filter(v => v.verification_status)) 

                const active = data?.filter((item) => !item.suspension_status)
                const suspended = data?.filter((item) => item.suspension_status)
                const pending = data?.filter(v => !v.verification_status);
                
                set_active_manufacturers(active?.length)
                set_pending_approval_manufacturers(pending?.length)
                set_suspended_manufacturers(suspended?.length)              
        })
        Get_SalesPeople().then((response)=>{
                const data = response?.data.reverse()
                set_salespeople_data(data)

                const active = data?.filter((item) => !item.suspension_status)
                const suspended = data?.filter((item) => item.suspension_status)
                const pending = data?.filter(v => !v.verification_status);
                
                set_active_salespeople(active?.length)
                set_pending_approval_salespeople(pending?.length)
                set_suspended_salespeople(suspended?.length) 
                
        })
        Get_Orders().then((response)=>{
                const data = response?.data;
                //set_orders(data.filter(v => v.order_notification_status))
        })
        Get_Products().then((response)=>{
                const data = response?.data;                
                set_products_data(data)

                const active = data?.filter((item) => !item.suspension_status)
                const suspended = data?.filter((item) => item.suspension_status)
                const pending = data?.filter(v => !v.verification_status);
                
                set_active_products(active?.length)
                set_pending_approval_products(pending?.length)
                set_suspended_products(suspended?.length) 
        })
	  },[])

    
    return (
        <Box gap='2'>
            <Data_Card_Body
                active={active_clients}
                pending_approval={pending_approval_clients}
                suspended={suspended_clients}
                length={clients_data?.length}
                title={'Customers'}
            />
            <Data_Card_Body
                active={active_distributors}
                pending_approval={pending_approval_distributors}
                suspended={suspended_distributors}
                length={distributors_data?.length}
                title={'Distributors'}
            />
            <Data_Card_Body
                active={active_manufacturers}
                pending_approval={pending_approval_manufacturers}
                suspended={suspended_manufacturers}
                length={manufacturers_data?.length}
                title={'Manufacturers'}
            />
            <Data_Card_Body
                active={active_salespeople}
                pending_approval={pending_approval_salespeople}
                suspended={suspended_salespeople}
                length={salespeople_data?.length}
                title={'Salespeople'}
            /> 
            <Data_Card_Body
                active={active_products}
                pending_approval={pending_approval_products}
                suspended={suspended_products}
                length={products_data?.length}
                title={'Products'}
            />          
        </Box>
    )
}

const Data_Card_Body=(props)=>{
    const {active, pending_approval, suspended, length, title} = props;
    const data = {
        labels: ['active', 'pending approval', 'suspended'],
        datasets: [
          {
            label: 'users',
            data: [active, pending_approval, suspended],
            backgroundColor: [
              'rgba(0, 147, 147,0.8)',
              'rgba(148, 148, 148, 0.8)',
              'rgba(255, 165, 165, 0.8)',
            ],
            borderColor: [
                'rgba(255, 255, 255, 1)',
                'rgba(120, 120, 120, 1)',
                'rgba(255, 0, 0, 1)',
            ],
            borderWidth: 1,
          },
        ],
      };
    return(
        <HStack align='center' bg='#fff' p='6' w='full' h='200px' justify={'space-between'} borderRadius={'5'} boxShadow={'md'} my='2'>
            <Box >
                <Heading size={{base:'xs',md:'md'}} textTransform='uppercase'>
                    {length} {title}
                </Heading>
                <HStack>
                    <Text fontSize='md' fontWeight={'semibold'} bg={'teal.100'} my='1' px='1' borderRadius={'3'}>
                        {active}
                    </Text>
                    <Text fontSize='md' fontWeight={'semibold'} bg={'gray.100'} my='1' px='1' borderRadius={'3'}>
                        {pending_approval}
                    </Text>
                    <Text fontSize='md' fontWeight={'semibold'} bg={'red.100'} my='1' px='1' borderRadius={'3'}>
                        {suspended}
                    </Text>
                </HStack>
            </Box>
            <Doughnut data={data} />
        </HStack>
    )
}