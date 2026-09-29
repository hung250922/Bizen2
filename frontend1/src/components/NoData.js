import React from 'react';
import { Center, VStack, Text, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Image, Heading } from '@chakra-ui/react';

export default function NoDataPage({ text }) {
    return (
        <Center>
            <VStack py="10px">
                <Image alt="NoData" src="/images/noData.png"/>
                <Text fontSize="18px" fontWeight="700" color="#939090">{text}</Text>
            </VStack>
        </Center>
    )
}