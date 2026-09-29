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

async function createPRForm2ExcelFile(payloadTitle, datas){
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    // ************ Bảng
    worksheet.getCell("A3").value = {
        richText: [
            {
                text: 'Mã SO',
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
                text: 'Mã PR',
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
                text: 'Trạng thái',
                font: {
                    color: { argb: 'FFFFFFFF' },
                }
            }
        ]
    };
    setPosition(worksheet.getCell("C3"));
    setBorder(worksheet.getCell("C3"));
    setBackground(worksheet.getCell("C3"));

    worksheet.getCell("D3").value = {
        richText: [
            {
                text: 'Ngày',
                font: {
                    color: { argb: 'FFFFFFFF' },
                }
            }
        ]
    };
    setPosition(worksheet.getCell("D3"));
    setBorder(worksheet.getCell("D3"));
    setBackground(worksheet.getCell("D3"));

    worksheet.getCell("E3").value = {
        richText: [
            {
                text: 'Nguyên vật liệu sản xuất',
                font: {
                    color: { argb: 'FFFFFFFF' },
                }
            }
        ]
    };
    setPosition(worksheet.getCell("E3"));
    setBorder(worksheet.getCell("E3"));
    setBackground(worksheet.getCell("E3"));

    worksheet.getCell("F3").value = {
        richText: [
            {
                text: 'Khách hàng',
                font: {
                    color: { argb: 'FFFFFFFF' },
                }
            }
        ]
    };
    setPosition(worksheet.getCell("F3"));
    setBorder(worksheet.getCell("F3"));
    setBackground(worksheet.getCell("F3"));

    worksheet.getCell("G3").value = {
        richText: [
            {
                text: 'Site ăn',
                font: {
                    color: { argb: 'FFFFFFFF' },
                }
            }
        ]
    };
    setPosition(worksheet.getCell("G3"));
    setBorder(worksheet.getCell("G3"));
    setBackground(worksheet.getCell("G3"));

    worksheet.getCell("H3").value = {
        richText: [
            {
                text: 'Số lượng dự báo',
                font: {
                    color: { argb: 'FFFFFFFF' },
                }
            }
        ]
    };
    setPosition(worksheet.getCell("H3"));
    setBorder(worksheet.getCell("H3"));
    setBackground(worksheet.getCell("H3"));

    if(datas && datas.length > 0) {
        datas.forEach((data, index) => {
            const newRow = worksheet.addRow([
                data.MaSO, data.MaPR, data.TrangThai, data.Ngay, 
                data.NguyenVatLieu + " " + Math.round(data.KhoiLuongYeuCauSanXuat * 100)/100 + " " + data.DonViTinhMuaHang, 
                data.KhachHang, data.SiteAn,
                data.SoLuongDuBao
            ]);

            for(let i = 1; i <= 8; i++) {
                setBorder(worksheet.getCell(`${String.fromCharCode(64 + i)}${newRow.number}`));
            }
        });
    }

    worksheet.getColumn('A').width = 20;
    worksheet.getColumn('B').width = 20;
    worksheet.getColumn('C').width = 25;
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
    createPRForm2ExcelFile
};