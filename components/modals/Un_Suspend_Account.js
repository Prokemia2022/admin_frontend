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
import Un_Suspend_Client from '../../pages/api/clients/un_suspend_client_account';
import Un_Suspend_Distributor from '../../pages/api/distributors/un_suspend_distributor_account';
import Un_Suspend_Manufacturer from '../../pages/api/manufacturers/un_suspend_manufacturer_account';
import Un_Suspend_Salesperson from '../../pages/api/salespeople/un_suspend_salesperson_account';
import {useRouter} from 'next/router'

function Un_Suspend_Account_Modal({
      is_un_suspend_Modal_visible,
      set_is_un_suspend_Modal_visible,
      distributor_data,
      manufacturer_data,
      client_data,
      supplier_data,
      salesperson_data,
      acc_type,
    payload
    }){
    const { isOpen, onOpen, onClose } = useDisclosure();
    const router = useRouter();
    const toast = useToast();
    //console.log(isaddingreviewgModalvisible);

    const HandleModalOpen=()=>{
      if(is_un_suspend_Modal_visible !== true){
        //console.log('damn')
      }else{

        onOpen();
        set_is_un_suspend_Modal_visible(false)
      }
    }

    const [confirm_name,set_confirm_name]=useState('')
    const [name,set_name]=useState('');

    useEffect(()=>{
      HandleModalOpen();
      if (acc_type === 'client')
        set_name(client_data?.first_name)
      if (acc_type === 'distributor')
        set_name(distributor_data?.company_name || supplier_data?.company_name)
      if (acc_type === 'manufacturer')
        set_name(manufacturer_data?.company_name || supplier_data?.company_name)
      if (acc_type === 'salespersons')
        set_name(salesperson_data?.first_name)
    },[is_un_suspend_Modal_visible])

    

    const handle_un_suspension=async()=>{
      if (confirm_name === name){
        if (acc_type === 'client'){
          await Un_Suspend_Client(payload).then(()=>{
            toast({
              title: '',
              description: `${name} has been activated`,
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
        }else if (acc_type === 'distributor'){
          await Un_Suspend_Distributor(payload).then(()=>{
            toast({
              title: '',
              description: `${name} has been activated`,
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
          await Un_Suspend_Manufacturer(payload).then(()=>{
            toast({
              title: '',
              description: `${name} has been activated`,
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
          await Un_Suspend_Salesperson(payload).then(()=>{
            toast({
              title: '',
              description: `${name} has been activated`,
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
						<Text fontSize='24px' color='green'>Un_Suspend Account</Text>
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Stack spacing={4}>
							<Text>By un_suspending this account, the user will regain access to use the service and the platform.</Text>
							<Text>Enter the name of Account Holder: <span style={{color:'green'}}>{name}</span> below, to complete suspension.</Text>
							<InputGroup>
								<Input type='text' placeholder='name of account Holder' variant='filled' onChange={((e)=>{set_confirm_name(e.target.value)})}/>
							</InputGroup>
							<Button bg='green' borderRadius='0' color='#fff' onClick={handle_un_suspension}>Un-Suspend account</Button>
						</Stack>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
      )
}   

export default Un_Suspend_Account_Modal;