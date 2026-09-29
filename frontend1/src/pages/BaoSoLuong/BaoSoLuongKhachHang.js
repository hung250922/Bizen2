import React, {useState, useEffect, useRef} from 'react';
import {
    Flex, VStack, Center, Spinner, Text, Button, Icon, useToast,
    HStack, Alert, AlertIcon, AlertDescription,
    Heading, Tabs, TabList, TabPanels, Tab, TabPanel, Select,
    Input, Image, FormControl
} from '@chakra-ui/react';
import { Form, Field } from 'react-final-form';
import { useCookies } from 'react-cookie';
import { MdCalendarToday, MdSearch, MdSend, MdRemove, MdAdd, MdCheckCircle } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';
import _ from 'lodash';
import moment from 'moment';
import { sleep, confirmChoice } from '../../utils/helpers';
import httpClient from '../../services/http-client';
import { COMPANY_LOGO } from '../../constants';

function BaoSoLuongKhachHangContainer({ }) {
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
        await getThucDonTuan({ client_code: selectedClient, fromDate: selectedFromDate, toDate: selectedToDate });
        setIsLoading(false);
    }

    const onSubmit = async(values, form) => {
        //console.log("--- onSubmit values:", values);
        confirmChoice("Bạn có đồng ý gửi báo số lượng không?", async() => {
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

            //*** */ 2 - lấy số lượng đăng ký theo cơ cấu suất ăn
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

            const saveDatasLarkBase = []; 
            Object.values(dataMap).forEach(item => {
                saveDatasLarkBase.push({
                    "fields": item
                });
            });

            // const saveDatasLarkBase = [];

            // // 1 - lấy tổng số người ăn đăng ký theo ca
            // Object.keys(values).forEach(key => {
            //     if(key.includes("tong_so_nguoi_an")) {
            //         const [Ngay, KhachHang, SiteAn, Ca] = key.split("!");
            //         saveDatasLarkBase.push({
            //             "fields": {
            //                 "Ngày": Number(Ngay),
            //                 "Khách hàng": KhachHang,
            //                 "Site ăn":SiteAn,
            //                 "Ca": Ca,
            //                 "Tổng số người ăn": Number(values[key])
            //             }
            //         });
            //     }
            // });

            // // 2 - lấy số lượng đăng ký theo cơ cấu suất ăn
            // Object.keys(values).forEach(key => {
            //     if(key.includes("so_luong_dang_ky_theo_co_cau_suat_an")) {
            //         const [Ngay, KhachHang, SiteAn, Ca, CoCauSuatAn] = key.split("!");
            //         saveDatasLarkBase.push({
            //             "fields": {
            //                 "Ngày": Number(Ngay),
            //                 "Khách hàng": KhachHang,
            //                 "Site ăn":SiteAn,
            //                 "Ca": Ca,
            //                 "Cơ cấu suất ăn": CoCauSuatAn,
            //                 "Số lượng đăng ký theo cơ cấu suất ăn": Number(values[key])
            //             }
            //         });
            //     }
            // });

            const res = await httpClient.post(`/larksuite/bao_so_luong_khach_hang`, {
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
                    description: `Bạn đã gửi số lượng thành công!`,
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

    const getThucDonTuan = async ({ client_code, fromDate, toDate }) => {
        try {
            const res = await httpClient.post(`/larksuite/thuc_don_tuan`, {
                client_code: client_code,
                fromDate: fromDate,
                toDate: toDate
            });
            if(res.data.error) {
                console.log("Lỗi:" + JSON.stringify(res.data?.error?.message));
                setErrorMessage("Lỗi:" + JSON.stringify(res.data?.error?.message));
            } else {
                const thucDonTuanDatasFilter = res.data?.data?.filter(item => item.Ngay >= fromDate.getTime() && item.Ngay <= toDate.getTime()) || [];
                setThucDonTuanDatas(thucDonTuanDatasFilter);
            }
        } catch (error) {
            console.error("Error fetching sales data:", error);
        }
    }

    const formatDateInputValue = (date) => {
        if(!date) return '';
        const value = date instanceof Date ? date : new Date(date);
        if(Number.isNaN(value.getTime())) return '';
        return moment(value).format('YYYY-MM-DD');
    };

    const QuantityInput = ({ label, meal, children }) => (
    <div className="flex w-full items-center justify-between gap-3 rounded-xl border border-[#dfeceb] bg-white px-3 py-2.5 shadow-sm transition hover:border-[#9ccbc7] hover:shadow-md">
        <div className="min-w-0 flex-1">
            <Text
                className="break-words text-[13px] font-semibold leading-5 text-[#48636a]"
                title={label}
            >
                {label}
            </Text>

            {meal && (
                <span className={`mt-1 inline-flex rounded-md px-2 py-0.5 text-[10px] font-bold ${
                    meal === "Suất cơm"
                        ? "bg-[#edf3ff] text-[#4778b8]"
                        : meal === "Suất chay"
                            ? "bg-[#edf8ee] text-[#3d9360]"
                            : "bg-[#fff3e9] text-[#c77a3d]"
                }`}>
                    {meal}
                </span>
            )}
        </div>

        <div className="flex shrink-0 items-center overflow-hidden rounded-lg border border-[#cfe3e0] bg-[#f9fcfc]">
            {children}
        </div>
    </div>
);

    const BaoSoLuongComponent = ({ thu }) => {
        const thucDonTuanDataFilterByThu = thucDonTuanDatas.filter(item => item.Thu === thu);
        const caArray = thucDonTuanDataFilterByThu.map(item => ({
            "Ca": item.Ca
        }));
        const uniqueCaArray = _.uniqBy(caArray, item => `${item.Ca}`);
        const tabPanelComponents = [];

        for(let i = 0; i < uniqueCaArray.length; i++) {
            const { Ca } = uniqueCaArray[i];
            const datas = thucDonTuanDataFilterByThu.filter(item => item.Ca === Ca);
            const ngay = datas[0]?.Ngay || "";
            const khachhang = datas[0]?.KhachHang || "";
            const siteArray = datas.map(item => item.SiteAn);
            const uniqueSiteArray = _.uniq(siteArray);

            const tpTongSoNguoiAnComponents = [], tpSoLuongDangKyTheoCoCauSuatAnComponents = [], tpPhanTramSoLuongComponents = [];

            for(let j = 0; j < uniqueSiteArray.length; j++) {
                const site = uniqueSiteArray[j];
                const siteArray = site.includes(",") ? site.split(",") : [site];

                // *** 1 - số lượng đăng ký tổng số người ăn
                for(let k = 0; k < siteArray.length; k++) {
                    const site_k = siteArray[k].trim();
                    tpTongSoNguoiAnComponents.push(
                        <React.Fragment key={`${ngay}!${khachhang}-${site_k}-${Ca}`}>
                            <QuantityInput label={`${Ca}-${site_k}`}>
                                <Field name={`${ngay}!${khachhang}!${site_k}!${Ca}#tong_so_nguoi_an`}>
                                    {({ input, meta }) => (
                                        <FormControl>
                                            <div className="flex items-center">
                                                <button
                                                    type="button"
                                                    aria-label={`Giảm ${Ca}-${site_k}`}
                                                    className="flex h-9 w-9 items-center justify-center text-[#71848a] transition hover:bg-[#e8f6f5] hover:text-[#318d89]"
                                                    onClick={() => input.onChange(Math.max(0, Number(input.value || 0) - 1))}
                                                >
                                                    <Icon as={MdRemove} boxSize={4} />
                                                </button>

                                                <Input
                                                    {...input}
                                                    type="number"
                                                    min={0}
                                                    value={input.value ?? ''}
                                                    aria-label={input.name}
                                                    className="!h-9 !w-20 !min-w-20 !rounded-none !border-x !border-y-0 !border-[#cfe3e0] !bg-white !px-2 !text-center !text-sm !font-semibold !text-[#24363d] focus:!border-[#49a7a2] focus:!shadow-none"
                                                    onWheel={(e) => e.currentTarget.blur()}
                                                    onKeyDown={(e) => {
                                                        if(e.key === "ArrowUp" || e.key === "ArrowDown") {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                />

                                                <button
                                                    type="button"
                                                    aria-label={`Tăng ${Ca}-${site_k}`}
                                                    className="flex h-9 w-9 items-center justify-center text-[#71848a] transition hover:bg-[#e8f6f5] hover:text-[#318d89]"
                                                    onClick={() => input.onChange(Number(input.value || 0) + 1)}
                                                >
                                                    <Icon as={MdAdd} boxSize={4} />
                                                </button>
                                            </div>
                                        </FormControl>
                                    )}
                                </Field>
                            </QuantityInput>
                        </React.Fragment>
                    );

                    // *** 2 - Số lượng đăng ký theo cơ cấu suất ăn
                    const cocauSuatChayNuoc = datas
                        .filter(item =>
                            (item.SiteAn.includes(site_k)) && (item.Ca === Ca) && (item.CoCauSuatAn === "Suất chay" || item.CoCauSuatAn === "Suất nước")
                        )
                        .map(item => ({
                            "Ca": item.Ca, "SiteAn": site_k, "CoCauSuatAn": item.CoCauSuatAn
                        }));
                    const uniqueCoCauSuatChayNuoc = _.uniqBy(cocauSuatChayNuoc, item => `${item.CoCauSuatAn}`);

                    for(let l = 0; l < uniqueCoCauSuatChayNuoc.length; l++) {
                        const { CoCauSuatAn } = uniqueCoCauSuatChayNuoc[l];

                        tpSoLuongDangKyTheoCoCauSuatAnComponents.push(
                            <React.Fragment key={`${ngay}!${khachhang}-${site_k}-${Ca}-${CoCauSuatAn}`}>
                                <QuantityInput
    label={`${Ca}-${site_k}`}
    meal={CoCauSuatAn}
>
                                    <Field name={`${ngay}!${khachhang}!${site_k}!${Ca}#${CoCauSuatAn}!so_luong_dang_ky_theo_co_cau_suat_an`}>
                                        {({ input, meta }) => (
                                            <FormControl>
                                                <div className="flex items-center">
                                                    <button
                                                        type="button"
                                                        aria-label={`Giảm ${Ca}-${site_k}-${CoCauSuatAn}`}
                                                        className="flex h-9 w-9 items-center justify-center text-[#71848a] transition hover:bg-[#e8f6f5] hover:text-[#318d89]"
                                                        onClick={() => input.onChange(Math.max(0, Number(input.value || 0) - 1))}
                                                    >
                                                        <Icon as={MdRemove} boxSize={4} />
                                                    </button>

                                                    <Input
                                                        {...input}
                                                        type="number"
                                                        min={0}
                                                        value={input.value ?? ''}
                                                        aria-label={input.name}
                                                        className="!h-9 !w-20 !min-w-20 !rounded-none !border-x !border-y-0 !border-[#cfe3e0] !bg-white !px-2 !text-center !text-sm !font-semibold !text-[#24363d] focus:!border-[#49a7a2] focus:!shadow-none"
                                                        onWheel={(e) => e.currentTarget.blur()}
                                                        onKeyDown={(e) => {
                                                            if(e.key === "ArrowUp" || e.key === "ArrowDown") {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                    />

                                                    <button
                                                        type="button"
                                                        aria-label={`Tăng ${Ca}-${site_k}-${CoCauSuatAn}`}
                                                        className="flex h-9 w-9 items-center justify-center text-[#71848a] transition hover:bg-[#e8f6f5] hover:text-[#318d89]"
                                                        onClick={() => input.onChange(Number(input.value || 0) + 1)}
                                                    >
                                                        <Icon as={MdAdd} boxSize={4} />
                                                    </button>
                                                </div>
                                            </FormControl>
                                        )}
                                    </Field>
                                </QuantityInput>
                            </React.Fragment>
                        );
                    }
                }
            }

            // Tổng lại
            tabPanelComponents.push(
                <TabPanel key={`${ngay}!${khachhang}-${Ca}`} className="!px-0 !py-3">
                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                        <section className="rounded-2xl border border-[#dfeceb] bg-white p-4 shadow-[0_8px_28px_rgba(41,91,95,.07)]">
                            <div className="mb-3 flex items-center gap-2 border-b border-[#e8f0ef] pb-3">
                                <div className="h-2 w-2 rounded-full bg-[#49a7a2]" />
                                <Heading size="sm" className="!font-['Space_Grotesk'] !text-[#24363d]">
                                    Tổng số người ăn
                                </Heading>
                            </div>

                            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                {tpTongSoNguoiAnComponents}
                            </div>

                            {!tpTongSoNguoiAnComponents.length && (
                                <div className="rounded-xl bg-[#f5f8f8] px-4 py-6 text-center text-sm text-[#71848a]">
                                    Không có Site ăn.
                                </div>
                            )}
                        </section>

                        <section className="rounded-2xl border border-[#dfeceb] bg-white p-4 shadow-[0_8px_28px_rgba(41,91,95,.07)]">
                            <div className="mb-3 flex items-center gap-2 border-b border-[#e8f0ef] pb-3">
                                <div className="h-2 w-2 rounded-full bg-[#f08a62]" />
                                <Heading size="sm" className="!font-['Space_Grotesk'] !text-[#24363d]">
                                    Số lượng đăng ký theo cơ cấu suất ăn
                                </Heading>
                            </div>

                            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                {tpSoLuongDangKyTheoCoCauSuatAnComponents}
                            </div>

                            {!tpSoLuongDangKyTheoCoCauSuatAnComponents.length && (
                                <div className="rounded-xl bg-[#f5f8f8] px-4 py-6 text-center text-sm text-[#71848a]">
                                    Không có cơ cấu suất ăn cho ca này.
                                </div>
                            )}
                        </section>
                    </div>
                </TabPanel>
            );
        }

        return (
            <section className="overflow-hidden rounded-xl border border-[#e1e8ea] bg-white">
                <div className="flex items-center justify-between gap-3 bg-[#fbfcfd] px-4 py-3.5">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#eef8f7] text-[#38999a]">
                            <Icon as={MdCalendarToday} boxSize={4} />
                        </div>

                        <div className="min-w-0">
                            <Text className="!text-sm !font-extrabold !text-[#24363d]">
                                {thu}
                            </Text>

                            <Text className="mt-0.5 !truncate !text-[10px] !text-[#849398]">
                                {thucDonTuanDataFilterByThu[0]?.Ngay
                                    ? moment(thucDonTuanDataFilterByThu[0]?.Ngay).format("DD/MM/YYYY")
                                    : "Không có thực đơn"}
                            </Text>
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                        <span className={`rounded-full px-3 py-1 text-[9px] font-bold ${
                            uniqueCaArray.length > 0
                                ? 'bg-[#eaf7f5] text-[#3d8f8c]'
                                : 'bg-[#f0f2f3] text-[#879398]'
                        }`}>
                            {uniqueCaArray.length > 0
                                ? `${uniqueCaArray.length} ca`
                                : 'Chưa có dữ liệu'}
                        </span>
                    </div>
                </div>

                {uniqueCaArray.length > 0 ? (
                    <div className="border-t border-[#edf2f3]">
                        <Tabs variant="soft-rounded" colorScheme="teal" p={4}>
                            <TabList className="!flex !gap-2 !overflow-x-auto !pb-1">
                                {uniqueCaArray.map((item, idx) => (
                                    <Tab
                                        key={idx}
                                        className="!whitespace-nowrap !rounded-lg !px-4 !py-2 !text-[10px] !font-bold !uppercase data-[selected]:!bg-[#3e9999] data-[selected]:!text-white"
                                    >
                                        {item?.["Ca"]}
                                    </Tab>
                                ))}
                            </TabList>

                            <TabPanels>
                                {tabPanelComponents}
                            </TabPanels>
                        </Tabs>
                    </div>
                ) : (
                    <div className="flex min-h-[72px] items-center justify-center border-t border-[#edf2f3] px-4 text-center">
                        <Text className="!text-[10px] !text-[#8d999d]">
                            Không có dữ liệu thực đơn cho ngày này.
                        </Text>
                    </div>
                )}
            </section>
        );
    }

    const BaoSoLuongKhachHangContent = ({ title }) => {
        return (
            <Form
                onSubmit={onSubmit}
                render={({ handleSubmit, form, submitting, pristine, valid, values }) => {
                    return (
                        <form onSubmit={handleSubmit}>
                            <section className="overflow-hidden rounded-2xl border border-[#e1e9ea] bg-white shadow-[0_12px_38px_rgba(31,72,77,.07)]">
                                <div className="flex flex-col gap-4 border-b border-[#edf2f3] px-5 py-5 md:flex-row md:items-center md:justify-between md:px-6">
                                    <div>
                                        <div className="mb-1.5 flex items-center gap-2">
                                            <span className="h-2.5 w-2.5 rounded-full bg-[#49a7a2]" />

                                            <Text className="!text-[10px] !font-extrabold !uppercase !tracking-[.14em] !text-[#71848a]">
                                                Khách hàng
                                            </Text>
                                        </div>

                                        <Heading
                                            size="lg"
                                            className="!font-['Space_Grotesk'] !text-[#24363d]"
                                        >
                                            {title}
                                        </Heading>

                                        <Text className="mt-1 !text-[10px] !text-[#8a989d]">
                                            Theo dõi và nhập số lượng theo từng ngày, ca và site.
                                        </Text>
                                    </div>

                                    <Button
                                        type="submit"
                                        h="42px"
                                        px={5}
                                        borderRadius="10px"
                                        bg="#3e9999"
                                        color="white"
                                        fontSize="10px"
                                        fontWeight="800"
                                        leftIcon={<Icon as={MdSend} boxSize={4} />}
                                        isLoading={submitting || isLoading}
                                        loadingText="Đang cập nhật"
                                        _hover={{
                                            bg: '#337f80',
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

                                <div className="space-y-2.5 bg-[#f8fafb] p-4 md:p-5">
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
                    )
                }}
            />
        )
    }

    const currentFromDateInput = formatDateInputValue(selectedFromDate);
    const currentToDateInput = formatDateInputValue(selectedToDate);

    return (
        <Flex className="min-h-full w-full flex-col bg-[#f6f9fa] text-[#24363d]">

            <Flex className="w-full flex-col px-4 py-5 md:px-6 lg:px-8">

                {errorMessage && (
                    <Alert
                        status="error"
                        className="mb-4 !rounded-xl !border !border-red-100 !bg-red-50"
                    >
                        <AlertIcon />
                        <AlertDescription className="!text-xs">
                            {errorMessage}
                        </AlertDescription>
                    </Alert>
                )}

                <section className="overflow-hidden rounded-2xl border border-[#e1e9ea] bg-white shadow-[0_8px_28px_rgba(35,78,83,.06)]">
                    <div className="border-b border-[#edf2f3] px-5 py-4 md:px-6">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-2">
                                <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#eaf7f7] text-[#36979a]">
                                    <Icon as={MdSearch} boxSize={4} />
                                </div>

                                <div>
                                    <Text className="!text-[12px] !font-extrabold !uppercase !tracking-[.08em] !text-[#46636a]">
                                        Bộ lọc tìm kiếm
                                    </Text>

                                    <Text className="!mt-0.5 !text-[10px] !text-[#8a989d]">
                                        Chọn khách hàng và khoảng ngày cần báo số lượng.
                                    </Text>
                                </div>
                            </div>

                            {selectedClient && (
                                <span className="inline-flex w-fit items-center rounded-full bg-[#eef8f7] px-3 py-1.5 text-[10px] font-bold text-[#398c8d]">
                                    {selectedClient}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2 xl:grid-cols-[1.25fr_1fr_1fr_auto] xl:items-end md:p-6">

                        <div>
                            <label className="mb-1.5 block text-[10px] font-extrabold uppercase tracking-[.05em] text-[#63767d]">
                                Chọn khách hàng
                            </label>

                            <Select
                                value={selectedClient || ''}
                                placeholder="Chọn khách hàng"
                                onChange={(evt) => {
                                    setSelectedClient(evt.target.value)
                                }}
                                disabled={isLoading || !clientDatas.length}
                                className="!h-[42px] !rounded-[10px] !border-[#d8e4e5] !bg-white !text-xs !font-medium !text-[#33484f] focus:!border-[#4da4a2] focus:!shadow-none"
                            >
                                {clientDatas
                                    .slice()
                                    .sort((a,b) => a.localeCompare(b))
                                    .map((key, idx) => (
                                        <option key={`warehouse-${key}`} value={key}>
                                            {key}
                                        </option>
                                    ))}
                            </Select>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-[10px] font-extrabold uppercase tracking-[.05em] text-[#63767d]">
                                Từ ngày
                            </label>

                            <div className="relative">
                                <Icon
                                    as={MdCalendarToday}
                                    boxSize={4}
                                    className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[#7b8e93]"
                                />

                                <Input
                                    aria-label="Chọn từ ngày"
                                    type="date"
                                    value={currentFromDateInput}
                                    onChange={(e) => setSelectedFromDate(e.target.value ? new Date(`${e.target.value}T00:00:00+07:00`) : null)}
                                    className="!h-[42px] !rounded-[10px] !border-[#d8e4e5] !bg-white !pl-10 !text-xs focus:!border-[#4da4a2] focus:!shadow-none"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-[10px] font-extrabold uppercase tracking-[.05em] text-[#63767d]">
                                Đến ngày
                            </label>

                            <div className="relative">
                                <Icon
                                    as={MdCalendarToday}
                                    boxSize={4}
                                    className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[#7b8e93]"
                                />

                                <Input
                                    aria-label="Chọn đến ngày"
                                    type="date"
                                    value={currentToDateInput}
                                    onChange={(e) => setSelectedToDate(e.target.value ? new Date(`${e.target.value}T00:00:00+07:00`) : null)}
                                    className="!h-[42px] !rounded-[10px] !border-[#d8e4e5] !bg-white !pl-10 !text-xs focus:!border-[#4da4a2] focus:!shadow-none"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <Button
                            onClick={handleSearch}
                            h="42px"
                            px={6}
                            borderRadius="10px"
                            bg="#3e9999"
                            color="white"
                            fontSize="11px"
                            fontWeight="800"
                            leftIcon={
                                isLoading
                                    ? <Spinner size="sm" />
                                    : <Icon as={MdSearch} boxSize={4} />
                            }
                            isDisabled={isLoading}
                            _hover={{
                                bg: '#337f80',
                                transform: 'translateY(-1px)'
                            }}
                            _active={{
                                transform: 'translateY(0)'
                            }}
                            transition="all .18s ease"
                        >
                            {isLoading ? 'Đang tải...' : 'Tìm kiếm'}
                        </Button>
                    </div>

                    <div className="h-1 bg-gradient-to-r from-[#48a8a5] via-[#5ab8b4] to-[#79c6c2]" />
                </section>

                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">

                    <div className="rounded-2xl border border-[#e1e9ea] bg-white p-4 shadow-[0_5px_20px_rgba(35,78,83,.045)]">
                        <div className="flex items-center gap-3">
                            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#eaf3ff] text-[#3885db]">
                                <Icon as={MdCalendarToday} boxSize={5} />
                            </div>

                            <div className="min-w-0">
                                <Text className="!text-[10px] !font-medium !text-[#788a90]">
                                    Khoảng ngày
                                </Text>

                                <Text className="mt-1 !truncate !text-sm !font-extrabold !text-[#24363d]">
                                    {selectedFromDate
                                        ? moment(selectedFromDate).format('DD/MM/YYYY')
                                        : '—'}
                                </Text>

                                <Text className="mt-0.5 !text-[9px] !text-[#99a5a9]">
                                    Ngày bắt đầu
                                </Text>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-[#e1e9ea] bg-white p-4 shadow-[0_5px_20px_rgba(35,78,83,.045)]">
                        <div className="flex items-center gap-3">
                            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#edf8ef] text-[#35a04e]">
                                <Icon as={MdCalendarToday} boxSize={5} />
                            </div>

                            <div className="min-w-0">
                                <Text className="!text-[10px] !font-medium !text-[#788a90]">
                                    Đến ngày
                                </Text>

                                <Text className="mt-1 !truncate !text-sm !font-extrabold !text-[#24363d]">
                                    {selectedToDate
                                        ? moment(selectedToDate).format('DD/MM/YYYY')
                                        : '—'}
                                </Text>

                                <Text className="mt-0.5 !text-[9px] !text-[#99a5a9]">
                                    Ngày kết thúc
                                </Text>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-[#e1e9ea] bg-white p-4 shadow-[0_5px_20px_rgba(35,78,83,.045)]">
                        <div className="flex items-center gap-3">
                            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#fff5e9] text-[#e49a32]">
                                <Icon as={MdSearch} boxSize={5} />
                            </div>

                            <div className="min-w-0">
                                <Text className="!text-[10px] !font-medium !text-[#788a90]">
                                    Dữ liệu thực đơn
                                </Text>

                                <Text className="mt-1 !text-xl !font-extrabold !text-[#24363d]">
                                    {thucDonTuanDatas.length}
                                </Text>

                                <Text className="mt-0.5 !text-[9px] !text-[#99a5a9]">
                                    Số dòng nhận được
                                </Text>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-[#e1e9ea] bg-white p-4 shadow-[0_5px_20px_rgba(35,78,83,.045)]">
                        <div className="flex items-center gap-3">
                            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#f3edff] text-[#8150da]">
                                <Icon as={MdCheckCircle} boxSize={5} />
                            </div>

                            <div className="min-w-0">
                                <Text className="!text-[10px] !font-medium !text-[#788a90]">
                                    Trạng thái
                                </Text>

                                <Text className="mt-1 !text-sm !font-extrabold !text-[#24363d]">
                                    {thucDonTuanDatas.length > 0 ? 'Đã có dữ liệu' : 'Chưa có dữ liệu'}
                                </Text>

                                <Text className="mt-0.5 !text-[9px] !text-[#99a5a9]">
                                    Theo kết quả tìm kiếm
                                </Text>
                            </div>
                        </div>
                    </div>
                </div>

                <BaoSoLuongKhachHangContent  />
            </Flex>

            {isLoading && (
                <Center className="fixed inset-0 z-[9999] bg-[#edf4f4]/55 backdrop-blur-[2px]">
                    <div className="rounded-2xl border border-[#dce9e8] bg-white px-8 py-7 text-center shadow-[0_18px_55px_rgba(31,72,77,.15)]">
                        <Spinner size="xl" thickness="4px" speed="0.7s" color="#318d89" />

                        <Text mt={3} className="!text-sm !font-bold !text-[#318d89]">
                            Đang tải dữ liệu...
                        </Text>
                    </div>
                </Center>
            )}
        </Flex>
    )
}

export default BaoSoLuongKhachHangContainer;