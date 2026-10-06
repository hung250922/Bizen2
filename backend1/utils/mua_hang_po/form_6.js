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

const setSupplierBackground = (cell) => {
    cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
            argb: 'FFF0802B'
        }
    };

    cell.font = {
        name: 'DengXian',
        size: 11,
        color: {
            argb: 'FFFFFFFF'
        },
        bold: true
    };
}

const setPosition = (cell) => {
    cell.alignment = {
        wrapText: true,
        vertical: 'middle',
        horizontal: 'center'
    };
}

async function createForm6POExcelFile(rows) {
    const workbook = new Excel.Workbook();

    const worksheet = workbook.addWorksheet(
        '6. Đặt hàng (PO)'
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

    worksheet.getRow(1).height = 43.5;

    if(rows && rows.length > 0) {

        rows.sort((a, b) => {

            // Gom theo kho nhận hàng trước
            if(a.KhoNhanHang != b.KhoNhanHang) {
                return a.KhoNhanHang > b.KhoNhanHang ? 1 : -1;
            }

            // Trong từng kho thì gom theo Mã POT
            let maPOTA =
                String(a.MaPOT || "")
                    .replace("POT", "")
                    .split("/")[0];

            let maPOTB =
                String(b.MaPOT || "")
                    .replace("POT", "")
                    .split("/")[0];

            return Number(maPOTA) - Number(maPOTB);
        });

        let khoNhanHang = "";
        let maPOT = "";
        let firstRow = 0;

        rows.forEach((data) => {

            if(data.KhoNhanHang != khoNhanHang) {

                if(firstRow > 0) {
                    worksheet.mergeCells(
                        firstRow,
                        1,
                        worksheet.rowCount,
                        1
                    );
                }

                const newRow = worksheet.addRow([
                    data.KhoNhanHang,
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    
                    ""
                ]);

                worksheet.mergeCells(
                    newRow.number,
                    1,
                    newRow.number,
                    13
                );

                setSupplierBackground(
                    newRow.getCell(1)
                );

                setPosition(
                    newRow.getCell(1)
                );

                setBorder(
                    newRow.getCell(1)
                );

                newRow.height = 25;

                khoNhanHang =
                    data.KhoNhanHang;

                maPOT = "";
                firstRow = 0;
            }

            if(data.MaPOT != maPOT) {

                if(firstRow > 0) {
                    worksheet.mergeCells(
                        firstRow,
                        1,
                        worksheet.rowCount,
                        1
                    );
                }

                maPOT =
                    data.MaPOT;

                firstRow =
                    worksheet.rowCount + 1;
            }

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
            ]);

            for(let i = 1; i <= 13;i++) {
                setBorder(newRow.getCell(i));
                setPosition(newRow.getCell(i));
            }
        });

        if(firstRow > 0) {
            worksheet.mergeCells(
                firstRow,
                1,
                worksheet.rowCount,
                1
            );
        }
    }

    worksheet.getColumn('A').width = 19;
    worksheet.getColumn('B').width = 23;
    worksheet.getColumn('C').width = 15;
    worksheet.getColumn('D').width = 23;
    worksheet.getColumn('E').width = 25;
    worksheet.getColumn('F').width = 23;
    worksheet.getColumn('G').width = 23;
    worksheet.getColumn('H').width = 25;
    worksheet.getColumn('I').width = 22;
    worksheet.getColumn('J').width = 20;
    worksheet.getColumn('K').width = 13;
    worksheet.getColumn('L').width = 23;
    worksheet.getColumn('M').width = 23;

    return workbook;
}

module.exports = {
    createForm6POExcelFile
};