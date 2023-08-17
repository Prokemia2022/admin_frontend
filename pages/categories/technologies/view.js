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

function View_Technology({View_technology_integrations,item}){
	return(
        <Drawer
            isOpen={View_technology_integrations.isOpen}
            placement='right'
            onClose={View_technology_integrations.onClose}
            size={{
                base:'full',
                md:'md'
            }}
        >
            <DrawerOverlay />
            <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Technology</DrawerHeader>
            <DrawerBody>
                <Image boxShadow={'md'} src={item?.cover_image} borderRadius='md' w='full' h='80' objectFit='cover' alt='technology_cover_image' fallbackSrc='../Pro.png'/>
                <Box mt='2'>
                    <Text fontWeight={'bold'}>Name of the technology</Text>
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
                <Button variant='outline' mr={3} onClick={View_technology_integrations.onClose}>
                    Back
                </Button>
            </DrawerFooter>
            </DrawerContent>
        </Drawer>
	)
}

export default View_Technology;