 const mongoose = require('mongoose');

 const MonAnSchema = new mongoose.Schema({
    Ten_Mon_An: { type: String },
    Loai_Protein: { type: String },
    Phuong_Phap_Che_Bien: { type: String },
    Khung_Thoi_Gian_Khong_Phuc_Vu: { type: String },
    Muc_Do_Yeu_Thich: { type: Number },
    createdAt: { type: Date, default: Date.now }
});

const LichSuMonAnSchema = new mongoose.Schema({
    Khach_Hang: { type: String },
    Ca: { type: String },
    Ngay: { type: Date },
    Mon_An_Id: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const MonAnTheoMuaSchema = new mongoose.Schema({
    food_name: { type: String },
    from_month: { type: Number },
    to_month: { type: Number },
    is_encouraged: { type: Boolean },
    createdAt: { type: Date, default: Date.now }
});

const BOMMonAnSchema = new mongoose.Schema({
    food_name: { type: String },
    NVL1: { type: String },
    NVL1_DVT: { type: String },
    NVL1_DM: { type: Number },
    NVL2: { type: String },
    NVL2_DVT: { type: String },
    NVL2_DM: { type: Number },
    NVL3: { type: String },
    NVL3_DVT: { type: String },
    NVL3_DM: { type: Number },
    NVL4: { type: String },
    NVL4_DVT: { type: String },
    NVL4_DM: { type: Number },
    NVL5: { type: String },
    NVL5_DVT: { type: String },
    NVL5_DM: { type: Number },
    NVL6: { type: String },
    NVL6_DVT: { type: String },
    NVL6_DM: { type: Number },
    NVL7: { type: String },
    NVL7_DVT: { type: String },
    NVL7_DM: { type: Number },
    createdAt: { type: Date, default: Date.now }
});

const DonGiaNVLSchema = new mongoose.Schema({
    nvl_name: { type: String },
    nvl_unit: { type: String },
    nvl_price: { type: Number },
    createdAt: { type: Date, default: Date.now }
});

const DonGiaSanPhamSchema = new mongoose.Schema({
    client_name: { type: String },
    product_name: { type: String },
    product_price: { type: Number },
    createdAt: { type: Date, default: Date.now }
});

const CauHinhTinhDiemSchema = new mongoose.Schema({
    tc1_diem_trong_so: { type: Number },
    tc2_diem_trong_so: { type: Number },
    tc3_diem_trong_so: { type: Number },
    tc4_diem_trong_so: { type: Number },
    tc5_diem_trong_so: { type: Number },
    ngay_trung_phuong_phap_che_bien: { type: Number },
    createdAt: { type: Date, default: Date.now }
});

const PhoiHopComboSchema = new mongoose.Schema({
    nvl_name: { type: String },
    nvl_have_to_go_with: { type: String },
    nvl_not_to_go_with: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const MonAnDb = mongoose.model("mon_an", MonAnSchema);
const LichSuMonAnDb = mongoose.model("lich_su_mon_an", LichSuMonAnSchema);
const MonAnTheoMuaDb = mongoose.model("mon_an_theo_mua", MonAnTheoMuaSchema);
const CauHinhTinhDiemDb = mongoose.model("cau_hinh_tinh_diem", CauHinhTinhDiemSchema);

const BOMMonAnDb = mongoose.model("bom_mon_an", BOMMonAnSchema);
const DonGiaNVLDb = mongoose.model("don_gia_nvl", DonGiaNVLSchema);
const DonGiaSanPhamDb = mongoose.model("don_gia_san_pham", DonGiaSanPhamSchema);
const PhoiHopComboDb = mongoose.model("phoi_hop_combo", PhoiHopComboSchema);

module.exports = { MonAnDb, LichSuMonAnDb, MonAnTheoMuaDb, CauHinhTinhDiemDb, BOMMonAnDb, DonGiaNVLDb, DonGiaSanPhamDb, PhoiHopComboDb };