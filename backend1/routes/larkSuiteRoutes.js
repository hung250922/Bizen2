require("dotenv").config();
const { Op } = require('sequelize');
const lark = require("@larksuiteoapi/node-sdk");
const axios = require("axios");
var authController = require('../middleware/auth');
const { getTenantToken } = require("../controllers/larksuite")
const BIZEN_APP_ID = "cli_a95901afed389e15";
const BIZEN_APP_SECRET = "TnkH3GhyfswQszaT17rG8hYLWt2H4Ctj";
// https://open.larksuite.com/app ---> Xem App của Bizen
const BIZEN_CATERING_BASE_ID = "TO6Zw7lxJi1hFtkcCetjcct5pNc";
const DANH_SACH_KHACH_HANG_TABLE_ID = "tbl0d3wT2CgR17j3";
const THUC_DON_TUAN_TABLE_ID = "tblcesBeBMwmAFFn";
const BAO_SO_LUONG_KHACH_HANG_TABLE_ID = "tbl0lvShN6BoqH4k";
const BAO_SO_LUONG_QUAN_LY_SITE_TABLE_ID = "tbleq64gHk5gPEAr";
const DANH_SACH_SITE_TABLE_ID = "tblvIV6dmmAQqqKt";
const DANH_SACH_CO_CAU_MENU_TABLE_ID = "tblxOhqqWTK7uP2U";

module.exports = (router) => {
    router.post(`/larksuite/list_client`, async (req, res) => {
        try {
            console.log("--- larksuite/list-client  ")
            const TENANT_TOKEN = await getTenantToken();
            const LIST_CLIENT_URL = `https://open.larksuite.com/open-apis/bitable/v1/apps/${BIZEN_CATERING_BASE_ID}/tables/${DANH_SACH_KHACH_HANG_TABLE_ID}/records/search`
            const listClientRes = await axios.post(LIST_CLIENT_URL, 
                {
                    "field_names": ["Mã khách hàng", "Tên khách hàng"]
                },
                {
                    headers: {
                        "Content-Type": "application/json", 
                        "Authorization": `Bearer ${TENANT_TOKEN}`
                    }
                }
            );  
            
            const datas = listClientRes.data.data.items;
            let result = [];
            for(let i = 0; i < datas.length; i++) {
                let MaKhachHang = datas[i]["fields"]["Mã khách hàng"];
                result.push(MaKhachHang);
            }

            console.log("---- listClientRes", listClientRes.data)

            return res.json({ data: result, error: null });
        } catch(err) {
            console.log("-- error", err)
            return res.json({ data: null, error: err});
        }
    });

    router.post(`/larksuite/thuc_don_tuan`, async (req, res) => {
        try {
            console.log("--- larksuite/thuc_don_tuan", req.body)
            const TENANT_TOKEN = await getTenantToken();
            const THUC_DON_TUAN_URL = `https://open.larksuite.com/open-apis/bitable/v1/apps/${BIZEN_CATERING_BASE_ID}/tables/${THUC_DON_TUAN_TABLE_ID}/records/search`
            const listClientRes = await axios.post(THUC_DON_TUAN_URL,
                {
                    "field_names": [
                        "Ngày", "Thứ", "Khách hàng", "Site ăn", "Ca", "Món ăn menu", 
                        "Cơ cấu sản phẩm", "Cơ cấu suất ăn"
                    ],
                    "filter": {
                        "conditions": [
                            {
                                "field_name": "Khách hàng",
                                "operator": "is",
                                "value": [req.body.client_code]
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

            console.log("---- listClientRes", listClientRes.data)
            
            const datas = listClientRes.data.data.items;
            let result = [];
            for(let i = 0; i < datas.length; i++) {
                let Ngay = datas[i]["fields"]["Ngày"];
                let Thu = datas[i]["fields"]["Thứ"]?.["value"]?.[0]?.["text"] || "";
                let KhachHang =  datas[i]["fields"]["Khách hàng"];
                let SiteAn = Array.isArray(datas[i]["fields"]["Site ăn"]) ? datas[i]["fields"]["Site ăn"].join(", ") : "";
                let Ca = datas[i]["fields"]["Ca"];
                let MonAn = datas[i]["fields"]["Món ăn menu"]?.["value"]?.[0];
                let CoCauSuatAn =  datas[i]["fields"]["Cơ cấu suất ăn"];
                let CoCauSanPham = datas[i]["fields"]["Cơ cấu sản phẩm"];

                result.push({ Ngay, Thu, KhachHang, SiteAn, Ca, CoCauSuatAn, MonAn, CoCauSanPham });
            }

            console.log("---- result", result);
            // console.log("---- listClientRes", listClientRes.data)

            return res.json({ data: result, error: null });
        } catch(err) {
            console.log("-- error", err)
            return res.json({ data: null, error: err});
        }
    });

    router.post(`/larksuite/bao_so_luong_khach_hang`, async (req, res) => {
        try {
            console.log("--- bao_so_luong_khach_hang", req.body)
            const TENANT_TOKEN = await getTenantToken();

            if(TENANT_TOKEN) {
                const CREATE_RECORDS_URL = `https://open.larksuite.com/open-apis/bitable/v1/apps/${BIZEN_CATERING_BASE_ID}/tables/${BAO_SO_LUONG_KHACH_HANG_TABLE_ID}/records/batch_create`
                const createRecordsRes = await axios.post(CREATE_RECORDS_URL, 
                    {
                        records: req.body.data 
                    },
                    {
                        headers: {
                            "Content-Type": "application/json", 
                            "Authorization": `Bearer ${TENANT_TOKEN}`
                        }
                    }
                );

                console.log("---- createRecordsRes", createRecordsRes.data)

                if(createRecordsRes.data.code === 0) {
                    console.log(createRecordsRes.data.msg);
                    return res.json({ data: "Thêm thành công " + req.body.data.length + " bản ghi", error: null });
                }
            } else {
                console.log("--- ERROR:", createRecordsRes.data)
                return res.json({ data: null, error: "Lỗi: " + JSON.stringify(createRecordsRes.data) });
            }
        } catch(err) {
            console.log("-- error", err)
            return res.json({ data: null, error: err});
        }
    });

    router.post(`/larksuite/bao_so_luong_quan_ly_site`, async (req, res) => {
        try {
            console.log("--- bao_so_luong_quan_ly_site", req.body)
            //return res.json({ data: "Thêm thành công " + req.body.name, error: null });
            const TENANT_TOKEN = await getTenantToken();

            if(TENANT_TOKEN) {
                const CREATE_RECORDS_URL = `https://open.larksuite.com/open-apis/bitable/v1/apps/${BIZEN_CATERING_BASE_ID}/tables/${BAO_SO_LUONG_QUAN_LY_SITE_TABLE_ID}/records/batch_create`
                const createRecordsRes = await axios.post(CREATE_RECORDS_URL, 
                    {
                        records: req.body.data 
                    },
                    {
                        headers: {
                            "Content-Type": "application/json", 
                            "Authorization": `Bearer ${TENANT_TOKEN}`
                        }
                    }
                );

                console.log("---- createRecordsRes", createRecordsRes.data)

                if(createRecordsRes.data.code === 0) {
                    console.log(createRecordsRes.data.msg);
                    return res.json({ data: "Thêm thành công " + req.body.data.length + " bản ghi", error: null });
                }
            } else {
                console.log("--- ERROR:", createRecordsRes.data)
                return res.json({ data: null, error: "Lỗi: " + JSON.stringify(createRecordsRes.data) });
            }
        } catch(err) {
            console.log("-- error", err)
            return res.json({ data: null, error: err});
        }
    });
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
    
   router.post(`/larksuite/lenh_san_xuat`, async (req, res) => {
    try {
        console.log("---- lenh_san_xuat req.body", req.body);

        const {
            client_codes = [],
            date,
            kitchen,
            co_cau_menus = []
        } = req.body;

        const TENANT_TOKEN = await getTenantToken();

        const lsx2Datas = await getLSX2Datas(
            TENANT_TOKEN,
            client_codes,
            date,
            kitchen,
            co_cau_menus
        );

        console.log("---- lsx2Datas", lsx2Datas);

        return res.json({
            data: lsx2Datas,
            error: null
        });
    } catch (err) {
        console.log("-- lenh_san_xuat error", err);

        return res.json({
            data: null,
            error: err
        });
    }
});

    router.post(`/larksuite/list_co_cau_menu`, async (req, res) => {
        try {
            console.log("--- larksuite/list_co_cau_menu  ")
            const TENANT_TOKEN = await getTenantToken();
            const LIST_CO_CAU_MENU_URL = `https://open.larksuite.com/open-apis/bitable/v1/apps/${BIZEN_CATERING_BASE_ID}/tables/${DANH_SACH_CO_CAU_MENU_TABLE_ID}/records/search`
            const listCCMNRes = await axios.post(LIST_CO_CAU_MENU_URL, 
                {
                    "field_names": ["Cơ cấu menu"]
                },
                {
                    headers: {
                        "Content-Type": "application/json", 
                        "Authorization": `Bearer ${TENANT_TOKEN}`
                    }
                }
            );  
            
            const datas = listCCMNRes.data.data.items;
            let result = [];
            for(let i = 0; i < datas.length; i++) {
                let CoCauMenu = datas[i]["fields"]["Cơ cấu menu"];
                result.push(CoCauMenu);
            }

            console.log("---- listCCMNRes", listCCMNRes.data)

            return res.json({ data: result, error: null });
        } catch(err) {
            console.log("-- error", err)
            return res.json({ data: null, error: err});
        }
    });

    router.post(`/larksuite/list_site`, async (req, res) => {
        try {
            console.log("--- larksuite/list_site  ")
            const TENANT_TOKEN = await getTenantToken();
            const LIST_SITE_URL = `https://open.larksuite.com/open-apis/bitable/v1/apps/${BIZEN_CATERING_BASE_ID}/tables/${DANH_SACH_SITE_TABLE_ID}/records/search`
            const listSiteRes = await axios.post(LIST_SITE_URL, 
                {
                    "field_names": ["Mã site", "Mã khách hàng"]
                },
                {
                    headers: {
                        "Content-Type": "application/json", 
                        "Authorization": `Bearer ${TENANT_TOKEN}`
                    }
                }
            );  
            
            const datas = listSiteRes.data.data.items;
            let result = [];
            for(let i = 0; i < datas.length; i++) {
                let MaSite = datas[i]["fields"]["Mã site"];
                let MaKhachHang = datas[i]["fields"]["Mã khách hàng"];
                result.push({ MaSite, MaKhachHang });
            }

            console.log("---- result", result)

            return res.json({ data: result, error: null });
        } catch(err) {
            console.log("-- error", err)
            return res.json({ data: null, error: err});
        }
    });
}