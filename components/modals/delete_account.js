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
import Delete_Distributor from '../../pages/api/distributors/delete_Distributor_account';
import Delete_Manufacturer from '../../pages/api/manufacturers/delete_manufacturer_account';
import Delete_Salesperson from '../../pages/api/salespeople/delete_salesperson_account';
import Cookies from 'universal-cookie';

export default function Delete_Account_Modal({
    is_delete_Modalvisible,
    set_is_delete_Modal_visible,
    supplier_data,
    distributor_data,
    manufacturer_data,
    client_data,
    salesperson_data,
    acc_type,
    payload
  }){
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const cookies = new Cookies();  
    const router = useRouter()  
    //console.log(isaddingreviewgModalvisible);

    const HandleModalOpen=()=>{
      if(is_delete_Modalvisible !== true){
        //console.log('damn')
      }else{

        onOpen();
        set_is_delete_Modal_visible(false)
      }
    }

    const [confirm_name,set_confirm_name]=useState('')
    const [name,set_name]=useState('');

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
    },[is_delete_Modalvisible])

    

    const handle_deletion=async()=>{
      if (confirm_name === name){  
        if (acc_type === 'client'){
          return ;
        }else if (acc_type === 'distributor'){
          await Delete_Distributor(payload).then(()=>{
            toast({
              title: '',
              description: `${name} account has been deleted`,
              status: 'info',
              isClosable: true,
            });
          }).then(()=>{
            router.back()
          }).catch((err)=>{
            toast({
                      title: '',
                      description: err.response.data,
                      status: 'error',
                      isClosable: true,
                  })
          })
          
        }else if (acc_type === 'manufacturer'){
          await Delete_Manufacturer(payload).then(()=>{
            toast({
              title: '',
              description: `${name} account has been deleted`,
              status: 'info',
              isClosable: true,
            });
          }).then(()=>{
            router.back()
          }).catch((err)=>{
            console.log(err)
            toast({
                      title: '',
                      description: err.response.data,
                      status: 'error',
                      isClosable: true,
                  })
          })
        }else if (acc_type === 'salespersons')
          await Delete_Salesperson(payload).then(()=>{
            toast({
              title: '',
              description: `${name} account has been deleted`,
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
    }
    return (
		<>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>
						<Text fontSize='24px' color='red'>Delete Account</Text>
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Stack spacing={4}>
							<Text>By deleting this account, the user will not have access to use the service and the platform.</Text>
							<Text>Enter the name of Account Holder: <span style={{color:'red'}}>{name}</span> below, to complete deletion.</Text>
							<InputGroup>
								<Input type='text' placeholder='name of account Holder' variant='filled' onChange={((e)=>{set_confirm_name(e.target.value)})}/>
							</InputGroup>
							<Button bg='red' borderRadius='0' color='#fff' onClick={handle_deletion}>Delete</Button>
						</Stack>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
      )
}