 const mongoose = require('mongoose');

 const KiemThuNguyenVatLieuSchema = new mongoose.Schema({
    ten_thuc_pham: { type: String },
    thoi_gian_nhap: { type: String },
    ten_co_so: { type: String },
    dia_chi_dien_thoai: { type: String },
    ten_nguoi_giao_hang: { type: String },
    chung_tu_hoa_don: { type: String },
    giay_dk_vs_thu_y: { type: String },
    giay_kiem_dich: { type: String },
    dat_kiem_tra: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const KiemThuNguyenVatLieuDb = mongoose.model("kiem_thu_nguyen_vat_lieu", KiemThuNguyenVatLieuSchema);

module.exports = { KiemThuNguyenVatLieuDb };