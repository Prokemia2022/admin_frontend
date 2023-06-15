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
import {Visibility,VisibilityOff} from '@mui/icons-material';
import Edit_Admin_User from '../../../pages/api/auth/edit_admin_user.js';
import Reset_Admin_User_Password_Modal from './Reset_Password.js';
import Cookies from 'universal-cookie';
import {useRouter} from 'next/router';
import Loading from '../../Loading.js';
import jwt_decode from "jwt-decode";
import Get_Roles from '../../../pages/api/admin_roles/get_roles';

export default function Edit_Admin_User_Modal({is_edit_admin_Modalvisible,set_is_edit_admin_Modalvisible,admin_data}){
    const [is_reset_password_admin_Modalvisible,set_is_reset_password_admin_Modalvisible]=useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const router = useRouter();
    const toast = useToast();
    const cookies = new Cookies();
    let token = cookies.get('admin_token');
    const [roles_data,set_roles_data]=useState([]);

    const HandleModalOpen=()=>{
      if(is_edit_admin_Modalvisible !== true){
        
        return ;
      }else{
        onOpen();
        set_is_edit_admin_Modalvisible(false);
      }
    }

    useEffect(()=>{
        HandleModalOpen();
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
            ////console.log(decoded);
            set_auth_role(decoded?.role)
            fetch_roles()
        }
      },[is_edit_admin_Modalvisible])

    const [user_name,set_user_name]=useState(admin_data?.user_name);
    const [user_email,set_user_email]=useState(admin_data?.user_email);
    const [user_mobile,set_user_mobile]=useState(admin_data?.user_mobile);
    const [user_role,set_user_role]=useState(admin_data?.role);
    const [is_submitting,set_is_submitting]=useState(false);
    const [is_edit,set_edit]=useState(false);
    const [auth_role,set_auth_role]=useState("")

    
    const payload = {
    	_id: admin_data?._id,
    	user_email,
        user_mobile,
        user_name,
        role: user_role,
        auth_role
    }

    //edit to new changes
    const handle_edit_Admin_User=async()=>{
        set_is_submitting(true);
        //check if inputs changed; if so exit function
        if (user_email === admin_data?.user_email && user_mobile === admin_data?.user_mobile && user_name === admin_data?.user_name && user_role === admin_data?.role){
            toast({
                position: 'top-left',
                variant:"subtle",
                title:'',
                description: `No changes have been made to update this user.`,
                status: 'info',
                isClosable: true,
            });
            set_is_submitting(false)
            return;
        }else{
            //console.log(payload)
            await Edit_Admin_User(payload).then(()=>{
                toast({
                    position: 'top-left',
                    variant:"subtle",
                    title:'',
                    description: `${admin_data?.user_name} account has been updated`,
                    status: 'success',
                    isClosable: true,
                });
                router.reload()
              }).catch((err)=>{
                //console.log(err)
                    toast({
                        position: 'top-left',
                        variant:"subtle",
                        title: '',
                        description: err.response.data,
                        status: 'error',
                        isClosable: true,
                    })
              }).finally(()=>{
                setTimeout(()=>{
                    set_is_submitting(false);
                    onClose()
                },2000)
              })
        }
    }
    const fetch_roles=async()=>{
        Get_Roles().then((response)=>{
          set_roles_data(response.data);
          //console.log(response.data);
        }).catch((err)=>{
          console.log(err)
        })
      }
    return (
		<>
			<Modal isOpen={isOpen} onClose={onClose}>
        <Reset_Admin_User_Password_Modal is_reset_password_admin_Modalvisible={is_reset_password_admin_Modalvisible} set_is_reset_password_admin_Modalvisible={set_is_reset_password_admin_Modalvisible} admin_data={admin_data}/>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>
						<Text fontSize='32px'>Edit User</Text>
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Stack spacing={4}>
                {is_edit?
                    <Flex direction='column' gap='2'>
                        <Text>Username</Text>
                        <Input type='text' placeholder={user_name} variant='filled' onChange={((e)=>{set_user_name(e.target.value)})}/>
                        <Text>Email</Text>
                        <Input type='email' placeholder={user_email} variant='filled' onChange={((e)=>{set_user_email(e.target.value)})}/>
                        <Text>Mobile</Text>
                        <Input type='tel' placeholder={user_mobile} variant='filled' onChange={((e)=>{set_user_mobile(e.target.value)})}/>
                        <Text>Role <span style={{color:"orange",fontSize:'12px'}}> [{user_role}]</span></Text>
                        <Select placeholder='Assign Role' onChange={((e)=>{set_user_role(e.target.value)})}>
                            {roles_data?.map((role)=>{
                            return(
                                <option key={role?._id}>{role?.title}</option>    
                            )
                            })}
                        </Select>
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
                            <Flex direction='column' gap='2'>
                              <Button 
                                  onClick={handle_edit_Admin_User} 
                                  bg='#009393'
                                  color='#fff'
                                  align='center'
                              >Edit User</Button>
                              <Button 
                                  onClick={(()=>{set_edit(false)})} 
                                  bg='#eee'
                                  color=''
                                  align='center'
                              >cancel</Button>						
                            </Flex>
                        }
                    </Flex>
                    :
                        <Flex gap='2' align='center'>
                            <Image boxShadow='md' objectFit='cover' src={admin_data?.user_image ? admin_data?.user_image :'/Pro.png' } alt='pp' boxSize='150px' borderRadius='5px'/>
                            <Flex direction='column' gap='1' w='100%'>
                                <Text fontWeight='bold' fontSize='20px'>{admin_data?.user_name}</Text>
                                <Text color='grey' fontSize='14px'>{admin_data?.user_email? `${admin_data?.user_email}` : '-'}</Text>
                                <Text color='grey' fontSize='14px'>{admin_data?.user_mobile? `${admin_data?.user_mobile}` : '-'}</Text>
                                <Text color='grey' fontSize='14px'>{admin_data?.role? `${admin_data?.role}` : '-'}</Text>
                                <Flex align='center' justify='space-between' flex='1'>
                                  <Button onClick={(()=>{set_edit(true)})}>Edit User</Button>
                                  <Text color='#009393' onClick={(()=>{set_is_reset_password_admin_Modalvisible(true)})} fontSize='10px' cursor='pointer'>reset password</Text>
                                </Flex>
                            </Flex>
                        </Flex>
                  }
						</Stack>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
      )
}