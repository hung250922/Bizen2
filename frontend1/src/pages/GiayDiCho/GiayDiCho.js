import React, { useState, useRef, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import {
    Flex, Heading, Input, Button, ButtonGroup, Text, CircularProgress, CircularProgressLabel, Spinner,
    InputGroup, InputLeftElement, InputRightElement, Icon, IconButton, Select,
    Stack, HStack, Image, Wrap, WrapItem, Center, InputRightAddon,
    Tabs, Tab, TabList, TabPanels, TabPanel,
    Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, useDisclosure, useToast,
    VStack, FormControl, FormLabel
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
import { MultiSelect } from "react-multi-select-component";
import { OutTable, ExcelRenderer } from 'react-excel-renderer/build';
import { sleep, confirmChoice } from "../../utils/helpers";
import httpClient from '../../services/http-client';

function GiayDiCho() {
    const [ cookies, setCookie, removeCookie ] = useCookies(["loginCookie"]);
    const initialRef = useRef(null);
    const toast = useToast();
    const navigate = useNavigate();
    const { search } = useLocation();

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

        if(!res.data.error) {
            setClientDatas(res.data?.data || []);
            setIsLoading(false);
        } else {
            setErrorMessage("Lỗi:" + JSON.stringify(res.data?.error?.message));
            setIsLoading(false);
        }

        const listSiteRes = await httpClient.post(`/larksuite/list_site`);

        if(!listSiteRes.data.error) {
            setSiteDatas(listSiteRes.data?.data || []);
        } else {
            setErrorMessage("Lỗi:" + JSON.stringify(listSiteRes.data?.error?.message));
            setIsLoading(false);
        }
    }

    const handleExportExcel = async() => {
        confirmChoice("Bạn có đồng ý xuất Excel không?", async() => {
            setIsLoading(true);

            const res = await httpClient.post(
                `/export_excel_file/giay_di_cho`,
                {
                    client_code: selectedClient,
                    date: selectedDate,
                    kitchen: selectedKitchen,
                    site: selectedSite.map(item => item.value),
                    ca: selectedCa
                },
                {
                    responseType: 'blob'
                }
            );

            if(res.data) {
                const remoteExcel = res.data;

                if (remoteExcel){
                    const blobEXCEL = new Blob(
                        [remoteExcel],
                        {
                            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;'
                        }
                    );

                    const fileURL = window.URL.createObjectURL(blobEXCEL);
                    const link = document.createElement('a');

                    link.href = fileURL;
                    link.setAttribute(
                        "download",
                        `GiayDiCho_${selectedDate}_${selectedClient}.xlsx`
                    );

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
    
    const handleSearch = async() => {
        if(!selectedClient) {
            alert("Vui lòng chọn khách hàng!");
            return;
        } else if(!selectedDate) {
            alert("Vui lòng chọn ngày!");
            return;
        }

        await sleep(250);
        setIsLoading(true);

        const res = await httpClient.post(`/larksuite/giay_di_cho`, {
            client_code: selectedClient,
            date: selectedDate
        });

        console.log("--- handle Search res:", res.data);

        if(!res.data.error) {
            let _rowDatas = [];

            for(let i=0; i<res.data.data.length; i++) {
                const {
                    Ngay,
                    Thu,
                    KhachHang,
                    SiteAn,
                    Ca,
                    MonAn,
                    CoCauSuatAn,
                    SoLuongCoNgaDuyetDatHang,
                    NguyenLieuChoKiemThucBuoc2,
                    BOMMonAn
                } = res.data.data[i];

                _rowDatas.push([
                    KhachHang,
                    SoLuongCoNgaDuyetDatHang,
                    Ca,
                    CoCauSuatAn,
                    MonAn,
                    BOMMonAn,
                    NguyenLieuChoKiemThucBuoc2
                ]);
            }

            setRowDatas(_rowDatas);
            setIsLoading(false);
        } else {
            setErrorMessage(
                "Lỗi:" +
                JSON.stringify(
                    res.data?.error?.message
                )
            );
            setIsLoading(false);
        }
    }

    const formatDateForInput = date => {
        if(!date) return '';

        const value =
            date instanceof Date
                ? date
                : new Date(date);

        if(Number.isNaN(value.getTime())) {
            return '';
        }

        return `${value.getFullYear()}-${String(
            value.getMonth() + 1
        ).padStart(2, '0')}-${String(
            value.getDate()
        ).padStart(2, '0')}`;
    };

    const parseDateInput = value => {
        if(!value) return null;

        const [year, month, day] =
            value.split('-').map(Number);

        if(!year || !month || !day) {
            return null;
        }

        return new Date(
            year,
            month - 1,
            day
        );
    };

    const sortedClients = [...clientDatas]
        .filter(Boolean)
        .sort((a,b) => a.localeCompare(b));

    const siteOptions = [...siteDatas]
        .sort((a,b) =>
            String(a.MaKhachHang || '').localeCompare(
                String(b.MaKhachHang || '')
            )
        )
        .map(({ MaSite }) => ({
            label: MaSite,
            value: MaSite
        }));

    return (
        <main className="min-h-full w-full min-w-0 overflow-x-hidden bg-[#f5f8f9] text-[#263238]">
            <div className="w-full p-2 md:p-3">

                {/* ================= PAGE HEADER ================= */}
                <section className="mb-4 overflow-hidden rounded-[16px] border border-[#dfe8ea] bg-white shadow-[0_7px_25px_rgba(35,78,83,.05)]">
                    <div className="border-b border-[#e8edef] px-4 py-4 md:px-5">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] bg-[#eaf7f7] text-[#3e9898]">
                                    <Icon as={MdSearch} boxSize={5} />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-[9px] font-extrabold uppercase tracking-[.14em] text-[#79a6aa]">
                                        PROCUREMENT MANAGEMENT
                                    </p>

                                    <h1 className="mt-0.5 text-[19px] font-extrabold text-[#273c43]">
                                    </h1>

                                    <p className="mt-1 text-[10px] text-[#89979c]">
                                        Tìm kiếm dữ liệu giấy đi chợ và xuất Excel theo nhu cầu.
                                    </p>
                                </div>
                            </div>

                            <div className="w-fit rounded-full bg-[#eef8f7] px-3 py-1.5 text-[9px] font-extrabold text-[#3f8f8f]">
                                {rowDatas.length} dòng
                            </div>
                        </div>
                    </div>
                </section>

                {/* ================= FILTER ================= */}
                <section className="relative z-50 mb-4 overflow-visible rounded-[16px] border border-[#dfe8ea] bg-white shadow-[0_7px_25px_rgba(35,78,83,.05)]">

                    <div className="border-b border-[#e8edef] px-4 py-4 md:px-5">
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-[#4ba3a0]" />

                            <div>
                                <h2 className="text-[13px] font-extrabold text-[#3b5158]">
                                    Thông tin tìm kiếm
                                </h2>

                                <p className="mt-0.5 text-[9px] text-[#8b999e]">
                                    Chọn khách hàng, bếp, ca, site và ngày trước khi tìm kiếm hoặc xuất Excel.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-50 grid w-full grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_1.5fr_1fr]">

                        {/* KHÁCH HÀNG */}
                        <div className="min-w-0">
                            <label className="mb-1.5 block text-[9px] font-extrabold uppercase tracking-[.06em] text-[#62767d]">
                                Khách hàng
                            </label>

                            <Select
                                value={selectedClient || ''}
                                placeholder="Chọn khách hàng"
                                onChange={evt => setSelectedClient(evt.target.value)}
                                disabled={isLoading}
                                className="!h-[42px] !rounded-[10px] !border-[#d7e2e4] !bg-white !text-[11px] !font-medium !text-[#33484f]"
                            >
                                {sortedClients.map((key) => (
                                    <option
                                        key={`client-${key}`}
                                        value={key}
                                    >
                                        {key}
                                    </option>
                                ))}
                            </Select>
                        </div>

                        {/* BẾP */}
                        <div className="min-w-0">
                            <label className="mb-1.5 block text-[9px] font-extrabold uppercase tracking-[.06em] text-[#62767d]">
                                Bếp
                            </label>

                            <Select
                                value={selectedKitchen || ''}
                                placeholder="Chọn bếp"
                                onChange={evt => setSelectedKitchen(evt.target.value)}
                                disabled={isLoading}
                                className="!h-[42px] !rounded-[10px] !border-[#d7e2e4] !bg-white !text-[11px] !font-medium !text-[#33484f]"
                            >
                                {[
                                    "Bếp trung tâm",
                                    "Bếp trung tâm 2",
                                    "Bếp tại chỗ"
                                ].map(key => (
                                    <option
                                        key={`warehouse-${key}`}
                                        value={key}
                                    >
                                        {key}
                                    </option>
                                ))}
                            </Select>
                        </div>

                        {/* CA */}
                        <div className="min-w-0">
                            <label className="mb-1.5 block text-[9px] font-extrabold uppercase tracking-[.06em] text-[#62767d]">
                                Ca
                            </label>

                            <Select
                                value={selectedCa || ''}
                                placeholder="Chọn ca"
                                onChange={evt => setSelectedCa(evt.target.value)}
                                disabled={isLoading}
                                className="!h-[42px] !rounded-[10px] !border-[#d7e2e4] !bg-white !text-[11px] !font-medium !text-[#33484f]"
                            >
                                {["Ca 1", "Ca 2", "Ca 3"].map(key => (
                                    <option
                                        key={`ca-${key}`}
                                        value={key}
                                    >
                                        {key}
                                    </option>
                                ))}
                            </Select>
                        </div>

                        {/* SITE */}
                        <div className="relative z-[60] min-w-0">
                            <label className="mb-1.5 block text-[9px] font-extrabold uppercase tracking-[.06em] text-[#62767d]">
                                Site
                            </label>

                            <div className="relative z-[60] min-h-[42px]">
                                <MultiSelect
                                    options={siteOptions}
                                    value={selectedSite}
                                    onChange={setSelectedSite}
                                    labelledBy="Chọn site"
                                    overrideStrings={{
                                        allItemsAreSelected: 'Đã chọn tất cả',
                                        clearSearch: 'Xóa tìm kiếm',
                                        noOptions: 'Không có site',
                                        search: 'Tìm kiếm',
                                        selectAll: 'Chọn tất cả',
                                        selectSomeItems: 'Chọn site'
                                    }}
                                />
                            </div>
                        </div>

                        {/* NGÀY */}
                        <div className="min-w-0">
                            <label className="mb-1.5 block text-[9px] font-extrabold uppercase tracking-[.06em] text-[#62767d]">
                                Ngày
                            </label>

                            <Input
                                type="date"
                                value={formatDateForInput(selectedDate)}
                                onChange={evt =>
                                    setSelectedDate(
                                        parseDateInput(
                                            evt.target.value
                                        )
                                    )
                                }
                                disabled={isLoading}
                                className="!h-[42px] !rounded-[10px] !border-[#d7e2e4] !bg-white !px-3 !text-[11px] !font-medium !text-[#33484f]"
                            />
                        </div>
                    </div>

                    {/* SUMMARY */}
                    <div className="mx-4 mb-4 grid overflow-hidden rounded-[11px] border border-[#e5edef] bg-[#f8fbfb] md:grid-cols-4">

                        <div className="border-b border-[#e5edef] px-3.5 py-3 md:border-b-0 md:border-r">
                            <span className="block text-[8px] font-extrabold uppercase tracking-[.08em] text-[#91a0a4]">
                                Khách hàng
                            </span>

                            <strong className="mt-1 block truncate text-[10px] text-[#455960]">
                                {selectedClient || '—'}
                            </strong>
                        </div>

                        <div className="border-b border-[#e5edef] px-3.5 py-3 md:border-b-0 md:border-r">
                            <span className="block text-[8px] font-extrabold uppercase tracking-[.08em] text-[#91a0a4]">
                                Bếp
                            </span>

                            <strong className="mt-1 block truncate text-[10px] text-[#455960]">
                                {selectedKitchen || '—'}
                            </strong>
                        </div>

                        <div className="border-b border-[#e5edef] px-3.5 py-3 md:border-b-0 md:border-r">
                            <span className="block text-[8px] font-extrabold uppercase tracking-[.08em] text-[#91a0a4]">
                                Ca / Site
                            </span>

                            <strong className="mt-1 block truncate text-[10px] text-[#455960]">
                                {selectedCa || '—'}
                                {selectedSite.length > 0
                                    ? ` / ${selectedSite.length} site`
                                    : ' / —'}
                            </strong>
                        </div>

                        <div className="px-3.5 py-3">
                            <span className="block text-[8px] font-extrabold uppercase tracking-[.08em] text-[#91a0a4]">
                                Ngày
                            </span>

                            <strong className="mt-1 block text-[10px] text-[#455960]">
                                {formatDateForInput(selectedDate) || '—'}
                            </strong>
                        </div>
                    </div>

                    {errorMessage && (
                        <div className="mx-4 mb-4 rounded-[10px] border border-[#f0d0d0] bg-[#fff6f6] px-3.5 py-3 text-[10px] font-medium text-[#a14b4b]">
                            {errorMessage}
                        </div>
                    )}

                    {/* ACTIONS */}
                    <div className="flex flex-col gap-2.5 border-t border-[#e8edef] bg-[#fbfcfc] px-4 py-4 sm:flex-row sm:justify-end">

                        <Button
                            type="button"
                            onClick={handleSearch}
                            isLoading={isLoading}
                            loadingText="Đang tìm..."
                            leftIcon={
                                <Icon
                                    as={MdSearch}
                                    boxSize={4}
                                />
                            }
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

                        <Button
                            type="button"
                            onClick={handleExportExcel}
                            isLoading={isLoading}
                            loadingText="Đang xuất..."
                            leftIcon={
                                <Icon
                                    as={BsFileExcel}
                                    boxSize={4}
                                />
                            }
                            h="42px"
                            px={5}
                            borderRadius="10px"
                            bg="#6eaaa6"
                            color="white"
                            fontSize="10px"
                            fontWeight="800"
                            _hover={{
                                bg: "#5a9692",
                                transform: "translateY(-1px)"
                            }}
                            _active={{
                                transform: "translateY(0)"
                            }}
                            transition="all .18s ease"
                        >
                            Xuất Excel
                        </Button>
                    </div>
                </section>

                {/* ================= DATA ================= */}
                <section className="mt-4 min-w-0 overflow-hidden rounded-[16px] border border-[#dfe8ea] bg-white shadow-[0_7px_25px_rgba(35,78,83,.05)]">

                    <div className="border-b border-[#e8edef] px-4 py-4 md:px-5">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-[#65a8ae]" />

                                    <h2 className="text-[14px] font-extrabold text-[#3b5158]">
                                        Dữ liệu giấy đi chợ
                                    </h2>

                                    <span className="rounded-full bg-[#eef7f7] px-2.5 py-1 text-[8px] font-extrabold text-[#579b96]">
                                        {rowDatas.length}
                                    </span>
                                </div>

                                <p className="mt-1 text-[9px] text-[#8b999e]">
                                    Danh sách dữ liệu giấy đi chợ nhận được từ hệ thống.
                                </p>
                            </div>

                            {selectedSite.length > 0 && (
                                <span className="w-fit rounded-full bg-[#eef7f7] px-3 py-1.5 text-[9px] font-extrabold text-[#3f8f8f]">
                                    {selectedSite.length} site
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="w-full overflow-x-auto">

                        {rowDatas.length > 0 ? (
                            <table className="w-full min-w-[1120px] table-fixed border-collapse">

                                <thead className="sticky top-0 z-10 bg-[#f3f8f8]">
                                    <tr>

                                        <th className="w-[55px] border-b border-[#e4ecee] px-3 py-3 text-left text-[9px] font-extrabold text-[#60747a]">
                                            STT
                                        </th>

                                        <th className="w-[190px] border-b border-[#e4ecee] px-3 py-3 text-left text-[9px] font-extrabold text-[#60747a]">
                                            CÔNG TY
                                        </th>

                                        <th className="w-[110px] border-b border-[#e4ecee] px-3 py-3 text-left text-[9px] font-extrabold text-[#60747a]">
                                            SỐ PHẦN
                                        </th>

                                        <th className="w-[90px] border-b border-[#e4ecee] px-3 py-3 text-left text-[9px] font-extrabold text-[#60747a]">
                                            CA
                                        </th>

                                        <th className="w-[155px] border-b border-[#e4ecee] px-3 py-3 text-left text-[9px] font-extrabold text-[#60747a]">
                                            CƠ CẤU SUẤT ĂN
                                        </th>

                                        <th className="w-[200px] border-b border-[#e4ecee] px-3 py-3 text-left text-[9px] font-extrabold text-[#60747a]">
                                            MÓN ĂN
                                        </th>

                                        <th className="w-[240px] border-b border-[#e4ecee] px-3 py-3 text-left text-[9px] font-extrabold text-[#60747a]">
                                            BOM MÓN ĂN
                                        </th>

                                        <th className="w-[170px] border-b border-[#e4ecee] px-3 py-3 text-left text-[9px] font-extrabold text-[#60747a]">
                                            SỐ LƯỢNG NHẬP
                                        </th>

                                    </tr>
                                </thead>

                                <tbody>
                                    {rowDatas.map((row, index) => (
                                        <tr
                                            key={`${index}-${row.join('-')}`}
                                            className="transition-colors hover:bg-[#f8fbfb]"
                                        >

                                            <td className="border-b border-[#edf2f3] px-3 py-4 text-[10px] text-[#87959a]">
                                                {index + 1}
                                            </td>

                                            <td className="border-b border-[#edf2f3] px-3 py-4 align-top">
                                                <div className="flex items-start gap-2">
                                                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#4aa2a0]" />

                                                    <span className="break-words text-[10px] font-bold leading-5 text-[#425860]">
                                                        {row[0] || '—'}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="border-b border-[#edf2f3] px-3 py-4 align-top">
                                                <span className="inline-flex rounded-[7px] bg-[#edf7f7] px-2 py-1 text-[9px] font-bold text-[#508f90]">
                                                    {row[1] ?? '—'}
                                                </span>
                                            </td>

                                            <td className="border-b border-[#edf2f3] px-3 py-4 align-top">
                                                <span className="inline-flex rounded-[7px] bg-[#f4f6f7] px-2 py-1 text-[9px] font-bold text-[#69797e]">
                                                    {row[2] || '—'}
                                                </span>
                                            </td>

                                            <td className="border-b border-[#edf2f3] px-3 py-4 align-top">
                                                <span className="break-words text-[10px] leading-5 text-[#586b72]">
                                                    {row[3] || '—'}
                                                </span>
                                            </td>

                                            <td className="border-b border-[#edf2f3] px-3 py-4 align-top">
                                                <span className="break-words text-[10px] font-semibold leading-5 text-[#455a62]">
                                                    {row[4] || '—'}
                                                </span>
                                            </td>

                                            <td className="border-b border-[#edf2f3] px-3 py-4 align-top">
                                                {row[5] ? (
                                                    <div className="rounded-[8px] bg-[#f8fafb] px-2.5 py-2">
                                                        <span className="break-words text-[10px] leading-5 text-[#62747a]">
                                                            {row[5]}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-[10px] text-[#b1babc]">
                                                        —
                                                    </span>
                                                )}
                                            </td>

                                            <td className="border-b border-[#edf2f3] px-3 py-4 align-top">
                                                <span className="inline-flex rounded-[8px] bg-[#eef7f6] px-2.5 py-1.5 text-[9px] font-extrabold text-[#478e8b]">
                                                    {row[6] ?? '—'}
                                                </span>
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="flex min-h-[300px] flex-col items-center justify-center px-5 text-center">

                                <div className="grid h-12 w-12 place-items-center rounded-[12px] bg-[#eef7f8] text-[#62a5ab]">
                                    <Icon
                                        as={MdSearch}
                                        boxSize={5}
                                    />
                                </div>

                                <p className="mt-3 text-sm font-semibold text-[#596c72]">
                                    Chưa có dữ liệu
                                </p>

                                <p className="mt-1 max-w-[360px] text-[10px] leading-5 text-[#8c999e]">
                                    Chọn khách hàng và ngày, sau đó nhấn Tìm kiếm để tải dữ liệu giấy đi chợ.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-2 border-t border-[#edf2f3] bg-[#fbfcfc] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">

                        <span className="text-[9px] text-[#7f8d92]">
                            {rowDatas.length
                                ? `Hiển thị ${rowDatas.length} dòng dữ liệu`
                                : '0 dòng'}
                        </span>

                        <span className="text-[9px] font-semibold text-[#8b999e]">
                            Ngày: {formatDateForInput(selectedDate) || 'Chưa chọn'}
                        </span>
                    </div>
                </section>
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

                        <p className="mt-3 text-[12px] font-bold text-[#3f8f8f]">
                            Đang xử lý...
                        </p>

                        <p className="mt-1 text-[9px] text-[#95a1a5]">
                            Vui lòng chờ trong giây lát
                        </p>
                    </div>
                </div>
            )}
        </main>
    );
}

export default GiayDiCho;