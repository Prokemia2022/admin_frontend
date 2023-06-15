//modules imports
import React,{useState,useEffect} from 'react';
import {useRouter} from 'next/router';
import {Flex,Text,Button,Input,InputGroup,InputRightElement,Image,useToast, Divider} from '@chakra-ui/react';
import Cookies from 'universal-cookie';
//icons-imports
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
//components imports
import Header from '../../components/Header.js'
//api-calls
import Get_Admin_User from '../api/auth/get_admin_user.js'
import Edit_Admin_User from '../api/auth/edit_admin_user.js'
import Change_Password from '../api/auth/change_password.js';
import Send_Password_Otp from '../api/email_handler/password_email.js';
//utils
import {storage} from '../../components/firebase.js';
import {ref,uploadBytes,getDownloadURL} from 'firebase/storage';
//style
import styles from '../../styles/Profile.module.css';

export default function Profile(){
	const router = useRouter();
	const cookies = new Cookies();
	const toast = useToast();
	
    const id = router.query
    //console.log(id)
    
    const payload = {
        _id : id.id
    }

    const [user_data,set_user_data]=useState('');
	const [image,set_image]=useState();
	const [user_name,set_user_name]=useState(user_data?.user_name);
	const [user_mobile,set_user_mobile]=useState(user_data?.user_mobile);
	const [user_email,set_user_email]=useState(user_data?.user_email);
	const [user_password,set_user_password]=useState('');

	const [is_change_password,set_is_change_password]=useState(false);
	const [is_verification_code_sent,set_is_verification_code_sent]=useState(false);
	const [is_code_verified,set_is_code_verified]=useState(false);

	const [image_edit,set_image_edit]=useState(false);

	const fetch_admin_user_data=async()=>{
        await Get_Admin_User(payload).then((res)=>{
            //console.log(res.data)
            set_user_data(res.data)
        }).catch((err)=>{
            //console.log(err)
        })
    }

    
    useEffect(()=>{
        //console.log(id)
        if (id.id === 'undefined' || !id.id ){
            //alert("Broken link..., redirecting")
            //console.log("Broken link..., redirecting")
            return;
        }else{
            fetch_admin_user_data()
        }      
    },[id])

	

	const profile_upload_function=async()=>{
		/**handles uploads profile image functions to firebase storage**/
		//console.log(image)
		if (image == ''){
			toast({
				title: '',
				description: 'Missing image details',
				status: 'info',
				isClosable: true,
			});
		}else if (image == undefined){
			toast({
				title: '',
				description: 'You have not selected an image',
				status: 'info',
				isClosable: true,
			});
			return ;
		}else{
			await handle_profile_image_upload().then((res)=>{
				if (res == null || res == undefined || !res){
					return;
				}else{
					const payload = {
						_id: user_data?._id,
						user_image: res
					}
					Edit_Admin_User(payload).then(()=>{
						toast({
							title: '',
							description: 'successfuly updated your profile photo',
							status: 'success',
							isClosable: true,
						});
					}).then(()=>{
						set_image_edit(false)
					}).catch((err)=>{
						toast({
							title: '',
							description: `${err.response.data}`,
							status: 'error',
							isClosable: true,
						});
					})
				}
			})
		}
	}

	const handle_profile_image_upload=async()=>{
		/**uploads profile image to firebase storage**/
		if (image.name == undefined){
			toast({
				title: 'upload process cancelled',
				description: 'could not find image selected',
				status: 'info',
				isClosable: true,
			});
			return;
		}else{
			//console.log(image.name)
			const profile_photo_documentRef = ref(storage, `profile_photo/${image?.name}`);
			const snapshot= await uploadBytes(profile_photo_documentRef,image)
			const file_url = await getDownloadURL(snapshot.ref)
			cookies.set('image_url', file_url, { path: '/' });
			return file_url
		}
	}

	const handle_Edit_Profile=async()=>{
		const payload = {
			_id: user_data?._id,
			user_name,
			user_mobile,
			user_email
		}
		if(user_name == user_data?.user_name  && user_email == user_data?.user_email && user_mobile == user_data?.user_mobile){
			toast({
				title: '',
				description: 'You have not made any changes',
				status: 'info',
				isClosable: true,
			});
			return ;
		}else{
			//console.log(payload)
			await Edit_Admin_User(payload).then(()=>{
				toast({
					title: '',
					description: 'Your account has been edited successfully, refresh to see changes',
					status: 'success',
					isClosable: true,
				});
			}).then(()=>{
				router.reload()
			}).catch((err)=>{
				toast({
					title: '',
					description: `${err.response.data}`,
					status: 'error',
					isClosable: true,
				});
			})
		}
	}

	const handle_LogOut=async()=>{
		const payload ={
			_id : user_data?._id,
			login_status : false
		}
		await Edit_Admin_User(payload).then(()=>{
			toast({
              title: '',
              description: `you have been successfully logged out, we are redirecting you.`,
              status: 'success',
              isClosable: true,
            });
		}).then(()=>{
			setTimeout(()=>{
				cookies.remove('admin_token', { path: '/' });
				router.push('/')
			},2000)
		}).catch((err)=>{
			toast({
              title: 'error while logging out',
              description: ``,
              status: 'error',
              isClosable: true,
            });
			//console.log(err);
		})
	}

	const [code,set_code]=useState(0);
	const [confirmation_code,set_confirmation_code]=useState(0);

	const Generate_Code=async()=>{
		const characters = '0123456789';
		let result = ''
		const charactersLength = characters.length

		for (let i = 0;i<6;i++){
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		cookies.set('password_reset_code', result, { path: '/' });
		set_code(result)
		return result
  	}

  	const Compare_Codes=()=>{
  		if (code === confirmation_code){
  			set_is_code_verified(true);
			set_code("");
			set_confirmation_code("");
  		}else{
  			toast({
	          title: '',
	          description: `wrong code,try again `,
	          status: 'error',
	          isClosable: true,
	        });
  		}
  	}

  	const Send_Code_Email=async()=>{
  		const validprokemiaRegex = /([a-zA-Z0-9]+)([\.{1}])?([a-zA-Z0-9]+)\@prokemia([\.])com/g;
		const email = user_data?.user_email
  		if (!email.match(validprokemiaRegex)){
  			toast({
				title: '',
				description: 'Use a valid email format e.g example@company.com',
				status: 'info',
				isClosable: true,
			});
			return;
  		}else{
	  		const code = await Generate_Code()
	  		const payload = {
	  			code,
	  			email
	  		}
	  		await Send_Password_Otp(payload).then(()=>{
				set_is_verification_code_sent(true)
			}).catch((err)=>{
				toast({
					title: '',
					description: 'error while sending code',
					status: 'error',
					isClosable: true,
				});
			})
	  	}
  	}

	const handle_Change_Password=async()=>{
		const payload = {
			_id: user_data?._id,
			user_password,
		}
		if(!user_password || user_password == ''){
			toast({
				title: '',
				description: 'You have not entered any input',
				status: 'info',
				isClosable: true,
			});
			return ;
		}else{
			await Change_Password(payload).then(()=>{
				toast({
					title: '',
					description: 'Your password has been edited successfully, we are logging you out.',
					status: 'success',
					isClosable: true,
				});
			}).then(()=>{
				handle_LogOut()
			}).catch((err)=>{
				toast({
					title: '',
					description: `${err.response.data}`,
					status: 'error',
					isClosable: true,
				});
			})
		}
	}
	
	return(
		<Flex direction={'column'} gap='2' h='100vh'>
            <Header/>
			<Flex bg='#eee' h='100%' p='2' direction='column' gap='1'>
				<Flex className={styles.page_infomation_details_Description} >
					<Text fontSize='32px' fontWeight='bold' className={styles.page_infomation_details_Title}>Profile</Text>
					<Flex fontSize={'12px'} color='grey' gap='1' fontWeight={'bold'} className={styles.page_infomation_details_Link}>
						<Text cursor='pointer' color='#009393' onClick={(()=>{router.push('/dashboard')})}>Dashboard</Text>
						<Text>&gt;</Text>
						<Text>profile</Text>	
					</Flex>
				</Flex>
				<Flex bg='#fff' borderRadius={'5'} flex={'1'} p='8' direction={'column'} gap='1'>	
					<Flex gap='4' align='center'>
						{image_edit?
							<Flex direction='column' gap='2'>
								<Input type='file' placeholder='Select Image to set as Profile Image' accept='.jpg,.png,.jpeg' variant='filled' onChange={((e)=>{set_image(e.target.files[0])})}/>
								<Flex gap='2'>
									<Button bg='#009393' color='#fff' onClick={profile_upload_function}>Change profile photo</Button>
									<Button bg='#fff' color='#000' border='1px solid #000' onClick={(()=>{set_image_edit(!image_edit)})}>cancel</Button>
								</Flex>
							</Flex>
							:
							<>
								{user_data?.user_image == ''? 
									<Flex w='100px' position='relative' cursor='pointer' onClick={(()=>{set_image_edit(!image_edit)})}>
										<AccountCircleIcon style={{fontSize:'130px',padding:'10px',color:'grey',}}/>
										<EditIcon style={{fontSize:'20px',padding:'2px',position:'absolute',bottom:"35px",right:'-15px',backgroundColor:"#009393",borderRadius:'20px',color:'#fff'}}/>
									</Flex>
								: 
									<Flex w='100px' position='relative' cursor='pointer' onClick={(()=>{set_image_edit(!image_edit)})}>
										<Image w='100px' h='100px' borderRadius='999' src={user_data.user_image} alt='profile photo' boxShadow='lg' objectFit='cover'/>
										<EditIcon style={{fontSize:'20px',padding:'2px',position:'absolute',bottom:"15px",right:'-5px',backgroundColor:"#009393",borderRadius:'20px',color:'#fff'}}/>
									</Flex>
								}
								<Flex direction='column' gap='1' ml='2'>
									<Text fontWeight={'bold'}>{user_data?.user_name}</Text>
									<Text fontSize={'12px'} color='orange' fontWeight='bold'>{user_data?.role}</Text>
									<Text fontSize={'10px'} color='grey'>{user_data?.user_email}</Text>
								</Flex>
							</>
						}
					</Flex>
					<Flex direction='column' gap='4'>
						<Flex direction='column'>
							<Text fontWeight='bold' color='grey'>Username</Text>
							<Input type='text' placeholder={user_data?.user_name} variant='filled' onChange={((e)=>{set_user_name(e.target.value)})}/>
						</Flex>
						<Flex gap='2' w='100%'>
							<Flex flex='1' direction='column'>
								<Text fontWeight='bold' color='grey'>mobile</Text>
								<Input type='tel' placeholder={user_data?.user_mobile} variant='filled' onChange={((e)=>{set_user_mobile(e.target.value)})}/>
							</Flex>
							<Flex flex='1' direction='column'>
								<Text fontWeight='bold' color='grey'>email</Text>
								<Input type='email' placeholder={user_data?.user_email} variant='filled' onChange={((e)=>{set_user_email(e.target.value)})}/>
							</Flex>
						</Flex>
					</Flex>
					<Flex justify={'start'}>
						<Button mt='2' align='center' bg='#009393' color='#fff' onClick={handle_Edit_Profile}>Save changes</Button>
					</Flex>
					<Flex direction='column' gap='2'>
						<Text fontSize='20px' fontWeight='bold' color='grey'>Settings</Text>
						<Divider/>
						{is_change_password?
							<>
								{is_verification_code_sent?
									<>
										{is_code_verified?
												<Flex direction='column' gap='2'>
													<Input type='password' autoComplete='off' placeholder='change password' value={user_password} variant='filled' onChange={((e)=>{set_user_password(e.target.value)})}/>
													<Flex gap='2'>
														<Button w='100px' bg='#009393' color='#fff' onClick={handle_Change_Password}>save</Button>
														<Button w='100px' bg='#fff' color='#000' border='1px solid #000' onClick={(()=>{set_is_change_password(!is_change_password);set_is_verification_code_sent("");set_is_code_verified("");})}>Cancel</Button>
													</Flex>
												</Flex>
											:
												<Flex direction='column' gap='2'>
													<Input variant='filled' bg='#eee' required type='Number' placeholder='Enter Code' onChange={((e)=>{set_confirmation_code(e.target.value)})}/>
													<Flex gap='2'>
														<Button bg='grey' color='#fff' flex='1' onClick={Send_Code_Email}>Resend Code</Button>
														<Button bg='#009393' flex='1' color='#fff' onClick={Compare_Codes}>Verify Code</Button>
													</Flex>
													<Text onClick={(()=>{set_is_change_password(!is_change_password);set_is_verification_code_sent("");set_is_code_verified("");})} color='grey' cursor='pointer'>Cancel</Text>
												</Flex>
										}
									</>
									:
									<Flex direction='column' gap='2'>
										<Text color='grey'>A code will be sent to <span style={{color:'#009393',fontWeight:'bold'}}>{user_data?.user_email}</span> for verification.</Text>
										<Flex gap='2'>
											<Button color='#009393' onClick={Send_Code_Email} border='1px solid #eee'>Send Code</Button>
											<Button w='100px' bg='#eee' onClick={(()=>{set_is_change_password(false)})}>Cancel</Button>
										</Flex>
									</Flex>
								}
							</>
							:
							<Flex justify={'start'}>
								<Button color='grey' onClick={(()=>(set_is_change_password(true)))} border='1px solid #eee'>change password</Button>
							</Flex>
						}
					</Flex>
				</Flex>
			</Flex>
		</Flex>
	)
}