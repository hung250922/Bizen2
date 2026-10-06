import React, { useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import {
    Alert,
    AlertIcon,
    Badge,
    Box,
    Button,
    Checkbox,
    Flex,
    Grid,
    Heading,
    Icon,
    Input,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Select,
    SimpleGrid,
    Spinner,
    Stack,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    VStack,
    HStack,
    useToast
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { MdSearch } from 'react-icons/md';
import { BsFileExcel } from 'react-icons/bs';
import { sleep, confirmChoice } from '../../utils/helpers';
import httpClient from '../../services/http-client';

function LenhSanXuat() {
    const [cookies, setCookie, removeCookie] = useCookies(['loginCookie']);
    const toast = useToast();
    const [limit, setLimit] = useState(25);
    const [searchText, setSearchText] = useState('');
    const [selectedClients, setSelectedClients] = useState([]);
    const [selectedKitchen, setSelectedKitchen] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedoCauMenu, setSelectedoCauMenu] = useState([]);
    const [exportType, setExportType] = useState('Đặt hàng dự báo');
    const [lenhSanXuats, setLenhSanXuats] = useState([]);
    const [clientDatas, setClientDatas] = useState([]);
    const [coCauMenuDatas, setCoCauMenuDatas] = useState([]);
    const [rowDatas, setRowDatas] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const mouted = useRef();

    useEffect(() => {
        if (!mouted.current) {
            loadInitDatas();
            mouted.current = true;
        }
    }, []);

    const loadInitDatas = async () => {
        setIsLoading(true);

        const listClientRes = await httpClient.post('/larksuite/list_client');

        if (!listClientRes.data.error) {
            setClientDatas(listClientRes.data?.data || []);
            setIsLoading(false);
        } else {
            setErrorMessage(
                'Lỗi:' + JSON.stringify(listClientRes.data?.error?.message)
            );
            setIsLoading(false);
        }

        const listCCMNRes = await httpClient.post(
            '/larksuite/list_co_cau_menu'
        );

        console.log('---- listCCMNRes', listCCMNRes.data);

        if (!listCCMNRes.data.error) {
            setCoCauMenuDatas(listCCMNRes.data?.data || []);
            setIsLoading(false);
        } else {
            setErrorMessage(
                'Lỗi:' + JSON.stringify(listCCMNRes.data?.error?.message)
            );
            setIsLoading(false);
        }
    };

    const handleExportExcel = async () => {
        confirmChoice('Bạn có đồng ý xuất Excel không?', async () => {
            setIsLoading(true);

            const res = await httpClient.post(
                '/export_excel_file/lenh_san_xuat',
                {
                    client_codes: selectedClients.map(client => client.value),
                    date: selectedDate,
                    kitchen: selectedKitchen,
                    co_cau_menus: selectedoCauMenu.map(menu => menu.value),
                    exportType
                },
                {
                    responseType: 'blob'
                }
            );

            if (res.data) {
                const remoteExcel = res.data;

                if (remoteExcel) {
                    const blobEXCEL = new Blob([remoteExcel], {
                        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;'
                    });

                    const fileURL = window.URL.createObjectURL(blobEXCEL);
                    const link = document.createElement('a');

                    link.href = fileURL;
                    link.setAttribute(
                        'download',
                        `LenhSanXuat_${selectedDate}.xlsx`
                    );

                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(fileURL);
                }

                toast({
                    description: 'Xuất excel thành công!',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                    position: 'bottom-right'
                });

                setIsLoading(false);
            }
        });
    };

    const handleSearch = async () => {
        setErrorMessage(null);

        if (selectedClients.length === 0) {
            alert('Vui lòng chọn khách hàng!');
            return;
        }

        if (!selectedDate) {
            alert('Vui lòng chọn ngày!');
            return;
        }

        await sleep(250);
        setIsLoading(true);

        try {
            const res = await httpClient.post('/larksuite/lenh_san_xuat', {
                client_codes: selectedClients.map(client => client.value),
                date: selectedDate,
                kitchen: selectedKitchen,
                co_cau_menus: selectedoCauMenu.map(menu => menu.value)
            });

            console.log('--- handle Search res:', res.data);

            if (res.data?.error) {
                setErrorMessage(
                    'Lỗi:' +
                        JSON.stringify(
                            res.data?.error?.message ||
                                res.data?.error ||
                                'Không thể tải dữ liệu lệnh sản xuất'
                        )
                );

                setRowDatas([]);
                return;
            }

            let _rowDatas = [];

            for (let i = 0; i < (res.data?.data || []).length; i++) {
                const {
                    Ngay,
                    KhachHang,
                    Ca,
                    SiteAn,
                    MonAn,
                    CoCauSuatAn,
                    BOMMonAn,
                    SoLuongDuyet15h,
                    SoLuongDatHangDuocDuyet,
                    SoLuongDatHangDuBao,
                    KhoiLuongSanXuat15hSite1,
                    KhoiLuongSanXuat15hSite2,
                    KhoiLuongSanXuat15hSite3,
                    KhoiLuongSanXuat15hSite4,
                    KhoiLuongSanXuat15hSite5,
                    KhoiLuongDatHangDuocDuyetSite1,
                    KhoiLuongDatHangDuocDuyetSite2,
                    KhoiLuongDatHangDuocDuyetSite3,
                    KhoiLuongDatHangDuocDuyetSite4,
                    KhoiLuongDatHangDuocDuyetSite5,
                    KhoiLuongDatHangDuBaoSite1,
                    KhoiLuongDatHangDuBaoSite2,
                    KhoiLuongDatHangDuBaoSite3,
                    KhoiLuongDatHangDuBaoSite4,
                    KhoiLuongDatHangDuBaoSite5
                } = res.data.data[i];

                const soPhan =
                    exportType === 'Duyệt 15h'
                        ? SoLuongDuyet15h
                        : exportType === 'Đặt hàng được duyệt'
                        ? SoLuongDatHangDuocDuyet
                        : SoLuongDatHangDuBao;

                const soLuongNhap =
                    exportType === 'Duyệt 15h'
                        ? [
                              KhoiLuongSanXuat15hSite1,
                              KhoiLuongSanXuat15hSite2,
                              KhoiLuongSanXuat15hSite3,
                              KhoiLuongSanXuat15hSite4,
                              KhoiLuongSanXuat15hSite5
                          ]
                              .filter(Boolean)
                              .join(' | ')
                        : exportType === 'Đặt hàng được duyệt'
                        ? [
                              KhoiLuongDatHangDuocDuyetSite1,
                              KhoiLuongDatHangDuocDuyetSite2,
                              KhoiLuongDatHangDuocDuyetSite3,
                              KhoiLuongDatHangDuocDuyetSite4,
                              KhoiLuongDatHangDuocDuyetSite5
                          ]
                              .filter(Boolean)
                              .join(' | ')
                        : [
                              KhoiLuongDatHangDuBaoSite1,
                              KhoiLuongDatHangDuBaoSite2,
                              KhoiLuongDatHangDuBaoSite3,
                              KhoiLuongDatHangDuBaoSite4,
                              KhoiLuongDatHangDuBaoSite5
                          ]
                              .filter(Boolean)
                              .join(' | ');

                _rowDatas.push([
                    Ngay,
                    KhachHang,
                    Ca,
                    SiteAn,
                    soPhan,
                    
                    CoCauSuatAn,
                    MonAn,
                    BOMMonAn,
                    soLuongNhap
                ]);
            }

            setRowDatas(_rowDatas);
        } catch (error) {
            console.error('--- handleSearch error:', error);

            setErrorMessage(
                'Lỗi:' +
                    JSON.stringify(
                        error?.response?.data?.error ||
                            error?.response?.data ||
                            error?.message ||
                            'Không thể tải dữ liệu lệnh sản xuất'
                    )
            );
        } finally {
            setIsLoading(false);
        }
    };

    const formatDateForInput = date => {
        if (!date) return '';

        const value = date instanceof Date ? date : new Date(date);

        if (Number.isNaN(value.getTime())) return '';

        return `${value.getFullYear()}-${String(
            value.getMonth() + 1
        ).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
    };

    const parseDateInput = value => {
        if (!value) return null;

        const [year, month, day] = value.split('-').map(Number);

        if (!year || !month || !day) return null;

        return new Date(year, month - 1, day);
    };

    const sortedClients = [...clientDatas]
        .filter(Boolean)
        .sort((a, b) => String(a).localeCompare(String(b)));

    const sortedCoCauMenu = [...coCauMenuDatas]
        .filter(Boolean)
        .sort((a, b) => String(a).localeCompare(String(b)));

    const clientOptions = sortedClients.map(client => ({
        label: client,
        value: client
    }));

    const coCauMenuOptions = sortedCoCauMenu.map(menu => ({
        label: menu,
        value: menu
    }));

    const filteredRowDatas = rowDatas.filter(row => {
        const keyword = searchText.trim().toLowerCase();

        if (!keyword) {
            return true;
        }

        return row.some(cell =>
            String(cell ?? '')
                .toLowerCase()
                .includes(keyword)
        );
    });

    const toggleClient = value => {
        const exists = selectedClients.some(item => item.value === value);

        if (exists) {
            setSelectedClients(
                selectedClients.filter(item => item.value !== value)
            );
        } else {
            setSelectedClients([
                ...selectedClients,
                {
                    label: value,
                    value: value
                }
            ]);
        }
    };

    const toggleAllClients = () => {
        if (selectedClients.length === clientOptions.length) {
            setSelectedClients([]);
        } else {
            setSelectedClients(clientOptions);
        }
    };

    const toggleCoCauMenu = value => {
        const exists = selectedoCauMenu.some(item => item.value === value);

        if (exists) {
            setSelectedoCauMenu(
                selectedoCauMenu.filter(item => item.value !== value)
            );
        } else {
            setSelectedoCauMenu([
                ...selectedoCauMenu,
                {
                    label: value,
                    value: value
                }
            ]);
        }
    };

    const toggleAllCoCauMenu = () => {
        if (selectedoCauMenu.length === coCauMenuOptions.length) {
            setSelectedoCauMenu([]);
        } else {
            setSelectedoCauMenu(coCauMenuOptions);
        }
    };

    const inputStyle = {
        height: '42px',
        borderRadius: '10px',
        borderColor: '#d7e2e4',
        background: '#ffffff',
        fontSize: '11px',
        fontWeight: '500',
        color: '#33484f',
        _hover: {
            borderColor: '#bfd9d9'
        },
        _focus: {
            borderColor: '#4aa2a0',
            boxShadow: '0 0 0 3px rgba(74,162,160,.10)'
        }
    };

    const menuButtonStyle = {
        width: '100%',
        height: '42px',
        borderRadius: '10px',
        border: '1px solid #d7e2e4',
        bg: '#ffffff',
        px: 3,
        fontSize: '11px',
        fontWeight: '500',
        color: '#33484f',
        textAlign: 'left',
        _hover: {
            borderColor: '#bfd9d9',
            bg: '#ffffff'
        },
        _active: {
            bg: '#ffffff'
        }
    };

    return (
    <Box minH="100%" w="100%" minW={0} overflowX="hidden" bg="#f5f8f9" color="#263238">
        <Box w="100%" p={{ base: 2, md: 3 }}>
            <Box mb={4} overflow="hidden" border="1px solid #dfe8ea" borderRadius="16px" bg="white" boxShadow="0 7px 25px rgba(35,78,83,.05)">
                <Box px={{ base: 4, md: 5 }} py={4} borderBottom="1px solid #e8edef">
                    <Flex direction={{ base: "column", md: "row" }} align={{ base: "flex-start", md: "center" }} justify="space-between" gap={3}>
                        <HStack spacing={3} minW={0}>
                            <Flex w="40px" h="40px" flexShrink={0} align="center" justify="center" borderRadius="10px" bg="#eaf7f7" color="#3e9898">
                                <Icon as={MdSearch} boxSize={5} />
                            </Flex>
                            <Box minW={0}>
                                <Text fontSize="9px" fontWeight="800" textTransform="uppercase" letterSpacing=".14em" color="#79a6aa">PRODUCTION MANAGEMENT</Text>
                                <Text mt={1} fontSize="10px" color="#89979c">Tìm kiếm lệnh sản xuất và xuất dữ liệu theo nhu cầu.</Text>
                            </Box>
                        </HStack>
                        <Badge borderRadius="999px" bg="#eef8f7" color="#3f8f8f" px={3} py="6px" fontSize="9px" fontWeight="800">{filteredRowDatas.length} dòng</Badge>
                    </Flex>
                </Box>
            </Box>

            <Box position="relative" zIndex={50} overflow="visible" border="1px solid #dfe8ea" borderRadius="16px" bg="white" boxShadow="0 7px 25px rgba(35,78,83,.05)">
                <Box px={{ base: 4, md: 5 }} py={4} borderBottom="1px solid #e8edef">
                    <HStack spacing={2}>
                        <Box w="8px" h="8px" borderRadius="full" bg="#4ba3a0" />
                        <Box>
                            <Heading as="h2" fontSize="13px" fontWeight="800" color="#3b5158">Thông tin tìm kiếm</Heading>
                            <Text mt=".5px" fontSize="9px" color="#8b999e">Chọn đầy đủ thông tin trước khi tìm kiếm hoặc xuất Excel.</Text>
                        </Box>
                    </HStack>
                </Box>

                <Grid position="relative" zIndex={50} w="100%" templateColumns={{ base: "1fr", md: "repeat(2,1fr)", xl: "1fr 1.5fr 1fr 1.5fr 1fr" }} gap={4} p={4}>
                    <Box>
                        <Text mb="6px" fontSize="9px" fontWeight="800" textTransform="uppercase" letterSpacing=".06em" color="#62767d">Loại đặt hàng</Text>
                        <Select value={exportType} onChange={e => setExportType(e.target.value)} disabled={isLoading} {...inputStyle}>
                            {["Duyệt 15h", "Đặt hàng được duyệt", "Đặt hàng dự báo"].map(type => <option key={type} value={type}>{type}</option>)}
                        </Select>
                    </Box>

                    <Box>
                        <Text mb="6px" fontSize="9px" fontWeight="800" textTransform="uppercase" letterSpacing=".06em" color="#62767d">Khách hàng</Text>
                        <Menu closeOnSelect={false} placement="bottom-start" strategy="fixed">
                            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} {...menuButtonStyle}>
                                <Text overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap" fontSize="11px" fontWeight="500">
                                    {selectedClients.length === 0 ? "Chọn khách hàng" : selectedClients.length === clientOptions.length ? "Đã chọn tất cả" : selectedClients.map(item => item.label).join(", ")}
                                </Text>
                            </MenuButton>
                            <MenuList maxH="320px" overflowY="auto" borderRadius="10px" border="1px solid #dfe8ea" boxShadow="0 12px 35px rgba(35,78,83,.14)" p={1}>
                                <MenuItem onClick={toggleAllClients} fontSize="11px" borderRadius="7px" _hover={{ bg: "#f2f8f8" }}>
                                    <Checkbox isChecked={clientOptions.length > 0 && selectedClients.length === clientOptions.length} pointerEvents="none" mr={2} colorScheme="teal">Chọn tất cả</Checkbox>
                                </MenuItem>
                                {clientOptions.map(client => (
                                    <MenuItem key={client.value} onClick={() => toggleClient(client.value)} fontSize="11px" borderRadius="7px" _hover={{ bg: "#f2f8f8" }}>
                                        <Checkbox isChecked={selectedClients.some(item => item.value === client.value)} pointerEvents="none" mr={2} colorScheme="teal">{client.label}</Checkbox>
                                    </MenuItem>
                                ))}
                            </MenuList>
                        </Menu>
                    </Box>

                    <Box>
                        <Text mb="6px" fontSize="9px" fontWeight="800" textTransform="uppercase" letterSpacing=".06em" color="#62767d">Bếp</Text>
                        <Select value={selectedKitchen || ""} onChange={e => setSelectedKitchen(e.target.value)} placeholder="Chọn bếp" disabled={isLoading} {...inputStyle}>
                            {["Bếp trung tâm", "Bếp trung tâm 2", "Bếp tại chỗ"].map(kitchen => <option key={kitchen} value={kitchen}>{kitchen}</option>)}
                        </Select>
                    </Box>

                    <Box>
                        <Text mb="6px" fontSize="9px" fontWeight="800" textTransform="uppercase" letterSpacing=".06em" color="#62767d">Cơ cấu menu</Text>
                        <Menu closeOnSelect={false} placement="bottom-start" strategy="fixed">
                            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} {...menuButtonStyle}>
                                <Text overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap" fontSize="11px" fontWeight="500">
                                    {selectedoCauMenu.length === 0 ? "Chọn cơ cấu menu" : selectedoCauMenu.length === coCauMenuOptions.length ? "Đã chọn tất cả" : selectedoCauMenu.map(item => item.label).join(", ")}
                                </Text>
                            </MenuButton>
                            <MenuList maxH="320px" overflowY="auto" borderRadius="10px" border="1px solid #dfe8ea" boxShadow="0 12px 35px rgba(35,78,83,.14)" p={1}>
                                <MenuItem onClick={toggleAllCoCauMenu} fontSize="11px" borderRadius="7px" _hover={{ bg: "#f2f8f8" }}>
                                    <Checkbox isChecked={coCauMenuOptions.length > 0 && selectedoCauMenu.length === coCauMenuOptions.length} pointerEvents="none" mr={2} colorScheme="teal">Chọn tất cả</Checkbox>
                                </MenuItem>
                                {coCauMenuOptions.map(menu => (
                                    <MenuItem key={menu.value} onClick={() => toggleCoCauMenu(menu.value)} fontSize="11px" borderRadius="7px" _hover={{ bg: "#f2f8f8" }}>
                                        <Checkbox isChecked={selectedoCauMenu.some(item => item.value === menu.value)} pointerEvents="none" mr={2} colorScheme="teal">{menu.label}</Checkbox>
                                    </MenuItem>
                                ))}
                            </MenuList>
                        </Menu>
                    </Box>

                    <Box>
                        <Text mb="6px" fontSize="9px" fontWeight="800" textTransform="uppercase" letterSpacing=".06em" color="#62767d">Ngày</Text>
                        <Input type="date" value={formatDateForInput(selectedDate)} onChange={e => setSelectedDate(parseDateInput(e.target.value))} disabled={isLoading} {...inputStyle} />
                    </Box>
                </Grid>

                <SimpleGrid mx={4} mb={4} columns={{ base: 1, md: 3 }} overflow="hidden" border="1px solid #e5edef" borderRadius="11px" bg="#f8fbfb">
                    <Box px="14px" py={3} borderBottom={{ base: "1px solid #e5edef", md: "none" }} borderRight={{ base: "none", md: "1px solid #e5edef" }}>
                        <Text fontSize="8px" fontWeight="800" textTransform="uppercase" letterSpacing=".08em" color="#91a0a4">Loại</Text>
                        <Text mt={1} fontSize="10px" fontWeight="700" color="#455960" noOfLines={1}>{exportType || "—"}</Text>
                    </Box>
                    <Box px="14px" py={3} borderBottom={{ base: "1px solid #e5edef", md: "none" }} borderRight={{ base: "none", md: "1px solid #e5edef" }}>
                        <Text fontSize="8px" fontWeight="800" textTransform="uppercase" letterSpacing=".08em" color="#91a0a4">Khách hàng</Text>
                        <Text mt={1} fontSize="10px" fontWeight="700" color="#455960" noOfLines={1}>{selectedClients.length ? selectedClients.map(item => item.value).join(", ") : "—"}</Text>
                    </Box>
                    <Box px="14px" py={3}>
                        <Text fontSize="8px" fontWeight="800" textTransform="uppercase" letterSpacing=".08em" color="#91a0a4">Ngày</Text>
                        <Text mt={1} fontSize="10px" fontWeight="700" color="#455960">{formatDateForInput(selectedDate) || "—"}</Text>
                    </Box>
                </SimpleGrid>

                {errorMessage && (
                    <Alert mx={4} mb={4} borderRadius="10px" border="1px solid #f0d0d0" bg="#fff6f6" color="#a14b4b" fontSize="10px">
                        <AlertIcon color="#b65d5d" boxSize={4} />
                        {errorMessage}
                    </Alert>
                )}

                <Flex direction={{ base: "column", sm: "row" }} justify="flex-end" gap="10px" px={4} py={4} borderTop="1px solid #e8edef" bg="#fbfcfc">
                    <Button onClick={handleSearch} isLoading={isLoading} loadingText="Đang tìm..." leftIcon={<Icon as={MdSearch} boxSize={4} />} h="42px" px={5} borderRadius="10px" bg="#3f9898" color="white" fontSize="10px" fontWeight="800" _hover={{ bg: "#327f80", transform: "translateY(-1px)" }}>Tìm kiếm</Button>
                    <Button onClick={handleExportExcel} isLoading={isLoading} loadingText="Đang xuất..." leftIcon={<Icon as={BsFileExcel} boxSize={4} />} h="42px" px={5} borderRadius="10px" bg="#6eaaa6" color="white" fontSize="10px" fontWeight="800" _hover={{ bg: "#5a9692", transform: "translateY(-1px)" }}>Xuất Excel</Button>
                </Flex>
            </Box>

            <Box mt={4} minW={0} overflow="hidden" border="1px solid #dfe8ea" borderRadius="16px" bg="white" boxShadow="0 7px 25px rgba(35,78,83,.05)">
                <Box px={{ base: 4, md: 5 }} py={4} borderBottom="1px solid #e8edef">
                    <Flex direction={{ base: "column", sm: "row" }} align={{ base: "flex-start", sm: "center" }} justify="space-between" gap={3}>
                        <Box>
                            <HStack spacing={2}>
                                <Box w="8px" h="8px" borderRadius="full" bg="#65a8ae" />
                                <Heading as="h2" fontSize="14px" fontWeight="800" color="#3b5158">Dữ liệu lệnh sản xuất</Heading>
                                <Badge borderRadius="999px" bg="#eef7f7" color="#579b96" px="10px" py="4px" fontSize="8px">{filteredRowDatas.length}</Badge>
                            </HStack>
                            <Text mt={1} fontSize="9px" color="#8b999e">Danh sách lệnh sản xuất nhận được từ hệ thống.</Text>
                        </Box>
                        <Input value={searchText} onChange={e => setSearchText(e.target.value)} placeholder="Tìm công ty, món ăn, ca..." h="38px" w={{ base: "100%", sm: "250px" }} borderColor="#d7e2e4" borderRadius="9px" bg="#fbfcfc" fontSize="10px" _focus={{ borderColor: "#4aa2a0", boxShadow: "0 0 0 3px rgba(74,162,160,.10)" }} />
                    </Flex>
                </Box>

                <TableContainer w="100%" overflow="hidden">
                    {filteredRowDatas.length > 0 ? (
                        <Table w="100%" variant="simple" sx={{ tableLayout:"fixed","& th,& td":{ whiteSpace:"normal",wordBreak:"break-word",overflowWrap:"anywhere" } }}>
    <Thead bg="#f3f8f8">
        <Tr>
            <Th w="4%" px={2} py={3} fontSize="8px" fontWeight="800" color="#60747a" textTransform="none">STT</Th>
            <Th w="8%" px={2} py={3} fontSize="8px" fontWeight="800" color="#60747a" textTransform="none">NGÀY</Th>
            <Th w="11%" px={2} py={3} fontSize="8px" fontWeight="800" color="#60747a" textTransform="none">CÔNG TY</Th>
            <Th w="6%" px={2} py={3} fontSize="8px" fontWeight="800" color="#60747a" textTransform="none">CA</Th>
            <Th w="11%" px={2} py={3} fontSize="8px" fontWeight="800" color="#60747a" textTransform="none">SITE ĂN</Th>
            <Th w="7%" px={2} py={3} fontSize="8px" fontWeight="800" color="#60747a" textTransform="none">SỐ PHẦN</Th>
            <Th w="11%" px={2} py={3} fontSize="8px" fontWeight="800" color="#60747a" textTransform="none">CƠ CẤU SUẤT ĂN</Th>
            <Th w="13%" px={2} py={3} fontSize="8px" fontWeight="800" color="#60747a" textTransform="none">MÓN ĂN</Th>
            <Th w="14%" px={2} py={3} fontSize="8px" fontWeight="800" color="#60747a" textTransform="none">BOM MÓN ĂN</Th>
            <Th w="15%" px={2} py={3} fontSize="8px" fontWeight="800" color="#60747a" textTransform="none" lineHeight="12px">KHỐI LƯỢNG<br/>YÊU CẦU<br/>SẢN XUẤT</Th>
        </Tr>
    </Thead>
    <Tbody>
        {filteredRowDatas.map((row,index) => (
            <Tr key={`${index}-${row.join("-")}`} _hover={{ bg:"#f8fbfb" }}>
                <Td px={2} py={3} verticalAlign="top" fontSize="9px" color="#87959a">{index + 1}</Td>
<Td px={2} py={3} verticalAlign="top">
    <Text fontSize="9px" lineHeight="16px" color="#586b72">
        {row[0] ? new Date(Number(row[0])).toLocaleDateString("vi-VN") : "—"}
    </Text>
</Td>                <Td px={2} py={3} verticalAlign="top"><HStack align="flex-start" spacing={2}><Box mt="5px" w="7px" h="7px" flexShrink={0} borderRadius="full" bg="#4aa2a0"/><Text fontSize="9px" fontWeight="700" lineHeight="16px" color="#425860">{row[1] || "—"}</Text></HStack></Td>
                <Td px={2} py={3} verticalAlign="top"><Badge borderRadius="6px" bg="#f4f6f7" color="#69797e" px={2} py={1} fontSize="8px">{row[2] || "—"}</Badge></Td>
                <Td px={2} py={3} verticalAlign="top"><Text fontSize="9px" lineHeight="16px" color="#586b72">{row[3] || "—"}</Text></Td>
                <Td px={2} py={3} verticalAlign="top"><Badge borderRadius="6px" bg="#edf7f7" color="#508f90" px={2} py={1} fontSize="8px">{row[4] ?? "—"}</Badge></Td>
                <Td px={2} py={3} verticalAlign="top"><Text fontSize="9px" lineHeight="16px" color="#586b72">{row[5] || "—"}</Text></Td>
                <Td px={2} py={3} verticalAlign="top"><Text fontSize="9px" fontWeight="600" lineHeight="16px" color="#455a62">{row[6] || "—"}</Text></Td>
                <Td px={2} py={3} verticalAlign="top">{row[7] ? <Box w="100%" overflow="hidden" borderRadius="7px" bg="#f8fafb" px={2} py={2}><Text fontSize="8px" lineHeight="15px" color="#62747a">{row[7]}</Text></Box> : <Text fontSize="9px" color="#b1babc">—</Text>}</Td>
                <Td px={2} py={3} verticalAlign="top">{row[8] ? <Box w="100%" overflow="hidden" borderRadius="7px" bg="#eef7f6" px={2} py={2}><Text fontSize="8px" fontWeight="700" lineHeight="15px" color="#478e8b">{row[8]}</Text></Box> : <Text fontSize="9px" color="#b1babc">—</Text>}</Td>
            </Tr>
        ))}
    </Tbody>
</Table>
                    ) : (
                        <Flex minH="300px" direction="column" align="center" justify="center" px={5} textAlign="center">
                            <Flex w="48px" h="48px" align="center" justify="center" borderRadius="12px" bg="#eef7f8" color="#62a5ab"><Icon as={MdSearch} boxSize={5} /></Flex>
                            <Text mt={3} fontSize="14px" fontWeight="600" color="#596c72">Không có dữ liệu</Text>
                            <Text mt={1} maxW="360px" fontSize="10px" lineHeight="20px" color="#8c999e">Chọn khách hàng và ngày, sau đó nhấn Tìm kiếm để tải dữ liệu lệnh sản xuất.</Text>
                        </Flex>
                    )}
                </TableContainer>

                <Flex direction={{ base: "column", sm: "row" }} align={{ base: "flex-start", sm: "center" }} justify="space-between" gap={2} px={4} py="14px" borderTop="1px solid #edf2f3" bg="#fbfcfc">
                    <Text fontSize="9px" color="#7f8d92">{filteredRowDatas.length ? `Hiển thị ${filteredRowDatas.length} / ${rowDatas.length} dòng` : "0 dòng"}</Text>
                    <Text fontSize="9px" fontWeight="600" color="#8b999e">Ngày: {formatDateForInput(selectedDate) || "Chưa chọn"}</Text>
                </Flex>
            </Box>
        </Box>

        {isLoading && (
            <Flex position="fixed" inset={0} zIndex={9998} align="center" justify="center" bg="rgba(239,246,247,.55)" backdropFilter="blur(2px)">
                <Box border="1px solid #dce8e9" borderRadius="16px" bg="white" px={8} py={7} textAlign="center" boxShadow="0 18px 55px rgba(31,72,77,.16)">
                    <Spinner size="xl" thickness="4px" speed="0.7s" color="#3f9898" />
                    <Text mt={3} fontSize="12px" fontWeight="700" color="#3f8f8f">Đang xử lý...</Text>
                    <Text mt={1} fontSize="9px" color="#95a1a5">Vui lòng chờ trong giây lát</Text>
                </Box>
            </Flex>
        )}
    </Box>
);
}

export default LenhSanXuat;