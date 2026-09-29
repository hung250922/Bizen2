const moment = require("moment");

const { 
    models: {KiemThuNguyenVatLieuDb} 
} = require('../index');

// ** Phối hợp combo
const getKiemThuNguyenVatLieus = async (params) => {
    console.log("--- get kiem thu nguyen vat lieu params:", params);
    try {
        let query = params || {};
        console.log({ query });
        const kiemThuNguyenVatLieuList = await KiemThuNguyenVatLieuDb.find(query).sort({ createdAt: -1 });
        console.log("--- Retrieved KiemThuNguyenVatLieus:", kiemThuNguyenVatLieuList.length);
        return kiemThuNguyenVatLieuList;
    } catch (error) {
        console.log("Error in get KiemThuNguyenVatLieus:", error);
        throw error;
    }
}

const addKiemThuNguyenVatLieu = async (payload) => {
    console.log("--- add kiem thu nguyen vat lieu payload:", payload);
    try {
        const newKiemThuNguyenVatLieu = new KiemThuNguyenVatLieuDb(payload);
        await newKiemThuNguyenVatLieu.save();
        return newKiemThuNguyenVatLieu;
    } catch (error) {
        console.log("Error in add KiemThuNguyenVatLieu:", error);
        throw error;
    }
}

const editKiemThuNguyenVatLieu = async (id, payload) => {
    console.log("--- edit KiemThuNguyenVatLieu id:", id, "payload:", payload);
    try {
        const kiemThuNguyenVatLieu = await KiemThuNguyenVatLieuDb.findById(id);
        if (!kiemThuNguyenVatLieu) {
            throw new Error("Kiểm thu nguyên vật liệu không tồn tại!");
        }
        kiemThuNguyenVatLieu.set(payload);
        await kiemThuNguyenVatLieu.save();
        return kiemThuNguyenVatLieu;
    } catch (error) {
        console.log("Error in edit KiemThuNguyenVatLieu:", error);
        throw error;
    }
}

module.exports = {
    getKiemThuNguyenVatLieus,
    addKiemThuNguyenVatLieu,
    editKiemThuNguyenVatLieu
};