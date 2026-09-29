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


async function createKTB23ExcelFile(payloadTitle, execlKT23Datas){
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    worksheet.addRow(["", "MẪU BIỂU GHI CHÉP KIỂM THỰC BA BƯỚC"]);
    worksheet.addRow(["", "3-STEP FOOD CHECK FORM"]);
    worksheet.getCell("B1").alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell("B2").alignment = { vertical: 'middle', horizontal: 'center' };

    // tô màu
    worksheet.getCell("B1").font = { bold: true };
    worksheet.getCell("B2").font = { 
        bold: true, 
        color: {
            argb: 'FF0000FF'
        } 
    };

    worksheet.getCell("A5").value = {
        richText: [
            {
                text: 'Mẫu số 2: Kiểm tra khi chế biến thức ăn (bước 2)/ ',
                font: {
                    color: { argb: 'FF000000' },
                    bold: true,
                }
            },
            {
                text: 'form No. 2: Checking upon food processing',
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
                text: 'Tên mẫu thức ăn/',
                font: {
                    color: { argb: 'FF000000' }
                }
            },
            {
                text: 'Food sample name: ' + payloadTitle.ca,
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
                text: 'Người kiểm tra/ ',
                font: {
                    color: { argb: 'FF000000' }
                }
            },
            {
                text: 'Checked by: …NGUYỄN TUẤN ANH',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true
                }
            }
        ]
    };

    const [day, month, year] = payloadTitle.date.split('/').map(Number);
    const newDate = new Date(year, month - 1, day);
    worksheet.getCell("A8").value = {
        richText: [
            {
                text: 'Thời gian kiểm tra/ Checking time: ' + `7 giờ/hour 30 phút/minute ngày/day ${newDate.getDate()} Tháng/month ${newDate.getMonth() + 1} năm/year ${newDate.getFullYear()}`,
                font: {
                    color: { argb: 'FF000000' },
                }
            }
        ]
    };
    worksheet.getCell("A9").value = {
        richText: [
            {
                text: 'Địa điểm kiểm tra/ ',
                font: {
                    color: { argb: 'FF000000' }
                }
            },
            {
                text: 'Checking place: ' + payloadTitle.client_code,
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true
                }
            }
        ]
    };

    // ************ Bảng
    worksheet.getCell("A12").value = {
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
    setPosition(worksheet.getCell("A12"));
    setBorder(worksheet.getCell("A12"));

    worksheet.getCell("B12").value = {
        richText: [
            {
                text: 'Ca/bữa ăn (Bữa ăn, giờ ăn...)',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nShift/ meal (Meal, meal time...)',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    setPosition(worksheet.getCell("B12"));
    setBorder(worksheet.getCell("B12"));

     worksheet.getCell("C12").value = {
        richText: [
            {
                text: 'Tên món ăn',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nFood name.',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    setPosition(worksheet.getCell("C12"));
    setBorder(worksheet.getCell("C12"));

    worksheet.getCell("D12").value = {
        richText: [
            {
                text: 'Nguyên liệu chính để chế biến (tên, số lượng...)',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nMain ingredients for processing (name, volume ...)',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    setPosition(worksheet.getCell("D12"));
    setBorder(worksheet.getCell("D12"));

    worksheet.getCell("E12").value = {
        richText: [
            {
                text: 'Số lượng/ số suất ăn',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nVolume/ number of servings',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    setPosition(worksheet.getCell("E12"));
    setBorder(worksheet.getCell("E12"));

    worksheet.getCell("F12").value = {
        richText: [
            {
                text: 'Thời gian sơ chế xong (ngày, giờ)',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nTime for preliminary processing done (date, time)',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    setPosition(worksheet.getCell("F12"));
    setBorder(worksheet.getCell("F12"));

    worksheet.getCell("G12").value = {
        richText: [
            {
                text: 'Thời gian chế biến xong (ngày, giờ)',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nTime for processing done (date, time)',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    setPosition(worksheet.getCell("G12"));
    setBorder(worksheet.getCell("G12"));

    worksheet.getCell("H12").value = {
        richText: [
            {
                text: 'Kiểm tra điều kiện vệ sinh (từ thời điểm bắt đầu sơ chế, chế biến cho đến khi thức ăn được chế biến xong)',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nChecking sanitary conditions (from preliminary processing and processing until finishing)',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    setPosition(worksheet.getCell("H12"));
    setBorder(worksheet.getCell("H12"));

    worksheet.getCell("K12").value = {
        richText: [
            {
                text: 'Kiểm tra cảm  quan (màu, mùi vị, trạng thái, bảo quản...)',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nSensory checking (color, taste, state, preservation ...)',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    setPosition(worksheet.getCell("K12"));
    setBorder(worksheet.getCell("K12"));

    worksheet.getCell("M12").value = {
        richText: [
            {
                text: 'Biện pháp xử lý /Ghi chú',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nHandling measures/ Notes',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    setPosition(worksheet.getCell("M12"));
    setBorder(worksheet.getCell("M12"));


    worksheet.getCell("H13").value = {
        richText: [
            {
                text: 'Người tham gia chế biến',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nProcessed by',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    setPosition(worksheet.getCell("H13"));
    setBorder(worksheet.getCell("H13"));
    
    worksheet.getCell("I13").value = {
        richText: [
            {
                text: 'Trang thiết bị dụng cụ',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nEquipment and tools',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    setPosition(worksheet.getCell("I13"));
    setBorder(worksheet.getCell("I13"));

     worksheet.getCell("J13").value = {
        richText: [
            {
                text: 'Khu vực chế biến và phụ trợ',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nProcessing and auxiliary area',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    setPosition(worksheet.getCell("J13"));
    setBorder(worksheet.getCell("J13"));

    worksheet.getCell("K13").value = {
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
    setPosition(worksheet.getCell("K13"));
    setBorder(worksheet.getCell("K13"));

    worksheet.getCell("L13").value = {
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
    setPosition(worksheet.getCell("L13"));
    setBorder(worksheet.getCell("L13"));
    // const headerRowI = worksheet.addRow([
    //     "TT\nNo.",
    //     "Ca/bữa ăn (Bữa ăn, giờ ăn...)\nShift/ meal (Meal, meal time...)",
    //     "Tên món ăn\nFood name",
    //     "Nguyên liệu chính để chế biến (tên, số lượng...)\nMain ingredients for processing (name, volume ...)",
    //     "Số lượng/ số suất ăn\nVolume/ number of servings",
    //     "Thời gian sơ chế xong (ngày, giờ)\nTime for preliminary processing done (date, time)",
    //     "Thời gian chế biến xong (ngày, giờ)\nTime for processing done (date, time)",
    //     "Người tham gia chế biến\nProcessed by",
    //     "Trang thiết bị dụng cụ\nEquipment and tools",
    //     "Khu vực chế biến và phụ trợ\nProcessing and auxiliary area",
    //     "Đạt\nPassed",
    //     "Không đạt\nFailed",
    //     "Biện pháp xử lý /Ghi chú\nHandling measures/ Notes"
    // ]);
    // headerRowI.eachCell((cell) => {
    //     cell.alignment = {
    //         wrapText: true,
    //         vertical: 'top',
    //     };
    // });
    worksheet.addRow([
        "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"
    ]);
    ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"].map((colName) => {
        setPosition(worksheet.getCell(`${colName}${14}`));
        setBorder(worksheet.getCell(`${colName}${14}`));
    });

    // chỗ này cần lấy data đưa vào
    execlKT23Datas.forEach((data, index) => {
        const newRow = worksheet.addRow([
            index + 1,
            data.Ca + "-" + data.GioAn,
            data.TenMonAn,
            data.NguyenLieuChinh,
            data.SoLuongSuatAn,
            data.ThoiGianSoCheXong + "\n" + data.Ngay,
            data.ThoiGianCheBienXong + "\n" + data.Ngay,
            "ĐẠT","ĐẠT","ĐẠT","X"
        ]);
        worksheet.getCell(`F${newRow.number}`).alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };
        worksheet.getCell(`G${newRow.number}`).alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };

        for(let i = 1; i <= 13; i++) {
            setBorder(worksheet.getCell(`${String.fromCharCode(64 + i)}${newRow.number}`));
        }
    });
    // worksheet.addRows([
    //     ["1", "TÉP", "17/8/2026", "15.0", "Hộ Kinh Doanh Hải Sản Phúc Vân", "0942311822-,KP 6, P.Tam Hiệp, Đồng Nai, Việt Nam", "Vân", "HÓA ĐƠN BÁN LẺ", "-", "-", "x", "", "x"]
    // ]);

    //******* */ II
    const sectionRowII = worksheet.addRow([""]);
    worksheet.getCell(`A${sectionRowII.number}`).value = {
        richText: [
            {
                text: 'Mẫu số 3: Kiểm tra trước khi ăn(bước 3)/',
                font: {
                    color: { argb: 'FF000000' },
                    bold: true,
                }
            },
            {
                text: 'form No. 3: Check before eating',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                    bold: true
                }
            }
        ]
    };

    worksheet.getCell(`A${sectionRowII.number + 1}`).value = {
        richText: [
            {
                text: 'Địa điểm kiểm tra/ ',
                font: {
                    color: { argb: 'FF000000' },
                    bold: true,
                }
            },
            {
                text: 'Checking place: ' + payloadTitle.client_code,
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                    bold: true
                }
            }
        ]
    };

    worksheet.getCell(`A${sectionRowII.number + 2}`).value = {
        richText: [
            {
                text: 'Người kiểm tra/',
                font: {
                    color: { argb: 'FF000000' },
                    bold: true,
                }
            },
            {
                text: 'Checked by: NGUYỄN TUẤN ANH',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                    bold: true
                }
            }
        ]
    };

    worksheet.getCell(`A${sectionRowII.number + 3}`).value = {
        richText: [
            {
                text: 'Thời gian kiểm tra/',
                font: {
                    color: { argb: 'FF000000' },
                    bold: true,
                }
            },
            {
                text: 'Checking time: 09:50 ' + payloadTitle.date,
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                    bold: true
                }
            }
        ]
    };

    worksheet.getCell(`D${sectionRowII.number + 3}`).value = {
        richText: [
            {
                text: 'Tên mẫu thức ăn/ ',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: 'Food sample name: ' + payloadTitle.ca,
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true
                }
            }
        ]
    };


    // ************ Bảng 2
    worksheet.getCell(`A${sectionRowII.number + 4}`).value = {
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
    setPosition(worksheet.getCell(`A${sectionRowII.number + 4}`));
    setBorder(worksheet.getCell(`A${sectionRowII.number + 4}`));

    worksheet.getCell(`B${sectionRowII.number + 4}`).value = {
        richText: [
            {
                text: 'Ca/bữa ăn (Bữa ăn, giờ ăn...)',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nShift/ meal (Meal, meal time...)',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    setPosition(worksheet.getCell(`B${sectionRowII.number + 4}`));
    setBorder(worksheet.getCell(`B${sectionRowII.number + 4}`));

    worksheet.getCell(`C${sectionRowII.number + 4}`).value = {
        richText: [
            {
                text: 'Tên món ăn',
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
    setPosition(worksheet.getCell(`C${sectionRowII.number + 4}`));
    setBorder(worksheet.getCell(`C${sectionRowII.number + 4}`));

    worksheet.getCell(`D${sectionRowII.number + 4}`).value = {
        richText: [
            {
                text: 'Số lượng suất ăn',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nNumber of servings',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    setPosition(worksheet.getCell(`D${sectionRowII.number + 4}`));
    setBorder(worksheet.getCell(`D${sectionRowII.number + 4}`));

    worksheet.getCell(`E${sectionRowII.number + 4}`).value = {
        richText: [
            {
                text: 'Thời gian chia món ăn xong (ngày, giờ)',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nTime for food division done (date, time)',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    setPosition(worksheet.getCell(`E${sectionRowII.number + 4}`));
    setBorder(worksheet.getCell(`E${sectionRowII.number + 4}`));

    worksheet.getCell(`F${sectionRowII.number + 4}`).value = {
        richText: [
            {
                text: 'Thời gian bắt đầu ăn (ngày, giờ)',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nTime for starting eating (date, time)',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    setPosition(worksheet.getCell(`F${sectionRowII.number + 4}`));
    setBorder(worksheet.getCell(`F${sectionRowII.number + 4}`));

    worksheet.getCell(`G${sectionRowII.number + 4}`).value = {
        richText: [
            {
                text: 'Dụng cụ chia, chứa đựng, che đậy, bảo quản thức ăn',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nInstruments for dividing, storing, covering and preserving food',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    setPosition(worksheet.getCell(`G${sectionRowII.number + 4}`));
    setBorder(worksheet.getCell(`G${sectionRowII.number + 4}`));

    worksheet.getCell(`H${sectionRowII.number + 4}`).value = {
        richText: [
            {
                text: 'Kiểm tra cảm  quan (màu, mùi vị, trạng thái, bảo quản...)',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nSensory checking (color, taste, state, preservation ...)',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    setPosition(worksheet.getCell(`H${sectionRowII.number + 4}`));
    setBorder(worksheet.getCell(`H${sectionRowII.number + 4}`));

    worksheet.getCell(`H${sectionRowII.number + 5}`).value = {
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
    setPosition(worksheet.getCell(`H${sectionRowII.number + 5}`));
    setBorder(worksheet.getCell(`H${sectionRowII.number + 5}`));

    worksheet.getCell(`I${sectionRowII.number + 5}`).value = {
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
    setPosition(worksheet.getCell(`I${sectionRowII.number + 5}`));
    setBorder(worksheet.getCell(`I${sectionRowII.number + 5}`));


    worksheet.getCell(`J${sectionRowII.number + 4}`).value = {
        richText: [
            {
                text: 'Biện pháp xử lý /Ghi chú',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nHandling measures/ Notes',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    setPosition(worksheet.getCell(`J${sectionRowII.number + 4}`));
    setBorder(worksheet.getCell(`J${sectionRowII.number + 4}`));

    // const titleMS3Row = worksheet.addRow(["Mẫu số 3: Kiểm tra trước khi ăn(bước 3)/ form No. 3: Check before eating"]);
    // titleMS3Row.font = { bold: true };
    // worksheet.addRow(["Địa điểm kiểm tra/ Checking place:", payloadTitle.client_code]);
    // worksheet.addRow(["Người kiểm tra/ Checked by:", "NGUYỄN TUẤN ANH"]);
    // worksheet.addRow(["Thời gian kiểm tra/ Checking time:", "09:50" + " " + payloadTitle.date]);

    // const headerRowII = worksheet.addRow([
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
    // headerRowII.eachCell((cell) => {
    //     cell.alignment = {
    //         wrapText: true,
    //         vertical: 'top',
    //     };
    // });
    worksheet.addRow([
        "", "1", "2", "3", "4", "5", "6", "7", "8", "9"
    ]);

    ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"].map((colName) => {
        setPosition(worksheet.getCell(`${colName}${sectionRowII.number + 6}`));
        setBorder(worksheet.getCell(`${colName}${sectionRowII.number + 6}`));
    });
    // // chỗ này cần lấy data đưa vào
    execlKT23Datas.forEach((data, index) => {
        const newRow = worksheet.addRow([
            index + 1,
            data.Ca + "-" + data.GioAn,
            data.TenMonAn,
            data.SoLuongSuatAn,
            data.ThoiGianChiaMonAnXong + "\n" + data.Ngay,
            data.ThoiGianBatDauAn + "\n" + data.Ngay,
            "ĐẠT",
            "X"
        ]);

        worksheet.getCell(`E${newRow.number}`).alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };
        worksheet.getCell(`F${newRow.number}`).alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };

        for(let i = 1; i <= 10; i++) {
            setBorder(worksheet.getCell(`${String.fromCharCode(64 + i)}${newRow.number}`));
        }
    });


    worksheet.getColumn('A').width = 5;
    worksheet.getColumn('B').width = 15;
    worksheet.getColumn('C').width = 20;
    worksheet.getColumn('D').width = 40;
    worksheet.getColumn('E').width = 15;
    worksheet.getColumn('F').width = 20;
    worksheet.getColumn('G').width = 20;
    worksheet.getColumn('H').width = 15;
    worksheet.getColumn('I').width = 15;
    worksheet.getColumn('J').width = 15;
    worksheet.getColumn('K').width = 15;
    worksheet.getColumn('L').width = 15;
    worksheet.getColumn('M').width = 15;

    worksheet.getRow(12).height = 150;
    worksheet.getRow(13).height = 100;
    worksheet.getRow(sectionRowII.number + 4).height = 150;
    worksheet.getRow(sectionRowII.number + 5).height = 100;

    worksheet.mergeCells(`B1:L1`);
    worksheet.mergeCells(`B2:L2`);
    worksheet.mergeCells(`A12:A13`);
    worksheet.mergeCells(`B12:B13`);
    worksheet.mergeCells(`C12:C13`);
    worksheet.mergeCells(`D12:D13`);
    worksheet.mergeCells(`E12:E13`);
    worksheet.mergeCells(`F12:F13`);
    worksheet.mergeCells(`G12:G13`);
    worksheet.mergeCells(`M12:M13`);
  
    worksheet.mergeCells(`H12:J12`);
    worksheet.mergeCells(`K12:L12`);

    worksheet.mergeCells(`A${sectionRowII.number + 4}:A${sectionRowII.number + 5}`);
    worksheet.mergeCells(`B${sectionRowII.number + 4}:B${sectionRowII.number + 5}`);
    worksheet.mergeCells(`C${sectionRowII.number + 4}:C${sectionRowII.number + 5}`);
    worksheet.mergeCells(`D${sectionRowII.number + 4}:D${sectionRowII.number + 5}`);
    worksheet.mergeCells(`E${sectionRowII.number + 4}:E${sectionRowII.number + 5}`);
    worksheet.mergeCells(`F${sectionRowII.number + 4}:F${sectionRowII.number + 5}`);
    worksheet.mergeCells(`G${sectionRowII.number + 4}:G${sectionRowII.number + 5}`);
    worksheet.mergeCells(`J${sectionRowII.number + 4}:J${sectionRowII.number + 5}`);
    worksheet.mergeCells(`H${sectionRowII.number + 4}:I${sectionRowII.number + 4}`);

    ["D"].forEach(col => {
        worksheet.getColumn(col).alignment = {
            wrapText: true,
            vertical: 'middle',
            horizontal: 'center'
        };
    });

    // worksheet.getRow(sectionRowII.number + 1).height = 150;
    // worksheet.getRow(sectionRowII.number + 2).height = 100;

    return workbook;
    // worksheet.addRows([
    //     ["1", "HẠT NÊM", "Công ty CPĐT  phát triển thực  phẩm Hà Nội", "", "TP.Hà Nội", "13/8/2026", "2 Bao", "Công Ty TNHH Vũ Phan Ngọc", "VŨ PHAN NGỌC", "143/12 KP9, P.Tam Hiệp, Biên Hoà, Đồng Nai", "0933842427", "20/9/28", "T° Thường", "Hóa Đơn Bán Lẻ", "X"]
    // ]);

    //adjustColumnWidth(worksheet);

    // worksheet.getCell('A8').alignment = {
    //     wrapText: true,
    //     vertical: 'top',
    // };

    //await workbook.xlsx.writeFile(`exported_file${Date.now().toLocaleString().replace(/[:\/]/g, '-')}.xlsx`);
}

module.exports = {
    createKTB23ExcelFile
};