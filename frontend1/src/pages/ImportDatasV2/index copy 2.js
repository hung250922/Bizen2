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
    const [selectedStoreName, setSelectedStoreName] = useState(0);
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

    const readExcelFile = (file, sheetName) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = sheetName || workbook.SheetNames[0];
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
                    if(rowImportType[currentRowClickedIdx].file_type === "fabi_05") {
                        try {
                            const fabi05WorksheetDatas = await readExcelFile(fileObj, "Tất cả cửa hàng");
                            console.log("--- Fabi 05 worksheetData:", fabi05WorksheetDatas);
                            let _fields = [];
                            fabi05WorksheetDatas.map((row, idx) => {           
                                let cuaHang = row["Cửa hàng"];
                                let posID = row["Pos ID"];
                                let maHang = row["Mã hàng"];
                                let tenHang = row["Tên hàng"];
                                let nhomMon = row["Nhóm món"];
                                let loaiMon = row["Loại món"];
                                let maCombo = row["Mã combo"];
                                let pTTT = row["PTTT"];    
                                let nguon = row["Nguồn"];
                                let khuVuc = row["Khu vực"];
                                let ban = row["Bàn"];
                                let maHoaDon = row["Mã hoá đơn"];
                                let soHD = row["Số HĐ"];
                                let thoiGian = row["Thời gian"];
                                let gio = parseInt(row["Giờ"].split(":")[0]);
                                let soLuong = row["Số lượng"];
                                let donViTinh = row["Đơn vị tính"];
                                let gia = row["Giá"];
                                let giaBan = row["Giá bán"];
                                let thanhTien = row["Thành tiền"];
                                let giamGia = row["Giảm giá"];
                                let chietKhau = row["Chiết khấu"];
                                let phiHoTroMarketing = row["Phí hỗ trợ marketing"];
                                let phieuGG = row["Phiếu GG"];
                                let phiDichVu = row["Phí dịch vụ"];
                                let vAT = row["VAT %"];
                                let thue = row["Thuế"];
                                let thueKhauTru = row["Thuế khấu trừ"];
                                let giamGiaVAT = row["Giảm giá VAT"];
                                let phiShip = row["Phí ship"];
                                let tongTienKhongVAT = row["Tổng tiền (không bao gồm VAT)"];
                                let hoaHong = row["Hoa hồng"];
                                let tongTienBaoGomHoaHong = row["Tổng tiền (bao gồm hoa hồng)"];
                                let tenCTKM = row["Tên CTKM"];
                                let maVoucher = row["Mã voucher"];
                                let tenKhach = row["Tên khách"];
                                let soKhach = row["Số khách"];
                                let soDienThoai = row["Số điện thoại"];
                                let tongTien = row["Tổng tiền"];
                                let ghiChu = row["Ghi chú hóa đơn"];

                                _fields.push({
                                    cuaHang, posID, maHang, tenHang, nhomMon, loaiMon, maCombo, pTTT, nguon, khuVuc, 
                                    ban, maHoaDon, soHD, thoiGian, gio, soLuong, donViTinh, gia, giaBan, thanhTien,
                                    giamGia, chietKhau, phiHoTroMarketing, phieuGG, phiDichVu, vAT, thue, thueKhauTru,
                                    giamGiaVAT, phiShip, tongTienKhongVAT, hoaHong, tongTienBaoGomHoaHong, tenCTKM,
                                    maVoucher, tenKhach, soKhach, soDienThoai, tongTien, ghiChu
                                });
                            });

                            setFields({...fields, [currentRowClickedIdx]: _fields});
                            setIsLoading(false);
                            console.log("--- Fabi 05 _fields:", _fields)
                        }
                        catch(error) {
                            console.log("--- error:",error )
                            setErrorMessage("Lỗi import Fabi 05 filed. Vui lòng kiểm tra lại file import!");
                            setIsLoading(false);
                        }
                    } 
                    // Momo
                    else if(rowImportType[currentRowClickedIdx].file_type === "momo") {
                        try {
                            const momoWorksheetDatas = await readExcelFile(fileObj);
                            console.log("--- Momo worksheetData:", momoWorksheetDatas);
                            let _fields = [];
                            momoWorksheetDatas.map((row, idx) => {  
                                let thoi_gian = row["Thời gian"];
                                let ma_don_hang = row["Mã đơn hàng"];
                                let ma_don_hang_goc = row["Mã đơn hàng gốc"];
                                let ma_giao_dich = row["Mã giao dịch"];
                                let trang_thai = row["Trạng thái"];
                                let ten_khach_hang = row["Tên khách hàng"];
                                let so_dien_thoai_khach_hang = row["Số điện thoại khách hàng"];
                                let loai_giao_dich = row["Loại giao dịch"];    
                                let so_tien = row["Số tiền"];
                                let so_tien_giam_gia = row["Số tiền giảm giá"];
                                let kenh_thanh_toan = row["Kênh thanh toán"];
                                let phuong_thuc_thanh_toan = row["Phương thức thanh toán"];
                                let nguon_tien = row["Nguồn tiền"];
                                let mo_ta_giao_dich = row["Mô tả giao dịch"];
                                let ma_cua_hang = row["Mã cửa hàng"];
                                let ten_cua_hang = row["Tên cửa hàng"];
                                
                                if(so_tien > 0) {
                                    const [d, m, yAndTime] = thoi_gian.split("-");
                                    const isoString = `${yAndTime.split(" ")[0]}-${m}-${d}T${yAndTime.split(" ")[1]}`;
                                    thoi_gian = new Date(isoString);

                                    _fields.push({
                                        store_name: selectedStoreName,
                                        thoi_gian, ma_don_hang, ma_don_hang_goc, ma_giao_dich, trang_thai, ten_khach_hang, so_dien_thoai_khach_hang, 
                                        loai_giao_dich, so_tien, so_tien_giam_gia, kenh_thanh_toan, phuong_thuc_thanh_toan, nguon_tien, mo_ta_giao_dich, ma_cua_hang, ten_cua_hang
                                    });
                                }
                            });
                            console.log("--- MOMO _fields:", _fields)
                            setFields({...fields, [currentRowClickedIdx]: _fields});
                            setIsLoading(false);
                        }
                        catch(error) {
                            console.log("--- error:",error )
                            setErrorMessage("Lỗi import Momo filed. Vui lòng kiểm tra lại file import!");
                            setIsLoading(false);
                        }
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
                                let thoi_gian_giao_dich = excelSerialToDateTime(row["Thời gian giao dịch"]);
                                let loai_giao_dich = row["Loại giao dịch"];
                                let so_tien_gd_vnd = row["Số tiền ghi nợ"];

                                _fields.push({
                                    store_name: selectedStoreName,
                                    thoi_gian_giao_dich, loai_giao_dich, so_tien_gd_vnd
                                });
                            });

                            console.log("--- VnPay _fields:", _fields)
                        }

                        reader.readAsArrayBuffer(fileObj);
                    }
                    // Shopee
                    else if(rowImportType[currentRowClickedIdx].file_type === "shopee") {
                        try {
                            const shopeeWorksheetDatas = await readExcelFile(fileObj);
                            
                            let _fields = [];
                            shopeeWorksheetDatas.map((row, idx) => {           
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
                                    store_name: selectedStoreName,
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
                    }
                    // Grab
                    else if(rowImportType[currentRowClickedIdx].file_type === "grab") {
                        try {
                                const grabWorksheetDatas = await readExcelFile(fileObj);
                                //console.log("--- Grab worksheetData:", grabWorksheetDatas);
                                let _fields = [];
                                grabWorksheetDatas.map((row, idx) => {
                                    let ten_nguoi_ban = row["Tên người bán"];
                                    let merchant_id = row["Merchant ID"];
                                    let ten_cua_hang = row["Tên cửa hàng"];
                                    let ma_so_cua_hang = row["Mã số cửa hàng"];
                                    let cap_nhat_vao = excelSerialToDateTime(row["Cập nhật vào"]);
                                    let ngay_tao = excelSerialToDateTime(row["Ngày tạo"]);
                                    let loai = row["Loại"];
                                    let danh_muc = row["Danh mục"];    
                                    let danh_muc_con = row["Danh mục con"];
                                    let trang_thai = row["Trạng thái"];
                                    let ma_giao_dich = row["Mã giao dịch"];
                                    let ma_giao_dich_da_duoc_lien_ket = row["Mã giao dịch đã được liên kết"];

                                    let ma_giao_dich_doi_tac_1 = row["Mã giao dịch đối tác 1"];
                                    let ma_giao_dich_doi_tac_2 = row["Mã giao dịch đối tác 2"];
                                    let ma_don_hang_dai = row["Mã đơn hàng dài"];
                                    let ma_don_hang_ngan = row["Mã đơn hàng ngắn"];
                                    let ma_dat_hang = row["Mã đặt hàng"];
                                    let kenh_dat_hang = row["Kênh đặt hàng"];
                                    let loai_don_hang = row["Loại đơn hàng"];
                                    let phuong_thuc_thanh_toan = row["Phương thức thanh toán"];
                                    let tai_khoan_nhan_nguon_tien = row["Tài khoản nhận nguồn tiền"];
                                    let ma_may_giao_dich = row["Mã máy giao dịch"];
                                    let kenh_thanh_toan = row["Kênh thanh toán"];
                                    let loai_uu_dai = row["Loại ưu đãi"];

                                    let phi_dich_vu_grab = row["Phí dịch vụ Grab"];
                                    let he_so_diem = row["Hệ số điểm"];
                                    let diem_da_nhan = row["Điểm đã nhận"];
                                    let ma_giao_dich_2 = row["Mã giao dịch 2"];
                                    let ngay_chuyen_khoan = null; //row["Ngày chuyển khoản"];
                                    let so_tien = row["Số tiền"];
                                

                                    let thue_don_hang = row["Thuế đơn hàng"];
                                    let phi_do_goi_mang_ve = row["Phí đồ gói mang về"];
                                    let phi_danh_cho_quan_chua_la_thanh_vien = row["Phí dành cho quán chưa là thành viên"];
                                    let phi_dich_vu_cua_quan = row["Phí dịch vụ của quán"];
                                    let uu_dai = row["Ưu đãi"];
                                    let giam_gia = row["Giảm giá"];
                                    let giam_phi_giao_hang = row["Giảm phí giao hàng"];
                                    let phi_giao_hang_quan_online_tren_grab = row["Phí giao hàng quán online trên Grab"];
                                    let phi_giao_hang_duoc_giao_boi_quan = row["Phí giao hàng được giao bởi quán"];
                                    let phi_giao_hang_grabexpress = row["Phí giao hàng GrabExpress"];
                                    let doanh_thu_rong = row["Doanh thu ròng"];
                                    let mdr_rong = row["MDR ròng"];
                                    let thue_mdr = row["Thuế MDR"];
                                    let phi_cho_grab = row["Phí cho Grab"];
                                    let phi_tiep_thi_thanh_cong = row["Phí tiếp thị thành công"];
                                    let chiet_khau_giao_hang = row["Chiết khấu giao hàng"];
                                    let chiet_khau_tu_cac_kenh_ban_hang = row["Chiết khấu từ các kênh bán hàng"];
                                    let chiet_khau_don_hang = row["Chiết khấu đơn hàng"];
                                    let chiet_khau_cho_grabfood_grabmart = row["Chiết khấu cho GrabFood / GrabMart"];
                                    let grab_kitchen_commission = row["Grab Kitchen Commission"];
                                    let cac_khoan_chiet_khau_khac_cho_grab_kitchen = row["Các khoản chiết khấu khác cho GrabKitchen"];
                                    let thue_tai_nguon = row["Thuế tại nguồn"];
                                    let vat_amount = row["VAT Amount"];
                                    let pit_amount = row["PIT Amount"];
                                    let tong_cong = row["Tổng cộng"];
                                    let thue_tren_mdr = row["Thuế trên MDR"];
                                    let thue_tren_tien_chiet_khau_cho_grabfood_grabmart_dieu_chinh_quang_cao = row["Thuế trên tiền chiết khấu cho GrabFood / GrabMart, Điều chỉnh, Quảng cáo"];
                                    let thue_tren_tong_chiet_khau_cho_grabkitchen = row["Thuế trên tổng chiết khấu cho GrabKitchen"];
                                    let ly_do_huy = row["Lý do hủy"];
                                    let huy_boi = row["Hủy bởi"];

                                    if(so_tien !== 0) {
                                        _fields.push({
                                            store_name: selectedStoreName,
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
                            });

                            setFields({...fields, [currentRowClickedIdx]: _fields});
                            setIsLoading(false);
                            console.log("--- Grab _fields:", _fields)
                        }
                        catch(error) {
                            console.log("--- error:",error )
                            setErrorMessage("Lỗi import filed. Vui lòng kiểm tra lại file import!");
                            setIsLoading(false);
                        }
                    }
                    // Befood --> (OK)
                    else if(rowImportType[currentRowClickedIdx].file_type === "befood") {
                        try {
                            const befoodWorksheetDatas = await readExcelFile(fileObj);
                            console.log("--- Befood worksheetData:", befoodWorksheetDatas);
                            let _fields = [];
                            befoodWorksheetDatas.map((row, idx) => {    
                                let thoi_gian_dat_hang = excelSerialToDateTime(row["Thời gian đặt hàng"]);
                                let id_cua_hang = row["ID cửa hàng"];
                                let ten_cua_hang = row["Tên cửa hàng"];
                                let ma_don_hang = row["Mã đơn hàng"];
                                let trang_thai_don_hang = row["Trạng thái đơn hàng"];
                                let gia_tri_don_hang = row["GIá trị đơn hàng (Trước KM)"];
                                let km_tu_nguoi_ban = row["KM từ người bán"];
                                let dong_tai_tro = row["Đồng tài trợ"];
                                let phi_thuc_day_hien_thi = row["Phí thúc đẩy hiển thị"];
                                let tai_tro_bePoint = row["Tài trợ bePoint"];
                                let lay_tai_quan = row["Lấy tại quán"];
                                let gia_tri_don_hang_sau_km = row["Giá trị đơn hàng sau KM"];
                                let phi_dv_tmdt = row["Phí DV TMĐT"];
                                let thue_vat = row["Thuế VAT"];
                                let thue_pit = row["Thuế PIT"];
                                let thu_nhap_tam_tinh = row["Thu nhập tạm tính"];
                            
                                //if(gia_tri_don_hang > 0) {
                                    _fields.push({
                                        store_name: selectedStoreName,
                                        thoi_gian_dat_hang, id_cua_hang, ten_cua_hang, ma_don_hang, 
                                        trang_thai_don_hang, gia_tri_don_hang, km_tu_nguoi_ban, dong_tai_tro, phi_thuc_day_hien_thi, tai_tro_bePoint,
                                        lay_tai_quan, gia_tri_don_hang_sau_km, phi_dv_tmdt, thue_vat, thue_pit, thu_nhap_tam_tinh
                                    });
                                //}
                            });

                            setFields({...fields, [currentRowClickedIdx]: _fields});
                            setIsLoading(false);
                            console.log("--- Befood _fields:", _fields)
                        }
                        catch(error) {
                            console.log("--- error:",error )
                            setErrorMessage("Lỗi import befood. Vui lòng kiểm tra lại file import!");
                            setIsLoading(false);
                        }
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
                                    
                                    if(so_du > 0) {
                                        console.log("--- ngay_hieu_luc_2", ngay_hieu_luc_2, idx)
                                        if(typeof ngay_hieu_luc_2 === "string" && ngay_hieu_luc_2.indexOf("/") > -1) {
                                            const [d, m, yAndTime] = ngay_hieu_luc_2.split("/");
                                            const isoString = `${yAndTime.split(" ")[0]}-${m}-${d}`;
                                            const new_ngay_hieu_luc_2 = new Date(isoString);
                                           _fields.push({
                                                store_name: selectedStoreName,
                                                stt, ngay_1, ngay_hieu_luc_2: new_ngay_hieu_luc_2, so_tien_ghi_no, so_tien_ghi_co, so_du, noi_dung_chi_tiet
                                            });
                                        }
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

    const handleSaveToDatabase = async() => {
         if(!selectedStoreName) {
            alert("Vui lòng chọn cửa hàng!");
            return;
        }
        confirmChoice("Bạn có đồng ý lưu dữ liệu không?", async() => {
            setIsProcessing(true);
            console.log("--- fields to save:", fields)
            let allFields = [];
            Object.keys(rowImportType).forEach(rowIdx => {
                console.log("--- rowIdx:", rowIdx)
                const fieldSplitted = _.chunk(fields[rowIdx], 50);
                // Fabi 05
                if(rowImportType[rowIdx]?.file_type === "fabi_05") {
                    fieldSplitted.map((fieldSplit, idx) => {
                        setTimeout(async() => {
                            const saveFabi05DatasRes = await httpClient.post(`/save_pos_datas`, {
                                fields: fieldSplit
                            });

                            if(!saveFabi05DatasRes.data.error) {
                                toast({
                                    title: "Lưu dữ liệu thành công!",
                                    status: "success",
                                    duration: 3000,
                                    isClosable: true,
                                })
                            }

                            // if(idx === fieldSplitted.length - 1) { 
                            //     setIsProcessing(false);
                            //     toast({
                            //         title: "Lưu dữ liệu thành công!",
                            //         status: "success",
                            //         duration: 3000,
                            //         isClosable: true,
                            //     })
                            // }
                        }, idx * 1000);
                    });
                }
                // Vietcombank
                else if(rowImportType[rowIdx]?.file_type === "vietcombank") {
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
                else if(rowImportType[rowIdx]?.file_type === "momo") {
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
                else if(rowImportType[rowIdx]?.file_type === "vnpay") {
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
                else if(rowImportType[rowIdx]?.file_type === "shopee") {
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
                else if(rowImportType[rowIdx]?.file_type === "grab") {
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
                else if(rowImportType[rowIdx]?.file_type === "befood") {
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
            });
        });
    }


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
                <HStack align="center" mt={4} spacing={8}>
                    <Text>Chọn chi nhánh:</Text>
                    <Select w={40} size="sm" value={selectedStoreName} placeholder='Chọn chi nhánh'
                        onChange={
                            (evt) => { 
                                setSelectedStoreName(evt.target.value);
                                setFields({});
                                setRowDisplay({});
                            }
                        }
                    >
                        {   initDatas?.["Fabi05"] &&
                            (Object.keys(initDatas?.["Fabi05"]).sort((a, b) => a.localeCompare(b)) || []).map((key, idx) => (
                                <option key={`warehouse-${key}`} value={key}>{key}</option>
                            ))
                        }
                    </Select>
                    <Button colorScheme='teal' size="sm" mt={4} maxW="200px"
                        isLoading={isProcessing}
                        loadingText="Đang lưu dữ liệu..."
                        onClick={() => {
                            handleSaveToDatabase();
                        }}
                    >
                        <Icon boxSize={6} as={MdSave} marginRight="8px"/>   
                        <Text>Lưu vào database</Text>
                    </Button>
                </HStack>         

                <input type="file" accept='.xlsx,.csv' ref={fileInputRef} hidden style={{ padding: "10px"}}
                    onChange={fileHandler} 
                    onClick={(event) => {event.target.value = null}} 
                />
                <TableContainer minW="100%" mt={4} border="1px solid #e2e8f0" borderRadius={4} bg="white" p={4}>
                    <Table variant="simple" size="sm">
                        <Thead>
                            <Tr textTransform="uppercase">
                                <Th>Stt</Th>
                                <Th>Loại file</Th>
                                <Th>Upload file</Th>
                                <Th>File name</Th>
                                <Th>File size</Th>
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
                                                            console.log("--- rowImportType[idx]:", rowImportType[idx])
                                                            if(!selectedStoreName) {
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
                                            {/* <Td alignItems='center'>
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
                                                                                const saveFabi05DatasRes = await httpClient.post(`/save_pos_datas`, {
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
                                            </Td> */}
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