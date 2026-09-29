import React, { useState, useRef, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { 
    Flex, Heading, Input, Button, ButtonGroup, Text, CircularProgress, CircularProgressLabel,
    InputGroup, InputLeftElement, InputRightElement, Icon, IconButton, Select,
    Stack, HStack, Image, Wrap, WrapItem, Center, InputRightAddon,
    Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, useDisclosure, useToast,
    VStack, Badge
} from '@chakra-ui/react';
import ReactPaginate from 'react-paginate';
import { MdSettings, MdAdd, MdAddCircleOutline, MdCalendarToday, MdSearch, MdEdit, MdDeleteForever, MdSave, MdLockOpen } from 'react-icons/md';
import { BsArrowLeftCircle, BsArrowRightCircle } from 'react-icons/bs';
import { useNavigate, useLocation } from 'react-router-dom';
import { FormattedDate, FormattedTime } from 'react-intl';
import { MultiSelect } from "react-multi-select-component";
import axios from 'axios';

import { confirmChoice } from "../../utils/helpers";
import { PAGINATION_LIST, AUTHORIZE_TYPES, IS_AUTHORIZED } from "../../constants";
import { sleep } from "../../utils/helpers"

const SORT_BY_LIST = [
    { title: "Theo thời gian", value: "id" },
    { title: "Theo họ tên", value: "full_name" },
];

const SORT_DIR_LIST = [
    { title: "Giảm dần", value: "desc" },
    { title: "Tăng dần", value: "asc" }, 
];

function Users() {
    const [ cookies, setCookie, removeCookie ] = useCookies(["loginCookie"]);
    const initialRef = useRef(null);
    const toast = useToast();
    const navigate = useNavigate();
    const { search } = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(25);
    const [order_by, setOrderBy] = useState(SORT_BY_LIST[0]["value"]);
    const [order_dir, setOrderDir] = useState(SORT_DIR_LIST[0]["value"]);
    const [searchText, setSearchText] = useState("");

    const query = new URLSearchParams(search);
    const page = query.get("page");
    // const pageCount = Math.ceil(total_count / limit);
    const mounted = useRef();

    useEffect(() => {
        setIsLoading(true);
        getUsers();
    }, [page, limit, order_by, order_dir]);


    const getUsers = async(params) => {
        let queryParams = `?limit=${limit}&order_by=${order_by}&order_dir=${order_dir}`;
        console.log("---- queryParams:", queryParams);
        if(params?.searchText) {
            queryParams += `&search=${params.searchText}`;
        }
        const res = await axios.get(`${process.env.REACT_APP_API_ENDPOINT_URL}/users${queryParams}`);
        if(res.data.data) {
            setUsers(res.data.data);
        }
        setIsLoading(false);
    }

    const handlePageClick = (event) => {
        navigate(`/users?page=${event.selected}`);
    } 

    return (
        <Flex flexDirection="column" p={4}>
            <Flex flexDirection={{ base: "column", md: "row", lg: "row" }} justify="space-between">
                <Flex flexDirection={{ base: "column", md: "row", lg: "row" }} gap={4}>
                    <Heading size="lg">Tài khoản</Heading>
                </Flex>

                <Flex flexDirection={{ base: "column", md: "row", lg: "row" }} gap={4}>
                    <InputGroup>
                        <InputLeftElement pointerEvents="none">
                            <Icon as={MdSearch} color="gray.300" />
                        </InputLeftElement>
                        <Input value={searchText} placeholder="Tìm kiếm thông tin" 
                            onChange={(evt) => {setSearchText(evt.currentTarget.value); }}
                            onKeyUp={(evt) => {
                                if(evt.key === "Enter") {
                                    //loadUsers();
                                    console.log("---- searchText", searchText);
                                    getUsers({ searchText, limit, order_by, order_dir });
                                }
                            }}
                        />
                        
                        <InputRightAddon p={0}>
                            <Button 
                                onClick={() => {
                                    //loadUsers();
                                }
                            }>
                                Tìm kiếm
                            </Button>
                        </InputRightAddon>
                    </InputGroup>
                </Flex>
            </Flex>

            <TableContainer minH="60vh" mt={4}>
                 <Table variant="simple" size="sm">
                     <Thead>
                        <Tr textTransform="uppercase">
                            <Th>STT</Th>
                            <Th>HỌ TÊN</Th>   
                            <Th>EMAIL</Th>
                            <Th>ẢNH ĐẠI DIỆN</Th>
                            <Th>QUYỀN TRUY CẬP</Th>
                            <Th>TRẠNG THÁI XÁC THỰC</Th>
                            <Th>NGÀY TẠO</Th>
                            <Th isNumeric></Th>
                         </Tr>
                     </Thead>
                     <Tbody>
                        {
                            users.map((item, idx) => {
                                const { _id, email, name, picture, scope, isAuthenticated, created_at } = item;
                                return (
                                    <Tr key={_id}>
                                        <Td>
                                            {(page || 0)*limit + idx + 1}
                                        </Td>
                                        <Td>{name}</Td>
                                        <Td><Text fontWeight="600">{email}</Text></Td>  
                                        <Td>
                                            {picture && <Image src={picture} alt={name} boxSize="50px" borderRadius="full" />}
                                        </Td>
                                        <Td>
                                            <VStack>
                                                <Badge>{scope}</Badge>
                                                <Select maxW={200} size="sm" placeholder="Chọn quyền truy cập"
                                                        onChange={async(evt) => { 
                                                                console.log(evt.target.value);
                                                                const res = await axios.put(`${process.env.REACT_APP_API_ENDPOINT_URL}/user/${_id}`, {
                                                                    scope: evt.target.value
                                                                });
                                                                if(res.data?.error) {
                                                                    toast({
                                                                        description: res.data?.error,
                                                                        status: "error",
                                                                        duration: 3000,
                                                                        isClosable: true,
                                                                        position: "bottom-right"
                                                                    })
                                                                } else {
                                                                    getUsers();
                                                                    toast({
                                                                        description: "Cập nhật quyền thành công!",
                                                                        status: "success",
                                                                        duration: 3000,
                                                                        isClosable: true,
                                                                        position: "bottom-right"
                                                                    })  
                                                                }
                                                            }
                                                        }
                                                    >
                                                    {
                                                        AUTHORIZE_TYPES.map((item, idx) => (
                                                            <option key={`authorize-type-${idx}`} value={item.value}>{item.label}</option>
                                                        ))
                                                    }
                                                </Select>
                                            </VStack>
                                        </Td>
                                        <Td>
                                            <VStack>
                                                <Text>{isAuthenticated ? "Đang hoạt động" : "Chưa kích hoạt"}</Text>
                                                <Button colorScheme={isAuthenticated ? "red" : 'orange'} size="sm"
                                                    onClick={() => {
                                                            confirmChoice(`Bạn có đồng ý ${isAuthenticated ? "ngừng hoạt động" : "kích hoạt"} tài khoản này không?`, async() => {
                                                                const res = await axios.put(`${process.env.REACT_APP_API_ENDPOINT_URL}/user/${_id}`, {
                                                                    isAuthenticated: !isAuthenticated
                                                                });
                                                                if(res.data?.error) {
                                                                    toast({
                                                                        description: res.data?.error,
                                                                        status: "error",
                                                                        duration: 3000,
                                                                        isClosable: true,
                                                                        position: "bottom-right"
                                                                    })
                                                                } else {
                                                                    getUsers();
                                                                    toast({
                                                                        description: `Bạn đã ${isAuthenticated ? "ngừng hoạt động" : "kích hoạt"} tài khoản thành công!`,
                                                                        status: "success",
                                                                        duration: 3000,
                                                                        isClosable: true,
                                                                        position: "bottom-right"
                                                                    })
                                                                }
                                                            });
                                                        }
                                                    }
            
                                                >
                                                    <Icon boxSize={6} as={MdLockOpen} marginRight="8px"/>   
                                                    <Text>{isAuthenticated ? "Ngừng hoạt động tài khoản" : "Kích hoạt tài khoản"}</Text>
                                                </Button>
                                            </VStack>
                                        </Td>
                                        <Td><FormattedDate value={created_at} /> <FormattedTime value={created_at} /></Td>
                                    </Tr>
                                )
                            })
                        }
                    </Tbody>
                </Table>
            </TableContainer>

            <Flex flexDirection={{ base: "column", md: "row", lg: "row" }} w="100%" justify="center" my="10px" gap={2}>
                <HStack>
                    <Text w="60px">Hiển thị</Text>
                    <Select w={20} size="sm" value={limit}
                        onChange={
                            (evt) => { 
                                navigate("/users?page=0");
                                setLimit(parseInt(evt.target.value)); 
                            }
                        }
                    >
                        {
                            PAGINATION_LIST.map((pagination, idx) => (
                                <option key={`pagination-${idx}`} value={pagination}>{pagination}</option>
                            ))
                        }
                    </Select>
                </HStack>
                <HStack>
                    <Text w="60px">Sắp xếp</Text>
                    <Select w={40} size="sm" value={order_by}
                        onChange={
                            (evt) => { setOrderBy(evt.target.value) }
                        }
                    >
                        {
                            SORT_BY_LIST.map((item, idx) => (
                                <option key={`sort-by-${idx}`} value={item.value}>{item.title}</option>
                            ))
                        }
                    </Select>
                    <Select w={40} size="sm" value={order_dir}
                        onChange={
                            (evt) => { setOrderDir(evt.target.value) }
                        }
                    >
                        {
                            SORT_DIR_LIST.map((item, idx) => (
                                <option key={`sort-dir-${idx}`} value={item.value}>{item.title}</option>
                            ))
                        }
                    </Select>
                </HStack>
                {/* <ReactPaginate 
                    breakLabel="..."
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={2}
                    pageCount={pageCount}
                    previousLabel={
                        <Center>
                            <Icon boxSize={8} as={BsArrowLeftCircle} />
                        </Center>
                    }
                    nextLabel={
                        <Center>
                            <Icon boxSize={8} as={BsArrowRightCircle} />
                        </Center>
                    }
                    renderOnZeroPageCount={null}
                    containerClassName='pagination'
                    pageClassName='page-item'
                    activeClassName='active'
                    previousClassName='previous-item'
                    nextClassName='next-item'
                /> */}
            </Flex>
            {
                isLoading &&
                <Center>
                    <CircularProgress position="fixed" top="20vh" isIndeterminate size="100px" zIndex={9999}>
                        <CircularProgressLabel fontSize="14px" fontWeight="700" color="#2196f3">Đang tải</CircularProgressLabel>
                    </CircularProgress>
                </Center>
            }
        </Flex>
    )
}

export default Users;