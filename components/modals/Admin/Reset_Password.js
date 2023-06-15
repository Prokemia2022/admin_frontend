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
    Input,
    Select,
    Stack,
    useToast,
    Image,
    Flex,InputGroup,InputRightElement,
  } from '@chakra-ui/react';
import { useEffect,useState } from 'react';
import {useRouter} from 'next/router';
import Loading from '../../Loading.js';
import Change_Password from '../../../pages/api/auth/change_password.js';

export default function Reset_Admin_User_Password_Modal({is_reset_password_admin_Modalvisible,set_is_reset_password_admin_Modalvisible,admin_data,auth_role}){
    const { isOpen, onOpen, onClose } = useDisclosure();
    const router = useRouter();
    const toast = useToast();

    const HandleModalOpen=()=>{
      if(is_reset_password_admin_Modalvisible !== true){
        
        return ;
      }else{
        onOpen();
        set_is_reset_password_admin_Modalvisible(false);
      }
    }

    useEffect(()=>{
      HandleModalOpen();
      
    },[is_reset_password_admin_Modalvisible])
      const [is_submitting,set_is_submitting]=useState(false);

      const payload = {
        _id:admin_data?._id,
        auth_role,
        user_password:"default@prokemia.com"
      }
      const handle_reset_password=async()=>{
        set_is_submitting(true)
        await Change_Password(payload).then(()=>{
          toast({
              position: 'top-left',
              variant:"subtle",
              title:'',
              description: `${admin_data?.user_name} account has been updated`,
              status: 'success',
              isClosable: true,
          });
          setTimeout(()=>{
              set_is_submitting(false);
              router.reload()
          },500)
          router.reload()
        }).catch((err)=>{
              toast({
                  position: 'top-left',
                  variant:"subtle",
                  title: '',
                  description: err.response.data,
                  status: 'error',
                  isClosable: true,
              })
        })
      }
    return (
		<>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>
                        <Text fontSize='20px' color='#009393'>Reset Password</Text>
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Stack spacing={4}>
                            <Flex direction='column' gap='2' color='grey'>
                                
                                <Text>{admin_data?.user_name}'s account password will be reset to "default@prokemia.com". </Text>
                                <Text>Confirm this process by updating.</Text>
                                {is_submitting? 
                                    <Button
                                        bg='#009393'
                                        borderRadius='0' 
                                        flex='1'
                                        color='#fff'
                                        align='center'
                                    >
                                        <Loading width='40px' height='40px' color='#ffffff'/>
                                        updating user...
                                    </Button>
                                    :
                                    <Flex gap='2'>
                                        <Button 
                                            onClick={handle_reset_password} 
                                            bg='#009393'
                                            color='#fff'
                                            align='center'
                                            flex='1'
                                        >Update</Button>	
                                        <Button 
                                            onClick={(()=>{onClose()})} 
                                            bg='#eee'
                                            color=''
                                            align='center'
                                            flex='1'
                                        >Cancel</Button>	
                                    </Flex>
                                }
                            </Flex>
						</Stack>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
      )
}