import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    Text,
    Flex,
    Center,
    Textarea,
    Input,
    Select,
    InputGroup,Heading,
    Stack,
    useToast
  } from '@chakra-ui/react';
import { useEffect,useState } from 'react';
import {useRouter} from 'next/router';
import Suspend_Client from '../../pages/api/clients/suspend_client_account';
import Suspend_Distributor from '../../pages/api/distributors/suspend_distributor_account';
import Suspend_Manufacturer from '../../pages/api/manufacturers/suspend_manufacturer_account';
import Suspend_Salesperson from '../../pages/api/salespeople/suspend_salesperson_account';
import Cookies from 'universal-cookie';
import jwt_decode from "jwt-decode";

function SuspendAccountModal({
    issuspendModalvisible,
    setissuspendModalvisible,
    distributor_data,
    manufacturer_data,
    supplier_data,
    client_data,
    salesperson_data,
    acc_type,
    payload
  }){
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const cookies = new Cookies();    
    //console.log(isaddingreviewgModalvisible);
    //console.log(payload)

    const HandleModalOpen=()=>{
      if(issuspendModalvisible !== true){
        //console.log('damn')
      }else{

        onOpen();
        setissuspendModalvisible(false)
      }
    }

    const [confirm_name,set_confirm_name]=useState('')
    const [name,set_name]=useState('');

    const [auth_role,set_auth_role]=useState("")

    useEffect(()=>{
      HandleModalOpen();
      if (acc_type === 'client'){
        set_name(client_data?.first_name)
      }
      if (acc_type === 'distributor'){
        set_name(distributor_data?.company_name || supplier_data?.company_name)
      }
      if (acc_type === 'manufacturer'){
        set_name(manufacturer_data?.company_name || supplier_data?.company_name)
      }
      if (acc_type === 'salespersons'){
        set_name(salesperson_data?.first_name)
      }
    },[issuspendModalvisible])

    

    const handle_suspension=async()=>{
      if (confirm_name === name){  
        if (acc_type === 'client'){
          await Suspend_Client(payload).then(()=>{
            toast({
              title: '',
              description: `${name} account has been suspended`,
              status: 'info',
              isClosable: true,
            });
          }).catch((err)=>{
            //console.log(err)
            toast({
                      title: 'Error while suspending account',
                      description: err?.response?.data,
                      status: 'error',
                      isClosable: true,
                  })
          })
          
        }else if (acc_type === 'distributor'){
          await Suspend_Distributor(payload).then(()=>{
            toast({
              title: '',
              description: `${name} has been suspended`,
              status: 'info',
              isClosable: true,
            });
          }).catch((err)=>{
            toast({
                      title: '',
                      description: err.response.data,
                      status: 'error',
                      isClosable: true,
                  })
          })
          
        }else if (acc_type === 'manufacturer'){
          await Suspend_Manufacturer(payload).then(()=>{
            toast({
              title: '',
              description: `${name} has been suspended`,
              status: 'info',
              isClosable: true,
            });
          }).catch((err)=>{
            toast({
                      title: '',
                      description: err.response.data,
                      status: 'error',
                      isClosable: true,
                  })
          })
        }else if (acc_type === 'salespersons')
          await Suspend_Salesperson(payload).then(()=>{
            toast({
              title: '',
              description: `${name} has been suspended`,
              status: 'info',
              isClosable: true,
            });
          }).catch((err)=>{
            toast({
                      title: '',
                      description: err.response.data,
                      status: 'error',
                      isClosable: true,
                  })
          })
      }else{
        toast({
            title: '',
            description: 'the name of the accounts do not match,try again',
            status: 'info',
            isClosable: true,
        })
      }
      onClose()
    }
    return (
		<>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>
						<Text fontSize='24px' color='red'>Suspend Account</Text>
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Stack spacing={4}>
							<Text>By suspending this account, the user will not have access to use the service and the platform.</Text>
							<Text>Enter the name of Account Holder: <span style={{color:'red'}}>{name}</span> below, to complete suspension.</Text>
							<InputGroup>
								<Input type='text' placeholder='name of account Holder' variant='filled' onChange={((e)=>{set_confirm_name(e.target.value)})}/>
							</InputGroup>
							<Button bg='red' borderRadius='0' color='#fff' onClick={handle_suspension}>Suspend</Button>
						</Stack>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
      )
}   

export default SuspendAccountModal;