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
            argb: 'FFFFFF00'
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

const tinhTongKhoiLuong = (rows) => {
    let tongKhoiLuong = 0;

    rows.forEach((data) => {
        tongKhoiLuong +=
            Number(data.KhoiLuongYeuCauSanXuat || 0);
    });

    return Math.round(tongKhoiLuong * 10) / 10;
}


async function createKHDH_PR_POT_Form3_ExcelFile(payloadTitle, datas) {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('3. Kế hoạch đặt hàng (PR - POT)');

    const headers = [
        'Mã POT',
        'Trạng thái',
        '',
        'Nguyên vật liệu',
        'Kho nhận hàng',
        'Ngày giờ muốn nhận hàng',
        'Mã PR',
        'Mã SO',
        'Ngày',
        'Ca',
        'Khách hàng',
        'Site ăn',
        'Bếp',
        'Nguyên vật liệu đầy đủ',
        'Món ăn',
        'Chu kỳ đặt hàng (ngày)'
    ];

    const startRow = 3;

    headers.forEach((header, index) => {
        const cell = worksheet.getCell(
            String.fromCharCode(65 + index) + startRow
        );

        cell.value = header;

        cell.font = {
            name: 'DengXian',
            size: 11,
            color: { argb: 'FFFFFFFF' }
        };

        setPosition(cell);
        setBorder(cell);
        setBackground(cell);
    });

    let groups = {};

    if(datas && datas.length > 0) {
        datas.forEach((data) => {
            const key = data.NguyenVatLieu || "";

            if(!groups[key]) {
                groups[key] = [];
            }

            groups[key].push(data);
        });
    }

    Object.keys(groups).forEach((nguyenVatLieu) => {
        const groupdatas = groups[nguyenVatLieu];
        const tongKhoiLuong =
            tinhTongKhoiLuong(groupdatas);
        let donViTinhMuaHang = "";
        // console.log("---- tongKhoiLuong", tongKhoiLuong, "donViTinhMuaHang", donViTinhMuaHang);
        groupdatas.forEach((data) => {
            if(!donViTinhMuaHang) {
                donViTinhMuaHang =
                    data.DonViTinhMuaHang || "";
            }

            const newRow = worksheet.addRow([
                data.MaPOT,
                data.TrangThai,
                "",
                data.NguyenVatLieu + " " + Math.round(data.KhoiLuongYeuCauSanXuat * 100) / 100 + " " + data.DonViTinhMuaHang,
                data.KhoNhanHang,
                data.NgayGioMuonNhanHang,
                data.MaPR,
                data.MaSO,
                data.Ngay,
                data.Ca,
                data.KhachHang,
                data.SiteAn,
                data.Bep,
                "",
                data.MonAn,
                data.ChuKyDatHang
            ]);

            // console.log(
            //     "---- Excel row",
            //     newRow.number,
            //     newRow.values
            // );

            for(let i = 1; i <= 16; i++) {
                setBorder(
                    worksheet.getCell(
                        `${String.fromCharCode(64 + i)}${newRow.number}`
                    )
                );
            }

            for(let i = 1; i <= 16; i++) {
                setPosition(
                    worksheet.getCell(
                        `${String.fromCharCode(64 + i)}${newRow.number}`
                    )
                );
            }
        });

        const totalRow = worksheet.addRow([
            "",
            "",
            `${nguyenVatLieu} - ${tongKhoiLuong} ${donViTinhMuaHang}`,
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

        totalRow.height = 25.5;

        totalRow.getCell(3).font = {
            name: 'DengXian',
            size: 11,
            bold: true
        };

        totalRow.getCell(4).font = {
            name: 'DengXian',
            size: 11,
            bold: true
        };

        worksheet.mergeCells(`C${totalRow.number}:F${totalRow.number}`);

        for(let i = 1; i <= 16; i++) {
            const cell = worksheet.getCell(
                `${String.fromCharCode(64 + i)}${totalRow.number}`
            );

            cell.border = {
                top: { style: 'thin' },
                bottom: { style: 'thin' }
            };

            setPosition(cell);
            setTotalBackground(cell);
        }

        // console.log(
        //     "---- Excel total row",
        //     totalRow.number,
        //     totalRow.values
        // );
    });

    worksheet.getColumn('A').width = 19;
    worksheet.getColumn('B').width = 13;
    worksheet.getColumn('C').width = 13;
    worksheet.getColumn('D').width = 23.4;
    worksheet.getColumn('E').width = 13;
    worksheet.getColumn('F').width = 23.6;
    worksheet.getColumn('G').width = 38.7;
    worksheet.getColumn('H').width = 13;
    worksheet.getColumn('I').width = 12.7;
    worksheet.getColumn('J').width = 8.75;
    worksheet.getColumn('K').width = 13.8;
    worksheet.getColumn('L').width = 19;
    worksheet.getColumn('M').width = 13;
    worksheet.getColumn('N').width = 0;
    worksheet.getColumn('O').width = 19;
    worksheet.getColumn('P').width = 19;

    worksheet.getColumn('N').hidden = true;

    worksheet.getRow(3).height = 60;

    return workbook;
}

module.exports = {
    createKHDH_PR_POT_Form3_ExcelFile
};