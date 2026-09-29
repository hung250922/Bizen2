import React from 'react';
import { Button, IconButton, Avatar, Box, Flex, HStack, VStack, Text, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Image, Heading } from '@chakra-ui/react';
import { FiChevronDown, FiBell } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function _404Page() {
    const navigate = useNavigate();

    return (
        <Flex flexDirection={{ base: "column", md: "row", lg: "row" }} px={{ base: 2, md: 24, lg: 24 }} py={{ base: 2, md: 36, lg: 36 }} justifyContent="center">
            <VStack align={{base: "center", md: "flex-start", lg: "flex-start"}}>
                <Text fontSize={{ base: "48px", md: "96px", lg: "96px" }} fontWeight="700" color="#000000">Chào bạn!</Text>
                <Text fontSize={{ base: "28px", md: "48px", lg: "48px" }} fontWeight="700" color="#3D484D">Chúng tôi thành thật xin lỗi!</Text>
                <Text fontSize={{ base: "22px", md: "36px", lg: "36px" }} fontWeight="600" color="#666666" my="15px">
                    Chúng tôi không tìm thấy <br />thông tin mà bạn đang tìm kiếm!
                </Text>
                <Button borderRadius={10} bg="#FFC701" color="#000000" width={48} height={16}
                        onClick={() =>  {
                            navigate('/');
                        }}
                    >
                        <Text fontSize="24px" fontWeight="800">TRANG CHỦ</Text>
                </Button>
            </VStack>
            <Image alt="404Page" src="/images/robot404.png"/>
        </Flex>
    )
}