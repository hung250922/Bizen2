import React, { useState, useRef, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { 
    Flex, Heading, Input, Button, ButtonGroup, Text, CircularProgress, CircularProgressLabel,
    InputGroup, InputLeftElement, InputRightElement, Icon, IconButton, Select,
    Stack, HStack, Image, Wrap, WrapItem, Center, InputRightAddon,
    Tabs, Tab, TabList, TabPanels, TabPanel,
    Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, useDisclosure, useToast
} from '@chakra-ui/react';
import ReactPaginate from 'react-paginate';
import { MdSettings, MdAdd, MdAddCircleOutline, MdCalendarToday, MdSearch, MdEdit, MdDeleteForever, MdSave } from 'react-icons/md';
import { BsArrowLeftCircle, BsArrowRightCircle } from 'react-icons/bs';
import { useNavigate, useLocation } from 'react-router-dom';
import { FormattedDate, FormattedTime } from 'react-intl';

import { sleep } from "../../utils/helpers"
import Users from '../Users';

const SORT_BY_LIST = [
    { title: "Theo thời gian", value: "id" },
    { title: "Theo họ tên", value: "full_name" },
];

const SORT_DIR_LIST = [
    { title: "Giảm dần", value: "desc" },
    { title: "Tăng dần", value: "asc" }, 
];

function Admin() {
    const [ cookies, setCookie, removeCookie ] = useCookies(["loginCookie"]);
    const [isAllowAccessThisPage, setIsAllowAccessThisPage] = useState(true);
    const initialRef = useRef(null);
    const toast = useToast();
    const navigate = useNavigate();
    const { search } = useLocation();
    const [limit, setLimit] = useState(25);
    const [order_by, setOrderBy] = useState(SORT_BY_LIST[0]["value"]);
    const [order_dir, setOrderDir] = useState(SORT_DIR_LIST[0]["value"]);
    const [searchText, setSearchText] = useState("");
    const mouted = useRef();

    const query = new URLSearchParams(search);
   
    useEffect(() => {
        if(!mouted.current) {
            //    console.log("--- cookies.loginCookie:", cookies.loginCookie);
            if(
                cookies.loginCookie?.data?.scope !== "admin") {
                setIsAllowAccessThisPage(false);
            }
            mouted.current = true;
        }
    }, []);

    
    if(!isAllowAccessThisPage) {
        return (
            <Flex w="100%" p={4} flexDirection="column" alignItems="flex-start" justify="flex-start" h="100vh">
                <Text color="red.500"  fontSize="2xl" fontWeight="bold">**** Bạn không có quyền truy cập trang này (vui lòng liên hệ admin) ****</Text>
            </Flex>
        );
    }

    return (
        <Flex flexDirection="column" p={4} minHeight="100vh">
            <Flex flexDirection={{ base: "column", md: "row", lg: "row" }} justify="flex-start">
                <Flex flexDirection="column">
                    <Heading size="lg">Quản trị Admin</Heading>
                    <Tabs p={2}>
                        <TabList>
                            <Tab textTransform="uppercase">Tài khoản</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <Users />
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default Admin;