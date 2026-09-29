import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { 
    Flex, Box, Link, Heading, FormControl, FormLabel, Input, Button, ButtonGroup, Text, CircularProgress,
    InputGroup, InputRightElement, Icon, IconButton,
    Stack, HStack, Menu, MenuButton, MenuList, MenuItem,
    Image
} from '@chakra-ui/react';
import { MdLogin, MdLogout, MdGroup, MdPortrait, MdClose } from 'react-icons/md';
import { FaStore, FaWarehouse, FaHammer, FaRegFile, FaUser, FaBars } from 'react-icons/fa';
import { BiImport, BiExport } from 'react-icons/bi';
import { BsPersonSquare } from 'react-icons/bs';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { COMPANY_LOGO } from '../constants';

function Navbar() {
    const [ cookies, setCookie, removeCookie ] = useCookies(["loginCookie", "selectedClinic"]);
    const navigate = useNavigate();
    const [ isShow, setIsShow ] = useState(false);
    const { pathname } = useLocation();

    return (
        <Box mb={{ base: 4, md: 0, lg: 0 }}>
            <Flex justify="flex-start" position="fixed" left={0} top={0}
                display={{ base: isShow ? "none" : "inherit", md: "none", lg: "none" }}
            >
                <IconButton variant="ghost" _hover="transparent" icon={<FaBars />} 
                    onClick={() => {
                        setIsShow(!isShow)
                    }}
                />
            </Flex>
            <Flex flexDirection={{ base: "column", md: "row", lg: "row" }} w="100%" bg="gray.700" p={2} 
                alignItems={{ base: "flex-start", md: "center", lg: "center" }} justify={{ base: "flex-end", md: "space-between", lg: "space-between" }}
                display={{ base: isShow ? "flex" : "none", md: "flex", lg: "flex" }} gap={1}
            >
                <Flex w="100%" flexDirection="row" justify="space-between">
                    <Image alt="logo" src={`/images/${COMPANY_LOGO}`} maxW="119" maxH="79"/> 
                    <Button colorScheme="red"
                        onClick={ () => {
                            removeCookie("loginCookie", { path: "/" });
                            navigate("/login");
                        }}
                    >
                        <Icon boxSize={6} as={MdLogout} marginRight="8px"/>Đăng xuất
                    </Button>
                </Flex>
            </Flex>
        </Box>
    )
}

export default Navbar;