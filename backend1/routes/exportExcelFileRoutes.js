const Excel = require('exceljs');
const { Op } = require('sequelize');
const moment = require("moment");
const dotenv = require("dotenv");
dotenv.config();
const axios = require("axios");
const _ = require('lodash');
var authController = require('../middleware/auth');
const { encrypt } = require('../utils/crypto');
const dateFormat = require("date-format")
const { createKTB1ExcelFile } = require('../utils/kiem_thuc_3_buoc/kiem_thuc_buoc_1');
const { createKTB23ExcelFile } = require('../utils/kiem_thuc_3_buoc/kiem_thuc_buoc_23');
const { createKTB4ExcelFile } = require('../utils/kiem_thuc_3_buoc/kiem_thuc_buoc_4');
// const { createLSXExcelFile } = require('../utils/lenh_san_xuat/lenh_san_xuat');
const { createLSX2ExcelFile } = require('../utils/lenh_san_xuat/lenh_san_xuat_2');
const { createGDCExcelFile } = require('../utils/giay_di_cho/giay_di_cho');
const { createSO_PRForm1ExcelFile } = require('../utils/mua_hang_po/so_pr_form_1');
const { createPRForm2ExcelFile } = require('../utils/mua_hang_po/pr_form_2');
const { createKHDH_PR_POT_Form3_ExcelFile } = require('../utils/mua_hang_po/khdh_pr_pot_form_3');
const { createPO_Form4_ExcelFile } = require('../utils/mua_hang_po/form_4');
const { createForm6POExcelFile } = require('../utils/mua_hang_po/form_6');
const { getTenantToken } = require("../controllers/larksuite");
const BIZEN_CATERING_BASE_ID = "TO6Zw7lxJi1hFtkcCetjcct5pNc";
const THUC_DON_TUAN_TABLE_ID = "tblcesBeBMwmAFFn";
const LENH_SAN_XUAT_TABLE_ID = "tbl0DJNU6sWrLGAA";
const KIEM_THUC_BUOC_11_TABLE_ID = "tblTrPB47sd2QqLK";
const KIEM_THUC_BUOC_12_TABLE_ID = "tbllux9AZp7bQ0GM";
const KIEM_THUC_BUOC_23_TABLE_ID = "tblEl4FkZHVnhiOi";
const KIEM_THUC_BUOC_4_TABLE_ID = "tblFw227tdZp0bwK";
const LSX_SO_PR_TABLE_ID = "tbl0DJNU6sWrLGAA";
const KHDH_PR_POT_TABLE_ID = "tblmDbzHvDxpffhD";
const PO_TABLE_ID = "tbltXo4LNSuvs2ys";
const GIAO_HANG_FORM5_TABLE_ID = "tbl7xw40Q0UuSjTH";

const getKTBuoc11Datas = async(TENANT_TOKEN, client_code, date, ca, site) => {
    //console.log("---- getKTBuoc11Datas", TENANT_TOKEN, client_code, date)
    const KIEM_THUC_BUOC_1_URL = `https://open.larksuite.com/open-apis/bitable/v1/apps/${BIZEN_CATERING_BASE_ID}/tables/${KIEM_THUC_BUOC_11_TABLE_ID}/records/search`
    let _conditions = [];

    if(client_code) {
        _conditions.push({
            "field_name": "Khách hàng",
            "operator": "is",
            "value": [client_code],
        });
    }
    if(date) {
        _conditions.push({
            "field_name": "Ngày",
            "operator": "is",
            "value": [
                "ExactDate",
                `${new Date(date).getTime()}`,
            ],
        });
    }
    if(ca) {
        _conditions.push({
            "field_name": "Ca",
            "operator": "is",
            "value": [ca],
        });
    }
    // if(site) {
    //     _conditions.push({
    //         "field_name": "Site ăn",
    //         "operator": "contains",
    //         "value": [site],
    //     });
    // }

    const listKTB1Res = await axios.post(KIEM_THUC_BUOC_1_URL,
        {
            "field_names": [
                "Ngày", "Khách hàng", "Ca", "Cơ cấu suất ăn", "Nguyên vật liệu", "Định mức nguyên liệu", "Định mức quy đổi",
                "Đơn vị tính", "Đơn vị tính mua hàng", "Đơn giá", "Tổng số phần", "Tổng khối lượng yêu cầu sản xuất",
                "Tên cơ sở", "Địa chỉ", "Điện thoại", "Người giao hàng", "Chứng từ hoá đơn",
                "Giấy đăng ký vệ sinh thú y", "Giấy kiểm dịch", "Hao hụt", "Danh sách các site", "Số lượng các site"
            ],
            "filter": {
                "conditions": _conditions,
                // "conditions": [
                //     {
                //         "field_name": "Khách hàng",
                //         "operator": "is",
                //         "value": [client_code], //[req.body.client_code]
                //     },
                //     {
                //         "field_name": "Ngày",
                //         "operator": "is",
                //         "value": [
                //             "ExactDate",
                //             `${new Date(date).getTime()}`,
                //         ],
                //     },
                //     {
                //         "field_name": "Ca",
                //         "operator": "is",
                //         "value": [ca]
                //     }
                // ],
                "conjunction": "and"
            }
        },
        {
            headers: {
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${TENANT_TOKEN}`
            }
        }
    );  
    
    const datas = listKTB1Res.data.data?.items || [];
    let result = [];

    for(let i = 0; i < datas.length; i++) {
        let Ngay =  dateFormat("dd/MM/yyyy", new Date(datas[i]["fields"]["Ngày"]) || new Date());
        let KhachHang =  datas[i]["fields"]["Khách hàng"]?.[0]?.["text"] || "";
        let CoCauSuatAn =  datas[i]["fields"]["Cơ cấu suất ăn"]?.[0]?.["text"] || ""; 
        let Ca =  datas[i]["fields"]["Ca"]?.[0]?.["text"] || "";
        let NguyenVatLieu =  datas[i]["fields"]["Nguyên vật liệu"]?.[0]?.["text"] || "";
        let DinhMucNguyenLieu = datas[i]["fields"]["Định mức nguyên liệu"];
        let DinhMucQuyDoi = datas[i]["fields"]["Định mức quy đổi"]?.["value"]?.[0] || 0;
        let DonViTinh = datas[i]["fields"]["Đơn vị tính"]?.[0]?.["text"] || "";
        let DonViTinhMuaHang = datas[i]["fields"]["Đơn vị tính mua hàng"]?.[0]?.["text"] || "";
        let DonGia = datas[i]["fields"]["Đơn giá"]?.["value"]?.[0] || 0;
        let TongSoPhan = datas[i]["fields"]["Tổng số phần"];
        let TongKhoiLuongYeuCauSanXuat = datas[i]["fields"]["Tổng khối lượng yêu cầu sản xuất"]?.["value"]?.[0] || 0;
        let TenCoSo = datas[i]["fields"]["Tên cơ sở"]?.["value"]?.[0] || "";
        let DiaChi =  datas[i]["fields"]["Địa chỉ"]?.["value"]?.[0]?.["text"] || "";
        let DienThoai = datas[i]["fields"]["Điện thoại"]?.["value"]?.[0] || 0;
        let NguoiGiaoHang = datas[i]["fields"]["Người giao hàng"]?.["value"]?.[0]?.["text"] || "";
        let ChungTuHoaDon = datas[i]["fields"]["Chứng từ hoá đơn"]?.["value"]?.[0]?.["text"] || "";
        let GiayDangKyVeSinhThuY = datas[i]["fields"]["Giấy đăng ký vệ sinh thú y"]?.["value"]?.[0]?.["text"] || "";
        let GiayKiemDich = datas[i]["fields"]["Giấy kiểm dịch"]?.["value"]?.[0] || "";
        let HaoHut = datas[i]["fields"]["Hao hụt"]?.["value"]?.[0] || 0;
        let DanhSachCacSite = datas[i]["fields"]["Danh sách các site"]?.[0]?.["text"] || "";
        let SoLuongCacSite = datas[i]["fields"]["Số lượng các site"]?.[0]?.["text"] || "";
        //console.log("---- DinhMucQuyDoi", DinhMucQuyDoi);
        // chỗ này mình sẽ làm 1 bộ lọc cho các stie
        if(site && site.length > 0) {
            let DanhSachCacSites = DanhSachCacSite.split(",").map(item => item.trim());
            let siteThucTe = [];
            for(let i = 0; i < DanhSachCacSites.length; i++) {
                if(site.includes(DanhSachCacSites[i])) {
                    siteThucTe.push({ 
                        "site_name": DanhSachCacSites[i],
                        "so_phan": SoLuongCacSite.split(",").map(item => item.trim())[i] || 0,
                        "so_luong_yeu_cau_san_xuat": DinhMucNguyenLieu * DinhMucQuyDoi * (SoLuongCacSite.split(",").map(item => item.trim())[i] || 0)
                    });
                }
            }
            TongSoPhan = siteThucTe.reduce((sum, item) => sum + Number(item.so_phan), 0);
            DanhSachCacSite = siteThucTe.map(item => item.site_name).join(", ");
            SoLuongCacSite = siteThucTe.map(item => item.so_phan).join(", ");
            TongKhoiLuongYeuCauSanXuat = siteThucTe.reduce((sum, item) => sum + Number(item.so_luong_yeu_cau_san_xuat), 0);
            //console.log("---- siteThucTe", siteThucTe);
        }

        //console.log("---- GiayKiemDich", datas[i]["fields"]["Giấy kiểm dịch"]?.["value"]?.[0] || "")
        result.push({ 
    Ngay, KhachHang, Ca, CoCauSuatAn, NguyenVatLieu,
    DinhMucNguyenLieu, DinhMucQuyDoi, DonViTinh, DonViTinhMuaHang, DonGia, 
    TongSoPhan, TongKhoiLuongYeuCauSanXuat, 
    TenCoSo, DiaChi, DienThoai, NguoiGiaoHang, ChungTuHoaDon, 
    GiayDangKyVeSinhThuY, GiayKiemDich, HaoHut, DanhSachCacSite, SoLuongCacSite
});
    }

    return result;
}

const getKTBuoc12Datas = async(TENANT_TOKEN, client_code, date) => {
    const KIEM_THUC_BUOC_12_URL = `https://open.larksuite.com/open-apis/bitable/v1/apps/${BIZEN_CATERING_BASE_ID}/tables/${KIEM_THUC_BUOC_12_TABLE_ID}/records/search`
    const listKTB12Res = await axios.post(KIEM_THUC_BUOC_12_URL,
        {
            "field_names": [
                "Tên thực phẩm", "Tên cơ sở sản xuất", "Địa chỉ sản xuất", "Khối lượng", "Tên cơ sở cung cấp",
                "Tên chủ giao hàng", "Địa chỉ", "Điện thoại", "Hạn sử dụng",
                "Điều kiện bảo quản", "Chứng từ hoá đơn"
            ],
            "filter": {
                "conditions": [
                    // {
                    //     "field_name": "Khách hàng",
                    //     "operator": "is",
                    //     "value": ["LIXIL"], //[req.body.client_code]
                    // },
                    // {
                    //     "field_name": "Ngày",
                    //     "operator": "is",
                    //     "value": [
                    //         "ExactDate",
                    //         `${new Date(req.body.date).getTime()}`,
                    //     ],
                    // }
                ],
                "conjunction": "and"
            }
        },
        {
            headers: {
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${TENANT_TOKEN}`
            }
        }
    );  
    
    const datas = listKTB12Res.data.data?.items || [];
    let result = [];

    for(let i = 0; i < datas.length; i++) {
        let TenThucPham = datas[i]["fields"]["Tên thực phẩm"]?.[0]?.["text"] || "";
        let TenCoSoSanXuat =  datas[i]["fields"]["Tên cơ sở sản xuất"]?.[0]?.["text"] || "";
        let DiaChiSanXuat =  datas[i]["fields"]["Địa chỉ sản xuất"]?.[0]?.["text"] || "";
        let ThoiGianNhap =  dateFormat("dd/MM/yyyy", new Date(date) || new Date());
        let KhoiLuong = datas[i]["fields"]["Khối lượng"]?.[0]?.["text"] || "";
        let TenCoSoCungCap = datas[i]["fields"]["Tên cơ sở cung cấp"]?.[0]?.["text"] || "";
        let TenChuGiaoHang =  datas[i]["fields"]["Tên chủ giao hàng"]?.[0]?.["text"] || "";
        let DiaChi = datas[i]["fields"]["Địa chỉ"]?.[0]?.["text"] || "";
        let DienThoai = datas[i]["fields"]["Điện thoại"];
        let HanSuDung = datas[i]["fields"]["Hạn sử dụng"]?.[0]?.["text"] || "";
        let DieuKienBaoQuan = datas[i]["fields"]["Điều kiện bảo quản"]?.[0]?.["text"] || "";
        let ChungTuHoaDon = datas[i]["fields"]["Chứng từ hoá đơn"]?.[0]?.["text"] || "";

        result.push({ 
            TenThucPham, TenCoSoSanXuat, DiaChiSanXuat, ThoiGianNhap, KhoiLuong, TenCoSoCungCap, TenChuGiaoHang, 
            DiaChi, DienThoai, HanSuDung, DieuKienBaoQuan, ChungTuHoaDon
        });
    }

    return result;
}

const getKTBuoc23Datas = async(TENANT_TOKEN, client_code, date, ca) => {
    console.log("---- getKTBuoc23Datas", TENANT_TOKEN, client_code, date)
    const KIEM_THUC_BUOC_23_URL = `https://open.larksuite.com/open-apis/bitable/v1/apps/${BIZEN_CATERING_BASE_ID}/tables/${KIEM_THUC_BUOC_23_TABLE_ID}/records/search`
    const listKTB23Res = await axios.post(KIEM_THUC_BUOC_23_URL,
        {
            "field_names": [
                "Ngày", "Giờ ăn", "Khách hàng", "Ca", "Tên món ăn", "Nguyên liệu chính", "Số lượng suất ăn",
                "Thời gian sơ chế xong", "Thời gian chế biến xong", "Thời gian chia món ăn xong", "Thời gian bắt đầu ăn"
            ],
            "filter": {
                "conditions": [
                    {
                        "field_name": "Khách hàng",
                        "operator": "is",
                        "value": [client_code]
                    },
                    {
                        "field_name": "Ngày",
                        "operator": "is",
                        "value": [
                            "ExactDate",
                            `${new Date(date).getTime()}`,
                        ],
                    },
                    {
                        "field_name": "Ca",
                        "operator": "is",
                        "value": [ca]
                    }
                ],
                "conjunction": "and"
            }
        },
        {
            headers: {
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${TENANT_TOKEN}`
            }
        }
    );  
    
    const datas = listKTB23Res.data.data?.items || [];
    let result = [];

    for(let i = 0; i < datas.length; i++) {
        let Ngay =  dateFormat("dd/MM/yyyy", new Date(datas[i]["fields"]["Ngày"]) || new Date());
        let GioAn =  datas[i]["fields"]["Giờ ăn"]?.[0]?.["text"] || "";
        let KhachHang =  datas[i]["fields"]["Khách hàng"]?.[0]?.["text"] || "";
        let Ca =  datas[i]["fields"]["Ca"]?.[0]?.["text"] || "";
        let TenMonAn = datas[i]["fields"]["Tên món ăn"]?.[0]?.["text"] || "";
        let NguyenLieuChinh = datas[i]["fields"]["Nguyên liệu chính"]?.["value"]?.[0]?.["text"] || "";
        let SoLuongSuatAn =  datas[i]["fields"]["Số lượng suất ăn"]?.["value"]?.[0] || 0;
        let ThoiGianSoCheXong = datas[i]["fields"]["Thời gian sơ chế xong"]?.[0]?.["text"] || "";
        let ThoiGianCheBienXong = datas[i]["fields"]["Thời gian chế biến xong"]?.[0]?.["text"] || "";
        let ThoiGianChiaMonAnXong = datas[i]["fields"]["Thời gian chia món ăn xong"]?.[0]?.["text"] || "";
        let ThoiGianBatDauAn =  datas[i]["fields"]["Thời gian bắt đầu ăn"]?.[0]?.["text"] || "";

        result.push({ 
            Ngay, GioAn, KhachHang, Ca, TenMonAn, NguyenLieuChinh, SoLuongSuatAn, 
            ThoiGianSoCheXong, ThoiGianCheBienXong, ThoiGianChiaMonAnXong, ThoiGianBatDauAn
        });
    }

    return result;
}

const getKTBuoc4Datas = async(TENANT_TOKEN, client_code, date, ca) => {
    console.log("---- getKTBuoc4Datas", TENANT_TOKEN, client_code, date)
    const KIEM_THUC_BUOC_4_URL = `https://open.larksuite.com/open-apis/bitable/v1/apps/${BIZEN_CATERING_BASE_ID}/tables/${KIEM_THUC_BUOC_4_TABLE_ID}/records/search`
    const listKTB4Res = await axios.post(KIEM_THUC_BUOC_4_URL,
        {
            "field_names": [
                "Ngày", "Giờ ăn", "Khách hàng", "Ca", "Tên món ăn", "Cơ cấu suất ăn", "Số lượng suất ăn",
                "Khối lượng thể tích mẫu", "Dụng cụ chứa mẫu thức ăn lưu", "Nhiệt độ bảo quản mẫu",
                "Thời gian lấy mẫu", "Thời gian huỷ mẫu"
            ],
            "filter": {
                "conditions": [
                    {
                        "field_name": "Khách hàng",
                        "operator": "is",
                        "value": [client_code]
                    },
                    {
                        "field_name": "Ngày",
                        "operator": "is",
                        "value": [
                            "ExactDate",
                            `${new Date(date).getTime()}`,
                        ],
                    },
                    {
                        "field_name": "Ca",
                        "operator": "is",
                        "value": [ca]
                    }
                ],
                "conjunction": "and"
            }
        },
        {
            headers: {
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${TENANT_TOKEN}`
            }
        }
    );  
    
    const datas = listKTB4Res.data.data?.items || [];
    let result = [];

    for(let i = 0; i < datas.length; i++) {
        let Ngay =  dateFormat("dd/MM/yyyy", new Date(datas[i]["fields"]["Ngày"]) || new Date());
        let NextNgay = dateFormat("dd/MM/yyyy", moment(datas[i]["fields"]["Ngày"]).add(1, 'days').toDate() || new Date());
        let GioAn =  datas[i]["fields"]["Giờ ăn"]?.[0]?.["text"] || "";
        let KhachHang =  datas[i]["fields"]["Khách hàng"]?.[0]?.["text"] || "";
        let Ca =  datas[i]["fields"]["Ca"]?.[0]?.["text"] || "";
        let TenMonAn = datas[i]["fields"]["Tên món ăn"]?.[0]?.["text"] || "";

        let CoCauSuatAn = datas[i]["fields"]["Cơ cấu suất ăn"]?.[0]?.["text"] || "";
        let SoLuongSuatAn =  datas[i]["fields"]["Số lượng suất ăn"]?.["value"]?.[0] || 0;
        let KhoiLuongTheTichMau = datas[i]["fields"]["Khối lượng thể tích mẫu"]?.["value"]?.[0]?.["text"] || "";
        let DungCuChuaMauThucAnLuu = datas[i]["fields"]["Dụng cụ chứa mẫu thức ăn lưu"]?.[0]?.["text"] || "";
        let NhietDoBaoQuanMau = datas[i]["fields"]["Nhiệt độ bảo quản mẫu"]?.[0]?.["text"] || "";
        let ThoiGianLayMau =  datas[i]["fields"]["Thời gian lấy mẫu"]?.[0]?.["text"] || "";
        let ThoiGianHuyMau =  datas[i]["fields"]["Thời gian huỷ mẫu"]?.[0]?.["text"] || "";

        result.push({ 
            Ngay, NextNgay, GioAn, KhachHang, Ca, TenMonAn, CoCauSuatAn, SoLuongSuatAn, 
            KhoiLuongTheTichMau, DungCuChuaMauThucAnLuu, NhietDoBaoQuanMau, ThoiGianLayMau, ThoiGianHuyMau
        });
    }

    return result;
}

const getLSX2Datas = async(TENANT_TOKEN, client_codes, date, kitchen, co_cau_menus) => {
    const THUC_DON_TUAN_URL = `https://open.larksuite.com/open-apis/bitable/v1/apps/${BIZEN_CATERING_BASE_ID}/tables/${THUC_DON_TUAN_TABLE_ID}/records/search`
    
    let _conditions = [];

    if(kitchen) {
        _conditions.push({
            "field_name": "Bếp thực hiện",
            "operator": "is",
            "value": [kitchen],
        });
    } 
        
    if(client_codes.length > 0) {
        _conditions.push({
            "field_name": "Khách hàng",
            "operator": "contains",
            "value": client_codes,
        });
    }

    if(co_cau_menus.length > 0) {
        _conditions.push({
            "field_name": "Loại món ăn",
            "operator": "contains",
            "value": co_cau_menus,
        });
    }

    if(date) {
        _conditions.push({
            "field_name": "Ngày",
            "operator": "is",
            "value": [
                "ExactDate",
                `${new Date(date).getTime()}`,
            ],
        });
    }

    console.log("---- _conditions", _conditions);

    const listTDTRes = await axios.post(THUC_DON_TUAN_URL,
        {
            "field_names": [
                "Ngày", "Thứ", "Khách hàng", "Site ăn", "Ca", "Món ăn BOM", "Cơ cấu suất ăn", "BOM món ăn",
                "Nguyên liệu cho Kiểm thực 15h bước 2", 
                "Nguyên liệu cho đặt hàng được duyệt", 
                "Nguyên liệu cho đặt hàng dự báo", 
                "Site 1", "Site 2", "Site 3", "Site 4", "Site 5", 
                "Số lượng duyệt 15h", "Số lượng đặt hàng được duyệt", "Số lượng đặt hàng dự báo",
                "Số lượng chốt 9h Site 1", "Số lượng chốt 9h Site 2", "Số lượng chốt 9h Site 3", "Số lượng chốt 9h Site 4", "Số lượng chốt 9h Site 5",
                "Số lượng duyệt 15h Site 1", "Số lượng duyệt 15h Site 2", "Số lượng duyệt 15h Site 3", "Số lượng duyệt 15h Site 4", "Số lượng duyệt 15h Site 5",
                "Số lượng đặt hàng được duyệt Site 1", "Số lượng đặt hàng được duyệt Site 2", "Số lượng đặt hàng được duyệt Site 3", "Số lượng đặt hàng được duyệt Site 4", "Số lượng đặt hàng được duyệt Site 5",
                "Số lượng đặt hàng dự báo Site 1", "Số lượng đặt hàng dự báo Site 2", "Số lượng đặt hàng dự báo Site 3", "Số lượng đặt hàng dự báo Site 4", "Số lượng đặt hàng dự báo Site 5",
                "Khối lượng sản xuất 15h Site 1", "Khối lượng sản xuất 15h Site 2", "Khối lượng sản xuất 15h Site 3", "Khối lượng sản xuất 15h Site 4", "Khối lượng sản xuất 15h Site 5",
                "Khối lượng đặt hàng được duyệt Site 1", "Khối lượng đặt hàng được duyệt Site 2", "Khối lượng đặt hàng được duyệt Site 3", "Khối lượng đặt hàng được duyệt Site 4", "Khối lượng đặt hàng được duyệt Site 5",
                "Khối lượng đặt hàng dự báo Site 1", "Khối lượng đặt hàng dự báo Site 2", "Khối lượng đặt hàng dự báo Site 3", "Khối lượng đặt hàng dự báo Site 4", "Khối lượng đặt hàng dự báo Site 5",
            ],
            "filter": {
                "conditions": _conditions,
                // "conditions": [
                //     {
                //         "field_name": "Khách hàng",
                //         "operator": "is",
                //         "value": [client_code],
                //     },
                //     {
                //         "field_name": "Ngày",
                //         "operator": "is",
                //         "value": [
                //             "ExactDate",
                //             `${new Date(date).getTime()}`,
                //         ],
                //     }
                // ],
                "conjunction": "and"
            }
        },
        {
            headers: {
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${TENANT_TOKEN}`
            }
        }
    );  
    console.log("---- listTDTRes", listTDTRes.data.data);
    const datas = listTDTRes.data.data?.items || [];

    let result = [];
    for(let i = 0; i < datas.length; i++) {
        let Ngay = datas[i]["fields"]["Ngày"];
        let Thu = datas[i]["fields"]["Thứ"]?.["value"][0]?.["text"] || "";
        let KhachHang =  datas[i]["fields"]["Khách hàng"];
        let SiteAn = Array.isArray(datas[i]["fields"]["Site ăn"]) ? datas[i]["fields"]["Site ăn"].join(", ") : "";
        let Ca = datas[i]["fields"]["Ca"];
        let MonAn = datas[i]["fields"]["Món ăn BOM"];
        let CoCauSuatAn =  datas[i]["fields"]["Cơ cấu suất ăn"];
    
        let NguyenLieuChoKiemThuc15hBuoc2 = datas[i]["fields"]["Nguyên liệu cho Kiểm thực 15h bước 2"]?.["value"][0]?.["text"] || "";
        let NguyenLieuChoKiemThucDatHangDuocDuyetBuoc2 = datas[i]["fields"]["Nguyên liệu cho đặt hàng được duyệt"]?.["value"][0]?.["text"] || "";
        let NguyenLieuChoKiemThucDatHangDuBaoBuoc2 = datas[i]["fields"]["Nguyên liệu cho đặt hàng dự báo"]?.["value"][0]?.["text"] || "";
        let BOMMonAn = datas[i]["fields"]["BOM món ăn"]?.["value"][0]?.["text"] || "";

        let Site1 = datas[i]["fields"]["Site 1"]?.["value"][0] || "";
        let Site2 = datas[i]["fields"]["Site 2"]?.["value"][0] || "";
        let Site3 = datas[i]["fields"]["Site 3"]?.["value"][0] || "";
        let Site4 = datas[i]["fields"]["Site 4"]?.["value"][0] || "";
        let Site5 = datas[i]["fields"]["Site 5"]?.["value"][0] || "";

        let SoLuongDuyet15h = datas[i]["fields"]["Số lượng duyệt 15h"]?.["value"][0] || 0; 
        let SoLuongDatHangDuocDuyet = datas[i]["fields"]["Số lượng đặt hàng được duyệt"]?.["value"][0] || 0;
        let SoLuongDatHangDuBao = datas[i]["fields"]["Số lượng đặt hàng dự báo"]?.["value"][0] || 0;

        let SoLuongDuyet15hSite1 = datas[i]["fields"]["Số lượng duyệt 15h Site 1"] || 0;
        let SoLuongDuyet15hSite2 = datas[i]["fields"]["Số lượng duyệt 15h Site 2"] || 0;
        let SoLuongDuyet15hSite3 = datas[i]["fields"]["Số lượng duyệt 15h Site 3"] || 0;
        let SoLuongDuyet15hSite4 = datas[i]["fields"]["Số lượng duyệt 15h Site 4"] || 0;
        let SoLuongDuyet15hSite5 = datas[i]["fields"]["Số lượng duyệt 15h Site 5"] || 0;

        let SoLuongDatHangDuocDuyetSite1 = datas[i]["fields"]["Số lượng đặt hàng được duyệt Site 1"] || 0;
        let SoLuongDatHangDuocDuyetSite2 = datas[i]["fields"]["Số lượng đặt hàng được duyệt Site 2"] || 0;
        let SoLuongDatHangDuocDuyetSite3 = datas[i]["fields"]["Số lượng đặt hàng được duyệt Site 3"] || 0;
        let SoLuongDatHangDuocDuyetSite4 = datas[i]["fields"]["Số lượng đặt hàng được duyệt Site 4"] || 0;
        let SoLuongDatHangDuocDuyetSite5 = datas[i]["fields"]["Số lượng đặt hàng được duyệt Site 5"] || 0;

        let SoLuongDatHangDuBaoSite1 = datas[i]["fields"]["Số lượng đặt hàng dự báo Site 1"] || 0;
        let SoLuongDatHangDuBaoSite2 = datas[i]["fields"]["Số lượng đặt hàng dự báo Site 2"] || 0;
        let SoLuongDatHangDuBaoSite3 = datas[i]["fields"]["Số lượng đặt hàng dự báo Site 3"] || 0;
        let SoLuongDatHangDuBaoSite4 = datas[i]["fields"]["Số lượng đặt hàng dự báo Site 4"] || 0;
        let SoLuongDatHangDuBaoSite5 = datas[i]["fields"]["Số lượng đặt hàng dự báo Site 5"] || 0;



        let KhoiLuongSanXuat15hSite1 = datas[i]["fields"]["Khối lượng sản xuất 15h Site 1"]?.["value"][0]?.["text"] || "";
        let KhoiLuongSanXuat15hSite2 = datas[i]["fields"]["Khối lượng sản xuất 15h Site 2"]?.["value"][0]?.["text"] || "";
        let KhoiLuongSanXuat15hSite3 = datas[i]["fields"]["Khối lượng sản xuất 15h Site 3"]?.["value"][0]?.["text"] || "";
        let KhoiLuongSanXuat15hSite4 = datas[i]["fields"]["Khối lượng sản xuất 15h Site 4"]?.["value"][0]?.["text"] || "";
        let KhoiLuongSanXuat15hSite5 = datas[i]["fields"]["Khối lượng sản xuất 15h Site 5"]?.["value"][0]?.["text"] || "";

        let KhoiLuongDatHangDuocDuyetSite1 = datas[i]["fields"]["Khối lượng đặt hàng được duyệt Site 1"]?.["value"][0]?.["text"] || "";
        let KhoiLuongDatHangDuocDuyetSite2 = datas[i]["fields"]["Khối lượng đặt hàng được duyệt Site 2"]?.["value"][0]?.["text"] || "";
        let KhoiLuongDatHangDuocDuyetSite3 = datas[i]["fields"]["Khối lượng đặt hàng được duyệt Site 3"]?.["value"][0]?.["text"] || "";
        let KhoiLuongDatHangDuocDuyetSite4 = datas[i]["fields"]["Khối lượng đặt hàng được duyệt Site 4"]?.["value"][0]?.["text"] || "";
        let KhoiLuongDatHangDuocDuyetSite5 = datas[i]["fields"]["Khối lượng đặt hàng được duyệt Site 5"]?.["value"][0]?.["text"] || "";

        let KhoiLuongDatHangDuBaoSite1 = datas[i]["fields"]["Khối lượng đặt hàng dự báo Site 1"]?.["value"][0]?.["text"] || "";
        let KhoiLuongDatHangDuBaoSite2 = datas[i]["fields"]["Khối lượng đặt hàng dự báo Site 2"]?.["value"][0]?.["text"] || "";
        let KhoiLuongDatHangDuBaoSite3 = datas[i]["fields"]["Khối lượng đặt hàng dự báo Site 3"]?.["value"][0]?.["text"] || "";
        let KhoiLuongDatHangDuBaoSite4 = datas[i]["fields"]["Khối lượng đặt hàng dự báo Site 4"]?.["value"][0]?.["text"] || "";
        let KhoiLuongDatHangDuBaoSite5 = datas[i]["fields"]["Khối lượng đặt hàng dự báo Site 5"]?.["value"][0]?.["text"] || "";

        result.push({ 
            Ngay, Thu, KhachHang, SiteAn, Ca, MonAn, CoCauSuatAn, 

            BOMMonAn, NguyenLieuChoKiemThuc15hBuoc2, NguyenLieuChoKiemThucDatHangDuocDuyetBuoc2, NguyenLieuChoKiemThucDatHangDuBaoBuoc2,
            Site1, Site2, Site3, Site4, Site5,
            SoLuongDuyet15h, SoLuongDatHangDuocDuyet, SoLuongDatHangDuBao,
            SoLuongDuyet15hSite1, SoLuongDuyet15hSite2, SoLuongDuyet15hSite3, SoLuongDuyet15hSite4, SoLuongDuyet15hSite5,
            SoLuongDatHangDuocDuyetSite1, SoLuongDatHangDuocDuyetSite2, SoLuongDatHangDuocDuyetSite3, SoLuongDatHangDuocDuyetSite4, SoLuongDatHangDuocDuyetSite5,
            SoLuongDatHangDuBaoSite1, SoLuongDatHangDuBaoSite2, SoLuongDatHangDuBaoSite3, SoLuongDatHangDuBaoSite4, SoLuongDatHangDuBaoSite5,

            KhoiLuongSanXuat15hSite1, KhoiLuongSanXuat15hSite2, KhoiLuongSanXuat15hSite3, KhoiLuongSanXuat15hSite4, KhoiLuongSanXuat15hSite5,
            KhoiLuongDatHangDuocDuyetSite1, KhoiLuongDatHangDuocDuyetSite2, KhoiLuongDatHangDuocDuyetSite3, KhoiLuongDatHangDuocDuyetSite4, KhoiLuongDatHangDuocDuyetSite5,
            KhoiLuongDatHangDuBaoSite1, KhoiLuongDatHangDuBaoSite2, KhoiLuongDatHangDuBaoSite3, KhoiLuongDatHangDuBaoSite4, KhoiLuongDatHangDuBaoSite5,
        });
    }
    return result;
}

const getLSX_SO_PR_Datas = async(TENANT_TOKEN, client_codes, date) => {
    const LSX_SO_PR_URL = `https://open.larksuite.com/open-apis/bitable/v1/apps/${BIZEN_CATERING_BASE_ID}/tables/${LSX_SO_PR_TABLE_ID}/records/search`
    
    let _conditions = [];

    if(client_codes.length > 0) {
        _conditions.push({
            "field_name": "Khách hàng",
            "operator": "contains",
            "value": client_codes,
        });
    }

    if(date) {
        _conditions.push({
            "field_name": "Ngày",
            "operator": "is",
            "value": [
                "ExactDate",
                `${new Date(date).getTime()}`,
            ],
        });
    }
    console.log("---- _conditions", client_codes, _conditions);
    const listLSXSOPRRes = await axios.post(LSX_SO_PR_URL,
        {
            "field_names": [
                "Mã SO", "Mã PR", "Trạng thái", "Ngày", "Bếp", "Khách hàng", "Ca", "Site ăn", 
                "Cơ cấu suất ăn", "Cơ cấu menu", "Món ăn BOM", 
                "Số lượng dự báo", "Khối lượng yêu cầu sản xuất", "Nguyên vật liệu", "Đơn vị tính mua hàng"
            ],
            "filter": {
                "conditions": _conditions,
                "conjunction": "and"
            }
        },
        {
            headers: {
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${TENANT_TOKEN}`
            }
        }
    );  
    // console.log("---- listLSXSOPRRes", listLSXSOPRRes);
    const datas = listLSXSOPRRes.data.data?.items || [];

    let result = [];
    for(let i = 0; i < datas.length; i++) {
        let MaSO = datas[i]["fields"]["Mã SO"]?.["value"][0]?.["text"] || "";
        let MaPR = datas[i]["fields"]["Mã PR"]?.["value"][0]?.["text"] || "";
        let TrangThai =  datas[i]["fields"]["Trạng thái"];
        let Ngay = dateFormat("dd/MM/yyyy", new Date(datas[i]["fields"]["Ngày"]?.["value"][0]));
        let Bep = datas[i]["fields"]["Bếp"]?.["value"][0];
        let KhachHang = datas[i]["fields"]["Khách hàng"]?.["value"][0];
        let Ca = datas[i]["fields"]["Ca"]?.["value"][0];
        let SiteAn = datas[i]["fields"]["Site ăn"]?.["value"][0];
        let CoCauSuatAn =  datas[i]["fields"]["Cơ cấu suất ăn"]?.["value"][0];
        let CoCauMenu =  datas[i]["fields"]["Cơ cấu menu"]?.["value"][0];
        let SoLuongDuBao = datas[i]["fields"]["Số lượng dự báo"]?.["value"][0];
        let KhoiLuongYeuCauSanXuat = datas[i]["fields"]["Khối lượng yêu cầu sản xuất"]?.["value"][0];
        let MonAnBOM = datas[i]["fields"]["Món ăn BOM"]?.["value"][0];
        let NguyenLieu = datas[i]["fields"]["Nguyên vật liệu"]?.["value"][0]?.["text"] || "";
        let DonViTinhMuaHang = datas[i]["fields"]["Đơn vị tính mua hàng"]?.["value"][0];

        result.push({ 
            MaSO, MaPR, TrangThai, Ngay, Bep, KhachHang, SiteAn, Ca, CoCauSuatAn, CoCauMenu,
            MonAnBOM, SoLuongDuBao, KhoiLuongYeuCauSanXuat, NguyenLieu, DonViTinhMuaHang
        });
    }

    return result;
}

const getLSX_PR_Datas = async(TENANT_TOKEN, client_codes, date) => {
    const KHDH_PR_POT_URL = `https://open.larksuite.com/open-apis/bitable/v1/apps/${BIZEN_CATERING_BASE_ID}/tables/${KHDH_PR_POT_TABLE_ID}/records/search`
    
    let _conditions = [];

    if(client_codes.length > 0) {
        _conditions.push({
            "field_name": "Khách hàng",
            "operator": "contains",
            "value": client_codes,
        });
    }

    if(date) {
        _conditions.push({
            "field_name": "Ngày",
            "operator": "is",
            "value": [
                "ExactDate",
                `${new Date(date).getTime()}`,
            ],
        });
    }
    console.log("---- _conditions", client_codes, _conditions);

    const listKHDH_PR_POT_Res = await axios.post(KHDH_PR_POT_URL,
        {
            "field_names": [
                "Mã SO", "Mã PR", "Trạng thái", "Ngày", "Nguyên vật liệu", "Khách hàng", "Site ăn", 
                "Số lượng dự báo", "Khối lượng yêu cầu sản xuất", "Đơn vị tính mua hàng"
            ],
            "filter": {
                "conditions": _conditions,
                "conjunction": "and"
            }
        },
        {
            headers: {
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${TENANT_TOKEN}`
            }
        }
    );  
    console.log("---- listKHDH_PR_POT_Res", listKHDH_PR_POT_Res);
    const datas = listKHDH_PR_POT_Res.data.data?.items || [];

    let result = [];
    for(let i = 0; i < datas.length; i++) {
        let MaSO = datas[i]["fields"]["Mã SO"]?.["value"][0]?.["text"] || "";
        let MaPR = datas[i]["fields"]["Mã PR"]?.["value"][0]?.["text"] || "";
        let TrangThai =  datas[i]["fields"]["Trạng thái"]?.["value"][0];
        let Ngay = dateFormat("dd/MM/yyyy", new Date(datas[i]["fields"]["Ngày"]?.["value"][0])); //datas[i]["fields"]["Ngày"]?.["value"][0];
        let NguyenVatLieu = datas[i]["fields"]["Nguyên vật liệu"]?.["value"][0]?.["text"] || "";
        let KhoiLuongYeuCauSanXuat = datas[i]["fields"]["Khối lượng yêu cầu sản xuất"]?.["value"][0] || "";
        let KhachHang = datas[i]["fields"]["Khách hàng"]?.["value"][0];
        let SiteAn = datas[i]["fields"]["Site ăn"]?.["value"][0];
        let SoLuongDuBao = datas[i]["fields"]["Số lượng dự báo"]?.["value"][0];
        let DonViTinhMuaHang = datas[i]["fields"]["Đơn vị tính mua hàng"]?.["value"][0];

        result.push({ 
            MaSO, MaPR, TrangThai, Ngay, NguyenVatLieu, KhoiLuongYeuCauSanXuat, KhachHang, SiteAn,
            SoLuongDuBao, DonViTinhMuaHang
        });
    }

    return result;
}

const getKHDH_PR_POT_Form3_Datas = async(TENANT_TOKEN, client_codes, date) => {
    const KHDH_PR_POT_URL = `https://open.larksuite.com/open-apis/bitable/v1/apps/${BIZEN_CATERING_BASE_ID}/tables/${KHDH_PR_POT_TABLE_ID}/records/search`
    
    let _conditions = [];

    if(client_codes.length > 0) {
        _conditions.push({
            "field_name": "Khách hàng",
            "operator": "contains",
            "value": client_codes,
        });
    }

    if(date) {
        _conditions.push({
            "field_name": "Ngày",
            "operator": "is",
            "value": [
                "ExactDate",
                `${new Date(date).getTime()}`,
            ],
        });
    }

     _conditions.push({
        "field_name": "Mã POT",
        "operator": "isNotEmpty",
        "value": []
    });

    console.log("---- _conditions", client_codes, _conditions);

    const listKHDH_PR_POT_Res = await axios.post(KHDH_PR_POT_URL,
        {
            "field_names": [
                "Mã POT", "Trạng thái", "Nguyên vật liệu", "Đơn vị tính mua hàng", "Khối lượng yêu cầu sản xuất", "Kho nhận hàng", "Ngày giờ muốn nhận hàng",
                "Mã PR", "Mã SO", "Ngày", "Ca", "Khách hàng",  "Site ăn", "Bếp", "Món ăn", "Chu kỳ đặt hàng"
            ],
            "filter": {
                "conditions": _conditions,
                "conjunction": "and"
            }
        },
        {
            headers: {
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${TENANT_TOKEN}`
            }
        }
    );  
    console.log("---- listKHDH_PR_POT_Res", listKHDH_PR_POT_Res);
    const datas = listKHDH_PR_POT_Res.data.data?.items || [];

    let result = [];
    for(let i = 0; i < datas.length; i++) {
        let MaPOT = datas[i]["fields"]["Mã POT"];
        let TrangThai =  datas[i]["fields"]["Trạng thái"]?.["value"]?.[0];
        let NguyenVatLieu =  datas[i]["fields"]["Nguyên vật liệu"]?.["value"]?.[0]?.["text"] || "";
        let DonViTinhMuaHang = datas[i]["fields"]["Đơn vị tính mua hàng"]?.["value"]?.[0];
        let KhoNhanHang = datas[i]["fields"]["Kho nhận hàng"];
        let KhoiLuongYeuCauSanXuat = datas[i]["fields"]["Khối lượng yêu cầu sản xuất"]?.["value"]?.[0] || "";
        let NgayGioMuonNhanHang =  dateFormat("dd/MM/yyyy", new Date(datas[i]["fields"]["Ngày giờ muốn nhận hàng"]));
        let MaPR = datas[i]["fields"]["Mã PR"]?.["value"]?.[0]?.["text"] || "";
        let MaSO = datas[i]["fields"]["Mã SO"]?.["value"]?.[0]?.["text"] || "";
        let Ngay = dateFormat("dd/MM/yyyy", new Date(datas[i]["fields"]["Ngày"]?.["value"]?.[0]));
        let Ca = datas[i]["fields"]["Ca"]?.["value"]?.[0];
        let KhachHang = datas[i]["fields"]["Khách hàng"]?.["value"]?.[0];
        let SiteAn = datas[i]["fields"]["Site ăn"]?.["value"]?.[0]?.["text"] || "";
        let Bep = datas[i]["fields"]["Bếp"]?.["value"]?.[0];
        let MonAn = datas[i]["fields"]["Món ăn"]?.["value"]?.[0];
        let ChuKyDatHang = datas[i]["fields"]["Chu kỳ đặt hàng"]?.["value"]?.[0] || "";

        result.push({ 
            MaPOT, MaSO, MaPR, TrangThai, Ngay, Ca, NgayGioMuonNhanHang, KhoNhanHang, KhachHang, SiteAn, Bep,
            MonAn, ChuKyDatHang, NguyenVatLieu, DonViTinhMuaHang, KhoiLuongYeuCauSanXuat,
        });
    }

    return result;
}

const get_PO_Form4_Datas = async(TENANT_TOKEN, date) => {
    const KHDH_PR_POT_URL = `https://open.larksuite.com/open-apis/bitable/v1/apps/${BIZEN_CATERING_BASE_ID}/tables/${PO_TABLE_ID}/records/search`
    
    let _conditions = [];

    // if(date) {
    //     _conditions.push({
    //         "field_name": "Ngày",
    //         "operator": "is",
    //         "value": [
    //             "ExactDate",
    //             `${new Date(date).getTime()}`,
    //         ],
    //     });
    // }

     _conditions.push({
        "field_name": "Mã POT",
        "operator": "isNotEmpty",
        "value": []
    });
    console.log("---- _conditions", _conditions);

    const listPO_Form4_Res = await axios.post(KHDH_PR_POT_URL,
        {
            "field_names": [
                "Mã POT", "Nguyên vật liệu", "Đơn vị tính", "Khối lượng yêu cầu sản xuất", "Kỳ đặt hàng", "Chu kỳ đặt hàng", "Tồn kho đầu kỳ",
                "Tồn kho tối thiểu", "Số lượng đặt hàng", "Số lượng đặt hàng được duyệt", 
                "Ngày giờ muốn nhận hàng", "Kho nhận hàng"
            ],
            "filter": {
                "conditions": _conditions,
                "conjunction": "and"
            }
        },
        {
            headers: {
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${TENANT_TOKEN}`
            }
        }
    );  
    console.log("---- listPO_Form4_Res", listPO_Form4_Res);
    const datas = listPO_Form4_Res.data.data?.items || [];

    let result = [];
    for(let i = 0; i < datas.length; i++) {
        let MaPOT = datas[i]["fields"]["Mã POT"];
        let NguyenVatLieu = datas[i]["fields"]["Nguyên vật liệu"]?.["value"]?.[0]?.["text"] || "";
        let DonViTinh = datas[i]["fields"]["Đơn vị tính"]?.["value"]?.[0] || "";
        let KhoiLuongYeuCauSanXuat =  datas[i]["fields"]["Khối lượng yêu cầu sản xuất"]?.["value"]?.[0];
        let KyDatHang =  dateFormat("dd/MM/yyyy", new Date(datas[i]["fields"]["Kỳ đặt hàng"]?.["value"]?.[0]));
        let ChuKyDatHang = datas[i]["fields"]["Chu kỳ đặt hàng"]?.["value"]?.[0];
        let TonKhoDauKy = datas[i]["fields"]["Tồn kho đầu kỳ"];
        let TonKhoToiThieu = datas[i]["fields"]["Tồn kho tối thiểu"];
        let SoLuongDatHang = datas[i]["fields"]["Số lượng đặt hàng"]?.["value"]?.[0];
        let SoLuongDatHangDuocDuyet = datas[i]["fields"]["Số lượng đặt hàng được duyệt"];
        let NgayGioMuonNhanHang = dateFormat("dd/MM/yyyy", new Date(datas[i]["fields"]["Ngày giờ muốn nhận hàng"]?.["value"]?.[0]));
        let KhoNhanHang = datas[i]["fields"]["Kho nhận hàng"]?.["value"]?.[0];

        result.push({ 
            MaPOT,  NguyenVatLieu, DonViTinh, SoLuongDatHang, SoLuongDatHangDuocDuyet, KhoiLuongYeuCauSanXuat, KyDatHang, ChuKyDatHang, TonKhoDauKy, TonKhoToiThieu, 
            NgayGioMuonNhanHang, KhoNhanHang
        });
    }

    return result;
}

const get_MuaHangPO_Form5_Datas = async(TENANT_TOKEN, date) => {
    const PO_FORM5_URL =
            `https://open.larksuite.com/open-apis/bitable/v1/apps/${BIZEN_CATERING_BASE_ID}/tables/${PO_TABLE_ID}/records/search`;

    let _conditions = [];

    _conditions.push({
        "field_name": "Mã POT",
        "operator": "isNotEmpty",
        "value": []
    });

    const listPO_Form5_Res = await axios.post(
        PO_FORM5_URL,
        {
            "field_names": [
                "Mã POT",
                "Khối lượng yêu cầu sản xuất",
                "Kỳ đặt hàng",
                "Số lượng đặt hàng được duyệt",
                "Tên nguyên liệu Misa",
                "Nhóm nguyên liệu Misa",
                "Nhà cung cấp",
                "Đơn giá gần nhất (tham khảo)",
                "Đơn giá được duyệt",
                "Thành tiền",
                "Thuế VAT",
                "Thành tiền sau thuế",
                "Ngày giờ muốn nhận hàng",
                "Kho nhận hàng"
            ],
            "filter": {
                "conditions": _conditions,
                "conjunction": "and"
            }
        },
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${TENANT_TOKEN}`
            }
        }
    );

    const datas =
        listPO_Form5_Res.data.data?.items || [];

    if(datas.length === 0) {
        return [];
    };

    let result = [];

    for(let i = 0; i < datas.length; i++) {
        let MaPOT =
            datas[i]["fields"]["Mã POT"];

        let KhoiLuongYeuCauSanXuat =
            datas[i]["fields"]["Khối lượng yêu cầu sản xuất"]?.["value"]?.[0];

        let KyDatHang =
            dateFormat(
                "dd/MM/yyyy",
                new Date(
                    datas[i]["fields"]["Kỳ đặt hàng"]?.["value"]?.[0]
                )
            );

        let SoLuongDatHangDuocDuyet =
            datas[i]["fields"]["Số lượng đặt hàng được duyệt"];

        let TenNguyenLieuMisa =
            datas[i]["fields"]["Tên nguyên liệu Misa"];

        let NhomNguyenLieuMisa =
            datas[i]["fields"]["Nhóm nguyên liệu Misa"]?.["value"]?.[0];

        let NhaCungCap =
            datas[i]["fields"]["Nhà cung cấp"];

        let DonGiaGanNhatThamKhao =
            datas[i]["fields"]["Đơn giá gần nhất (tham khảo)"]?.["value"]?.[0];

        let DonGiaDuocDuyet =
            datas[i]["fields"]["Đơn giá được duyệt"];

        let ThanhTien =
            datas[i]["fields"]["Thành tiền"]?.["value"]?.[0];

        let ThueVAT =
            datas[i]["fields"]["Thuế VAT"];

        let ThanhTienSauThue =
            datas[i]["fields"]["Thành tiền sau thuế"]?.["value"]?.[0];

    let NgayGioMuonNhanHang =
        dateFormat(
            "dd/MM/yyyy hh:mm",
            new Date(
                datas[i]["fields"]["Ngày giờ muốn nhận hàng"]?.["value"]?.[0]
            )
        );

    let KhoNhanHang =
        datas[i]["fields"]["Kho nhận hàng"]?.["value"]?.[0];

        result.push({
            MaPOT,
            KhoiLuongYeuCauSanXuat,
            KyDatHang,
            SoLuongDatHangDuocDuyet,
            TenNguyenLieuMisa,
            NhomNguyenLieuMisa,
            NhaCungCap,
            DonGiaGanNhatThamKhao,
            DonGiaDuocDuyet,
            ThanhTien,
            ThueVAT,
            ThanhTienSauThue,
            NgayGioMuonNhanHang,
            KhoNhanHang
        });
    }

    return result;
}

// const get_GiaoHang_Form5_Datas = async(TENANT_TOKEN, date) => {
//     const KHDH_PR_POT_URL = `https://open.larksuite.com/open-apis/bitable/v1/apps/${BIZEN_CATERING_BASE_ID}/tables/${GIAO_HANG_FORM5_TABLE_ID}/records/search`
    
//     let _conditions = [];

//     if(date) {
//         _conditions.push({
//             "field_name": "Ngày",
//             "operator": "is",
//             "value": [
//                 "ExactDate",
//                 `${new Date(date).getTime()}`,
//             ],
//         });
//     }

//     console.log("---- _conditions", _conditions);

//     const listGiaoHang_Form5_Res = await axios.post(KHDH_PR_POT_URL,
//         {
//             "field_names": [
//                 "Mã giao hàng", "Trạng thái", "Mã đặt hàng", "Ref POT", "Ngày", "Nhà cung cấp", "Tên hàng",
//                 "Đơn vị tính", "Khối lượng nhập hàng theo đơn", "Khối lượng hàng trả lại", 
//                 "Khối lượng hàng nhận được thực tế", "Kho nhận hàng", "Ngày giờ muốn nhận hàng"
//             ],
//             "filter": {
//                 "conditions": _conditions,
//                 "conjunction": "and"
//             }
//         },
//         {
//             headers: {
//                 "Content-Type": "application/json", 
//                 "Authorization": `Bearer ${TENANT_TOKEN}`
//             }
//         }
//     );  
//     console.log("---- listGiaoHang_Form5_Res", listGiaoHang_Form5_Res);
//     const datas = listGiaoHang_Form5_Res.data.data?.items || [];

//     let result = [];
//     for(let i = 0; i < datas.length; i++) {
//         let MaGiaoHang = datas[i]["fields"]["Mã giao hàng"];
//         let TrangThai = datas[i]["fields"]["Trạng thái"]?.["value"]?.[0] || "";
//         let MaDatHang = datas[i]["fields"]["Mã đặt hàng"]?.[0]?.["text"] || "";
//         let RefPOT =  datas[i]["fields"]["Ref POT"]?.["value"]?.[0];
//         let Ngay =  dateFormat("dd/MM/yyyy", new Date(datas[i]["fields"]["Ngày"]?.["value"]?.[0]));
//         let NhaCungCap = datas[i]["fields"]["Nhà cung cấp"]?.["value"]?.[0] || "";
//         let TenHang = datas[i]["fields"]["Tên hàng"]?.["value"]?.[0] || "";
//         let DonViTinh = datas[i]["fields"]["Đơn vị tính"]?.["value"]?.[0] || "";
//         let KhoiLuongNhapHangTheoDon = datas[i]["fields"]["Khối lượng nhập hàng theo đơn"]?.["value"]?.[0];
//         let KhoiLuongHangTraLai = datas[i]["fields"]["Khối lượng hàng trả lại"];
//         let KhoiLuongHangNhanDuocThucTe = datas[i]["fields"]["Khối lượng hàng nhận được thực tế"]?.["value"]?.[0];
//         let KhoNhanHang = datas[i]["fields"]["Kho nhận hàng"]?.["value"]?.[0];
//         let NgayGioMuonNhanHang = dateFormat("dd/MM/yyyy", new Date(datas[i]["fields"]["Ngày giờ muốn nhận hàng"]?.["value"]?.[0]));

//         result.push({ 
//             MaGiaoHang, TrangThai, MaDatHang, RefPOT, Ngay, NhaCungCap, TenHang, DonViTinh, 
//             KhoiLuongNhapHangTheoDon, KhoiLuongHangTraLai, KhoiLuongHangNhanDuocThucTe,
//             NgayGioMuonNhanHang, KhoNhanHang
//         });
//     }

//     return result;
// }
const get_MuaHangPO_Form6_Datas = async (TENANT_TOKEN, date) => {
    const GIAO_HANG_FORM6_URL =
        `https://open.larksuite.com/open-apis/bitable/v1/apps/${BIZEN_CATERING_BASE_ID}/tables/${GIAO_HANG_FORM5_TABLE_ID}/records/search`;

    let _conditions = [];

    if(date) {
        _conditions.push({
            "field_name": "Ngày",
            "operator": "is",
            "value": [
                "ExactDate",
                `${new Date(date).getTime()}`
            ]
        });
    }

    console.log("---- _conditions Form6", _conditions);

    const listGiaoHang_Form6_Res = await axios.post(
        GIAO_HANG_FORM6_URL,
        {
            "field_names": [
                "Mã giao hàng",
                "Trạng thái",
                "Mã đặt hàng",
                "Ref POT",
                "Ngày",
                "Nhà cung cấp",
                "Tên hàng",
                "Đơn vị tính",
                "Khối lượng nhập hàng theo đơn",
                "Khối lượng hàng trả lại",
                "Khối lượng hàng nhận được thực tế",
                "Kho nhận hàng",
                "Ngày giờ muốn nhận hàng"
            ],
            "filter": {
                "conditions": _conditions,
                "conjunction": "and"
            }
        },
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${TENANT_TOKEN}`
            }
        }
    );

    console.log(
        "---- listGiaoHang_Form6_Res",
        listGiaoHang_Form6_Res
    );

    const datas =
        listGiaoHang_Form6_Res.data.data?.items || [];

    let result = [];

    for(let i = 0; i < datas.length; i++) {

        let MaGiaoHang =
            datas[i]["fields"]["Mã giao hàng"];

        let TrangThai =
            datas[i]["fields"]["Trạng thái"]?.["value"]?.[0] || "";

        let MaDatHang =
            datas[i]["fields"]["Mã đặt hàng"]?.[0]?.["text"] || "";

        let RefPOT =
            datas[i]["fields"]["Ref POT"]?.["value"]?.[0];

        let Ngay =
            dateFormat(
                "dd/MM/yyyy",
                new Date(
                    datas[i]["fields"]["Ngày"]?.["value"]?.[0]
                )
            );

        let TenHang =
            datas[i]["fields"]["Tên hàng"]?.["value"]?.[0] || "";

        let DonViTinh =
            datas[i]["fields"]["Đơn vị tính"]?.["value"]?.[0] || "";

        let KhoiLuongNhapHangTheoDon =
            datas[i]["fields"]["Khối lượng nhập hàng theo đơn"]?.["value"]?.[0];

        let KhoiLuongHangTraLai =
            datas[i]["fields"]["Khối lượng hàng trả lại"];

        let KhoiLuongHangNhanDuocThucTe =
            datas[i]["fields"]["Khối lượng hàng nhận được thực tế"]?.["value"]?.[0];

        let KhoNhanHang =
            datas[i]["fields"]["Kho nhận hàng"]?.["value"]?.[0];

        let NgayGioMuonNhanHang =
            dateFormat(
                "dd/MM/yyyy hh:mm",
                new Date(
                    datas[i]["fields"]["Ngày giờ muốn nhận hàng"]?.["value"]?.[0]
                )
            );

        result.push({
            MaGiaoHang,
            TrangThai,
            MaDatHang,
            RefPOT,
            Ngay,
            TenHang,
            DonViTinh,
            KhoiLuongNhapHangTheoDon,
            KhoiLuongHangTraLai,
            KhoiLuongHangNhanDuocThucTe,
            NgayGioMuonNhanHang,
            KhoNhanHang
        });
    }

    return result;
};
module.exports = (router) => {
    router.post(`/export_excel_file/kiem_thuc_ba_buoc`, authController.isBasicAuthAuthenticated, async(req, res) => {
        try {
            const { kiemThucType, client_code, ca, date } = req.body;
            const TENANT_TOKEN = await getTenantToken();
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader("Content-Disposition", "attachment; filename=" + `${kiemThucType}_${date}_${client_code}.xlsx`);

            if(kiemThucType === "kiem_thuc_buoc_1") {
                const ktBuoc11Datas = await getKTBuoc11Datas(TENANT_TOKEN, client_code, date, ca);
                const ktBuoc12Datas = await getKTBuoc12Datas(TENANT_TOKEN, client_code, date);
                const workbook = await createKTB1ExcelFile({date: dateFormat("dd/MM/yyyy", new Date(date)), ca: ca}, ktBuoc11Datas, ktBuoc12Datas);
                workbook.xlsx.write(res).then(function (data) {
                    res.end();
                });
            } else if(kiemThucType === "kiem_thuc_buoc_23") {
                const ktBuoc23Datas = await getKTBuoc23Datas(TENANT_TOKEN, client_code, date, ca);
                const workbook = await createKTB23ExcelFile({ ca: ca, client_code: client_code, date: dateFormat("dd/MM/yyyy", new Date(date))}, ktBuoc23Datas);
                workbook.xlsx.write(res).then(function (data) {
                    res.end();
                });
            } else if(kiemThucType === "kiem_thuc_buoc_4") {
                const ktBuoc4Datas = await getKTBuoc4Datas(TENANT_TOKEN, client_code, date, ca);
                const workbook = await createKTB4ExcelFile({ ca: ca, client_code: client_code, date: dateFormat("dd/MM/yyyy", new Date(date))}, ktBuoc4Datas);
                workbook.xlsx.write(res).then(function (data) {
                    res.end();
                });
            }
            //console.log("---- ktBuoc11Datas:", ktBuoc11Datas)
        } catch(error) {
            console.log("---- error", error)
            return res.json({
                data: null,
                msg: "export kiem thuc ba buoc excel file failed",
            });
        }
    });

    router.post(`/export_excel_file/lenh_san_xuat`, async(req, res) => {
        try {
            console.log("---- export excel req.body", req.body);
            const { exportType = "duyet", client_codes = [], date = new Date(2026, 8, 4), kitchen, co_cau_menus } = req.body;
            const TENANT_TOKEN = await getTenantToken();
            let lsx2Datas = await getLSX2Datas(TENANT_TOKEN, client_codes, date, kitchen, co_cau_menus);
            // console.log("---- lsx2Datas 1111", lsx2Datas);
            //lsx2Datas = _.sortBy(lsx2Datas, ['Ngay', 'KhachHang', 'Ca', 'CoCauSuatAn']);
            const orderCoCauSuatAn = [
                'Suất cơm', 'Suất nước',  'Suất chay', 'Suất mì sữa', 'Suất cải thiện', 
                'Suất cháo mặn', 'Suất cháo chay', 'Suất SOFA quản lý', 
                'Suất cơm khách 50k', 'Suất cơm khách 70k', 'Suất cơm khách 40k', 
                'Suất ăn sáng 1', 'Suất ăn sáng 2', 'Suất buffet rau', 'Suất buffet', 
                'Suất tráng miệng', 'Suất rau xào/luộc'
            ];
            lsx2Datas = _.sortBy(lsx2Datas, ['Ngay', 'KhachHang', 'Ca', (item) => orderCoCauSuatAn.indexOf(item.CoCauSuatAn)]);
            console.log("---- lsx2Datas", lsx2Datas);
            const workbook = await createLSX2ExcelFile({exportType, date: dateFormat("dd/MM/yyyy", new Date(date)), kitchen: kitchen} , lsx2Datas);
            workbook.xlsx.write(res).then(function (data) {
                res.end();
            });
            // return res.json({
            //     data: null,
            //     msg: "export lenh san xuat excel file success",
            // });
        } catch(error) {
            console.log("---- error", error)
            return res.json({
                data: null,
                msg: `export lenh san xuat excel file failed for exportType`,
            });
        }
    });
    router.post(`/larksuite/giay_di_cho`, async(req, res) => {
    try {
        console.log("---- larksuite/giay_di_cho req.body", req.body);

        const { client_code, date, ca, site } = req.body;
        const TENANT_TOKEN = await getTenantToken();

        const ktBuoc11Datas = await getKTBuoc11Datas(
            TENANT_TOKEN,
            client_code,
            date,
            ca,
            site
        );

        console.log("---- ktBuoc11Datas", ktBuoc11Datas);

        return res.json({
            data: ktBuoc11Datas,
            error: null
        });
    } catch(error) {
        console.log("---- larksuite/giay_di_cho error", error);

        return res.json({
            data: null,
            error: error
        });
    }
});
    router.post(`/export_excel_file/giay_di_cho`, async(req, res) => {
        try {
            console.log("---- export excel req.body", req.body);
            const { client_code, date, kitchen, ca, site } = req.body;
            const TENANT_TOKEN = await getTenantToken();
            let ktBuoc11Datas = await getKTBuoc11Datas(TENANT_TOKEN, client_code, date, ca, site);
            console.log("---- ktBuoc11Datas", ktBuoc11Datas);
            const orderCoCauSuatAn = [
                'Suất cơm', 'Suất nước',  'Suất chay', 'Suất mì sữa', 'Suất cải thiện', 
                'Suất cháo mặn', 'Suất cháo chay', 'Suất SOFA quản lý', 
                'Suất cơm khách 50k', 'Suất cơm khách 70k', 'Suất cơm khách 40k', 
                'Suất ăn sáng 1', 'Suất ăn sáng 2', 'Suất buffet rau', 'Suất buffet', 
                'Suất tráng miệng', 'Suất rau xào/luộc'
            ];
            ktBuoc11Datas = _.sortBy(ktBuoc11Datas, ['Ngay', 'KhachHang',(item) => orderCoCauSuatAn.indexOf(item.CoCauSuatAn)], 'Ca', 'SiteAn');
            const workbook = await createGDCExcelFile({client_code: client_code, date: dateFormat("dd/MM/yyyy", new Date(date)), kitchen: kitchen} , ktBuoc11Datas);
            workbook.xlsx.write(res).then(function (data) {
                res.end();
            });
            // return res.json({
            //     data: null,
            //     msg: "export giay di cho excel file success",
            // });
        } catch(error) {
            console.log("---- error", error)
            return res.json({
                data: null,
                msg: "export giay di cho excel file failed",
            });
        }
    });

    router.post(`/export_excel_file/mua_hang_po`, async(req, res) => {
        try {
            const { po_type, client_codes = [], date } = req.body;
            console.log('---- po_type', po_type);
            const TENANT_TOKEN = await getTenantToken();
            
            switch(po_type) {
                case "Form mẫu 1 (SO)":
                    let lsx_SO_PR_datas = await getLSX_SO_PR_Datas(TENANT_TOKEN, client_codes, date);
                    //console.log("---- lsx_SO_PR_datas", lsx_SO_PR_datas);
                    const workbookForm1 = await createSO_PRForm1ExcelFile({
                        client_codes: client_codes, 
                        date: dateFormat("dd/MM/yyyy", new Date(date))
                    }, lsx_SO_PR_datas);
                    workbookForm1.xlsx.write(res).then(function (data) {
                        res.end();
                    });
                    break;
                case "Form mẫu 2 (PR)":
                    let lsx_PR_datas = await getLSX_PR_Datas(TENANT_TOKEN, client_codes, date);
                    lsx_PR_datas = _.sortBy(lsx_PR_datas, ['NguyenVatLieu']);
                    // console.log("---- sorted lsx_PR_datas", lsx_PR_datas);
                    const workbookForm2 = await createPRForm2ExcelFile({
                        client_codes: client_codes, 
                        date: dateFormat("dd/MM/yyyy", new Date(date))
                    }, lsx_PR_datas);
                    workbookForm2.xlsx.write(res).then(function (data) {
                        res.end();
                    });
                    break;
                case "Form mẫu 3 (KHDH PR POT)":
                    let khdh_pr_pot_form_3_datas = await getKHDH_PR_POT_Form3_Datas(TENANT_TOKEN, client_codes, date);
                    console.log("---- khdh_pr_pot_form_3_datas", khdh_pr_pot_form_3_datas);
                    const workbookForm3 = await createKHDH_PR_POT_Form3_ExcelFile({
                        client_codes: client_codes, 
                        date: dateFormat("dd/MM/yyyy", new Date(date))
                    }, khdh_pr_pot_form_3_datas);
                    workbookForm3.xlsx.write(res).then(function (data) {
                        res.end();
                    });
                    break;
                case "Form mẫu 4 (PO) Cân đối tồn kho":
                    let PO_Form4_datas = await get_PO_Form4_Datas(TENANT_TOKEN, date);
                    console.log("---- PO_Form4_datas", PO_Form4_datas);
                    const workbookForm4 = await createPO_Form4_ExcelFile({
                        client_codes: client_codes, 
                        date: dateFormat("dd/MM/yyyy", new Date(date))
                    }, PO_Form4_datas);
                    workbookForm4.xlsx.write(res).then(function (data) {
                        res.end();
                    });
                    break;
                case "Form mẫu 5 (PO) Nhà cung cấp":
    let PO_Form5_datas = await get_MuaHangPO_Form5_Datas(
        TENANT_TOKEN,
        date
    );

    console.log("---- PO_Form5_datas", PO_Form5_datas);

    // const workbookForm5 = await createGiaoHang_Form5_ExcelFile({
    //     client_codes: client_codes, 
    //     date: dateFormat("dd/MM/yyyy", new Date(date))
    // }, PO_Form5_datas);
    // workbookForm5.xlsx.write(res).then(function (data) {
    //     res.end();
    // });
    break;


case "Form mẫu 6 (PO) Đặt hàng":
    let PO_Form6_datas = await get_MuaHangPO_Form5_Datas(
        TENANT_TOKEN,
        date
    );

    console.log("---- PO_Form6_datas", PO_Form6_datas);

    const workbookForm6 = await createForm6POExcelFile(
        PO_Form6_datas
    );

    workbookForm6.xlsx.write(res).then(function (data) {
        res.end();
    });

    break;


default:
    throw new Error("Unknown PO type");
            }

            // // *** Form 5
            // let PO_Form5_datas = await get_GiaoHang_Form5_Datas(TENANT_TOKEN, date);
            // console.log("---- PO_Form5_datas", PO_Form5_datas);

            //console.log("---- lsx_PR_datas", lsx_PR_datas);
            // workbook.xlsx.write(res).then(function (data) {
            //     res.end();
            // });
            // const workbook = await createForm2PRFile();
            // return res.json({
            //     data: null,
            //     msg: "export mua hang po excel file success",
            // });
        } catch(error) {
            console.log("---- error", error)
            return res.json({
                data: null,
                msg: "export mua hang po excel file failed",
            });
        }
    });
}