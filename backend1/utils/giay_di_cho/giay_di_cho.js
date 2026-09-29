const Excel = require('exceljs');
const dateFormat = require("date-format");
const { formatter } = require("../../utils/helpers");
const setBorder = (cell) => {
    cell.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' }
    };
}

const setBackground = (cell) => {
    cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
            argb: 'FF4169E1'
        }
    };
}

const setPosition = (cell) => {
    cell.alignment = {
        wrapText: true,
        vertical: 'middle',
        horizontal: 'center'
    };
}

async function createGDCExcelFile(payloadTitle, ktBuoc11Datas, thucDonTuanDatas){
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    worksheet.addRow(["CÔNG TY TNHH HỖ TRỢ CÔNG NGHIỆP BIZEN"]);
    worksheet.addRow(["MST: 3602964215"]);
    worksheet.addRow(["Địa chỉ: Lô C2, Kp4, Tân Hiệp, Biên Hòa, Đồng Nai"]);
    worksheet.addRow(["Điện thoại: 02513 894 657"]);

    worksheet.addRow(["BẢNG ĐĂNG KÝ NGUYÊN LIỆU ĐẦU VÀO CÔNG TY " + payloadTitle.client_code?.toUpperCase()]);
    worksheet.getCell("A5").alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell("A5").font = { color: { argb: 'FFFFFFFF' }, bold: true, size: 20 };
    worksheet.getCell("A5").fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
            argb: 'FF008000'
        }
    };
    worksheet.mergeCells('A5:W5');

    const [day, month, year] = payloadTitle.date.split('/').map(Number);
    worksheet.addRow([`Ngày ${day} Tháng ${month} Năm ${year}`]);
    worksheet.getCell("A6").alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell("A6").font = { bold: true, size: 16 };
    worksheet.getCell("A6").fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
            argb: 'FFDDEBF7'
        }
    };
    worksheet.mergeCells('A6:W6');

    // ************ Bảng
    worksheet.getCell("A7").value = {
        richText: [
            {
                text: 'CƠ CẤU SUẤT ĂN',
                font: {
                    color: { argb: 'FF000000' },
                    bold: true
                }
            }
        ]
    };
    setPosition(worksheet.getCell("A7"));
    setBorder(worksheet.getCell("A7"));

    worksheet.getCell("B7").value = {
        richText: [
            {
                text: 'CA',
                font: {
                    color: { argb: 'FF000000' },
                    bold: true
                }
            }
        ]
    };
    setPosition(worksheet.getCell("B7"));
    setBorder(worksheet.getCell("B7"));
    
    worksheet.getCell("C7").value = {
        richText: [
            {
                text: 'TÊN THỰC PHẨM',
                font: {
                    color: { argb: 'FF000000' },
                    bold: true
                }
            }
        ]
    };
    setPosition(worksheet.getCell("C7"));
    setBorder(worksheet.getCell("C7"));

    worksheet.getCell("D7").value = {
        richText: [
            {
                text: 'ĐỊNH MỨC',
                font: {
                    color: { argb: 'FF000000' },
                    bold: true
                }
            }
        ]
    };
    setPosition(worksheet.getCell("D7"));
    setBorder(worksheet.getCell("D7"));

    worksheet.getCell("E7").value = {
        richText: [
            {
                text: 'ĐVT',
                font: {
                    color: { argb: 'FF000000' },
                    bold: true
                }
            }
        ]
    };
    setPosition(worksheet.getCell("E7"));
    setBorder(worksheet.getCell("E7"));

    // Lấy tên site
    const danhSachCacSiteSplit = ktBuoc11Datas.length >= 1 ? ((ktBuoc11Datas[0].DanhSachCacSite || "").split(",") || []) : [];
    console.log("danhSachCacSiteSplit", danhSachCacSiteSplit);
    worksheet.getCell("F7").value = {
        richText: [
            {
                text: danhSachCacSiteSplit.length >= 1 ? danhSachCacSiteSplit[0] : "",
                font: {
                    color: { argb: 'FF000000' },
                    bold: true
                }
            }
        ]
    };
    setPosition(worksheet.getCell("F7"));
    setBorder(worksheet.getCell("F7"));

    worksheet.getCell("G7").value = {
        richText: [
            {
                text: danhSachCacSiteSplit.length >= 2 ? danhSachCacSiteSplit[1] : "",
                font: {
                    color: { argb: 'FF000000' },
                    bold: true
                }
            }
        ]
    };
    setPosition(worksheet.getCell("G7"));
    setBorder(worksheet.getCell("G7"));

    worksheet.getCell("H7").value = {
        richText: [
            {
                text: danhSachCacSiteSplit.length >= 3 ? danhSachCacSiteSplit[2] : "",
                font: {
                    color: { argb: 'FF000000' },
                    bold: true
                }
            }
        ]
    };
    setPosition(worksheet.getCell("H7"));
    setBorder(worksheet.getCell("H7"));

    worksheet.getCell("I7").value = {
        richText: [
            {
                text: danhSachCacSiteSplit.length >= 4 ? danhSachCacSiteSplit[3] : "",
                font: {
                    color: { argb: 'FF000000' },
                    bold: true
                }
            }
        ]
    };
    setPosition(worksheet.getCell("I7"));
    setBorder(worksheet.getCell("I7"));

    worksheet.getCell("J7").value = {
        richText: [
            {
                text: danhSachCacSiteSplit.length >= 5 ? danhSachCacSiteSplit[4] : "",
                font: {
                    color: { argb: 'FF000000' },
                    bold: true
                }
            }
        ]
    };
    setPosition(worksheet.getCell("J7"));
    setBorder(worksheet.getCell("J7"));

    worksheet.getCell("K7").value = {
        richText: [
            {
                text: 'Tổng số phần',
                font: {
                    color: { argb: 'FF000000' },
                    bold: true
                }
            }
        ]
    };
    setPosition(worksheet.getCell("K7"));
    setBorder(worksheet.getCell("K7"));

    worksheet.getCell("L7").value = {
        richText: [
            {
                text: 'Tổng chưa thành phẩm(kg)',
                font: {
                    color: { argb: 'FF000000' },
                    bold: true
                }
            }
        ]
    };
    setPosition(worksheet.getCell("L7"));
    setBorder(worksheet.getCell("L7"));

    worksheet.getCell("M7").value = {
        richText: [
            {
                text: 'Hao hụt %',
                font: {
                    color: { argb: 'FF000000' },
                    bold: true
                }
            }
        ]
    };
    setPosition(worksheet.getCell("M7"));
    setBorder(worksheet.getCell("M7"));

    worksheet.getCell("N7").value = {
        richText: [
            {
                text: 'Hao hụt (Kg)',
                font: {
                    color: { argb: 'FF000000' },
                    bold: true
                }
            }
        ]
    };
    setPosition(worksheet.getCell("N7"));
    setBorder(worksheet.getCell("N7"));

    worksheet.getCell("O7").value = {
        richText: [
            {
                text: 'Nhập thực tế (Kg)',
                font: {
                    color: { argb: 'FF000000' },
                    bold: true
                }
            }
        ]
    };
    setPosition(worksheet.getCell("O7"));
    setBorder(worksheet.getCell("O7"));

    worksheet.getCell("P7").value = {
        richText: [
            {
                text: 'ĐƠN GIÁ',
                font: {
                    color: { argb: 'FF000000' },
                    bold: true
                }
            }
        ]
    };
    setPosition(worksheet.getCell("P7"));
    setBorder(worksheet.getCell("P7"));

    worksheet.getCell("Q7").value = {
        richText: [
            {
                text: 'THÀNH TIỀN',
                font: {
                    color: { argb: 'FF000000' },
                    bold: true
                }
            }
        ]
    };
    setPosition(worksheet.getCell("Q7"));
    setBorder(worksheet.getCell("Q7"));

    worksheet.getCell("R7").value = {
        richText: [
            {
                text: "XÁC NHẬN",
                font: {
                    color: { argb: 'FF000000' },
                    bold: true
                }
            }
        ]
    };
    setPosition(worksheet.getCell("R7"));
    setBorder(worksheet.getCell("R7"));

    worksheet.getCell("R8").value = {
        richText: [
            {
                text: payloadTitle.client_code?.toUpperCase(),
                font: {
                    color: { argb: 'FF000000' },
                    bold: true
                }
            }
        ]
    };
    setPosition(worksheet.getCell("R8"));
    setBorder(worksheet.getCell("R8"));

    worksheet.getCell("S8").value = {
        richText: [
            {
                text: 'BIZEN',
                font: {
                    color: { argb: 'FF000000' },
                    bold: true
                }
            }
        ]
    };
    setPosition(worksheet.getCell("S8"));
    setBorder(worksheet.getCell("S8"));

    worksheet.getCell("T7").value = {
        richText: [
            {
                text: 'NHÀ CUNG CẤP',
                font: {
                    color: { argb: 'FF000000' },
                    bold: true
                }
            }
        ]
    };
    setPosition(worksheet.getCell("T7"));
    setBorder(worksheet.getCell("T7"));

    worksheet.getCell("U7").value = {
        richText: [
            {
                text: 'NGƯỜI GIAO HÀNG',
                font: {
                    color: { argb: 'FF000000' },
                    bold: true
                }
            }
        ]
    };
    setPosition(worksheet.getCell("U7"));
    setBorder(worksheet.getCell("U7"));

    worksheet.getCell("V7").value = {
        richText: [
            {
                text: 'GHI CHÚ',
                font: {
                    color: { argb: 'FF000000' },
                    bold: true
                }
            }
        ]
    };
    setPosition(worksheet.getCell("V7"));
    setBorder(worksheet.getCell("V7"));

    // // chỗ này cần lấy data đưa vào
    let previousCoCauSuatAn = null, previousCa = null;

    if(ktBuoc11Datas && ktBuoc11Datas.length > 0) {
        ktBuoc11Datas.forEach((data, index) => {
            // const BOMMonAnSplitted = data.BOMMonAn.replace(/,/g, "\n");
            // const NguyenLieuChoKiemThucBuoc2Splitted = data.NguyenLieuChoKiemThucBuoc2.replace(/,/g, "\n");
            const danhSachCacSiteSplit = (data.DanhSachCacSite || "").split(",") || [];
            const soLuongCacSiteSplit = (data.SoLuongCacSite || "").split(",") || [];

            const newRow = worksheet.addRow([
                data.CoCauSuatAn,
                data.Ca,
                data.NguyenVatLieu, 
                data.DinhMucNguyenLieu, 
                data.DonViTinh,
                soLuongCacSiteSplit.length >= 1 ? soLuongCacSiteSplit[0] : "",
                soLuongCacSiteSplit.length >= 2 ? soLuongCacSiteSplit[1] : "",
                soLuongCacSiteSplit.length >= 3 ? soLuongCacSiteSplit[2] : "",
                soLuongCacSiteSplit.length >= 4 ? soLuongCacSiteSplit[3] : "",
                soLuongCacSiteSplit.length >= 5 ? soLuongCacSiteSplit[4] : "",
                formatter.format(data.TongSoPhan),
                formatter.format(Math.round(data.TongKhoiLuongYeuCauSanXuat * 100) / 100),
                data.HaoHut + "%",
                formatter.format(Math.round(data.TongKhoiLuongYeuCauSanXuat* data.HaoHut/100 * 100) / 100), 
                formatter.format(Math.round(data.TongKhoiLuongYeuCauSanXuat* (1 - data.HaoHut/100) * 100) / 100), 
                "", //formatter.format(data.DonGia || 0), 
                "",//formatter.format(Math.round(data.DonGia * data.TongKhoiLuongYeuCauSanXuat * (1 - data.HaoHut/100))), 
                "", "",
                data.TenCoSo,
                data.NguoiGiaoHang
            ]);

            for(let i = 1; i <= 22; i++) {
                setBorder(worksheet.getCell(`${String.fromCharCode(64 + i)}${newRow.number}`));
            }

            // ** merge cho Ca
            if (previousCa === null) {
                previousCa = { value: data.Ca, startRow: newRow.number };
            } else if (previousCa.value !== data.Ca) {
                if (previousCa.startRow !== newRow.number - 1) {
                    worksheet.mergeCells(`B${previousCa.startRow}:B${newRow.number - 1}`);
                    worksheet.getCell(`B${previousCa.startRow}`).alignment = {
                        wrapText: true,
                        vertical: 'middle'
                    };
                }
                previousCa = { value: data.Ca, startRow: newRow.number };
            }

            // merge the last group for Ca
            if (index === ktBuoc11Datas.length - 1 && previousCa.startRow !== newRow.number) {
                worksheet.mergeCells(`B${previousCa.startRow}:B${newRow.number}`);
                worksheet.getCell(`B${previousCa.startRow}`).alignment = {
                    wrapText: true,
                    vertical: 'middle',
                    // horizontal: 'center'
                };
            }

            // ** merge cho Cơ Cấu Suất Ăn
            if (previousCoCauSuatAn === null) {
                previousCoCauSuatAn = { value: data.CoCauSuatAn, startRow: newRow.number };
            } else if (previousCoCauSuatAn.value !== data.CoCauSuatAn) {
                if (previousCoCauSuatAn.startRow !== newRow.number - 1) {
                    worksheet.mergeCells(`A${previousCoCauSuatAn.startRow}:A${newRow.number - 1}`);
                    worksheet.getCell(`A${previousCoCauSuatAn.startRow}`).alignment = {
                        wrapText: true,
                        vertical: 'middle'
                    };
                }
                previousCoCauSuatAn = { value: data.CoCauSuatAn, startRow: newRow.number };
            }

            // merge the last group
            if (index === ktBuoc11Datas.length - 1 && previousCoCauSuatAn.startRow !== newRow.number) {
                worksheet.mergeCells(`A${previousCoCauSuatAn.startRow}:A${newRow.number}`);
                worksheet.getCell(`A${previousCoCauSuatAn.startRow}`).alignment = {
                    wrapText: true,
                    vertical: 'middle',
                    //horizontal: 'center'
                };
            }
        });
    }

    worksheet.getColumn('A').width = 15;
    worksheet.getColumn('B').width = 5;
    worksheet.getColumn('C').width = 25;
    worksheet.getColumn('D').width = 15;
    worksheet.getColumn('E').width = 10;
    worksheet.getColumn('F').width = 10;
    worksheet.getColumn('G').width = 10;
    worksheet.getColumn('H').width = 10;
    worksheet.getColumn('I').width = 10;
    worksheet.getColumn('J').width = 10;
    worksheet.getColumn('K').width = 10;
    worksheet.getColumn('L').width = 15;
    worksheet.getColumn('M').width = 15;
    worksheet.getColumn('N').width = 10;
    worksheet.getColumn('O').width = 10;
    worksheet.getColumn('P').width = 10;
    worksheet.getColumn('Q').width = 10;
    worksheet.getColumn('R').width = 10;
    worksheet.getColumn('S').width = 10;
    worksheet.getColumn('T').width = 40;
    worksheet.getColumn('U').width = 40;
    worksheet.getColumn('V').width = 10;

    worksheet.mergeCells(`A1:V1`);
    worksheet.mergeCells(`A2:V2`);
    worksheet.mergeCells(`A3:V3`);
    worksheet.mergeCells(`A4:V4`);

    ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "T", "U", "V"].forEach(col => {
        worksheet.mergeCells(`${col}7:${col}8`);
    })
    worksheet.mergeCells(`R7:S7`);

    ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V"].forEach(col => {
        worksheet.getColumn(col).alignment = {
            wrapText: true,
            vertical: 'middle',
            horizontal: 'center'
        };
    });

    ["A1", "A2", "A3", "A4"].forEach(cell => {
        worksheet.getCell(cell).alignment = {
            vertical: 'top',
            horizontal: 'top'
        };
    });

    return workbook;

    //await workbook.xlsx.writeFile(`exported_file${Date.now().toLocaleString().replace(/[:\/]/g, '-')}.xlsx`);
}

module.exports = {
    createGDCExcelFile
};