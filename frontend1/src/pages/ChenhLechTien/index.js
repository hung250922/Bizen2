import React, {useState, useEffect, useRef} from 'react';
import { 
    Flex, Center, CircularProgress, CircularProgressLabel, Text, Button, Icon, useToast,
    HStack, Alert, AlertIcon, AlertDescription, Select, Heading, 
    Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer,
    Tabs, TabList, TabPanels, Tab, TabPanel,
} from '@chakra-ui/react';
import { Row, Col, Card, Statistic, Typography, Progress } from "antd";
import { useCookies } from "react-cookie";
import axios from 'axios';
import { MdDownload, MdSearch } from 'react-icons/md';
import { FormattedNumber } from "react-intl";
import { useLocation, useNavigate } from "react-router-dom";
import DatePicker from 'react-date-picker';
import "react-date-picker/dist/DatePicker.css";
import 'react-calendar/dist/Calendar.css';
import { MultiSelect } from "react-multi-select-component";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import _, { get } from 'lodash';
import { sleep, formatter } from '../../utils/helpers';
import httpClient from '../../services/http-client';
import moment from 'moment';
const { Title } = Typography;
const intl = Intl.NumberFormat();

function ChenhLechTienPage({ }) {
    const [ cookies, setCookie, removeCookie ] = useCookies(["loginCookie"]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAllowAccessThisPage, setIsAllowAccessThisPage] = useState(true);
    const [initDatas, setInitDatas] = useState({});
    const [errorMessage, setErrorMessage] = useState(null);
    const [selectedStoreName, setSelectedStoreName] = useState(0);
    const [selectedFromDate, setSelectedFromDate] = useState(null);
    const [selectedToDate, setSelectedToDate] = useState(null);
    const [fabiDatas, setFabiDatas] = useState([]);
    const [vnPayDatas, setVnPayDatas] = useState([]);
    const [momoDatas, setMomoDatas] = useState([]);
    const [grabDatas, setGrabDatas] = useState([]);
    const [befoodDatas, setBefoodDatas] = useState([]);
    const [shopeeDatas, setShopeeDatas] = useState([]);
    const [vietcombankDatas, setVietcombankDatas] = useState([]);

    const [doanhThuTableDatas, setDoanhThuTableDatas] = useState({
        "days": [],
        "total": {}
    });
    const [vnpayTableDatas, setVnpayTableDatas] = useState([]);
    const [momoTableDatas, setMomoTableDatas] = useState([]);
    const [grabTableDatas, setGrabTableDatas] = useState([]);
    const [befoodTableDatas, setBefoodTableDatas] = useState([]);
    const [shopeeTableDatas, setShopeeTableDatas] = useState([]);
    const [totalLoadedDatas, setTotalLoadedDatas] = useState(0);

    const navigate = useNavigate();
    const toast = useToast();
    const mouted = useRef();

    const { search } = useLocation();
    const htmlDownloadRef = useRef();

    useEffect(() => {
        if(!mouted.current) {
            if(
                cookies.loginCookie?.data?.scope === "admin" || 
                cookies.loginCookie?.data?.scope === "dashboard" || 
                cookies.loginCookie?.data?.scope === "all") {
                loadInitDatas();
            } else {
                setIsAllowAccessThisPage(false);
                console.log("--- not authorized to access dashboard page");
            }
            mouted.current = true;
        }
    }, []);

    const loadInitDatas = async() => {
        setIsLoading(true);
        const res = await httpClient.get(`/larksuite/init-datas`);
        
        if(!res.data.error) {
            setInitDatas(res.data.data);
            setIsLoading(false);
        } else {
            setErrorMessage("Lỗi:" + JSON.stringify(res.data?.error?.message));
            setIsLoading(false);
        }
    }

    console.log("--- totalLoadedDatas:", totalLoadedDatas);

    useEffect(() => {
        // if(totalLoadedDatas === 7) {
        if(doanhThuTableDatas.days.length === 0) {
            // console.log("--- fabiDatas:", fabiDatas);
            let _doanhThuTableDatas = {
                "days": [],
                "total": {}
            };
            // let totalDays = [];
            for(let i=1; i<= 31; i++) {
                // totalDays.push(i);
                _doanhThuTableDatas.days.push(i);
            }

            setDoanhThuTableDatas(_doanhThuTableDatas);
        }
    }, []);

    // useEffect(() => {
    //     if(totalLoadedDatas === 7) {
    //     // if(doanhThuTableDatas.length === 0) {
    //         console.log("--- fabiDatas:", fabiDatas);
    //         let _doanhThuTableDatas = {
    //             "details": {},
    //             "total": {}
    //         };
    //         let totalDays = [];
    //         for(let i=1; i<= 31; i++) {
    //             totalDays.push(i);
    //             // totalDays.push({
    //             //     ngay: i
    //             // });
    //         }

    //         let fabiTienMatTotal = 0;
    //         let fabiATMTotal = 0;
    //         let fabiMomoTotal = 0;
    //         let fabiVnPayTotal = 0;
    //         let totalFabiChiPhiTienMatTotal = 0;
    //         let totalFabiChiPhiATMTotal = 0;
    //         let totalFabiChiPhiMomoTotal = 0;
    //         let totalFabiChiPhiVnPayTotal = 0;
    //         let grabDoanhThuGrossTotal = 0;
    //         let grabChiPhiTotal = 0;
    //         let grabDoanhThuNetTotal = 0;
    //         let befoodDoanhThuGrossTotal = 0;
    //         let befoodChiPhiTotal = 0;
    //         let befoodDoanhThuNetTotal = 0;
    //         let shopeeDoanhThuGrossTotal = 0;
    //         let shopeeChiPhiTotal = 0;
    //         let shopeeDoanhThuNetTotal = 0;
    //         let tongDoanhThuGrossTotal = 0;
    //         let tongChiPhiTotal = 0;
    //         let tongDoanhThuNetTotal = 0;

    //         totalDays.map((ngay, idx) => {
    //             console.log("ngay:", ngay);
    //             //const { ngay, } = item;
    //             const findFabiDatas = fabiDatas.filter(fabiItem => {
    //                 return fabiItem.Date && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() === ngay;
    //             });
    //             const fabiTienMat = Math.abs(findFabiDatas.reduce((acc, item) => acc + (item["CashMoney"] || 0), 0));
    //             const fabiATM = Math.abs(findFabiDatas.reduce((acc, item) => acc + (item.SaleMetricsArray?.["Sale ATM"] || 0), 0));
    //             const fabiMomo = Math.abs(findFabiDatas.reduce((acc, item) => acc + (item.SaleMetricsArray?.["Sale Momo Pay"] || 0), 0));
    //             const fabiVnPay = Math.abs(findFabiDatas.reduce((acc, item) => acc + (item.SaleMetricsArray?.["Sale VnPay"] || 0), 0));

    //             const totalFabiChiPhiTienMat = Math.abs(findFabiDatas.reduce((acc, item) => acc + (item.SaleMetricsArray?.["Chi phí Tiền mặt"] || 0), 0));
    //             const totalFabiChiPhiATM = Math.abs(findFabiDatas.reduce((acc, item) => acc + (item.SaleMetricsArray?.["Chi phí ATM"] || 0), 0));
    //             const totalFabiChiPhiMomo = Math.abs(findFabiDatas.reduce((acc, item) => acc + (item.SaleMetricsArray?.["Chi phí Momo"] || 0), 0));
    //             const totalFabiChiPhiVnPay = Math.abs(findFabiDatas.reduce((acc, item) => acc + (item.SaleMetricsArray?.["Chi phí VnPay"] || 0), 0));

    //             const grabTableDataByDay = grabTableDatas.find(grabItem => grabItem.ngay === ngay);
    //             const grabDoanhThuGross = Math.abs(grabTableDataByDay ? grabTableDataByDay.doanh_thu_gross : 0);
    //             const grabChiPhi = Math.abs(grabTableDataByDay ? grabTableDataByDay.chi_phi_san_thuong_may_dien_tu : 0);
    //             const grabDoanhThuNet = Math.abs(grabTableDataByDay ? grabTableDataByDay.doanh_thu_net : 0);

    //             const befoodTableDataByDay = befoodTableDatas.find(befoodItem => befoodItem.ngay === ngay);
    //             const befoodDoanhThuGross = Math.abs(befoodTableDataByDay ? befoodTableDataByDay.doanh_thu_gross : 0);
    //             const befoodChiPhi = Math.abs(befoodTableDataByDay ? befoodTableDataByDay.chi_phi : 0);
    //             const befoodDoanhThuNet = Math.abs(befoodTableDataByDay ? befoodTableDataByDay.doanh_thu_net : 0);

    //             const shopeeTableDataByDay = shopeeTableDatas.find(shopeeItem => shopeeItem.ngay === ngay);
    //             const shopeeDoanhThuGross = Math.abs(shopeeTableDataByDay ? shopeeTableDataByDay.doanh_thu_gross : 0);
    //             const shopeeChiPhi = Math.abs(shopeeTableDataByDay ? shopeeTableDataByDay.chi_phi_shopee : 0);
    //             const shopeeDoanhThuNet = Math.abs(shopeeTableDataByDay ? shopeeTableDataByDay.thuc_thu : 0);

    //             const tongDoanhThuGross = 
    //                 fabiTienMat + fabiATM + fabiMomo + fabiVnPay + 
    //                 grabDoanhThuGross + befoodDoanhThuGross + shopeeDoanhThuGross;
                
    //             const tongChiPhi = totalFabiChiPhiTienMat + totalFabiChiPhiATM + totalFabiChiPhiMomo + totalFabiChiPhiVnPay + grabChiPhi + befoodChiPhi + shopeeChiPhi;
    //             const tongTienMatNet = fabiTienMat - totalFabiChiPhiTienMat;
    //             const tongMomoNet = fabiMomo - totalFabiChiPhiMomo;
    //             const tongATMNet = fabiATM - totalFabiChiPhiATM;
    //             const tongVnPayNet = fabiVnPay - totalFabiChiPhiVnPay;
    //             const tongDoanhThuNet = tongDoanhThuGross - tongChiPhi;

    //             fabiTienMatTotal += fabiTienMat;
    //             fabiATMTotal += fabiATM;
    //             fabiMomoTotal += fabiMomo;
    //             fabiVnPayTotal += fabiVnPay;
    //             totalFabiChiPhiTienMatTotal += totalFabiChiPhiTienMat;
    //             totalFabiChiPhiATMTotal += totalFabiChiPhiATM;
    //             totalFabiChiPhiMomoTotal += totalFabiChiPhiMomo;
    //             totalFabiChiPhiVnPayTotal += totalFabiChiPhiVnPay;
    //             grabDoanhThuGrossTotal += grabDoanhThuGross;
    //             grabChiPhiTotal += grabChiPhi;
    //             grabDoanhThuNetTotal += grabDoanhThuNet;
    //             befoodDoanhThuGrossTotal += befoodDoanhThuGross;
    //             befoodChiPhiTotal += befoodChiPhi;
    //             befoodDoanhThuNetTotal += befoodDoanhThuNet;
    //             shopeeDoanhThuGrossTotal += shopeeDoanhThuGross;
    //             shopeeChiPhiTotal += shopeeChiPhi;
    //             shopeeDoanhThuNetTotal += shopeeDoanhThuNet;
    //             tongDoanhThuGrossTotal += tongDoanhThuGross;
    //             tongChiPhiTotal += tongChiPhi;
    //             tongDoanhThuNetTotal += tongDoanhThuNet;

    //             _doanhThuTableDatas["details"][ngay] = {
    //                 // ...item,
    //                 fabiTienMat,
    //                 fabiATM,
    //                 fabiMomo,
    //                 fabiVnPay,
    //                 totalFabiChiPhiTienMat,
    //                 totalFabiChiPhiATM,
    //                 totalFabiChiPhiMomo,
    //                 totalFabiChiPhiVnPay,
    //                 grabDoanhThuGross,
    //                 grabChiPhi,
    //                 grabDoanhThuNet,
    //                 befoodDoanhThuGross,
    //                 befoodChiPhi,
    //                 befoodDoanhThuNet,
    //                 shopeeDoanhThuGross,
    //                 shopeeChiPhi,
    //                 shopeeDoanhThuNet,
    //                 tongDoanhThuGross,
    //                 tongChiPhi,
    //                 tongDoanhThuNet,
    //                 tongTienMatNet,
    //                 tongMomoNet,
    //                 tongATMNet,
    //                 tongVnPayNet,
    //             }
    //         });

    //         _doanhThuTableDatas["total"] = {
    //             fabiTienMatTotal,
    //             fabiATMTotal,
    //             fabiMomoTotal,
    //             fabiVnPayTotal,
    //             totalFabiChiPhiTienMatTotal,
    //             totalFabiChiPhiATMTotal,
    //             totalFabiChiPhiMomoTotal,
    //             totalFabiChiPhiVnPayTotal,
    //             grabDoanhThuGrossTotal,
    //             grabChiPhiTotal,
    //             grabDoanhThuNetTotal,
    //             befoodDoanhThuGrossTotal,
    //             befoodChiPhiTotal,
    //             befoodDoanhThuNetTotal,
    //             shopeeDoanhThuGrossTotal,
    //             shopeeChiPhiTotal,
    //             shopeeDoanhThuNetTotal,
    //             tongDoanhThuGrossTotal,
    //             tongChiPhiTotal,
    //             tongDoanhThuNetTotal
    //         }

    //         setDoanhThuTableDatas(_doanhThuTableDatas);
    //     }
    // }, []);
    // }, [fabiDatas]);

    useEffect(() => {
        let _vnpayTableDatas = [];
      
        for(let i=1; i<= 31; i++) {
            const vnPayDataByDay = vnPayDatas.filter(item => {
                return moment(item.thoi_gian_giao_dich, "YYYY-MM-DD").toDate().getDate() === i;
            });
            //console.log(`vnPayDataByDay for day ${i}:`, vnPayDataByDay);
            _vnpayTableDatas.push({
                ngay: i,
                ten_app: "VNPay",
                doanh_thu_thuan: vnPayDataByDay.filter(doc => doc.loai_giao_dich?.indexOf("Thu hộ") !== -1).reduce((acc, item) => acc + item.so_tien_gd_vnd, 0),
                phi_dich_vu: vnPayDataByDay.filter(doc => doc.loai_giao_dich?.indexOf("Thu phí") !== -1).reduce((acc, item) => acc + item.so_tien_gd_vnd, 0)
                //doanh_thu_thuan: vnPayDataByDay.filter(doc => doc.loai_giao_dich === "Giao dịch thu hộ").reduce((acc, item) => acc + item.so_tien_ghi_co_vnd, 0),
                //phi_dich_vu: vnPayDataByDay.filter(doc => doc.loai_giao_dich === "Thu phí").reduce((acc, item) => acc + item.so_tien_ghi_no_vnd, 0)
            });
        }
        setVnpayTableDatas(_vnpayTableDatas);
    }, [vnPayDatas]);

    console.log("--- doanhThuTableDatas:", doanhThuTableDatas);
    //console.log("VNPay Table Datas:", vnpayTableDatas);
    useEffect(() => {
        let _momoTableDatas = [];
        for(let i=1; i<= 31; i++) {
            const momoDataByDay = momoDatas.filter(item => {
                return moment(item.thoi_gian, "YYYY-MM-DD").toDate().getDate() === i;
            });
            //console.log(`momoDataByDay for day ${i}:`, momoDataByDay);
            _momoTableDatas.push({
                ngay: i,
                ten_app: "Momo",
                so_tien: momoDataByDay.reduce((acc, item) => acc + item.so_tien, 0)
            });
        }
        setMomoTableDatas(_momoTableDatas);
    }, [momoDatas]);

    useEffect(() => {
        let _grabTableDatas = [];
        for(let i=1; i<= 31; i++) {
            const grabDataByDay = grabDatas.filter(item => {
                return moment(item.ngay_tao, "YYYY-MM-DD").toDate().getDate() === i;
            });
            //const grabDataByDaThanhToanFiltered = grabDataByDay.filter(item => item.trang_thai === "Đã thanh toán" && item.danh_muc === "Thanh toán");
            //const grabDataByQuangCaoFiltered = grabDataByDay.filter(item => item.trang_thai === "Đã thanh toán" && item.danh_muc === "Quảng cáo");
            
            const grabDataByDaThanhToanFiltered = grabDataByDay.filter(item => item.danh_muc?.indexOf("Thanh toán") !== -1);
            const grabDataByQuangCaoFiltered = grabDataByDay.filter(item => item.danh_muc?.indexOf("Quảng cáo") !== -1);

            const doanh_thu_gross = Math.abs(grabDataByDaThanhToanFiltered.reduce((acc, item) => acc + item.so_tien, 0));
            const giam_gia_quan_tai_tro = Math.abs(grabDataByDaThanhToanFiltered.reduce((acc, item) => acc + (item.giam_gia || 0), 0));
            const giam_phi_giao_hang_quan_tai_tro = Math.abs(grabDataByDaThanhToanFiltered.reduce((acc, item) => acc + (item.giam_phi_giao_hang || 0), 0));
            const quang_cao_tai_tro = Math.abs(grabDataByQuangCaoFiltered.reduce((acc, item) => acc + (item.tong_cong || 0), 0));
            const chiet_khau_tu_cac_kenh_ban_hang = Math.abs(grabDataByDaThanhToanFiltered.reduce((acc, item) => acc + (item.chiet_khau_tu_cac_kenh_ban_hang || 0), 0));
            const vat_amount = Math.abs(grabDataByDaThanhToanFiltered.reduce((acc, item) => acc + (item.vat_amount || 0), 0));
            const pit_amount = Math.abs(grabDataByDaThanhToanFiltered.reduce((acc, item) => acc + (item.pit_amount || 0), 0));
            const chi_phi_san_thuong_may_dien_tu = 
                giam_gia_quan_tai_tro + giam_phi_giao_hang_quan_tai_tro + quang_cao_tai_tro + 
                chiet_khau_tu_cac_kenh_ban_hang + vat_amount + pit_amount;
            const doanh_thu_net = doanh_thu_gross - chi_phi_san_thuong_may_dien_tu;

            _grabTableDatas.push({
                ngay: i,
                ten_app: "Grab",
                doanh_thu_gross,
                giam_gia_quan_tai_tro,
                giam_phi_giao_hang_quan_tai_tro,
                quang_cao_tai_tro,
                chiet_khau_tu_cac_kenh_ban_hang,
                vat_amount,
                pit_amount,
                chi_phi_san_thuong_may_dien_tu,
                doanh_thu_net,
            });
            // console.log(`_grabTableDatas for day ${i}:`, _grabTableDatas);
        }
        setGrabTableDatas(_grabTableDatas);
    }, [grabDatas]);

    // console.log("Vietcombank Table Datas:", vietcombankDatas);

    useEffect(() => {
        let _befoodTableDatas = [];
        for(let i=1; i<= 31; i++) {
            const befoodDataByDay = befoodDatas.filter(item => {
                return moment(item.thoi_gian_dat_hang, "YYYY-MM-DD").toDate().getDate() === i;
            });
            const doanh_thu_gross = befoodDataByDay.reduce((acc, item) => acc + item.gia_tri_don_hang, 0);
            const khuyen_mai_tu_nguoi_ban = befoodDataByDay.reduce((acc, item) => acc + (item.km_tu_nguoi_ban || 0), 0);
            const phi_dv_tmdt = befoodDataByDay.reduce((acc, item) => acc + (item.phi_dv_tmdt || 0), 0);
            const thue_vat = befoodDataByDay.reduce((acc, item) => acc + (item.thue_vat || 0), 0);
            const thue_pit = befoodDataByDay.reduce((acc, item) => acc + (item.thue_pit || 0), 0);
            const chi_phi = khuyen_mai_tu_nguoi_ban + phi_dv_tmdt + thue_vat + thue_pit;
            const doanh_thu_net = doanh_thu_gross - chi_phi;

            _befoodTableDatas.push({
                ngay: i,
                ten_app: "BeFood",
                doanh_thu_gross,
                chi_phi,
                doanh_thu_net,
            });
        }
        setBefoodTableDatas(_befoodTableDatas);
    }, [befoodDatas]);

    useEffect(() => {
        let _shopeeTableDatas = [];
        for(let i=1; i<= 31; i++) {
            const shopeeDataByDay = shopeeDatas.filter(item => {
                return moment(item.ngay_dat_hang, "YYYY-MM-DD").toDate().getDate() === i;
            });
            const shopeeDataBySuccessFiltered = shopeeDataByDay.filter(item => item.tinh_trang_thanh_toan === "Success");

            const doanh_thu_gross = shopeeDataBySuccessFiltered.reduce((acc, item) => acc + item.thanh_tien_doanh_thu, 0);
            const giam_gia_mon = shopeeDataBySuccessFiltered.reduce((acc, item) => acc + (item.giam_gia_mon || 0), 0);
            
            const shopeeDataBySuccessFilteredUniqueMaDonHang = uniqueByKey(shopeeDataBySuccessFiltered, "ma_don_hang");
            const giam_gia_ma_khuyen_mai = shopeeDataBySuccessFilteredUniqueMaDonHang.reduce((acc, item) => acc + (item.giam_gia_ma_khuyen_mai || 0), 0);
            
            const so_tien_giam = shopeeDataBySuccessFilteredUniqueMaDonHang.reduce((acc, item) => acc + (item.so_tien_giam || 0), 0);
            const phi_dich_vu = shopeeDataBySuccessFilteredUniqueMaDonHang.reduce((acc, item) => acc + (item.phi_dich_vu || 0), 0);
            const thue_khau_tru = shopeeDataBySuccessFilteredUniqueMaDonHang.reduce((acc, item) => acc + (item.thue_khau_tru || 0), 0);
            

            const chi_phi_shopee = giam_gia_mon + giam_gia_ma_khuyen_mai + phi_dich_vu + thue_khau_tru;
            const thuc_thu = doanh_thu_gross - chi_phi_shopee;

            _shopeeTableDatas.push({
                ngay: i,
                ten_app: "Shopee",
                doanh_thu_gross,
                giam_gia_mon,
                giam_gia_ma_khuyen_mai,
                so_tien_giam,
                phi_dich_vu,
                thue_khau_tru,
                chi_phi_shopee,
                thuc_thu,
            });
            // console.log(`_shopeeTableDatas for day ${i}:`, _shopeeTableDatas);
        }
        setShopeeTableDatas(_shopeeTableDatas);
    }, [shopeeDatas]);

    function uniqueByKey(arr, key) {
        const seen = new Set();

        return arr.filter(item => {
            if (seen.has(item[key])) return false;
            seen.add(item[key]);
            return true;
        });
    }

    function removeDuplicateObjects(arr, key) {
        const count = arr.reduce((acc, item) => {
            const value = item[key];
            acc[value] = (acc[value] || 0) + 1;
            return acc;
        }, {});

        return arr.filter(item => count[item[key]] === 1);
    }

    const handleSearchByDate = async() => {
        if(!selectedStoreName) {
            alert("Vui lòng chọn cửa hàng!");
            return;
        } else if(!selectedFromDate) {
            alert("Vui lòng chọn ngày bắt đầu!");
            return;
        } else if(!selectedToDate) {
            alert("Vui lòng chọn ngày kết thúc!");
            return;
        }
        setTotalLoadedDatas(0);
        setIsLoading(true);
        await sleep(500);
        await getAppMoneyDatas({ appType: "fabi", storeName: selectedStoreName, fromDate: selectedFromDate, toDate: selectedToDate });
        await getAppMoneyDatas({ appType: "vnpay", storeName: selectedStoreName, fromDate: selectedFromDate, toDate: selectedToDate });
        await getAppMoneyDatas({ appType: "momo", storeName: selectedStoreName, fromDate: selectedFromDate, toDate: selectedToDate });
        await getAppMoneyDatas({ appType: "vietcombank", storeName: selectedStoreName, fromDate: selectedFromDate, toDate: selectedToDate });
        await getAppMoneyDatas({ appType: "grab", storeName: selectedStoreName, fromDate: selectedFromDate, toDate: selectedToDate });
        await getAppMoneyDatas({ appType: "befood", storeName: selectedStoreName, fromDate: selectedFromDate, toDate: selectedToDate });
        await getAppMoneyDatas({ appType: "shopee", storeName: selectedStoreName, fromDate: selectedFromDate, toDate: selectedToDate });
        setIsLoading(false);
    }

    const getAppMoneyDatas = async ({ appType, storeName, fromDate, toDate }) => {
        try {
            if(appType === "fabi") {
                const res = await httpClient.get(`/${appType}/list?storeName=${storeName}&&fromDate=${fromDate}&&toDate=${toDate}&&limit=10000000`);
                console.log("Fabi Res data:", res.data);
                setFabiDatas(res.data.data);
                setTotalLoadedDatas(prev => prev + 1);
            } else if(appType === "vnpay") {
                const res = await httpClient.get(`/${appType}/list?storeName=${storeName}&&fromDate=${fromDate}&&toDate=${toDate}&&limit=10000000`);
                console.log("VNPay Res data:", res.data);
                setVnPayDatas(res.data.data);
                setTotalLoadedDatas(prev => prev + 1);
            } else if(appType === "momo") {
                const res = await httpClient.get(`/${appType}/list?storeName=${storeName}&&fromDate=${fromDate}&&toDate=${toDate}&&limit=10000000`);
                console.log("Momo Res data:", res.data);
                setMomoDatas(res.data.data.filter(item => item.trang_thai === "Thành công"));
                setTotalLoadedDatas(prev => prev + 1);
            } else if(appType === "grab") {
                const res = await httpClient.get(`/${appType}/list?storeName=${storeName}&&fromDate=${fromDate}&&toDate=${toDate}&&limit=10000000`);
                console.log("Grab Res data:", res.data);
                setGrabDatas(res.data.data);
                setTotalLoadedDatas(prev => prev + 1);
            } else if(appType === "befood") {
                const res = await httpClient.get(`/${appType}/list?storeName=${storeName}&&fromDate=${fromDate}&&toDate=${toDate}&&limit=10000000`);
                console.log("BeFood Res data:", res.data);
                setBefoodDatas(res.data.data);
                setTotalLoadedDatas(prev => prev + 1);
            } else if (appType === "shopee") {
                const res = await httpClient.get(`/${appType}/list?storeName=${storeName}&&fromDate=${fromDate}&&toDate=${toDate}&&limit=10000000`);
                console.log("Shopee Res data:", res.data);
                setShopeeDatas(res.data.data);
                setTotalLoadedDatas(prev => prev + 1);
            } else if (appType === "vietcombank") {
                const res = await httpClient.get(`/${appType}/list?storeName=${storeName}&&fromDate=${fromDate}&&toDate=${toDate}&&limit=10000000`);
                console.log("Vietcombank Res data:", res.data);
                setVietcombankDatas(res.data.data);
                setTotalLoadedDatas(prev => prev + 1);
            } 

        } catch (error) {
            console.error("Error fetching sales data:", error);
        }
    }

    const DoanhThuComponent = () => {   
        return (
            <Flex ref={htmlDownloadRef} flexDirection="column" w="100%" mb={8}>
                {/* <Heading size="md" mb={4}>DÒNG TIỀN DOANH THU</Heading> */}
                <TableContainer mt={4}>
                    <Table variant="simple" size="sm">
                        <Thead>
                            <Tr textTransform="uppercase">
                                <Th></Th>
                                <Th textAlign="center" colSpan={8} bg="blue.500" color="white">DOANH THU (GROSS)</Th>
                                <Th textAlign="center" colSpan={7} bg="blue.700" color="white">GIẢM GIÁ, CHIẾT KHẤU, PHÍ APP</Th>
                                <Th textAlign="center" colSpan={9} bg="blue.900" color="white">DOANH THU (NET)</Th>
                            </Tr>
                            <Tr textTransform="uppercase">
                                <Th></Th>
                                <Th textAlign="center" colSpan={4} bg="green.300">OFFLINE</Th>
                                <Th textAlign="center" colSpan={3} bg="green.100">ONLINE</Th>
                                <Th textAlign="center"></Th>
                                <Th textAlign="center" colSpan={4} bg="green.300">OFFLINE</Th>
                                <Th textAlign="center" colSpan={3} bg="green.100">ONLINE</Th>
                                <Th textAlign="center"></Th>
                                <Th textAlign="center" colSpan={4} bg="green.300">OFFLINE</Th>
                                <Th textAlign="center" colSpan={3} bg="green.100">ONLINE</Th>
                            </Tr>
                            <Tr textTransform="uppercase">
                                <Th>NGÀY</Th>

                                {/* Doanh thu gross */}

                                <Th>TIỀN MẶT</Th>   
                                <Th>MOMO</Th>   
                                <Th>ATM</Th>   
                                <Th>VNPAY</Th>
                                <Th>GRAB</Th>
                                <Th>BEFOOD</Th>
                                <Th>SHOPEE</Th>
                                <Th>TỔNG</Th>
                            
                                {/* Giảm giá, chiết khấu */}

                                <Th>TIỀN MẶT</Th>   
                                <Th>MOMO</Th>   
                                <Th>ATM</Th>   
                                <Th>VNPAY</Th>
                                <Th>GRAB</Th>
                                <Th>BEFOOD</Th>
                                <Th>SHOPEE</Th>
                                <Th>TỔNG</Th>

                                {/* Doanh thu net */}

                                <Th>TIỀN MẶT</Th>   
                                <Th>MOMO</Th>   
                                <Th>ATM</Th>   
                                <Th>VNPAY</Th>
                                <Th>GRAB</Th>
                                <Th>BEFOOD</Th>
                                <Th>SHOPEE</Th>
                                <Th>TỔNG</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                //                  Object.keys(doanhThuTableDatas?.details || {}).length > 0 &&
                                // Object.keys(doanhThuTableDatas?.details || {}).map((ngay, idx) => {

                                doanhThuTableDatas.days.length > 0 && doanhThuTableDatas.days.map((ngay, idx) => {
                                    // const item = doanhThuTableDatas.details[ngay];
                                    // const { 
                                    //     fabiTienMat, fabiATM, fabiMomo, fabiVnPay,  
                                    //     totalFabiChiPhiTienMat, totalFabiChiPhiATM, totalFabiChiPhiMomo, totalFabiChiPhiVnPay,
                                    //     grabDoanhThuGross, grabChiPhi, grabDoanhThuNet,
                                    //     befoodDoanhThuGross, befoodChiPhi, befoodDoanhThuNet,
                                    //     shopeeDoanhThuGross, shopeeChiPhi, shopeeDoanhThuNet,
                                    //     tongDoanhThuGross, tongChiPhi, tongDoanhThuNet,
                                    //     tongTienMatNet, tongMomoNet, tongATMNet, tongVnPayNet,
                                    // } = item;

                                   // const { ngay, } = item;
                                    const findFabiDatas = fabiDatas.filter(fabiItem => {
                                        //return fabiItem.Date && (moment(fabiItem.Date, "YYYY-MM-DD").toDate().getDate() === ngay);
                                        return fabiItem.Date && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() === ngay;
                                    });
                                    const fabiTienMat = Math.abs(findFabiDatas.reduce((acc, item) => acc + (item["CashMoney"] || 0), 0));
                                    const fabiATM = Math.abs(findFabiDatas.reduce((acc, item) => acc + (item.SaleMetricsArray?.["Sale ATM"] || 0), 0));
                                    const fabiMomo = Math.abs(findFabiDatas.reduce((acc, item) => acc + (item.SaleMetricsArray?.["Sale Momo Pay"] || 0), 0));
                                    const fabiVnPay = Math.abs(findFabiDatas.reduce((acc, item) => acc + (item.SaleMetricsArray?.["Sale VnPay"] || 0), 0));

                                    const totalFabiChiPhiTienMat = Math.abs(findFabiDatas.reduce((acc, item) => acc + (item.SaleMetricsArray?.["Chi phí Tiền mặt"] || 0), 0));
                                    const totalFabiChiPhiATM = Math.abs(findFabiDatas.reduce((acc, item) => acc + (item.SaleMetricsArray?.["Chi phí ATM"] || 0), 0));
                                    const totalFabiChiPhiMomo = Math.abs(findFabiDatas.reduce((acc, item) => acc + (item.SaleMetricsArray?.["Chi phí Momo"] || 0), 0));
                                    const totalFabiChiPhiVnPay = Math.abs(findFabiDatas.reduce((acc, item) => acc + (item.SaleMetricsArray?.["Chi phí VnPay"] || 0), 0));

                                    const grabTableDataByDay = grabTableDatas.find(grabItem => grabItem.ngay === ngay);
                                    const grabDoanhThuGross = Math.abs(grabTableDataByDay ? grabTableDataByDay.doanh_thu_gross : 0);
                                    const grabChiPhi = Math.abs(grabTableDataByDay ? grabTableDataByDay.chi_phi_san_thuong_may_dien_tu : 0);
                                    const grabDoanhThuNet = Math.abs(grabTableDataByDay ? grabTableDataByDay.doanh_thu_net : 0);

                                    const befoodTableDataByDay = befoodTableDatas.find(befoodItem => befoodItem.ngay === ngay);
                                    const befoodDoanhThuGross = Math.abs(befoodTableDataByDay ? befoodTableDataByDay.doanh_thu_gross : 0);
                                    const befoodChiPhi = Math.abs(befoodTableDataByDay ? befoodTableDataByDay.chi_phi : 0);
                                    const befoodDoanhThuNet = Math.abs(befoodTableDataByDay ? befoodTableDataByDay.doanh_thu_net : 0);

                                    const shopeeTableDataByDay = shopeeTableDatas.find(shopeeItem => shopeeItem.ngay === ngay);
                                    const shopeeDoanhThuGross = Math.abs(shopeeTableDataByDay ? shopeeTableDataByDay.doanh_thu_gross : 0);
                                    const shopeeChiPhi = Math.abs(shopeeTableDataByDay ? shopeeTableDataByDay.chi_phi_shopee : 0);
                                    const shopeeDoanhThuNet = Math.abs(shopeeTableDataByDay ? shopeeTableDataByDay.thuc_thu : 0);

                                    const tongDoanhThuGross = 
                                        fabiTienMat + fabiATM + fabiMomo + fabiVnPay + 
                                        grabDoanhThuGross + befoodDoanhThuGross + shopeeDoanhThuGross;
                                    
                                    const tongChiPhi = totalFabiChiPhiTienMat + totalFabiChiPhiATM + totalFabiChiPhiMomo + totalFabiChiPhiVnPay + grabChiPhi + befoodChiPhi + shopeeChiPhi;
                                    const tongTienMatNet = fabiTienMat - totalFabiChiPhiTienMat;
                                    const tongMomoNet = fabiMomo - totalFabiChiPhiMomo;
                                    const tongATMNet = fabiATM - totalFabiChiPhiATM;
                                    const tongVnPayNet = fabiVnPay - totalFabiChiPhiVnPay;
                                    const tongDoanhThuNet = tongDoanhThuGross - tongChiPhi;

                                    return (
                                        <Tr key={idx}>
                                            <Td>
                                                {ngay}
                                            </Td>
                                            {/* Doanh thu gross */}
                                            <Td>
                                                <Text fontWeight="600">{formatter.format(Math.abs(fabiTienMat))}</Text>
                                            </Td>
                                            <Td>
                                                <Text fontWeight="600">{formatter.format(Math.abs(fabiMomo))}</Text>
                                            </Td>  
                                            <Td>
                                                <Text fontWeight="600">{formatter.format(Math.abs(fabiATM))}</Text>
                                            </Td>
                                            <Td>
                                                <Text fontWeight="600">{formatter.format(Math.abs(fabiVnPay))}</Text>
                                            </Td>
                                            <Td>
                                                <Text fontWeight="600">{formatter.format(grabDoanhThuGross)}</Text>
                                            </Td>
                                                <Td>
                                                <Text fontWeight="600">{formatter.format(befoodDoanhThuGross)}</Text>
                                            </Td>
                                            <Td>
                                                <Text fontWeight="600">{formatter.format(shopeeDoanhThuGross)}</Text>
                                            </Td>
                                            <Td bg="yellow.100">
                                                <Text fontWeight="600">{formatter.format(tongDoanhThuGross)}</Text>
                                            </Td>
    {/* 
                                            Chi phí, giảm giá, chiết khấu */}
                                            <Td>
                                                <Text fontWeight="600">{formatter.format(Math.abs(totalFabiChiPhiTienMat))}</Text>
                                            </Td>
                                            <Td>
                                                <Text fontWeight="600">{formatter.format(Math.abs(totalFabiChiPhiMomo))}</Text>
                                            </Td>  
                                            <Td>
                                                <Text fontWeight="600">{formatter.format(Math.abs(totalFabiChiPhiATM))}</Text>
                                            </Td>
                                            <Td>
                                                <Text fontWeight="600">{formatter.format(Math.abs(totalFabiChiPhiVnPay))}</Text>
                                            </Td>
                                            <Td>
                                                <Text fontWeight="600">{formatter.format(grabChiPhi)}</Text>
                                            </Td>
                                                <Td>
                                                <Text fontWeight="600">{formatter.format(befoodChiPhi)}</Text>
                                            </Td>
                                            <Td>
                                                <Text fontWeight="600">{formatter.format(shopeeChiPhi)}</Text>
                                            </Td>
                                            <Td bg="yellow.100">
                                                <Text fontWeight="600">{formatter.format(tongChiPhi)}</Text>
                                            </Td>

                                            {/* Doanh thu net */}
                                            <Td>
                                                <Text fontWeight="600">{formatter.format(Math.abs(tongTienMatNet))}</Text>
                                            </Td>
                                            <Td>
                                                <Text fontWeight="600">{formatter.format(Math.abs(tongMomoNet))}</Text>
                                            </Td>  
                                            <Td>
                                                <Text fontWeight="600">{formatter.format(Math.abs(tongATMNet))}</Text>
                                            </Td>
                                            <Td>
                                                <Text fontWeight="600">{formatter.format(Math.abs(tongVnPayNet))}</Text>
                                            </Td>
                                            <Td>
                                                <Text fontWeight="600">{formatter.format(grabDoanhThuNet)}</Text>
                                            </Td>
                                                <Td>
                                                <Text fontWeight="600">{formatter.format(befoodDoanhThuNet)}</Text>
                                            </Td>
                                            <Td>
                                                <Text fontWeight="600">{formatter.format(shopeeDoanhThuNet)}</Text>
                                            </Td>
                                            <Td bg="yellow.100">
                                                <Text fontWeight="600">{formatter.format(Math.abs(tongDoanhThuNet))}</Text>
                                            </Td>
                                        </Tr>
                                    )
                                })
                            }
                        </Tbody>
                        <Tfoot>
                            <Tr textTransform="uppercase" bg="blue.500">
                                <Th><Text color="white" fontWeight="600">TỔNG</Text></Th>
                                <Th>
                                    <Text color="white" fontWeight="600">
                                        {
                                            formatter.format(
                                                Math.abs(fabiDatas.filter(fabiItem => {
                                                    return fabiItem.Date && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() >= 1 && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() <= 31;
                                                }).reduce((acc, item) => acc + (item["CashMoney"] || 0), 0))
                                            )
                                        }
                                    </Text>
                                </Th>
                                <Th>
                                    <Text color="white" fontWeight="600">
                                        {
                                            formatter.format(
                                                Math.abs(fabiDatas.filter(fabiItem => {
                                                    return fabiItem.Date && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() >= 1 && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() <= 31;
                                                }).reduce((acc, item) => acc + (item.SaleMetricsArray?.["Sale Momo Pay"] || 0), 0))
                                            )
                                        }
                                    </Text>
                                </Th>
                                <Th>
                                    <Text color="white" fontWeight="600">
                                        {
                                            formatter.format(
                                                Math.abs(fabiDatas.filter(fabiItem => {
                                                    return fabiItem.Date && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() >= 1 && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() <= 31;
                                                }).reduce((acc, item) => acc + (item.SaleMetricsArray?.["Sale ATM"] || 0), 0))
                                            )
                                        }
                                    </Text>
                                </Th>
                                <Th>
                                    <Text color="white" fontWeight="600">
                                        {
                                            formatter.format(
                                                Math.abs(fabiDatas.filter(fabiItem => {
                                                    return fabiItem.Date && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() >= 1 && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() <= 31;
                                                }).reduce((acc, item) => acc + (item.SaleMetricsArray?.["Sale VnPay"] || 0), 0))
                                            )
                                        }
                                    </Text>
                                </Th>
                                <Th>
                                     <Text color="white" fontWeight="600">
                                        {
                                            formatter.format(
                                                Math.abs(grabTableDatas.filter(grabItem => {
                                                    return grabItem.ngay >= 1 && grabItem.ngay <= 31;
                                                }).reduce((acc, item) => acc + (item.doanh_thu_gross || 0), 0))
                                            )
                                        }
                                    </Text>
                                </Th>
                                <Th>
                                    <Text color="white" fontWeight="600">
                                        {
                                            formatter.format(
                                                Math.abs(befoodTableDatas.filter(befoodItem => {
                                                    return befoodItem.ngay >= 1 && befoodItem.ngay <= 31;
                                                }).reduce((acc, item) => acc + (item.doanh_thu_gross || 0), 0))
                                            )
                                        }
                                    </Text>
                                </Th>
                                <Th>
                                    <Text color="white" fontWeight="600">
                                        {
                                            formatter.format(
                                                Math.abs(shopeeTableDatas.filter(shopeeItem => {
                                                    return shopeeItem.ngay >= 1 && shopeeItem.ngay <= 31;
                                                }).reduce((acc, item) => acc + (item.doanh_thu_gross || 0), 0))
                                            )
                                        }
                                    </Text>
                                </Th>
                                <Th bg="blue.500" color="white">
                                    <Text color="white" fontWeight="600">
                                        {
                                            formatter.format(
                                                Math.abs(fabiDatas.filter(fabiItem => {
                                                    return fabiItem.Date && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() >= 1 && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() <= 31;
                                                }).reduce((acc, item) => acc + (item["CashMoney"] || 0), 0)) +
                                                Math.abs(fabiDatas.filter(fabiItem => {
                                                    return fabiItem.Date && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() >= 1 && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() <= 31;
                                                }).reduce((acc, item) => acc + (item.SaleMetricsArray?.["Sale Momo Pay"] || 0), 0)) +
                                                Math.abs(fabiDatas.filter(fabiItem => {
                                                    return fabiItem.Date && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() >= 1 && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() <= 31;
                                                }).reduce((acc, item) => acc + (item.SaleMetricsArray?.["Sale ATM"] || 0), 0)) +
                                                Math.abs(fabiDatas.filter(fabiItem => {
                                                    return fabiItem.Date && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() >= 1 && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() <= 31;    
                                                }).reduce((acc, item) => acc + (item.SaleMetricsArray?.["Sale VnPay"] || 0), 0)) +
                                                Math.abs(grabTableDatas.filter(grabItem => {
                                                    return grabItem.ngay >= 1 && grabItem.ngay <= 31;
                                                }).reduce((acc, item) => acc + (item.doanh_thu_gross || 0), 0)) +   
                                                Math.abs(befoodTableDatas.filter(befoodItem => {
                                                    return befoodItem.ngay >= 1 && befoodItem.ngay <= 31;
                                                }).reduce((acc, item) => acc + (item.doanh_thu_gross || 0), 0)) +
                                                Math.abs(shopeeTableDatas.filter(shopeeItem => {
                                                    return shopeeItem.ngay >= 1 && shopeeItem.ngay <= 31;
                                                }).reduce((acc, item) => acc + (item.doanh_thu_gross || 0), 0))
                                            )
                                        }
                                    </Text>
                                </Th>
                                 <Th>
                                    <Text color="white" fontWeight="600">
                                        {
                                            formatter.format(
                                                Math.abs(fabiDatas.filter(fabiItem => {
                                                    return fabiItem.Date && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() >= 1 && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() <= 31;
                                                }).reduce((acc, item) => acc + (item.SaleMetricsArray?.["Chi phí Tiền mặt"] || 0), 0))
                                            )
                                        }
                                    </Text>
                                </Th>
                                <Th>
                                    <Text color="white" fontWeight="600">
                                        {
                                            formatter.format(
                                                Math.abs(fabiDatas.filter(fabiItem => {
                                                    return fabiItem.Date && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() >= 1 && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() <= 31;
                                                }).reduce((acc, item) => acc + (item.SaleMetricsArray?.["Chi phí Momo"] || 0), 0))
                                            )
                                        }
                                    </Text>
                                </Th>
                                <Th>
                                    <Text color="white" fontWeight="600">
                                        {
                                            formatter.format(
                                                Math.abs(fabiDatas.filter(fabiItem => {
                                                    return fabiItem.Date && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() >= 1 && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() <= 31;
                                                }).reduce((acc, item) => acc + (item.SaleMetricsArray?.["Chi phí ATM"] || 0), 0))
                                            )
                                        }
                                    </Text>
                                </Th>
                                <Th>
                                    <Text color="white" fontWeight="600">
                                        {
                                            formatter.format(
                                                Math.abs(fabiDatas.filter(fabiItem => {
                                                    return fabiItem.Date && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() >= 1 && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() <= 31;
                                                }).reduce((acc, item) => acc + (item.SaleMetricsArray?.["Chi phí VnPay"] || 0), 0))
                                            )
                                        }
                                    </Text>
                                </Th>
                                <Th>
                                     <Text color="white" fontWeight="600">
                                        {
                                            formatter.format(
                                                Math.abs(grabTableDatas.filter(grabItem => {
                                                    return grabItem.ngay >= 1 && grabItem.ngay <= 31;
                                                }).reduce((acc, item) => acc + (item.chi_phi_san_thuong_may_dien_tu || 0), 0))
                                            )
                                        }
                                    </Text>
                                </Th>
                                <Th>
                                    <Text color="white" fontWeight="600">
                                        {
                                            formatter.format(
                                                Math.abs(befoodTableDatas.filter(befoodItem => {
                                                    return befoodItem.ngay >= 1 && befoodItem.ngay <= 31;
                                                }).reduce((acc, item) => acc + (item.chi_phi || 0), 0))
                                            )
                                        }
                                    </Text>
                                </Th>
                                <Th>
                                    <Text color="white" fontWeight="600">
                                        {
                                            formatter.format(
                                                Math.abs(shopeeTableDatas.filter(shopeeItem => {
                                                    return shopeeItem.ngay >= 1 && shopeeItem.ngay <= 31;
                                                }).reduce((acc, item) => acc + (item.chi_phi_shopee || 0), 0))
                                            )
                                        }
                                    </Text>
                                </Th>
                                <Th>
                                    <Text  color="white" fontWeight="600">
                                        {
                                            formatter.format(
                                                Math.abs(fabiDatas.filter(fabiItem => {
                                                    return fabiItem.Date && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() >= 1 && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() <= 31;
                                                }).reduce((acc, item) => acc + (item.SaleMetricsArray?.["Chi phí Tiền mặt"] || 0), 0)) +
                                                Math.abs(fabiDatas.filter(fabiItem => {
                                                    return fabiItem.Date && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() >= 1 && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() <= 31;
                                                }).reduce((acc, item) => acc + (item.SaleMetricsArray?.["Chi phí Momo"] || 0), 0)) +
                                                Math.abs(fabiDatas.filter(fabiItem => {
                                                    return fabiItem.Date && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() >= 1 && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() <= 31;
                                                }).reduce((acc, item) => acc + (item.SaleMetricsArray?.["Chi phí ATM"] || 0), 0)) +
                                                Math.abs(fabiDatas.filter(fabiItem => {
                                                    return fabiItem.Date && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() >= 1 && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() <= 31;
                                                }).reduce((acc, item) => acc + (item.SaleMetricsArray?.["Chi phí VnPay"] || 0), 0)) +
                                                Math.abs(grabTableDatas.filter(grabItem => {
                                                    return grabItem.ngay >= 1 && grabItem.ngay <= 31;
                                                }).reduce((acc, item) => acc + (item.chi_phi_san_thuong_may_dien_tu || 0), 0)) +
                                                Math.abs(befoodTableDatas.filter(befoodItem => {
                                                    return befoodItem.ngay >= 1 && befoodItem.ngay <= 31;
                                                }).reduce((acc, item) => acc + (item.chi_phi || 0), 0)) +
                                                Math.abs(shopeeTableDatas.filter(shopeeItem => {
                                                    return shopeeItem.ngay >= 1 && shopeeItem.ngay <= 31;
                                                }).reduce((acc, item) => acc + (item.chi_phi_shopee || 0), 0))
                                            )
                                        }
                                    </Text>
                                </Th>
                                <Th>
                                    <Text color="white" fontWeight="600">
                                        {
                                            formatter.format(
                                                Math.abs(fabiDatas.filter(fabiItem => {
                                                    return fabiItem.Date && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() >= 1 && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() <= 31;
                                                }).reduce((acc, item) => acc + (item["CashMoney"] || 0), 0)) 
                                                - Math.abs(fabiDatas.filter(fabiItem => {
                                                    return fabiItem.Date && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() >= 1 && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() <= 31;
                                                }).reduce((acc, item) => acc + (item.SaleMetricsArray?.["Chi phí Tiền mặt"] || 0), 0))
                                            )
                                        }
                                    </Text>
                                </Th>
                                <Th>                                                    
                                    <Text color="white" fontWeight="600">
                                        {
                                            formatter.format(
                                                Math.abs(fabiDatas.filter(fabiItem => {
                                                    return fabiItem.Date && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() >= 1 && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() <= 31;
                                                }).reduce((acc, item) => acc + (item.SaleMetricsArray?.["Sale Momo Pay"] || 0), 0))
                                                - Math.abs(fabiDatas.filter(fabiItem => {
                                                    return fabiItem.Date && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() >= 1 && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() <= 31;
                                                }).reduce((acc, item) => acc + (item.SaleMetricsArray?.["Chi phí Momo"] || 0), 0))
                                            )
                                        }
                                    </Text>
                                </Th>
                                <Th>
                                    <Text color="white" fontWeight="600">
                                        {
                                            formatter.format(
                                                Math.abs(fabiDatas.filter(fabiItem => {
                                                    return fabiItem.Date && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() >= 1 && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() <= 31;
                                                }).reduce((acc, item) => acc + (item.SaleMetricsArray?.["Sale ATM"] || 0), 0))
                                                - Math.abs(fabiDatas.filter(fabiItem => {
                                                    return fabiItem.Date && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() >= 1 && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() <= 31;
                                                }).reduce((acc, item) => acc + (item.SaleMetricsArray?.["Chi phí ATM"] || 0), 0))
                                            )
                                        }
                                    </Text>
                                </Th>
                                <Th>
                                    <Text color="white" fontWeight="600">
                                        {
                                            formatter.format(
                                                Math.abs(fabiDatas.filter(fabiItem => {
                                                    return fabiItem.Date && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() >= 1 && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() <= 31;
                                                }).reduce((acc, item) => acc + (item.SaleMetricsArray?.["Sale VnPay"] || 0), 0))
                                                - Math.abs(fabiDatas.filter(fabiItem => {
                                                    return fabiItem.Date && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() >= 1 && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() <= 31;
                                                }).reduce((acc, item) => acc + (item.SaleMetricsArray?.["Chi phí VnPay"] || 0), 0))
                                            )
                                        }
                                    </Text>
                                </Th>
                                <Th>
                                     <Text color="white" fontWeight="600">
                                        {
                                            formatter.format(
                                                Math.abs(grabTableDatas.filter(grabItem => {
                                                    return grabItem.ngay >= 1 && grabItem.ngay <= 31;
                                                }).reduce((acc, item) => acc + (item.doanh_thu_gross || 0), 0)) -
                                                Math.abs(grabTableDatas.filter(grabItem => {
                                                    return grabItem.ngay >= 1 && grabItem.ngay <= 31;
                                                }).reduce((acc, item) => acc + (item.chi_phi_san_thuong_may_dien_tu || 0), 0))
                                            )
                                        }
                                    </Text>
                                </Th>
                                <Th>
                                     <Text color="white" fontWeight="600">
                                        {
                                            formatter.format(
                                                Math.abs(befoodTableDatas.filter(befoodItem => {
                                                    return befoodItem.ngay >= 1 && befoodItem.ngay <= 31;
                                                }).reduce((acc, item) => acc + (item.doanh_thu_gross || 0), 0)) -
                                                Math.abs(befoodTableDatas.filter(befoodItem => {
                                                    return befoodItem.ngay >= 1 && befoodItem.ngay <= 31;
                                                }).reduce((acc, item) => acc + (item.chi_phi || 0), 0))
                                            )
                                        }
                                    </Text>
                                </Th>
                                <Th>
                                     <Text color="white" fontWeight="600">
                                        {
                                            formatter.format(
                                                Math.abs(shopeeTableDatas.filter(shopeeItem => {
                                                    return shopeeItem.ngay >= 1 && shopeeItem.ngay <= 31;
                                                }).reduce((acc, item) => acc + (item.doanh_thu_gross || 0), 0)) -
                                                Math.abs(shopeeTableDatas.filter(shopeeItem => {
                                                    return shopeeItem.ngay >= 1 && shopeeItem.ngay <= 31;
                                                }).reduce((acc, item) => acc + (item.chi_phi_shopee || 0), 0))
                                            )
                                        }
                                    </Text>
                                </Th>
                                <Th>
                                    <Text color="white" fontWeight="600">
                                        {
                                            formatter.format(
                                                Math.abs(fabiDatas.filter(fabiItem => {
                                                    return fabiItem.Date && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() >= 1 && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() <= 31;
                                                }).reduce((acc, item) => acc + (item["CashMoney"] || 0), 0)) - 
                                                Math.abs(fabiDatas.filter(fabiItem => {
                                                    return fabiItem.Date && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() >= 1 && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() <= 31;
                                                }).reduce((acc, item) => acc + (item.SaleMetricsArray?.["Chi phí Tiền mặt"] || 0), 0)) +

                                                Math.abs(fabiDatas.filter(fabiItem => {
                                                    return fabiItem.Date && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() >= 1 && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() <= 31;
                                                }).reduce((acc, item) => acc + (item.SaleMetricsArray?.["Sale Momo Pay"] || 0), 0)) -
                                                Math.abs(fabiDatas.filter(fabiItem => {
                                                    return fabiItem.Date && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() >= 1 && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() <= 31;
                                                }).reduce((acc, item) => acc + (item.SaleMetricsArray?.["Chi phí Momo"] || 0), 0)) +

                                                Math.abs(fabiDatas.filter(fabiItem => {
                                                    return fabiItem.Date && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() >= 1 && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() <= 31;
                                                }).reduce((acc, item) => acc + (item.SaleMetricsArray?.["Sale ATM"] || 0), 0)) -
                                                Math.abs(fabiDatas.filter(fabiItem => {
                                                    return fabiItem.Date && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() >= 1 && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() <= 31;
                                                }).reduce((acc, item) => acc + (item.SaleMetricsArray?.["Chi phí ATM"] || 0), 0)) +

                                                Math.abs(fabiDatas.filter(fabiItem => {
                                                    return fabiItem.Date && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() >= 1 && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() <= 31;
                                                }).reduce((acc, item) => acc + (item.SaleMetricsArray?.["Sale VnPay"] || 0), 0)) -
                                                Math.abs(fabiDatas.filter(fabiItem => {
                                                    return fabiItem.Date && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() >= 1 && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() <= 31;
                                                }).reduce((acc, item) => acc + (item.SaleMetricsArray?.["Chi phí VnPay"] || 0), 0)) +

                                                Math.abs(grabTableDatas.filter(grabItem => {
                                                    return grabItem.ngay >= 1 && grabItem.ngay <= 31;
                                                }).reduce((acc, item) => acc + (item.doanh_thu_gross || 0), 0)) -
                                                Math.abs(grabTableDatas.filter(grabItem => {
                                                    return grabItem.ngay >= 1 && grabItem.ngay <= 31;
                                                }).reduce((acc, item) => acc + (item.chi_phi_san_thuong_may_dien_tu || 0), 0)) +

                                                Math.abs(befoodTableDatas.filter(befoodItem => {
                                                    return befoodItem.ngay >= 1 && befoodItem.ngay <= 31;
                                                }).reduce((acc, item) => acc + (item.doanh_thu_gross || 0), 0)) -
                                                Math.abs(befoodTableDatas.filter(befoodItem => {
                                                    return befoodItem.ngay >= 1 && befoodItem.ngay <= 31;
                                                }).reduce((acc, item) => acc + (item.chi_phi || 0), 0)) +

                                                Math.abs(shopeeTableDatas.filter(shopeeItem => {
                                                    return shopeeItem.ngay >= 1 && shopeeItem.ngay <= 31;
                                                }).reduce((acc, item) => acc + (item.doanh_thu_gross || 0), 0)) -
                                                Math.abs(shopeeTableDatas.filter(shopeeItem => {
                                                    return shopeeItem.ngay >= 1 && shopeeItem.ngay <= 31;
                                                }).reduce((acc, item) => acc + (item.chi_phi_shopee || 0), 0))
                                            )
                                        }
                                    </Text>
                                </Th>
                            </Tr>
                        </Tfoot>
                    </Table>
                </TableContainer>
            </Flex>
        )
    }

    const VnPayComponent = () => {
        return (
            <Flex ref={htmlDownloadRef} flexDirection="column" w="100%" mb={8}>
                <Heading size="md" mb={4}>BẢNG ĐỐI CHIẾU CHÊNH LỆCH TIỀN APP <Text as="span" color="orange.500">VNPAY</Text> VÀ NGÂN HÀNG</Heading>
                <TableContainer mt={4}>
                    <Table variant="simple" size="sm">
                        <Thead>
                            <Tr textTransform="uppercase">
                                <Th>NGÀY</Th>
                                <Th>TÊN APP</Th>   
                                <Th>DOANH THU THUẦN</Th>   
                                <Th>PHÍ</Th>   
                                <Th>THỰC NHẬN</Th>   
                                <Th>NGÂN HÀNG</Th>
                                <Th>CHÊNH LỆCH</Th>
                                <Th isNumeric></Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                vnpayTableDatas.map((item, idx) => {
                                    const { ngay, ten_app, doanh_thu_thuan, phi_dich_vu, chenh_lech } = item;
                                    const findVietcombankDatas = vietcombankDatas.filter(vietcombankItem => {
                                        return vietcombankItem.ngay_hieu_luc_2 && (moment(vietcombankItem.ngay_hieu_luc_2, "YYYY-MM-DD").toDate().getDate() === (ngay + 1))  
                                            && vietcombankItem.noi_dung_chi_tiet && vietcombankItem.noi_dung_chi_tiet.indexOf("VNPAY") > -1;
                                    });
                                    const totalVietcombankSoTienGhiNo = findVietcombankDatas.reduce((acc, item) => acc + (item.so_tien_ghi_no || 0), 0);
                                    const chenhlech = Math.abs(totalVietcombankSoTienGhiNo) - (Math.abs(doanh_thu_thuan) - Math.abs(phi_dich_vu));
                                    //console.log("findVietcombankDatas:", findVietcombankDatas)
                                    return (
                                        <Tr key={idx}>
                                            <Td>
                                                {ngay}
                                            </Td>
                                            <Td>{ten_app}</Td>
                                            <Td><Text fontWeight="600">{formatter.format(Math.abs(doanh_thu_thuan))}</Text></Td>  
                                            <Td><Text fontWeight="600">{formatter.format(Math.abs(phi_dich_vu))}</Text></Td>  
                                            <Td><Text fontWeight="600">{formatter.format(Math.abs(doanh_thu_thuan) - Math.abs(phi_dich_vu))}</Text></Td>  
                                            <Td>
                                                <Text fontWeight="600"> 
                                                    {totalVietcombankSoTienGhiNo ? formatter.format(Math.abs(totalVietcombankSoTienGhiNo)) : 0}
                                                </Text>
                                            </Td>
                                            <Td>
                                                <Text fontWeight="600" color={chenhlech !== 0 ? "red.500" : ""}>
                                                    {formatter.format(chenhlech)}
                                                </Text>
                                            </Td>
                                        </Tr>
                                    )
                                })
                            }
                        </Tbody>
                    </Table>
                </TableContainer>
            </Flex>
        )
    }

    const MomoComponent = () => {
        return (
            <Flex ref={htmlDownloadRef} flexDirection="column" w="100%" mb={8}>
                <Heading size="md" mb={4}>BẢNG ĐỐI CHIẾU CHÊNH LỆCH TIỀN APP <Text as="span" color="orange.500">MOMO</Text> VÀ NGÂN HÀNG</Heading>
                <TableContainer mt={4}>
                    <Table variant="simple" size="sm">
                        <Thead>
                            <Tr textTransform="uppercase">
                                <Th>NGÀY</Th>
                                <Th>TÊN APP</Th>   
                                <Th>TIỀN TỪ APP</Th>   
                                <Th>FABI</Th>
                                <Th>CHÊNH LỆCH</Th>
                                <Th isNumeric></Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                momoTableDatas.map((item, idx) => {
                                    const { ngay, ten_app, so_tien } = item;
                                    const findFabiDatas = fabiDatas.filter(fabiItem => {
                                        //return fabiItem.Date && (moment(fabiItem.Date, "YYYY-MM-DD").toDate().getDate() === (ngay - 1));
                                        return fabiItem.Date && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() === ngay;
                                    });
                                    const totalFabiSoTien = findFabiDatas.reduce((acc, item) => acc + (item.SaleMetricsArray?.["Sale Momo"] || 0), 0);
                                    const chenhlech = Math.abs(totalFabiSoTien) - Math.abs(so_tien);
                                    // console.log("findFabiDatas:", findFabiDatas)
                                    return (
                                        <Tr key={idx}>
                                            <Td>
                                                {ngay}
                                            </Td>
                                            <Td>{ten_app}</Td>
                                            <Td><Text fontWeight="600">{formatter.format(Math.abs(so_tien))}</Text></Td>  
                                            <Td>
                                                <Text fontWeight="600"> 
                                                    {totalFabiSoTien ? formatter.format(Math.abs(totalFabiSoTien)) : 0}
                                                </Text>
                                            </Td>
                                            <Td>
                                                <Text fontWeight="600" color={chenhlech !== 0 ? "red.500" : ""}>
                                                    {formatter.format(chenhlech)}
                                                </Text>
                                            </Td>
                                        </Tr>
                                    )
                                })
                            }
                        </Tbody>
                    </Table>
                </TableContainer>
            </Flex>
        )
    }

    const GrabComponent = () => {
        return (
            <Flex ref={htmlDownloadRef} flexDirection="column" mb={8}>
                <Heading size="md" mb={4}>BẢNG THỐNG KÊ DOANH THU <Text as="span" color="orange.500">GRAB</Text> (TRỪ CHI PHÍ NỀN TẢNG)</Heading>
                <TableContainer mt={4}>
                    <Table variant="simple" size="sm">
                        <Thead>
                            <Tr textTransform="uppercase">
                                <Th><Text size="sm">NGÀY</Text></Th>
                                <Th><Text fontSize={10}>TÊN APP</Text></Th>   
                                <Th><Text fontSize={10}>DOANH THU <br/> GROSS</Text></Th>   
                                <Th><Text fontSize={10}>GIẢM GIÁ <br/>(QUÁN TÀI TRỢ)</Text></Th>   
                                <Th><Text fontSize={10}>GIẢM PHÍ GIAO HÀNG <br/> (QUÁN TÀI TRỢ)</Text></Th>   
                                <Th><Text fontSize={10}>QUẢNG CÁO</Text></Th>   
                                <Th><Text fontSize={10}>CHIẾT KHẤU <br/> TỪ CÁC KÊNH BÁN HÀNG</Text></Th>   
                                <Th><Text fontSize={10}>VAT</Text></Th>   
                                <Th><Text fontSize={10}>PIT</Text></Th>
                                <Th><Text fontSize={10}>CHI PHÍ <br/>SÀN THƯƠNG MẠI ĐIỆN TỬ</Text></Th>   
                                <Th><Text fontSize={10}>DOANH THU NET</Text></Th>
                                <Th isNumeric></Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                grabTableDatas.map((item, idx) => {
                                    const { 
                                        ngay, ten_app, doanh_thu_gross, giam_gia_quan_tai_tro,
                                        giam_phi_giao_hang_quan_tai_tro, quang_cao_tai_tro,
                                        chiet_khau_tu_cac_kenh_ban_hang, vat_amount, pit_amount,
                                        chi_phi_san_thuong_may_dien_tu, doanh_thu_net 
                                    } = item;
                                    return (
                                        <Tr key={idx}>
                                            <Td>
                                                {ngay}
                                            </Td>
                                            <Td>{ten_app}</Td>
                                            <Td><Text fontWeight="600">{formatter.format(doanh_thu_gross)}</Text></Td>  
                                            <Td bg="gray.200"><Text fontWeight="600">{formatter.format(giam_gia_quan_tai_tro)}</Text></Td>  
                                            <Td bg="gray.200"><Text fontWeight="600">{formatter.format(giam_phi_giao_hang_quan_tai_tro)}</Text></Td>
                                            <Td bg="gray.200"><Text fontWeight="600">{formatter.format(quang_cao_tai_tro)}</Text></Td>
                                            <Td bg="gray.200"><Text fontWeight="600">{formatter.format(chiet_khau_tu_cac_kenh_ban_hang)}</Text></Td>
                                            <Td bg="gray.200"><Text fontWeight="600">{formatter.format(vat_amount)}</Text></Td>
                                            <Td bg="gray.200"><Text fontWeight="600">{formatter.format(pit_amount)}</Text></Td>
                                            <Td><Text fontWeight="600">{formatter.format(chi_phi_san_thuong_may_dien_tu)}</Text></Td>
                                            <Td><Text fontWeight="600">{formatter.format(doanh_thu_net)}</Text></Td>
                                        </Tr>
                                    )
                                })
                            }
                        </Tbody>
                    </Table>
                </TableContainer>

                <Heading size="md" my={4}>BẢNG ĐỐI CHIẾU CHÊNH LỆCH TIỀN APP <Text as="span" color="orange.500">GRAB</Text> VÀ NGÂN HÀNG</Heading>
                <TableContainer mt={4}>
                    <Table variant="simple" size="sm">
                        <Thead>
                            <Tr textTransform="uppercase">
                                <Th>NGÀY</Th>
                                <Th>TÊN APP</Th>   
                                <Th>TIỀN TỪ APP</Th>   
                                <Th>NGÂN HÀNG</Th>
                                <Th>CHÊNH LỆCH</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                grabTableDatas.map((item, idx) => {
                                    const { ngay, ten_app, doanh_thu_net, } = item;
                                    const findVietcombankDatas = vietcombankDatas.filter(vietcombankItem => {
                                        return vietcombankItem.ngay_hieu_luc_2 && (moment(vietcombankItem.ngay_hieu_luc_2, "YYYY-MM-DD").toDate().getDate() === (ngay + 1))
                                            && vietcombankItem.noi_dung_chi_tiet && vietcombankItem.noi_dung_chi_tiet.indexOf("Grab") > -1;
                                    });
                                    const totalVietcombankSoTienGhiCo = findVietcombankDatas.reduce((acc, item) => acc + (item.so_tien_ghi_no || 0), 0);
                                    const chenhlech = Math.abs(totalVietcombankSoTienGhiCo) - Math.abs(doanh_thu_net);
                                    //console.log("findFabiDatas:", findFabiDatas)
                                    if(findVietcombankDatas.length === 0) {
                                        return (
                                            <Tr key={idx}>
                                            </Tr>
                                        )
                                    }
                                    return (
                                        <Tr key={idx}>
                                            <Td>
                                                {ngay}
                                            </Td>
                                            <Td>{ten_app}</Td>
                                            <Td><Text fontWeight="600">{formatter.format(doanh_thu_net)}</Text></Td>  
                                            <Td>
                                                <Text fontWeight="600"> 
                                                    {totalVietcombankSoTienGhiCo ? formatter.format(Math.abs(totalVietcombankSoTienGhiCo)) : 0}
                                                </Text>
                                            </Td>
                                            <Td>
                                                <Text fontWeight="600" color={chenhlech !== 0 ? "red.500" : ""}>
                                                    {formatter.format(chenhlech)}
                                                </Text>
                                            </Td>
                                        </Tr>
                                    )
                                })
                            }
                        </Tbody>
                    </Table>
                </TableContainer>

                <Heading size="md" my={4}>BẢNG ĐỐI CHIẾU CHÊNH LỆCH TIỀN APP <Text as="span" color="orange.500">GRAB</Text> VÀ <Text as="span" color="orange.500">FABI</Text></Heading>
                <TableContainer mt={4}>
                    <Table variant="simple" size="sm">
                        <Thead>
                            <Tr textTransform="uppercase">
                                <Th>NGÀY</Th>
                                <Th>TÊN APP</Th>   
                                <Th>TIỀN TỪ APP</Th>   
                                <Th>FABI</Th>
                                <Th>CHÊNH LỆCH</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                grabTableDatas.map((item, idx) => {
                                    const { ngay, ten_app, doanh_thu_gross,  } = item;
                                    const findFabiDatas = fabiDatas.filter(fabiItem => {
                                        //return fabiItem.Date && (moment(fabiItem.Date, "YYYY-MM-DD").toDate().getDate() === (ngay - 1));
                                        return fabiItem.Date && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() === ngay;
                                    });
                                    const totalFabiSoTienGross = findFabiDatas.reduce((acc, item) => acc + (item.SaleMetricsArray?.["Sale Grab Gross"] || 0), 0);
                                    const chenhlech = Math.abs(totalFabiSoTienGross) - Math.abs(doanh_thu_gross);
                                    //console.log("findFabiDatas:", findFabiDatas)
                                    return (
                                        <Tr key={idx}>
                                            <Td>
                                                {ngay}
                                            </Td>
                                            <Td>{ten_app}</Td>
                                            <Td><Text fontWeight="600">{formatter.format(doanh_thu_gross)}</Text></Td>  
                                            <Td>
                                                <Text fontWeight="600"> 
                                                    {totalFabiSoTienGross ? formatter.format(Math.abs(totalFabiSoTienGross)) : 0}
                                                </Text>
                                            </Td>
                                            <Td>
                                                <Text fontWeight="600" color={chenhlech !== 0 ? "red.500" : ""}>
                                                    {formatter.format(chenhlech)}
                                                </Text>
                                            </Td>
                                        </Tr>
                                    )
                                })
                            }
                        </Tbody>
                    </Table>
                </TableContainer>
            </Flex>
        )
    }

    const BefoodComponent = () => {
        return (
            <Flex ref={htmlDownloadRef} flexDirection="column" mb={8}>
                <Heading size="md" mb={4}>BẢNG THỐNG KÊ DOANH THU <Text as="span" color="orange.500">BEFOOD</Text> (TRỪ CHI PHÍ NỀN TẢNG)</Heading>
                <TableContainer mt={4}>
                    <Table variant="simple" size="sm">
                        <Thead>
                            <Tr textTransform="uppercase">
                                <Th><Text size="sm">NGÀY</Text></Th>
                                <Th><Text fontSize={10}>TÊN APP</Text></Th>   
                                <Th><Text fontSize={10}>DOANH THU <br/> GROSS</Text></Th>   
                                <Th><Text fontSize={10}>CHI PHÍ</Text></Th>   
                                <Th><Text fontSize={10}>DOANH THU NET</Text></Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                befoodTableDatas.map((item, idx) => {
                                    const { 
                                        ngay, ten_app, doanh_thu_gross, chi_phi, doanh_thu_net
                                    } = item;
                                    return (
                                        <Tr key={idx}>
                                            <Td>
                                                {ngay}
                                            </Td>
                                            <Td>{ten_app}</Td>
                                            <Td><Text fontWeight="600">{formatter.format(Math.abs(doanh_thu_gross))}</Text></Td>  
                                            <Td bg="gray.200"><Text fontWeight="600">{formatter.format(chi_phi)}</Text></Td>  
                                            <Td><Text fontWeight="600">{formatter.format(doanh_thu_net)}</Text></Td>
                                        </Tr>
                                    )
                                })
                            }
                        </Tbody>
                        <Tfoot>
                            <Tr>
                                <Th></Th>
                                <Th><Text fontSize={12} fontWeight="600" color="red">TỔNG</Text></Th>
                                <Th><Text fontSize={12} fontWeight="600" color="red">{formatter.format(befoodTableDatas.reduce((acc, item) => acc + item.doanh_thu_gross, 0))}</Text></Th>  
                                <Th bg="gray.200"><Text fontSize={12} fontWeight="600" color="red">{formatter.format(befoodTableDatas.reduce((acc, item) => acc + item.chi_phi, 0))}</Text></Th>  
                                <Th><Text fontSize={12} fontWeight="600" color="red">{formatter.format(befoodTableDatas.reduce((acc, item) => acc + item.doanh_thu_net, 0))}</Text></Th>
                            </Tr>
                        </Tfoot>
                    </Table>
                </TableContainer>

                <Heading size="md" my={4}>BẢNG SAO KÊ NGÂN HÀNG CỦA <Text as="span" color="orange.500">BEFOOD</Text></Heading>
                <TableContainer mt={4}>
                    <Table variant="simple" size="sm">
                        <Thead>
                            <Tr textTransform="uppercase">
                                <Th>NGÀY</Th>
                                <Th>TÊN APP</Th>   
                                <Th>NGÂN HÀNG</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                befoodTableDatas.map((item, idx) => {
                                    const { ngay, ten_app, doanh_thu_net, } = item;
                                    const findVietcombankDatas = vietcombankDatas.filter(vietcombankItem => {
                                        return vietcombankItem.ngay_hieu_luc_2 && (moment(vietcombankItem.ngay_hieu_luc_2, "YYYY-MM-DD").toDate().getDate() === (ngay))
                                            && vietcombankItem.noi_dung_chi_tiet && ((vietcombankItem.noi_dung_chi_tiet.indexOf("CONG TY CO PHAN BE GROUP") > -1) || (vietcombankItem.noi_dung_chi_tiet.indexOf("beFood") > -1));
                                    });
                                    const totalVietcombankSoTienGhiNo = findVietcombankDatas.reduce((acc, item) => acc + (item.so_tien_ghi_no || 0), 0);

                                    return (
                                        <Tr key={idx}>
                                            <Td>
                                                {ngay}
                                            </Td>
                                            <Td>{ten_app}</Td>
                                            <Td>
                                                <Text fontWeight="600"> 
                                                    {totalVietcombankSoTienGhiNo ? formatter.format(Math.abs(totalVietcombankSoTienGhiNo)) : 0}
                                                </Text>
                                            </Td>
                                        </Tr>
                                    )
                                })
                            }
                        </Tbody>
                        <Tfoot>
                            <Tr>
                                <Th></Th>
                                <Th><Text fontSize={12} fontWeight="600" color="red">TỔNG</Text></Th>
                                <Th bg="gray.200">
                                    <Text fontSize={12} fontWeight="600" color="red">
                                    {
                                        formatter.format(
                                            vietcombankDatas.filter(vietcombankItem => {
                                                return vietcombankItem.noi_dung_chi_tiet && ((vietcombankItem.noi_dung_chi_tiet.indexOf("CONG TY CO PHAN BE GROUP") > -1) || (vietcombankItem.noi_dung_chi_tiet.indexOf("beFood") > -1));
                                            }).reduce((acc, item) => acc + item.so_tien_ghi_no, 0)
                                        )
                                    }
                                    </Text>
                                </Th>  
                            </Tr>
                        </Tfoot>
                    </Table>
                </TableContainer>

                <Heading size="md" my={4}>BẢNG ĐỐI CHIẾU CHÊNH LỆCH TIỀN APP <Text as="span" color="orange.500">BEFOOD</Text> VÀ <Text as="span" color="orange.500">FABI</Text></Heading>
                <TableContainer mt={4}>
                    <Table variant="simple" size="sm">
                        <Thead>
                            <Tr textTransform="uppercase">
                                <Th>NGÀY</Th>
                                <Th>TÊN APP</Th>   
                                <Th>TIỀN TỪ APP</Th>   
                                <Th>FABI</Th>
                                <Th>CHÊNH LỆCH</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                befoodTableDatas.map((item, idx) => {
                                    const { ngay, ten_app, doanh_thu_gross,  } = item;
                                    const findFabiDatas = fabiDatas.filter(fabiItem => {
                                        return fabiItem.Date && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() === ngay;
                                        //return fabiItem.Date && (moment(fabiItem.Date, "YYYY-MM-DD").toDate().getDate() === (ngay - 1));
                                    });
                                    const totalFabiSoTienGross = findFabiDatas.reduce((acc, item) => acc + (item.SaleMetricsArray?.["Sale Befood Gross"] || 0), 0);
                                    const chenhlech = Math.abs(totalFabiSoTienGross) - Math.abs(doanh_thu_gross);
                                    //console.log("findFabiDatas:", findFabiDatas)
                                    return (
                                        <Tr key={idx}>
                                            <Td>
                                                {ngay}
                                            </Td>
                                            <Td>{ten_app}</Td>
                                            <Td><Text fontWeight="600">{formatter.format(doanh_thu_gross)}</Text></Td>  
                                            <Td>
                                                <Text fontWeight="600"> 
                                                    {totalFabiSoTienGross ? formatter.format(Math.abs(totalFabiSoTienGross)) : 0}
                                                </Text>
                                            </Td>
                                            <Td>
                                                <Text fontWeight="600" color={chenhlech !== 0 ? "red.500" : ""}>
                                                    {formatter.format(chenhlech)}
                                                </Text>
                                            </Td>
                                        </Tr>
                                    )
                                })
                            }
                        </Tbody>
                    </Table>
                </TableContainer>
            </Flex>
        )
    }

    const ShopeeComponent = () => {
        return (
            <Flex ref={htmlDownloadRef} flexDirection="column" mb={8}>
                <Heading size="md" mb={4}>BẢNG THỐNG KÊ DOANH THU <Text as="span" color="orange.500">SHOPEE</Text> (TRỪ CHI PHÍ NỀN TẢNG)</Heading>
                <TableContainer mt={4}>
                    <Table variant="simple" size="sm">
                        <Thead>
                            <Tr textTransform="uppercase">
                                <Th><Text size="sm">NGÀY</Text></Th>
                                <Th><Text fontSize={10}>TÊN APP</Text></Th>   
                                <Th><Text fontSize={10}>DOANH THU <br/> GROSS</Text></Th>   
                                <Th><Text fontSize={10}>GIẢM GIÁ <br/>MÓN</Text></Th>   
                                <Th><Text fontSize={10}>GIẢM GIÁ MÃ <br/> KHUYẾN MÃI</Text></Th>   
                                <Th><Text fontSize={10}>SỐ TIỀN GIẢM</Text></Th>   
                                <Th><Text fontSize={10}>PHÍ DỊCH VỤ</Text></Th>   
                                <Th><Text fontSize={10}>THUẾ KHẦU TRỪ</Text></Th>   
                                <Th><Text fontSize={10}>CHI PHÍ SHOPEE</Text></Th>
                                <Th><Text fontSize={10}>THỰC THU</Text></Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                shopeeTableDatas.map((item, idx) => {
                                    const { 
                                        ngay, ten_app,
                                        doanh_thu_gross,
                                        giam_gia_mon,
                                        giam_gia_ma_khuyen_mai,
                                        so_tien_giam,
                                        phi_dich_vu,
                                        thue_khau_tru,
                                        chi_phi_shopee,
                                        thuc_thu,
                                    } = item;
                                    return (
                                        <Tr key={idx}>
                                            <Td>
                                                {ngay}
                                            </Td>
                                            <Td>{ten_app}</Td>
                                            <Td><Text fontWeight="600">{formatter.format(Math.abs(doanh_thu_gross))}</Text></Td>  
                                            <Td bg="gray.200"><Text fontWeight="600">{formatter.format(giam_gia_mon)}</Text></Td>  
                                            <Td bg="gray.200"><Text fontWeight="600">{formatter.format(giam_gia_ma_khuyen_mai)}</Text></Td>
                                            <Td bg="gray.200"><Text fontWeight="600">{formatter.format(so_tien_giam)}</Text></Td>
                                            <Td bg="gray.200"><Text fontWeight="600">{formatter.format(phi_dich_vu)}</Text></Td>
                                            <Td bg="gray.200"><Text fontWeight="600">{formatter.format(thue_khau_tru)}</Text></Td>
                                            <Td><Text fontWeight="600">{formatter.format(chi_phi_shopee)}</Text></Td>
                                            <Td><Text fontWeight="600">{formatter.format(thuc_thu)}</Text></Td>
                                        </Tr>
                                    )
                                })
                            }
                        </Tbody>
                        <Tfoot>
                            <Tr>
                                <Th></Th>
                                <Th><Text fontSize={12} fontWeight="600" color="red">TỔNG</Text></Th>
                                <Th><Text fontSize={12} fontWeight="600" color="red">{formatter.format(shopeeTableDatas.reduce((acc, item) => acc + item.doanh_thu_gross, 0))}</Text></Th>  
                                <Th bg="gray.200"><Text fontSize={12} fontWeight="600" color="red">{formatter.format(shopeeTableDatas.reduce((acc, item) => acc + item.giam_gia_mon, 0))}</Text></Th>  
                                <Th bg="gray.200"><Text fontSize={12} fontWeight="600" color="red">{formatter.format(shopeeTableDatas.reduce((acc, item) => acc + item.giam_gia_ma_khuyen_mai, 0))}</Text></Th>
                                <Th bg="gray.200"><Text fontSize={12} fontWeight="600" color="red">{formatter.format(shopeeTableDatas.reduce((acc, item) => acc + item.so_tien_giam, 0))}</Text></Th>  
                                <Th bg="gray.200"><Text fontSize={12} fontWeight="600" color="red">{formatter.format(shopeeTableDatas.reduce((acc, item) => acc + item.phi_dich_vu, 0))}</Text></Th>  
                                <Th bg="gray.200"><Text fontSize={12} fontWeight="600" color="red">{formatter.format(shopeeTableDatas.reduce((acc, item) => acc + item.thue_khau_tru, 0))}</Text></Th>  
                                <Th bg="gray.200"><Text fontSize={12} fontWeight="600" color="red">{formatter.format(shopeeTableDatas.reduce((acc, item) => acc + item.chi_phi_shopee, 0))}</Text></Th>  
                                <Th bg="gray.200"><Text fontSize={12} fontWeight="600" color="red">{formatter.format(shopeeTableDatas.reduce((acc, item) => acc + item.thuc_thu, 0))}</Text></Th>  
                            </Tr>
                        </Tfoot>
                    </Table>
                </TableContainer>

                <Heading size="md" my={4}>BẢNG ĐỐI CHIẾU CHÊNH LỆCH TIỀN APP <Text as="span" color="orange.500">SHOPEE</Text> VÀ <Text as="span" color="orange.500">FABI</Text></Heading>
                <TableContainer mt={4}>
                    <Table variant="simple" size="sm">
                        <Thead>
                            <Tr textTransform="uppercase">
                                <Th>NGÀY</Th>
                                <Th>TÊN APP</Th>   
                                <Th>TIỀN TỪ APP</Th>   
                                <Th>FABI</Th>
                                <Th>CHÊNH LỆCH</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                shopeeTableDatas.map((item, idx) => {
                                    const { ngay, ten_app, doanh_thu_gross,  } = item;
                                    const findFabiDatas = fabiDatas.filter(fabiItem => {
                                        return fabiItem.Date && (moment(fabiItem.Date)).add(7, "hours").toDate().getDate() === ngay;
                                        //return fabiItem.Date && (moment(fabiItem.Date, "YYYY-MM-DD").toDate().getDate() === (ngay));
                                    });
                                    // console.log("--------------------------------------------- ****************************")
                                    // console.log("findFabiDatas:", findFabiDatas)
                                    const totalFabiSoTienGross = findFabiDatas.reduce((acc, item) => acc + (item.SaleMetricsArray?.["Sale Shopee Gross"] || 0), 0);
                                    const chenhlech = Math.abs(totalFabiSoTienGross) - Math.abs(doanh_thu_gross);
                                    //console.log("findFabiDatas:", findFabiDatas)
                                    return (
                                        <Tr key={idx}>
                                            <Td>
                                                {ngay}
                                            </Td>
                                            <Td>{ten_app}</Td>
                                            <Td><Text fontWeight="600">{formatter.format(doanh_thu_gross)}</Text></Td>  
                                            <Td>
                                                <Text fontWeight="600"> 
                                                    {totalFabiSoTienGross ? formatter.format(Math.abs(totalFabiSoTienGross)) : 0}
                                                </Text>
                                            </Td>
                                            <Td>
                                                <Text fontWeight="600" color={chenhlech !== 0 ? "red.500" : ""}>
                                                    {formatter.format(chenhlech)}
                                                </Text>
                                            </Td>
                                        </Tr>
                                    )
                                })
                            }
                        </Tbody>
                    </Table>
                </TableContainer>
            </Flex>
        )
    }

    if(!isAllowAccessThisPage) {
        return (
            <Flex w="100%" p={4} flexDirection="column" alignItems="flex-start" justify="flex-start" h="100vh">
                <Text color="red.500"  fontSize="2xl" fontWeight="bold">**** Bạn không có quyền truy cập trang này (vui lòng liên hệ admin) ****</Text>
            </Flex>
        );
    }

    return (
        <Flex flexDirection="column" mt={{ base: 8, md: 0, lg: 0 }}>
            <Flex flexDirection="column" mx={4} my={4} opacity={isLoading ? 0.3 : 1} pointerEvents={isLoading ? "none" : "visible"}
            >
                <Flex flexDirection="row" flexWrap="wrap" align="center" spacing={4} mb={4} gap={2}>
                    <Text>Chọn chi nhánh:</Text>
                    <Select w={40} size="sm" value={selectedStoreName} placeholder='Chọn chi nhánh'
                        onChange={
                            (evt) => { setSelectedStoreName(evt.target.value) }
                        }
                    >
                        {   initDatas?.["Fabi05"] &&
                            (Object.keys(initDatas?.["Fabi05"]).sort((a, b) => a.localeCompare(b)) || []).map((key, idx) => (
                                <option key={`warehouse-${key}`} value={key}>{key}</option>
                            ))
                        }
                    </Select>

                    <Text>Chọn từ ngày:</Text>
                    <DatePicker
                        value={selectedFromDate}
                        onChange={setSelectedFromDate}
                        className="react-date-picker-custom"
                        format='dd/MM/yyyy'                                                
                    />

                    <Text>Chọn đến ngày:</Text>
                    <DatePicker
                        value={selectedToDate}
                        onChange={setSelectedToDate}
                        className="react-date-picker-custom"
                        format='dd/MM/yyyy'                                                
                    />

                    <Button
                        px={8}
                        colorScheme="blue"
                        onClick={() => {
                            handleSearchByDate();
                        }
                    }>
                        <Icon as={MdSearch} boxSize={6}/> Tìm theo ngày
                    </Button>
                    {/* <Button
                        px={8}
                        colorScheme="orange"
                        onClick={() => {
                            handleDownload();
                        }
                    }>
                        <Icon as={MdDownload} boxSize={6}/> Download PDF
                    </Button> */}
                </Flex>

                <HStack>
                    {
                        errorMessage &&
                        <Alert status="error" borderRadius={4}>
                            <AlertIcon />
                            <AlertDescription>{errorMessage}</AlertDescription>
                        </Alert>
                    }
                </HStack>

                <Tabs p={2}>
                    <TabList>
                        <Tab textTransform="uppercase">Dòng tiền doanh thu</Tab>
                        <Tab textTransform="uppercase">VnPay</Tab>
                        <Tab textTransform="uppercase">Momo</Tab>
                        <Tab textTransform="uppercase">Grab</Tab>
                        <Tab textTransform="uppercase">Befood</Tab>
                        <Tab textTransform="uppercase">Shopee</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <DoanhThuComponent />
                        </TabPanel>
                        <TabPanel>
                            <VnPayComponent />
                        </TabPanel>
                        <TabPanel>
                            <MomoComponent />
                        </TabPanel>
                            <TabPanel>
                            <GrabComponent />
                        </TabPanel>
                        <TabPanel>
                            <BefoodComponent />
                        </TabPanel>
                        <TabPanel>
                            <ShopeeComponent />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Flex>
         
            {
                isLoading &&
                <Center>
                    <CircularProgress position="fixed" top="20vh" isIndeterminate size="200px" zIndex={9999}>
                        <CircularProgressLabel fontSize="24px" fontWeight="700" color="#2196f3">Loading</CircularProgressLabel>
                    </CircularProgress>
                </Center>
            }
        </Flex>
    )
}

export default ChenhLechTienPage;