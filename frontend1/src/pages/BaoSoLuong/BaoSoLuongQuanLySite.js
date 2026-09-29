import React, {useState, useEffect, useRef} from 'react';
import {
    Flex, VStack, Center, CircularProgress, CircularProgressLabel, Text, Button, Icon, useToast,
    HStack, Alert, AlertIcon, AlertDescription, Heading, Tabs, TabList, TabPanels, Tab, TabPanel, Select,
    Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, Input, Image, FormControl, FormLabel,Spinner
} from '@chakra-ui/react';
import { Row, Col, Card, Statistic, Typography, Progress, Divider } from "antd";
import { Form, Field } from 'react-final-form';
import { useCookies } from "react-cookie";
import axios from 'axios';
import { MdDownload, MdSearch, MdSend, MdCalendarToday, MdKeyboardArrowDown, MdKeyboardArrowUp, MdPeople, MdRestaurant, MdCheckCircle, MdRemove, MdAdd } from 'react-icons/md';
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

function BaoSoLuongQuanLySiteContainer({ }) {
    const [ cookies, setCookie, removeCookie ] = useCookies(["loginCookie"]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAllowAccessThisPage, setIsAllowAccessThisPage] = useState(true);
    const [clientDatas, setClientDatas] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [selectedFromDate, setSelectedFromDate] = useState(null);
    const [selectedToDate, setSelectedToDate] = useState(null);
    const [selectedTabIndex, setSelectedTabIndex] = useState(0);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [thucDonTuanDatas, setThucDonTuanDatas] = useState([]);
    const [ errorMessage, setErrorMessage ] = useState(null);

    const navigate = useNavigate();
    const toast = useToast();
    const mouted = useRef();

    const { search } = useLocation();
    const htmlDownloadRef = useRef();

    /*
     * UI STATE
     * Chỉ phục vụ giao diện mới:
     * - Mở/đóng từng ngày
     * - Tìm kiếm chỉ hiển thị UI như mẫu của bạn
     */
    const [openDays, setOpenDays] = useState({});

    const DAYS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];

    useEffect(() => {
        if(!mouted.current) {
            // if(
            //     cookies.loginCookie?.data?.scope === "admin" ||
            //     cookies.loginCookie?.data?.scope === "dashboard" ||
            //     cookies.loginCookie?.data?.scope === "all") {
            //     loadInitDatas();
            // } else {
            //     setIsAllowAccessThisPage(false);
            //     console.log("--- not authorized to access dashboard page");
            // }

            loadInitDatas();
            mouted.current = true;
        }
    }, []);

    const loadInitDatas = async() => {
        setIsLoading(true);
        //const res = await httpClient.get(`/larksuite/init-datas`);
        const res = await httpClient.post(`/larksuite/list_client`);
        console.log("--- loadInitDatas res:", res.data);

        if(!res.data.error) {
            setClientDatas(res.data.data);
            setIsLoading(false);
        } else {
            setErrorMessage("Lỗi:" + JSON.stringify(res.data?.error?.message));
            setIsLoading(false);
        }
    }

    const handleSearch = async() => {
        if(!selectedClient) {
            alert("Vui lòng chọn khách hàng!");
            return;
        } else if(!selectedFromDate) {
            alert("Vui lòng chọn ngày bắt đầu!");
            return;
        } else if(!selectedToDate) {
            alert("Vui lòng chọn ngày kết thúc!");
            return;
        }

        setIsLoading(true);
        await sleep(250);
        await getThucDonTuan({
            client_code: selectedClient,
            fromDate: selectedFromDate,
            toDate: selectedToDate
        });
        setIsLoading(false);
    }

    const onSubmit = async(values, form) => {
        confirmChoice("Bạn có đồng ý gửi báo số lượng không?", async() => {
            console.log("---- onSubmit values", values);
            const dataMap = {};

            // 1 - lấy tổng số người ăn đăng ký theo ca
            Object.keys(values).forEach(key => {
                if(key.includes("tong_so_nguoi_an")) {
                    const firstKey = key.split("#")[0];
                    const [Ngay, KhachHang, SiteAn, Ca] = firstKey.split("!");

                    if(!dataMap[firstKey]) {
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

            // 2 - lấy số lượng đăng ký theo cơ cấu suất ăn
            Object.keys(values).forEach(key => {
                if(key.includes("so_luong_dang_ky_theo_co_cau_suat_an")) {
                    const firstKey = key.split("#")[0];
                    const secondKey = key.split("#")[1];
                    const [Ngay, KhachHang, SiteAn, Ca] = firstKey.split("!");
                    const [CoCauSuatAn] = secondKey.split("!");

                    if(!dataMap[firstKey]) {
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
                    }
                }
            });

            // 3 - lấy phần trăm số lượng
            Object.keys(values).forEach(key => {
                if(key.includes("phan_tram_so_luong")) {
                    const firstKey = key.split("#")[0];
                    const secondKey = key.split("#")[1];
                    const [Ngay, KhachHang, SiteAn, Ca] = firstKey.split("!");
                    const [MonAn] = secondKey.split("!");

                    if(!dataMap[firstKey]) {
                        dataMap[firstKey] = {
                            "Ngày": Number(Ngay),
                            "Khách hàng": KhachHang,
                            "Site ăn": SiteAn,
                            "Ca": Ca,
                            ["Món ăn 1"]: MonAn,
                            ["% số lượng món ăn 1"]: Number(values[key])
                        };
                    } else {
                        if(!dataMap[firstKey]["Món ăn 1"]) {
                            dataMap[firstKey]["Món ăn 1"] = MonAn;
                            dataMap[firstKey]["% số lượng món ăn 1"] = Number(values[key]);
                        } else if(!dataMap[firstKey]["Món ăn 2"]) {
                            dataMap[firstKey]["Món ăn 2"] = MonAn;
                            dataMap[firstKey]["% số lượng món ăn 2"] = Number(values[key]);
                        } else if(!dataMap[firstKey]["Món ăn 3"]) {
                            dataMap[firstKey]["Món ăn 3"] = MonAn;
                            dataMap[firstKey]["% số lượng món ăn 3"] = Number(values[key]);
                        } else if(!dataMap[firstKey]["Món ăn 4"]) {
                            dataMap[firstKey]["Món ăn 4"] = MonAn;
                            dataMap[firstKey]["% số lượng món ăn 4"] = Number(values[key]);
                        } else if(!dataMap[firstKey]["Món ăn 5"]) {
                            dataMap[firstKey]["Món ăn 5"] = MonAn;
                            dataMap[firstKey]["% số lượng món ăn 5"] = Number(values[key]);
                        }
                    }
                }
            });

            const saveDatasLarkBase = [];
            Object.values(dataMap).forEach(item => {
                saveDatasLarkBase.push({"fields": item});
            });

            console.log("---- saveDatasLarkBase", saveDatasLarkBase);

            const res = await httpClient.post(`/larksuite/bao_so_luong_quan_ly_site`, {
                data: saveDatasLarkBase
            });

            if(res.data?.error) {
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
    }

    const getThucDonTuan = async({ client_code, fromDate, toDate }) => {
        try {
            console.log("---- selectedFromDate", selectedFromDate.getTime(), selectedToDate.getTime());

            const res = await httpClient.post(`/larksuite/thuc_don_tuan`, {
                client_code: client_code,
                fromDate: fromDate,
                toDate: toDate
            });

            console.log("--- getThucDonTuan res:", res.data);

            if(res.data.error) {
                console.log("Lỗi:" + JSON.stringify(res.data?.error?.message));
                setErrorMessage("Lỗi:" + JSON.stringify(res.data?.error?.message));
            } else {
                const thucDonTuanDatasFilter = res.data?.data?.filter(
                    item => item.Ngay >= fromDate.getTime() && item.Ngay <= toDate.getTime()
                ) || [];

                setThucDonTuanDatas(thucDonTuanDatasFilter);

                /*
                 * UI:
                 * Sau khi tải dữ liệu, mở các ngày có dữ liệu.
                 * Không thay đổi dữ liệu/logic nghiệp vụ.
                 */
                const nextOpenDays = {};

                DAYS.forEach(day => {
                    if(thucDonTuanDatasFilter.some(item => item.Thu === day)) {
                        nextOpenDays[day] = true;
                    }
                });

                setOpenDays(nextOpenDays);
            }
        } catch (error) {
            console.error("Error fetching sales data:", error);
        }
    }

    /*
     * ============================================================
     * UI HELPERS
     * ============================================================
     */

    const uniq = (arr) => [...new Set(arr)];

    const siteMatches = (value, site) =>
        String(value || '').split(',').map(item => item.trim()).includes(site);

    const dateText = (ms) => {
        if(!ms) {
            return 'Không có thực đơn';
        }
        return new Date(ms).toLocaleDateString('vi-VN');
    };

    const renderNumberField = (fieldName, label, showPercent = false) => {
        return (
            <Field name={fieldName}>
                {({ input }) => (
                    <div className="group flex min-h-[58px] items-center justify-between gap-3 rounded-[12px] border border-[#e4ebed] bg-[#fbfcfc] px-3 py-2 transition-all duration-200 hover:border-[#b8d9d8] hover:bg-white hover:shadow-[0_4px_14px_rgba(49,112,115,.06)]">
                        <div className="min-w-0 flex-1">
                            <div className="flex min-w-0 items-center gap-2">
                                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#63aead]" />
                                <span
                                    className="break-words text-[11px] font-semibold leading-4 text-[#50656c]"
                                    title={label}
                                >
                                    {label}
                                </span>

                                {showPercent && (
                                    <span className="shrink-0 rounded-full bg-[#eef7f6] px-1.5 py-0.5 text-[8px] font-bold text-[#4d9693]">
                                        %
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex shrink-0 items-center overflow-hidden rounded-[9px] border border-[#d4e4e5] bg-white">
                            <button
                                type="button"
                                className="flex h-9 w-8 items-center justify-center text-[#829297] transition hover:bg-[#eef8f7] hover:text-[#318d89]"
                                onClick={() => input.onChange(Math.max(0, Number(input.value || 0) - 1))}
                            >
                                <Icon as={MdRemove} boxSize={3.5} />
                            </button>

                            <input
                                {...input}
                                type="number"
                                min={0}
                                value={input.value ?? ''}
                                placeholder="0"
                                className="h-9 w-[58px] border-x border-[#d4e4e5] bg-white px-1 text-center text-[12px] font-bold text-[#2d4249] outline-none"
                                onWheel={(e) => e.currentTarget.blur()}
                                onKeyDown={(e) => {
                                    if(e.key === "ArrowUp" || e.key === "ArrowDown") {
                                        e.preventDefault();
                                    }
                                }}
                            />

                            <button
                                type="button"
                                className="flex h-9 w-8 items-center justify-center text-[#829297] transition hover:bg-[#eef8f7] hover:text-[#318d89]"
                                onClick={() => input.onChange(Number(input.value || 0) + 1)}
                            >
                                <Icon as={MdAdd} boxSize={3.5} />
                            </button>
                        </div>
                    </div>
                )}
            </Field>
        );
    };

    /*
     * ============================================================
     * DAY / SHIFT / SITE
     * ============================================================
     */

    const BaoSoLuongComponent = ({ thu }) => {
        const dayRows = thucDonTuanDatas.filter(item => item.Thu === thu);
        const caList = uniq(dayRows.map(item => item.Ca).filter(Boolean));
        const date = dayRows[0]?.Ngay || '';
        const open = !!openDays[thu];

        return (
            <article className="overflow-hidden rounded-[15px] border border-[#dfe8ea] bg-white shadow-[0_3px_14px_rgba(37,79,84,.035)]">

                {/* DAY HEADER */}
                <button
                    type="button"
                    className={`flex min-h-[68px] w-full items-center justify-between gap-4 border-0 px-4 text-left transition-all ${
                        open
                            ? 'bg-[#f6fafb]'
                            : 'bg-white hover:bg-[#fbfdfd]'
                    }`}
                    onClick={() => setOpenDays(current => ({...current, [thu]: !current[thu]}))}
                >
                    <span className="flex min-w-0 items-center gap-3">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[11px] bg-[#edf7f7] text-[#42999a]">
                            <Icon as={MdCalendarToday} boxSize={5} />
                        </span>

                        <span className="min-w-0">
                            <span className="flex items-center gap-2">
                                <strong className="text-[14px] font-bold text-[#24363d]">
                                    {thu}
                                </strong>

                                {caList.length > 0 && (
                                    <span className="rounded-full bg-[#e8f5f4] px-2 py-0.5 text-[8px] font-extrabold text-[#438f8e]">
                                        {caList.length} ca
                                    </span>
                                )}
                            </span>

                            <span className="mt-1 block text-[10px] text-[#88979c]">
                                {dayRows.length
                                    ? `${dateText(date)} · ${dayRows.length} dòng dữ liệu`
                                    : 'Không có thực đơn'}
                            </span>
                        </span>
                    </span>

                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#f4f7f8] text-[#718188]">
                        <Icon
                            as={open ? MdKeyboardArrowUp : MdKeyboardArrowDown}
                            boxSize={5}
                        />
                    </span>
                </button>

                {/* DAY CONTENT */}
                {open && caList.length > 0 && (
                    <div className="border-t border-[#e8edef] bg-[#f8fafb] p-3 md:p-4">
                        <div className="space-y-4">
                            {caList.map((Ca) => {
                                const datas = dayRows.filter(item => item.Ca === Ca);
                                const ngay = datas[0]?.Ngay || "";
                                const khachhang = datas[0]?.KhachHang || selectedClient || "";
                                const uniqueSiteArray = uniq(datas.map(item => item.SiteAn));
                                const sites = [];

                                uniqueSiteArray.forEach(site => {
                                    const split = String(site || '').includes(',')
                                        ? String(site).split(',').map(item => item.trim()).filter(Boolean)
                                        : [site];

                                    split.forEach(siteName => {
                                        if(siteName && !sites.includes(siteName)) {
                                            sites.push(siteName);
                                        }
                                    });
                                });

                                return (
                                    <section key={`${thu}-${Ca}`}>

                                        <div className="mb-3 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="rounded-[8px] bg-[#3f9898] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-white">
                                                    {Ca}
                                                </span>

                                                <span className="text-[10px] font-medium text-[#849297]">
                                                    {sites.length} site
                                                </span>
                                            </div>

                                            <span className="hidden text-[9px] font-medium text-[#9aa6aa] sm:block">
                                                Nhập dữ liệu bên dưới
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                                            {sites.map((site_k) => {
                                                const base = `${ngay}!${khachhang}!${site_k}!${Ca}`;
                                                const totalKey = `${base}#tong_so_nguoi_an`;

                                                const cocauSuatChayNuoc = datas.filter(
                                                    item =>
                                                        siteMatches(item.SiteAn, site_k) &&
                                                        item.Ca === Ca &&
                                                        (item.CoCauSuatAn === "Suất chay" || item.CoCauSuatAn === "Suất nước")
                                                ).map(item => ({
                                                    "Ca": item.Ca,
                                                    "SiteAn": site_k,
                                                    "CoCauSuatAn": item.CoCauSuatAn
                                                }));

                                                const uniqueCoCauSuat = uniq(
                                                    cocauSuatChayNuoc.map(item => item.CoCauSuatAn)
                                                );

                                                const monAnSuatCom = datas.filter(
                                                    item =>
                                                        siteMatches(item.SiteAn, site_k) &&
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

                                                const uniqueMonAn = uniq(
                                                    monAnSuatCom.map(item => item.MonAn)
                                                ).filter(Boolean);

                                                return (
                                                    <article
                                                        key={`${base}-card`}
                                                        className="overflow-hidden rounded-[15px] border border-[#dfe8ea] bg-white shadow-[0_4px_18px_rgba(37,79,84,.045)]"
                                                    >

                                                        {/* SITE HEADER */}
                                                        <div className="flex items-center justify-between gap-3 border-b border-[#e7edef] bg-[#f5f9fa] px-4 py-3.5">
                                                            <div className="flex min-w-0 items-center gap-2.5">
                                                                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-[8px] bg-white text-[#45999a] shadow-sm">
                                                                    <Icon as={MdRestaurant} boxSize={4} />
                                                                </div>

                                                                <div className="min-w-0">
                                                                    <p className="text-[8px] font-extrabold uppercase tracking-[.12em] text-[#95a3a7]">
                                                                        SITE ĂN
                                                                    </p>

                                                                    <strong className="block truncate text-[13px] text-[#31474e]">
                                                                        {site_k}
                                                                    </strong>
                                                                </div>
                                                            </div>

                                                            <span className="shrink-0 rounded-full bg-[#e8f5f4] px-2.5 py-1 text-[9px] font-bold text-[#418f8f]">
                                                                {Ca}
                                                            </span>
                                                        </div>

                                                        <div className="p-3.5">

                                                            {/* =========================
                                                                TỔNG SỐ NGƯỜI ĂN
                                                            ========================== */}
                                                            <section className="rounded-[12px] border border-[#e4ebed] bg-[#fbfcfc] p-3">
                                                                <div className="mb-2.5 flex items-center justify-between border-b border-[#e7edef] pb-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="h-2 w-2 rounded-full bg-[#52a5a2]" />

                                                                        <h4 className="text-[11px] font-extrabold text-[#4e6269]">
                                                                            Tổng số người ăn
                                                                        </h4>
                                                                    </div>

                                                                    <span className="rounded-full bg-[#eef7f6] px-2 py-0.5 text-[8px] font-bold text-[#4c9895]">
                                                                        Người
                                                                    </span>
                                                                </div>

                                                                {renderNumberField(totalKey, 'Tổng số người ăn')}
                                                            </section>

                                                            {/* =========================
                                                                CƠ CẤU SUẤT ĂN
                                                            ========================== */}
                                                            <section className="mt-3 rounded-[12px] border border-[#e4ebed] bg-[#fbfcfc] p-3">
                                                                <div className="mb-2.5 flex items-center justify-between border-b border-[#e7edef] pb-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="h-2 w-2 rounded-full bg-[#e69468]" />

                                                                        <h4 className="text-[11px] font-extrabold text-[#4e6269]">
                                                                            Cơ cấu suất ăn
                                                                        </h4>
                                                                    </div>

                                                                    <span className="text-[8px] font-medium text-[#929ea2]">
                                                                        Theo menu
                                                                    </span>
                                                                </div>

                                                                {uniqueCoCauSuat.length > 0 ? (
                                                                    <div className="space-y-2">
                                                                        {uniqueCoCauSuat.map((CoCauSuatAn) => {
                                                                            const key = `${base}#${CoCauSuatAn}!so_luong_dang_ky_theo_co_cau_suat_an`;

                                                                            return (
                                                                                <React.Fragment key={key}>
                                                                                    {renderNumberField(key, CoCauSuatAn)}
                                                                                </React.Fragment>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                ) : (
                                                                    <div className="rounded-[10px] bg-white px-3 py-4 text-center text-[9px] text-[#89969b]">
                                                                        Không có cơ cấu suất ăn.
                                                                    </div>
                                                                )}
                                                            </section>

                                                            {/* =========================
                                                                % MÓN MẶN
                                                            ========================== */}
                                                            {uniqueMonAn.length > 0 && (
                                                                <section className="mt-3 rounded-[12px] border border-[#e4ebed] bg-[#fbfcfc] p-3">
                                                                    <div className="mb-2.5 flex items-center justify-between border-b border-[#e7edef] pb-2">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="h-2 w-2 rounded-full bg-[#8d73cd]" />

                                                                            <h4 className="text-[11px] font-extrabold text-[#4e6269]">
                                                                                % số lượng món mặn
                                                                            </h4>
                                                                        </div>

                                                                        <span className="rounded-full bg-[#f3effc] px-2 py-0.5 text-[8px] font-bold text-[#8067b8]">
                                                                            Suất cơm
                                                                        </span>
                                                                    </div>

                                                                    <div className="space-y-2">
                                                                        {uniqueMonAn.map((MonAn) => {
                                                                            const key = `${base}#${MonAn}!phan_tram_so_luong`;

                                                                            return (
                                                                                <React.Fragment key={key}>
                                                                                    {renderNumberField(key, MonAn, true)}
                                                                                </React.Fragment>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </section>
                                                            )}
                                                        </div>
                                                    </article>
                                                );
                                            })}
                                        </div>
                                    </section>
                                );
                            })}
                        </div>
                    </div>
                )}

                {open && caList.length === 0 && (
                    <div className="flex min-h-[100px] items-center justify-center border-t border-[#e8edef] bg-[#fafcfc] px-5 text-center">
                        <div>
                            <div className="mx-auto grid h-9 w-9 place-items-center rounded-full bg-[#eef5f6] text-[#84a0a5]">
                                <Icon as={MdCalendarToday} boxSize={4} />
                            </div>

                            <p className="mt-2 text-[10px] font-medium text-[#87959a]">
                                Không có dữ liệu thực đơn cho ngày này.
                            </p>
                        </div>
                    </div>
                )}
            </article>
        );
    };

    const BaoSoLuongQuanLySiteForm = ({ title }) => {
        return (
            <Form
                onSubmit={onSubmit}
                render={({ handleSubmit, form, submitting }) => (
                    <form onSubmit={handleSubmit} className="w-full">

                        <section className="w-full overflow-hidden rounded-[16px] border border-[#dfe8ea] bg-white shadow-[0_8px_30px_rgba(35,78,83,.05)]">

                            {/* REPORT HEADER */}
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
                                                    : 'Chưa có dữ liệu'}
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
                                            bg: '#327f80',
                                            transform: 'translateY(-1px)'
                                        }}
                                        _active={{
                                            transform: 'translateY(0)'
                                        }}
                                        transition="all .18s ease"
                                    >
                                        Gửi báo số lượng
                                    </Button>
                                </div>
                            </div>

                            {/* DAYS */}
                            <div className="space-y-2.5 bg-[#f7fafb] p-3 md:p-4">
                                {DAYS.map(day => (
                                    <BaoSoLuongComponent
                                        key={day}
                                        thu={day}
                                    />
                                ))}
                            </div>
                        </section>
                    </form>
                )}
            />
        );
    };

    const totalRows = thucDonTuanDatas.length;
    const activeDays = DAYS.filter(day =>
        thucDonTuanDatas.some(item => item.Thu === day)
    ).length;

    return (
        <main className="box-border min-h-full w-full min-w-0 overflow-x-hidden bg-[#f5f8f9] text-[#263238]">

            <div className="w-full p-2 md:p-3">

                {errorMessage && (
                    <Alert
                        status="error"
                        className="mb-3 !rounded-[12px] !border !border-red-100 !bg-red-50"
                    >
                        <AlertIcon />

                        <AlertDescription className="!text-[11px]">
                            {errorMessage}
                        </AlertDescription>
                    </Alert>
                )}

                {/* ================= BỘ LỌC ================= */}
                <section className="overflow-hidden rounded-[16px] border border-[#dfe8ea] bg-white shadow-[0_7px_25px_rgba(35,78,83,.05)]">

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

                            {selectedClient && (
                                <span className="w-fit rounded-full bg-[#eef8f7] px-3 py-1.5 text-[9px] font-extrabold text-[#3f9090]">
                                    {selectedClient}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-2 xl:grid-cols-[1.35fr_1fr_1fr_auto] xl:items-end">

                        <label className="flex w-full flex-col gap-1.5">
                            <span className="text-[9px] font-extrabold uppercase tracking-[.06em] text-[#62767d]">
                                Chọn khách hàng
                            </span>

                            <Select
                                value={selectedClient || ''}
                                placeholder="Chọn khách hàng"
                                onChange={(event) => setSelectedClient(event.target.value)}
                                disabled={isLoading}
                                className="!h-[42px] !rounded-[10px] !border-[#d7e2e4] !bg-white !px-1 !text-[11px] !font-medium !text-[#33484f]"
                            >
                                {clientDatas
                                    .slice()
                                    .sort((a,b) => String(a).localeCompare(String(b)))
                                    .map(key => (
                                        <option key={`client-${key}`} value={key}>
                                            {key}
                                        </option>
                                    ))}
                            </Select>
                        </label>

                        <label className="flex w-full flex-col gap-1.5">
                            <span className="text-[9px] font-extrabold uppercase tracking-[.06em] text-[#62767d]">
                                Từ ngày
                            </span>

                            <div className="relative">
                                <Icon
                                    as={MdCalendarToday}
                                    boxSize={4}
                                    className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[#819095]"
                                />

                                <Input
                                    type="date"
                                    value={selectedFromDate ? moment(selectedFromDate).format("YYYY-MM-DD") : ''}
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        setSelectedFromDate(
                                            value ? new Date(`${value}T00:00:00`) : null
                                        );
                                    }}
                                    disabled={isLoading}
                                    className="!h-[42px] !rounded-[10px] !border-[#d7e2e4] !bg-white !pl-10 !text-[11px] !text-[#35484f]"
                                />
                            </div>
                        </label>

                        <label className="flex w-full flex-col gap-1.5">
                            <span className="text-[9px] font-extrabold uppercase tracking-[.06em] text-[#62767d]">
                                Đến ngày
                            </span>

                            <div className="relative">
                                <Icon
                                    as={MdCalendarToday}
                                    boxSize={4}
                                    className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[#819095]"
                                />

                                <Input
                                    type="date"
                                    value={selectedToDate ? moment(selectedToDate).format("YYYY-MM-DD") : ''}
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        setSelectedToDate(
                                            value ? new Date(`${value}T00:00:00`) : null
                                        );
                                    }}
                                    disabled={isLoading}
                                    className="!h-[42px] !rounded-[10px] !border-[#d7e2e4] !bg-white !pl-10 !text-[11px] !text-[#35484f]"
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
                                bg: '#327f80',
                                transform: 'translateY(-1px)'
                            }}
                            _active={{
                                transform: 'translateY(0)'
                            }}
                            transition="all .18s ease"
                        >
                            Tìm kiếm
                        </Button>
                    </div>

                    <div className="h-1 bg-gradient-to-r from-[#3f9898] via-[#5bb0ad] to-[#76c1bd]" />
                </section>

                {/* ================= THỐNG KÊ ================= */}
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
                                    {selectedClient || 'Chưa chọn'}
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
                                        ? moment(selectedFromDate).format('DD/MM/YYYY')
                                        : '—'}
                                    {' → '}
                                    {selectedToDate
                                        ? moment(selectedToDate).format('DD/MM/YYYY')
                                        : '—'}
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
                                <Icon as={MdCheckCircle} boxSize={5} />
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

                {/* ================= FORM BÁO SỐ LƯỢNG ================= */}
                <div className="mt-3">
                    <BaoSoLuongQuanLySiteForm title="Báo số lượng quản lý site" />
                </div>
            </div>

            {isLoading && (
                <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-[rgba(239,246,247,.55)] backdrop-blur-[2px]">
                    <div className="rounded-[16px] border border-[#dce8e9] bg-white px-8 py-7 text-center shadow-[0_18px_55px_rgba(31,72,77,.16)]">
                        <Spinner
                            size="xl"
                            thickness="4px"
                            speed="0.7s"
                            color="#3f9898"
                        />

                        <Text mt={3} className="!text-[12px] !font-bold !text-[#3f8f8f]">
                            Đang tải dữ liệu...
                        </Text>

                        <Text mt={1} className="!text-[9px] !text-[#95a1a5]">
                            Vui lòng chờ trong giây lát
                        </Text>
                    </div>
                </div>
            )}
        </main>
    );
}

export default BaoSoLuongQuanLySiteContainer;