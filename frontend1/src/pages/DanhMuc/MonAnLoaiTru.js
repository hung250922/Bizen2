import React, { useState, useRef, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { 
    Flex, Heading, Input, Button, ButtonGroup, Text, CircularProgress, CircularProgressLabel,
    InputGroup, InputLeftElement, InputRightElement, Icon, IconButton, Select,
    Stack, HStack, Image, Wrap, WrapItem, Center, InputRightAddon,
    Tabs, Tab, TabList, TabPanels, TabPanel,
    Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, useDisclosure, useToast,
    VStack, FormControl, FormLabel
} from '@chakra-ui/react';
import ReactPaginate from 'react-paginate';
import { MdSettings, MdAdd, MdAddCircleOutline, MdCalendarToday, MdSearch, MdEdit, MdDeleteForever, MdSave } from 'react-icons/md';
import { BsArrowLeftCircle, BsArrowRightCircle } from 'react-icons/bs';
import { useNavigate, useLocation } from 'react-router-dom';
import { FormattedDate, FormattedTime } from 'react-intl';
import { Form, Field } from 'react-final-form';
import { sleep, confirmChoice } from "../../utils/helpers"
import httpClient from '../../services/http-client';

function MonAnLoaiTru() {
    const [ cookies, setCookie, removeCookie ] = useCookies(["loginCookie"]);
    const initialRef = useRef(null);
    const toast = useToast();
    const navigate = useNavigate();
    const { search } = useLocation();
    const [limit, setLimit] = useState(25);
    const [searchText, setSearchText] = useState("");
    const [monAnTheoMuas, setMonAnTheoMuas] = useState([]);
    const mouted = useRef();

    const query = new URLSearchParams(search);
   
    useEffect(() => {
        if(!mouted.current) {
            mouted.current = true;
            fetchMonAnTheoMuas();
        }
    }, []);

    const fetchMonAnTheoMuas = async () => {
        const res = await httpClient.get(`/catering/mon_an_theo_muas`, { params: { is_encouraged: false } });
        console.log("--- get mon an theo mua res:", res);
        setMonAnTheoMuas(res.data.data);
    };

    const onSubmit = async(values, form) => {
        confirmChoice("Bạn có lưu không?", async() => {
            const res = await httpClient.post(`/catering/add_mon_an_theo_mua`, {
                ...values,
                "is_encouraged": false
            });

            console.log("--- add mon an theo mua res:", res);
            if(res.data.data) {
                toast({
                    description: "Cập nhật món ăn theo mùa thành công!",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    position: "bottom-right"
                });
                fetchMonAnTheoMuas();
                form.reset();
            }
        });
    }

    return (
        <Flex flexDirection="column" p={4} minHeight="100vh"  minW={1000}>
            <Flex flexDirection={{ base: "column", md: "row", lg: "row" }} justify="flex-start">
                <Flex flexDirection="row" justify="space-between" gap={8} w="100%">
                    <VStack w="30%">
                        <Heading size="md">Thêm/Sửa món ăn loại trừ</Heading>
                        <Form
                            onSubmit={onSubmit}
                            render={({ handleSubmit, form, submitting, pristine, valid, values }) => {
                                return (
                                    <form onSubmit={handleSubmit}>
                                        <Flex flexDirection="column" alignItems="space-between" justify="space-between" p={4} 
                                            borderRadius={4} bg="#f5f5f5" minW={400} gap={4}
                                        >
                                            <Field name={`food_name`}>
                                                {({ input, meta }) => (
                                                    <FormControl>
                                                        <FormLabel htmlFor={`food_name`}>Món ăn</FormLabel>
                                                        <Input {...input} type='text' min={0} fontSize="14px" border="1px solid #ccc"/>
                                                    </FormControl>
                                                )}
                                            </Field>
                                            <Field name={`from_month`}>
                                                {({ input, meta }) => (
                                                    <FormControl>
                                                        <FormLabel htmlFor={`from_month`}>Từ tháng</FormLabel>
                                                        <Input {...input} type='number' min={0} fontSize="14px" border="1px solid #ccc"/>
                                                    </FormControl>
                                                )}
                                            </Field>
                                            <Field name={`to_month`}>
                                                {({ input, meta }) => (
                                                    <FormControl>
                                                        <FormLabel htmlFor={`to_month`}>Đến tháng</FormLabel>
                                                        <Input {...input} type='number' min={0} fontSize="14px" border="1px solid #ccc"/>
                                                    </FormControl>
                                                )}
                                            </Field>
                                            <Button colorScheme='green' type='submit' mt={4}
                                                    loadingText="Đang cập nhật"
                                                >
                                                <Icon as={MdSave} boxSize={6} /><Text ml={2}>Lưu</Text>
                                            </Button>
                                        </Flex>
                                    </form>
                                )
                            }}
                        />   
                    </VStack>
                    <VStack w="70%">
                        <Heading size="md">Danh sách món ăn loại trừ</Heading>
                        <TableContainer minH="60vh" mt={4}>
                            <Table variant="simple" size="sm">
                                <Thead>
                                    <Tr textTransform="uppercase">
                                        <Th>STT</Th>
                                        <Th>MÓN ĂN</Th>
                                        <Th>THÁNG BẮT ĐẦU</Th>
                                        <Th>THÁNG KẾT THÚC</Th>
                                        <Th isNumeric></Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {
                                        monAnTheoMuas.map((item, idx) => {
                                            const { _id, food_name, from_month, to_month, createdAt } = item;
                                            return (
                                                <Tr key={_id}>
                                                    <Td>
                                                        {idx + 1}
                                                    </Td>
                                                    <Td>{food_name}</Td>
                                                    <Td>{from_month}</Td>
                                                    <Td>{to_month}</Td>
                                                    <Td>
                                                       
                                                    </Td>
                                                </Tr>
                                            )
                                        })
                                    }
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </VStack>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default MonAnLoaiTru;