const Excel = require('exceljs');
const dateFormat = require("date-format");

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

async function createLSX2ExcelFile(payloadTitle, lsx2Datas){
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    worksheet.addRow(["LỆNH SẢN XUẤT " + (payloadTitle.kitchen?.toUpperCase() || "")]);
    worksheet.getCell("A1").alignment = { vertical: 'middle', horizontal: 'center' };
    
    // tô màu
    worksheet.getCell("A1").font = { bold: true, size: 20 };

    worksheet.getCell("H2").value = {
        richText: [
            {
                text: 'NGÀY: ' + payloadTitle.date,
                font: {
                    color: { argb: 'FF000000' },
                    bold: true,
                }
            }
        ]
    };

    // const [day, month, year] = payloadTitle.date.split('/').map(Number);
    // const newDate = new Date(year, month - 1, day);

    // ************ Bảng
    worksheet.getCell("A3").value = {
        richText: [
            {
                text: 'Cty',
                font: {
                    color: { argb: 'FFFFFFFF' },
                }
            }
        ]
    };
    setPosition(worksheet.getCell("A3"));
    setBorder(worksheet.getCell("A3"));
    setBackground(worksheet.getCell("A3"));

    worksheet.getCell("B3").value = {
        richText: [
            {
                text: 'Ca',
                font: {
                    color: { argb: 'FFFFFFFF' },
                }
            }
        ]
    };
    setPosition(worksheet.getCell("B3"));
    setBorder(worksheet.getCell("B3"));
    setBackground(worksheet.getCell("B3"));
    
    worksheet.getCell("C3").value = {
        richText: [
            {
                text: 'Site',
                font: {
                    color: { argb: 'FFFFFFFF' },
                }
            }
        ]
    };
    setPosition(worksheet.getCell("C3"));
    setBorder(worksheet.getCell("C3"));
    setBackground(worksheet.getCell("C3"));

    worksheet.getCell("H3").value = {
        richText: [
            {
                text: 'Tổng suất ăn',
                font: {
                    color: { argb: 'FFFFFFFF' },
                }
            }
        ]
    };
    setPosition(worksheet.getCell("H3"));
    setBorder(worksheet.getCell("H3"));
    setBackground(worksheet.getCell("H3"));

    worksheet.getCell("I3").value = {
        richText: [
            {
                text: 'Cơ cấu suất ăn',
                font: {
                    color: { argb: 'FFFFFFFF' },
                }
            }
        ]
    };
    setPosition(worksheet.getCell("I3"));
    setBorder(worksheet.getCell("I3"));
    setBackground(worksheet.getCell("I3"));

    worksheet.getCell("J3").value = {
        richText: [
            {
                text: 'Món ăn',
                font: {
                    color: { argb: 'FFFFFFFF' },
                }
            }
        ]
    };
    setPosition(worksheet.getCell("J3"));
    setBorder(worksheet.getCell("J3"));
    setBackground(worksheet.getCell("J3"));

    worksheet.getCell("K3").value = {
        richText: [
            {
                text: 'BOM MÓN ĂN',
                font: {
                    color: { argb: 'FFFFFFFF' },
                }
            }
        ]
    };
    setPosition(worksheet.getCell("K3"));
    setBorder(worksheet.getCell("K3"));
    setBackground(worksheet.getCell("K3"));

    worksheet.getCell("L3").value = {
        richText: [
            {
                text: 'KHỐI LƯỢNG YÊU CẦU SẢN XUẤT',
                font: {
                    color: { argb: 'FFFFFFFF' },
                }
            }
        ]
    };
    setPosition(worksheet.getCell("L3"));
    setBorder(worksheet.getCell("L3"));
    setBackground(worksheet.getCell("L3"));


    // chỗ này cần lấy data đưa vào
    let previousKhachHang = null, previousCa = null, previousCoCauSuatAn = null, previousSoLuongCoNgaDuyetDatHang = null;
    
    if(lsx2Datas && lsx2Datas.length > 0) {
        lsx2Datas.forEach((data, index) => {
            const BOMMonAnSplitted = data.BOMMonAn.replace(/,/g, "\n");
            let newRow = {};

            if(payloadTitle.exportType === "Duyệt 15h") {
                const KhoiLuongSanXuat15hSite1Splitted = data.KhoiLuongSanXuat15hSite1.replace(/,/g, "\n");
                const KhoiLuongSanXuat15hSite2Splitted = data.KhoiLuongSanXuat15hSite2.replace(/,/g, "\n");
                const KhoiLuongSanXuat15hSite3Splitted = data.KhoiLuongSanXuat15hSite3.replace(/,/g, "\n");
                const KhoiLuongSanXuat15hSite4Splitted = data.KhoiLuongSanXuat15hSite4.replace(/,/g, "\n");
                const KhoiLuongSanXuat15hSite5Splitted = data.KhoiLuongSanXuat15hSite5.replace(/,/g, "\n");
                const NguyenLieuChoKiemThuc15hBuoc2Splitted = data.NguyenLieuChoKiemThuc15hBuoc2.replace(/,/g, "\n");

                newRow = worksheet.addRow([
                    data.KhachHang,
                    data.Ca,
                    data.SoLuongDuyet15hSite1 > 0 ? (data.Site1 + ":\n" + data.SoLuongDuyet15hSite1) : "", 
                    data.SoLuongDuyet15hSite2 > 0 ? (data.Site2 + ":\n" + data.SoLuongDuyet15hSite2) : "", 
                    data.SoLuongDuyet15hSite3 > 0 ? (data.Site3 + ":\n" + data.SoLuongDuyet15hSite3) : "",
                    data.SoLuongDuyet15hSite4 > 0 ? (data.Site4 + ":\n" + data.SoLuongDuyet15hSite4) : "",
                    data.SoLuongDuyet15hSite5 > 0 ? (data.Site5 + ":\n" + data.SoLuongDuyet15hSite5) : "",
                    data.SoLuongDuyet15h,
                    data.CoCauSuatAn,
                    data.MonAn,
                    BOMMonAnSplitted,
                    data.SoLuongDuyet15hSite1 > 0 ? (data.Site1 + ":\n" + KhoiLuongSanXuat15hSite1Splitted) : "",
                    data.SoLuongDuyet15hSite2 > 0 ? (data.Site2 + ":\n" + KhoiLuongSanXuat15hSite2Splitted) : "",
                    data.SoLuongDuyet15hSite3 > 0 ? (data.Site3 + ":\n" + KhoiLuongSanXuat15hSite3Splitted) : "",
                    data.SoLuongDuyet15hSite4 > 0 ? (data.Site4 + ":\n" + KhoiLuongSanXuat15hSite4Splitted) : "",
                    data.SoLuongDuyet15hSite5 > 0 ? (data.Site5 + ":\n" + KhoiLuongSanXuat15hSite5Splitted) : "",
                    "TỔNG:\n" + NguyenLieuChoKiemThuc15hBuoc2Splitted
                ]);
            } else if(payloadTitle.exportType === "Đặt hàng được duyệt") {
                const KhoiLuongDatHangDuocDuyetSite1Splitted = data.KhoiLuongDatHangDuocDuyetSite1.replace(/,/g, "\n");
                const KhoiLuongDatHangDuocDuyetSite2Splitted = data.KhoiLuongDatHangDuocDuyetSite2.replace(/,/g, "\n");
                const KhoiLuongDatHangDuocDuyetSite3Splitted = data.KhoiLuongDatHangDuocDuyetSite3.replace(/,/g, "\n");
                const KhoiLuongDatHangDuocDuyetSite4Splitted = data.KhoiLuongDatHangDuocDuyetSite4.replace(/,/g, "\n");
                const KhoiLuongDatHangDuocDuyetSite5Splitted = data.KhoiLuongDatHangDuocDuyetSite5.replace(/,/g, "\n");
                const NguyenLieuChoKiemThucDatHangDuocDuyetBuoc2Splitted = data.NguyenLieuChoKiemThucDatHangDuocDuyetBuoc2.replace(/,/g, "\n");

                newRow = worksheet.addRow([
                    data.KhachHang,
                    data.Ca,
                    data.SoLuongDatHangDuocDuyetSite1 > 0 ? (data.Site1 + ":\n" + data.SoLuongDatHangDuocDuyetSite1) : "", 
                    data.SoLuongDatHangDuocDuyetSite2 > 0 ? (data.Site2 + ":\n" + data.SoLuongDatHangDuocDuyetSite2) : "", 
                    data.SoLuongDatHangDuocDuyetSite3 > 0 ? (data.Site3 + ":\n" + data.SoLuongDatHangDuocDuyetSite3) : "",
                    data.SoLuongDatHangDuocDuyetSite4 > 0 ? (data.Site4 + ":\n" + data.SoLuongDatHangDuocDuyetSite4) : "",
                    data.SoLuongDatHangDuocDuyetSite5 > 0 ? (data.Site5 + ":\n" + data.SoLuongDatHangDuocDuyetSite5) : "",
                    data.SoLuongDatHangDuocDuyet,
                    data.CoCauSuatAn,
                    data.MonAn,
                    BOMMonAnSplitted,
                    data.SoLuongDatHangDuocDuyetSite1 > 0 ? (data.Site1 + ":\n" + KhoiLuongDatHangDuocDuyetSite1Splitted) : "",
                    data.SoLuongDatHangDuocDuyetSite2 > 0 ? (data.Site2 + ":\n" + KhoiLuongDatHangDuocDuyetSite2Splitted) : "",
                    data.SoLuongDatHangDuocDuyetSite3 > 0 ? (data.Site3 + ":\n" + KhoiLuongDatHangDuocDuyetSite3Splitted) : "",
                    data.SoLuongDatHangDuocDuyetSite4 > 0 ? (data.Site4 + ":\n" + KhoiLuongDatHangDuocDuyetSite4Splitted) : "",
                    data.SoLuongDatHangDuocDuyetSite5 > 0 ? (data.Site5 + ":\n" + KhoiLuongDatHangDuocDuyetSite5Splitted) : "",
                    "TỔNG:\n" + NguyenLieuChoKiemThucDatHangDuocDuyetBuoc2Splitted
                ]);
            } else if(payloadTitle.exportType === "Đặt hàng dự báo") {
                const KhoiLuongDatHangDuBaoSite1Splitted = data.KhoiLuongDatHangDuBaoSite1.replace(/,/g, "\n");
                const KhoiLuongDatHangDuBaoSite2Splitted = data.KhoiLuongDatHangDuBaoSite2.replace(/,/g, "\n");
                const KhoiLuongDatHangDuBaoSite3Splitted = data.KhoiLuongDatHangDuBaoSite3.replace(/,/g, "\n");
                const KhoiLuongDatHangDuBaoSite4Splitted = data.KhoiLuongDatHangDuBaoSite4.replace(/,/g, "\n");
                const KhoiLuongDatHangDuBaoSite5Splitted = data.KhoiLuongDatHangDuBaoSite5.replace(/,/g, "\n");
                const NguyenLieuChoKiemThucDatHangDuBaoBuoc2Splitted = data.NguyenLieuChoKiemThucDatHangDuBaoBuoc2.replace(/,/g, "\n");

                newRow = worksheet.addRow([
                    data.KhachHang,
                    data.Ca,
                    data.SoLuongDatHangDuBaoSite1 > 0 ? (data.Site1 + ":\n" + data.SoLuongDatHangDuBaoSite1) : "", 
                    data.SoLuongDatHangDuBaoSite2 > 0 ? (data.Site2 + ":\n" + data.SoLuongDatHangDuBaoSite2) : "", 
                    data.SoLuongDatHangDuBaoSite3 > 0 ? (data.Site3 + ":\n" + data.SoLuongDatHangDuBaoSite3) : "",
                    data.SoLuongDatHangDuBaoSite4 > 0 ? (data.Site4 + ":\n" + data.SoLuongDatHangDuBaoSite4) : "",
                    data.SoLuongDatHangDuBaoSite5 > 0 ? (data.Site5 + ":\n" + data.SoLuongDatHangDuBaoSite5) : "",
                    data.SoLuongDatHangDuBao,
                    data.CoCauSuatAn,
                    data.MonAn,
                    BOMMonAnSplitted,
                    data.SoLuongDatHangDuBaoSite1 > 0 ? (data.Site1 + ":\n" + KhoiLuongDatHangDuBaoSite1Splitted) : "",
                    data.SoLuongDatHangDuBaoSite2 > 0 ? (data.Site2 + ":\n" + KhoiLuongDatHangDuBaoSite2Splitted) : "",
                    data.SoLuongDatHangDuBaoSite3 > 0 ? (data.Site3 + ":\n" + KhoiLuongDatHangDuBaoSite3Splitted) : "",
                    data.SoLuongDatHangDuBaoSite4 > 0 ? (data.Site4 + ":\n" + KhoiLuongDatHangDuBaoSite4Splitted) : "",
                    data.SoLuongDatHangDuBaoSite5 > 0 ? (data.Site5 + ":\n" + KhoiLuongDatHangDuBaoSite5Splitted) : "",
                    "TỔNG:\n" + NguyenLieuChoKiemThucDatHangDuBaoBuoc2Splitted
                ]);
            }

            for(let i = 1; i <= 17; i++) {
                setBorder(worksheet.getCell(`${String.fromCharCode(64 + i)}${newRow?.number}`));
            }

            // ** xuống dòng cho BOM MÓN ĂN & NGUYÊN LIỆU CHO KIỂM THỰC BƯỚC 2
            // ["A", "B", "C", "D", "E", "F", "G", "I", "J", "K", "L", "M", "N", "O", "P", "Q"].forEach(col => {
            //     worksheet.getCell(`${col}${newRow.number}`).alignment = {
            //         wrapText: true,
            //         vertical: 'middle',
            //         horizontal: 'center'
            //     };
            // });

            worksheet.getCell(`K${newRow?.number}`).alignment = {
                wrapText: true,
                vertical: 'middle',
                horizontal: 'center'
            };

            worksheet.getCell(`J${newRow?.number}`).alignment = {
                wrapText: true,
                vertical: 'middle',
                horizontal: 'center'
            };

            // tính toán merge cho từng loại
            // ** merge cho Khách Hàng
            if (previousKhachHang === null) {
                previousKhachHang = { value: data.KhachHang, startRow: newRow.number };
            } else if (previousKhachHang.value !== data.KhachHang) {
                if (previousKhachHang.startRow !== newRow.number - 1) {
                    worksheet.mergeCells(`A${previousKhachHang.startRow}:A${newRow?.number - 1}`);
                    worksheet.getCell(`A${previousKhachHang.startRow}`).alignment = {
                        wrapText: true,
                        vertical: 'middle',
                        horizontal: 'center'
                    };
                }
                previousKhachHang = { value: data.KhachHang, startRow: newRow.number };
            }

            // merge the last group
            if (index === lsx2Datas.length - 1 && previousKhachHang.startRow !== newRow.number) {
                worksheet.mergeCells(`A${previousKhachHang.startRow}:A${newRow?.number}`);
                worksheet.getCell(`A${previousKhachHang.startRow}`).alignment = {
                    wrapText: true,
                    vertical: 'middle',
                    horizontal: 'center'
                };
            }

            // ** merge cho Ca
            if (previousCa === null) {
                previousCa = { value: data.Ca, startRow: newRow.number };
            } else if (previousCa.value !== data.Ca) {
                if (previousCa.startRow !== newRow.number - 1) {
                    worksheet.mergeCells(`B${previousCa.startRow}:B${newRow?.number - 1}`);
                    worksheet.getCell(`B${previousCa.startRow}`).alignment = {
                        wrapText: true,
                        vertical: 'middle',
                        horizontal: 'center'
                    };
                }
                previousCa = { value: data.Ca, startRow: newRow.number };
            }

            // merge the last group
            if (index === lsx2Datas.length - 1 && previousCa.startRow !== newRow.number) {
                worksheet.mergeCells(`B${previousCa.startRow}:B${newRow?.number}`);
                worksheet.getCell(`B${previousCa.startRow}`).alignment = {
                    wrapText: true,
                    vertical: 'middle',
                    horizontal: 'center'
                };
            }

            // ** merge cho Cơ Cấu Suất Ăn
            if (previousCoCauSuatAn === null) {
                previousCoCauSuatAn = { value: data.CoCauSuatAn, startRow: newRow.number };
            } else if (previousCoCauSuatAn.value !== data.CoCauSuatAn) {
                if (previousCoCauSuatAn.startRow !== newRow.number - 1) {
                    worksheet.mergeCells(`I${previousCoCauSuatAn.startRow}:I${newRow?.number - 1}`);
                    worksheet.getCell(`I${previousCoCauSuatAn.startRow}`).alignment = {
                        wrapText: true,
                        vertical: 'middle',
                        horizontal: 'center'
                    };
                }
                previousCoCauSuatAn = { value: data.CoCauSuatAn, startRow: newRow.number };
            }

            // merge the last group
            if (index === lsx2Datas.length - 1 && previousCoCauSuatAn.startRow !== newRow.number) {
                worksheet.mergeCells(`I${previousCoCauSuatAn.startRow}:I${newRow?.number}`);
                worksheet.getCell(`I${previousCoCauSuatAn.startRow}`).alignment = {
                    wrapText: true,
                    vertical: 'middle',
                    horizontal: 'center'
                };
            }

            // merge các ô số lượng
            let startSLColumnName = null, endSLColumnName = null;
            if(!(data.SoLuongCoNgaDuyetSite5 > 0)) {
                startSLColumnName = "F"; // Assuming column G corresponds to SoLuongCoNgaDuyetSite5
                endSLColumnName = "G"; // Assuming column G corresponds to SoLuongCoNgaDuyetSite5
            }
            if(!(data.SoLuongCoNgaDuyetSite4 > 0)) {
                startSLColumnName = "E"; // Assuming column H corresponds to SoLuongCoNgaDuyetSite4
                if(endSLColumnName === null) {
                    endSLColumnName = "F"; // Assuming column H corresponds to SoLuongCoNgaDuyetSite4
                }
            }
            if(!(data.SoLuongCoNgaDuyetSite3 > 0)) {
                startSLColumnName = "D"; // Assuming column I corresponds to SoLuongCoNgaDuyetSite3
                if(endSLColumnName === null) {
                    endSLColumnName = "E"; // Assuming column I corresponds to SoLuongCoNgaDuyetSite3
                }
            }
            if(!(data.SoLuongCoNgaDuyetSite2 > 0)) {
                startSLColumnName = "C"; // Assuming column J corresponds to SoLuongCoNgaDuyetSite2
                if(endSLColumnName === null) {
                    endSLColumnName = "D"; // Assuming column J corresponds to SoLuongCoNgaDuyetSite2
                }
            }
            // if(!(data.SoLuongCoNgaDuyetSite1 > 0)) {
            //     startSLColumnName = "B"; // Assuming column C corresponds to SoLuongCoNgaDuyetSite1
            //     if(endSLColumnName === null) {
            //         endSLColumnName = "C"; // Assuming column C corresponds to SoLuongCoNgaDuyetSite1
            //     }
            // }

            // và BOM khi nó không có data
            let startBOMColumnName = null, endBOMColumnName = null;
            if(!(data.SoLuongCoNgaDuyetSite5 > 0)) {
                startBOMColumnName = "O"; // Assuming column G corresponds to SoLuongCoNgaDuyetSite5
                endBOMColumnName = "P"; // Assuming column G corresponds to SoLuongCoNgaDuyetSite5
            }
            if(!(data.SoLuongCoNgaDuyetSite4 > 0)) {
                startBOMColumnName = "N"; // Assuming column G corresponds to SoLuongCoNgaDuyetSite5
                if(endBOMColumnName === null) {
                    endBOMColumnName = "O"; // Assuming column G corresponds to SoLuongCoNgaDuyetSite5
                }
            }
            if(!(data.SoLuongCoNgaDuyetSite3 > 0)) {
                startBOMColumnName = "M"; // Assuming column G corresponds to SoLuongCoNgaDuyetSite5
                if(endBOMColumnName === null) {
                    endBOMColumnName = "N"; // Assuming column G corresponds to SoLuongCoNgaDuyetSite5
                }
            }
               if(!(data.SoLuongCoNgaDuyetSite2 > 0)) {
                startBOMColumnName = "L"; // Assuming column G corresponds to SoLuongCoNgaDuyetSite5
                if(endBOMColumnName === null) {
                    endBOMColumnName = "M"; // Assuming column G corresponds to SoLuongCoNgaDuyetSite5
                }
            }
            if(!(data.SoLuongCoNgaDuyetSite1 > 0)) {
                startBOMColumnName = "K"; // Assuming column G corresponds to SoLuongCoNgaDuyetSite5
                if(endBOMColumnName === null) {
                    endBOMColumnName = "L"; // Assuming column G corresponds to SoLuongCoNgaDuyetSite5
                }
            }

            // if ((data.SoLuongCoNgaDuyetSite5 <= 0) && (startSLColumnName && endSLColumnName)) {
            if ((data.SoLuongCoNgaDuyetSite5 == 0) && (startSLColumnName && endSLColumnName)) {
                // console.log('--- ', data.SoLuongCoNgaDuyetSite5);
                // console.log("--- new Row:", newRow.number);
                // console.log('Merging cells for SL:', startSLColumnName, endSLColumnName);
                worksheet.mergeCells(`${startSLColumnName}${newRow.number}:${endSLColumnName}${newRow.number}`);
                worksheet.getCell(`${startSLColumnName}${newRow.number}`).alignment = {
                    wrapText: true,
                    vertical: 'middle',
                    horizontal: 'center'
                };
            }

            if ((data.SoLuongCoNgaDuyetSite5 == 0) && (startBOMColumnName && endBOMColumnName)) {
                worksheet.mergeCells(`${startBOMColumnName}${newRow.number}:${endBOMColumnName}${newRow.number}`);
                worksheet.getCell(`${startBOMColumnName}${newRow.number}`).alignment = {
                    wrapText: true,
                    vertical: 'middle',
                    horizontal: 'center'
                };
            }

        });
    }

    worksheet.getColumn('A').width = 10;
    worksheet.getColumn('B').width = 10;
    worksheet.getColumn('C').width = 15;
    worksheet.getColumn('D').width = 15;
    worksheet.getColumn('E').width = 15;
    worksheet.getColumn('F').width = 15;
    worksheet.getColumn('G').width = 15;
    worksheet.getColumn('H').width = 20;
    worksheet.getColumn('I').width = 30;
    worksheet.getColumn('J').width = 25;
    worksheet.getColumn('K').width = 25;
    worksheet.getColumn('L').width = 25;
    worksheet.getColumn('M').width = 25;
    worksheet.getColumn('N').width = 25;
    worksheet.getColumn('O').width = 25;
    worksheet.getColumn('P').width = 25;
    worksheet.getColumn('Q').width = 25;

    worksheet.getRow(3).height = 80;

    worksheet.mergeCells(`A1:Q1`);
    worksheet.mergeCells(`C3:G3`);
    worksheet.mergeCells(`L3:Q3`);


    ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q"].forEach(col => {
        worksheet.getColumn(col).alignment = {
            wrapText: true,
            vertical: 'middle',
            horizontal: 'center'
        };
    });

    return workbook;

    //await workbook.xlsx.writeFile(`exported_file${Date.now().toLocaleString().replace(/[:\/]/g, '-')}.xlsx`);
}

module.exports = {
    createLSX2ExcelFile
};