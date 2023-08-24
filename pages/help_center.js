import React, { useEffect, useState } from "react";
import {
    Text, 
    Box, 
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    TableContainer,
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
    Badge,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button,
    HStack,
    Input,
    InputGroup,
    InputLeftElement,
    SimpleGrid,
    Select,
    InputRightElement,
    Tag,
    TagLabel,
    TagCloseButton,
    Grid,
    Wrap,
    GridItem,
    Divider,
    useToast,
    Link,
    Tooltip,
    Avatar,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    WrapItem,
    CircularProgress, 
    CircularProgressLabel,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Skeleton,
    IconButton,
    Flex
} from '@chakra-ui/react';
import Navigation from '../components/Navigation';
//utils
import {useRouter} from 'next/router';
import Cookies from 'universal-cookie';
import jwt_decode from "jwt-decode";
import moment from 'moment';
//icons
import EmailIcon from '@mui/icons-material/Email';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import PersonIcon from '@mui/icons-material/Person';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import PhoneIcon from '@mui/icons-material/Phone';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import ScheduleIcon from '@mui/icons-material/Schedule';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import UnsubscribeIcon from '@mui/icons-material/Unsubscribe';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';


export default function Client(){
    return(
        <Navigation >
            <Body/>
        </Navigation>
    )
}

const Body=()=>{
    const router = useRouter();
    return(
        <Box gap='2' m={{
            base:'0',
            md:'8'
        }}>
            <HStack justifyContent={'space-between'}>
                <Breadcrumb spacing='5px' alignItems={'center'} fontSize={'sm'} fontWeight={'semibold'}>
                    <BreadcrumbItem>
                        <ChevronLeftIcon style={{fontSize:'20px',marginTop:'2'}}/>
                        <BreadcrumbLink onClick={(()=>{router.back()})}>Back</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
            </HStack>
        </Box>
    )
}

const answers_to_questions=[
    {
        title: 'How to add new product'
    },
    {

    },
]