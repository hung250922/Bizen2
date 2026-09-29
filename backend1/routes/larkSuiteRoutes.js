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

    router.post(`/larksuite/lenh_san_xuat`, async (req, res) => {
        try {
            const TENANT_TOKEN = await getTenantToken();
            console.log("---- TENANT_TOKEN", TENANT_TOKEN, (new Date()).getTime())
            const THUC_DON_TUAN_URL = `https://open.larksuite.com/open-apis/bitable/v1/apps/${BIZEN_CATERING_BASE_ID}/tables/${THUC_DON_TUAN_TABLE_ID}/records/search`
            const listClientRes = await axios.post(THUC_DON_TUAN_URL,
                {
                    "field_names": [
                        "Ngày", "Thứ", "Khách hàng", "Site ăn", "Ca", "Món ăn BOM", "Cơ cấu suất ăn",
                        "Số lượng cô Nga duyệt đặt hàng", "Nguyên liệu cho Kiểm thực bước 2", "BOM món ăn"
                    ],
                    "filter": {
                        "conditions": [
                            {
                                "field_name": "Khách hàng",
                                "operator": "is",
                                "value": ["ODSV"]
                            },
                            {
                                "field_name": "Ngày",
                                "operator": "is",
                                "value": [
                                    "ExactDate",
                                    `${(new Date()).getTime()}`
                                ],
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
            
            //console.log("__ listClietnRes", listClientRes.data)

            const datas = listClientRes.data.data?.items || [];
            if(datas.length === 0) {
                return res.json({
                    data: [],
                    msg: "export lenh san xuat excel file success",
                })
            }

            let result = [];
            for(let i = 0; i < datas.length; i++) {
                let Ngay = datas[i]["fields"]["Ngày"];
                let Thu = datas[i]["fields"]["Thứ"]?.["value"][0]?.["text"] || "";
                let KhachHang =  datas[i]["fields"]["Khách hàng"];
                let SiteAn = Array.isArray(datas[i]["fields"]["Site ăn"]) ? datas[i]["fields"]["Site ăn"].join(", ") : "";
                let Ca = datas[i]["fields"]["Ca"];
                let MonAn = datas[i]["fields"]["Món ăn BOM"];
                let CoCauSuatAn =  datas[i]["fields"]["Cơ cấu suất ăn"];
                let SoLuongCoNgaDuyetDatHang = datas[i]["fields"]["Số lượng cô Nga duyệt đặt hàng"]?.["value"][0] || 0;
                let NguyenLieuChoKiemThucBuoc2 = datas[i]["fields"]["Nguyên liệu cho Kiểm thực bước 2"]?.["value"][0]?.["text"] || "";
                let BOMMonAn = datas[i]["fields"]["BOM món ăn"]?.["value"][0]?.["text"] || "";

                result.push({ 
                    Ngay, Thu, KhachHang, SiteAn, Ca, MonAn, CoCauSuatAn, 
                    SoLuongCoNgaDuyetDatHang, NguyenLieuChoKiemThucBuoc2, BOMMonAn 
                });
            }

            //console.log("---- result:", result)
            return res.json({ data: result, error: null });
        } catch(err) {
            console.log("-- error", err)
            return res.json({ data: null, error: err});
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