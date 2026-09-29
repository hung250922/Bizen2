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

async function create_Giao_Hang_Form_6_ExcelFile(payloadTitle, datas) {
    const workbook = new Excel.Workbook();

    const worksheet = workbook.addWorksheet(
        '6. Đặt hàng (PO)'
    );

    const headers = [
        'Mã POT',
        'Mã giao hàng',
        'Trạng thái',
        'Mã đặt hàng',
        'Ngày',
        'Tên hàng',
        'Đơn vị tính',
        'Khối lượng nhập hàng theo đơn',
        'Khối lượng hàng trả lại',
        'Khối lượng hàng nhận được thực tế',
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

    worksheet.getRow(1).height = 43.5;

    if(datas && datas.length > 0) {

        datas.sort((a, b) => {

            if(a.NhaCungCap != b.NhaCungCap) {
                return a.NhaCungCap > b.NhaCungCap ? 1 : -1;
            }

            let maPOTA =
                a.RefPOT.replace("POT", "").split("/")[0];

            let maPOTB =
                b.RefPOT.replace("POT", "").split("/")[0];

            return Number(maPOTA) - Number(maPOTB);
        });

        let nhaCungCap = "";
        let maPOT = "";
        let firstRow = 0;

        datas.forEach((data) => {

            if(data.NhaCungCap != nhaCungCap) {

                if(firstRow > 0) {
                    worksheet.mergeCells(
                        firstRow,
                        1,
                        worksheet.rowCount,
                        1
                    );
                }

                const newRow = worksheet.addRow([
                    data.NhaCungCap,
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
                    12
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

                nhaCungCap =
                    data.NhaCungCap;

                maPOT = "";
                firstRow = 0;
            }

            if(data.RefPOT != maPOT) {

                if(firstRow > 0) {
                    worksheet.mergeCells(
                        firstRow,
                        1,
                        worksheet.rowCount,
                        1
                    );
                }

                maPOT =
                    data.RefPOT;

                firstRow =
                    worksheet.rowCount + 1;
            }

            const newRow = worksheet.addRow([
                data.RefPOT,
                data.MaGiaoHang,
                data.TrangThai,
                data.MaDatHang,
                data.Ngay,
                data.TenHang,
                data.DonViTinh,
                data.KhoiLuongNhapHangTheoDon + " " + data.DonViTinh,
                data.KhoiLuongHangTraLai,
                data.KhoiLuongHangNhanDuocThucTe + " " + data.DonViTinh,
                data.NgayGioMuonNhanHang,
                data.KhoNhanHang
            ]);

            for(let i = 1; i <= 12; i++) {
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
    worksheet.getColumn('B').width = 19;
    worksheet.getColumn('C').width = 13;
    worksheet.getColumn('D').width = 19;
    worksheet.getColumn('E').width = 13;
    worksheet.getColumn('F').width = 25.16;
    worksheet.getColumn('G').width = 13;
    worksheet.getColumn('H').width = 23;
    worksheet.getColumn('I').width = 23;
    worksheet.getColumn('J').width = 25;
    worksheet.getColumn('K').width = 23;
    worksheet.getColumn('L').width = 19;

    return workbook;
}

module.exports = {
    create_Giao_Hang_Form_6_ExcelFile
};