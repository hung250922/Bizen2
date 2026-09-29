import React, {useState, useEffect, useRef} from 'react';
import { 
    Flex, Center, Box, CircularProgress, CircularProgressLabel, Text, Button, Icon, useToast,
    HStack, Alert, AlertIcon, AlertDescription,
    Heading, Tabs, TabList, TabPanels, Tab, TabPanel, Select,
    Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, Input,
    FormControl, FormLabel, Image, IconButton,
    VStack
} from '@chakra-ui/react';
import { Row, Col, Card, Statistic, Typography, Progress } from "antd";
import { useCookies } from "react-cookie";
import axios from 'axios';
import { MdDownload, MdSearch } from 'react-icons/md';
import { FormattedNumber, FormattedDate } from "react-intl";
import { useLocation, useNavigate } from "react-router-dom";
import { MdArrowBack, MdArrowForward, MdAdd } from 'react-icons/md';
import { MultiSelect } from "react-multi-select-component";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { DayPicker } from "react-day-picker";
import { startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import "react-day-picker/style.css";
import BarChartComponent from './BarChart';
import PieChartComponent from './PieChart';
import LineChartComponent from './LineChart';
import _, { get } from 'lodash';
import { sleep } from '../../utils/helpers';
import httpClient from '../../services/http-client';
import { COMPANY_LOGO, CO_CAU_SUAT_AN_SAMPLE, NGAY_AN_BY_CLIENTS, MENU_DATA_WEEKS, DANH_MUC_MON_AN } from "../../constants";
import moment from 'moment';
const { Title } = Typography;
const intl = Intl.NumberFormat();
const ItemGroupComponent = null;
const dayOrder = [
    "MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"
]
const TC1_MAX_POINT = 10, TC2_MAX_POINT = 10, TC3_MAX_POINT = 10, TC4_MAX_POINT = 10;

function WeekPicker() {
     const [selectedWeek, setSelectedWeek] = useState(null);
     
    const handleDayClick = (day) => {
        if (!day) return;

        // Find the boundary dates of the chosen week (Sunday to Saturday)
        const start = startOfWeek(day, { weekStartsOn: 0 }); // 0 = Sunday
        const end = endOfWeek(day, { weekStartsOn: 0 });

        // Generate array containing all 7 days in that specific week range
        const daysInWeek = eachDayOfInterval({ start, end });
        
        setSelectedWeek(daysInWeek);
    };

    return (
        <div style={{ padding: '20px', maxWidth: '350px' }}>
        <h3>Select a Week</h3>
        
        <DayPicker
            mode="single" // Allows highlighting a single week
            selected={selectedWeek}
            onDayClick={handleDayClick}
            //showOutsideDays // Fills empty grid slots cleanly
        />

        {selectedWeek && (
            <div style={{ marginTop: '15px', fontSize: '14px' }}>
            <strong>Selected Week Boundaries:</strong> <br />
            {selectedWeek[0].toLocaleDateString()} – {selectedWeek[6].toLocaleDateString()}
            </div>
        )}
        </div>
    );
}

function Dashboard({ }) {
    const [cookies, setCookie, removeCookie] = useCookies(["loginCookie"]);
    const [currentWeekIdx, setCurrentWeekIdx] = useState(0);
    const [fromDayOfWeek, setFromDayOfWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
    const [endDayOfWeek, setEndDayOfWeek] = useState(endOfWeek(new Date(), { weekStartsOn: 1 }));
    const [selectedClient, setSelectedClient] = useState("ZAMIL");
    const [danhMucMonAns, setDanhMucMonAns] = useState([]);
    const [menuData4Weeks, setMenuData4Weeks] = useState({});
    const [selectedMonAnInMenu, setSelectedMonAnInMenu] = useState(null);
    const [fillMonAnInMenu, setFillMonAnInMenu] = useState([]);
    const [monAnTheoMuaKhuyenKhichs, setMonAnTheoMuaKhuyenKhichs] = useState([]);
    const [monAnTheoMuaLoaiTrus, setMonAnTheoMuaLoaiTrus] = useState([]);
    const [cauHinhTinhDiems, setCauHinhTinhDiems] = useState({});
    const [donGiaSanPhams, setDonGiaSanPhams] = useState([]);
    const [phoiHopCombos, setPhoiHopCombos] = useState([]);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();
    const mouted = useRef();

    const { search } = useLocation();
    const htmlDownloadRef = useRef();

    useEffect(() => {
        if(!mouted.current) {
            // setMenuData4Weeks(MENU_DATA_WEEKS[selectedClient]);
            // fetchDMMonAns();
            // fetchMonAnTheoMuas();
            // fetchCauHinhTinhDiems();
            // fetchDonGiaSanPhams({ "client_name": "ZAMIL"});
            // fetchPhoiHopCombos();
            mouted.current = true;
        }
    }, []);

    //console.log("--- danhMucMonAns:", danhMucMonAns);
    const fetchDonGiaSanPhams = async (params) => {
        const res = await httpClient.get(`/catering/don_gia_san_phams`, { params });
        console.log("--- get Đơn giá Sản phẩm res:", res);
        setDonGiaSanPhams(res.data.data);
    };

    const fetchPhoiHopCombos = async () => {
        const res = await httpClient.get(`/catering/phoi_hop_combos`, { params: {} });
        console.log("--- get Phối hợp combo res:", res);
        setPhoiHopCombos(res.data.data);
    };

    const fetchDMMonAns = async () => {
        //setDanhMucMonAns(DANH_MUC_MON_AN);
        let newDanhMucMonAns = [];
        await Promise.all(DANH_MUC_MON_AN.map(async (item) => {
            const bomMonAns = await fetchBomMonAns(item.name);
            const monAnCost = await fetchPriceByMonAn(item.name);
            // const totalCost = bomMonAns.reduce((acc, bom) => {
            //     acc += (bom.nvl1_price || 0) * (bom.NVL1_DM || 0);
            //     acc += (bom.nvl2_price || 0) * (bom.NVL2_DM || 0);
            //     acc += (bom.nvl3_price || 0) * (bom.NVL3_DM || 0);
            //     acc += (bom.nvl4_price || 0) * (bom.NVL4_DM || 0);
            //     acc += (bom.nvl5_price || 0) * (bom.NVL5_DM || 0);
            //     acc += (bom.nvl6_price || 0) * (bom.NVL6_DM || 0);
            //     acc += (bom.nvl7_price || 0) * (bom.NVL7_DM || 0);
            //     return acc;
            // }, 0);
            bomMonAns.forEach(async (bom) => {
                if(bom.NVL1) {
                    bom.nvl1_price = await fetchDonGiaNVLByName(bom.NVL1);
                }
                if(bom.NVL2) {
                    bom.nvl2_price = await fetchDonGiaNVLByName(bom.NVL2);
                }
                if(bom.NVL3) {
                    bom.nvl3_price = await fetchDonGiaNVLByName(bom.NVL3);
                }
                if(bom.NVL4) {
                    bom.nvl4_price = await fetchDonGiaNVLByName(bom.NVL4);
                }
                if(bom.NVL5) {
                    bom.nvl5_price = await fetchDonGiaNVLByName(bom.NVL5);
                }
                if(bom.NVL6) {
                    bom.nvl6_price = await fetchDonGiaNVLByName(bom.NVL6);
                }
                if(bom.NVL7) {
                    bom.nvl7_price = await fetchDonGiaNVLByName(bom.NVL7);
                }
            });
            newDanhMucMonAns.push({...item, bomMonAns, monAnCost});
        }));
        setDanhMucMonAns(newDanhMucMonAns);
    };

    const fetchMonAnTheoMuas = async () => {
        const res = await httpClient.get(`/catering/mon_an_theo_muas`);
        setMonAnTheoMuaKhuyenKhichs(res.data.data.filter(item => item.is_encouraged));
        setMonAnTheoMuaLoaiTrus(res.data.data.filter(item => !item.is_encouraged));
    };

    const fetchCauHinhTinhDiems = async () => {
        const res = await httpClient.get(`/catering/cau_hinh_tinh_diems`);
        setCauHinhTinhDiems(res.data.data[0] || {});
    };

    const fetchBomMonAns = async (monAnName) => {
        const res = await httpClient.get(`/catering/bom_mon_ans`, { params: { food_name: monAnName } });
        return res.data.data;
    }

    const fetchDonGiaNVLByName = async (nvlName) => {
        const res = await httpClient.get(`/catering/don_gia_nguyen_vat_lieus`, { params: { nvl_name: nvlName } });
        //console.log("--- get Đơn giá NVL by name res:", res.data.data);
        return res.data.data.length > 0 ? res.data.data[0]?.nvl_price : 0;
    };

    const fetchPriceByMonAn = async (monAnName) => {
        // *** Tìm cấu tạo thành phần BOM của món ăn
        //const bomMonAnRes = await httpClient.get(`/catering/bom_mon_ans`, { params: { food_name: monAnName } });
        const bomMonAns = await fetchBomMonAns(monAnName);
       // console.log("--- get BOM món ăn res:", bomMonAnRes.data.data);
        if(bomMonAns.length > 0) {
            const { 
                NVL1, NVL2, NVL3, NVL4, NVL5, NVL6, NVL7,
                NVL1_DM, NVL2_DM, NVL3_DM, NVL4_DM, NVL5_DM, NVL6_DM, NVL7_DM 
            } = bomMonAns[0];

            const NVL1_PRICE = await fetchDonGiaNVLByName(NVL1) || 0;
            const NVL2_PRICE = await fetchDonGiaNVLByName(NVL2) || 0;
            const NVL3_PRICE = await fetchDonGiaNVLByName(NVL3) || 0;
            const NVL4_PRICE = await fetchDonGiaNVLByName(NVL4) || 0;
            const NVL5_PRICE = await fetchDonGiaNVLByName(NVL5) || 0;
            const NVL6_PRICE = await fetchDonGiaNVLByName(NVL6) || 0;
            const NVL7_PRICE = await fetchDonGiaNVLByName(NVL7) || 0;
            
            // console.log("--- NVL1_PRICE:", NVL1_DM, NVL1_PRICE);
            // console.log("--- NVL2_PRICE:", NVL2_DM, NVL2_PRICE);
            // console.log("--- NVL3_PRICE:", NVL3_DM, NVL3_PRICE);
            // console.log("--- NVL4_PRICE:", NVL4_DM, NVL4_PRICE);
            // console.log("--- NVL5_PRICE:", NVL5_DM, NVL5_PRICE);
            // console.log("--- NVL6_PRICE:", NVL6_DM, NVL6_PRICE);
            // console.log("--- NVL7_PRICE:", NVL7_DM, NVL7_PRICE);

            const TOTAL_PRICE = (NVL1_PRICE * (NVL1_DM || 0)) + (NVL2_PRICE * (NVL2_DM || 0)) + (NVL3_PRICE * (NVL3_DM || 0)) + 
                                (NVL4_PRICE * (NVL4_DM || 0)) + (NVL5_PRICE * (NVL5_DM || 0)) + (NVL6_PRICE * (NVL6_DM || 0)) + (NVL7_PRICE * (NVL7_DM || 0));
           // console.log("--- TOTAL_PRICE:", TOTAL_PRICE);
            return TOTAL_PRICE;
                // tìm đơn giá của từng NVL trong BOM
        }
        return 0;
        // return bomMonAnRes.data.data;
    };

    // console.log("--- monAnTheoMuaKhuyenKhichs", monAnTheoMuaKhuyenKhichs);
    // console.log("--- monAnTheoMuaLoaiTrus", monAnTheoMuaLoaiTrus);
    // console.log("--- cauHinhTinhDiems", cauHinhTinhDiems);
    // console.log("menuData4Weeks:", menuData4Weeks);
    // console.log("selectedMonAnInMenu", selectedMonAnInMenu);
    //console.log("fillMonAnInMenu", fillMonAnInMenu);
    // console.log("---- fromDayOfWeek", fromDayOfWeek, "endDayOfWeek", endDayOfWeek);

    const checkTrungPhuongPhapCheBienXNgay = (tuan, ngay, mon_an, phuong_phap_che_bien) => {
        const monAnByPPCBs = fillMonAnInMenu.filter(item => 
            item.phuongPhapCheBien === phuong_phap_che_bien
        );

        for (let i = 0; i < monAnByPPCBs.length; i++) {
            const item = monAnByPPCBs[i];
            const subNgay = moment(ngay).diff(moment(item.ngay), 'days');
            //console.log("--- subNgay 2.2", subNgay, cauHinhTinhDiems.ngay_trung_phuong_phap_che_bien);
            if(subNgay >= 0 && subNgay <= cauHinhTinhDiems.ngay_trung_phuong_phap_che_bien) {
                setErrors({
                    ...errors,
                    "phuong_phap_che_bien": `Món ăn "${mon_an}" với phương pháp chế biến "${phuong_phap_che_bien}" đã được chọn trong ${cauHinhTinhDiems.ngay_trung_phuong_phap_che_bien} ngày gần nhất.`
                });
                break;
            }
        }
    }

    const checkPhoiHopCombo = (thu, ca) => {
        const fillMonAnInMenuByThuCa = fillMonAnInMenu.filter(item => item.thu === thu && item.ca === ca);
        console.log("--- fillMonAnInMenuByThuCa", fillMonAnInMenuByThuCa);
        if(fillMonAnInMenuByThuCa.length >= 2) {
            const firstMonAn = fillMonAnInMenuByThuCa[0];
            const secondMonAn = fillMonAnInMenuByThuCa[1];
            const phoiHopCombo1 = phoiHopCombos.find(item => item.nvl_name === firstMonAn.protein);
            //const phoiHopCombo2 = phoiHopCombos.find(item => item.nvl_name === secondMonAn.protein);

            console.log("--- phoiHopCombo1", phoiHopCombo1);
            if(phoiHopCombo1 && phoiHopCombo1.nvl_not_to_go_with && phoiHopCombo1.nvl_not_to_go_with.indexOf(secondMonAn.protein) !== -1) {
                setErrors({
                    ...errors,
                    "phoi_hop_combo": `Món ăn "${firstMonAn.protein}" không nên đi cùng "${phoiHopCombo1.nvl_not_to_go_with}".`
                });
            }
        }
        // const phoiHopCombo = phoiHopCombos.find(item => item.nvl_name === mon_an);
        // if(phoiHopCombo) {
        //     if(phoiHopCombo.nvl_have_to_go_with) {
        //         setErrors({
        //             ...errors,
        //             "phoi_hop_combo": `Món ăn "${mon_an}" nên đi cùng "${phoiHopCombo.nvl_have_to_go_with}".`
        //         });
        //     }
        //     if(phoiHopCombo.nvl_not_to_go_with) {
        //         setErrors({
        //             ...errors,
        //             "phoi_hop_combo": `Món ăn "${mon_an}" không nên đi cùng "${phoiHopCombo.nvl_not_to_go_with}".`
        //         });
        //     }
        // }
    };

    const countTotalCostByThu = (thu) => {
        const findMenuData = MENU_DATA_WEEKS[selectedClient]?.[currentWeekIdx];
        if(findMenuData && findMenuData[thu] && findMenuData[thu].length > 0) {
            const totalCost = findMenuData[thu].reduce((acc, itemMonAnName) => {
                const monAn = danhMucMonAns.find(item => item.name === itemMonAnName);
                if(monAn) {
                    acc += monAn.monAnCost || 0;
                }
                return acc;
            }, 0);
            return totalCost.toLocaleString();
        }
        const totalCost = fillMonAnInMenu.reduce((acc, item) => {
            if(item.tuan === `Tuần ${currentWeekIdx}` && item.thu === thu) {
                acc += item.monAnCost || 0;
            }
            return acc;
        }, 0);
        return totalCost;
    }

    const MenuDataComponent = () => {
        return (
            <Flex flexDirection="column" gap={2} p={4} bg="white" borderWidth={1} borderColor="gray.300" borderRadius={8}>
                <Flex flexDirection="column" gap={1}>
                    <Text fontSize={16} fontWeight={600}>Menu thực đơn tuần {currentWeekIdx}</Text>
                    <Flex flexDirection="row" minH={250}>
                        <VStack bg="gray.100" p={2} h="100%" borderRightWidth={3} borderColor="gray.300">
                            <Text fontSize={14} fontWeight="bold">Công ty</Text>
                            <Text fontSize={14}>{selectedClient}</Text>
                        </VStack>
                        {
                            Object.keys(CO_CAU_SUAT_AN_SAMPLE[selectedClient]).map((ca, index) => {
                                const monAnList = CO_CAU_SUAT_AN_SAMPLE[selectedClient][ca];
                                
                                return (
                                    <>
                                        <VStack key={index} bg="gray.100" p={2} h="100%" borderRightWidth={3} borderColor="gray.300">
                                            <Text fontSize={14} fontWeight="bold">Ca</Text>
                                            <Text key={index} fontSize={14}>{ca}</Text>
                                        </VStack>
                                        <VStack key={`mon-an-${index}`} bg="gray.100" p={2} h="100%" borderRightWidth={3} borderColor="gray.300" minW={100}>
                                            <Text fontSize={14} fontWeight="bold">Món ăn</Text>
                                            {monAnList.map((monAn, monAnIndex) => (
                                                <Flex key={monAnIndex}>
                                                    <Text fontSize={14}>{monAn}</Text>
                                                </Flex>
                                                
                                            ))}
                                        </VStack>
                                    </>
                                )
                            })
                        }
                        {
                            NGAY_AN_BY_CLIENTS[selectedClient].map((thu, index) => (
                                <VStack key={index} bg="gray.100" p={2} h="100%" borderRightWidth={3} borderColor="gray.300" minW={100}>
                                    <VStack>
                                        <Text fontSize={14} fontWeight="bold">{thu}</Text>
                                        <Text fontSize={14} fontWeight="bold">{`${moment(fromDayOfWeek).add(index, 'days').format("DD/MM/YYYY")}`}</Text>
                                    </VStack>
                                     
                                    {
                                        Object.keys(CO_CAU_SUAT_AN_SAMPLE[selectedClient]).map((ca, caIndex) => {
                                            const monAnList = CO_CAU_SUAT_AN_SAMPLE[selectedClient][ca];

                                            return monAnList.map((monAn, monAnIndex) => {
                                                const findMenuData = MENU_DATA_WEEKS[selectedClient]?.[currentWeekIdx];
                                                if(findMenuData && findMenuData[thu] && findMenuData[thu].length > 0) {
                                                    return (
                                                        <Text color="red.500">{findMenuData[thu][monAnIndex]}</Text>
                                                    );
                                                }
                                                const isSelectedMonAn = selectedMonAnInMenu && selectedMonAnInMenu.tuan === `Tuần ${currentWeekIdx}` && 
                                                                        selectedMonAnInMenu.thu === thu && 
                                                                        selectedMonAnInMenu.ca === ca && selectedMonAnInMenu.monAnIndex === monAnIndex;
                                                const findFillMonAnInMenu = 
                                                    fillMonAnInMenu && fillMonAnInMenu.find(item => 
                                                        item.tuan === `Tuần ${currentWeekIdx}` && item.thu === thu && item.ca === ca && item.monAnIndex === monAnIndex
                                                    );
                                                // console.log("--- findFillMonAnInMenu", findFillMonAnInMenu);
                                                const fillMonAnName = findFillMonAnInMenu ? findFillMonAnInMenu.monAnName : null;
                                                const fillMonAnCost = findFillMonAnInMenu ? findFillMonAnInMenu.monAnCost : null;

                                                return (
                                                    <VStack key={`${thu}-${ca}-${monAnIndex}`} minH={50}>
                                                        <Button key={monAnIndex} size="sm" colorScheme={ isSelectedMonAn ? "orange" : ( fillMonAnName ? "blue" : "red" ) }
                                                            onClick={() => {
                                                                setSelectedMonAnInMenu({
                                                                    tuan: `Tuần ${currentWeekIdx}`,
                                                                    thu: thu,
                                                                    ca,
                                                                    monAnIndex
                                                                });
                                                            }}
                                                        >
                                                            { isSelectedMonAn ? (fillMonAnName ? fillMonAnName : "Đang chờ chọn") : (fillMonAnName ? fillMonAnName : "Chưa set món") }
                                                            { fillMonAnCost && ` (${fillMonAnCost?.toLocaleString()} VND)`}
                                                        </Button>
                                                    </VStack>
                                                );
                                            });
                                        })
                                    }
                                    <Text fontSize={16} fontWeight="bold">
                                        Chi phí: {countTotalCostByThu(thu)?.toLocaleString()} VND
                                    </Text>
                                    <Text fontSize={16} fontWeight="bold" color="red.500">
                                        Tỷ trọng: {_.round((countTotalCostByThu(thu)/donGiaSanPhams[0]?.product_price || 0) * 100)}%
                                    </Text>
                                    {
                                        _.round((countTotalCostByThu(thu)/donGiaSanPhams[0]?.product_price || 0) * 100) > 50 && (
                                            <Alert status="error" mt={2}>
                                                <AlertIcon />
                                                <AlertDescription>
                                                    Chi phí món mặn ngày {thu} <br/> vượt quá 50% giá sản phẩm <br/> ({donGiaSanPhams[0]?.product_price?.toLocaleString()} VND)
                                                </AlertDescription>
                                            </Alert>
                                        )
                                    }
                                </VStack>
                            ))
                        }
                    </Flex>
                </Flex>
                <Center gap={2} mt={4}>
                    <Button colorScheme="gray" onClick={() => {
                        setCurrentWeekIdx(currentWeekIdx - 1);
                        setFromDayOfWeek(startOfWeek(moment(fromDayOfWeek).subtract(7, 'days').toDate(), { weekStartsOn: 1 }));
                        setEndDayOfWeek(endOfWeek(moment(endDayOfWeek).subtract(7, 'days').toDate(), { weekStartsOn: 1 }));
                    }}>
                        <Icon as={MdArrowBack} mr={2}/>{`Tuần ${currentWeekIdx - 1}`}
                    </Button>
                    <Text fontSize={16} fontWeight={600}>Tuần {currentWeekIdx}</Text>
                     <Button colorScheme="gray" onClick={() => {
                        setCurrentWeekIdx(currentWeekIdx + 1);
                        setFromDayOfWeek(startOfWeek(moment(fromDayOfWeek).add(7, 'days').toDate(), { weekStartsOn: 1 }));
                        setEndDayOfWeek(endOfWeek(moment(endDayOfWeek).add(7, 'days').toDate(), { weekStartsOn: 1 }));
                    }}>
                        <Icon as={MdArrowForward} mr={2}/>{`Tuần ${currentWeekIdx + 1}`}
                    </Button>
                </Center>
            </Flex>
        )
    }

    const DanhMucMonAnComponent = () => {
        const groupByProtein = _.groupBy(danhMucMonAns, "protein");
        const groupByPhuongPhap = _.groupBy(danhMucMonAns, "phuongPhapCheBien");

        return (
            <Flex flexDirection="column" gap={2} p={4} bg="white" borderWidth={1} borderColor="gray.300" borderRadius={8}>
                <Flex flexDirection="column" gap={2}>
                    <Text fontSize={16} fontWeight={600}>
                        Danh mục món ăn (
                            TC1: "Tính độ gần nhất", 
                            TC2: "Tính độ đa dạng protein", 
                            TC3: "Tính theo phương pháp chế biến", 
                            TC4: "Tính theo mức độ yêu thích"
                        )
                    </Text>
                    <Flex flexDirection="row" flexWrap="wrap" minH={500}>
                        {
                            Object.keys(groupByProtein).map((protein, index) => {
                                const findMonAnByProtein = groupByProtein[protein];
                                const findMonAnByPhuongPhap = _.groupBy(findMonAnByProtein, "phuongPhapCheBien");

                                return (
                                    <VStack key={index} bg="gray.100" p={2} borderRightWidth={3} borderColor="gray.300" minW={300}>
                                        <Text fontWeight="bold" fontSize={14} bg="green.300">{protein}</Text>
                                        {
                                            Object.keys(findMonAnByPhuongPhap).map((phuongPhap, phuongPhapIndex) => {
                                                const findMonAnByPhuongPhapList = findMonAnByPhuongPhap[phuongPhap];

                                                return (
                                                    <VStack key={phuongPhapIndex} bg="gray.200" p={2} w="100%" borderRightWidth={3} borderColor="gray.300">
                                                        <Text fontWeight="bold" fontSize={14}>{phuongPhap}</Text>
                                                        {
                                                            findMonAnByPhuongPhapList.map((monAn, monAnIndex) => {
                                                                const isMonAnLoaiTru = monAnTheoMuaLoaiTrus.find(item => item.food_name === monAn.name);
                                                                const isMonAnKhuyenKhich = monAnTheoMuaKhuyenKhichs.find(item => item.food_name === monAn.name);
                                                                // *** 1 - Tính theo độ gần nhất, cách 1 tuần: 1 điểm, cách 2 tuần: 3 điểm, cách 3 tuần: 5 điểm, cách 4 tuần: 7 điểm, cách từ 5 tuần: 9 điểm
                                                                // *** 2 - Tính theo độ đa dạng protein: 1 điểm cho mỗi protein khác nhau trong tuần, tối đa 5 điểm
                                                                // *** 3 - Tính theo phuongPhapCheBien chế biến: 1 điểm cho mỗi phuongPhapCheBien chế biến khác nhau trong tuần, tối đa 5 điểm
                                                                // *** 4 - Tính theo mức độ yêu thích: 1 điểm cho mỗi món ăn được yêu thích trong tuần, tối đa 5 điểm
                                                                const { point: TC1Point, weekAppearances: TC1WeekAppearances } = countPointForTC1(monAn.name);
                                                                const { point: TC2Point } = countPointForTC2(protein);
                                                                const { point: TC3Point } = countPointForTC3(phuongPhap);
                                                                const TC4Point = 0; // Placeholder for TC4 calculation, as the logic is not provided in the code snippet
                                                                const totalPoint = 
                                                                    (TC1Point * (cauHinhTinhDiems.tc1_diem_trong_so/100 || 0)) + 
                                                                    (TC2Point * (cauHinhTinhDiems.tc2_diem_trong_so/100 || 0)) + 
                                                                    (TC3Point * (cauHinhTinhDiems.tc3_diem_trong_so/100 || 0)) + 
                                                                    (TC4Point * (cauHinhTinhDiems.tc4_diem_trong_so/100 || 0));
                                                                // const monAnCost = fetchPriceByMonAn(monAn.name);
                                                                // console.log("--- monAnCost", monAn.name, monAnCost);
                                                                return (
                                                                    <HStack key={monAnIndex} minH={100}>
                                                                        <VStack alignItems="center" justifyContent="center" minW={100} bg="gray.300" p={2}
                                                                            bgColor={isMonAnLoaiTru ? "red.500" : (isMonAnKhuyenKhich ? "green.500" : "")}
                                                                        >
                                                                            <VStack w={100}>
                                                                                <Text fontSize={14}>{monAn.name}</Text>
                                                                                <Text fontSize={14}>{`(${TC1WeekAppearances})`}</Text>
                                                                            </VStack>
                                                                           
                                                                            <IconButton
                                                                                size="xs"
                                                                                title='Thêm'
                                                                                colorScheme="orange"
                                                                                icon={<MdAdd />}
                                                                                onClick={() => {
                                                                                    const { thu, ca, monAnIndex } = selectedMonAnInMenu || {};
                                                                                    const findMonAnInMenu = 
                                                                                        fillMonAnInMenu.find(item => 
                                                                                            item.tuan === `Tuần ${currentWeekIdx}` && item.thu === thu && 
                                                                                            item.ca === ca && item.monAnIndex === monAnIndex
                                                                                        );

                                                                                    if(findMonAnInMenu) {
                                                                                        findMonAnInMenu.monAnName = monAn.name;
                                                                                        findMonAnInMenu.protein = protein;
                                                                                        findMonAnInMenu.phuongPhapCheBien = phuongPhap;
                                                                                        findMonAnInMenu.monAnCost = monAn.monAnCost || 0;
                                                                                        setFillMonAnInMenu([...fillMonAnInMenu.filter(item => item.tuan !== `Tuần ${currentWeekIdx}` || item.thu !== thu || item.ca !== ca || item.monAnIndex !== monAnIndex), findMonAnInMenu]);
                                                                                    } else {
                                                                                        setFillMonAnInMenu([
                                                                                            ...fillMonAnInMenu,
                                                                                            {
                                                                                                tuan: `Tuần ${currentWeekIdx}`,
                                                                                                thu: thu,
                                                                                                ngay: moment(fromDayOfWeek).add(NGAY_AN_BY_CLIENTS[selectedClient].indexOf(thu), 'days').toDate(),
                                                                                                ca: ca,
                                                                                                monAnIndex: monAnIndex,
                                                                                                monAnName: monAn.name,
                                                                                                protein,
                                                                                                phuongPhapCheBien: phuongPhap,
                                                                                                monAnCost: monAn.monAnCost || 0
                                                                                            }
                                                                                        ]);
                                                                                    }

                                                                                    checkTrungPhuongPhapCheBienXNgay(
                                                                                        `Tuần ${currentWeekIdx}`, 
                                                                                        moment(fromDayOfWeek).add(NGAY_AN_BY_CLIENTS[selectedClient].indexOf(thu), 'days').toDate(),
                                                                                        monAn.name, 
                                                                                        phuongPhap
                                                                                    );

                                                                                    checkPhoiHopCombo(
                                                                                        thu, 
                                                                                        ca
                                                                                    );
                                                                                }}
                                                                            />
                                                                        </VStack>
                                                                        
                                                                        <VStack h="100%" p={2} borderWidth={1} borderColor="gray.300" borderRadius={4}>
                                                                            <HStack>
                                                                                <VStack>
                                                                                    <Text fontSize={14}>TC1 ({cauHinhTinhDiems.tc1_diem_trong_so}%)</Text>
                                                                                    <Text fontSize={14}>{TC1Point}</Text>
                                                                                </VStack>
                                                                                <VStack>
                                                                                    <Text fontSize={14}>TC2 ({cauHinhTinhDiems.tc2_diem_trong_so}%)</Text>
                                                                                    <Text fontSize={14}>{TC2Point || 0}</Text>
                                                                                </VStack>
                                                                                <VStack>
                                                                                    <Text fontSize={14}>TC3 ({cauHinhTinhDiems.tc3_diem_trong_so}%)</Text>
                                                                                    <Text fontSize={14}>{TC3Point || 0}</Text>
                                                                                </VStack>
                                                                                <VStack>
                                                                                    <Text fontSize={14}>TC4 ({cauHinhTinhDiems.tc4_diem_trong_so}%)</Text>
                                                                                    <Text fontSize={14}>{TC4Point || 0}</Text>
                                                                                </VStack>
                                                                                <VStack bg="orange.100" p={2} borderRadius={4}>
                                                                                    <Text fontSize={14}>Tổng điểm</Text>
                                                                                    <Text fontSize={14}>{Math.round(totalPoint || 0)}</Text>
                                                                                </VStack>
                                                                            </HStack>
                                                                            <HStack justifyContent="flex-end" w="100%">
                                                                                <VStack>
                                                                                    {/* <Text fontSize={14} color="red.500">
                                                                                        Giá cost: <strong><FormattedNumber value={monAn?.monAnCost || 0} /> VND</strong>
                                                                                    </Text> */}
                                                                                    <HStack>
                                                                                        <VStack>
                                                                                            <Text fontWeight="bold">Nguyên liệu</Text>
                                                                                            <Text>{monAn.bomMonAns[0].NVL1}</Text>
                                                                                            <Text>{monAn.bomMonAns[0].NVL2}</Text>
                                                                                            <Text>{monAn.bomMonAns[0].NVL3}</Text>
                                                                                            <Text>{monAn.bomMonAns[0].NVL4}</Text>
                                                                                            <Text>{monAn.bomMonAns[0].NVL5}</Text>
                                                                                            <Text>{monAn.bomMonAns[0].NVL6}</Text>
                                                                                            <Text>{monAn.bomMonAns[0].NVL7}</Text>
                                                                                        </VStack>
                                                                                        <VStack>
                                                                                            <Text fontWeight="bold">Định mức</Text>
                                                                                            <Text>{monAn.bomMonAns[0].NVL1_DM}{monAn.bomMonAns[0].NVL1_DVT}</Text>
                                                                                            <Text>{monAn.bomMonAns[0].NVL2_DM}{monAn.bomMonAns[0].NVL2_DVT}</Text>
                                                                                            <Text>{monAn.bomMonAns[0].NVL3_DM}{monAn.bomMonAns[0].NVL3_DVT}</Text>
                                                                                            <Text>{monAn.bomMonAns[0].NVL4_DM}{monAn.bomMonAns[0].NVL4_DVT}</Text>
                                                                                            <Text>{monAn.bomMonAns[0].NVL5_DM}{monAn.bomMonAns[0].NVL5_DVT}</Text>
                                                                                            <Text>{monAn.bomMonAns[0].NVL6_DM}{monAn.bomMonAns[0].NVL6_DVT}</Text>
                                                                                            <Text>{monAn.bomMonAns[0].NVL7_DM}</Text>
                                                                                        </VStack>
                                                                                        <VStack>
                                                                                            <Text fontWeight="bold">Đơn giá</Text>
                                                                                            <Text>{monAn.bomMonAns[0].nvl1_price}</Text>
                                                                                            <Text>{monAn.bomMonAns[0].nvl2_price}</Text>
                                                                                            <Text>{monAn.bomMonAns[0].nvl3_price}</Text>
                                                                                            <Text>{monAn.bomMonAns[0].nvl4_price}</Text>
                                                                                            <Text>{monAn.bomMonAns[0].nvl5_price}</Text>
                                                                                            <Text>{monAn.bomMonAns[0].nvl6_price}</Text>
                                                                                            <Text>{monAn.bomMonAns[0].nvl7_price}</Text>
                                                                                        </VStack>
                                                                                        <VStack>
                                                                                            <Text fontWeight="bold">Thành tiền</Text>
                                                                                            { monAn.bomMonAns[0].NVL1_DM && <Text>{monAn.bomMonAns[0].nvl1_price * (monAn.bomMonAns[0].NVL1_DM || 0)} VND</Text> }
                                                                                            { monAn.bomMonAns[0].NVL2_DM && <Text>{monAn.bomMonAns[0].nvl2_price * (monAn.bomMonAns[0].NVL2_DM || 0)} VND</Text> }
                                                                                            { monAn.bomMonAns[0].NVL3_DM && <Text>{monAn.bomMonAns[0].nvl3_price * (monAn.bomMonAns[0].NVL3_DM || 0)} VND</Text> }
                                                                                            { monAn.bomMonAns[0].NVL4_DM && <Text>{monAn.bomMonAns[0].nvl4_price * (monAn.bomMonAns[0].NVL4_DM || 0)} VND</Text> }
                                                                                            { monAn.bomMonAns[0].NVL5_DM && <Text>{monAn.bomMonAns[0].nvl5_price * (monAn.bomMonAns[0].NVL5_DM || 0)} VND</Text> }
                                                                                            { monAn.bomMonAns[0].NVL6_DM && <Text>{monAn.bomMonAns[0].nvl6_price * (monAn.bomMonAns[0].NVL6_DM || 0)} VND</Text> }
                                                                                            { monAn.bomMonAns[0].NVL7_DM && <Text>{monAn.bomMonAns[0].nvl7_price * (monAn.bomMonAns[0].NVL7_DM || 0)}</Text> }
                                                                                            <Text fontWeight="bold">
                                                                                                {
                                                                                                    (monAn.bomMonAns[0].nvl1_price || 0) * (monAn.bomMonAns[0].NVL1_DM || 0) +
                                                                                                    (monAn.bomMonAns[0].nvl2_price || 0) * (monAn.bomMonAns[0].NVL2_DM || 0) +
                                                                                                    (monAn.bomMonAns[0].nvl3_price || 0) * (monAn.bomMonAns[0].NVL3_DM || 0) +
                                                                                                    (monAn.bomMonAns[0].nvl4_price || 0) * (monAn.bomMonAns[0].NVL4_DM || 0) +
                                                                                                    (monAn.bomMonAns[0].nvl5_price || 0) * (monAn.bomMonAns[0].NVL5_DM || 0) +
                                                                                                    (monAn.bomMonAns[0].nvl6_price || 0) * (monAn.bomMonAns[0].NVL6_DM || 0) +
                                                                                                    (monAn.bomMonAns[0].nvl7_price || 0) * (monAn.bomMonAns[0].NVL7_DM || 0)
                                                                                                } VND
                                                                                            </Text>
                                                                                        </VStack>
                                                                                    </HStack>
                                                                                </VStack>                                                                       
                                                                            </HStack>
                                                                        </VStack>
                                                                    </HStack>
                                                            )})
                                                        }
                                                    </VStack>
                                                );
                                            })
                                        }
                                    </VStack>
                                )
                            })
                        }
                    </Flex>
                </Flex>
            </Flex>
        )
    }

    const countPointForTC1 = (monAn) => {
        let point = 0, weekAppearances = "";
        const menuTuan1 = Object.values(menuData4Weeks[currentWeekIdx - 1] || {}).flat();
        const menuTuan2 = Object.values(menuData4Weeks[currentWeekIdx - 2] || {}).flat();
        const menuTuan3 = Object.values(menuData4Weeks[currentWeekIdx - 3] || {}).flat();
        const menuTuan4 = Object.values(menuData4Weeks[currentWeekIdx - 4] || {}).flat();

        const weeks = [menuTuan1, menuTuan2, menuTuan3, menuTuan4];

        for (let i = 0; i < weeks.length; i++) {
            if (weeks[i].includes(monAn)) {
                switch (i) {
                    case 0:
                        point = 2; // cách 1 tuần: 2 điểm
                        break;
                    case 1:
                        point = 4; // cách 2 tuần: 4 điểm
                        break;
                    case 2:
                        point = 6; // cách 3 tuần: 6 điểm
                        break;
                    case 3:
                        point = 8; // cách 4 tuần: 8 điểm
                        break;
                    default:
                        break;
                }
                break; // Exit the loop after finding the first occurrence
            }
        }

        for (let i = 0; i < weeks.length; i++) {
            if (weeks[i].includes(monAn)) {
                weekAppearances += `Tuần ${currentWeekIdx - (i + 1)}, `;
            }
        }
        return { point, weekAppearances };
    }

    const countPointForTC2 = (protein) => {
        let point = 10;
        // Tính theo độ đa dạng protein
        // Chưa xuất hiện: 10 điểm, 1 lần: 5 điểm, 2 lần: 0 điểm
        const totalProteinAppearances = fillMonAnInMenu.filter(item => item.protein === protein).length;
        Object.keys(_.groupBy(fillMonAnInMenu, "protein")).forEach(p => {
            if(p === protein) {
                point = totalProteinAppearances === 0 ? 10 : (totalProteinAppearances === 1 ? 5 : 0);
            }
        });

        return { point };
    }

    const countPointForTC3 = (phuongPhapCheBien) => {
        let point = 10;
        // Tính theo độ đa dạng phương pháp chế biến
        // Chưa xuất hiện: 10 điểm, 1 lần: 6 điểm, 2 lần: 4 điểm, 3 lần: 2 điểm, 4 lần: 0 điểm
        const totalPPCBAppearances = fillMonAnInMenu.filter(item => item.phuongPhapCheBien === phuongPhapCheBien).length;
        Object.keys(_.groupBy(fillMonAnInMenu, "phuongPhapCheBien")).forEach(ppcb => {
            if(ppcb === phuongPhapCheBien) {
                point = totalPPCBAppearances === 0 ? 10 : (totalPPCBAppearances === 1 ? 6 : (totalPPCBAppearances === 2 ? 4 : (totalPPCBAppearances === 3 ? 2 : 0)));
            }
        });

        return { point };
    }


    return (
        <Flex flexDirection="column" mt={{ base: 8, md: 0, lg: 0 }}>
            <Flex flexDirection="column" mx={4} my={4}>
                {/* <WeekPicker /> */}
                <MenuDataComponent />
                <Box my={4}>
                    <Alert status="error" borderRadius={4}>
                        <AlertIcon />
                        <AlertDescription>{errors && Object.values(errors).length > 0 ? Object.values(errors).join(', ') : ''}</AlertDescription>
                    </Alert>
                </Box>
                <DanhMucMonAnComponent />
            </Flex>
        </Flex>
    )
}

export default Dashboard;