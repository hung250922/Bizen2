// export const GOOGLE_RECAPTCHA_SITE_KEY      = "6LdjWSgqAAAAACPsLSjrrkhn0tA36r2yHONXpBsr";
// export const GOOGLE_RECAPTCHA_SECRET_KEY    = "6LdjWSgqAAAAAAiz7fbQYxhsII-ZIuFzixHKbx3g";

export const GOOGLE_RECAPTCHA_SITE_KEY      = "6Ldf4ygqAAAAAPRc6RUamfPyvSMIZqio4t7Z7pDw";
export const GOOGLE_RECAPTCHA_SECRET_KEY    = "6Ldf4ygqAAAAACazQlEP_kJCJ45AwLg5SMfy8LMQ";

export const GOOGLE_OAUTH_CLIENT_ID         = "3027197740-p7hd0enan1amcnl95p9nho835t0pkeka.apps.googleusercontent.com";
export const GOOGLE_OAUTH_CLIENT_SECRET     = "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";

export const FACEBOOK_OAUTH_APP_ID          = "550956477495838";
export const COMPANY_LOGO                   = "bizen_logo.jpg";

//export const URL_BACKEND = 'http://localhost:4110';
export const URL_BACKEND = 'http://157.66.100.67:4130';
export const SUB_URL_BAO_SO_LUONG_KHACH_HANG = '/bao-so-luong-khach-hang';
export const SUB_URL_BAO_SO_LUONG_QUAN_LY_SITE = '/bao-so-luong-quan-ly-site';
export const SUB_URL_MON_AN_THEO_MUA       = '/mon-an-theo-mua';
export const SUB_URL_CAU_HINH_TINH_DIEM    = '/cau-hinh-tinh-diem';
export const SUB_URL_BOM_MON_AN            = '/bom-mon-an';
export const SUB_URL_DON_GIA_NGUYEN_VAT_LIEU = '/don-gia-nguyen-vat-lieu';
export const SUB_URL_DON_GIA_SAN_PHAM        = '/don-gia-san-pham';
export const SUB_URL_PHOI_HOP_COMBO         = '/phoi-hop-combo';
export const SUB_URL_LENH_SAN_XUAT          = '/lenh-san-xuat';
export const SUB_URL_KIEM_THUC_BA_BUOC      = '/kiem-thuc-ba-buoc';
export const SUB_URL_GIAY_DI_CHO            = '/giay-di-cho';
export const SUB_URL_MUA_HANG_PO            = '/mua-hang-po';

export const API_SUB_URL_AUTHENTICATE       = '/api/authenticate';
export const API_SUB_URL_USERS              = '/api/users';
export const API_SUB_URL_USER_LOG           = '/user_logs';
export const API_SUB_URL_SYSTEM_SETTING        = '/system_settings';

export const API_SUB_URL_PAYMENT    = '/payments';
export const API_SUB_URL_EXPORT_CSV_FILE       = '/export_csv_file';
export const API_SUB_URL_EXPORT_EXCEL_FILE     = '/export_excel_file';
export const API_SUB_URL_EMAIL       = '/emails';

export const NORMAL_MAX_AGE = 30*60;
export const LOGIN_MAX_AGE = 24*60*60;
export const PATIENT_INFORMATION_MAX_AGE = 1*60*60;
export const SELECTED_CLINIC_MAX_AGE = 30*24*60*60;

export const ROLES = {
    "admin": "Quyền Admin (thao tác thêm, sửa, xoá dữ liệu)",
    "normal": "Quyền User (chỉ được xem)"
};

export const ERROR_CODES = {
    "ERR_NETWORK": "Mất kết nối tới server!"
}

export const PAGINATION_LIST = [
    5, 10, 15, 25, 50, 100
]

export const CHAM_CHI_NHANH = {
    "CKB - CN1 GADL":	"Đà Lạt",
    "CKB - CN2 KHB":	"Đà Lạt",
    "CKB - CN3 PXL":	"HCM",
    "CKB - CN4 VINH":	"Nha Trang",
    "CKB - CN5 GODL":	"Đà Lạt",
    "CKB - CN6 TĐ":	    "HCM",
    "CKB - CN7 GC":	    "Nha Trang",
    "CKB - CN8 CLD":	"HCM",
}

export const AUTHORIZE_TYPES = [
    { label: "Admin", value: "admin" }, 
    { label: "Dashboard", value: "dashboard" }, 
    { label: "Import dữ liệu", value: "import_data" }, 
    { label: "Tất cả các trang", value: "all" }
];
export const IMPORT_FILE_TYPES = [
    { label: "Fabi 05", value: "fabi_05" }, 
    { label: "Vietcombank", value: "vietcombank" }, 
    { label: "Momo", value: "momo" }, 
    { label: "Vnpay", value: "vnpay" }, 
    { label: "Shopee", value: "shopee" }, 
    { label: "Grab", value: "grab" }, 
    { label: "Befood", value: "befood" }, 
];
export const IS_AUTHORIZED = [{ "label": "Đã xác thực", "value": true }, { "label": "Chưa xác thực", "value": false }];

export const CO_CAU_SUAT_AN_SAMPLE = {
    "ZAMIL": {
        "CA 1" : ["Món mặn", "Món mặn", "Món canh", "Món rau", "Món tráng miệng"],
    },
    "WACOAL": {
        "CA 1" : ["Món mặn", "Món mặn", "Món canh", "Món rau", "Món tráng miệng"],
        "CA 2" : ["Món nước"],
    },
}

export const NGAY_AN_BY_CLIENTS = {
    "ZAMIL": ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"],
    "WACOAL": ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"],
}

export const MENU_DATA_WEEKS = {
    "ZAMIL": {
        "-4": {
            "Thứ 2": ["Cá lóc kho tiêu", "Thịt xào rau củ"],  
            "Thứ 3": ["Cotlet ram", "Cá cơm rim tỏi ớt"], 
            "Thứ 4": ["Cánh gà chiên", "Thịt kho củ cải"],
            "Thứ 5": ["Vịt kho sả ớt", "Tôm rim hành size 50"],
            "Thứ 6": ["Cá nục kho măng", "Thịt chiên"],
            "Thứ 7": ["Gà kho lá chanh", "Trứng kho tàu"], 
            "Chủ nhật": ["Bò xào sả ớt", "Đậu hũ dồn thịt"],
        },
        "-3": {
            "Thứ 2": ["Thịt heo kho dưa", "Cá chiên + mắm xoài"],
            "Thứ 3": ["Tép ram hành", "Thịt xá xíu"],
            "Thứ 4": ["Bò xào hành cần", "Trứng cuộn rau củ"],
            "Thứ 5": ["Gà xối mỡ", "Cá thu nhật kho cà"],
            "Thứ 6": ["Thịt kho trứng", "Tôm cháy tỏi size 50"],
            "Thứ 7": ["Chả cả thì là", "Thịt kho tiêu"],
            "Chủ nhật": ["Gà kho gừng", "Xíu mại sốt cà"],
        },
        "-2": {
            "Thứ 2": ["Bò xào rau củ", "Đậu hũ dồn thịt"], 
            "Thứ 3": ["Cotlet ram", "Cá hường chiên sả"],
            "Thứ 4": ["Đùi gà chiên", "Chả lụa rim mắm"],
            "Thứ 5": ["Thịt kho ruốc sả", "Tôm cháy tỏi size 50"],
            "Thứ 6": ["Vịt kho gừng", "Thịt xào đậu ve"],
            "Thứ 7": ["Gà kho sả ớt", "Cá basa kho tiêu"],
            "Chủ nhật": ["Thịt kho măng", "Trứng gà luộc"],
        },
        "-1": {
            "Thứ 2": ["Cá diêu hồng kho cay", "Chả thịt lá lốt"],
            "Thứ 3": ["Gà kho sả", "Tôm cháy tỏi size 50"],
            "Thứ 4": ["Thịt kho củ cải", "Cá cơm rim mè"],
            "Thứ 5": ["Bò xào rau củ", "Trứng kho tàu"],
            "Thứ 6": ["Thịt kho đậu hũ", "Cá chiên mắm xoài"],
            "Thứ 7": ["Cotlet ram", "trứng ốp la"],
            "Chủ nhật": ["Cá lóc kho tiêu", "Gà chiên nước mắm"],
        },
    },
    "SOFA": {
        "05/01/2026 - 11/01/2026": {
            "Thứ 2": ["Thịt kho trứng cút", "Cá chiên + mắm xoài", "Canh rau dền", "Giá hẹ xào"],
        }
    }
}

export const DANH_MUC_MON_AN = [
        { "name":"Cá lóc kho tiêu", "protein": "Cá", "phuongPhapCheBien": "kho" }, 
        { "name": "Thịt xào rau củ", "protein": "Thịt", "phuongPhapCheBien": "xào" },
        { "name": "Cotlet ram", "protein": "Thịt", "phuongPhapCheBien": "ram" },
        { "name": "Cá cơm rim tỏi ớt", "protein": "Cá", "phuongPhapCheBien": "rim" },
        { "name": "Cánh gà chiên", "protein": "Gà", "phuongPhapCheBien": "chiên" },
        { "name": "Thịt kho củ cải", "protein": "Thịt", "phuongPhapCheBien": "kho" },
        { "name": "Vịt kho sả ớt", "protein": "Vịt", "phuongPhapCheBien": "kho" },
        { "name": "Tôm rim hành size 50", "protein": "Tôm", "phuongPhapCheBien": "rim" },
        { "name": "Cá nục kho măng", "protein": "Cá", "phuongPhapCheBien": "kho" },
        { "name": "Thịt chiên", "protein": "Thịt", "phuongPhapCheBien": "chiên" },
        { "name": "Gà kho lá chanh", "protein": "Gà", "phuongPhapCheBien": "kho" },
        { "name": "Trứng kho tàu", "protein": "Trứng", "phuongPhapCheBien": "kho" },
        { "name": "Bò xào sả ớt", "protein": "Bò", "phuongPhapCheBien": "xào" },
        { "name": "Đậu hũ dồn thịt", "protein": "Đậu hũ", "phuongPhapCheBien": "dồn" },
        { "name": "Thịt heo kho dưa", "protein": "Thịt", "phuongPhapCheBien": "kho" },
        { "name": "Cá chiên mắm xoài", "protein": "Cá", "phuongPhapCheBien": "chiên" },
        { "name": "Tép ram hành", "protein": "Tép", "phuongPhapCheBien": "ram" },
        { "name": "Thịt xá xíu", "protein": "Thịt", "phuongPhapCheBien": "xá xíu" },
        { "name": "Bò xào hành cần", "protein": "Bò", "phuongPhapCheBien": "xào" },
        { "name": "Trứng cuộn rau củ", "protein": "Trứng", "phuongPhapCheBien": "cuộn" },
        { "name": "Gà xối mỡ", "protein": "Gà", "phuongPhapCheBien": "xối mỡ" },
        { "name": "Cá thu nhật kho cà", "protein": "Cá", "phuongPhapCheBien": "kho" },
        { "name": "Thịt kho trứng", "protein": "Thịt", "phuongPhapCheBien": "kho" },
        { "name": "Tôm cháy tỏi size 50", "protein": "Tôm", "phuongPhapCheBien": "cháy tỏi" },
        { "name": "Chả cả thì là", "protein": "Chả cá", "phuongPhapCheBien": "thì là" },
        { "name": "Thịt kho tiêu", "protein": "Thịt", "phuongPhapCheBien": "kho" },
        { "name": "Gà kho gừng", "protein": "Gà", "phuongPhapCheBien": "kho" },
        { "name": "Xíu mại sốt cà", "protein": "Thịt", "phuongPhapCheBien": "sốt" },
        { "name": "Cá hường chiên sả", "protein": "Cá", "phuongPhapCheBien": "chiên" },
        { "name": "Đùi gà chiên", "protein": "Gà", "phuongPhapCheBien": "chiên" },
        { "name": "Chả lụa rim mắm", "protein": "Chả lụa", "phuongPhapCheBien": "rim" },
        { "name": "Thịt kho ruốc sả", "protein": "Thịt", "phuongPhapCheBien": "kho" },
        { "name": "Vịt kho gừng", "protein": "Vịt", "phuongPhapCheBien": "kho" },
        { "name": "Thịt xào đậu ve", "protein": "Thịt", "phuongPhapCheBien": "xào" },
        { "name": "Gà kho sả ớt", "protein": "Gà", "phuongPhapCheBien": "kho" },
        { "name": "Cá basa kho tiêu", "protein": "Cá", "phuongPhapCheBien": "kho" },
        { "name": "Thịt kho măng", "protein": "Thịt", "phuongPhapCheBien": "kho" },
        { "name": "Trứng gà luộc", "protein": "Trứng", "phuongPhapCheBien": "luộc" },
        { "name": "Cá diêu hồng kho cay", "protein": "Cá", "phuongPhapCheBien": "kho" },
        { "name": "Chả thịt lá lốt", "protein": "Chả thịt", "phuongPhapCheBien": "lá lốt" },
        { "name": "Gà kho sả", "protein": "Gà", "phuongPhapCheBien": "kho" },
        { "name": "Cá cơm rim mè", "protein": "Cá", "phuongPhapCheBien": "rim" },
        { "name": "Bò xào rau củ", "protein": "Bò", "phuongPhapCheBien": "xào" },
        { "name": "Thịt kho đậu hũ", "protein": "Thịt", "phuongPhapCheBien": "kho" },
        { "name": "Trứng ốp la", "protein": "Trứng", "phuongPhapCheBien": "ốp la" },
        { "name": "Gà chiên nước mắm", "protein": "Gà", "phuongPhapCheBien": "chiên" },
]