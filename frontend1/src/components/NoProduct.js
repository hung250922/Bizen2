import React from 'react';
import { Center, VStack, Text, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Image, Heading } from '@chakra-ui/react';

export default function NoProductPage({ message }) {
    return (
        <Center>
            <VStack py="20px">
                <Image alt="NoData" src="/images/noProduct.png"/>
                <Text fontSize="18px" fontWeight="700" color="#939090">No Product</Text>
                <Text fontSize="14px" fontWeight="700" color="#3D484D">{message}</Text>
            </VStack>
        </Center>
    )
}