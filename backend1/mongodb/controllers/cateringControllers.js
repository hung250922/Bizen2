const moment = require("moment");
const { 
    models: {MonAnDb, LichSuMonAnDb, MonAnTheoMuaDb, CauHinhTinhDiemDb, BOMMonAnDb, DonGiaNVLDb, DonGiaSanPhamDb, PhoiHopComboDb} 
} = require('../index');

const getMonAns = async (params) => {
    console.log("--- get caterings params:", params);
    try {
        let query = {};
        const { fromDate, toDate, storeName } = params;
        if (storeName && storeName !== "null") {
            query["store_name"] = storeName;
        }

        if (fromDate && toDate) {
            query["ngay_tao"] = { 
                $gte: fromDate,
                $lte: moment(toDate).add(1, "day").toDate()
            };
        }

        const monAnList = await MonAnDb.find(query).sort({ ngay_tao: 1 });
        return monAnList;
    } catch (error) {
        console.log("Error in get MonAns:", error);
        throw error;
    }
}

const addMonAn = async (payload) => {
    try {
        const newMonAn = new MonAnDb(payload);
        await newMonAn.save();
        return newMonAn;
    } catch (error) {
        console.log("Error in add MonAn:", error);
        throw error;
    }
}

// ** Món ăn theo mùa
const getMonAnTheoMuas = async (params) => {
    console.log("--- get mon an theo mua params:", params);
    try {
        let query = params || {};
        console.log({ query });
        const monAnTheoMuaList = await MonAnTheoMuaDb.find(query).sort({ createdAt: -1 });
        console.log("--- Retrieved MonAnTheoMuas:", monAnTheoMuaList.length);
        return monAnTheoMuaList;
    } catch (error) {
        console.log("Error in get MonAnTheoMuas:", error);
        throw error;
    }
}

const addMonAnTheoMua = async (payload) => {
    console.log("--- add MonAn payload:", payload);
    try {
        const newMonAn = new MonAnTheoMuaDb(payload);
        await newMonAn.save();
        return newMonAn;
    } catch (error) {
        console.log("Error in add MonAnTheoMua:", error);
        throw error;
    }
}

const editMonAnTheoMua = async (id, payload) => {
    console.log("--- edit MonAnTheoMua id:", id, "payload:", payload);
    try {
        const monAnTheoMua = await MonAnTheoMuaDb.findById(id);
        if (!monAnTheoMua) {
            throw new Error("Món ăn theo mùa không tồn tại!");
        }
        monAnTheoMua.set(payload);
        await monAnTheoMua.save();
        return monAnTheoMua;
    } catch (error) {
        console.log("Error in edit MonAnTheoMua:", error);
        throw error;
    }
}

// ** Cấu hình tính điểm
const getCauHinhTinhDiems = async (params) => {
    console.log("--- get cau hinh tinh diem params:", params);
    try {
        let query = params || {};
        console.log({ query });
        const cauHinhList = await CauHinhTinhDiemDb.find(query).sort({ createdAt: -1 });
        console.log("--- Retrieved CauHinhTinhDiems:", cauHinhList.length);
        return cauHinhList;
    } catch (error) {
        console.log("Error in get CauHinhTinhDiems:", error);
        throw error;
    }
}

const addCauHinhTinhDiem = async (payload) => {
    console.log("--- add CauHinhTinhDiem payload:", payload);
    try {
        const newCauHinh = new CauHinhTinhDiemDb(payload);
        await newCauHinh.save();
        return newCauHinh;
    } catch (error) {
        console.log("Error in add CauHinhTinhDiem:", error);
        throw error;
    }
}

const editCauHinhTinhDiem = async (id, payload) => {
    console.log("--- edit CauHinhTinhDiem id:", id, "payload:", payload);
    try {
        const cauHinh = await CauHinhTinhDiemDb.findById(id);
        if (!cauHinh) {
            throw new Error("Cấu hình tính điểm không tồn tại!");
        }
        cauHinh.set(payload);
        await cauHinh.save();
        return cauHinh;
    } catch (error) {
        console.log("Error in edit CauHinhTinhDiem:", error);
        throw error;
    }
}

// ** BOM món ăn
const getBomMonAns = async (params) => {
    console.log("--- get bom mon an params:", params);
    try {
        let query = params || {};
        console.log({ query });
        const { food_name } = params;
        if (food_name && food_name !== "null") {
            query["food_name"] = food_name;
        }
        const bomMonAnList = await BOMMonAnDb.find(query).sort({ createdAt: -1 });
        console.log("--- Retrieved BomMonAns:", bomMonAnList.length);
        return bomMonAnList;
    } catch (error) {
        console.log("Error in get BomMonAns:", error);
        throw error;
    }
}

const addBomMonAn = async (payload) => {
    console.log("--- add BomMonAn payload:", payload);
    try {
        const newBomMonAn = new BOMMonAnDb(payload);
        await newBomMonAn.save();
        return newBomMonAn;
    } catch (error) {
        console.log("Error in add BomMonAn:", error);
        throw error;
    }
}

const editBomMonAn = async (id, payload) => {
    console.log("--- edit BomMonAn id:", id, "payload:", payload);
    try {
        const bomMonAn = await BOMMonAnDb.findById(id);
        if (!bomMonAn) {
            throw new Error("BOM món ăn không tồn tại!");
        }
        bomMonAn.set(payload);
        await bomMonAn.save();
        return bomMonAn;
    } catch (error) {
        console.log("Error in edit BomMonAn:", error);
        throw error;
    }
}

// ** Đơn giá NVL
const getDonGiaNguyenVatLieus = async (params) => {
    console.log("--- get don gia nguyen vat lieu params:", params);
    try {
        let query = params || {};
        console.log({ query });
        const { nvl_name } = params;
        if (nvl_name && nvl_name !== "null") {
            query["nvl_name"] = nvl_name;
        }
        const donGiaList = await DonGiaNVLDb.find(query).sort({ createdAt: -1 });
        console.log("--- Retrieved DonGiaNguyenVatLieus:", donGiaList.length);
        return donGiaList;
    } catch (error) {
        console.log("Error in get DonGiaNguyenVatLieus:", error);
        throw error;
    }
}

const addDonGiaNguyenVatLieu = async (payload) => {
    console.log("--- add don gia nguyen vat lieu payload:", payload);
    try {
        const newDonGia = new DonGiaNVLDb(payload);
        await newDonGia.save();
        return newDonGia;
    } catch (error) {
        console.log("Error in add DonGiaNguyenVatLieu:", error);
        throw error;
    }
}

const editDonGiaNguyenVatLieu = async (id, payload) => {
    console.log("--- edit DonGiaNguyenVatLieu id:", id, "payload:", payload);
    try {
        const donGia = await DonGiaNVLDb.findById(id);
        if (!donGia) {
            throw new Error("Đơn giá nguyên vật liệu không tồn tại!");
        }
        donGia.set(payload);
        await donGia.save();
        return donGia;
    } catch (error) {
        console.log("Error in edit DonGiaNguyenVatLieu:", error);
        throw error;
    }
}

// ** Đơn giá sản phẩm
const getDonGiaSanPhams = async (params) => {
    console.log("--- get don gia san pham params:", params);
    try {
        let query = params || {};
        console.log({ query });
        const { client_name } = params;
        if (client_name && client_name !== "null") {
            query["client_name"] = client_name;
        }
        const donGiaList = await DonGiaSanPhamDb.find(query).sort({ createdAt: -1 });
        console.log("--- Retrieved DonGiaSanPhams:", donGiaList.length);
        return donGiaList;
    } catch (error) {
        console.log("Error in get DonGiaSanPhams:", error);
        throw error;
    }
}

const addDonGiaSanPham = async (payload) => {
    console.log("--- add don gia san pham payload:", payload);
    try {
        const newDonGia = new DonGiaSanPhamDb(payload);
        await newDonGia.save();
        return newDonGia;
    } catch (error) {
        console.log("Error in add DonGiaSanPham:", error);
        throw error;
    }
}

const editDonGiaSanPham = async (id, payload) => {
    console.log("--- edit DonGiaSanPham id:", id, "payload:", payload);
    try {
        const donGia = await DonGiaSanPhamDb.findById(id);
        if (!donGia) {
            throw new Error("Đơn giá sản phẩm không tồn tại!");
        }
        donGia.set(payload);
        await donGia.save();
        return donGia;
    } catch (error) {
        console.log("Error in edit DonGiaSanPham:", error);
        throw error;
    }
}

// ** Phối hợp combo
const getPhoiHopCombos = async (params) => {
    console.log("--- get phoi hop combo params:", params);
    try {
        let query = params || {};
        console.log({ query });
        const { client_name } = params;
        if (client_name && client_name !== "null") {
            query["client_name"] = client_name;
        }
        const phoiHopComboList = await PhoiHopComboDb.find(query).sort({ createdAt: -1 });
        console.log("--- Retrieved PhoiHopCombos:", phoiHopComboList.length);
        return phoiHopComboList;
    } catch (error) {
        console.log("Error in get PhoiHopCombos:", error);
        throw error;
    }
}

const addPhoiHopCombo = async (payload) => {
    console.log("--- add phoi hop combo payload:", payload);
    try {
        const newPhoiHopCombo = new PhoiHopComboDb(payload);
        await newPhoiHopCombo.save();
        return newPhoiHopCombo;
    } catch (error) {
        console.log("Error in add PhoiHopCombo:", error);
        throw error;
    }
}

const editPhoiHopCombo = async (id, payload) => {
    console.log("--- edit PhoiHopCombo id:", id, "payload:", payload);
    try {
        const phoiHopCombo = await PhoiHopComboDb.findById(id);
        if (!phoiHopCombo) {
            throw new Error("Phối hợp combo không tồn tại!");
        }
        phoiHopCombo.set(payload);
        await phoiHopCombo.save();
        return phoiHopCombo;
    } catch (error) {
        console.log("Error in edit PhoiHopCombo:", error);
        throw error;
    }
}

module.exports = {
    getMonAns,
    addMonAn,
    getMonAnTheoMuas,
    addMonAnTheoMua,
    editMonAnTheoMua,
    getCauHinhTinhDiems,
    addCauHinhTinhDiem,
    editCauHinhTinhDiem,
    getBomMonAns,
    addBomMonAn,
    editBomMonAn,
    getDonGiaNguyenVatLieus,
    addDonGiaNguyenVatLieu,
    editDonGiaNguyenVatLieu,
    getDonGiaSanPhams,
    addDonGiaSanPham,
    editDonGiaSanPham,
    getPhoiHopCombos,
    addPhoiHopCombo,
    editPhoiHopCombo
};