import React from 'react';
import { Center, VStack, Text, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Image, Heading } from '@chakra-ui/react';

export default function NoEventPage({ text }) {
    return (
        <Center>
            <VStack py="20px">
                <Image alt="NoData" src="/images/noEvent.png"/>
                <Text fontSize="18px" fontWeight="700" color="#939090">{text}</Text>
                {/* <Text fontSize="14px" fontWeight="700" color="#3D484D">You have no upcoming events</Text> */}
            </VStack>
        </Center>
    )
}