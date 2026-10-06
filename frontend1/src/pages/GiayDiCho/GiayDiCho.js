import React, { useState, useRef, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import {
    Box,
    Flex,
    Heading,
    Input,
    Button,
    Text,
    Spinner,
    Icon,
    Select,
    VStack,
    SimpleGrid,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    useToast,
    Checkbox,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    PopoverBody,
    Divider,
    Badge
} from '@chakra-ui/react';
import { MdSearch } from 'react-icons/md';
import { BsFileExcel } from 'react-icons/bs';
import { sleep, confirmChoice } from "../../utils/helpers";
import httpClient from '../../services/http-client';

function GiayDiCho() {
    const [cookies, setCookie, removeCookie] = useCookies(["loginCookie"]);
    const initialRef = useRef(null);
    const toast = useToast();

    const [limit, setLimit] = useState(25);
    const [searchText, setSearchText] = useState("");
    const [selectedClient, setSelectedClient] = useState(null);
    const [selectedKitchen, setSelectedKitchen] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedCa, setSelectedCa] = useState(null);
    const [selectedSite, setSelectedSite] = useState([]);
    const [lenhSanXuats, setLenhSanXuats] = useState([]);
    const [clientDatas, setClientDatas] = useState([]);
    const [siteDatas, setSiteDatas] = useState([]);
    const [rowDatas, setRowDatas] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [isSiteOpen, setIsSiteOpen] = useState(false);
    const mouted = useRef();

    useEffect(() => {
        if(!mouted.current) {
            loadInitDatas();
            mouted.current = true;
        }
    }, []);

    useEffect(() => {
        setSelectedSite(prev =>
            prev.filter(item =>
                siteDatas.some(site =>
                    String(site.MaKhachHang || '').trim() === String(selectedClient || '').trim() &&
                    String(site.MaSite || '').trim() === String(item.value || '').trim()
                )
            )
        );
    }, [selectedClient, siteDatas]);

    const loadInitDatas = async() => {
        setIsLoading(true);
        try {
            const res = await httpClient.post(`/larksuite/list_client`);
            if(!res.data.error) {
                setClientDatas(res.data?.data || []);
            } else {
                setErrorMessage("Lỗi:" + JSON.stringify(res.data?.error?.message));
            }

            const listSiteRes = await httpClient.post(`/larksuite/list_site`);
            if(!listSiteRes.data.error) {
                setSiteDatas(listSiteRes.data?.data || []);
            } else {
                setErrorMessage("Lỗi:" + JSON.stringify(res.data?.error?.message));
            }
        } catch(error) {
            console.log("--- loadInitDatas error:", error);
            setErrorMessage("Lỗi: " + (error.response?.data?.msg || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    const handleExportExcel = async() => {
        confirmChoice("Bạn có đồng ý xuất Excel không?", async() => {
            setIsLoading(true);
            try {
                const res = await httpClient.post(
                    `/export_excel_file/giay_di_cho`,
                    {
                        client_code: selectedClient,
                        date: selectedDate,
                        kitchen: selectedKitchen,
                        site: selectedSite.map(item => item.value),
                        ca: selectedCa
                    },
                    { responseType: 'blob' }
                );

                if(res.data) {
                    const blobEXCEL = new Blob([res.data], {
                        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;'
                    });
                    const fileURL = window.URL.createObjectURL(blobEXCEL);
                    const link = document.createElement('a');
                    link.href = fileURL;
                    link.setAttribute("download", `GiayDiCho_${selectedDate}_${selectedClient}.xlsx`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(fileURL);

                    toast({
                        description: "Xuất excel thành công!",
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                        position: "bottom-right"
                    });
                }
            } catch(error) {
                console.log("--- export error:", error);
                setErrorMessage("Lỗi: " + (error.response?.data?.msg || error.message));
            } finally {
                setIsLoading(false);
            }
        });
    };

    const handleSearch = async() => {
        if(!selectedClient) {
            alert("Vui lòng chọn khách hàng!");
            return;
        }

        if(!selectedDate) {
            alert("Vui lòng chọn ngày!");
            return;
        }

        await sleep(250);
        setIsLoading(true);
        setErrorMessage(null);

        try {
            const res = await httpClient.post(
                `/larksuite/giay_di_cho`,
                {
                    client_code: selectedClient,
                    date: selectedDate,
                    ca: selectedCa,
                    site: selectedSite.map(item => item.value)
                }
            );

            console.log("--- handle Search res:", res.data);

            if(!res.data.error) {
                setRowDatas(res.data.data || []);
            } else {
                setErrorMessage(
                    "Lỗi:" +
                    JSON.stringify(res.data?.error?.message || res.data?.msg)
                );
            }
        } catch(error) {
            console.log("--- handle Search error:", error);
            setErrorMessage("Lỗi: " + (error.response?.data?.msg || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    const formatDateForInput = date => {
        if(!date) return '';
        const value = date instanceof Date ? date : new Date(date);
        if(Number.isNaN(value.getTime())) return '';
        return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
    };

    const parseDateInput = value => {
        if(!value) return null;
        const [year, month, day] = value.split('-').map(Number);
        if(!year || !month || !day) return null;
        return new Date(year, month - 1, day);
    };

    const sortedClients = [...clientDatas]
        .filter(Boolean)
        .sort((a, b) => String(a).localeCompare(String(b)));

    const clientSiteOptions = [
        ...new Set(
            siteDatas
                .filter(item =>
                    String(item.MaKhachHang || '').trim() === String(selectedClient || '').trim()
                )
                .map(item => String(item.MaSite || '').trim())
                .filter(Boolean)
        )
    ].map(site => ({
        label: site,
        value: site
    }));

    const tableSiteNames = [];

    rowDatas.forEach(row => {
        String(row.DanhSachCacSite || '')
            .split(',')
            .map(item => item.trim())
            .filter(Boolean)
            .forEach(site => {
                if(!tableSiteNames.includes(site)) {
                    tableSiteNames.push(site);
                }
            });
    });

    const displaySiteNames = [
        tableSiteNames[0] || '',
        tableSiteNames[1] || '',
        tableSiteNames[2] || '',
        tableSiteNames[3] || '',
        tableSiteNames[4] || ''
    ];

    const filteredRowDatas = rowDatas.filter(row => {
        const keyword = searchText.trim().toLowerCase();
        if(!keyword) return true;

        return Object.values(row).some(value =>
            String(value ?? '').toLowerCase().includes(keyword)
        );
    });

    const getSiteValue = (row, siteName) => {
        if(!siteName) return "";

        const siteNames = String(row.DanhSachCacSite || "")
            .split(",")
            .map(item => item.trim());

        const siteQuantities = String(row.SoLuongCacSite || "")
            .split(",")
            .map(item => item.trim());

        const index = siteNames.indexOf(siteName);
        if(index === -1) return "";

        return siteQuantities[index] || "";
    };

    const getHaoHutKg = row => {
        const tong = Number(row.TongKhoiLuongYeuCauSanXuat || 0);
        const haoHut = Number(row.HaoHut || 0);
        if(!tong || !haoHut) return 0;
        return tong * haoHut / 100;
    };

    const getNhapThucTe = row => {
        const tong = Number(row.TongKhoiLuongYeuCauSanXuat || 0);
        const haoHutKg = getHaoHutKg(row);
        return tong + haoHutKg;
    };

    const toggleSite = site => {
        setSelectedSite(prev => {
            const exists = prev.some(item => item.value === site.value);
            if(exists) {
                return prev.filter(item => item.value !== site.value);
            }
            return [...prev, site];
        });
    };

    const toggleAllSites = () => {
        if(clientSiteOptions.length === 0) return;

        if(selectedSite.length === clientSiteOptions.length) {
            setSelectedSite([]);
        } else {
            setSelectedSite(clientSiteOptions);
        }
    };

    return (
        <Box minH="100%" w="100%" bg="#f5f8f9" color="#263238" overflowX="hidden">
            <Box w="100%" p={{ base: 2, md: 4 }}>
                <Box mb={4} bg="white" border="1px solid" borderColor="#dfe8ea" borderRadius="16px" overflow="hidden" boxShadow="0 7px 25px rgba(35,78,83,.05)">
                    <Flex px={{ base: 4, md: 5 }} py={4} align="center" justify="space-between" gap={4}>
                        <Flex align="center" gap={3} minW={0}>
                            <Flex w="40px" h="40px" flexShrink={0} align="center" justify="center" borderRadius="10px" bg="#eaf7f7" color="#3e9898">
                                <Icon as={MdSearch} boxSize={5} />
                            </Flex>

                            <Box minW={0}>
                                <Text fontSize="9px" fontWeight="800" textTransform="uppercase" letterSpacing=".14em" color="#79a6aa">
                                    PROCUREMENT MANAGEMENT
                                </Text>
                                <Heading mt="2px" fontSize="20px" fontWeight="800" color="#273c43">
                                    Giấy đi chợ
                                </Heading>
                                <Text mt={1} fontSize="10px" color="#89979c">
                                    Tìm kiếm dữ liệu giấy đi chợ và xuất Excel theo nhu cầu.
                                </Text>
                            </Box>
                        </Flex>

                        <Badge flexShrink={0} px={3} py="7px" borderRadius="999px" bg="#eef8f7" color="#3f8f8f" fontSize="9px">
                            {filteredRowDatas.length} dòng
                        </Badge>
                    </Flex>
                </Box>

                <Box mb={4} bg="white" border="1px solid" borderColor="#dfe8ea" borderRadius="16px" overflow="visible" boxShadow="0 7px 25px rgba(35,78,83,.05)">
                    <Box px={{ base: 4, md: 5 }} py={4} borderBottom="1px solid" borderColor="#e8edef">
                        <Flex align="center" gap={2}>
                            <Box w="8px" h="8px" borderRadius="50%" bg="#4ba3a0" />
                            <Box>
                                <Text fontSize="13px" fontWeight="800" color="#3b5158">
                                    Thông tin tìm kiếm
                                </Text>
                                <Text mt="2px" fontSize="9px" color="#8b999e">
                                    Chọn khách hàng, bếp, ca, site và ngày trước khi tìm kiếm hoặc xuất Excel.
                                </Text>
                            </Box>
                        </Flex>
                    </Box>

                    <SimpleGrid columns={{ base: 1, md: 2, xl: 5 }} spacing={4} p={4}>
                        <Box>
                            <Text mb="7px" fontSize="9px" fontWeight="800" textTransform="uppercase" letterSpacing=".06em" color="#62767d">
                                Khách hàng
                            </Text>
                            <Select
                                value={selectedClient || ""}
                                placeholder="Chọn khách hàng"
                                onChange={event => {
                                    setSelectedClient(event.target.value);
                                    setSelectedSite([]);
                                    setIsSiteOpen(false);
                                    setRowDatas([]);
                                }}
                                isDisabled={isLoading}
                                h="42px"
                                borderRadius="10px"
                                borderColor="#d7e2e4"
                                fontSize="11px"
                                color="#33484f"
                            >
                                {sortedClients.map(client => (
                                    <option key={`client-${client}`} value={client}>{client}</option>
                                ))}
                            </Select>
                        </Box>

                        <Box>
                            <Text mb="7px" fontSize="9px" fontWeight="800" textTransform="uppercase" letterSpacing=".06em" color="#62767d">
                                Bếp
                            </Text>
                            <Select
                                value={selectedKitchen || ""}
                                placeholder="Chọn bếp"
                                onChange={event => setSelectedKitchen(event.target.value)}
                                isDisabled={isLoading}
                                h="42px"
                                borderRadius="10px"
                                borderColor="#d7e2e4"
                                fontSize="11px"
                                color="#33484f"
                            >
                                {["Bếp trung tâm", "Bếp trung tâm 2", "Bếp tại chỗ"].map(key => (
                                    <option key={`kitchen-${key}`} value={key}>{key}</option>
                                ))}
                            </Select>
                        </Box>

                        <Box>
                            <Text mb="7px" fontSize="9px" fontWeight="800" textTransform="uppercase" letterSpacing=".06em" color="#62767d">
                                Ca
                            </Text>
                            <Select
                                value={selectedCa || ""}
                                placeholder="Chọn ca"
                                onChange={event => setSelectedCa(event.target.value)}
                                isDisabled={isLoading}
                                h="42px"
                                borderRadius="10px"
                                borderColor="#d7e2e4"
                                fontSize="11px"
                                color="#33484f"
                            >
                                {["Ca 1", "Ca 2", "Ca 3"].map(key => (
                                    <option key={`ca-${key}`} value={key}>{key}</option>
                                ))}
                            </Select>
                        </Box>

                        <Box position="relative" zIndex={20}>
                            <Text mb="7px" fontSize="9px" fontWeight="800" textTransform="uppercase" letterSpacing=".06em" color="#62767d">
                                Site
                            </Text>

                            <Popover
                                isOpen={isSiteOpen}
                                onClose={() => setIsSiteOpen(false)}
                                placement="bottom-start"
                                matchWidth
                            >
                                <PopoverTrigger>
                                    <Button
                                        w="100%"
                                        h="42px"
                                        justifyContent="space-between"
                                        borderRadius="10px"
                                        border="1px solid"
                                        borderColor="#d7e2e4"
                                        bg="white"
                                        color={selectedSite.length ? "#33484f" : "#8c9a9f"}
                                        fontSize="11px"
                                        fontWeight="500"
                                        onClick={() => setIsSiteOpen(prev => !prev)}
                                        _hover={{ bg: "#fbfdfd" }}
                                    >
                                        <Text overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                                            {selectedSite.length ? selectedSite.map(item => item.label).join(", ") : "Chọn site"}
                                        </Text>
                                        <Text fontSize="16px">{isSiteOpen ? "⌃" : "⌄"}</Text>
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent w="100%" borderColor="#dbe7e8" borderRadius="10px" boxShadow="0 12px 35px rgba(35,78,83,.12)">
                                    <PopoverArrow />
                                    <PopoverBody p={2}>
                                        {clientSiteOptions.length > 0 ? (
                                            <VStack align="stretch" spacing={1}>
                                                <Button size="sm" variant="ghost" justifyContent="flex-start" fontSize="10px" color="#478e8b" onClick={toggleAllSites}>
                                                    {selectedSite.length === clientSiteOptions.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                                                </Button>

                                                <Divider />

                                                {clientSiteOptions.map(site => (
                                                    <Checkbox
                                                        key={`site-${site.value}`}
                                                        isChecked={selectedSite.some(item => item.value === site.value)}
                                                        onChange={() => toggleSite(site)}
                                                        px={2}
                                                        py={1.5}
                                                        borderRadius="7px"
                                                        colorScheme="teal"
                                                    >
                                                        <Text fontSize="10px">{site.label}</Text>
                                                    </Checkbox>
                                                ))}
                                            </VStack>
                                        ) : (
                                            <Text px={2} py={2} fontSize="10px" color="#9aa7ab">
                                                Không có site của khách hàng này
                                            </Text>
                                        )}
                                    </PopoverBody>
                                </PopoverContent>
                            </Popover>
                        </Box>

                        <Box>
                            <Text mb="7px" fontSize="9px" fontWeight="800" textTransform="uppercase" letterSpacing=".06em" color="#62767d">
                                Ngày
                            </Text>
                            <Input
                                type="date"
                                value={formatDateForInput(selectedDate)}
                                onChange={event => setSelectedDate(parseDateInput(event.target.value))}
                                isDisabled={isLoading}
                                h="42px"
                                borderRadius="10px"
                                borderColor="#d7e2e4"
                                bg="white"
                                px={3}
                                fontSize="11px"
                                color="#33484f"
                            />
                        </Box>
                    </SimpleGrid>

                    <SimpleGrid columns={{ base: 1, md: 4 }} mx={4} mb={4} overflow="hidden" border="1px solid" borderColor="#e5edef" borderRadius="11px" bg="#f8fbfb">
                        <Box px="14px" py={3} borderRight={{ base: "none", md: "1px solid" }} borderBottom={{ base: "1px solid", md: "none" }} borderColor="#e5edef">
                            <Text fontSize="8px" fontWeight="800" textTransform="uppercase" color="#91a0a4">Khách hàng</Text>
                            <Text mt={1} fontSize="10px" fontWeight="700" color="#455960" isTruncated>{selectedClient || "—"}</Text>
                        </Box>

                        <Box px="14px" py={3} borderRight={{ base: "none", md: "1px solid" }} borderBottom={{ base: "1px solid", md: "none" }} borderColor="#e5edef">
                            <Text fontSize="8px" fontWeight="800" textTransform="uppercase" color="#91a0a4">Bếp</Text>
                            <Text mt={1} fontSize="10px" fontWeight="700" color="#455960">{selectedKitchen || "—"}</Text>
                        </Box>

                        <Box px="14px" py={3} borderRight={{ base: "none", md: "1px solid" }} borderBottom={{ base: "1px solid", md: "none" }} borderColor="#e5edef">
                            <Text fontSize="8px" fontWeight="800" textTransform="uppercase" color="#91a0a4">Ca / Site</Text>
                            <Text mt={1} fontSize="10px" fontWeight="700" color="#455960" isTruncated>
                                {selectedCa || "—"}{selectedSite.length ? ` / ${selectedSite.length} site` : " / —"}
                            </Text>
                        </Box>

                        <Box px="14px" py={3}>
                            <Text fontSize="8px" fontWeight="800" textTransform="uppercase" color="#91a0a4">Ngày</Text>
                            <Text mt={1} fontSize="10px" fontWeight="700" color="#455960">
                                {formatDateForInput(selectedDate) || "—"}
                            </Text>
                        </Box>
                    </SimpleGrid>

                    {errorMessage && (
                        <Box mx={4} mb={4} px={3.5} py={3} border="1px solid" borderColor="#f0d0d0" borderRadius="10px" bg="#fff6f6" color="#a14b4b" fontSize="10px">
                            {errorMessage}
                        </Box>
                    )}

                    <Flex px={4} py={4} justify="flex-end" gap={2.5} borderTop="1px solid" borderColor="#e8edef" bg="#fbfcfc">
                        <Button
                            onClick={handleSearch}
                            isLoading={isLoading}
                            loadingText="Đang tìm..."
                            leftIcon={<Icon as={MdSearch} boxSize={4} />}
                            h="42px"
                            px={5}
                            borderRadius="10px"
                            bg="#3f9898"
                            color="white"
                            fontSize="10px"
                            fontWeight="800"
                            _hover={{ bg: "#327f80" }}
                        >
                            Tìm kiếm
                        </Button>

                        <Button
                            onClick={handleExportExcel}
                            isLoading={isLoading}
                            loadingText="Đang xuất..."
                            leftIcon={<Icon as={BsFileExcel} boxSize={4} />}
                            h="42px"
                            px={5}
                            borderRadius="10px"
                            bg="#6eaaa6"
                            color="white"
                            fontSize="10px"
                            fontWeight="800"
                            _hover={{ bg: "#5a9692" }}
                        >
                            Xuất Excel
                        </Button>
                    </Flex>
                </Box>

                <Box mt={4} bg="white" border="1px solid" borderColor="#dfe8ea" borderRadius="16px" overflow="hidden" boxShadow="0 7px 25px rgba(35,78,83,.05)">
                    <Flex px={{ base: 4, md: 5 }} py={4} align="center" justify="space-between" gap={4} borderBottom="1px solid" borderColor="#e8edef">
                        <Box>
                            <Flex align="center" gap={2}>
                                <Box w="8px" h="8px" borderRadius="50%" bg="#65a8ae" />
                                <Heading fontSize="14px" fontWeight="800" color="#3b5158">Dữ liệu giấy đi chợ</Heading>
                                <Badge px="10px" py="4px" borderRadius="999px" bg="#eef7f7" color="#579b96" fontSize="8px">
                                    {filteredRowDatas.length}
                                </Badge>
                            </Flex>

                            <Text mt={1} fontSize="9px" color="#8b999e">
                                Dữ liệu được lấy trực tiếp từ hệ thống.
                            </Text>
                        </Box>

                        <Input
                            value={searchText}
                            onChange={event => setSearchText(event.target.value)}
                            placeholder="Tìm thực phẩm, cơ cấu, ca..."
                            h="38px"
                            w="250px"
                            maxW="100%"
                            borderColor="#d7e2e4"
                            borderRadius="9px"
                            bg="#fbfcfc"
                            fontSize="10px"
                        />
                    </Flex>

                    <TableContainer overflowX="auto" overflowY="hidden" w="100%">
                        {filteredRowDatas.length > 0 ? (
                            <Table
                                minW="1950px"
                                size="sm"
                                variant="simple"
                                sx={{
                                    tableLayout: "fixed",
                                    "& th, & td": {
                                        whiteSpace: "normal",
                                        wordBreak: "break-word",
                                        overflowWrap: "anywhere",
                                        borderColor: "#dfe7e8",
                                        textAlign: "center",
                                        verticalAlign: "middle"
                                    }
                                }}
                            >
                                <Thead bg="#f3f8f8">
                                    <Tr>
                                        <Th rowSpan={2} w="55px" px={2} py={3} fontSize="8px" color="#60747a">STT</Th>
                                        <Th rowSpan={2} w="150px" px={2} py={3} fontSize="8px" color="#60747a">CƠ CẤU SUẤT ĂN</Th>
                                        <Th rowSpan={2} w="75px" px={2} py={3} fontSize="8px" color="#60747a">CA</Th>
                                        <Th rowSpan={2} w="175px" px={2} py={3} fontSize="8px" color="#60747a">TÊN THỰC PHẨM</Th>
                                        <Th rowSpan={2} w="85px" px={2} py={3} fontSize="8px" color="#60747a">ĐỊNH MỨC</Th>
                                        <Th rowSpan={2} w="70px" px={2} py={3} fontSize="8px" color="#60747a">ĐVT</Th>

                                        {displaySiteNames.map((site, index) => (
                                            <Th key={`site-header-${index}`} rowSpan={2} w="85px" px={2} py={3} fontSize="8px" color="#60747a">
                                                {site}
                                            </Th>
                                        ))}

                                        <Th rowSpan={2} w="95px" px={2} py={3} fontSize="8px" color="#60747a">TỔNG SỐ PHẦN</Th>
                                        <Th rowSpan={2} w="135px" px={2} py={3} fontSize="8px" color="#60747a">TỔNG CHƯA THÀNH PHẨM (KG)</Th>
                                        <Th rowSpan={2} w="80px" px={2} py={3} fontSize="8px" color="#60747a">HAO HỤT %</Th>
                                        <Th rowSpan={2} w="90px" px={2} py={3} fontSize="8px" color="#60747a">HAO HỤT (KG)</Th>
                                        <Th rowSpan={2} w="105px" px={2} py={3} fontSize="8px" color="#60747a">NHẬP THỰC TẾ (KG)</Th>
                                        <Th rowSpan={2} w="90px" px={2} py={3} fontSize="8px" color="#60747a">ĐƠN GIÁ</Th>
                                        <Th rowSpan={2} w="95px" px={2} py={3} fontSize="8px" color="#60747a">THÀNH TIỀN</Th>

                                        <Th colSpan={2} w="140px" px={2} py={2} fontSize="8px" color="#60747a">
                                            XÁC NHẬN
                                        </Th>

                                        <Th rowSpan={2} w="220px" px={2} py={3} fontSize="8px" color="#60747a">NHÀ CUNG CẤP</Th>
                                        <Th rowSpan={2} w="180px" px={2} py={3} fontSize="8px" color="#60747a">NGƯỜI GIAO HÀNG</Th>
                                        <Th rowSpan={2} w="100px" px={2} py={3} fontSize="8px" color="#60747a">GHI CHÚ</Th>
                                    </Tr>

                                    <Tr>
                                        <Th w="70px" px={2} py={2} fontSize="8px" color="#60747a">ODSV</Th>
                                        <Th w="70px" px={2} py={2} fontSize="8px" color="#60747a">BIZEN</Th>
                                    </Tr>
                                </Thead>

                                <Tbody>
                                    {filteredRowDatas.map((row, index) => (
                                        <Tr key={`gdc-${index}-${row.NguyenVatLieu}-${row.Ca}`} _hover={{ bg: "#f8fbfb" }}>
                                            <Td px={2} py={3} fontSize="9px" color="#87959a">{index + 1}</Td>

                                            <Td px={2} py={3} fontSize="9px" color="#455a62" fontWeight="600">
                                                {row.CoCauSuatAn || ""}
                                            </Td>

                                            <Td px={2} py={3}>
                                                <Badge px={2} py={1} borderRadius="6px" bg="#f4f6f7" color="#69797e" fontSize="8px">
                                                    {row.Ca || ""}
                                                </Badge>
                                            </Td>

                                            <Td px={2} py={3} fontSize="9px" color="#455a62" fontWeight="600">
                                                {row.NguyenVatLieu || ""}
                                            </Td>

                                            <Td px={2} py={3} fontSize="9px" color="#586b72">
                                                {row.DinhMucNguyenLieu ?? ""}
                                            </Td>

                                            <Td px={2} py={3} fontSize="9px" color="#586b72">
                                                {row.DonViTinh || ""}
                                            </Td>

                                            {displaySiteNames.map((site, siteIndex) => (
                                                <Td key={`site-cell-${siteIndex}`} px={2} py={3} fontSize="9px" color="#586b72">
                                                    {site ? getSiteValue(row, site) : ""}
                                                </Td>
                                            ))}

                                            <Td px={2} py={3} fontSize="9px" color="#586b72">
                                                {row.TongSoPhan ?? ""}
                                            </Td>

                                            <Td px={2} py={3} fontSize="9px" color="#455a62">
                                                {row.TongKhoiLuongYeuCauSanXuat ?? ""}
                                            </Td>

                                            <Td px={2} py={3} fontSize="9px" color="#586b72">
                                                {row.HaoHut ? `${row.HaoHut}%` : "0%"}
                                            </Td>

                                            <Td px={2} py={3} fontSize="9px" color="#586b72">
                                                {getHaoHutKg(row)}
                                            </Td>

                                            <Td px={2} py={3} fontSize="9px" color="#455a62" fontWeight="600">
                                                {getNhapThucTe(row)}
                                            </Td>

                                            <Td px={2} py={3} fontSize="9px" color="#586b72">
                                                {Number(row.DonGia || 0) || ""}
                                            </Td>

                                            <Td px={2} py={3} fontSize="9px" color="#586b72"></Td>

                                            <Td px={2} py={3} fontSize="9px" color="#586b72"></Td>
                                            <Td px={2} py={3} fontSize="9px" color="#586b72"></Td>

                                            <Td px={2} py={3} fontSize="9px" color="#586b72">
                                                {row.TenCoSo || ""}
                                            </Td>

                                            <Td px={2} py={3} fontSize="9px" color="#586b72" fontWeight="500">
                                                {row.NguoiGiaoHang || ""}
                                            </Td>

                                            <Td px={2} py={3} fontSize="9px" color="#586b72"></Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        ) : (
                            <Flex minH="300px" direction="column" align="center" justify="center" px={5} textAlign="center">
                                <Flex w="48px" h="48px" align="center" justify="center" borderRadius="12px" bg="#eef7f8" color="#62a5ab">
                                    <Icon as={MdSearch} boxSize={5} />
                                </Flex>

                                <Text mt={3} fontSize="14px" fontWeight="600" color="#596c72">
                                    Chưa có dữ liệu
                                </Text>

                                <Text mt={1} maxW="360px" fontSize="10px" lineHeight="20px" color="#8c999e">
                                    Chọn khách hàng và ngày, sau đó nhấn Tìm kiếm để tải dữ liệu giấy đi chợ.
                                </Text>
                            </Flex>
                        )}
                    </TableContainer>

                    <Flex px={4} py="14px" justify="space-between" align="center" borderTop="1px solid" borderColor="#edf2f3" bg="#fbfcfc">
                        <Text fontSize="9px" color="#7f8d92">
                            {filteredRowDatas.length ? `Hiển thị ${filteredRowDatas.length} dòng dữ liệu` : "0 dòng"}
                        </Text>

                        <Text fontSize="9px" fontWeight="600" color="#8b999e">
                            Ngày: {formatDateForInput(selectedDate) || "Chưa chọn"}
                        </Text>
                    </Flex>
                </Box>
            </Box>

            {isLoading && (
                <Flex position="fixed" inset={0} zIndex={9998} align="center" justify="center" bg="rgba(239,246,247,.55)" backdropFilter="blur(2px)">
                    <Box px={8} py={7} textAlign="center" bg="white" border="1px solid" borderColor="#dce8e9" borderRadius="16px" boxShadow="0 18px 55px rgba(31,72,77,.16)">
                        <Spinner size="xl" thickness="4px" speed="0.7s" color="#3f9898" />
                        <Text mt={3} fontSize="12px" fontWeight="700" color="#3f8f8f">Đang xử lý...</Text>
                        <Text mt={1} fontSize="9px" color="#95a1a5">Vui lòng chờ trong giây lát</Text>
                    </Box>
                </Flex>
            )}
        </Box>
    );
}

export default GiayDiCho;