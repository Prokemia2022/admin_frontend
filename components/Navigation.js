import {
    Avatar,
    AvatarBadge,
    Badge,
    Box,
    Button,
    Collapse,
    Divider,
    Drawer,
    DrawerContent,
    DrawerOverlay,
    Flex,
    HStack,
    Icon,
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    Menu,
    MenuButton,
    MenuDivider,
    MenuList,
    SkeletonText,
    Text,
    VStack,
    useDisclosure,
    useToast,
  } from "@chakra-ui/react";

import {useRouter} from 'next/router';
import Cookies from 'universal-cookie';
import jwt_decode from "jwt-decode";

//Hooks
import Get_Admin_User from '../pages/api/auth/get_admin_user.js';
import Edit_Admin_User from '../pages/api/auth/edit_admin_user.js';
import Notifications from "../pages/api/controls/notifications.js";


import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import {Receipt,Widgets,Inventory, Pending} from '@mui/icons-material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AddIcon from '@mui/icons-material/Add';
import CategoryIcon from '@mui/icons-material/Category';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';

import { useEffect, useState } from "react";

import Notification_Drawer from '../components/Notification_Drawer.js'

function New_Navigation_Tab({children}){
    const sidebar = useDisclosure();

    const router = useRouter();
	  const toast = useToast();
	  const cookies = new Cookies();
  	let token = cookies.get('admin_token');
    const View_notifications_integrations = useDisclosure();

	  const [user_data,set_user_data] = useState('');
    const [is_loading,set_is_loading] = useState(false);

    const [notifications_obj,set_notifications_obj]=useState({})
    //console.log(router)

    useEffect(()=>{
	    if (!token){
	    	toast({
              title: '',
              description: `You need to signed in, to have access`,
              status: 'info',
              isClosable: true,
            });
	    	router.push("/")
			return;
	    }else if(token && token === 'undefined'){
        router.push('/');
        return ;
      }else{
        try{
          let decoded = jwt_decode(token);
          let id = decoded?.id
          fetch_user_details(id);
          Fetch_Notifications()
        }catch(error){
          console.error(error)
        }
		}
	},[]);

  const Fetch_Notifications=async()=>{
    await Notifications().then((res)=>{
      //console.log(res.data)
      set_notifications_obj(res.data)
    }).catch((err)=>{
      //console.log(err)
    })
  }

    const Handle_signout=async()=>{
      const payload ={
        _id : user_data?._id,
        login_status : false
      }
      await Edit_Admin_User(payload).then(()=>{
        cookies.remove('admin_token', { path: '/' });
        toast({
                title: 'successfully logged out',
                description: ``,
                status: 'success',
                isClosable: true,
              });
      }).then(()=>{
        router.push('/')
      }).catch((err)=>{
        console.log(err)
        toast({
                title: 'error while logging out',
                description: ``,
                status: 'error',
                isClosable: true,
              });
        //console.log(err);
      })
    }

    const fetch_user_details=async(id)=>{
        
        set_is_loading(true)
		////console.log(id)
		const payload = {
			_id : id
		}
		//console.log(payload)
		await Get_Admin_User(payload).then((res)=>{
			//console.log(res.data)
			if (res.data?.login_status){
				set_user_data(res.data);
                set_is_loading(false)
			}else{
				router.push('/');
				cookies.remove('admin_token', { path: '/' });
				toast({
					title: 'You have been signed out.',
					description: `For any issues contact support or the administrator.`,
					position: 'top-left',
					variant: 'subtle',
					isClosable: true,
				});
                set_is_loading(false)
				return ;
			}
		}).catch((err)=>{
			if (err.response?.status == 500){
				toast({
					title: 'Error while logging in.',
					description: `${err.response?.data}`,
					status: 'error',
					position: 'top-left',
					variant: 'subtle',
					isClosable: true,
				});
				router.push('/');
                set_is_loading(false)
				return ;
			}
			//console.log(err)
		})
	}

    return(
        <Box
            as="section"
            bg="gray.50"
            _dark={{
            bg: "gray.700",
            }}
            minH="100vh"
        >
        <SidebarContent
          display={{
            base: "none",
            md: "unset",
          }}
          user_data={user_data}
          router={router}
          notifications={notifications_obj}
        />
        <Drawer
          isOpen={sidebar.isOpen}
          onClose={sidebar.onClose}
          placement="left"
        >
          <DrawerOverlay />
          <DrawerContent>
            <SidebarContent w="full" borderRight="none" router={router} user_data={user_data} notifications={notifications_obj}/>
          </DrawerContent>
        </Drawer>
        <Box
          ml={{
            base: 0,
            md: 60,
          }}
          transition=".3s ease"
        >
          <Flex
            as="header"
            align="center"
            justify="space-between"
            w="full"
            px="4"
            bg="white"
            _dark={{
              bg: "gray.800",
            }}
            borderBottomWidth="1px"
            color="inherit"
            h="14"
          >
            <IconButton
              aria-label="Menu"
              display={{
                base: "inline-flex",
                md: "none",
              }}
              onClick={sidebar.onOpen}
              icon={<MenuIcon />}
              size="sm"
            />
            
            <Button display={{ base: "none", md: "flex" }} colorScheme="teal" leftIcon={<AddIcon />} onClick={(()=>{router.push('/inventory_new/product/new')})}>New Product</Button>
            <Flex 
              align="center"
              gap='3'
            >
            <Box position='relative' _hover={{bg:'#eee',borderRadius:'full'}} onClick={View_notifications_integrations.onOpen}>
              <Icon color="gray.500" as={NotificationsIcon} cursor="pointer"/>
              <Badge bg='orange' borderRadius='full' position='absolute' top='0' right='0' p='1' />
              <Notification_Drawer View_notifications_integrations={View_notifications_integrations} notifications={notifications_obj}/>
            </Box>
              <Menu>
                <MenuButton py={2} transition="all 0.35" _focus={{boxShadow: 'none' }}>
                  <HStack>
                    <Avatar
                      size={"sm"}
                      name={user_data?.user_name}
                      src={user_data?.user_image}
                    />
                    <VStack
                      display={{ base: 'none', md: 'flex' }}
                      alignItems="flex-start"
                      spacing="1px"
                      ml="2">
                      <Text fontSize="sm">{user_data?.user_name}</Text>
                      <Text fontSize="xs" color="gray.600">
                        {user_data?.role}
                      </Text>
                    </VStack> 
                    <Box display={{ base: 'none', md: 'flex' }}>
                      <ArrowDropDownIcon />
                    </Box>
                  </HStack>
                </MenuButton>
                <MenuList>
                  <MenuItem flexDirection='column' alignItems='start'>
                    <Text>{user_data?.user_name}</Text>
                    <Text fontSize={'xs'} color='grey' fontWeight={'bold'}>{user_data?.user_email}</Text>
                  </MenuItem>
                  <MenuItem onClick={(()=>{router.push(`/profile_new/${user_data?._id}`)})}>
                    Profile
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem fontWeight='bold' color='#009393' onClick={Handle_signout}>Sign out</MenuItem>
                </MenuList>
            </Menu>
            </Flex>
          </Flex>
  
          <Box as="main" p="4">
            {/* Add content here, remove div below  */}
            {is_loading?
                <Box padding='6' boxShadow='lg' bg='white' gap='2' borderRadius='5'>
                    <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='2' />
                </Box>
            :
                <Box p='4' rounded="md" >
                    {children}
                </Box>
            }
          </Box>
        </Box>
      </Box>
    )
}

export default New_Navigation_Tab;

const MenuItem = (props) => {
  const { icon, children, ...rest } = props;
  return (
    <Flex
      align="center"
      m='2'
      px="4"
      pl="4"
      py="1"
      cursor="pointer"
      color="inherit"
      _dark={{ color: "gray.400" }}
      _hover={{
        bg: "gray.100",
        _dark: { bg: "gray.900" },
        color: "gray.900",
        borderRadius:5
      }}
      role="group"
      fontWeight="regular"
      fontSize={'md'}
      transition=".3s ease"
      {...rest}
    >
      {icon && (
        <Icon
          mx="2"
          boxSize="5"
          _groupHover={{
            color: "gray.900",
          }}
          as={icon}
        />
      )}
      {children}
    </Flex>
  );
};

const NavItem = (props) => {
    const { icon, children, ...rest } = props;
    return (
      <Flex
        align="center"
        m='2'
        px="4"
        pl="4"
        py="3"
        cursor="pointer"
        color="inherit"
        _dark={{ color: "gray.400" }}
        _hover={{
          bg: "gray.100",
          _dark: { bg: "gray.900" },
          color: "gray.900",
          borderRadius:5
        }}
        role="group"
        fontWeight="regular"
        fontSize={'md'}
        transition=".3s ease"
        {...rest}
      >
        {icon && (
          <Icon
            mx="2"
            boxSize="5"
            _groupHover={{
              color: "gray.900",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    );
  };

const SidebarContent = (props) => {
    const router = useRouter();
  const integrations = useDisclosure();
  const category_integrations = useDisclosure()
  return(
  
    <Box
      as="nav"
      pos="fixed"
      top="0"
      left="0"
      zIndex="sticky"
      h="full"
      pb="10"
      overflowX="hidden"
      overflowY="auto"
      bg="white"
      _dark={{
        bg: "gray.800",
      }}
      bordercolor="inherit"
      borderRightWidth="1px"
      w="60"
      {...props}
    >
      <Flex px="4" py="5" align="center">
        <Text
          fontSize="2xl"
          ml="2"
          color="brand.500"
          _dark={{
            color: "white",
          }}
          fontWeight="semibold"
        >
          Prokemia
        </Text>
        </Flex>
        
      <Flex
        direction="column"
        as="nav"
        fontSize="sm"
        color="gray.600"
        aria-label="Main Navigation"
        gap='1'
      >
        <NavItem display={{ base: "block", md: "none" }} bg={'teal'} borderRadius='md' color='#fff' icon={AddIcon} onClick={(()=>{router.push('/inventory_new/product/new')})}>
          New Product
        </NavItem>
        <NavItem bg={router?.asPath == '/dashboard_new'? 'teal.100' : ''} borderRadius={router?.asPath == '/dashboard_new'? 'md' : ''} icon={Widgets} onClick={(()=>{router.push("/dashboard_new")})}>
          Dashboard
        </NavItem>
        <NavItem bg={router?.asPath == '/inventory_new'? 'teal.100' : ''} borderRadius={router?.asPath == '/inventory_new'? 'md' : ''} icon={Inventory} onClick={(()=>{router.push("/inventory_new")})}>
          Inventory 
          {props.notifications?.products?.length === 0?
            (null)
          :
            <Badge ml='1' fontSize='sm' bg='orange' borderRadius='sm' p='1'>
              {props.notifications?.products?.length}
            </Badge>
          }
        </NavItem>
        <NavItem bg={router?.asPath == '/orders_new'? 'teal.100' : ''} borderRadius={router?.asPath == '/orders_new'? 'md' : ''} icon={Receipt} onClick={(()=>{router.push(`/orders_new`)})}>
          Orders
          {props.notifications?.orders?.length === 0?
            (null)
          :
            <Badge ml='1' fontSize='sm' bg='orange' borderRadius='sm' p='1'>
              {props.notifications?.orders?.length}
            </Badge>
          }
        </NavItem>
        <NavItem bg={router?.asPath == '/salespeople_new'? 'teal.100' : ''} borderRadius={router?.asPath == '/salespeople_new'? 'md' : ''} icon={AccountBoxIcon} onClick={(()=>{router.push("/salespeople_new")})}>
          Salespeople
          {props.notifications?.salespeople?.length === 0?
            (null)
          :
            <Badge ml='1' fontSize='sm' bg='orange' borderRadius='sm' p='1'>
              {props.notifications?.salespeople?.length}
            </Badge>
          }
        </NavItem>
        <NavItem bg={router?.asPath == '/customers_new'? 'teal.100' : ''} borderRadius={router?.asPath == '/customers_new'? 'md' : ''} icon={AccountBoxIcon} onClick={(()=>{router.push(`/customers_new`)})}>
          Customers
        </NavItem>
        <NavItem bg={router?.asPath == '/suppliers_new/distributors'? 'teal.100' : ''} borderRadius={router?.asPath == '/suppliers_new/distributors'? 'md' : ''} icon={AccountBoxIcon} onClick={(()=>{router.push("/suppliers_new/distributors")})}>
          Distributors
          {props.notifications?.distributors?.length === 0?
            (null)
          :
            <Badge ml='1' fontSize='sm' bg='orange' borderRadius='sm' p='1'>
              {props.notifications?.distributors?.length}
            </Badge>
          }
        </NavItem>
        <NavItem bg={router?.asPath == '/suppliers_new/manufacturers'? 'teal.100' : ''} borderRadius={router?.asPath == '/suppliers_new/manufacturers'? 'md' : ''} icon={AccountBoxIcon} onClick={(()=>{router.push(`/suppliers_new/manufacturers`)})}>
          Manufacturers
          {props.notifications?.manufacturers?.length === 0?
            (null)
          :
            <Badge ml='1' fontSize='sm' bg='orange' borderRadius='sm' p='1'>
              {props.notifications?.manufacturers?.length}
            </Badge>
          }
        </NavItem>
        <Box p='' >
          <NavItem 
            icon={CategoryIcon} 
            onClick={category_integrations.onToggle} 
            bg={router?.asPath == '/categories/industries' || router?.asPath == '/categories/technologies' || router?.asPath == '/categories/careers'? 'teal.100' : '' || router?.asPath == '/categories/support/tickets' || router?.asPath == '/categories/requests'? 'teal.200' : ''} 
            borderRadius={router?.asPath == '/categories/industries' || router?.asPath == '/categories/technologies' || router?.asPath == '/categories/careers'? 'md' : '' || router?.asPath == '/categories/support/tickets' || router?.asPath == '/categories/requests'? 'md' : ''}
          >
            Category items
            {props.notifications?.industries?.length === 0 || props.notifications?.industries?.length === 0?
              (null)
            :
              <Badge ml='1' fontSize='sm' bg='orange' borderRadius='sm' p='1'/>
            }
            <Icon
              as={ArrowRightIcon}
              ml="auto"
              transform={category_integrations.isOpen && "rotate(90deg)"}
            />
          </NavItem>
          <Collapse in={category_integrations.isOpen}>
            <NavItem pl="12" py="2" onClick={(()=>{router.push(`/categories/industries`)})} bg={router?.asPath == '/categories/industries'? 'teal.100' : ''} borderRadius={router?.asPath == '/categories/industries'? 'md' : ''}>
              Industries
              {props.notifications?.industries?.length === 0?
                (null)
              :
                <Badge ml='1' fontSize='sm' bg='orange' borderRadius='sm' p='1'>
                  {props.notifications?.industries?.length}
                </Badge>
              }
            </NavItem>
            <NavItem pl="12" py="2" onClick={(()=>{router.push(`/categories/technologies`)})} bg={router?.asPath == '/categories/technologies'? 'teal.100' : ''} borderRadius={router?.asPath == '/categories/technologies'? 'md' : ''}>
              Technology
              {props.notifications?.technologies?.length === 0?
                (null)
              :
                <Badge ml='1' fontSize='sm' bg='orange' borderRadius='sm' p='1'>
                  {props.notifications?.technologies?.length}
                </Badge>
              }
            </NavItem>
            <NavItem pl="12" py="2" onClick={(()=>{router.push(`/categories/careers`)})} bg={router?.asPath == '/categories/careers'? 'teal.100' : ''} borderRadius={router?.asPath == '/categories/careers'? 'md' : ''}>
              Careers
            </NavItem>
            <NavItem pl="12" py="2" onClick={(()=>{router.push(`/categories/applications`)})} bg={router?.asPath == '/categories/applications'? 'teal.100' : ''} borderRadius={router?.asPath == '/categories/applications'? 'md' : ''}>
              Applications
            </NavItem>
            <NavItem pl="12" py="2" onClick={(()=>{router.push(`/categories/support/tickets`)})} bg={router?.asPath == '/categories/support/tickets'? 'teal.100' : ''} borderRadius={router?.asPath == '/categories/support/tickets'? 'md' : ''}>
              Support tickets
            </NavItem>
            <NavItem pl="12" py="2" onClick={(()=>{router.push(`/categories/requests`)})} bg={router?.asPath == '/categories/requests'? 'teal.100' : ''} borderRadius={router?.asPath == '/categories/requests'? 'md' : ''}>
              Demonstration requests
            </NavItem>
          </Collapse>
        </Box>
        {props.user_data?.role === 'Manager' || props.user_data?.role === 'Tech Support'?
          <Box p='' >
            <Text ml='2' fontWeight={'semibold'} fontSize={'small'} color='grey'>Management</Text>
            <Divider/>
            <NavItem 
              icon={AdminPanelSettingsIcon} 
              onClick={integrations.onToggle}
              bg={router?.asPath == '/admin_panel/users_management' || router?.asPath == '/admin_panel/role_management' ? 'teal.100' : ''} 
              borderRadius={router?.asPath == '/admin_panel/users_management' || router?.asPath == '/admin_panel/role_management'? 'md' : ''}
            >
              Admin Panel
              <Icon
                as={ArrowRightIcon}
                ml="auto"
                transform={integrations.isOpen && "rotate(90deg)"}
              />
            </NavItem>
            <Collapse in={integrations.isOpen}>
              <NavItem pl="12" py="2" onClick={(()=>{router.push(`/admin_panel/users_management`)})} bg={router?.asPath == '/admin_panel/users_management'? 'teal.100' : ''} borderRadius={router?.asPath == '/admin_panel/users_management'? 'md' : ''}>
                Manage users
              </NavItem>
              <NavItem pl="12" py="2" onClick={(()=>{router.push(`/admin_panel/role_management`)})} bg={router?.asPath == '/admin_panel/role_management'? 'teal.100' : ''} borderRadius={router?.asPath == '/admin_panel/role_management'? 'md' : ''}>
                Manage roles
              </NavItem>
            </Collapse>
          </Box>
          :
          (null)
        }
        <NavItem 
          bg={router?.asPath == '/analytics'? 'teal.100' : ''} 
          borderRadius={router?.asPath == '/analytics'? 'md' : ''} 
          icon={LeaderboardIcon}
          onClick={(()=>{router.push(`/analytics`)})}
        >
          Analytics
        </NavItem>
      </Flex>
    </Box>
  )};

//   <NavItem 
//   icon={HelpCenterIcon} 
// >
//   HelpCenter
// </NavItem>