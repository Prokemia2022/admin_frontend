import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
    Text, 
    Box,
    HStack,
    Drawer,
    DrawerOverlay,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    Button,
    Image,
    Link,
} from '@chakra-ui/react';
//api
//utils
import moment from 'moment';
//icons
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LanguageIcon from '@mui/icons-material/Language';

function View_Career({View_career_integrations,item}){
	return(
        <Drawer
            isOpen={View_career_integrations?.isOpen}
            placement='right'
            onClose={View_career_integrations?.onClose}
            size={{
                base:'full',
                md:'md'
            }}
        >
            <DrawerOverlay />
            <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Career</DrawerHeader>
            <DrawerBody>
                <Box mt='2'>
                    <Text fontWeight={'bold'}>Position Title</Text>
                    <Text>{item?.title}</Text>
                </Box>
                <Box mt='2'>
                    <Text fontWeight={'bold'}>Company</Text>
                    <Text>{item?.company}</Text>
                </Box>
                <Box mt='2'>
                    <Text fontWeight={'bold'}>Requirements</Text>
                    <Text>{item?.requirements}</Text>
                </Box>
                <Box mt='2'>
                    <Text fontWeight={'bold'}>Description</Text>
                    <Text>{item?.description}</Text>
                </Box>
                <Box mt='2'>
                    <Text fontWeight={'bold'}>Website</Text>
                    <HStack color='teal' my='2'>
                        <LanguageIcon mx='2px' />
                        <a href={`${item?.link}`} target="_blank" rel="noopener noreferrer">{item?.link}</a>
                    </HStack>
                </Box>
                <Box mt='2'>
                    <Text fontWeight={'bold'}>Valid till</Text>
                    <HStack mt='1'>
                        <CalendarMonthIcon fontSize='16'/>
                        <Text fontSize={'sm'} mt='1'>{moment(item?.valid_till).format("MMM Do YY")}</Text>
                    </HStack>
                </Box>
                <Box mt='2'>
                    <Text fontWeight={'bold'}>Status of the career</Text>
                    <Text>{item?.status}</Text>
                </Box>
                <Box mt='2'>
                    <Text fontWeight={'bold'}>Listed</Text>
                    <HStack mt='1'>
                        <CalendarMonthIcon fontSize='16'/>
                        <Text fontSize={'sm'} mt='1'>{moment(item?.createdAt).format("MMM Do YY")}</Text>
                    </HStack>
                </Box>
                <Box mt='2'>
                    <Text fontWeight={'bold'}>Last updated</Text>
                    <HStack mt='1'>
                        <CalendarMonthIcon fontSize='16'/>
                        <Text fontSize={'sm'} mt='1'>{moment(item?.updatedAt).format("MMM Do YY")}</Text>
                    </HStack>
                </Box>
            </DrawerBody>
            <DrawerFooter>
                <Button variant='outline' mr={3} onClick={View_career_integrations?.onClose}>
                    Back
                </Button>
            </DrawerFooter>
            </DrawerContent>
        </Drawer>
	)
}

export default View_Career;