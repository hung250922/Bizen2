const mongoose = require('mongoose');
const { userDb } = require('./models/User');
const { 
    MonAnDb, LichSuMonAnDb, MonAnTheoMuaDb, CauHinhTinhDiemDb, 
    BOMMonAnDb, DonGiaNVLDb, DonGiaSanPhamDb, PhoiHopComboDb 
} = require('./models/Catering');
const {
    KiemThuNguyenVatLieuDb,
} = require('./models/KiemThuc3Buoc');

const connectDB = async (mongoURI) => {
    try {
        await mongoose.connect(mongoURI, {});
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        process.exit(1);
    }
}

module.exports = {
    connectDB,
    models: {
        userDb,
        MonAnDb,
        LichSuMonAnDb,
        MonAnTheoMuaDb,
        CauHinhTinhDiemDb,
        BOMMonAnDb,
        DonGiaNVLDb,
        DonGiaSanPhamDb,
        PhoiHopComboDb,
        KiemThuNguyenVatLieuDb,
    }
};