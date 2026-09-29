import React, {useState, useRef, useEffect} from 'react';
import { useCookies } from 'react-cookie';
import moment from 'moment/moment';
import { 
    Flex, Box, VStack, Heading, Button, ButtonGroup, Text, Icon, IconButton, FormControl, FormLabel, Input,
    Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, Alert, AlertIcon, AlertDescription, Select,
    Center, CircularProgress, CircularProgressLabel, useToast,
    HStack
} from '@chakra-ui/react';
import { MdSave, MdFileUpload, MdDeleteForever } from 'react-icons/md';
import { OutTable, ExcelRenderer } from 'react-excel-renderer/build';
import readXlsxFile from 'read-excel-file';
import * as XLSX from 'xlsx';
import _, { forEach } from "lodash";
import { IMPORT_FILE_TYPES } from "../../constants";
import httpClient from "../../services/http-client";
import { confirmChoice, sleep, countDaysInMonth } from "../../utils/helpers";

function ImportDatasV2() {
    const [ cookies, setCookie, removeCookie ] = useCookies(["loginCookie"]);
    const [isLoading, setIsLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [initDatas, setInitDatas] = useState({});
    const [isAllowAccessThisPage, setIsAllowAccessThisPage] = useState(true);
    const [rows, setRows] = useState([]);
    const [cols, setCols] = useState([]);
    const [currentRowClickedIdx, setCurrentRowClickedIdx] = useState(-1);
    const [rowDisplay, setRowDisplay] = useState({});
    const [rowImportType, setRowImportType] = useState({});
    const [fields, setFields] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const fileInputRef = useRef();
    const toast = useToast();
    const mounted = useRef();

    useEffect(() => {
        if(!mounted.current) {
            if(
                cookies.loginCookie?.data?.scope === "admin" || 
                cookies.loginCookie?.data?.scope === "import_data" || 
                cookies.loginCookie?.data?.scope === "all") {
                loadInitDatas();
            } else {
                setIsAllowAccessThisPage(false);
                //console.log("--- not authorized to access import datas page");
            }
            mounted.current = true;
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

    const excelSerialToDateTime = (serial) => {
        const excelEpoch = new Date(Date.UTC(1899, 11, 30));
        return new Date(excelEpoch.getTime() + serial * 24 * 60 * 60 * 1000);
    }

    const excelSerialToDate = (serial) => {
        const utcDate = new Date(Date.UTC(1899, 11, 30));
        utcDate.setUTCDate(utcDate.getUTCDate() + serial);
        return utcDate;
    }

    const readExcelFile = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                // const reader = new FileReader();

                // reader.onload = (event) => {
                //     const arrayBuffer = event.target.result;
                //     const workbook = XLSX.read(arrayBuffer, { type: 'buffer' });
                //     const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                //     const worksheetData = XLSX.utils.sheet_to_json(worksheet);

                //     console.log("--- VnPay worksheetData:", worksheetData);
                //         let _fields = [];
                //     worksheetData.map((row, idx) => {
                //         //console.log("--- row:", row)
                //         let thoi_gian_giao_dich = excelSerialToDateTime(row["Thời gian giao dịch"]);
                //         //let ma_giao_dich = row[index + 4];
                //         let loai_giao_dich = row["Loại giao dịch"];
                //         let so_tien_gd_vnd = row["Số tiền ghi nợ"];

                //         _fields.push({
                //             store_name: rowImportType[currentRowClickedIdx].store_name,
                //             thoi_gian_giao_dich, loai_giao_dich, so_tien_gd_vnd
                //         });
                //     });

                //     console.log("--- VnPay _fields:", _fields)
                // }

                // reader.readAsArrayBuffer(fileObj);

                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                resolve(jsonData);
            };
            reader.onerror = (error) => {
                reject(error);
            };
            reader.readAsArrayBuffer(file);
        });
    }

    // console.log("--- fields:", fields)
    const fileHandler = async(event) => {
        try
        {
            if(event.target.files.length) {
                setIsLoading(true);
                let fileObj = event.target.files[0];
                let fileName = fileObj.name;
                let fileSize = fileObj.size / 1024 / 1024;
                //let isLt1M = fileObj.size / 1024 / 1024 < 1;
                const fileType = fileName.slice(fileName.lastIndexOf('.') + 1);

                if(fileType === "xlsx") {
                    rowDisplay[currentRowClickedIdx] = {
                        fileName,
                        fileSize
                    }
                    setRowDisplay({...rowDisplay});
                    console.log("--- rowImportType[currentRowClickedIdx]:", rowImportType[currentRowClickedIdx])    

                    // Fabi 05
                    if(rowImportType[currentRowClickedIdx] === "fabi_05") {
                        readXlsxFile(fileObj, {sheet: "Tất cả cửa hàng"}).then(async(_rows) => {
                            console.log("--- Fabi 05:", _rows)
                            let _fields = [];

                            _rows.forEach((row, idx) => {
                                const index = 0;
                                console.log("--- row:", row[index + 1])
                                if(row[index + 1] > 0) {
                                    let cuaHang = row[index];
                                    let posID = row[index + 1];
                                    let maHang = row[index + 2];
                                    let tenHang = row[index + 3];
                                    let nhomMon = row[index + 4];
                                    let loaiMon = row[index + 5];
                                    let maCombo = row[index + 6];
                                    let pTTT = row[index + 7];    
                                    let nguon = row[index + 8];
                                    let khuVuc = row[index + 9];
                                    let ban = row[index + 10];
                                    let maHoaDon = row[index + 11];
                                    let soHD = row[index + 12];
                                    let thoiGian = row[index + 13];
                                    let gio = parseInt(row[index + 14].split(":")[0]);
                                    let soLuong = row[index + 15];
                                    let donViTinh = row[index + 16];
                                    let gia = row[index + 17];
                                    let giaBan = row[index + 18];
                                    let thanhTien = row[index + 19];
                                    let giamGia = row[index + 20];
                                    let chietKhau = row[index + 21];
                                    let phiHoTroMarketing = row[index + 22];
                                    let phieuGG = row[index + 23];
                                    let phiDichVu = row[index + 24];
                                    let vAT = row[index + 25];
                                    let thue = row[index + 26];
                                    let thueKhauTru = row[index + 27];
                                    let giamGiaVAT = row[index + 28];
                                    let phiShip = row[index + 29];
                                    let tongTienKhongVAT = row[index + 30];
                                    let hoaHong = row[index + 31];
                                    let tongTienBaoGomHoaHong = row[index + 32];
                                    let tenCTKM = row[index + 33];
                                    let maVoucher = row[index + 34];
                                    let tenKhach = row[index + 35];
                                    let soKhach = row[index + 36];
                                    let soDienThoai = row[index + 37];
                                    let tongTien = row[index + 38];
                                    let ghiChu = row[index + 39];

                                    _fields.push({
                                        cuaHang, posID, maHang, tenHang, nhomMon, loaiMon, maCombo, pTTT, nguon, khuVuc, 
                                        ban, maHoaDon, soHD, thoiGian, gio, soLuong, donViTinh, gia, giaBan, thanhTien,
                                        giamGia, chietKhau, phiHoTroMarketing, phieuGG, phiDichVu, vAT, thue, thueKhauTru,
                                        giamGiaVAT, phiShip, tongTienKhongVAT, hoaHong, tongTienBaoGomHoaHong, tenCTKM,
                                        maVoucher, tenKhach, soKhach, soDienThoai, tongTien, ghiChu
                                    });
                                }
                            });

                            setFields(_fields);
                            setIsLoading(false);
                        }).catch(error => {
                            console.log("--- error:",error )
                            setErrorMessage("Lỗi import filed. Vui lòng kiểm tra lại file import!");
                            setIsLoading(false);
                        })
                    } 
                    // Momo
                    else if(rowImportType[currentRowClickedIdx].file_type === "momo") {
                        readXlsxFile(fileObj).then(async(_rows) => {
                            console.log("--- Momo:", _rows)
                            let _fields = [];

                            _rows.forEach((row, idx) => {
                                if(idx === 0) return;
                                const index = 0;
                                console.log("--- row:", row[index])
                                if(row[index] !== null && row[index] !== undefined && row[index] !== "") {
                                    let thoi_gian = row[index];
                                    let ma_don_hang = row[index + 1];
                                    let ma_don_hang_goc = row[index + 2];
                                    let ma_giao_dich = row[index + 3];
                                    let trang_thai = row[index + 4];
                                    let ten_khach_hang = row[index + 5];
                                    let so_dien_thoai_khach_hang = row[index + 6];
                                    let loai_giao_dich = row[index + 7];    
                                    let so_tien = row[index + 8];
                                    let so_tien_giam_gia = row[index + 9];
                                    let kenh_thanh_toan = row[index + 10];
                                    let phuong_thuc_thanh_toan = row[index + 11];
                                    let nguon_tien = row[index + 12];
                                    let mo_ta_giao_dich = row[index + 13];
                                    let ma_cua_hang = row[index + 14];
                                    let ten_cua_hang = row[index + 15];
                                    console.log("--- so_tien:", so_tien)
                                    if(so_tien > 0) {
                                        const [d, m, yAndTime] = thoi_gian.split("-");
                                        const isoString = `${yAndTime.split(" ")[0]}-${m}-${d}T${yAndTime.split(" ")[1]}`;
                                        thoi_gian = new Date(isoString);

                                        _fields.push({
                                            store_name: rowImportType[currentRowClickedIdx].store_name,
                                            thoi_gian, ma_don_hang, ma_don_hang_goc, ma_giao_dich, trang_thai, ten_khach_hang, so_dien_thoai_khach_hang, 
                                            loai_giao_dich, so_tien, so_tien_giam_gia, kenh_thanh_toan, phuong_thuc_thanh_toan, nguon_tien, mo_ta_giao_dich, ma_cua_hang, ten_cua_hang
                                        });

                                        console.log("--- MOMO _fields 22222:", _fields)
                                    }
                                }
                            });

                            console.log("--- MOMO _fields:", _fields)
                            setFields({...fields, [currentRowClickedIdx]: _fields});
                            setIsLoading(false);
                        }).catch(error => {
                            console.log("--- error:",error )
                            setErrorMessage("Lỗi import filed. Vui lòng kiểm tra lại file import!");
                            setIsLoading(false);
                        })
                    }
                    // VnPay
                    else if(rowImportType[currentRowClickedIdx].file_type === "vnpay") {
                        // ** Sử dụng phương pháp khác
                        const reader = new FileReader();

                        reader.onload = (event) => {
                            const arrayBuffer = event.target.result;
                            const workbook = XLSX.read(arrayBuffer, { type: 'buffer' });
                            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                            const worksheetData = XLSX.utils.sheet_to_json(worksheet);

                            console.log("--- VnPay worksheetData:", worksheetData);
                             let _fields = [];
                            worksheetData.map((row, idx) => {
                                //console.log("--- row:", row)
                                let thoi_gian_giao_dich = excelSerialToDateTime(row["Thời gian giao dịch"]);
                                //let ma_giao_dich = row[index + 4];
                                let loai_giao_dich = row["Loại giao dịch"];
                                let so_tien_gd_vnd = row["Số tiền ghi nợ"];

                                _fields.push({
                                    store_name: rowImportType[currentRowClickedIdx].store_name,
                                    thoi_gian_giao_dich, loai_giao_dich, so_tien_gd_vnd
                                });
                            });

                            console.log("--- VnPay _fields:", _fields)
                        }

                        reader.readAsArrayBuffer(fileObj);
                        // readXlsxFile(fileObj).then(async(_rows) => {
                        //     console.log("--- VnPay:", _rows)
                        //     let _fields = [];
                        //     return;
                        //     _rows.forEach((row, idx) => {
                        //         if(idx === 0) return;
                        //         const index = 0;   
                        //         //console.log("--- row:", row[index + 1])
                        //         if(row[index] !== null && row[index] !== undefined && row[index] !== "") {
                        //             let stt = row[index];
                        //             let dai_ly = row[index + 1];
                        //             let cong_no = row[index + 2];
                        //             let thoi_gian_giao_dich = row[index + 3];
                        //             let ma_giao_dich = row[index + 4];
                        //             let loai_giao_dich = row[index + 5];
                        //             let so_tien_gd_vnd = row[index + 6];
                        //             let trang_thai = row[index + 7];    
                        //             let noi_dung_giao_dich = row[index + 8];                    

                        //             if(so_tien_gd_vnd !== 0) {
                        //                 if(typeof thoi_gian_giao_dich === "string" && thoi_gian_giao_dich.indexOf("/") > -1) {
                        //                     const [d, m, yAndTime] = thoi_gian_giao_dich.split("/");
                        //                     //console.log("--- d, m, yAndTime:", d, m, yAndTime)
                        //                     const isoString = `${yAndTime.split(" ")[0]}-${m}-${d}T${yAndTime.split(" ")[1]}`;
                        //                     //console.log("--- isoString:", isoString)
                        //                     const  new_thoi_gian_giao_dich = new Date(isoString);
                        //                     //console.log("--- new_thoi_gian_giao_dich:", new_thoi_gian_giao_dich)
                        //                     _fields.push({
                        //                         store_name: rowImportType[currentRowClickedIdx].store_name,
                        //                         stt, dai_ly, cong_no, thoi_gian_giao_dich: new_thoi_gian_giao_dich, 
                        //                         ma_giao_dich, loai_giao_dich, 
                        //                         so_tien_gd_vnd, trang_thai, noi_dung_giao_dich
                        //                     });
                        //                 } else {
                        //                     // _fields.push({
                        //                     //     store_name: rowImportType[currentRowClickedIdx].store_name,
                        //                     //     stt, dai_ly, cong_no, thoi_gian_giao_dich, ma_giao_dich, loai_giao_dich, 
                        //                     //     so_tien_gd_vnd, trang_thai, noi_dung_giao_dich
                        //                     // });
                        //                 }
                        //             }
                        //         }
                        //     });

                        //     console.log("--- _fields:", _fields);
                        //     setFields({...fields, [currentRowClickedIdx]: _fields});
                        //     setIsLoading(false);
                        // }).catch(error => {
                        //     console.log("--- error:",error )
                        //     setErrorMessage("Lỗi import filed. Vui lòng kiểm tra lại file import!");
                        //     setIsLoading(false);
                        // })
                    }
                    // Shopee
                    else if(rowImportType[currentRowClickedIdx].file_type === "shopee") {
                        try {
                            const shopeeWorksheetDatas = await readExcelFile(fileObj);
                            console.log("--- shopeeWorksheetDatas:", shopeeWorksheetDatas);
                            
                            let _fields = [];
                            shopeeWorksheetDatas.map((row, idx) => {
                                //console.log("--- row:", row)                
                                let ma_don_hang = row["Mã đơn hàng"];
                                let tinh_trang_thanh_toan = row["Tình trạng thanh toán"];
                                let thanh_tien_doanh_thu = row["Thành tiền Doanh Thu (Giá gốc x Số lượng)"];
                                let giam_gia_mon = row["Giảm giá món"];
                                let giam_gia_ma_khuyen_mai = row["Giảm giá mã khuyến mãi"];
                                let so_tien_giam = row["Số tiền giảm"];
                                let phi_dich_vu = row["Phí dịch vụ"];
                                let thue_khau_tru = row["Thuế khấu trừ"];
                                let ngay_dat_hang = excelSerialToDate(row["Ngày đặt hàng"]);

                                _fields.push({
                                    store_name: rowImportType[currentRowClickedIdx].store_name,
                                    ma_don_hang, tinh_trang_thanh_toan, thanh_tien_doanh_thu, 
                                    giam_gia_mon, giam_gia_ma_khuyen_mai, so_tien_giam, phi_dich_vu, thue_khau_tru, ngay_dat_hang
                                });
                            });

                            setFields({...fields, [currentRowClickedIdx]: _fields});
                            setIsLoading(false);
                            console.log("--- Shopee _fields:", _fields)
                        }
                        catch(error) {
                            console.log("--- error:",error )
                            setErrorMessage("Lỗi import filed. Vui lòng kiểm tra lại file import!");
                            setIsLoading(false);
                        }

                        // readXlsxFile(fileObj).then(async(_rows) => {
                        //     console.log("--- Shopee:", _rows)
                        //     let _fields = [];

                        //     _rows.forEach((row, idx) => {
                        //         if(idx === 0) return;
                        //         const index = 0;
                        //         //console.log("--- row:", row[index + 1])
                        //         if(row[index] !== null && row[index] !== undefined && row[index] !== "") {
                        //             let stt = row[index];
                        //             let ten_cua_hang = row[index + 1];
                        //             let trang_thai_pos = row[index + 2];
                        //             let ma_don_hang = row[index + 3];
                        //             let ngay_dat_hang = row[index + 4];
                        //             let gio_dat_hang = row[index + 5];
                        //             let ten_nguoi_nhan = row[index + 6];
                        //             let so_dt_nguoi_nhan = row[index + 7];
                        //             let dia_chi_nhan_hang = row[index + 8];    
                        //             let ten_san_pham = row[index + 9];
                        //             let so_luong_san_pham = row[index + 10];
                        //             let gia_ban_san_pham = row[index + 11];
                        //             let gia_goc_san_pham = row[index + 12];
                        //             let thanh_tien_doanh_thu = row[index + 13];
                        //             let phan_tram_ck = row[index + 14];
                        //             let ghi_chu = row[index + 15];
                        //             let cua_hang_ghi_chu = row[index + 16];
                        //             let ma_khuyen_mai = row[index + 17];
                        //             let giam_gia_mon = row[index + 18];
                        //             let giam_gia_ma_khuyen_mai = row[index + 19];
                        //             let giam_truc_tiep = row[index + 20];
                        //             let so_tien_giam = row[index + 21];
                        //             let tinh_trang_thanh_toan = row[index + 22];
                        //             let vat = row[index + 23];
                        //             let phi_dich_vu = row[index + 24];
                        //             let thue_khau_tru = row[index + 25];
                        //             let phuong_thuc_thanh_toan_cua_khach = row[index + 26];
                        //             let ngay_hoan_tat_pos = row[index + 27];
                        //             let ly_do_huy = row[index + 28];
                        //             let order_type = row[index + 29];

                        //             if(thanh_tien_doanh_thu > 0) {
                        //                 _fields.push({
                        //                     store_name: rowImportType[currentRowClickedIdx].store_name,
                        //                     ten_cua_hang, trang_thai_pos, ma_don_hang, ngay_dat_hang, gio_dat_hang, ten_nguoi_nhan, 
                        //                     so_dt_nguoi_nhan, dia_chi_nhan_hang, ten_san_pham, so_luong_san_pham, 
                        //                     gia_ban_san_pham, gia_goc_san_pham, thanh_tien_doanh_thu, phan_tram_ck, ghi_chu, cua_hang_ghi_chu,
                        //                     ma_khuyen_mai, giam_gia_mon, giam_gia_ma_khuyen_mai, giam_truc_tiep, so_tien_giam, tinh_trang_thanh_toan,
                        //                     vat, phi_dich_vu, thue_khau_tru, phuong_thuc_thanh_toan_cua_khach, 
                        //                     ngay_hoan_tat_pos, ly_do_huy, order_type
                        //                 });
                        //             }
                        //         }
                        //     });

                        //     console.log("--- _fields:", _fields)
                        //     //setFields(_fields);
                        //     setFields({...fields, [currentRowClickedIdx]: _fields});
                        //     setIsLoading(false);
                        // }).catch(error => {
                        //     console.log("--- error:",error )
                        //     setErrorMessage("Lỗi import filed. Vui lòng kiểm tra lại file import!");
                        //     setIsLoading(false);
                        // })
                    }
                    // Grab
                    else if(rowImportType[currentRowClickedIdx].file_type === "grab") {
                        readXlsxFile(fileObj).then(async(_rows) => {
                            console.log("--- Grab:", _rows)
                            let _fields = [];

                            _rows.forEach((row, idx) => {
                                if(idx === 0) return;
                                const index = 0;
                                //console.log("--- row:", row[index + 1])
                                if(row[index] !== null && row[index] !== undefined && row[index] !== "") {
                                    let ten_nguoi_ban = row[index];
                                    let merchant_id = row[index + 1];
                                    let ten_cua_hang = row[index + 2];
                                    let ma_so_cua_hang = row[index + 3];
                                    let cap_nhat_vao = row[index + 4];
                                    let ngay_tao = row[index + 5];
                                    let loai = row[index + 6];
                                    let danh_muc = row[index + 7];    
                                    let danh_muc_con = row[index + 8];
                                    let trang_thai = row[index + 9];
                                    let ma_giao_dich = row[index + 10];
                                    let ma_giao_dich_da_duoc_lien_ket = row[index + 11];

                                    let ma_giao_dich_doi_tac_1 = row[index + 12];
                                    let ma_giao_dich_doi_tac_2 = row[index + 13];
                                    let ma_don_hang_dai = row[index + 14];
                                    let ma_don_hang_ngan = row[index + 15];
                                    let ma_dat_hang = row[index + 16];
                                    let kenh_dat_hang = row[index + 17];
                                    let loai_don_hang = row[index + 18];
                                    let phuong_thuc_thanh_toan = row[index + 19];
                                    let tai_khoan_nhan_nguon_tien = row[index + 20];
                                    let ma_may_giao_dich = row[index + 21];
                                    let kenh_thanh_toan = row[index + 22];
                                    let loai_uu_dai = row[index + 23];

                                    let phi_dich_vu_grab = row[index + 24];
                                    let he_so_diem = row[index + 25];
                                    let diem_da_nhan = row[index + 26];
                                    let ma_giao_dich_2 = row[index + 27];
                                    let ngay_chuyen_khoan = row[index + 28];
                                    let so_tien = row[index + 29];
                                 

                                    let thue_don_hang = row[index + 30];
                                    let phi_do_goi_mang_ve = row[index + 31];
                                    let phi_danh_cho_quan_chua_la_thanh_vien = row[index + 32];
                                    let phi_dich_vu_cua_quan = row[index + 33];
                                    let uu_dai = row[index + 34];
                                    let giam_gia = row[index + 35];
                                    let giam_phi_giao_hang = row[index + 36];
                                    let phi_giao_hang_quan_online_tren_grab = row[index + 37];
                                    let phi_giao_hang_duoc_giao_boi_quan = row[index + 38];
                                    let phi_giao_hang_grabexpress = row[index + 39];
                                    let doanh_thu_rong = row[index + 40];
                                    let mdr_rong = row[index + 41];
                                    let thue_mdr = row[index + 42];
                                    let phi_cho_grab = row[index + 43];
                                    let phi_tiep_thi_thanh_cong = row[index + 44];
                                    let chiet_khau_giao_hang = row[index + 45];
                                    let chiet_khau_tu_cac_kenh_ban_hang = row[index + 46];
                                    let chiet_khau_don_hang = row[index + 47];
                                    let chiet_khau_cho_grabfood_grabmart = row[index + 48];
                                    let grab_kitchen_commission = row[index + 49];
                                    let cac_khoan_chiet_khau_khac_cho_grab_kitchen = row[index + 50];
                                    let thue_tai_nguon = row[index + 51];
                                    let vat_amount = row[index + 52];
                                    let pit_amount = row[index + 53];
                                    let tong_cong = row[index + 54];
                                    let thue_tren_mdr = row[index + 55];
                                    let thue_tren_tien_chiet_khau_cho_grabfood_grabmart_dieu_chinh_quang_cao = row[index + 56];
                                    let thue_tren_tong_chiet_khau_cho_grabkitchen = row[index + 57];
                                    let ly_do_huy = row[index + 58];
                                    let huy_boi = row[index + 59];

                                    if(so_tien !== 0) {
                                        _fields.push({
                                            store_name: rowImportType[currentRowClickedIdx].store_name,
                                            ten_nguoi_ban, merchant_id, ten_cua_hang, ma_so_cua_hang, cap_nhat_vao, ngay_tao, 
                                            loai, danh_muc, danh_muc_con, trang_thai, ma_giao_dich, ma_giao_dich_da_duoc_lien_ket,
                                            ma_giao_dich_doi_tac_1, ma_giao_dich_doi_tac_2, ma_don_hang_dai,
                                            ma_don_hang_ngan, ma_dat_hang, kenh_dat_hang, loai_don_hang,
                                            phuong_thuc_thanh_toan, tai_khoan_nhan_nguon_tien, ma_may_giao_dich, 
                                            kenh_thanh_toan, loai_uu_dai, phi_dich_vu_grab,
                                            he_so_diem, diem_da_nhan, ma_giao_dich_2, ngay_chuyen_khoan, so_tien, thue_don_hang, phi_do_goi_mang_ve,
                                            phi_danh_cho_quan_chua_la_thanh_vien, phi_dich_vu_cua_quan, uu_dai, giam_gia, giam_phi_giao_hang,
                                            phi_giao_hang_quan_online_tren_grab, phi_giao_hang_duoc_giao_boi_quan, phi_giao_hang_grabexpress, 
                                            doanh_thu_rong, mdr_rong, thue_mdr, phi_cho_grab, phi_tiep_thi_thanh_cong, chiet_khau_giao_hang,
                                            chiet_khau_tu_cac_kenh_ban_hang, chiet_khau_don_hang, chiet_khau_cho_grabfood_grabmart, 
                                            grab_kitchen_commission,
                                            cac_khoan_chiet_khau_khac_cho_grab_kitchen, thue_tai_nguon, vat_amount, pit_amount, tong_cong,
                                            thue_tren_mdr, thue_tren_tien_chiet_khau_cho_grabfood_grabmart_dieu_chinh_quang_cao, thue_tren_tong_chiet_khau_cho_grabkitchen,
                                            ly_do_huy, huy_boi
                                        });
                                    }
                                }
                            });

                            
                            console.log("--- _fields:", _fields)

                            //setFields(_fields);
                            setFields({...fields, [currentRowClickedIdx]: _fields});
                            setIsLoading(false);
                        }).catch(error => {
                            console.log("--- error:",error )
                            setErrorMessage("Lỗi import filed. Vui lòng kiểm tra lại file import!");
                            setIsLoading(false);
                        })
                    }
                    // Befood --> (OK)
                    else if(rowImportType[currentRowClickedIdx].file_type === "befood") {
                        readXlsxFile(fileObj).then(async(_rows) => {
                            console.log("--- Beefood:", _rows)
                            let _fields = [];

                            _rows.forEach((row, idx) => {
                                if(idx === 0) return;
                                const index = 0;
                                //console.log("--- row:", row[index + 1])

                                if(row[index] !== null && row[index] !== undefined && row[index] !== "") {
                                    let thoi_gian_dat_hang = row[index];
                                    let id_cua_hang = row[index + 1];
                                    let ten_cua_hang = row[index + 2];
                                    let ma_don_hang = row[index + 3];
                                    let trang_thai_don_hang = row[index + 4];
                                    let gia_tri_don_hang = row[index + 5];
                                    let km_tu_nguoi_ban = row[index + 6];
                                    let dong_tai_tro = row[index + 7];    
                                    let phi_thuc_day_hien_thi = row[index + 8];
                                    let tai_tro_bePoint = row[index + 9];
                                    let lay_tai_quan = row[index + 10];
                                    let gia_tri_don_hang_sau_km = row[index + 11];
                                    let phi_dv_tmdt = row[index + 12];
                                    let thue_vat = row[index + 13];
                                    let thue_pit = row[index + 14];
                                    let thu_nhap_tam_tinh = row[index + 15];
                               
                                    if(gia_tri_don_hang > 0) {
                                        _fields.push({
                                            store_name: rowImportType[currentRowClickedIdx].store_name,
                                            thoi_gian_dat_hang, id_cua_hang, ten_cua_hang, ma_don_hang, 
                                            trang_thai_don_hang, gia_tri_don_hang, km_tu_nguoi_ban, dong_tai_tro, phi_thuc_day_hien_thi, tai_tro_bePoint,
                                            lay_tai_quan, gia_tri_don_hang_sau_km, phi_dv_tmdt, thue_vat, thue_pit, thu_nhap_tam_tinh
                                        });
                                    }
                                }
                            });
                            console.log("--- Beefood _fields:", _fields)

                            setFields({...fields, [currentRowClickedIdx]: _fields});
                            setIsLoading(false);
                        }).catch(error => {
                            console.log("--- error:",error )
                            setErrorMessage("Lỗi import filed. Vui lòng kiểm tra lại file import!");
                            setIsLoading(false);
                        })
                    } 
                    // Vietcombank
                    else if(rowImportType[currentRowClickedIdx].file_type === "vietcombank") {
                        readXlsxFile(fileObj).then(async(_rows) => {
                            console.log("--- Vietcombank:", _rows)
                            let _fields = [];

                            _rows.forEach((row, idx) => {
                                if(idx === 0) return;
                                const index = 0;

                                if(row[index] !== null && row[index] !== undefined && row[index] !== "") {
                                    let stt = row[index];
                                    let ngay_1 = row[index + 1];
                                    let ngay_hieu_luc_2 = row[index + 2];
                                    let so_tien_ghi_no = row[index + 3];
                                    let so_tien_ghi_co = row[index + 4];
                                    let so_du = row[index + 5];
                                    let noi_dung_chi_tiet = row[index + 6];
                                    
                                    //console.log("--- sodu, idx", so_du, idx)
                                    if(so_du > 0) {
                                        console.log("--- ngay_hieu_luc_2", ngay_hieu_luc_2, idx)
                                        // if(typeof ngay_hieu_luc_2 === "string" && ngay_hieu_luc_2.indexOf("/") > -1) {
                                        //     const [d, m, yAndTime] = ngay_hieu_luc_2.split("/");
                                        //     console.log("--- d, m, yAndTime:", d, m, yAndTime)
                                        //     const isoString = `${yAndTime.split(" ")[0]}-${m}-${d}`;
                                        //     console.log("--- isoString:", isoString)
                                        //     const  new_ngay_hieu_luc_2 = new Date(isoString);
                                        //     console.log("--- new_ngay_hieu_luc_2:", new_ngay_hieu_luc_2)
                                           _fields.push({
                                                store_name: rowImportType[currentRowClickedIdx].store_name,
                                                stt, ngay_1, ngay_hieu_luc_2, so_tien_ghi_no, so_tien_ghi_co, so_du, noi_dung_chi_tiet
                                            });
                                        // }
                                    }
                                }
                            });
                            console.log("--- Vietcombank _fields:", _fields)

                            setFields({...fields, [currentRowClickedIdx]: _fields});
                            setIsLoading(false);
                        }).catch(error => {
                            console.log("--- error:",error )
                            setErrorMessage("Lỗi import filed. Vui lòng kiểm tra lại file import!");
                            setIsLoading(false);
                        })
                    } 
                    else {
                        setIsLoading(false);
                    }
                } 
            }
        } catch(error) {
            console.log("--- error:", error)
        }
    }
    // console.log("--- rowImportType:", rowImportType)
    // console.log("--- currentRowClickedIdx:", currentRowClickedIdx)

    if(!isAllowAccessThisPage) {
        return (
            <Flex w="100%" p={4} flexDirection="column" alignItems="flex-start" justify="flex-start" h="100vh">
                <Text color="red.500"  fontSize="2xl" fontWeight="bold">**** Bạn không có quyền truy cập trang này (vui lòng liên hệ admin) ****</Text>
            </Flex>
        );
    }

    return (
        <Box w="100vw" h="100vh" bg="ghostwhite">
            {
                errorMessage &&
                <Alert status="error" borderRadius={4}>
                    <AlertIcon />
                    <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
            }

            {
                successMessage &&
                <Alert status="success" borderRadius={4}>
                    <AlertIcon />
                    <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
            }

            <Flex flexDirection="column" w="100%" p={4}>
                <Heading size="md">Danh sách file</Heading>
                <input type="file" accept='.xlsx,.csv' ref={fileInputRef} hidden style={{ padding: "10px"}}
                    onChange={fileHandler} 
                    onClick={(event) => {event.target.value = null}} 
                />
                <TableContainer minW="100%" mt={4} border="1px solid #e2e8f0" borderRadius={4} bg="white" p={4}>
                    <Table variant="simple" size="sm">
                        <Thead>
                            <Tr textTransform="uppercase">
                                <Th>Stt</Th>
                                <Th>Cửa hàng</Th>
                                <Th>Loại file</Th>
                                <Th>Upload file</Th>
                                <Th>File name</Th>
                                <Th>File size</Th>
                                <Th>Lưu vào Database</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((file, idx) => {
                                    const { fileName, fileSize } = file || {};
                                    return (
                                        <Tr key={idx}>
                                            <Td>
                                                {idx + 1}
                                            </Td>
                                             <Td>
                                            <Select maxW={200} size="sm" placeholder="Chọn cửa hàng"
                                                    onChange={(event) => {
                                                        setRowImportType(prev => ({ ...prev, [idx]: {
                                                            ...prev[idx],
                                                            store_name: event.target.value
                                                        }}));
                                                    }}
                                                >
                                                    {   initDatas?.["Fabi05"] &&
                                                        (Object.keys(initDatas?.["Fabi05"]).sort((a, b) => a.localeCompare(b)) || []).map((key, idx) => (
                                                            <option key={`warehouse-${key}`} value={key}>{key}</option>
                                                        ))
                                                    }
                                                    {/* {
                                                        [{label: 'CKB - CN1 GADL', value: 'CKB - CN1 GADL'}, {label: 'CKB - CN2 KHB', value: 'CKB - CN2 KHB'}].map((item, idx) => (
                                                            <option key={`import-file-type-${idx}`} value={item.value}>{item.label}</option>
                                                        ))
                                                    } */}
                                                </Select>
                                            </Td>
                                            <Td>
                                                <Select maxW={200} size="sm" placeholder="Chọn loại file"
                                                    onChange={(event) => {
                                                        setRowImportType(prev => ({ ...prev, [idx]: {
                                                            ...prev[idx],
                                                            file_type: event.target.value
                                                        }}));
                                                    }}
                                                >
                                                    {
                                                        IMPORT_FILE_TYPES.map((item, idx) => (
                                                            <option key={`import-file-type-${idx}`} value={item.value}>{item.label}</option>
                                                        ))
                                                    }
                                                </Select>
                                            </Td>
                                            <Td>
                                                <Button colorScheme='purple' size="sm"
                                                    onClick={() => {
                                                            //console.log("--- rowImportType[idx]:", rowImportType[idx])
                                                            if(!rowImportType[idx]?.store_name) {
                                                                toast({
                                                                    title: "Vui lòng chọn chi nhánh trước khi lưu dữ liệu!",
                                                                    status: "warning",
                                                                    duration: 3000,
                                                                    isClosable: true,
                                                                })
                                                                return;
                                                            }
                                                            if(!rowImportType[idx]?.file_type) {
                                                                toast({
                                                                    title: "Vui lòng chọn loại file trước khi lưu dữ liệu!",
                                                                    status: "warning",
                                                                    duration: 3000,
                                                                    isClosable: true,
                                                                })
                                                                return;
                                                            }
                                                            setCurrentRowClickedIdx(idx);
                                                            fileInputRef.current.click();
                                                        }
                                                    }
                                                >
                                                    <Icon boxSize={6} as={MdFileUpload} marginRight="8px"/>   
                                                    <Text>Upload file</Text>
                                                </Button>
                                            </Td>
                                            <Td><Text color="blue">{rowDisplay[idx]?.fileName}</Text></Td>
                                            <Td>{(rowDisplay[idx]?.fileSize || 0).toFixed(2)} Mb</Td>
                                            <Td alignItems='center'>
                                                {
                                                    rowDisplay[idx]?.fileName &&
                                                    <Button colorScheme='blue' size="sm" 
                                                        isLoading={(currentRowClickedIdx === idx) && isProcessing}
                                                        loadingText="Đang lưu dữ liệu..."
                                                        onClick={() => {
                                                                if(!rowImportType[idx]?.file_type) {
                                                                    toast({
                                                                        title: "Vui lòng chọn loại file trước khi lưu dữ liệu!",
                                                                        status: "warning",
                                                                        duration: 3000,
                                                                        isClosable: true,
                                                                    })
                                                                    return;
                                                                }
                                                                setCurrentRowClickedIdx(idx);
                                                                confirmChoice("Bạn có đồng ý lưu dữ liệu không?", async() => {
                                                                    const fieldSplitted = _.chunk(fields[currentRowClickedIdx], 50);
                                                                    // *** Save to databases
                                                                    setIsProcessing(true);
                                                                    console.log("fieldSplitted:", fieldSplitted)

                                                                    // Fabi 05
                                                                    if(rowImportType[currentRowClickedIdx]?.file_type === "fabi_05") {
                                                                        fieldSplitted.map((fieldSplit, idx) => {
                                                                            setTimeout(async() => {
                                                                                const saveFabi05DatasRes = await httpClient.post(`/save_fabi_05_datas`, {
                                                                                    fields: fieldSplit
                                                                                });

                                                                                if(idx === fieldSplitted.length - 1) { 
                                                                                    setIsProcessing(false);
                                                                                    toast({
                                                                                        title: "Lưu dữ liệu thành công!",
                                                                                        status: "success",
                                                                                        duration: 3000,
                                                                                        isClosable: true,
                                                                                    })
                                                                                }
                                                                            }, idx * 1000);
                                                                        });
                                                                    }
                                                                    // Vietcombank
                                                                    else if(rowImportType[currentRowClickedIdx]?.file_type === "vietcombank") {
                                                                        console.log("---- save vietcombank datas")
                                                                        fieldSplitted.map(async(fieldSplit, vietcombankIdx) => {
                                                                            const saveVietcombankDatasRes = await httpClient.post(`vietcombank/save_datas`, {
                                                                                fields: fieldSplit
                                                                            });

                                                                            if(vietcombankIdx === fieldSplitted.length - 1) { 
                                                                                setIsProcessing(false);
                                                                                toast({
                                                                                    title: "Lưu dữ liệu thành công!",
                                                                                    status: "success",
                                                                                    duration: 3000,
                                                                                    isClosable: true,
                                                                                })
                                                                            }
                                                                        });
                                                                    }
                                                                    // Momo
                                                                    else if(rowImportType[currentRowClickedIdx]?.file_type === "momo") {
                                                                        console.log("---- save momo datas")
                                                                        fieldSplitted.map(async(fieldSplit, momoIdx) => {
                                                                            const saveMomoDatasRes = await httpClient.post(`momo/save_datas`, {
                                                                                fields: fieldSplit
                                                                            });

                                                                            if(momoIdx === fieldSplitted.length - 1) { 
                                                                                setIsProcessing(false);
                                                                                toast({
                                                                                    title: "Lưu dữ liệu thành công!",
                                                                                    status: "success",
                                                                                    duration: 3000,
                                                                                    isClosable: true,
                                                                                })
                                                                            }
                                                                        });
                                                                    }
                                                                    // Vnpay
                                                                    else if(rowImportType[currentRowClickedIdx]?.file_type === "vnpay") {
                                                                        console.log("---- save vnpay datas")
                                                                        fieldSplitted.map(async(fieldSplit, vnpayIdx) => {
                                                                            const saveVnpayDatasRes = await httpClient.post(`/vnpay/save_datas`, {
                                                                                fields: fieldSplit
                                                                            });

                                                                            if(vnpayIdx === fieldSplitted.length - 1) { 
                                                                                setIsProcessing(false);
                                                                                toast({
                                                                                    title: "Lưu dữ liệu thành công!",
                                                                                    status: "success",
                                                                                    duration: 3000,
                                                                                    isClosable: true,
                                                                                })
                                                                            }
                                                                        });
                                                                    }
                                                                    // Shopee
                                                                    else if(rowImportType[currentRowClickedIdx]?.file_type === "shopee") {
                                                                        console.log("---- save shopee datas")
                                                                        fieldSplitted.map(async(fieldSplit, shopeeIdx) => {
                                                                            const saveShopeeDatasRes = await httpClient.post(`/shopee/save_datas`, {
                                                                                fields: fieldSplit
                                                                            });

                                                                            if(shopeeIdx === fieldSplitted.length - 1) { 
                                                                                setIsProcessing(false);
                                                                                toast({
                                                                                    title: "Lưu dữ liệu thành công!",
                                                                                    status: "success",
                                                                                    duration: 3000,
                                                                                    isClosable: true,
                                                                                })
                                                                            }
                                                                        });
                                                                    }
                                                                    // Grab
                                                                    else if(rowImportType[currentRowClickedIdx]?.file_type === "grab") {
                                                                        console.log("---- save grab datas")
                                                                        fieldSplitted.map(async(fieldSplit, grabIdx) => {
                                                                            const saveGrabDatasRes = await httpClient.post(`/grab/save_datas`, {
                                                                                fields: fieldSplit
                                                                            });

                                                                            if(grabIdx === fieldSplitted.length - 1) { 
                                                                                setIsProcessing(false);
                                                                                toast({
                                                                                    title: "Lưu dữ liệu thành công!",
                                                                                    status: "success",
                                                                                    duration: 3000,
                                                                                    isClosable: true,
                                                                                })
                                                                            }
                                                                        });
                                                                    }
                                                                    // Befood
                                                                    else if(rowImportType[currentRowClickedIdx]?.file_type === "befood") {
                                                                        console.log("---- save befood datas",)
                                                                        fieldSplitted.map(async(fieldSplit, befoodIdx) => {
                                                                            const saveBefoodDatasRes = await httpClient.post(`/befood/save_datas`, {
                                                                                fields: fieldSplit
                                                                            });
                                                                            console.log("---- save befood datas res:", saveBefoodDatasRes)

                                                                            if(befoodIdx === fieldSplitted.length - 1) { 
                                                                                setIsProcessing(false);
                                                                                toast({
                                                                                    title: "Lưu dữ liệu thành công!",
                                                                                    status: "success",
                                                                                    duration: 3000,
                                                                                    isClosable: true,
                                                                                })
                                                                            }
                                                                        });
                                                                    }
                                                                })
                                                            }
                                                        }
                                                    >
                                                        <Icon boxSize={6} as={MdSave} marginRight="8px"/>   
                                                        <Text>Lưu vào database</Text>
                                                    </Button>
                                                }
                                            </Td>
                                        </Tr>
                                    )
                                })
                            }
                        </Tbody>
                    </Table>
                </TableContainer>
            </Flex>
            {
                isLoading &&
                <Center>
                    <CircularProgress position="fixed" top="20vh" isIndeterminate size="100px" zIndex={9999}>
                        <CircularProgressLabel fontSize="14px" fontWeight="700" color="#2196f3">Đang tải</CircularProgressLabel>
                    </CircularProgress>
                </Center>
            }
        </Box>
    )
}

export default ImportDatasV2;