const XLSX = require('xlsx');
const kiemthu3BuocControllers = require('../mongodb/controllers/kiemthu3BuocControllers');

module.exports = (router) => {
    router.get('/kiem_thuc_3_buoc/kiem_thu_nguyen_vat_lieus', async(req,res) => {
        const result = await kiemthu3BuocControllers.getKiemThuNguyenVatLieus(req.query);
        return res.json({      
            data: result, 
            error: null 
        });
    });

    router.post('/kiem_thuc_3_buoc/add_kiem_thu_nguyen_vat_lieu', async(req,res) => {
        const result = await kiemthu3BuocControllers.addKiemThuNguyenVatLieu(req.body);
        if(result) {
            return res.json({      
                data: "add kiem thu nguyen vat lieu success", 
                error: null 
            });
        } else {
            return res.json({      
                data: null, 
                error: "Thêm dữ liệu thất bại!"
            });
        }
    });

    router.post('/kiem_thuc_3_buoc/edit_kiem_thu_nguyen_vat_lieu', async(req,res) => {
        const { id, ...payload } = req.body;
        const result = await kiemthu3BuocControllers.editKiemThuNguyenVatLieu(id, payload);
        if(result) {
            return res.json({      
                data: "edit kiem thu nguyen vat lieu success", 
                error: null 
            });
        } else {
            return res.json({      
                data: null, 
                error: "Cập nhật dữ liệu thất bại!"
            });
        }
    });

    router.post('/kiem_thuc_3_buoc/import_excel_file', async(req,res) => {
        await readExcelFile(`./public/excelFiles/${req.body.fileName}.xlsx`);
        return res.json({
            data: "import excel file success",
        })
    });

    //`./public/excelFiles/${fileName}.xlsx`
    async function readExcelFile(filePath) {
        const workbook = XLSX.readFile(filePath);
        const worksheet = workbook.Sheets["Sheet2"];
        // const rows = worksheet.getRows(1, worksheet.rowCount);
        // console.log("---- rows", rows);
        const worksheetDatas = XLSX.utils.sheet_to_json(worksheet);
        let fields = [];
        
        worksheetDatas.map((row, index) => {
            console.log("--------------------------------------------")
            //console.log("---- row", row);
            const tenThucPham = row["tenThucPham"];
            const thoiGianNhap = "5:30";
            const khoiLuong = row["khoiLuong"];
            const tenCoSo = row["tenCoSo"];
            const diaChiDienThoai = row["diaChiDienThoai"];
            const tenNguoiGiaoHang = row["tenNguoiGiaoHang"];
            const chungTuHoaDon = row["chungTuHoaDon"];
            const giayDKVSThuy = row["giayDKVSThuy"];
            const giayKiemDich = row["giayKiemDich"];
            const datKT = row["datKT"];

            fields.push({
                tenThucPham,
                thoiGianNhap,
                khoiLuong,
                tenCoSo,
                diaChiDienThoai,
                tenNguoiGiaoHang,
                chungTuHoaDon,
                giayDKVSThuy,
                giayKiemDich,
                datKT
            });

            // console.log("---- tenThucPham", tenThucPham);
            // console.log("---- thoiGianNhap", thoiGianNhap);
            // console.log("---- khoiLuong", khoiLuong);
            // console.log("---- tenCoSo", tenCoSo);
            // console.log("---- diaChiDienThoai", diaChiDienThoai);
            // console.log("---- tenNguoiGiaoHang", tenNguoiGiaoHang);
            // console.log("---- chungTuHoaDon", chungTuHoaDon);
            // console.log("---- giayDKVSThuy", giayDKVSThuy);
            // console.log("---- giayKiemDich", giayKiemDich);
            // console.log("---- datKT", datKT);
        });

        fields.map(async(field, index) => {
            console.log("--------------------------------------------")
            console.log("---- field", field);
            await kiemthu3BuocControllers.addKiemThuNguyenVatLieu(fields);
        })
       

          //	Thời gian nhập	 Khối lượng 	 Tên cơ sở 	 Địa chỉ, điện thoại 	 Tên người giao hàng 	Chứng từ, hóa đơn	Giấy ĐK VS thú y	Giấy kiểm dịch	Đạt KT

    }

};