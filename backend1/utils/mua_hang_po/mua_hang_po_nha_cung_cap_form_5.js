const Excel = require('exceljs');

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

const setTotalBackground = (cell) => {
    cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
            argb: 'FFCC9900'
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

async function create_mua_hang_PO_nha_cung_cap_Form_5_ExcelFile(payloadTitle, datas) {
    const workbook = new Excel.Workbook();

    const worksheet = workbook.addWorksheet(
        '4. Đặt hàng (PO)'
    );

    const headers = [
        'Mã POT',
        'Khối lượng yêu cầu sản xuất',
        'Kỳ đặt hàng',
        'Số lượng đặt hàng được duyệt',
        'Tên nguyên liệu Misa',
        'Nhóm nguyên liệu Misa',
        'Nhà cung cấp',
        'Đơn giá gần nhất (tham khảo)',
        'Đơn giá được duyệt',
        'Thành tiền',
        'Thuế VAT',
        'Thành tiền sau thuế',
        'Ngày giờ muốn nhận hàng',
        'Kho nhận hàng'
    ];

    headers.forEach((header, index) => {
        const cell = worksheet.getCell(
            1,
            index + 1
        );

        cell.value = header;

        cell.font = {
            name: 'DengXian',
            size: 11,
            color: {
                argb: 'FFFFFFFF'
            }
        };

        setPosition(cell);
        setBorder(cell);
        setBackground(cell);
    });

    if(datas && datas.length > 0) {
        datas.forEach((data) => {
            const newRow = worksheet.addRow([
                data.MaPOT,
                data.KhoiLuongYeuCauSanXuat,
                data.KyDatHang,
                data.SoLuongDatHangDuocDuyet,
                data.TenNguyenLieuMisa,
                data.NhomNguyenLieuMisa,
                data.NhaCungCap,
                data.DonGiaGanNhatThamKhao,
                data.DonGiaDuocDuyet,
                data.ThanhTien,
                data.ThueVAT,
                data.ThanhTienSauThue,
                data.NgayGioMuonNhanHang,
                data.KhoNhanHang
            ]);
            newRow.getCell(8).numFmt = '#,##0 "VNĐ"'; 
            newRow.getCell(9).numFmt = '#,##0 "VNĐ"'; 
            newRow.getCell(10).numFmt = '#,##0 "VNĐ"'; 
            newRow.getCell(12).numFmt = '#,##0 "VNĐ"'; 
            for(let i = 1; i <= 14; i++) {
                setBorder(newRow.getCell(i));
                setPosition(newRow.getCell(i));
            }
        });
    }

    const totalRow = worksheet.addRow([
        'Tổng:',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        ''
    ]);

    totalRow.height = 25.5;

    totalRow.getCell(1).font = {
        name: 'DengXian',
        size: 11,
        bold: true
    };
    
    for(let i = 1; i <= 14; i++) {
        setPosition(totalRow.getCell(i));
        setTotalBackground(totalRow.getCell(i));

        totalRow.getCell(i).border = {
            top: { style: 'thin' },
            bottom: { style: 'thin' }
        };
    }

    worksheet.getColumn('A').width = 19;
    worksheet.getColumn('B').width = 26.75;
    worksheet.getColumn('C').width = 25.9140625;
    worksheet.getColumn('D').width = 19;
    worksheet.getColumn('E').width = 25;
    worksheet.getColumn('F').width = 25;
    worksheet.getColumn('G').width = 25.1640625;
    worksheet.getColumn('H').width = 19;
    worksheet.getColumn('I').width = 19;
    worksheet.getColumn('J').width = 19;
    worksheet.getColumn('K').width = 13;
    worksheet.getColumn('L').width = 23;
    worksheet.getColumn('M').width = 23;
    worksheet.getColumn('N').width = 19;

    worksheet.getRow(1).height = 43.5;

    return workbook;
}

module.exports = {
    create_mua_hang_PO_nha_cung_cap_Form_5_ExcelFile
};