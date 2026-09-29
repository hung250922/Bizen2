import React, {useState, useRef, useEffect} from 'react';
import { useCookies } from 'react-cookie';
import moment from 'moment/moment';
import axios from 'axios';
import { 
    Flex, Box, VStack, Heading, Button, ButtonGroup, Text, Icon, IconButton, FormControl, FormLabel, Input,
    Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, Alert, AlertIcon, AlertDescription, Select,
    Center, CircularProgress, CircularProgressLabel, useToast,
    HStack
} from '@chakra-ui/react';
import { MdSave, MdFileUpload, MdDeleteForever } from 'react-icons/md';
import { OutTable, ExcelRenderer } from 'react-excel-renderer/build';
import readXlsxFile from 'read-excel-file';
import _, { forEach } from "lodash";
import { confirmChoice, sleep, countDaysInMonth } from "../../utils/helpers";
import httpClient from '../../services/http-client';
const IMPORT_FILE_TYPES = ["IPOS_HRM", "IPOS_FABI"]

const DATE_NAME = {
    "Sunday": "SUN",
    "Monday": "MON",
    "Tuesday": "TUE",
    "Wednesday": "WED",
    "Thursday": "THU",
    "Friday": "FRI",
    "Saturday": "SAT",
}

function ImportDatas() {
    const [ cookies, setCookie, removeCookie ] = useCookies(["loginCookie"]);
    const [isLoading, setIsLoading] = useState(false);
    const [ isProcessing, setIsProcessing ] = useState(false);
    const [ initDatas, setInitDatas ] = useState({});
    const [isAllowAccessThisPage, setIsAllowAccessThisPage] = useState(true);
    const [ rows, setRows ] = useState([]);
    const [ cols, setCols ] = useState([]);
    const [ maxRowDisplays, setMaxRowDisplays ] = useState([]);
    const [ errorMessage, setErrorMessage ] = useState(null);
    const [ successMessage, setSuccessMessage ] = useState(null);
    const [ importFileType, setImportFileType ] = useState("");

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
                console.log("--- not authorized to access import datas page");
            }
            mounted.current = true;
        }
    }, []);

    //console.log("---- initDatas", initDatas)
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

    const fileHandler = (event) => {
        try
        {
            if(event.target.files.length) {
                setIsLoading(true);
            //  console.log("--- event.target.files", event.target.files)
                let fileObj = event.target.files[0];
                let fileName = fileObj.name;
                let fileSize = fileObj.size / 1024 / 1024;
                //let isLt1M = fileObj.size / 1024 / 1024 < 1;
                const fileType = fileName.slice(fileName.lastIndexOf('.') + 1);

                if(fileType === "xlsx") {
                    if(importFileType === "IPOS_HRM") {
                        readXlsxFile(fileObj, {sheet: "Sheet1"}).then((_rows) => {
                            console.log("--- Ipos HRM:", _rows)
                            if(_rows[0].length > 0) {
                                let _maxRowDisplay = _rows.filter((_, idx) => idx <= 100);
                                let _cols = [];
                                for(let i = 0; i < _rows[0].length; i++) {
                                    _cols.push({
                                        "name": i,
                                        "key": i
                                    })
                                }
                                setCols(_cols);
                                setRows(_rows);
                                setMaxRowDisplays(_maxRowDisplay);
                                setIsLoading(false);
                            }
                        }).catch(error => {
                            console.log("--- error:", error)
                            setErrorMessage("Lỗi import filed. Vui lòng kiểm tra lại file import!");
                            setIsLoading(false);
                        })
                    } else if(importFileType === "IPOS_FABI") {
                        readXlsxFile(fileObj, {sheet: "Tất cả cửa hàng"}).then((_rows) => {
                            if(_rows[0].length > 0) {
                                let _maxRowDisplay = _rows.filter((_, idx) => idx <= 100);
                                let cols = [];
                                for(let i = 0; i < _rows[0].length; i++) {
                                    cols.push({
                                        "name": i,
                                        "key": i
                                    })
                                }
                                setCols(cols);
                                setRows(_rows);
                                setMaxRowDisplays(_maxRowDisplay);
                                setIsLoading(false);
                            }
                        }).catch(error => {
                            console.log("--- error:",error )
                            setErrorMessage("Lỗi import filed. Vui lòng kiểm tra lại file import!");
                            setIsLoading(false);
                        })
                    }
                } 
            }
        } catch(error) {
            console.log("--- error:", error)
        }
    }

    const handleSyncToLarkBase = () => {
        setErrorMessage(null);
        setSuccessMessage(null);
        confirmChoice("Bạn có đồng ý thêm dữ liệu?", async() => {
            setIsLoading(true);
            if(importFileType === "IPOS_HRM") {
                saveIposHRMRecordsFromExcel();
            } else if(importFileType === "IPOS_FABI") {
                saveIposFabiRecordsFromExcel();
            }
        })
    }
    //     console.log("--- 77777777 column", cols)
    // console.log("--- 8888888888888888 rows", rows)
    async function saveIposHRMRecordsFromExcel() {
        let fields = [];
        // console.log("--- rows", rows)
        (rows.length) > 0 && rows.map((row, idx) => { 
            if(row[0] !== "Ngày") {
                let ngay = row[0];
                let created_at = moment(`${ngay.split("/")[1]}-${ngay.split("/")[0]}-${ngay.split("/")[2]}`).toDate().getTime();
                let employee_id = row[2];
                let employee_name = row[3];
                let shift_time = row[4];
                let reality_time = row[5];
                let work_time_decimal = row[6];
                let go_late = row[7];
                let address = row[8];
               // console.log(created_at, employee_id, employee_name, shift_time, reality_time, work_time_decimal, go_late, address)
                fields.push({
                    "fields": {
                        created_at, employee_id, employee_name, shift_time, reality_time, work_time_decimal, go_late, address
                    }
                });
            }
        });


        const smallerFields = _.chunk(fields, 200);
        // console.log("---- smallerFields", smallerFields)
        await Promise.all(
            smallerFields.map(smallerField => {
                saveRecordsToLarkBase({ 
                    base_id: initDatas["Office"]["ChamCongBaseId"],
                    table_id: initDatas["Office"]["ChamCongTableId"],
                    data: smallerField
                })
            })
        )
        setIsLoading(false);
    }

    async function saveIposFabiRecordsFromExcel() {
        // 1 ----------------------- DELETE ANY PREVIOUS RECORDS
        // let timeFields = [];

        // (rows.length) > 0 && rows.map((row, idx) => {
        //     if((row[0] !== "Ngày") && (row[0] !== "Tổng lương dự kiến")) {
        //         let ngay = row[0];
        //         const date = moment(ngay, "DD/MM/YYYY").toDate();
        //         const year = date.getFullYear().toString();
        //         const month = (date.getMonth() + 1).toString().padStart(2, '0');

        //         if(year !== "NaN" && month !== "NaN") {
        //             let findIdx = timeFields.findIndex(item => item.year === year && item.month === month);
        //             if(findIdx === -1) {
        //                 timeFields.push({year, month});
        //             }
        //         }
        //     }
        // });

        // await Promise.all(
        //     Object.values(initDatas["Fabi05"]).map(item => {
        //         const { BaseId, MFSaleTableId, MFHourTableId, MFPMGroupTableId, MFPMItemTableId } = item;
        //         timeFields.map(async(timeField) => {
        //             await deleteRecordsInLarkBase({ base_id: BaseId, table_id: MFSaleTableId, year: timeField.year, month: timeField.month });
        //             await deleteRecordsInLarkBase({ base_id: BaseId, table_id: MFHourTableId, year: timeField.year, month: timeField.month });
        //             await deleteRecordsInLarkBase({ base_id: BaseId, table_id: MFPMGroupTableId, year: timeField.year, month: timeField.month });
        //             await deleteRecordsInLarkBase({ base_id: BaseId, table_id: MFPMItemTableId, year: timeField.year, month: timeField.month });
        //         })
        //     })
        // )
        // 2 ---------- ADD RECORD TO LARKBASES
        //await sleep(1000);
        let fields = [];
        // console.log("--- rows", rows)
        (rows.length) > 0 && rows.map((row, idx) => {
            if(row[1] > 0) {
                let cuaHang = row[0];
                let posID = row[1];
                let maHang = row[2];
                let tenHang = row[3];
                let nhomMon = row[4];
                let loaiMon = row[5];
                let maCombo = row[6];
                let pTTT = row[7];    
                let nguon = row[8];
                let khuVuc = row[9];
                let ban = row[10];
                let maHoaDon = row[11];
                let soHD = row[12];
                let thoiGian = row[13];
                let gio = parseInt(row[14].split(":")[0]);
                let soLuong = row[15];
                let donViTinh = row[16];
                let gia = row[17];
                let giaBan = row[18];
                let thanhTien = row[19];
                let giamGia = row[20];
                let chietKhau = row[21];
                let phiHoTroMarketing = row[22];
                let phieuGG = row[23];
                let phiDichVu = row[24];
                let vAT = row[25];
                let thue = row[26];
                let thueKhauTru = row[27];
                let giamGiaVAT = row[28];
                let phiShip = row[29];
                let tongTienKhongVAT = row[30];
                let hoaHong = row[31];
                let tongTienBaoGomHoaHong = row[32];
                let tenCTKM = row[33];
                let maVoucher = row[34];
                let tenKhach = row[35];
                let soKhach = row[36];
                let soDienThoai = row[37];
                let tongTien = row[38];
                let ghiChu = row[39];

                fields.push({
                    cuaHang, posID, maHang, tenHang, nhomMon, loaiMon, maCombo, pTTT, nguon, khuVuc, 
                    ban, maHoaDon, soHD, thoiGian, gio, soLuong, donViTinh, gia, giaBan, thanhTien,
                    giamGia, chietKhau, phiHoTroMarketing, phieuGG, phiDichVu, vAT, thue, thueKhauTru,
                    giamGiaVAT, phiShip, tongTienKhongVAT, hoaHong, tongTienBaoGomHoaHong, tenCTKM,
                    maVoucher, tenKhach, soKhach, soDienThoai, tongTien, ghiChu
                });
            }
        })

        const fieldGroupByCuaHang = _.groupBy(fields, "cuaHang");
        //console.log("----- fieldGroupByCuaHang:", fieldGroupByCuaHang);
        // Query từng cửa hàng để sắp xếp theo giờ
        let results = {};

        Object.keys(fieldGroupByCuaHang).map(storeNameKey => {
            if(!initDatas["Fabi05"][storeNameKey]) return;       
            results[storeNameKey] = {};
            const cuaHangDetails = fieldGroupByCuaHang[storeNameKey];
            const cuaHangDetailsByThoiGian = _.groupBy(cuaHangDetails, "thoiGian");

            Object.keys(cuaHangDetailsByThoiGian).map(dateKey => {
                results[storeNameKey][dateKey] = {};
                const thoiGianDetails = cuaHangDetailsByThoiGian[dateKey];
                const gioGroup = _.groupBy(thoiGianDetails, "gio");
                
                let MF_Hour = {};
                for(let i = 7; i <= 23; i++) {
                    MF_Hour[i] = { tongTien: 0, tongBill: 0, tongCA: 0 };
                }

                Object.keys(gioGroup).map(key3 => {
                    let gioGroupDetail = gioGroup[key3];
                    //console.log("--- gioGroupDetail", gioGroupDetail)
                    let tongTien = _.sum(gioGroupDetail.map(item => item.tongTien));
                    let tongBill = _.unionBy(gioGroupDetail, "maHoaDon").length;
                    let tongCAGroup = gioGroupDetail.map(gioGroupDetailItem => ({ 
                        "code": gioGroupDetailItem["maHang"], 
                        "total": (initDatas["FoodType"][gioGroupDetailItem["maHang"]]?.["CA"] || 0)*(gioGroupDetailItem["soLuong"]) 
                    }));
                    let tongCA = _.sumBy(tongCAGroup, "total");
                    let tongNguon = _.countBy(gioGroupDetail, "nguon");
                    let tongTienSaleON = _.sum(gioGroupDetail.filter(item => initDatas["OrderPosition"][item.nguon] === "ON").map(item => item.tongTien));
                    let tongTCON = _.unionBy(gioGroupDetail.filter(item => initDatas["OrderPosition"][item.nguon] === "ON"), "maHoaDon").length;
                    let tongTienSaleOFF = _.sum(gioGroupDetail.filter(item => initDatas["OrderPosition"][item.nguon] === "OFF").map(item => item.tongTien));
                    let tongTCOFF = _.unionBy(gioGroupDetail.filter(item => initDatas["OrderPosition"][item.nguon] === "OFF"), "maHoaDon").length
                    let tongSaleTaiCho = _.sum(gioGroupDetail.filter(item => item.nguon === "TẠI CHỖ").map(item => item.tongTien));
                    let tongTCTaiCho = _.unionBy(gioGroupDetail.filter(item => item.nguon === "TẠI CHỖ"), "maHoaDon").length;
                    let tongSaleXeKem = _.sum(gioGroupDetail.filter(item => item.nguon === "XE KEM").map(item => item.tongTien));
                    let tongTCXeKem = _.unionBy(gioGroupDetail.filter(item => item.nguon === "XE KEM"), "maHoaDon").length;
                    let tongSaleSale = _.sum(gioGroupDetail.filter(item => item.nguon === "SALE").map(item => item.tongTien));
                    let tongTCSale = _.unionBy(gioGroupDetail.filter(item => item.nguon === "SALE"), "maHoaDon").length;
                    let tongSaleEvent = _.sum(gioGroupDetail.filter(item => item.nguon === "EVENT").map(item => item.tongTien));
                    let tongTCEvent = _.unionBy(gioGroupDetail.filter(item => item.nguon === "EVENT"), "maHoaDon").length;
                    let tongSaleMangVe = _.sum(gioGroupDetail.filter(item => item.nguon === "MANG VỀ").map(item => item.tongTien));
                    let tongTCMangVe = _.unionBy(gioGroupDetail.filter(item => item.nguon === "MANG VỀ"), "maHoaDon").length;
                    let tongSaleGrab = _.sum(gioGroupDetail.filter(item => item.nguon === "GRABFOOD").map(item => item.tongTien));
                    let tongTCGrab = _.unionBy(gioGroupDetail.filter(item => item.nguon === "GRABFOOD"), "maHoaDon").length;
                    let tongSaleShopee = _.sum(gioGroupDetail.filter(item => item.nguon === "ShopeeFood").map(item => item.tongTien));
                    let tongTCShopee = _.unionBy(gioGroupDetail.filter(item => item.nguon === "ShopeeFood"), "maHoaDon").length;
                    let tongSaleXanh = _.sum(gioGroupDetail.filter(item => item.nguon === "XANH NGON SM").map(item => item.tongTien));
                    let tongTCXanh = _.unionBy(gioGroupDetail.filter(item => item.nguon === "NGON"), "maHoaDon").length;
                    let tongSaleBefood = _.sum(gioGroupDetail.filter(item => item.nguon === "BEFOOD").map(item => item.tongTien)); 
                    let tongTCBefood = _.unionBy(gioGroupDetail.filter(item => item.nguon === "BEFOOD"), "maHoaDon").length;
                    let tongSaleMomo = _.sum(gioGroupDetail.filter(item => item.nguon === "MOMO_APP_DELI").map(item => item.tongTien));

                    let tongTCMomo = _.unionBy(gioGroupDetail.filter(item => item.nguon === "MOMO_APP_DELI"), "maHoaDon").length;
                    let tongSaleWeb = _.sum(gioGroupDetail.filter(item => item.nguon === "WEB ORDER").map(item => item.tongTien)); 
                    let tongTCWeb = _.unionBy(gioGroupDetail.filter(item => item.nguon === "WEB ORDER"), "maHoaDon").length;
                    let tongSaleBO = _.sum(gioGroupDetail.filter(item => (item.nguon === "CALL CENTER") || (item.nguon === "CRM") || (item.nguon === "FACEBOOK") || (item.nguon === "ZALO")).map(item => item.tongTien));
                    let tongTCBO = _.unionBy(gioGroupDetail.filter(item => (item.nguon === "CALL CENTER") || (item.nguon === "CRM") || (item.nguon === "FACEBOOK") || (item.nguon === "ZALO")), "maHoaDon").length;
                    let tongThanhToanTienMat = _.sum(gioGroupDetail.filter(item => item.pTTT === "Tiền mặt").map(item => item.tongTien)); 
                    let tongThanhToanOnline = _.sum(gioGroupDetail.filter(item => (item.pTTT !== "Tiền mặt") && (item.pTTT !== "Cà thẻ")).map(item => item.tongTien)); 
                    let tongThanhToanCaThe = _.sum(gioGroupDetail.filter(item => item.pTTT === "Cà thẻ").map(item => item.tongTien)); 
                    let tongMaHang = _.countBy(gioGroupDetail, "maHang");
                    let tongMaHangDoanhThu = {};
                    Object.keys(tongMaHang).map(keyMaHang => {
                        let _tongDoanhThu = _.sum(gioGroupDetail.filter(item => item.maHang === keyMaHang).map(item => item.tongTien));
                        if(!tongMaHangDoanhThu[keyMaHang]) {
                            tongMaHangDoanhThu[keyMaHang] = _tongDoanhThu;
                        } else {
                            tongMaHangDoanhThu[keyMaHang] += _tongDoanhThu;
                        }
                    });
                    let tongNhomMon = _.countBy(gioGroupDetail, "nhomMon");
                    let tongNhomMonDoanhThu = {};
                    let tongNhomMonSoLuong = {};
                    Object.keys(tongNhomMon).map(keyNhomMon => {
                        let _tongDoanhThu = _.sum(gioGroupDetail.filter(item => item.nhomMon === keyNhomMon).map(item => item.tongTien));
                        let _tongSoLuong = _.sum(gioGroupDetail.filter(item => item.nhomMon === keyNhomMon).map(item => item.soLuong));

                        if(!tongNhomMonDoanhThu[keyNhomMon]) {
                            tongNhomMonDoanhThu[keyNhomMon] = _tongDoanhThu;
                        } else {
                            tongNhomMonDoanhThu[keyNhomMon] += _tongDoanhThu;
                        }

                        if(!tongNhomMonSoLuong[keyNhomMon]) {
                            tongNhomMonSoLuong[keyNhomMon] = _tongSoLuong;
                        } else {
                            tongNhomMonSoLuong[keyNhomMon] += _tongSoLuong;
                        }
                    });

                    MF_Hour[parseInt(key3)] = { 
                        "timeLine": (key3 < 12 ? "Morning" : (key3 < 17 ? "Afternoon" : "Evening")), 
                        tongTien, 
                        tongBill, 
                        tongCA, 
                        tongNguon,
                        tongTienSaleON,
                        tongTCON,
                        tongTienSaleOFF,
                        tongTCOFF,
                        tongSaleTaiCho,
                        tongTCTaiCho,
                        tongSaleXeKem,
                        tongTCXeKem,
                        tongSaleSale,
                        tongTCSale,
                        tongSaleEvent,
                        tongTCEvent,
                        tongSaleMangVe,
                        tongTCMangVe,
                        tongSaleGrab,
                        tongTCGrab,
                        tongSaleShopee,
                        tongTCShopee,
                        tongSaleXanh,
                        tongTCXanh,
                        tongSaleBefood,
                        tongTCBefood,
                        tongSaleMomo,
                        tongTCMomo,
                        tongSaleWeb,
                        tongTCWeb,
                        tongSaleBO,
                        tongTCBO,
                        tongThanhToanTienMat,
                        tongThanhToanOnline,
                        tongThanhToanCaThe,
                        tongMaHang,
                        tongMaHangDoanhThu,
                        tongNhomMon,
                        tongNhomMonSoLuong,
                        tongNhomMonDoanhThu,
                    };
                });
                results[storeNameKey][dateKey] = MF_Hour;
            })
        });

        // Save excel rows to LarkBase
        const storeNameKeys = Object.keys(results);
        const INTERVAL_MS = 8000;
        let idx = 0;

        const intervalId = setInterval(() => {
            console.log("--- storeNameKeys", storeNameKeys[idx])
            let storeNameKey = storeNameKeys[idx];

            let mFHoursFormatLarkBase = [];
            Object.keys(results[storeNameKey]).map(dateKey => {
                Object.keys(results[storeNameKey][dateKey]).map(hourKey => {
                    const { tongTien, tongBill, tongCA } = results[storeNameKey][dateKey][hourKey];
                    const date = moment(dateKey, "DD/MM/YYYY").toDate();

                    mFHoursFormatLarkBase.push({
                        "fields": {
                            "Year": date.getFullYear().toString(),
                            "Month": (date.getMonth() + 1).toString().padStart(2, '0'),
                            "Day": DATE_NAME[moment(date).format("dddd")],
                            "Week": "W" + moment(date).week().toString().padStart(2, '0'),
                            "Date": date.getTime(),
                            "Area": initDatas["Fabi05"][storeNameKey]["area"],
                            "Store": storeNameKey,
                            "Khung giờ": hourKey,
                            "Sale": tongTien,
                            "TC": tongBill || 0,
                            "CC": tongCA || 0
                        }
                    })
                })
            });

            // *** MF Sale
            let mFSaleFormatLarkBase = [];
            Object.keys(results[storeNameKey]).map(dateKey => {
                const date = moment(dateKey, "DD/MM/YYYY").toDate();
                const tongTienAllDay = Object.values(results[storeNameKey][dateKey]).reduce((total, currentItem) => {
                    return total + (currentItem.tongTien || 0)
                }, 0);
                const tongBillAllDay = Object.values(results[storeNameKey][dateKey]).reduce((total, currentItem) => {
                    return total + (currentItem.tongBill || 0)
                }, 0);
                const tongCAAllDay = Object.values(results[storeNameKey][dateKey]).reduce((total, currentItem) => {
                    return total + (currentItem.tongCA || 0)
                }, 0);

                const tongTienMorning = 
                    Object.values(results[storeNameKey][dateKey])
                        .filter(item => item.timeLine === "Morning")
                        .reduce((total, currentItem) => {
                            return total + (currentItem.tongTien || 0)
                        }, 0);
                const tongBillMorning = 
                    Object.values(results[storeNameKey][dateKey])
                        .filter(item => item.timeLine === "Morning")
                        .reduce((total, currentItem) => {
                            return total + (currentItem.tongBill || 0)
                        }, 0);
                const tongTienAfternoon = 
                    Object.values(results[storeNameKey][dateKey])
                        .filter(item => item.timeLine === "Afternoon")
                        .reduce((total, currentItem) => {
                            return total + (currentItem.tongTien || 0)
                        }, 0);
                const tongBillAfternoon = 
                    Object.values(results[storeNameKey][dateKey])
                        .filter(item => item.timeLine === "Afternoon")
                        .reduce((total, currentItem) => {
                            return total + (currentItem.tongBill || 0)
                        }, 0);
                const tongTienEvening = 
                    Object.values(results[storeNameKey][dateKey])
                        .filter(item => item.timeLine === "Evening")
                        .reduce((total, currentItem) => {
                            return total + (currentItem.tongTien || 0)
                        }, 0);
                const tongBillEvening = 
                    Object.values(results[storeNameKey][dateKey])
                        .filter(item => item.timeLine === "Evening")
                        .reduce((total, currentItem) => {
                            return total + (currentItem.tongBill || 0)
                        }, 0);
                const tongTienSaleON = Object.values(results[storeNameKey][dateKey]).reduce((total, currentItem) => {
                    return total + (currentItem.tongTienSaleON || 0)
                }, 0);
                const tongTCON = Object.values(results[storeNameKey][dateKey]).reduce((total, currentItem) => {
                    return total + (currentItem.tongTCON || 0)
                }, 0);
                const tongTienSaleOFF = Object.values(results[storeNameKey][dateKey]).reduce((total, currentItem) => {
                    return total + (currentItem.tongTienSaleOFF || 0)
                }, 0);
                const tongTCOFF = Object.values(results[storeNameKey][dateKey]).reduce((total, currentItem) => {
                    return total + (currentItem.tongTCOFF || 0)
                }, 0);


                const tongSaleTaiCho = Object.values(results[storeNameKey][dateKey]).reduce((total, currentItem) => {
                    return total + (currentItem.tongSaleTaiCho || 0)
                }, 0);
                const tongTCTaiCho = Object.values(results[storeNameKey][dateKey]).reduce((total, currentItem) => {
                    return total + (currentItem.tongTCTaiCho || 0)
                }, 0);
                const tongSaleXeKem = Object.values(results[storeNameKey][dateKey]).reduce((total, currentItem) => {
                    return total + (currentItem.tongSaleXeKem || 0)
                }, 0);
                const tongTCXeKem = Object.values(results[storeNameKey][dateKey]).reduce((total, currentItem) => {
                    return total + (currentItem.tongTCXeKem || 0)
                }, 0);
                const tongSaleSale = Object.values(results[storeNameKey][dateKey]).reduce((total, currentItem) => {
                    return total + (currentItem.tongSaleSale || 0)
                }, 0);
                const tongTCSale = Object.values(results[storeNameKey][dateKey]).reduce((total, currentItem) => {
                    return total + (currentItem.tongTCSale || 0)
                }, 0);
                const tongSaleEvent = Object.values(results[storeNameKey][dateKey]).reduce((total, currentItem) => {
                    return total + (currentItem.tongSaleEvent || 0)
                }, 0);
                const tongTCEvent = Object.values(results[storeNameKey][dateKey]).reduce((total, currentItem) => {
                    return total + (currentItem.tongTCEvent || 0)
                }, 0);
                const tongSaleMangVe = Object.values(results[storeNameKey][dateKey]).reduce((total, currentItem) => {
                    return total + (currentItem.tongSaleMangVe || 0)
                }, 0);
                const tongTCMangVe = Object.values(results[storeNameKey][dateKey]).reduce((total, currentItem) => {
                    return total + (currentItem.tongTCMangVe || 0)
                }, 0);
                const tongSaleGrab = Object.values(results[storeNameKey][dateKey]).reduce((total, currentItem) => {
                    return total + (currentItem.tongSaleGrab || 0)
                }, 0);
                const tongTCGrab = Object.values(results[storeNameKey][dateKey]).reduce((total, currentItem) => {
                    return total + (currentItem.tongTCGrab || 0)
                }, 0);
                const tongSaleShopee = Object.values(results[storeNameKey][dateKey]).reduce((total, currentItem) => {
                    return total + (currentItem.tongSaleShopee || 0)
                }, 0);
                const tongTCShopee = Object.values(results[storeNameKey][dateKey]).reduce((total, currentItem) => {
                    return total + (currentItem.tongTCShopee || 0)
                }, 0);
                const tongSaleXanh = Object.values(results[storeNameKey][dateKey]).reduce((total, currentItem) => {
                    return total + (currentItem.tongSaleXanh || 0)
                }, 0);
                const tongTCXanh = Object.values(results[storeNameKey][dateKey]).reduce((total, currentItem) => {
                    return total + (currentItem.tongTCXanh || 0)
                }, 0);
                const tongSaleBefood = Object.values(results[storeNameKey][dateKey]).reduce((total, currentItem) => {
                    return total + (currentItem.tongSaleBefood || 0)
                }, 0);
                const tongTCBefood = Object.values(results[storeNameKey][dateKey]).reduce((total, currentItem) => {
                    return total + (currentItem.tongTCBefood || 0)
                }, 0);
                const tongSaleMomo = Object.values(results[storeNameKey][dateKey]).reduce((total, currentItem) => {
                    return total + (currentItem.tongSaleMomo || 0)
                }, 0);
                const tongTCMomo = Object.values(results[storeNameKey][dateKey]).reduce((total, currentItem) => {
                    return total + (currentItem.tongTCMomo || 0)
                }, 0);
                const tongSaleWeb = Object.values(results[storeNameKey][dateKey]).reduce((total, currentItem) => {
                    return total + (currentItem.tongSaleWeb || 0)
                }, 0);
                const tongTCWeb = Object.values(results[storeNameKey][dateKey]).reduce((total, currentItem) => {
                    return total + (currentItem.tongTCWeb || 0)
                }, 0);
                const tongSaleBO = Object.values(results[storeNameKey][dateKey]).reduce((total, currentItem) => {
                    return total + (currentItem.tongSaleBO || 0)
                }, 0);
                const tongTCBO = Object.values(results[storeNameKey][dateKey]).reduce((total, currentItem) => {
                    return total + (currentItem.tongTCBO || 0)
                }, 0);
    
                const tongThanhToanTienMat = Object.values(results[storeNameKey][dateKey]).reduce((total, currentItem) => {
                    return total + (currentItem.tongThanhToanTienMat || 0)
                }, 0);
                const tongThanhToanOnline = Object.values(results[storeNameKey][dateKey]).reduce((total, currentItem) => {
                    return total + (currentItem.tongThanhToanOnline || 0)
                }, 0);
                const tongThanhToanCaThe = Object.values(results[storeNameKey][dateKey]).reduce((total, currentItem) => {
                    return total + (currentItem.tongThanhToanCaThe || 0)
                }, 0);
                
                // *** New: add formula to count sale target and ticket count target for every time line
                const NOW_YEAR = date.getFullYear();
                const NOW_MONTH = date.getMonth();
                //const NOW_DATE = date.getDate();

                // ** Function to calculate sale target and tc target
                function calculateSaleAndTCTargets(dateName) {
                    const countMONInMonth = countDaysInMonth(NOW_YEAR, NOW_MONTH, 1);
                    const countTUEInMonth = countDaysInMonth(NOW_YEAR, NOW_MONTH, 2);
                    const countWEDInMonth = countDaysInMonth(NOW_YEAR, NOW_MONTH, 3);
                    const countTHUInMonth = countDaysInMonth(NOW_YEAR, NOW_MONTH, 4);
                    const countFRIInMonth = countDaysInMonth(NOW_YEAR, NOW_MONTH, 5);
                    const countSATInMonth = countDaysInMonth(NOW_YEAR, NOW_MONTH, 6);
                    const countSUNInMonth = countDaysInMonth(NOW_YEAR, NOW_MONTH, 0);
    
                    // *** SALES
                    const countSaleMONInMonth = initDatas["Fabi05"][storeNameKey]["MONSalePercent"] * countMONInMonth;
                    const countSaleTUEInMonth = initDatas["Fabi05"][storeNameKey]["TUESalePercent"] * countTUEInMonth;
                    const countSaleWEDInMonth = initDatas["Fabi05"][storeNameKey]["WEDSalePercent"] * countWEDInMonth;
                    const countSaleTHUInMonth = initDatas["Fabi05"][storeNameKey]["THUSalePercent"] * countTHUInMonth;
                    const countSaleFRIInMonth = initDatas["Fabi05"][storeNameKey]["FRISalePercent"] * countFRIInMonth;
                    const countSaleSATInMonth = initDatas["Fabi05"][storeNameKey]["SATSalePercent"] * countSATInMonth;
                    const countSaleSUNInMonth = initDatas["Fabi05"][storeNameKey]["SUNSalePercent"] * countSUNInMonth;
                    const countSaleSUM = countSaleMONInMonth + countSaleTUEInMonth + countSaleWEDInMonth +
                                        countSaleTHUInMonth + countSaleFRIInMonth + countSaleSATInMonth +
                                        countSaleSUNInMonth;

                    const saleTargetMON = Math.round((countSaleMONInMonth / countSaleSUM / countMONInMonth) * initDatas["Fabi05"][storeNameKey]["TargetSaleTotal"] * 10)/10;
                    const saleTargetTUE = Math.round((countSaleTUEInMonth / countSaleSUM / countTUEInMonth) * initDatas["Fabi05"][storeNameKey]["TargetSaleTotal"] * 10)/10;
                    const saleTargetWED = Math.round((countSaleWEDInMonth / countSaleSUM / countWEDInMonth) * initDatas["Fabi05"][storeNameKey]["TargetSaleTotal"] * 10)/10;
                    const saleTargetTHU = Math.round((countSaleTHUInMonth / countSaleSUM / countTHUInMonth) * initDatas["Fabi05"][storeNameKey]["TargetSaleTotal"] * 10)/10;
                    const saleTargetFRI = Math.round((countSaleFRIInMonth / countSaleSUM / countFRIInMonth) * initDatas["Fabi05"][storeNameKey]["TargetSaleTotal"] * 10)/10;
                    const saleTargetSAT = Math.round((countSaleSATInMonth / countSaleSUM / countSATInMonth) * initDatas["Fabi05"][storeNameKey]["TargetSaleTotal"] * 10)/10;
                    const saleTargetSUN = Math.round((countSaleSUNInMonth / countSaleSUM / countSUNInMonth) * initDatas["Fabi05"][storeNameKey]["TargetSaleTotal"] * 10)/10;        

                        // *** TC
                    const countTCMONInMonth = initDatas["Fabi05"][storeNameKey]["MONTCPercent"] * countMONInMonth;
                    const countTCTUEInMonth = initDatas["Fabi05"][storeNameKey]["TUETCPercent"] * countTUEInMonth;
                    const countTCWEDInMonth = initDatas["Fabi05"][storeNameKey]["WEDTCPercent"] * countWEDInMonth;
                    const countTCTHUInMonth = initDatas["Fabi05"][storeNameKey]["THUTCPercent"] * countTHUInMonth;
                    const countTCFRIInMonth = initDatas["Fabi05"][storeNameKey]["FRITCPercent"] * countFRIInMonth;
                    const countTCSATInMonth = initDatas["Fabi05"][storeNameKey]["SATTCPercent"] * countSATInMonth;
                    const countTCSUNInMonth = initDatas["Fabi05"][storeNameKey]["SUNTCPercent"] * countSUNInMonth;
                    const countTCSUM = countTCMONInMonth + countTCTUEInMonth + countTCWEDInMonth +
                                        countTCTHUInMonth + countTCFRIInMonth + countTCSATInMonth +
                                        countTCSUNInMonth;
                    const tcTargetMON = Math.round((countTCMONInMonth / countTCSUM / countMONInMonth) * initDatas["Fabi05"][storeNameKey]["TargetTCTotal"] * 10)/10;
                    const tcTargetTUE = Math.round((countTCTUEInMonth / countTCSUM / countTUEInMonth) * initDatas["Fabi05"][storeNameKey]["TargetTCTotal"] * 10)/10;
                    const tcTargetWED = Math.round((countTCWEDInMonth / countTCSUM / countWEDInMonth) * initDatas["Fabi05"][storeNameKey]["TargetTCTotal"] * 10)/10;
                    const tcTargetTHU = Math.round((countTCTHUInMonth / countTCSUM / countTHUInMonth) * initDatas["Fabi05"][storeNameKey]["TargetTCTotal"] * 10)/10;
                    const tcTargetFRI = Math.round((countTCFRIInMonth / countTCSUM / countFRIInMonth) * initDatas["Fabi05"][storeNameKey]["TargetTCTotal"] * 10)/10;
                    const tcTargetSAT = Math.round((countTCSATInMonth / countTCSUM / countSATInMonth) * initDatas["Fabi05"][storeNameKey]["TargetTCTotal"] * 10)/10;
                    const tcTargetSUN = Math.round((countTCSUNInMonth / countTCSUM / countSUNInMonth) * initDatas["Fabi05"][storeNameKey]["TargetTCTotal"] * 10)/10;

                    switch(dateName) {
                        case "Monday":
                            return { saleTarget: saleTargetMON, tcTarget: tcTargetMON };
                        case "Tuesday":
                            return { saleTarget: saleTargetTUE, tcTarget: tcTargetTUE };
                        case "Wednesday":
                            return { saleTarget: saleTargetWED, tcTarget: tcTargetWED };
                        case "Thursday":
                            return { saleTarget: saleTargetTHU, tcTarget: tcTargetTHU };
                        case "Friday":
                            return { saleTarget: saleTargetFRI, tcTarget: tcTargetFRI };
                        case "Saturday":
                            return { saleTarget: saleTargetSAT, tcTarget: tcTargetSAT };
                        case "Sunday":
                            return { saleTarget: saleTargetSUN, tcTarget: tcTargetSUN };
                    }
                }
        
                //console.log("--- NOW_YEAR, NOW_MONTH", NOW_YEAR, NOW_MONTH)

                const { saleTarget, tcTarget } = calculateSaleAndTCTargets(moment(date).format("dddd"));

                //console.log("--- saleTarget, tcTarget", saleTarget, tcTarget);

                mFSaleFormatLarkBase.push({
                    "fields": {
                        "Year": date.getFullYear().toString(),
                        "Month": (date.getMonth() + 1).toString().padStart(2, '0'),  
                        "Day": DATE_NAME[moment(date).format("dddd")],
                        "Week": "W" + moment(date).week().toString().padStart(2, '0'),
                        "Date": date.getTime(),
                        "Area": initDatas["Fabi05"][storeNameKey]["area"],
                        "Store": storeNameKey,
                        "Sale TG": saleTarget,
                        "TC TG": tcTarget,
                        "Sale M": tongTienMorning,
                        "TC M": tongBillMorning,
                        "Sale A": tongTienAfternoon,
                        "TC A": tongBillAfternoon,
                        "Sale E": tongTienEvening,
                        "TC E": tongBillEvening,
                        "Sale Total": tongTienAllDay,
                        "TC Total": tongBillAllDay,
                        "Sale On": tongTienSaleON,
                        "TC On": tongTCON,
                        "Sale Off": tongTienSaleOFF,
                        "TC Off": tongTCOFF,
                        "Sale Tại Chỗ": tongSaleTaiCho,
                        "TC Tại Chỗ": tongTCTaiCho,
                        "Sale Xe Kem": tongSaleXeKem,
                        "TC Xe Kem": tongTCXeKem,
                        "Sale Sale": tongSaleSale,
                        "TC Sale": tongTCSale,
                        "Sale Event": tongSaleEvent,
                        "TC Event": tongTCEvent,
                        "Sale Mang Về": tongSaleMangVe,
                        "TC Mang Về": tongTCMangVe,
                        "Sale Grab": tongSaleGrab,
                        "TC Grab": tongTCGrab,
                        "Sale Shopee": tongSaleShopee,
                        "TC Shopee": tongTCShopee,
                        "Sale Xanh": tongSaleXanh,
                        "TC Xanh": tongTCXanh,
                        "Sale Befood": tongSaleBefood, 
                        "TC Befood": tongTCBefood, 
                        "Sale Momo": tongSaleMomo, 
                        "TC Momo": tongTCMomo, 
                        "Sale Web": tongSaleWeb, 
                        "TC Web": tongTCWeb, 
                        "Sale BO": tongSaleBO, 
                        "TC BO": tongTCBO, 
                        "Tiền mặt": tongThanhToanTienMat,
                        "Online": tongThanhToanOnline,
                        "Cà thẻ": tongThanhToanCaThe,
                    }
                })
            });

            // *** PM Group
            let mFPMGroupFormatLarkBase = [];
            //console.log("--- results[storeNameKey]", results[storeNameKey])
            Object.keys(results[storeNameKey]).map(dateKey => {
                const date = moment(dateKey, "DD/MM/YYYY").toDate();
                const listTongNhomMon = Object.values(results[storeNameKey][dateKey]).filter(item => item.tongNhomMon).map(item => item.tongNhomMon);
                const listTongNhomMonSoLuong = Object.values(results[storeNameKey][dateKey]).filter(item => item.tongNhomMonSoLuong).map(item => item.tongNhomMonSoLuong);
                const listTongNhomMonDoanhThu = Object.values(results[storeNameKey][dateKey]).filter(item => item.tongNhomMonDoanhThu).map(item => item.tongNhomMonDoanhThu);

                const resultTongNhomMon = _.reduce(
                    listTongNhomMon, 
                    (acc, curr) => {
                        Object.keys(curr).forEach(key => {
                            if (!acc[key]) {
                                acc[key] = 0;
                            }
                            acc[key] += curr[key];
        
                        });
                        return acc;
                    }, 
                    {}
                );
        
                const resultTongNhomMonDoanhThu = _.reduce(
                    listTongNhomMonDoanhThu, 
                    (acc, curr) => {
                        Object.keys(curr).forEach(key => {
                            if (!acc[key]) {
                                acc[key] = 0;
                            }
                            acc[key] += curr[key];
        
                        });
                        return acc;
                    }, 
                    {}
                );

                const resultTongNhomMonSoLuong = _.reduce(
                    listTongNhomMonSoLuong, 
                    (acc, curr) => {
                        Object.keys(curr).forEach(key => {
                            if (!acc[key]) {
                                acc[key] = 0;
                            }
                            acc[key] += curr[key];
        
                        });
                        return acc;
                    }, 
                    {}
                );
                
                Object.keys(resultTongNhomMon).map(keyNhomMon => {
                    mFPMGroupFormatLarkBase.push({
                        "fields": {
                            "Year": date.getFullYear().toString(),
                            "Month": (date.getMonth() + 1).toString().padStart(2, '0'),
                            "Day": DATE_NAME[moment(date).format("dddd")],
                            "Week": "W" + moment(date).week().toString().padStart(2, '0'),
                            "Date": date.getTime(),
                            "Area": initDatas["Fabi05"][storeNameKey]["area"],
                            "Store": storeNameKey,
                            "Nhóm món": keyNhomMon,
                            "Sale": resultTongNhomMonDoanhThu[keyNhomMon],
                            "Tổng số món": resultTongNhomMonSoLuong[keyNhomMon]
                        }
                    })
                })             
            })

            // *** PM Item
            let mFPMItemFormatLarkBase = [];
            let totalItemOneStore = {};
            let totalItemOneMonth = {};

            Object.keys(results[storeNameKey]).map(dateKey => {
                const date = moment(dateKey, "DD/MM/YYYY").toDate();
                const year = date.getFullYear().toString();
                const month = (date.getMonth() + 1).toString();
                const day = (date.getDate()).toString();
                let listTongMaHang = Object.values(results[storeNameKey][dateKey]).filter(item => item.tongMaHang).map(item => item.tongMaHang);
                let listTongMaHangDoanhThu = Object.values(results[storeNameKey][dateKey]).filter(item => item.tongMaHangDoanhThu).map(item => item.tongMaHangDoanhThu);

                let totalItemOneDay = {};
                for(let i = 0; i < listTongMaHang.length; i++) {
                    Object.keys(listTongMaHang[i]).map(keyMaHang => {
                        if(!totalItemOneDay[keyMaHang]) {
                            totalItemOneDay[keyMaHang] = {
                                "soLuong": listTongMaHang[i][keyMaHang],
                                "doanhThu": listTongMaHangDoanhThu[i][keyMaHang],
                            };
                        } else {
                            totalItemOneDay[keyMaHang] = {
                                "soLuong": totalItemOneDay[keyMaHang]["soLuong"] + listTongMaHang[i][keyMaHang],
                                "doanhThu": totalItemOneDay[keyMaHang]["doanhThu"] + listTongMaHangDoanhThu[i][keyMaHang],
                            };
                        }
                    });
                }
                totalItemOneMonth[dateKey] = totalItemOneDay;
            });

            Object.keys(totalItemOneMonth).map((keyDate, idx) => {
                const itemOneDay = totalItemOneMonth[keyDate];
                const year = keyDate.split("/")[2];
                const month = keyDate.split("/")[1];

                if(!totalItemOneStore[year]?.[month]) {
                    totalItemOneStore[year] = {
                        [month]: {}
                    };
                }

                Object.keys(itemOneDay).map(keyMaHang => {
                    if(!totalItemOneStore[year][month][keyMaHang]) {
                        totalItemOneStore[year][month][keyMaHang] = {
                            "soLuong": itemOneDay[keyMaHang]["soLuong"],
                            "doanhThu": itemOneDay[keyMaHang]["doanhThu"],
                        };
                    } else {
                        totalItemOneStore[year][month][keyMaHang] = {
                            "soLuong": totalItemOneStore[year][month][keyMaHang]["soLuong"] + itemOneDay[keyMaHang]["soLuong"],
                            "doanhThu": totalItemOneStore[year][month][keyMaHang]["doanhThu"] + itemOneDay[keyMaHang]["doanhThu"],
                        };
                    }
                })
            });

            Object.keys(totalItemOneStore).map(keyYear => {
                Object.keys(totalItemOneStore[keyYear]).map(keyMonth => {
                    let totalItemOneStoreByYearAndMonth = totalItemOneStore[keyYear][keyMonth];
                    Object.keys(initDatas["FoodType"]).map(keyFoodType => {
                        mFPMItemFormatLarkBase.push({
                            "fields": {
                                "Year": keyYear,
                                "Month": keyMonth.padStart(2, '0'),
                                "Khu vực": initDatas["Fabi05"][storeNameKey]["area"],
                                "Chi nhánh": storeNameKey,               
                                "Mã món": keyFoodType,
                                "Tên Món": initDatas["FoodType"][keyFoodType]["foodName"],
                                "Số lượng": totalItemOneStoreByYearAndMonth[keyFoodType]?.["soLuong"] || 0,
                                "Doanh thu": totalItemOneStoreByYearAndMonth[keyFoodType]?.["doanhThu"] || 0,
                                "Size": initDatas["FoodType"][keyFoodType]["size"],
                            },  
                        })
                    })
                })
            });

            //console.log("--- mFPMGroupFormatLarkBase", mFPMGroupFormatLarkBase);

            if(initDatas["Fabi05"][storeNameKey]["BaseId"])  {
                const smallerMFSaleFields = _.chunk(mFSaleFormatLarkBase, 400);
                const smallerMFHoursFields = _.chunk(mFHoursFormatLarkBase, 400);
                const smallerMFPMGroupFields = _.chunk(mFPMGroupFormatLarkBase, 400);
                const smallerMFPMItemFields = _.chunk(mFPMItemFormatLarkBase, 400);

                smallerMFSaleFields.map(async(smallerField) => {
                    saveRecordsToLarkBase({ 
                        name: storeNameKey,
                        base_id: initDatas["Fabi05"][storeNameKey]["BaseId"],
                        table_id: initDatas["Fabi05"][storeNameKey]["MFSaleTableId"],
                        data: smallerField
                    })
                })

                smallerMFHoursFields.map(smallerField => {
                    saveRecordsToLarkBase({ 
                        name: storeNameKey,
                        base_id: initDatas["Fabi05"][storeNameKey]["BaseId"],
                        table_id: initDatas["Fabi05"][storeNameKey]["MFHourTableId"],
                        data: smallerField
                    });
                })

                smallerMFPMGroupFields.map(smallerField => {
                    saveRecordsToLarkBase({ 
                        name: storeNameKey,
                        base_id: initDatas["Fabi05"][storeNameKey]["BaseId"],
                        table_id: initDatas["Fabi05"][storeNameKey]["MFPMGroupTableId"],
                        data: smallerField
                    });
                })

                smallerMFPMItemFields.map(smallerField => {
                    saveRecordsToLarkBase({ 
                        name: storeNameKey,
                        base_id: initDatas["Fabi05"][storeNameKey]["BaseId"],
                        table_id: initDatas["Fabi05"][storeNameKey]["MFPMItemTableId"],
                        data: smallerField
                    });
                });
            }

            idx++;
            if(idx >= storeNameKeys.length) {
                console.log("--- CLEAR INTERVAL")
                setIsLoading(false);
                setSuccessMessage("Kết thúc quá trình import data");
                clearInterval(intervalId);
            }
        }, INTERVAL_MS);
    }

    async function saveRecordsToLarkBase({ name, base_id, table_id, data }) {
        const res = await httpClient.post(`/larksuite/create-records`, 
            { name, base_id, table_id, data }
        );

        if(!res.data.error) {
            setSuccessMessage(res.data.data);
        } else {
            setErrorMessage("Lỗi:" + JSON.stringify(res.data?.error?.message));
        }
    }

    async function deleteRecordsInLarkBase({ base_id, table_id, year, month }) {
        const res = await httpClient.post(`/larksuite/delete-records`, 
            { base_id, table_id, year, month }
        );

        if(res.data.error) {
            console.log("Lỗi:" + JSON.stringify(res.data?.error?.message));
        }
    }

    // if(!isAllowAccessThisPage) {
    //     return (
    //         <Flex w="100%" p={4} flexDirection="column" alignItems="flex-start" justify="flex-start" h="100vh">
    //             <Text color="red.500"  fontSize="2xl" fontWeight="bold">**** Bạn không có quyền truy cập trang này (vui lòng liên hệ admin) ****</Text>
    //         </Flex>
    //     );
    // }
    

    return (
        <Box w="100vw" h="100vh" bg="ghostwhite">
            <Flex flexDirection={{ base: "column", md: "row", lg: "row" }} p={4} w="100%" justify="flex-start" gap={4}>
                <input type="file" accept='.xlsx,.csv' ref={fileInputRef} hidden style={{ padding: "10px"}}
                    onChange={fileHandler} 
                    onClick={(event) => {event.target.value = null}} 
                />
                <Select maxW={200} size="sm" value={importFileType} placeholder='Chọn loại file'
                        onChange={
                            (evt) => { setImportFileType(evt.target.value) }
                        }
                    >
                    {
                        IMPORT_FILE_TYPES.map((item, idx) => (
                            <option key={`import-file-type-${idx}`} value={item}>{item}</option>
                        ))
                    }
                </Select>

                <Button colorScheme='orange' isDisabled={importFileType?.length === 0}
                    onClick={() => {
                            fileInputRef.current.click();
                        }
                    }
                >
                    <Icon boxSize={6} as={MdFileUpload} marginRight="8px"/>   
                    <Text>Upload file</Text>
                </Button>
                <Button colorScheme='red' isDisabled={rows.length === 0}
                    onClick={() => {
                            setRows([]);
                            setCols([]);
                        }
                    }
                >
                    <Icon boxSize={6} as={MdFileUpload} marginRight="8px"/>   
                    <Text>Xoá data</Text>
                </Button>

                <Button colorScheme='blue' mr={3} 
                    isDisabled={(rows.length === 0)}
                    isLoading={isProcessing}
                    loadingText="Đang lưu"
                    onClick={() => handleSyncToLarkBase()}
                >
                    <Icon boxSize={6} as={MdSave} marginRight="8px"/> 
                    <Text>Sync to Lark Base</Text>
                </Button>
            </Flex>

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
                <Heading size="md">Dữ liệu upload (max hiển thị = 100 dòng)</Heading>
                { (rows.length !== 0) && <OutTable data={maxRowDisplays} columns={cols} tableClassName="ExcelTable2007" tableHeaderRowClass="heading"/> } 
                { (rows.length === 0) && <Text>Chưa upload file</Text>} 
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

export default ImportDatas;