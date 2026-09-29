const Excel = require('exceljs');

const adjustColumnWidth = (worksheet) => {
    worksheet.columns.forEach(column => {
        const lengths = column.values.map(v => v.toString().length);
        const maxLength = Math.max(...lengths.filter(v => typeof v === 'number'));
        column.width = maxLength;
    });
};

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
            argb: 'FFD9D9D9'
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

async function createKTB1ExcelFile(payloadTitle, excelKT11Datas, excelKT12Datas) {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    worksheet.addRow(["", "", "", "MẪU BIỂU GHI CHÉP KIỂM THỰC BA BƯỚC"]);
    worksheet.addRow(["", "", "", "3-STEP FOOD CHECK FORM"]);
    worksheet.addRow([""]);
    worksheet.addRow([""]);

    worksheet.getCell("A5").value = {
        richText: [
            {
                text: 'Mẫu số 1: Kiểm tra trước khi chế biến thức ăn (bước 1)/',
                font: {
                    color: { argb: 'FF000000' },
                    bold: true,
                }
            },
            {
                text: 'Form No. 1: Checking before food processing (step 1)',
                font: {
                    color: { argb: 'FF0000FF' },
                    bold: true,
                    italic: true
                }
            }
        ]
    };
    worksheet.getCell("A6").value = {
        richText: [
            {
                text: 'Người kiểm tra/',
                font: {
                    color: { argb: 'FF000000' }
                }
            },
            {
                text: 'Checked by:',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true
                }
            }
        ]
    };
    worksheet.getCell("A7").value = {
        richText: [
            {
                text: 'Thời gian kiểm tra/',
                font: {
                    color: { argb: 'FF000000' }
                }
            },
            {
                text: 'Checking time:',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true
                }
            },
            {
                text: payloadTitle.date,
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                    bold: true
                }
            },
        ]
    };
    worksheet.getCell("A8").value = {
        richText: [
            {
                text: 'Địa điểm kiểm tra/',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: 'Checking place: ',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            },
            {
                text: 'CATTEEN',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
        ]
    };
    worksheet.getCell("D7").value = {
        richText: [
            {
                text: 'Tên mẫu thức ăn/ ',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: 'Food sample name: '+ payloadTitle.ca,
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true
                }
            }
        ]
    };

    // I
    // const sectionRowI = worksheet.addRow(["I. Thực phẩm tươi sống, đông lạnh: thịt, cá, rau, củ, quả…/ Fresh and frozen foods: meat, fish, vegetables, roots, fruits …"]);
    // sectionRowI.font = { bold: true };
    worksheet.getCell("A9").value = {
        richText: [
            {
                text: 'I. Thực phẩm tươi sống, đông lạnh: thịt, cá, rau, củ, quả…/',
                font: {
                    color: { argb: 'FF000000' },
                    bold: true,
                }
            },
            {
                text: 'Fresh and frozen foods: meat, fish, vegetables, roots, fruits …',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                    bold: true,
                }
            }
        ]
    };

    // Bảng
    worksheet.getCell("A10").value = {
        richText: [
            {
                text: 'TT',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nNo.',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    worksheet.getCell(`A10`).alignment = {
        wrapText: true,
        vertical: 'middle',
        horizontal: 'center'
    };
    setBackground(worksheet.getCell("A10"));

    worksheet.getCell("B10").value = {
        richText: [
            {
                text: 'Tên thực phẩm',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nFood name',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    worksheet.getCell(`B10`).alignment = {
        wrapText: true,
        vertical: 'middle',
        horizontal: 'center'
    };
    setBackground(worksheet.getCell("B10"));

    worksheet.getCell("C10").value = {
        richText: [
            {
                text: 'Thời gian nhập\n (ngày, giờ)',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nStorage time (date, \ntime)',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    worksheet.getCell(`C10`).alignment = {
        wrapText: true,
        vertical: 'middle',
        horizontal: 'center'
    };
    setBackground(worksheet.getCell("C10"));

    worksheet.getCell("D10").value = {
        richText: [
            {
                text: 'Khối lượng \n(kg/lít....)',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nVolume (kg/ liter \n....)',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    worksheet.getCell(`D10`).alignment = {
        wrapText: true,
        vertical: 'middle',
        horizontal: 'center'
    };
    setBackground(worksheet.getCell("D10"));

    worksheet.getCell("E10").value = {
        richText: [
            {
                text: 'Nơi cung cấp',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nProvider',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    worksheet.getCell(`E10`).alignment = {
        wrapText: true,
        vertical: 'middle',
        horizontal: 'center'
    };
    setBackground(worksheet.getCell("E10"));

    worksheet.getCell("E11").value = {
        richText: [
            {
                text: 'Tên cơ sở',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nEstablishment name',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    worksheet.getCell(`E11`).alignment = {
        wrapText: true,
        vertical: 'middle',
        horizontal: 'center'
    };
    setBackground(worksheet.getCell("E11"));
    
    worksheet.getCell("F11").value = {
        richText: [
            {
                text: 'Địa chỉ, điện thoại',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nAddress, phone',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    worksheet.getCell(`F11`).alignment = {
        wrapText: true,
        vertical: 'middle',
        horizontal: 'center'
    };
    setBackground(worksheet.getCell("F11"));

    worksheet.getCell("G11").value = {
        richText: [
            {
                text: 'Tên người giao \nhàng',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nShipper name',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    worksheet.getCell(`G11`).alignment = {
        wrapText: true,
        vertical: 'middle',
        horizontal: 'center'
    };
    setBackground(worksheet.getCell("G11"));
    
    //
    worksheet.getCell("H10").value = {
        richText: [
            {
                text: 'Chứng từ, hóa đơn',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nVoucher, invoice',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    worksheet.getCell(`H10`).alignment = {
        wrapText: true,
        vertical: 'middle',
        horizontal: 'center'
    };
    setBackground(worksheet.getCell("H10"));
    worksheet.getCell(`I10`).alignment = {
        wrapText: true,
        vertical: 'middle',
        horizontal: 'center'
    };
    setBackground(worksheet.getCell("I10"));

    worksheet.getCell("J10").value = {
        richText: [
            {
                text: 'Giấy ĐK VS thú y',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nVeterinary hygiene \nregistration \ncertificate',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    worksheet.getCell(`J10`).alignment = {
        wrapText: true,
        vertical: 'middle',
        horizontal: 'center'
    };
    setBackground(worksheet.getCell("J10"));

    worksheet.getCell("K10").value = {
        richText: [
            {
                text: 'Giấy kiểm dịch',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nQuarantine \ncertificate',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    worksheet.getCell(`K10`).alignment = {
        wrapText: true,
        vertical: 'middle',
        horizontal: 'center'
    };
    setBackground(worksheet.getCell("K10"));
    
    worksheet.getCell("L10").value = {
        richText: [
            {
                text: 'Kiểm tra cảm  quan \n(màu, mùi vị, trạng thái, bảo \nquản...)',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nSensory checking (color, \ntaste, state, \npreservation ...)',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    worksheet.getCell(`L10`).alignment = {
        wrapText: true,
        vertical: 'middle',
        horizontal: 'center'
    };
    setBackground(worksheet.getCell("L10"));

    worksheet.getCell("L11").value = {
        richText: [
            {
                text: 'Đạt\n',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nPassed\n',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    worksheet.getCell(`L11`).alignment = {
        wrapText: true,
        vertical: 'middle',
        horizontal: 'center'
    };
    setBackground(worksheet.getCell("L11"));

    worksheet.getCell("M11").value = {
        richText: [
            {
                text: 'Không đạt\n',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nFailed\n',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    worksheet.getCell(`M11`).alignment = {
        wrapText: true,
        vertical: 'middle',
        horizontal: 'center'
    };
    setBackground(worksheet.getCell("M11"));

    //
    worksheet.getCell("N10").value = {
        richText: [
            {
                text: 'Xét nghiệm nhanh (nếu có) \n(vi sinh, hóa lý)',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nRapid test (if any) \n(microbiological,\n chemical and physical)',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    worksheet.getCell(`N10`).alignment = {
        wrapText: true,
        vertical: 'middle',
        horizontal: 'center'
    };
    setBackground(worksheet.getCell("N10"));

    worksheet.getCell("N11").value = {
        richText: [
            {
                text: 'Đạt\n',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nPassed\n',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    worksheet.getCell(`N11`).alignment = {
        wrapText: true,
        vertical: 'middle',
        horizontal: 'center'
    };
    setBackground(worksheet.getCell("N11"));

    worksheet.getCell("O11").value = {
        richText: [
            {
                text: 'Không đạt\n',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nFailed\n',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    worksheet.getCell(`O11`).alignment = {
        wrapText: true,
        vertical: 'middle',
        horizontal: 'center'
    };
    setBackground(worksheet.getCell("O11"));

    worksheet.getCell("P10").value = {
        richText: [
            {
                text: 'Biện pháp xử lý /Ghi chú',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nHandling measures /Notes',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    worksheet.getCell(`P10`).alignment = {
        wrapText: true,
        vertical: 'middle',
        horizontal: 'center'
    };
    setBackground(worksheet.getCell("P10"));

    setBackground(worksheet.getCell("H11"));
    setBackground(worksheet.getCell("I11"));
    setBorder(worksheet.getCell("H11"));
    setBorder(worksheet.getCell("I11"));
    
    worksheet.mergeCells(`A10:A11`);
    worksheet.mergeCells(`B10:B11`);
    worksheet.mergeCells(`C10:C11`);
    worksheet.mergeCells(`D10:D11`);
    worksheet.mergeCells(`E10:G10`);
    worksheet.mergeCells(`H10:I10`);
    // worksheet.mergeCells(`I10:I11`);
    worksheet.mergeCells(`J10:J11`);
    worksheet.mergeCells(`K10:K11`);
    worksheet.mergeCells(`L10:M10`);
    worksheet.mergeCells(`N10:O10`);
    worksheet.mergeCells(`P10:P11`);
    worksheet.mergeCells(`H11:I11`);

    ["A", "B", "C", "D", "E", "H", "J", "K", "L", "N", "P"].map((colName) => {
        worksheet.getCell(`${colName}10`).alignment = {
            wrapText: true,
            vertical: 'middle',
            horizontal: 'center'
        };

       setBorder(worksheet.getCell(`${colName}10`));
    })

    worksheet.getCell(`E11`).alignment = {
        wrapText: true,
        vertical: 'middle',
        horizontal: 'center'
    };
    setBorder(worksheet.getCell(`E11`));
    worksheet.getCell(`F11`).alignment = {
        wrapText: true,
        vertical: 'middle',
        horizontal: 'center'
    };
    setBorder(worksheet.getCell(`F11`));
    worksheet.getCell(`G11`).alignment = {
        wrapText: true,
        vertical: 'middle',
        horizontal: 'center'
    };
    setBorder(worksheet.getCell(`G11`));
    worksheet.getCell(`L11`).alignment = {
        wrapText: true,
        vertical: 'middle',
        horizontal: 'center'
    };
    setBorder(worksheet.getCell(`L11`));
    worksheet.getCell(`M11`).alignment = {
        wrapText: true,
        vertical: 'middle',
        horizontal: 'center'
    };
    setBorder(worksheet.getCell(`M11`));
    worksheet.getCell(`N11`).alignment = {
        wrapText: true,
        vertical: 'middle',
        horizontal: 'center'
    };
    setBorder(worksheet.getCell(`N11`));
    worksheet.getCell(`O11`).alignment = {
        wrapText: true,
        vertical: 'middle',
        horizontal: 'center'
    };
    setBorder(worksheet.getCell(`O11`));

    setBorder(worksheet.getCell(`I10`));
    setBorder(worksheet.getCell(`I11`));

    // worksheet.getCell("B10").alignment = {
    //     wrapText: true,
    //     vertical: 'top',
    //     horizontal: 'center'
    // };
    // worksheet.getCell("C10").alignment = {
    //     wrapText: true,
    //     vertical: 'top',
    //     horizontal: 'center'
    // };
    // worksheet.getCell("D10").alignment = {
    //     wrapText: true,
    //     vertical: 'top',
    //     horizontal: 'center'
    // };

    // const headerRowIA = worksheet.addRow([
    //     "TT\nNo.",
    //     "Tên thực phẩm\nFood name",
    //     "Thời gian nhập\n(ngày, giờ)\nStorage time (date, time)",
    //     "Khối lượng (kg/lít....)\nVolume (kg/ liter ....)",
    //     "Nơi cung cấp\nProvider",
    //     "",
    //     "",
    //     "",
    //     "",
    //     "",
    //     "Kiểm tra cảm quan (màu, mùi vị, trạng thái, bảo quản...)\nSensory checking (color, taste, state, preservation ...)",
    //     "",
    //     "Xét nghiệm nhanh (nếu có) (vi sinh, hóa lý)\nRapid test (if any) (microbiological, chemical and physical)",
    //     "",
    //     ""
    // ]);
    // console.log("headerRowIA", headerRowIA);

    // worksheet.addRow([
    //     "",
    //     "",
    //     "",
    //     "",
    //     "Tên cơ sở\nEstablishment name",
    //     "Địa chỉ, điện thoại\nAddress, phone",
    //     "Tên người giao hàng\nShipper name",
    //     "Chứng từ, hóa đơn\nVoucher, invoice",
    //     "Giấy ĐK VS thú y\nVeterinary hygiene registration certificate",
    //     "Giấy kiểm dịch\nQuarantine certificate",
    //     "Đạt\nPassed",
    //     "Không đạt\nFailed",
    //     "Đạt\nPassed",
    //     "Không đạt\nFailed",
    //     "Biện pháp xử lý /Ghi chú\nHandling measures/ Notes"
    // ]);
    worksheet.addRow([
        "1", "2", "3", "4", "5", "6", "7", "8", "", "9", "10", "11", "12", "13", "14", "15"
    ]);

    worksheet.getCell(`A12`).alignment = {
        vertical: 'middle',
        horizontal: 'center'
    };
    setBackground(worksheet.getCell("A12"));
    setBorder(worksheet.getCell("A12"));

    worksheet.getCell(`B12`).alignment = {
        vertical: 'middle',
        horizontal: 'center'
    };
    setBackground(worksheet.getCell("B12"));
    setBorder(worksheet.getCell("B12"));

    worksheet.getCell(`C12`).alignment = {
        vertical: 'middle',
        horizontal: 'center'
    };
    setBackground(worksheet.getCell("C12"));
    setBorder(worksheet.getCell("C12"));

    worksheet.getCell(`D12`).alignment = {
        vertical: 'middle',
        horizontal: 'center'
    };
    setBackground(worksheet.getCell("D12"));
    setBorder(worksheet.getCell("D12"));

    worksheet.getCell(`E12`).alignment = {
        vertical: 'middle',
        horizontal: 'center'
    };
    setBackground(worksheet.getCell("E12"));
    setBorder(worksheet.getCell("E12"));

    worksheet.getCell(`F12`).alignment = {
        vertical: 'middle',
        horizontal: 'center'
    };
    setBackground(worksheet.getCell("F12"));
    setBorder(worksheet.getCell("F12"));

    worksheet.getCell(`G12`).alignment = {
        vertical: 'middle',
        horizontal: 'center'
    };
    setBackground(worksheet.getCell("G12"));
    setBorder(worksheet.getCell("G12"));

    worksheet.getCell(`H12`).alignment = {
        vertical: 'middle',
        horizontal: 'center'
    };
    setBackground(worksheet.getCell("H12"));
    setBorder(worksheet.getCell("H12"));

    worksheet.getCell(`I12`).alignment = {
        vertical: 'middle',
        horizontal: 'center'
    };
    setBackground(worksheet.getCell("I12"));
    setBorder(worksheet.getCell("I12"));

    worksheet.getCell(`J12`).alignment = {
        vertical: 'middle',
        horizontal: 'center'
    };
    setBackground(worksheet.getCell("J12"));
    setBorder(worksheet.getCell("J12"));

    worksheet.getCell(`K12`).alignment = {
        vertical: 'middle',
        horizontal: 'center'
    };
    setBackground(worksheet.getCell("K12"));
    setBorder(worksheet.getCell("K12"));

    worksheet.getCell(`L12`).alignment = {
        vertical: 'middle',
        horizontal: 'center'
    };
    setBackground(worksheet.getCell("L12"));
    setBorder(worksheet.getCell("L12"));

    worksheet.getCell(`M12`).alignment = {
        vertical: 'middle',
        horizontal: 'center'
    };
    setBackground(worksheet.getCell("M12"));
    setBorder(worksheet.getCell("M12"));

    worksheet.getCell(`N12`).alignment = {
        vertical: 'middle',
        horizontal: 'center'
    };
    setBackground(worksheet.getCell("N12"));
    setBorder(worksheet.getCell("N12"));

    worksheet.getCell(`O12`).alignment = {
        vertical: 'middle',
        horizontal: 'center'
    };
    setBackground(worksheet.getCell("O12"));
    setBorder(worksheet.getCell("O12"));

    worksheet.getCell(`P12`).alignment = {
        vertical: 'middle',
        horizontal: 'center'
    };
    setBackground(worksheet.getCell("P12"));
    setBorder(worksheet.getCell("P12"));

    worksheet.mergeCells(`H12:I12`);

    // chỗ này cần lấy data đưa vào
    excelKT11Datas.forEach((data, index) => {
        const newRow = worksheet.addRow([
            index + 1,
            data.NguyenVatLieu,
            data.Ngay,
            data.TongKhoiLuongYeuCauSanXuat,
            data.TenCoSo,
            data.DienThoai + " - " + data.DiaChi,
            data.NguoiGiaoHang,
            data.ChungTuHoaDon, "", 
            data.GiayDangKyVeSinhThuY ? "x" : "-", data.GiayKiemDich ? "x" : "-", "x", "", "x"
        ]);

        worksheet.mergeCells(`H${newRow.number}:I${newRow.number}`);

        for(let i = 1; i <= 16; i++) {
            setBorder(worksheet.getCell(`${String.fromCharCode(64 + i)}${newRow.number}`));
        }
    });
    // worksheet.addRows([
    //     ["1", "TÉP", "17/8/2026", "15.0", "Hộ Kinh Doanh Hải Sản Phúc Vân", "0942311822-,KP 6, P.Tam Hiệp, Đồng Nai, Việt Nam", "Vân", "HÓA ĐƠN BÁN LẺ", "-", "-", "x", "", "x"]
    // ]);

    // II
    const sectionRowII = worksheet.addRow([""]);
    //   const sectionRowII = worksheet.addRow([
    //     "II. Thực phẩm khô và thực phẩm bao gói sẵn, phụ gia thực phẩm/ Dried foods and prepackaged foods, food additives:"
    // ]);
    worksheet.getCell(`A${sectionRowII.number}`).value = {
        richText: [
            {
                text: 'II. Thực phẩm khô và thực phẩm bao gói sẵn, phụ gia thực phẩm/',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nDried foods and prepackaged foods, food additives:',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };

    // Bảng 2
    worksheet.getCell(`A${sectionRowII.number + 1}`).value = {
        richText: [
            {
                text: 'TT',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nNo.',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    setPosition(worksheet.getCell(`A${sectionRowII.number + 1}`));
    setBackground(worksheet.getCell(`A${sectionRowII.number + 1}`));
    setBorder(worksheet.getCell(`A${sectionRowII.number + 1}`));

    worksheet.getCell(`B${sectionRowII.number + 1}`).value = {
        richText: [
            {
                text: 'Tên thực phẩm',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nFood name',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    setPosition(worksheet.getCell(`B${sectionRowII.number + 1}`));
    setBackground(worksheet.getCell(`B${sectionRowII.number + 1}`));
    setBorder(worksheet.getCell(`B${sectionRowII.number + 1}`));

    worksheet.getCell(`C${sectionRowII.number + 1}`).value = {
        richText: [
            {
                text: 'Tên cơ sở sản xuất',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nManufacturer name',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    setPosition(worksheet.getCell(`C${sectionRowII.number + 1}`));
    setBackground(worksheet.getCell(`C${sectionRowII.number + 1}`));
    setBorder(worksheet.getCell(`C${sectionRowII.number + 1}`));

    worksheet.getCell(`E${sectionRowII.number + 1}`).value = {
        richText: [
            {
                text: 'Địa chỉ sản xuất',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nManufacturing address',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    setPosition(worksheet.getCell(`E${sectionRowII.number + 1}`));
    setBackground(worksheet.getCell(`E${sectionRowII.number + 1}`));
    setBorder(worksheet.getCell(`E${sectionRowII.number + 1}`));

    worksheet.getCell(`F${sectionRowII.number + 1}`).value = {
        richText: [
            {
                text: 'Thời gian nhập (ngày, giờ)',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nEntry time (date, time)',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    setPosition(worksheet.getCell(`F${sectionRowII.number + 1}`));
    setBackground(worksheet.getCell(`F${sectionRowII.number + 1}`));
    setBorder(worksheet.getCell(`F${sectionRowII.number + 1}`));

    worksheet.getCell(`G${sectionRowII.number + 1}`).value = {
        richText: [
            {
                text: 'Khối lượng \nW(kg/lít....)',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nWeight (kg/\nWliter....)',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    setPosition(worksheet.getCell(`G${sectionRowII.number + 1}`));
    setBackground(worksheet.getCell(`G${sectionRowII.number + 1}`));
    setBorder(worksheet.getCell(`G${sectionRowII.number + 1}`));

    worksheet.getCell(`H${sectionRowII.number + 1}`).value = {
        richText: [
            {
                text: 'Nơi cung cấp',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nProvider',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    setPosition(worksheet.getCell(`H${sectionRowII.number + 1}`));
    setBackground(worksheet.getCell(`H${sectionRowII.number + 1}`));
    setBorder(worksheet.getCell(`H${sectionRowII.number + 1}`));

    worksheet.getCell(`L${sectionRowII.number + 1}`).value = {
        richText: [
            {
                text: 'Hạn sử dụng',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nExpiry date',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    setPosition(worksheet.getCell(`L${sectionRowII.number + 1}`));
    setBackground(worksheet.getCell(`L${sectionRowII.number + 1}`));
    setBorder(worksheet.getCell(`L${sectionRowII.number + 1}`));

    worksheet.getCell(`M${sectionRowII.number + 1}`).value = {
        richText: [
            {
                text: 'Điều kiện \nbảo quản \n(To thường/ \nlạnh...)',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
        ]
    };
    setPosition(worksheet.getCell(`M${sectionRowII.number + 1}`));
    setBackground(worksheet.getCell(`M${sectionRowII.number + 1}`));
    setBorder(worksheet.getCell(`M${sectionRowII.number + 1}`));

    worksheet.getCell(`N${sectionRowII.number + 1}`).value = {
        richText: [
            {
                text: 'Chứng từ, \nhóa đơn',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nVoucher, \ninvoice',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    setPosition(worksheet.getCell(`N${sectionRowII.number + 1}`));
    setBackground(worksheet.getCell(`N${sectionRowII.number + 1}`));
    setBorder(worksheet.getCell(`N${sectionRowII.number + 1}`));

    worksheet.getCell(`O${sectionRowII.number + 1}`).value = {
        richText: [
            {
                text: 'Kiểm tra cảm quan (nhãn, \nbao bì, bảo quản, hạn sử \ndụng...)',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nSensory checking (label, \npackaging, storage, expiry \ndate...)',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    setPosition(worksheet.getCell(`O${sectionRowII.number + 1}`));
    setBackground(worksheet.getCell(`O${sectionRowII.number + 1}`));
    setBorder(worksheet.getCell(`O${sectionRowII.number + 1}`));

    worksheet.getCell(`Q${sectionRowII.number + 1}`).value = {
        richText: [
            {
                text: 'Biện pháp \nxử lý /Ghi chú',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nHandling \nmeasures/ \nNotes',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    setPosition(worksheet.getCell(`Q${sectionRowII.number + 1}`));
    setBackground(worksheet.getCell(`Q${sectionRowII.number + 1}`));
    setBorder(worksheet.getCell(`Q${sectionRowII.number + 1}`));


    setPosition(worksheet.getCell(`C${sectionRowII.number + 2}`));
    setBackground(worksheet.getCell(`C${sectionRowII.number + 2}`));
    setBorder(worksheet.getCell(`C${sectionRowII.number + 2}`));

    setPosition(worksheet.getCell(`D${sectionRowII.number + 2}`));
    setBackground(worksheet.getCell(`D${sectionRowII.number + 2}`));
    setBorder(worksheet.getCell(`D${sectionRowII.number + 2}`));

    worksheet.getCell(`H${sectionRowII.number + 2}`).value = {
        richText: [
            {
                text: 'Tên cơ sở\n',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nEstablishment name',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    setPosition(worksheet.getCell(`H${sectionRowII.number + 2}`));
    setBackground(worksheet.getCell(`H${sectionRowII.number + 2}`));
    setBorder(worksheet.getCell(`H${sectionRowII.number + 2}`));

    worksheet.getCell(`I${sectionRowII.number + 2}`).value = {
        richText: [
            {
                text: 'Tên chủ \ngiao  hàng',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nDelivered \nby',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    setPosition(worksheet.getCell(`I${sectionRowII.number + 2}`));
    setBackground(worksheet.getCell(`I${sectionRowII.number + 2}`));
    setBorder(worksheet.getCell(`I${sectionRowII.number + 2}`));

    worksheet.getCell(`J${sectionRowII.number + 2}`).value = {
        richText: [
            {
                text: 'Địa chỉ, điện thoại',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nAddress, phone',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    setPosition(worksheet.getCell(`J${sectionRowII.number + 2}`));
    setBackground(worksheet.getCell(`J${sectionRowII.number + 2}`));
    setBorder(worksheet.getCell(`J${sectionRowII.number + 2}`));

    worksheet.getCell(`O${sectionRowII.number + 2}`).value = {
        richText: [
            {
                text: 'Đạt',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nPassed',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    setPosition(worksheet.getCell(`O${sectionRowII.number + 2}`));
    setBackground(worksheet.getCell(`O${sectionRowII.number + 2}`));
    setBorder(worksheet.getCell(`O${sectionRowII.number + 2}`));

    worksheet.getCell(`P${sectionRowII.number + 2}`).value = {
        richText: [
            {
                text: 'Không đạt',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nFailed',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    setPosition(worksheet.getCell(`P${sectionRowII.number + 2}`));
    setBackground(worksheet.getCell(`P${sectionRowII.number + 2}`));
    setBorder(worksheet.getCell(`P${sectionRowII.number + 2}`));

    worksheet.mergeCells(`C${sectionRowII.number + 1}:D${sectionRowII.number + 1}`);
    worksheet.mergeCells(`H${sectionRowII.number + 1}:K${sectionRowII.number + 1}`);
    worksheet.mergeCells(`O${sectionRowII.number + 1}:P${sectionRowII.number + 1}`);

    worksheet.mergeCells(`A${sectionRowII.number + 1}:A${sectionRowII.number + 2}`);
    worksheet.mergeCells(`B${sectionRowII.number + 1}:B${sectionRowII.number + 2}`);
    // worksheet.mergeCells(`C${sectionRowII.number + 1}:C${sectionRowII.number + 2}`);
    worksheet.mergeCells(`E${sectionRowII.number + 1}:E${sectionRowII.number + 2}`);
    worksheet.mergeCells(`F${sectionRowII.number + 1}:F${sectionRowII.number + 2}`);
    worksheet.mergeCells(`G${sectionRowII.number + 1}:G${sectionRowII.number + 2}`);
    worksheet.mergeCells(`L${sectionRowII.number + 1}:L${sectionRowII.number + 2}`);
    worksheet.mergeCells(`M${sectionRowII.number + 1}:M${sectionRowII.number + 2}`);
    worksheet.mergeCells(`N${sectionRowII.number + 1}:N${sectionRowII.number + 2}`);
    worksheet.mergeCells(`Q${sectionRowII.number + 1}:Q${sectionRowII.number + 2}`);

    worksheet.mergeCells(`J${sectionRowII.number + 2}:K${sectionRowII.number + 2}`);

    const newNumber2Row = worksheet.addRow([
        "1", "2", "3", "", "4", "5", "6", "7", "8", "9", "", "10", "11", "12", "13", "14", "15"
    ]);
    worksheet.mergeCells(`C${newNumber2Row.number}:D${newNumber2Row.number}`);
    worksheet.mergeCells(`J${newNumber2Row.number}:K${newNumber2Row.number}`);

    ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q"].map((colName) => {
        setPosition(worksheet.getCell(`${colName}${sectionRowII.number + 3}`));
        setBackground(worksheet.getCell(`${colName}${sectionRowII.number + 3}`));
        setBorder(worksheet.getCell(`${colName}${sectionRowII.number + 3}`));
    });



    // const headerRowIIB = worksheet.addRow([
    //     "TT\nNo.",
    //     "Tên thực phẩm\nFood name",
    //     "Tên cơ sở sản xuất\nManufacturer name",
    //     "Địa chỉ sản xuất\nManufacturing address",
    //     "Thời gian nhập (ngày, giờ)\nStorage time (date, time)",
    //     "Khối lượng (kg/lít....)\nVolume (kg/ liter ....)",
    //     "Tên cơ sở\nEstablishment name",
    //     "Tên chủ giao hàng\nDelivered by",
    //     "Địa chỉ, điện thoại\nAddress, phone",
    //     "Hạn sử dụng\nExpiry date",
    //     "Điều kiện bảo quản (To thường/ lạnh...)",
    //     "Chứng từ, hóa đơn\nVoucher, invoice",
    //     "Đạt\nPassed",
    //     "Không đạt\nFailed",
    //     "Biện pháp xử lý /Ghi chú\nHandling measures/ Notes"
    // ]);
    // headerRowIIB.eachCell((cell) => {
    //     cell.alignment = {
    //         wrapText: true,
    //         vertical: 'top',
    //     };
    // });
    // worksheet.addRow([
    //     "1", "2", "3", "4", "5", "6", "7", "8", "", "9", "10", "11", "12", "13", "14", "15"
    // ]);
    // chỗ này cần lấy data đưa vào
    // worksheet.addRows([
    //     ["1", "HẠT NÊM", "Công ty CPĐT  phát triển thực  phẩm Hà Nội", "", "TP.Hà Nội", "13/8/2026", "2 Bao", "Công Ty TNHH Vũ Phan Ngọc", "VŨ PHAN NGỌC", "143/12 KP9, P.Tam Hiệp, Biên Hoà, Đồng Nai", "0933842427", "20/9/28", "T° Thường", "Hóa Đơn Bán Lẻ", "X"]
    // ]);
    excelKT12Datas.forEach((data, index) => {
        const newRow = worksheet.addRow([
            index + 1,
            data.TenThucPham,
            data.TenCoSoSanXuat,
            "",
            data.DiaChiSanXuat,
            data.ThoiGianNhap,
            data.KhoiLuong,
            data.TenCoSoCungCap,
            data.TenChuGiaoHang,
            data.DiaChi,
            data.DienThoai,
            data.HanSuDung,
            data.DieuKienBaoQuan,
            data.ChungTuHoaDon,
            "X"
        ]);

        worksheet.mergeCells(`C${newRow.number}:D${newRow.number}`);

        for(let i = 1; i <= 17; i++) {
            setBorder(worksheet.getCell(`${String.fromCharCode(64 + i)}${newRow.number}`));
        }

        
        // ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q"].forEach(col => {
        //     console.log
        //     worksheet.getCell(`${col}${newRow.number}`).alignment = {
        //         wrapText: true,
        //         vertical: 'middle',
        //         horizontal: 'center'
        //     };
        // });
    });

    // // Format cho đẹp
    // ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O"].forEach((col) => {
    //     worksheet.getCell(`${col}7`).alignment = {
    //         wrapText: true,
    //         vertical: 'top',
    //     };
    // });

    // // merge rows
    worksheet.mergeCells(`D1:K1`);
    worksheet.mergeCells(`D2:K2`);
    // worksheet.mergeCells(`E${headerRowIA.number}:G${headerRowIA.number}`);
    // worksheet.mergeCells(`K${headerRowIA.number}:L${headerRowIA.number}`);
    // worksheet.mergeCells(`M${headerRowIA.number}:N${headerRowIA.number}`);
    // // merge columns
    // worksheet.mergeCells(`A${headerRowIA.number}:A${headerRowIA.number + 1}`);
    // worksheet.mergeCells(`B${headerRowIA.number}:B${headerRowIA.number + 1}`);
    // worksheet.mergeCells(`C${headerRowIA.number}:C${headerRowIA.number + 1}`);
    // worksheet.mergeCells(`D${headerRowIA.number}:D${headerRowIA.number + 1}`);

    // canh ô nằm giữa
    worksheet.getCell("D1").alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell("D2").alignment = { vertical: 'middle', horizontal: 'center' };

    // tô màu
    worksheet.getCell("D1").font = { bold: true };
    worksheet.getCell("D2").font = { 
        bold: true, 
        color: {
            argb: 'FF0000FF'
        } 
    };

    worksheet.getColumn('A').width = 5;
    worksheet.getColumn('B').width = 20;
    worksheet.getColumn('C').width = 15;
    worksheet.getColumn('D').width = 15;
    worksheet.getColumn('E').width = 20;
    worksheet.getColumn('F').width = 40;
    worksheet.getColumn('G').width = 20;
    worksheet.getColumn('H').width = 15;
    worksheet.getColumn('I').width = 15;
    worksheet.getColumn('J').width = 20;
    worksheet.getColumn('K').width = 20;
    worksheet.getColumn('L').width = 15;
    worksheet.getColumn('M').width = 15;
    worksheet.getColumn('N').width = 15;
    worksheet.getColumn('O').width = 20;
    worksheet.getColumn('P').width = 20;
    worksheet.getColumn('Q').width = 20;

    worksheet.getRow(10).height = 150;
    worksheet.getRow(11).height = 100;

    worksheet.getRow(sectionRowII.number + 1).height = 150;
    worksheet.getRow(sectionRowII.number + 2).height = 100;

    ["E", "F", "G", "H", "I", "J"].forEach(col => {
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
    createKTB1ExcelFile
};