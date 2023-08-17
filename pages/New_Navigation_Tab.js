import {
    Avatar,
    Box,
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
    Text,
    VStack,
    useColorModeValue,
    useDisclosure,
  } from "@chakra-ui/react";

import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import {Receipt,Widgets,Inventory} from '@mui/icons-material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

function New_Navigation_Tab(){
    const sidebar = useDisclosure();
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
        />
        <Drawer
          isOpen={sidebar.isOpen}
          onClose={sidebar.onClose}
          placement="left"
        >
          <DrawerOverlay />
          <DrawerContent>
            <SidebarContent w="full" borderRight="none" />
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
            <InputGroup w="96" display={{ base: "none", md: "flex" }}>
              <InputLeftElement color="gray.500">
                <SearchIcon />
              </InputLeftElement>
              <Input placeholder="Search for articles..." />
            </InputGroup>
            
            <Flex 
              align="center"
              gap='3'
            >
              <Icon color="gray.500" as={NotificationsIcon} cursor="pointer" />
              <Menu>
                <MenuButton py={2} transition="all 0.35" _focus={{boxShadow: 'none' }}>
                  <HStack>
                    <Avatar
                      size={"sm"}
                      name='Dan Abrahmov'
                      src={
                      "https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb- 0.3.5&q=80&fm=jpg&crop-faces&fit=crop&h=200&w=20085-b616b2c5b373a80ffc9636ba24f7a4a9"}
                    />
                    <VStack
                      display={{ base: 'none', md: 'flex' }}
                      alignItems="flex-start"
                      spacing="1px"
                      ml="2">
                      <Text fontSize="sm">Justina Clark</Text>
                      <Text fontSize="xs" color="gray.600">
                        Admin
                      </Text>
                    </VStack> 
                    <Box display={{ base: 'none', md: 'flex' }}>
                      <ArrowDropDownIcon />
                    </Box>
                  </HStack>
                </MenuButton>
                <MenuList>
                  <MenuItem flexDirection='column' alignItems='start'>
                    <Text>Justina Clark</Text>
                    <Text fontSize={'xs'} color='grey' fontWeight={'bold'}>Justina Clark</Text>
                  </MenuItem>
                  <MenuItem>Settings</MenuItem>
                  <MenuDivider />
                  <MenuItem fontWeight='bold' color='#009393'>Sign out</MenuItem>
                </MenuList>
            </Menu>
            </Flex>
          </Flex>
  
          <Box as="main" p="4">
            {/* Add content here, remove div below  */}
            <Box borderWidth="4px" borderStyle="dashed" rounded="md" h="2000" />
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
  const integrations = useDisclosure();
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
        <NavItem icon={Widgets} onClick={(()=>{router.push("/dashboard")})}>
          Dashboard
        </NavItem>
        <NavItem icon={NotificationsIcon} onClick={(()=>{router.push(`/notifications`)})}>
          Notifications
        </NavItem>
        <NavItem icon={Inventory} onClick={(()=>{router.push("/inventory")})}>
          Inventory
        </NavItem>
        <NavItem icon={Receipt} onClick={(()=>{router.push(`/orders`)})}>
          Orders
        </NavItem>
        <NavItem icon={AccountBoxIcon} onClick={(()=>{router.push("/salespersons")})}>
          Salespersons
        </NavItem>
        <NavItem icon={AccountBoxIcon} onClick={(()=>{router.push(`/customers`)})}>
          Customers
        </NavItem>
        <NavItem icon={AccountBoxIcon} onClick={(()=>{router.push("suppliers/distributors")})}>
          Distributors
        </NavItem>
        <NavItem icon={AccountBoxIcon} onClick={(()=>{router.push(`suppliers/manufacturers`)})}>
          Manufacturers
        </NavItem>
        <Box p='' >
          <Text ml='2' fontWeight={'semibold'} fontSize={'small'} color='grey'>Management</Text>
          <Divider/>
          <NavItem icon={AdminPanelSettingsIcon} onClick={integrations.onToggle}>
            Admin Panel
            <Icon
              as={ArrowRightIcon}
              ml="auto"
              transform={integrations.isOpen && "rotate(90deg)"}
            />
          </NavItem>
          <Collapse in={integrations.isOpen}>
            <NavItem pl="12" py="2">
              Manage users
            </NavItem>
            <NavItem pl="12" py="2">
              Manage roles
            </NavItem>
          </Collapse>
        </Box>
        <NavItem icon={HelpCenterIcon} onClick={(()=>{router.push(`/`)})}>
          HelpCenter
        </NavItem>
      </Flex>
    </Box>
  )};