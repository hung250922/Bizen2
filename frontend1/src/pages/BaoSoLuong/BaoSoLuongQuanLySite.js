import React, {useState, useEffect, useRef, useMemo} from 'react';
import { 
    Flex, VStack, Center, CircularProgress, CircularProgressLabel, Text, Button, Icon, useToast,
    HStack, Alert, AlertIcon, AlertDescription,
    Heading, Tabs, TabList, TabPanels, Tab, TabPanel, Select,
    Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, Input, Image,
    FormControl, FormLabel
} from '@chakra-ui/react';
import { Row, Col, Card, Statistic, Typography, Progress, Divider } from "antd";
import { Form, Field } from 'react-final-form';
import { useCookies } from "react-cookie";
import axios from 'axios';
import {
    MdDownload,
    MdSearch,
    MdSend,
    MdCalendarToday,
    MdPeople,
    MdRestaurant
} from 'react-icons/md';
import { FormattedNumber, FormattedDate } from "react-intl";
import { useLocation, useNavigate } from "react-router-dom";
import DatePicker from 'react-date-picker';
import "react-date-picker/dist/DatePicker.css";
import 'react-calendar/dist/Calendar.css';
import { MultiSelect } from "react-multi-select-component";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import _, { get } from 'lodash';
import moment from 'moment';
import { sleep, confirmChoice } from '../../utils/helpers';
import httpClient from '../../services/http-client';
import { COMPANY_LOGO } from "../../constants";
const { Title } = Typography;
const intl = Intl.NumberFormat();

function BaoSoLuongQuanLySiteContainer({}) {
    const [cookies] = useCookies(["loginCookie"]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAllowAccessThisPage, setIsAllowAccessThisPage] = useState(true);
    const [clientDatas, setClientDatas] = useState([]);
    const [selectedClients, setSelectedClients] = useState([]);
    const [selectedFromDate, setSelectedFromDate] = useState(null);
    const [selectedToDate, setSelectedToDate] = useState(null);
    const [selectedTabIndex, setSelectedTabIndex] = useState(0);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [thucDonTuanDatas, setThucDonTuanDatas] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);

    const navigate = useNavigate();
    const toast = useToast();
    const mouted = useRef();
    const { search } = useLocation();
    const htmlDownloadRef = useRef();

    const clientOptions = useMemo(() => {
        return _.uniq(clientDatas)
            .slice()
            .sort((a, b) => a.localeCompare(b))
            .map(client => ({
                label: client,
                value: client
            }));
    }, [clientDatas]);

    console.log("---- ", cookies.loginCookie);

    const DEMO_MODE = true;

    useEffect(() => {
        if (!mouted.current) {
            if (
                DEMO_MODE ||
                cookies.loginCookie?.username === "admin" ||
                cookies.loginCookie?.scope === "admin" ||
                cookies.loginCookie?.scope === "bao_so_luong_quan_ly_site" ||
                cookies.loginCookie?.scope === "all"
            ) {
                setIsAllowAccessThisPage(true);
                loadInitDatas();
            } else {
                setIsAllowAccessThisPage(false);
                console.log("--- not authorized to access dashboard page");
            }
            mouted.current = true;
        }
    }, []);

    const loadInitDatas = async () => {
        setIsLoading(true);
        try {
            // const res = await httpClient.get(`/larksuite/init-datas`);
            const res = await httpClient.post(`/larksuite/list_client`);
            console.log("--- loadInitDatas res:", res.data);

            if (!res.data.error) {
                setClientDatas(res.data.data || []);
                setIsLoading(false);
            } else {
                setErrorMessage("Lỗi:" + JSON.stringify(res.data?.error?.message));
                setIsLoading(false);
            }
        } catch (error) {
            console.error("loadInitDatas error:", error);
            setErrorMessage("Lỗi:" + JSON.stringify(
                error?.response?.data?.error?.message ||
                error?.message ||
                "Không thể tải danh sách khách hàng"
            ));
            setIsLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!selectedClients.length) {
            alert("Vui lòng chọn ít nhất một khách hàng!");
            return;
        } else if (!selectedFromDate) {
            alert("Vui lòng chọn ngày bắt đầu!");
            return;
        } else if (!selectedToDate) {
            alert("Vui lòng chọn ngày kết thúc!");
            return;
        }

        setIsLoading(true);
        await sleep(250);

        try {
            const results = await Promise.all(
                selectedClients.map(client =>
                    getThucDonTuan({
                        client_code: client.value,
                        fromDate: selectedFromDate,
                        toDate: selectedToDate
                    })
                )
            );

            setThucDonTuanDatas(results.flat());
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (values, form) => {
        confirmChoice("Bạn có đồng ý gửi báo số lượng không?", async () => {
            console.log("---- onSubmit values", values);
            // const saveDatasLarkBase = [];
            const dataMap = {};

            // 1 - lấy tổng số người ăn đăng ký theo ca
            Object.keys(values).forEach(key => {
                if (key.includes("tong_so_nguoi_an")) {
                    const firstKey = key.split("#")[0];
                    const [Ngay, KhachHang, SiteAn, Ca] = firstKey.split("!");

                    if (!dataMap[firstKey]) {
                        dataMap[firstKey] = {
                            "Ngày": Number(Ngay),
                            "Khách hàng": KhachHang,
                            "Site ăn": SiteAn,
                            "Ca": Ca,
                            "Tổng số người ăn": Number(values[key])
                        };
                    } else {
                        dataMap[firstKey]["Tổng số người ăn"] = Number(values[key]);
                    }
                }
            });

            //2 - lấy số lượng đăng ký theo cơ cấu suất ăn
            Object.keys(values).forEach(key => {
                if (key.includes("so_luong_dang_ky_theo_co_cau_suat_an")) {
                    const firstKey = key.split("#")[0];
                    const secondKey = key.split("#")[1];
                    const [Ngay, KhachHang, SiteAn, Ca] = firstKey.split("!");
                    const [CoCauSuatAn] = secondKey.split("!");

                    if (!dataMap[firstKey]) {
                        dataMap[firstKey] = {
                            "Ngày": Number(Ngay),
                            "Khách hàng": KhachHang,
                            "Site ăn": SiteAn,
                            "Ca": Ca,
                            "Cơ cấu suất ăn": CoCauSuatAn,
                            ["Số lượng đăng ký " + CoCauSuatAn]: Number(values[key])
                        };
                    } else {
                        dataMap[firstKey]["Số lượng đăng ký " + CoCauSuatAn] = Number(values[key]);
                        dataMap[firstKey]["Cơ cấu suất ăn"] = CoCauSuatAn;
                    }
                }
            });

            //3 - lấy phần trăm số lượng
            Object.keys(values).forEach(key => {
                if (key.includes("phan_tram_so_luong")) {
                    const firstKey = key.split("#")[0];
                    const secondKey = key.split("#")[1];
                    const [Ngay, KhachHang, SiteAn, Ca] = firstKey.split("!");
                    const [MonAn] = secondKey.split("!");

                    if (!dataMap[firstKey]) {
                        dataMap[firstKey] = {
                            "Ngày": Number(Ngay),
                            "Khách hàng": KhachHang,
                            "Site ăn": SiteAn,
                            "Ca": Ca,
                            ["Món ăn 1"]: MonAn,
                            ["% số lượng món ăn 1"]: Number(values[key])
                        };
                    } else {
                        if (!dataMap[firstKey]["Món ăn 1"]) {
                            dataMap[firstKey]["Món ăn 1"] = MonAn;
                            dataMap[firstKey]["% số lượng món ăn 1"] = Number(values[key]);
                        } else if (!dataMap[firstKey]["Món ăn 2"]) {
                            dataMap[firstKey]["Món ăn 2"] = MonAn;
                            dataMap[firstKey]["% số lượng món ăn 2"] = Number(values[key]);
                        } else if (!dataMap[firstKey]["Món ăn 3"]) {
                            dataMap[firstKey]["Món ăn 3"] = MonAn;
                            dataMap[firstKey]["% số lượng món ăn 3"] = Number(values[key]);
                        } else if (!dataMap[firstKey]["Món ăn 4"]) {
                            dataMap[firstKey]["Món ăn 4"] = MonAn;
                            dataMap[firstKey]["% số lượng món ăn 4"] = Number(values[key]);
                        } else if (!dataMap[firstKey]["Món ăn 5"]) {
                            dataMap[firstKey]["Món ăn 5"] = MonAn;
                            dataMap[firstKey]["% số lượng món ăn 5"] = Number(values[key]);
                        }
                    }
                }
            });

            const saveDatasLarkBase = [];
            Object.values(dataMap).forEach(item => saveDatasLarkBase.push({ "fields": item }));

            console.log("---- saveDatasLarkBase", saveDatasLarkBase);

            const res = await httpClient.post(`/larksuite/bao_so_luong_quan_ly_site`, {
                data: saveDatasLarkBase
            });

            if (res.data?.error) {
                toast({
                    description: res.data?.error,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                    position: "bottom-right"
                });
                setIsLoading(false);
            } else {
                toast({
                    description: `Bạn đã thêm dữ liệu thành công!`,
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    position: "bottom-right"
                });
                setIsLoading(false);
                form.reset();
            }
        });
    };

    const getThucDonTuan = async ({ client_code, fromDate, toDate }) => {
        try {
            console.log("---- selectedFromDate", fromDate.getTime(), toDate.getTime());

            const res = await httpClient.post(`/larksuite/thuc_don_tuan`, {
                client_code,
                fromDate,
                toDate
            });

            console.log("--- getThucDonTuan res:", res.data);

            if (res.data.error) {
                console.log("Lỗi:" + JSON.stringify(res.data?.error?.message));
                setErrorMessage("Lỗi:" + JSON.stringify(res.data?.error?.message));
                return [];
            }

            const thucDonTuanDatasFilter = res.data?.data?.filter(
                item => item.Ngay >= fromDate.getTime() && item.Ngay <= toDate.getTime()
            ) || [];

            return thucDonTuanDatasFilter;
        } catch (error) {
            console.error("Error fetching sales data:", error);
            setErrorMessage("Lỗi:" + JSON.stringify(
                error?.response?.data?.error?.message ||
                error?.message ||
                "Không thể tải dữ liệu thực đơn"
            ));
            return [];
        }
    };

    const renderNumberField = (fieldName, label, type = "people") => {
        const config = {
            people: { icon: MdPeople, bg: "#eaf7f7", color: "#45999a" },
            structure: { icon: MdRestaurant, bg: "#fff3eb", color: "#d68d61" },
            food: { icon: MdRestaurant, bg: "#f3effc", color: "#8067b8" }
        };
        const current = config[type] || config.people;

        return (
            <Field name={fieldName}>
                {({ input, meta }) => (
                    <div className="group w-full rounded-[12px] border border-[#e4ebed] bg-[#fbfcfc] p-2.5 transition-all duration-200 hover:border-[#b8d9d8] hover:bg-white hover:shadow-[0_4px_14px_rgba(49,112,115,.06)]">
                        <div className="mb-2 flex items-center gap-2">
                            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-[8px]" style={{ backgroundColor: current.bg, color: current.color }}>
                                <Icon as={current.icon} boxSize={4} />
                            </div>
                            <span className="min-w-0 flex-1 break-words text-[10px] font-extrabold leading-4 text-[#50656c]" title={label}>{label}</span>
                        </div>

                        <div className="flex overflow-hidden rounded-[9px] border border-[#d4e4e5] bg-white">
                            <button type="button" className="flex h-9 w-9 shrink-0 items-center justify-center border-r border-[#d4e4e5] text-[#829297] transition hover:bg-[#eef8f7] hover:text-[#318d89]" onClick={() => input.onChange(Math.max(0, Number(input.value || 0) - 1))}>
                                <span className="text-[16px] font-medium leading-none">−</span>
                            </button>

                            <input
                                {...input}
                                type="number"
                                min={0}
                                value={input.value ?? ''}
                                placeholder="0"
                                className="h-9 min-w-0 flex-1 bg-white px-2 text-center text-[12px] font-bold text-[#2d4249] outline-none"
                                onWheel={e => e.currentTarget.blur()}
                                onKeyDown={e => {
                                    if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault();
                                }}
                            />

                            <button type="button" className="flex h-9 w-9 shrink-0 items-center justify-center border-l border-[#d4e4e5] text-[#829297] transition hover:bg-[#eef8f7] hover:text-[#318d89]" onClick={() => input.onChange(Number(input.value || 0) + 1)}>
                                <span className="text-[16px] font-medium leading-none">+</span>
                            </button>
                        </div>
                    </div>
                )}
            </Field>
        );
    };

    const BaoSoLuongComponent = ({ thu }) => {
        const thucDonTuanDataFilterByThu = thucDonTuanDatas.filter(item => item.Thu === thu);
        const uniqueKhachHangArray = _.uniq(
            thucDonTuanDataFilterByThu
                .map(item => item.KhachHang)
                .filter(Boolean)
        );

        const companySectionComponents = [];

        for (let h = 0; h < uniqueKhachHangArray.length; h++) {
            const khachhang = uniqueKhachHangArray[h];

            const dataByKhachHang = thucDonTuanDataFilterByThu.filter(
                item => item.KhachHang === khachhang
            );
            
            const caArray = dataByKhachHang.map(item => ({ "Ca": item.Ca }));
            const uniqueCaArray = _.uniqBy(caArray, item => `${item.Ca}`);
            const tabPanelComponents = [];

            for (let i = 0; i < uniqueCaArray.length; i++) {
                const { Ca } = uniqueCaArray[i];
                const datas = dataByKhachHang.filter(item => item.Ca === Ca);
                const ngay = datas[0]?.Ngay || "";
                const siteArray = datas.map(item => item.SiteAn);
                const uniqueSiteArray = _.uniq(siteArray);

                const tpTongSoNguoiAnComponents = [];
                const tpSoLuongDangKyTheoCoCauSuatAnComponents = [];
                const tpPhanTramSoLuongComponents = [];

                for (let j = 0; j < uniqueSiteArray.length; j++) {
                    const site = uniqueSiteArray[j];
                    const siteArray = site.includes(",") ? site.split(",") : [site];

                    for (let k = 0; k < siteArray.length; k++) {
                        const site_k = siteArray[k].trim();

                        /*
                        * 1 - TỔNG SỐ NGƯỜI ĂN
                        */
                        tpTongSoNguoiAnComponents.push(
                            <React.Fragment key={`${ngay}!${khachhang}-${site_k}-${Ca}`}>
                                {renderNumberField(
                                    `${ngay}!${khachhang}!${site_k}!${Ca}#tong_so_nguoi_an`,
                                    `${Ca} - ${site_k}`,
                                    "people"
                                )}
                            </React.Fragment>
                        );

                        /*
                        * 2 - CƠ CẤU SUẤT ĂN
                        */
                        const cocauSuatAn = datas.filter(item =>
                            item.SiteAn.includes(site_k) &&
                            item.Ca === Ca &&
                            item.CoCauSuatAn &&
                            item.CoCauSuatAn !== "Suất rau xào/luộc" &&
                            item.CoCauSuatAn !== "Suất tráng miệng"
                        ).map(item => ({
                            "Ca": item.Ca,
                            "SiteAn": site_k,
                            "CoCauSuatAn": item.CoCauSuatAn
                        }));

                        const uniqueCoCauSuatAn = _.uniqBy(
                            cocauSuatAn,
                            item => `${item.CoCauSuatAn}`
                        );

                        for (let l = 0; l < uniqueCoCauSuatAn.length; l++) {
                            const { CoCauSuatAn } = uniqueCoCauSuatAn[l];

                            tpSoLuongDangKyTheoCoCauSuatAnComponents.push(
                                <React.Fragment key={`${ngay}!${khachhang}-${site_k}-${Ca}-${CoCauSuatAn}`}>
                                    {renderNumberField(
                                        `${ngay}!${khachhang}!${site_k}!${Ca}#${CoCauSuatAn}!so_luong_dang_ky_theo_co_cau_suat_an`,
                                        `${Ca} - ${site_k} - ${CoCauSuatAn}`,
                                        "structure"
                                    )}
                                </React.Fragment>
                            );
                        }

                        /*
                        * 3 - % SỐ LƯỢNG MÓN MẶN
                        */
                        const monAnSuatCom = datas.filter(item =>
                            item.SiteAn.includes(site_k) &&
                            item.Ca === Ca &&
                            item.CoCauSuatAn === "Suất cơm"
                        ).map(item => ({
                            "Ngay": item.Ngay,
                            "KhachHang": item.KhachHang,
                            "SiteAn": site_k,
                            "Ca": item.Ca,
                            "CoCauSuatAn": item.CoCauSuatAn,
                            "MonAn": item.MonAn
                        }));

                        const uniqueMonAnSuatCom = _.uniqBy(
                            monAnSuatCom,
                            item => `${item.Ngay}-${item.KhachHang}-${item.SiteAn}-${item.Ca}-${item.CoCauSuatAn}-${item.MonAn}`
                        );

                        for (let m = 0; m < uniqueMonAnSuatCom.length; m++) {
                            const { MonAn } = uniqueMonAnSuatCom[m];

                            if (!MonAn) continue;

                            tpPhanTramSoLuongComponents.push(
                                <React.Fragment key={`${ngay}!${khachhang}-${site_k}-${Ca}-${MonAn}`}>
                                    {renderNumberField(
                                        `${ngay}!${khachhang}!${site_k}!${Ca}#${MonAn}!phan_tram_so_luong`,
                                        `${Ca} - ${site_k} - ${MonAn}`,
                                        "food"
                                    )}
                                </React.Fragment>
                            );
                        }
                    }
                }

                tabPanelComponents.push(
                    <TabPanel key={`${ngay}!${khachhang}-${Ca}`} px={0} pt={3} pb={2}>
                        <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
                            <div className="overflow-hidden rounded-[15px] border border-[#dfe8ea] bg-white shadow-[0_4px_18px_rgba(37,79,84,.045)]">
                                <div className="flex items-center justify-between border-b border-[#e7edef] bg-[#f5f9fa] px-4 py-3">
                                    <div className="flex min-w-0 items-center gap-2">
                                        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-[8px] bg-[#eaf7f7] text-[#45999a]">
                                            <Icon as={MdPeople} boxSize={4} />
                                        </div>
                                        <Heading size="sm" fontSize="11px" fontWeight="800" color="#4e6269">
                                            Tổng số người ăn
                                        </Heading>
                                    </div>
                                    <span className="rounded-full bg-[#eef7f6] px-2 py-1 text-[8px] font-bold text-[#4c9895]">
                                        Người
                                    </span>
                                </div>
                                <div className="space-y-2 p-3">{tpTongSoNguoiAnComponents}</div>
                            </div>

                            <div className="overflow-hidden rounded-[15px] border border-[#dfe8ea] bg-white shadow-[0_4px_18px_rgba(37,79,84,.045)]">
                                <div className="flex items-center justify-between border-b border-[#e7edef] bg-[#f5f9fa] px-4 py-3">
                                    <div className="flex min-w-0 items-center gap-2">
                                        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-[8px] bg-[#fff3eb] text-[#d68d61]">
                                            <Icon as={MdRestaurant} boxSize={4} />
                                        </div>
                                        <Heading size="sm" fontSize="11px" fontWeight="800" color="#4e6269">
                                            Số lượng đăng ký theo cơ cấu suất ăn
                                        </Heading>
                                    </div>
                                    <span className="shrink-0 rounded-full bg-[#fff3eb] px-2 py-1 text-[8px] font-bold text-[#d68a5c]">
                                        Cơ cấu
                                    </span>
                                </div>
                                <div className="space-y-2 p-3">{tpSoLuongDangKyTheoCoCauSuatAnComponents}</div>
                            </div>

                            <div className="overflow-hidden rounded-[15px] border border-[#dfe8ea] bg-white shadow-[0_4px_18px_rgba(37,79,84,.045)]">
                                <div className="flex items-center justify-between border-b border-[#e7edef] bg-[#f5f9fa] px-4 py-3">
                                    <div className="flex min-w-0 items-center gap-2">
                                        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-[8px] bg-[#f3effc] text-[#8067b8]">
                                            <span className="text-[12px] font-extrabold">%</span>
                                        </div>
                                        <Heading size="sm" fontSize="11px" fontWeight="800" color="#4e6269">
                                            % số lượng món mặn (suất cơm)
                                        </Heading>
                                    </div>
                                    <span className="shrink-0 rounded-full bg-[#f3effc] px-2 py-1 text-[8px] font-bold text-[#8067b8]">
                                        Suất cơm
                                    </span>
                                </div>
                                <div className="space-y-2 p-3">{tpPhanTramSoLuongComponents}</div>
                            </div>
                        </div>
                    </TabPanel>
                );
            }

            companySectionComponents.push(
                <section
                    key={`${thu}-${khachhang}`}
                    className="mb-3 overflow-hidden rounded-[15px] border border-[#dfe8ea] bg-white shadow-[0_3px_14px_rgba(37,79,84,.035)]"
                >
                    <div className="border-b border-[#e8edef] bg-[#f6fafb] px-4 py-3">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[11px] bg-[#edf7f7] text-[#42999a]">
                                    <Icon as={MdCalendarToday} boxSize={5} />
                                </div>

                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <strong className="text-[14px] font-extrabold text-[#24363d]">
                                            {khachhang}
                                        </strong>

                                        {uniqueCaArray.length > 0 && (
                                            <span className="rounded-full bg-[#e8f5f4] px-2 py-0.5 text-[8px] font-extrabold text-[#438f8e]">
                                                {uniqueCaArray.length} ca
                                            </span>
                                        )}
                                    </div>

                                    <p className="mt-1 text-[10px] text-[#88979c]">
                                        {dataByKhachHang[0]?.Ngay
                                            ? moment(dataByKhachHang[0]?.Ngay).format("DD/MM/YYYY")
                                            : "Không có thực đơn"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Tabs variant="unstyled" p={0}>
                        <div className="border-b border-[#e8edef] bg-white px-3 pt-3">
                            <TabList display="flex" flexWrap="wrap" gap={2}>
                                {uniqueCaArray.map((item, idx) => (
                                    <Tab
                                        key={idx}
                                        textTransform="uppercase"
                                        border="1px solid"
                                        borderColor="#dfe8ea"
                                        borderRadius="9px"
                                        bg="#f5f8f9"
                                        color="#718188"
                                        px={4}
                                        py={2}
                                        fontSize="10px"
                                        fontWeight="800"
                                        transition="all .18s ease"
                                        _hover={{
                                            bg: "#eef8f7",
                                            color: "#318d89",
                                            borderColor: "#b8d9d8"
                                        }}
                                        _selected={{
                                            bg: "#3f9898",
                                            color: "white",
                                            borderColor: "#3f9898",
                                            boxShadow: "0 4px 12px rgba(63,152,152,.16)"
                                        }}
                                    >
                                        {item?.["Ca"]}
                                    </Tab>
                                ))}
                            </TabList>
                        </div>

                        <div className="bg-[#f8fafb] px-3 pb-1">
                            <TabPanels>{tabPanelComponents}</TabPanels>
                        </div>
                    </Tabs>
                </section>
            );
        }

        return (
            <>
                {companySectionComponents}
            </>
        );
    };

    const BaoSoLuongQuanLySiteForm = ({ title }) => (
        <Form
            onSubmit={onSubmit}
            render={({ handleSubmit, form, submitting, pristine, valid, values }) => (
                <form onSubmit={handleSubmit}>
                    <section className="overflow-hidden rounded-[16px] border border-[#dfe8ea] bg-white shadow-[0_8px_30px_rgba(35,78,83,.05)]">
                        <div className="border-b border-[#e8edef] px-4 py-5 md:px-5">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[11px] bg-[#eaf7f7] text-[#3d9898]">
                                        <Icon as={MdPeople} boxSize={5} />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-[9px] font-extrabold uppercase tracking-[.14em] text-[#79a6aa]">
                                            BÁO CÁO
                                        </p>

                                        <h2 className="mt-0.5 truncate text-[18px] font-extrabold text-[#273c43]">
                                            {title}
                                        </h2>

                                        <p className="mt-1 text-[10px] text-[#89979c]">
                                            {thucDonTuanDatas.length
                                                ? `${thucDonTuanDatas.length} dòng thực đơn đã tải`
                                                : "Chưa có dữ liệu"}
                                        </p>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    isLoading={submitting}
                                    loadingText="Đang gửi..."
                                    isDisabled={isLoading || submitting || !thucDonTuanDatas.length}
                                    h="41px"
                                    px={5}
                                    borderRadius="10px"
                                    bg="#3f9898"
                                    color="white"
                                    fontSize="10px"
                                    fontWeight="800"
                                    leftIcon={<Icon as={MdSend} boxSize={4} />}
                                    _hover={{
                                        bg: "#327f80",
                                        transform: "translateY(-1px)"
                                    }}
                                    _active={{
                                        transform: "translateY(0)"
                                    }}
                                    transition="all .18s ease"
                                >
                                    Gửi Báo số lượng
                                </Button>
                            </div>
                        </div>

                        <div className="bg-[#f7fafb] p-3 md:p-4">
                            <BaoSoLuongComponent thu="Thứ 2"/>
                            <BaoSoLuongComponent thu="Thứ 3"/>
                            <BaoSoLuongComponent thu="Thứ 4"/>
                            <BaoSoLuongComponent thu="Thứ 5"/>
                            <BaoSoLuongComponent thu="Thứ 6"/>
                            <BaoSoLuongComponent thu="Thứ 7"/>
                            <BaoSoLuongComponent thu="Chủ Nhật"/>
                        </div>
                    </section>
                </form>
            )}
        />
    );

    if (!isAllowAccessThisPage) {
        return (
            <main className="box-border min-h-full w-full min-w-0 overflow-x-hidden bg-[#f5f8f9]">
                <div className="w-full p-3 md:p-4">
                    <Alert
                        status="error"
                        className="!rounded-[14px] !border !border-red-100 !bg-red-50"
                    >
                        <AlertIcon />
                        <AlertDescription className="!text-[11px]">
                            Bạn không có quyền truy cập trang này (vui lòng liên hệ admin).
                        </AlertDescription>
                    </Alert>
                </div>
            </main>
        );
    }

    const totalRows = thucDonTuanDatas.length;

    const activeDays = [
        "Thứ 2",
        "Thứ 3",
        "Thứ 4",
        "Thứ 5",
        "Thứ 6",
        "Thứ 7",
        "Chủ Nhật"
    ].filter(
        day => thucDonTuanDatas.some(item => item.Thu === day)
    ).length;

    return (
        <main className="box-border min-h-full w-full min-w-0 overflow-x-hidden bg-[#f5f8f9] text-[#263238]">
            <div className="w-full p-2 md:p-3">
                <section className="overflow-visible rounded-[16px] border border-[#dfe8ea] bg-white shadow-[0_7px_25px_rgba(35,78,83,.05)]">
                    <div className="border-b border-[#e8edef] px-4 py-4 md:px-5">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="grid h-9 w-9 place-items-center rounded-[9px] bg-[#eaf7f7] text-[#3d9898]">
                                    <Icon as={MdSearch} boxSize={4} />
                                </div>

                                <div>
                                    <h2 className="text-[12px] font-extrabold uppercase tracking-[.08em] text-[#465f66]">
                                        Bộ lọc tìm kiếm
                                    </h2>

                                    <p className="mt-0.5 text-[9px] text-[#89979c]">
                                        Chọn khách hàng và khoảng ngày cần báo số lượng.
                                    </p>
                                </div>
                            </div>

                            {selectedClients.length > 0 && (
                                <span className="w-fit max-w-full rounded-full bg-[#eef8f7] px-3 py-1.5 text-[9px] font-extrabold text-[#3f9090]">
                                    {selectedClients.map(item => item.label).join(", ")}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-2 xl:grid-cols-[1.35fr_1fr_1fr_auto] xl:items-end">
                        <div className="flex w-full flex-col gap-1.5">
                            <span className="text-[9px] font-extrabold uppercase tracking-[.06em] text-[#62767d]">
                                Chọn khách hàng
                            </span>

                            <MultiSelect
                                options={clientOptions}
                                value={selectedClients}
                                onChange={setSelectedClients}
                                labelledBy="Chọn khách hàng"
                                hasSelectAll={true}
                                disabled={isLoading}
                                closeOnChangedValue={false}
                                overrideStrings={{
                                    allItemsAreSelected: "Đã chọn tất cả",
                                    clearSearch: "Xóa tìm kiếm",
                                    noOptions: "Không có khách hàng",
                                    search: "Tìm khách hàng...",
                                    selectAll: "Chọn tất cả"
                                }}
                            />
                        </div>

                        <label className="flex w-full flex-col gap-1.5">
                            <span className="text-[9px] font-extrabold uppercase tracking-[.06em] text-[#62767d]">
                                Chọn từ ngày
                            </span>

                            <div className="relative">
                                <Icon
                                    as={MdCalendarToday}
                                    boxSize={4}
                                    className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[#819095]"
                                />

                                <Input
                                    type="date"
                                    value={
                                        selectedFromDate
                                            ? moment(selectedFromDate).format("YYYY-MM-DD")
                                            : ""
                                    }
                                    onChange={event => {
                                        const value = event.target.value;
                                        setSelectedFromDate(
                                            value
                                                ? new Date(`${value}T00:00:00`)
                                                : null
                                        );
                                    }}
                                    disabled={isLoading}
                                    h="42px"
                                    pl="40px"
                                    borderRadius="10px"
                                    borderColor="#d7e2e4"
                                    bg="white"
                                    fontSize="11px"
                                    color="#35484f"
                                    _hover={{
                                        borderColor: "#b8d9d8"
                                    }}
                                    _focus={{
                                        borderColor: "#63aead",
                                        boxShadow: "0 0 0 1px #63aead"
                                    }}
                                />
                            </div>
                        </label>

                        <label className="flex w-full flex-col gap-1.5">
                            <span className="text-[9px] font-extrabold uppercase tracking-[.06em] text-[#62767d]">
                                Chọn đến ngày
                            </span>

                            <div className="relative">
                                <Icon
                                    as={MdCalendarToday}
                                    boxSize={4}
                                    className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[#819095]"
                                />

                                <Input
                                    type="date"
                                    value={
                                        selectedToDate
                                            ? moment(selectedToDate).format("YYYY-MM-DD")
                                            : ""
                                    }
                                    onChange={event => {
                                        const value = event.target.value;
                                        setSelectedToDate(
                                            value
                                                ? new Date(`${value}T00:00:00`)
                                                : null
                                        );
                                    }}
                                    disabled={isLoading}
                                    h="42px"
                                    pl="40px"
                                    borderRadius="10px"
                                    borderColor="#d7e2e4"
                                    bg="white"
                                    fontSize="11px"
                                    color="#35484f"
                                    _hover={{
                                        borderColor: "#b8d9d8"
                                    }}
                                    _focus={{
                                        borderColor: "#63aead",
                                        boxShadow: "0 0 0 1px #63aead"
                                    }}
                                />
                            </div>
                        </label>

                        <Button
                            type="button"
                            onClick={handleSearch}
                            isLoading={isLoading}
                            loadingText="Đang tải..."
                            leftIcon={<Icon as={MdSearch} boxSize={4} />}
                            h="42px"
                            px={5}
                            borderRadius="10px"
                            bg="#3f9898"
                            color="white"
                            fontSize="10px"
                            fontWeight="800"
                            _hover={{
                                bg: "#327f80",
                                transform: "translateY(-1px)"
                            }}
                            _active={{
                                transform: "translateY(0)"
                            }}
                            transition="all .18s ease"
                        >
                            Tìm kiếm
                        </Button>
                    </div>

                    <div className="h-1 bg-gradient-to-r from-[#3f9898] via-[#5bb0ad] to-[#76c1bd]" />
                </section>

                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-[14px] border border-[#e0e8ea] bg-white p-3.5 shadow-[0_4px_18px_rgba(35,78,83,.04)]">
                        <div className="flex items-center gap-3">
                            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#eaf3ff] text-[#4b88d7]">
                                <Icon as={MdPeople} boxSize={5} />
                            </div>

                            <div className="min-w-0">
                                <span className="text-[9px] text-[#839196]">
                                    Khách hàng
                                </span>

                                <strong className="mt-1 block truncate text-[13px] text-[#2e444b]">
                                    {selectedClients.length > 0
                                        ? selectedClients.map(item => item.label).join(", ")
                                        : "Chưa chọn"}
                                </strong>

                                <span className="mt-0.5 block text-[8px] text-[#a0aaae]">
                                    Khách hàng đang báo cáo
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[14px] border border-[#e0e8ea] bg-white p-3.5 shadow-[0_4px_18px_rgba(35,78,83,.04)]">
                        <div className="flex items-center gap-3">
                            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#edf8ee] text-[#4e9a58]">
                                <Icon as={MdCalendarToday} boxSize={5} />
                            </div>

                            <div>
                                <span className="text-[9px] text-[#839196]">
                                    Khoảng ngày
                                </span>

                                <strong className="mt-1 block text-[13px] text-[#2e444b]">
                                    {selectedFromDate
                                        ? moment(selectedFromDate).format("DD/MM/YYYY")
                                        : "—"}
                                    {" → "}
                                    {selectedToDate
                                        ? moment(selectedToDate).format("DD/MM/YYYY")
                                        : "—"}
                                </strong>

                                <span className="mt-0.5 block text-[8px] text-[#a0aaae]">
                                    Thời gian báo cáo
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[14px] border border-[#e0e8ea] bg-white p-3.5 shadow-[0_4px_18px_rgba(35,78,83,.04)]">
                        <div className="flex items-center gap-3">
                            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#fff5e9] text-[#db9638]">
                                <Icon as={MdRestaurant} boxSize={5} />
                            </div>

                            <div>
                                <span className="text-[9px] text-[#839196]">
                                    Dữ liệu thực đơn
                                </span>

                                <strong className="mt-1 block text-xl font-extrabold text-[#2e444b]">
                                    {totalRows}
                                </strong>

                                <span className="mt-0.5 block text-[8px] text-[#a0aaae]">
                                    Tổng số dòng
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[14px] border border-[#e0e8ea] bg-white p-3.5 shadow-[0_4px_18px_rgba(35,78,83,.04)]">
                        <div className="flex items-center gap-3">
                            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#f2edff] text-[#805dd0]">
                                <span className="text-[17px] font-extrabold">✓</span>
                            </div>

                            <div>
                                <span className="text-[9px] text-[#839196]">
                                    Ngày có dữ liệu
                                </span>

                                <strong className="mt-1 block text-xl font-extrabold text-[#2e444b]">
                                    {activeDays}
                                </strong>

                                <span className="mt-0.5 block text-[8px] text-[#a0aaae]">
                                    / 7 ngày trong tuần
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-3">
                    <BaoSoLuongQuanLySiteForm title="Báo số lượng (Quản lý site)" />
                </div>
            </div>

            {isLoading && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[rgba(239,246,247,.55)] backdrop-blur-[2px]">
                    <div className="rounded-[16px] border border-[#dce8e9] bg-white px-8 py-7 text-center shadow-[0_18px_55px_rgba(31,72,77,.16)]">
                        <CircularProgress
                            isIndeterminate
                            size="90px"
                            thickness="5px"
                            color="#3f9898"
                        >
                            <CircularProgressLabel
                                fontSize="13px"
                                fontWeight="800"
                                color="#3f8f8f"
                            >
                                Loading
                            </CircularProgressLabel>
                        </CircularProgress>

                        <Text
                            mt={3}
                            className="!text-[12px] !font-bold !text-[#3f8f8f]"
                        >
                            Đang tải dữ liệu...
                        </Text>

                        <Text
                            mt={1}
                            className="!text-[9px] !text-[#95a1a5]"
                        >
                            Vui lòng chờ trong giây lát
                        </Text>
                    </div>
                </div>
            )}
        </main>
    );
}

export default BaoSoLuongQuanLySiteContainer;