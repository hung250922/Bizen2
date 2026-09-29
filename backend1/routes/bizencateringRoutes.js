
const cateringControllers = require('../mongodb/controllers/cateringControllers');

module.exports = (router) => {
    router.get('/catering/list', async(req,res) => {
        console.log("--- catering list req.query:", req.query);
        const listCaterings = await cateringControllers.getMonAns(req.query);
        return res.json({      
            data: listCaterings, 
            error: null 
        });
    });

    router.post('/catering/save_datas', async(req,res) => {
        const { fields } = req.body;
    
        Promise.all(fields.map(async(field) => {
            const result = await cateringControllers.addMonAn(field);
            return result;
        })).then(results => {
            //console.log("---- all catering datas saved:", results);
            return res.json({      
                data: "save catering datas success", 
                error: null 
            });
        }).catch(err => {
            console.log("---- error saving catering datas:", err);
            return res.json({      
                data: null, 
                error: "Lưu dữ liệu thất bại!"
            });
        });
    });

    // ** Món ăn theo mùa
    router.get('/catering/mon_an_theo_muas', async(req,res) => {
        const result = await cateringControllers.getMonAnTheoMuas(req.query);
        return res.json({      
            data: result, 
            error: null 
        });
    });

    router.post('/catering/add_mon_an_theo_mua', async(req,res) => {
        const result = await cateringControllers.addMonAnTheoMua(req.body);
        if(result) {
            return res.json({      
                data: "add mon an theo mua success", 
                error: null 
            });
        } else {
            return res.json({      
                data: null, 
                error: "Thêm dữ liệu thất bại!"
            });
        }
    });

    router.post('/catering/edit_mon_an_theo_mua', async(req,res) => {
        const { id, ...payload } = req.body;
        const result = await cateringControllers.editMonAnTheoMua(id, payload);
        if(result) {
            return res.json({      
                data: "edit mon an theo mua success", 
                error: null 
            });
        } else {
            return res.json({      
                data: null, 
                error: "Cập nhật dữ liệu thất bại!"
            });
        }
    });

    // ** Cấu hình tính điểm
    router.get('/catering/cau_hinh_tinh_diems', async(req,res) => {
        const result = await cateringControllers.getCauHinhTinhDiems(req.query);
        return res.json({      
            data: result, 
            error: null 
        });
    });

    router.post('/catering/add_cau_hinh_tinh_diem', async(req,res) => {
        const result = await cateringControllers.addCauHinhTinhDiem(req.body);
        if(result) {
            return res.json({      
                data: "add cau hinh tinh diem success", 
                error: null 
            });
        } else {
            return res.json({      
                data: null, 
                error: "Thêm dữ liệu thất bại!"
            });
        }
    });

    router.post('/catering/edit_cau_hinh_tinh_diem', async(req,res) => {
        const { id, ...payload } = req.body;
        const result = await cateringControllers.editCauHinhTinhDiem(id, payload);
        if(result) {
            return res.json({      
                data: "edit cau hinh tinh diem success", 
                error: null 
            });
        } else {
            return res.json({      
                data: null, 
                error: "Cập nhật dữ liệu thất bại!"
            });
        }
    });

    // ** BOM món ăn
    router.get('/catering/bom_mon_ans', async(req,res) => {
        const result = await cateringControllers.getBomMonAns(req.query);
        return res.json({      
            data: result, 
            error: null 
        });
    });

    router.post('/catering/add_bom_mon_an', async(req,res) => {
        const result = await cateringControllers.addBomMonAn(req.body);
        if(result) {
            return res.json({      
                data: "add bom mon an success", 
                error: null 
            });
        } else {
            return res.json({      
                data: null, 
                error: "Thêm dữ liệu thất bại!"
            });
        }
    });

    router.post('/catering/edit_bom_mon_an', async(req,res) => {
        const { id, ...payload } = req.body;
        const result = await cateringControllers.editBomMonAn(id, payload);
        if(result) {
            return res.json({      
                data: "edit bom mon an success", 
                error: null 
            });
        } else {
            return res.json({      
                data: null, 
                error: "Cập nhật dữ liệu thất bại!"
            });
        }
    });

    // ** Đơn giá nguyên vật liệu
    router.get('/catering/don_gia_nguyen_vat_lieus', async(req,res) => {
        const result = await cateringControllers.getDonGiaNguyenVatLieus(req.query);
        return res.json({      
            data: result, 
            error: null 
        });
    });

    router.post('/catering/add_don_gia_nguyen_vat_lieu', async(req,res) => {
        const result = await cateringControllers.addDonGiaNguyenVatLieu(req.body);
        if(result) {
            return res.json({      
                data: "add don gia nguyen vat lieu success", 
                error: null 
            });
        } else {
            return res.json({      
                data: null, 
                error: "Thêm dữ liệu thất bại!"
            });
        }
    });

    router.post('/catering/edit_don_gia_nguyen_vat_lieu', async(req,res) => {
        const { id, ...payload } = req.body;
        const result = await cateringControllers.editDonGiaNguyenVatLieu(id, payload);
        if(result) {
            return res.json({      
                data: "edit don gia nguyen vat lieu success", 
                error: null 
            });
        } else {
            return res.json({      
                data: null, 
                error: "Cập nhật dữ liệu thất bại!"
            });
        }
    });

    // ** Đơn giá sản phẩm
    router.get('/catering/don_gia_san_phams', async(req,res) => {
        const result = await cateringControllers.getDonGiaSanPhams(req.query);
        return res.json({      
            data: result, 
            error: null 
        });
    });

    router.post('/catering/add_don_gia_san_pham', async(req,res) => {
        const result = await cateringControllers.addDonGiaSanPham(req.body);
        if(result) {
            return res.json({      
                data: "add don gia san pham success", 
                error: null 
            });
        } else {
            return res.json({      
                data: null, 
                error: "Thêm dữ liệu thất bại!"
            });
        }
    });

    router.post('/catering/edit_don_gia_san_pham', async(req,res) => {
        const { id, ...payload } = req.body;
        const result = await cateringControllers.editDonGiaSanPham(id, payload);
        if(result) {
            return res.json({      
                data: "edit don gia san pham success", 
                error: null 
            });
        } else {
            return res.json({      
                data: null, 
                error: "Cập nhật dữ liệu thất bại!"
            });
        }
    });

     // ** Phối hợp combo
    router.get('/catering/phoi_hop_combos', async(req,res) => {
        const result = await cateringControllers.getPhoiHopCombos(req.query);
        return res.json({      
            data: result, 
            error: null 
        });
    });

    router.post('/catering/add_phoi_hop_combo', async(req,res) => {
        const result = await cateringControllers.addPhoiHopCombo(req.body);
        if(result) {
            return res.json({      
                data: "add phoi hop combo success", 
                error: null 
            });
        } else {
            return res.json({      
                data: null, 
                error: "Thêm dữ liệu thất bại!"
            });
        }
    });

    router.post('/catering/edit_phoi_hop_combo', async(req,res) => {
        const { id, ...payload } = req.body;
        const result = await cateringControllers.editPhoiHopCombo(id, payload);
        if(result) {
            return res.json({      
                data: "edit phoi hop combo success", 
                error: null 
            });
        } else {
            return res.json({      
                data: null, 
                error: "Cập nhật dữ liệu thất bại!"
            });
        }
    });
};