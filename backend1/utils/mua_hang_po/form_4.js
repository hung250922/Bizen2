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

const setGrayBackground = (cell) => {
    cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
            argb: 'FFB4C1D6'
        }
    };
}

const setYellowBackground = (cell) => {
    cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
            argb: 'FFFFD966'
        }
    };
}

const setGreenBackground = (cell) => {
    cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
            argb: 'FFA9D18E'
        }
    };
}

const setLightGreenBackground = (cell) => {
    cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
            argb: 'FFE2F0D9'
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

async function createPO_Form4_ExcelFile(payloadTitle, datas) {
    console.log("---- createPOExcelFile datas.length", datas?.length);
    console.log("---- createPOExcelFile datas[0]", datas?.[0]);

    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('4. Đặt hàng (PO)');

    const headers = [
        'Mã POT',
        'Khối lượng nguyên vật liệu yêu cầu sản xuất',
        'Kỳ đặt hàng',
        'Chu kỳ đặt hàng',
        'Tồn kho đầu kỳ',
        'Tồn kho tối thiểu',
        'Số lượng đặt hàng',
        'Số lượng đặt hàng được duyệt',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        'Ngày giờ muốn nhận hàng',
        'Kho nhận hàng'
    ];

    const startRow = 1;

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

    if(datas && datas.length > 0) {
        datas.forEach((data) => {
            const newRow = worksheet.addRow([
                data.MaPOT,
                data.NguyenVatLieu + " " + data.KhoiLuongYeuCauSanXuat + " " + data.DonViTinh, 
                data.KyDatHang,
                data.ChuKyDatHang,
                data.TonKhoDauKy,
                data.TonKhoToiThieu,
                data.SoLuongDatHang,
                data.SoLuongDatHangDuocDuyet,
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                data.NgayGioMuonNhanHang,
                data.KhoNhanHang
            ]);

            // console.log(
            //     "---- Excel row",
            //     newRow.number,
            //     newRow.values
            // );

            for(let i = 1; i <= 18; i++) {
                setBorder(
                    worksheet.getCell(
                        `${String.fromCharCode(64 + i)}${newRow.number}`
                    )
                );
            }

            for(let i = 1; i <= 18; i++) {
                setPosition(
                    worksheet.getCell(
                        `${String.fromCharCode(64 + i)}${newRow.number}`
                    )
                );
            }

            setGrayBackground(
                worksheet.getCell(`E${newRow.number}`)
            );

            setYellowBackground(
                worksheet.getCell(`F${newRow.number}`)
            );

            setGreenBackground(
                worksheet.getCell(`G${newRow.number}`)
            );

            setLightGreenBackground(
                worksheet.getCell(`H${newRow.number}`)
            );

            if(data.NgayGioMuonNhanHang) {
                worksheet.getCell(
                    `Q${newRow.number}`
                ).numFmt = 'dd/MM/yyyy hh:mm';
            }
        });
    }

    if(datas && datas.length > 0) {
        const totalRow = worksheet.addRow([
            "Tổng:",
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
            "",
            "",
            "",
            "",
            "",
            ""
        ]);

        totalRow.height = 25.5;

        totalRow.getCell(1).font = {
            name: 'DengXian',
            size: 11,
            bold: true
        };

        for(let i = 1; i <= 18; i++) {
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

        setLightGreenBackground(
            worksheet.getCell(`H${totalRow.number}`)
        );

        console.log(
            "---- Excel total row",
            totalRow.number,
            totalRow.values
        );
    }

    worksheet.getColumn('A').width = 19;
    worksheet.getColumn('B').width = 26.75;
    worksheet.getColumn('C').width = 22.83;
    worksheet.getColumn('D').width = 19;
    worksheet.getColumn('E').width = 17.83;
    worksheet.getColumn('F').width = 19;
    worksheet.getColumn('G').width = 19;
    worksheet.getColumn('H').width = 19;

    worksheet.getColumn('I').width = 19;
    worksheet.getColumn('J').width = 19;
    worksheet.getColumn('K').width = 19;
    worksheet.getColumn('L').width = 19;
    worksheet.getColumn('M').width = 19;
    worksheet.getColumn('N').width = 19;
    worksheet.getColumn('O').width = 19;
    worksheet.getColumn('P').width = 19;

    worksheet.getColumn('Q').width = 19;
    worksheet.getColumn('R').width = 19;

    worksheet.getColumn('I').hidden = true;
    worksheet.getColumn('J').hidden = true;
    worksheet.getColumn('K').hidden = true;
    worksheet.getColumn('L').hidden = true;
    worksheet.getColumn('M').hidden = true;
    worksheet.getColumn('N').hidden = true;
    worksheet.getColumn('O').hidden = true;
    worksheet.getColumn('P').hidden = true;

    worksheet.getRow(1).height = 44;

    //await workbook.xlsx.writeFile(`exported_file${Date.now().toLocaleString().replace(/[:\/]/g, '-')}.xlsx`);
    return workbook;
}

module.exports = {
    createPO_Form4_ExcelFile
};