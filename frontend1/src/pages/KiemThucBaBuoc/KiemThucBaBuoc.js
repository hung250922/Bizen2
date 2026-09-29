import React, { useState, useRef, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import {
    Flex, Heading, Input, Button, ButtonGroup, Text, CircularProgress, CircularProgressLabel,
    InputGroup, InputLeftElement, InputRightElement, Icon, IconButton, Select,
    Stack, HStack, Image, Wrap, WrapItem, Center, InputRightAddon,
    Tabs, Tab, TabList, TabPanels, TabPanel,
    Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, useDisclosure, useToast,
    VStack, FormControl, FormLabel,
} from '@chakra-ui/react';
import ReactPaginate from 'react-paginate';
import { MdSettings, MdAdd, MdAddCircleOutline, MdCalendarToday, MdSearch, MdEdit, MdDeleteForever, MdSave } from 'react-icons/md';
import { BsArrowLeftCircle, BsArrowRightCircle, BsFileExcel } from 'react-icons/bs';
import { useNavigate, useLocation } from 'react-router-dom';
import { FormattedDate, FormattedTime } from 'react-intl';
import { Form, Field } from 'react-final-form';
import DatePicker from 'react-date-picker';
import "react-date-picker/dist/DatePicker.css";
import 'react-calendar/dist/Calendar.css';
import { OutTable, ExcelRenderer } from 'react-excel-renderer/build';
import { sleep, confirmChoice } from "../../utils/helpers";
import httpClient from '../../services/http-client';

function KiemThucBaBuoc() {
    const [ cookies, setCookie, removeCookie ] = useCookies(["loginCookie"]);
    const initialRef = useRef(null);
    const toast = useToast();
    const navigate = useNavigate();
    const { search } = useLocation();
    const [limit, setLimit] = useState(25);
    const [searchText, setSearchText] = useState("");
    const [selectedClient, setSelectedClient] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [lenhSanXuats, setLenhSanXuats] = useState([]);
    const [clientDatas, setClientDatas] = useState([]);
    const [selectedKiemThucType, setSelectedKiemThucType] = useState("kiem_thuc_buoc_1");
    const [selectedCa, setSelectedCa] = useState("Ca 1");
    const [rowDatas, setRowDatas] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const mouted = useRef();

    const query = new URLSearchParams(search);

    useEffect(() => {
        if(!mouted.current) {
            loadInitDatas();
            mouted.current = true;
        }
    }, []);

    const loadInitDatas = async() => {
        setIsLoading(true);
        const res = await httpClient.post(`/larksuite/list_client`);
        console.log("--- loadInitDatas res:", res.data);

        if(!res.data.error) {
            setClientDatas(res.data?.data || []);
            setIsLoading(false);
        } else {
            setErrorMessage("Lỗi:" + JSON.stringify(res.data?.error?.message));
            setIsLoading(false);
        }
    }

    const handleExportExcel = async() => {
        if(!selectedClient) {
            alert("Vui lòng chọn khách hàng!");
            return;
        } else if(!selectedDate) {
            alert("Vui lòng chọn ngày!");
            return;
        } else if(!selectedCa) {
            alert("Vui lòng chọn ca!");
            return;
        } else if(!selectedKiemThucType) {
            alert("Vui lòng chọn loại kiểm thực!");
            return;
        }
        confirmChoice("Bạn có đồng ý xuất Excel không?", async() => {
            setIsLoading(true);
            const res = await httpClient.post(`/export_excel_file/kiem_thuc_ba_buoc`,
                {
                    kiemThucType: selectedKiemThucType,
                    client_code: selectedClient,
                    date: selectedDate,
                    ca: selectedCa
                },
                {
                    responseType: 'blob',
                }
            );

            if(res.data) {
                const remoteExcel = res.data;

                if (remoteExcel){
                    const blobEXCEL = new Blob([remoteExcel], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;'});
                    const fileURL = window.URL.createObjectURL(blobEXCEL);
                    const link = document.createElement('a');
                    link.href = fileURL;
                    link.setAttribute("download", `KiemThucBaBuoc_${selectedDate}_${selectedClient}.xlsx`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }

                toast({
                    description: "Xuất excel thành công!",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    position: "bottom-right"
                });
                setIsLoading(false);
            }
        });
    }

    const formatDateForInput = (date) => {
        if (!date) return "";

        const d = date instanceof Date ? date : new Date(date);
        if (isNaN(d.getTime())) return "";

        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    };

    const handleDateChange = (value) => {
        if (!value) {
            setSelectedDate(null);
            return;
        }

        const [year, month, day] = value.split("-").map(Number);
        setSelectedDate(new Date(year, month - 1, day));
    };

    return (
        <Flex
            direction="column"
            w="100%"
            minH="calc(100vh - 77px)"
            bg="#f5f7f8"
            p={{ base: 3, md: 5, xl: 6 }}
        >
            <Flex
                direction="column"
                w="100%"
                bg="white"
                border="1px solid #e3e8ea"
                borderRadius="16px"
                boxShadow="0 2px 10px rgba(0,0,0,0.04)"
                overflow="hidden"
            >
                <Flex
                    align={{ base: "flex-start", md: "center" }}
                    justify="space-between"
                    direction={{ base: "column", md: "row" }}
                    gap={3}
                    px={{ base: 4, md: 6 }}
                    py={4}
                    borderBottom="1px solid #edf1f2"
                >
                    <Flex align="center" gap={3}>
                        <Flex
                            w="42px"
                            h="42px"
                            align="center"
                            justify="center"
                            borderRadius="12px"
                            bg="#eaf7f8"
                            color="#3f9ca8"
                        >
                            <Icon as={MdSettings} boxSize={5} />
                        </Flex>

                        <Flex direction="column">
                            <Heading
                                fontSize={{ base: "17px", md: "19px" }}
                                fontWeight="700"
                                color="#34474e"
                            >
                                Thông tin kiểm thực
                            </Heading>
                            <Text mt="2px" fontSize="12px" color="#8a989d">
                                Chọn loại kiểm thực, khách hàng, ca và ngày
                            </Text>
                        </Flex>
                    </Flex>

                    <Flex
                        align="center"
                        gap={2}
                        px={3}
                        py={2}
                        border="1px solid #e0ebec"
                        borderRadius="10px"
                        bg="#f8fbfb"
                    >
                        <Flex
                            w="8px"
                            h="8px"
                            borderRadius="50%"
                            bg="#67aaa0"
                        />
                        <Text
                            fontSize="12px"
                            fontWeight="700"
                            color="#61747a"
                        >
                            Hoạt động
                        </Text>
                    </Flex>
                </Flex>

                <Flex
                    wrap="wrap"
                    gap={4}
                    px={{ base: 4, md: 6 }}
                    py={{ base: 5, md: 6 }}
                    align="flex-end"
                >
                    <FormControl flex="1 1 230px" minW={{ base: "100%", sm: "220px", lg: "230px" }}>
                        <FormLabel
                            mb={2}
                            fontSize="12px"
                            fontWeight="700"
                            color="#52636a"
                        >
                            Chọn loại kiểm thực
                        </FormLabel>

                        <Select
                            h="42px"
                            value={selectedKiemThucType}
                            placeholder="Chọn loại kiểm thực"
                            onChange={(evt) => {
                                setSelectedKiemThucType(evt.target.value)
                            }}
                            borderColor="#d9e2e4"
                            borderRadius="10px"
                            fontSize="13px"
                            color="#3f5057"
                            bg="white"
                            _hover={{ borderColor: "#9ec9ce" }}
                            _focus={{
                                borderColor: "#65b4bd",
                                boxShadow: "0 0 0 1px #65b4bd"
                            }}
                        >
                            {
                                ["kiem_thuc_buoc_1", "kiem_thuc_buoc_23", "kiem_thuc_buoc_4"]
                                    .sort((a,b) => a.localeCompare(b))
                                    .map((key, idx) => (
                                        <option key={`warehouse-${key}`} value={key}>
                                            {key}
                                        </option>
                                    ))
                            }
                        </Select>
                    </FormControl>

                    <FormControl flex="1 1 220px" minW={{ base: "100%", sm: "210px", lg: "220px" }}>
                        <FormLabel
                            mb={2}
                            fontSize="12px"
                            fontWeight="700"
                            color="#52636a"
                        >
                            Chọn khách hàng
                        </FormLabel>

                        <Select
                            h="42px"
                            value={selectedClient || ""}
                            placeholder="Chọn khách hàng"
                            onChange={(evt) => {
                                setSelectedClient(evt.target.value)
                            }}
                            borderColor="#d9e2e4"
                            borderRadius="10px"
                            fontSize="13px"
                            color="#3f5057"
                            bg="white"
                            _hover={{ borderColor: "#9ec9ce" }}
                            _focus={{
                                borderColor: "#65b4bd",
                                boxShadow: "0 0 0 1px #65b4bd"
                            }}
                        >
                            {
                                clientDatas.sort((a,b) => a.localeCompare(b)).map((key, idx) => (
                                    <option key={`client-${key}`} value={key}>
                                        {key}
                                    </option>
                                ))
                            }
                        </Select>
                    </FormControl>

                    <FormControl flex="0 1 150px" minW={{ base: "100%", sm: "140px", lg: "150px" }}>
                        <FormLabel
                            mb={2}
                            fontSize="12px"
                            fontWeight="700"
                            color="#52636a"
                        >
                            Chọn ca
                        </FormLabel>

                        <Select
                            h="42px"
                            value={selectedCa}
                            placeholder="Chọn ca"
                            onChange={(evt) => {
                                setSelectedCa(evt.target.value)
                            }}
                            borderColor="#d9e2e4"
                            borderRadius="10px"
                            fontSize="13px"
                            color="#3f5057"
                            bg="white"
                            _hover={{ borderColor: "#9ec9ce" }}
                            _focus={{
                                borderColor: "#65b4bd",
                                boxShadow: "0 0 0 1px #65b4bd"
                            }}
                        >
                            {
                                ["Ca 1", "Ca 2", "Ca 3"]
                                    .sort((a,b) => a.localeCompare(b))
                                    .map((key, idx) => (
                                        <option key={`ca-${key}`} value={key}>
                                            {key}
                                        </option>
                                    ))
                            }
                        </Select>
                    </FormControl>

                    <FormControl flex="0 1 180px" minW={{ base: "100%", sm: "170px", lg: "180px" }}>
                        <FormLabel
                            mb={2}
                            fontSize="12px"
                            fontWeight="700"
                            color="#52636a"
                        >
                            Chọn ngày
                        </FormLabel>

                        <Input
                            type="date"
                            value={formatDateForInput(selectedDate)}
                            onChange={(evt) => handleDateChange(evt.target.value)}
                            h="42px"
                            borderColor="#d9e2e4"
                            borderRadius="10px"
                            fontSize="13px"
                            color="#3f5057"
                            bg="white"
                            _hover={{ borderColor: "#9ec9ce" }}
                            _focus={{
                                borderColor: "#65b4bd",
                                boxShadow: "0 0 0 1px #65b4bd"
                            }}
                        />
                    </FormControl>

                    <Button
                        h="42px"
                        minW={{ base: "100%", sm: "170px" }}
                        px={6}
                        borderRadius="10px"
                        bg="#69aaa6"
                        color="white"
                        fontSize="13px"
                        fontWeight="700"
                        leftIcon={<Icon as={BsFileExcel} boxSize={5} />}
                        isLoading={isLoading}
                        loadingText="Đang xuất..."
                        onClick={() => {
                            handleExportExcel();
                        }}
                        _hover={{
                            bg: "#69aaa6",
                            transform: "translateY(-1px)"
                        }}
                        _active={{
                            bg: "#69aaa6",
                            transform: "translateY(0)"
                        }}
                        transition="all .15s ease"
                    >
                        Export Excel
                    </Button>
                </Flex>

                {errorMessage && (
                    <Flex
                        mx={{ base: 4, md: 6 }}
                        mb={5}
                        px={4}
                        py={3}
                        border="1px solid #f1cccc"
                        bg="#fff7f7"
                        borderRadius="10px"
                    >
                        <Text fontSize="13px" color="#b44747">
                            {errorMessage}
                        </Text>
                    </Flex>
                )}
            </Flex>

            <Flex
                mt={4}
                w="100%"
                minH="220px"
                bg="white"
                border="1px solid #e3e8ea"
                borderRadius="16px"
                boxShadow="0 2px 10px rgba(0,0,0,0.04)"
                direction="column"
                overflow="hidden"
            >
                <Flex
                    align="center"
                    justify="space-between"
                    px={{ base: 4, md: 6 }}
                    py={4}
                    borderBottom="1px solid #edf1f2"
                >
                    <Flex direction="column">
                        <Heading
                            fontSize="16px"
                            fontWeight="700"
                            color="#34474e"
                        >
                            Dữ liệu kiểm thực ba bước
                        </Heading>
                        <Text mt={1} fontSize="12px" color="#8a989d">
                            Kết quả dữ liệu sẽ hiển thị tại khu vực này
                        </Text>
                    </Flex>

                    <Flex
                        align="center"
                        justify="center"
                        minW="38px"
                        h="32px"
                        px={3}
                        borderRadius="8px"
                        bg="#eef7f8"
                        color="#3f9ca8"
                    >
                        <Text fontSize="12px" fontWeight="700">
                            {rowDatas.length || 0}
                        </Text>
                    </Flex>
                </Flex>

                <Flex
                    flex="1"
                    align="center"
                    justify="center"
                    px={5}
                    py={10}
                >
                    <Flex direction="column" align="center" textAlign="center">
                        {isLoading ? (
                            <>
                                <CircularProgress
                                    isIndeterminate
                                    size="42px"
                                    thickness="8px"
                                    color="#65b4bd"
                                />
                                <Text
                                    mt={4}
                                    fontSize="13px"
                                    fontWeight="600"
                                    color="#63757b"
                                >
                                    Đang xử lý dữ liệu...
                                </Text>
                            </>
                        ) : (
                            <>
                                <Flex
                                    w="48px"
                                    h="48px"
                                    align="center"
                                    justify="center"
                                    borderRadius="14px"
                                    bg="#eef7f8"
                                    color="#65b4bd"
                                >
                                    <Icon as={MdCalendarToday} boxSize={5} />
                                </Flex>

                                <Text
                                    mt={4}
                                    fontSize="14px"
                                    fontWeight="700"
                                    color="#52636a"
                                >
                                    Chưa có dữ liệu hiển thị
                                </Text>

                                <Text
                                    mt={1}
                                    fontSize="12px"
                                    color="#8b999e"
                                >
                                    Chọn đầy đủ thông tin phía trên để xuất file kiểm thực.
                                </Text>
                            </>
                        )}
                    </Flex>
                </Flex>
            </Flex>

            {/* <Flex flexDirection="column" p={4}>
                <Heading size="md">Dữ liệu kiểm thực ba bước</Heading>
                <OutTable
                    data={rowDatas}
                    columns={
                        [
                            { "key": 0, "name": "STT" },
                            { "key": 1, "name": "Công ty" },
                            { "key": 2, "name": "Số phần" },
                            { "key": 3, "name": "Ca" },
                            { "key": 4, "name": "Cơ cấu suất ăn" },
                            { "key": 5, "name": "Món ăn" },
                            { "key": 6, "name": "BOM món ăn" },
                            { "key": 7, "name": "Số lượng nhập" },
                        ]
                    }
                    tableClassName="ExcelTable2007"
                    tableHeaderRowClass="heading"
                />
            </Flex> */}
        </Flex>
    )
}

export default KiemThucBaBuoc;