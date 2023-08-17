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
} from '@chakra-ui/react';
//api
//utils
import moment from 'moment';
//icons
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

function View_Industry({View_industry_integrations,item}){
	return(
        <Drawer
            isOpen={View_industry_integrations.isOpen}
            placement='right'
            onClose={View_industry_integrations.onClose}
            size={{
                base:'full',
                md:'md'
            }}
        >
            <DrawerOverlay />
            <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Industry</DrawerHeader>
            <DrawerBody>
                <Image boxShadow={'md'} src={item?.cover_image} borderRadius='md' w='full' h='80' objectFit='cover' alt='industry_cover_image' fallbackSrc='../Pro.png'/>
                <Box mt='2'>
                    <Text fontWeight={'bold'}>Name of the industry</Text>
                    <Text>{item?.title}</Text>
                </Box>
                <Box mt='2'>
                    <Text fontWeight={'bold'}>Created</Text>
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
                <Box mt='2'>
                    <Text fontWeight={'bold'}>Publish Status</Text>
                    <Text>{item?.publish_status || item?.verification_status ? 'approved' : 'not published'}</Text>
                </Box>
                <Box mt='2'>
                    <Text fontWeight={'bold'}>Description</Text>
                    <Text>{item?.description}</Text>
                </Box>
            </DrawerBody>
            <DrawerFooter>
                <Button variant='outline' mr={3} onClick={View_industry_integrations.onClose}>
                    Back
                </Button>
            </DrawerFooter>
            </DrawerContent>
        </Drawer>
	)
}

export default View_Industry;