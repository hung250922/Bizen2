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

async function createKTB4ExcelFile(payloadTitle, excelKTB4Datas){
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    worksheet.addRow(["", "", "MẪU BIỂU LƯU MẪU THỨC ĂN VÀ HỦY MẪU THỨC ĂN LƯU "]);
    worksheet.addRow(["", "", "FOOD SAMPLE STORAGE AND STORED FOOD SAMPLE \nCANCELLATION FORM"]);
    worksheet.getCell("C1").alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell("C2").alignment = { vertical: 'middle', horizontal: 'center' };
    
    // tô màu
    worksheet.getCell("C1").font = { bold: true, size: 20 };
    worksheet.getCell("C2").font = { 
        size: 20,
        bold: true, 
        color: {
            argb: 'FF0000FF'
        } 
    };

    worksheet.getCell("A5").value = {
        richText: [
            {
                text: 'Mẫu số 4: Nhãn mẫu thức ăn lưu/',
                font: {
                    color: { argb: 'FF000000' },
                    bold: true,
                }
            },
            {
                text: 'Form No. 4: Stored food sample label ',
                font: {
                    color: { argb: 'FF0000FF' },
                    bold: true,
                    italic: true
                }
            }
        ]
    };

    worksheet.getCell("A7").value = {
        richText: [
            {
                text: 'Bữa ăn/ ',
                font: {
                    color: { argb: 'FF000000' }
                }
            },
            {
                text: 'Meal: ',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true
                }
            },
            {
                text: 'Trưa (sáng/trưa/tối)/ ',
                font: {
                    color: { argb: 'FF000000' }
                }
            },
            {
                text: '(breakfast/lunch/dinner).',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true
                }
            }
        ]
    };

    worksheet.getCell("A8").value = {
        richText: [
            {
                text: 'Tên mẫu thức ăn/ ',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: 'Food sample name: Ca 1',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true
                }
            }
        ]
    };

    const [day, month, year] = payloadTitle.date.split('/').map(Number);
    const newDate = new Date(year, month - 1, day);

    worksheet.getCell("A9").value = {
        richText: [
            {
                text: 'Thời gian lấy/ ',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: 'Sampling time: ',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true
                }
            },
            {
                text: '10 giờ/ ',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: 'hour',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true
                }
            },
            {
                text: '……phút/',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: 'minute',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true
                }
            },
            {
                text: newDate.getDate() + ' ngày/',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: 'day',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true
                }
            },
            {
                text: (newDate.getMonth() + 1) + ' Tháng/',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: 'month ' + newDate.getFullYear(),
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true
                }
            },
            {
                text: ' năm/',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: 'year ……………………………..',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true
                }
            },
        ]
    };

    worksheet.getCell("A10").value = {
        richText: [
            {
                text: 'Người lấy mẫu/ ',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: 'Sampled by ',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true
                }
            },
            {
                text: '(Họ tên và chữ ký/ ',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: 'Full name and signature):',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true
                }
            },
             {
                text: '……………Hồ Mỹ Linh',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
        ]
    };

    worksheet.getCell("A12").value = {
        richText: [
            {
                text: 'Mẫu số 5: Mẫu biểu theo dõi lưu và hủy mẫu thức ăn lưu/ ',
                font: {
                    color: { argb: 'FF000000' },
                    bold: true,
                }
            },
            {
                text: 'Form No. 5: Storage tracking and stored food sample cancellation form',
                font: {
                    color: { argb: 'FF0000FF' },
                    bold: true,
                    italic: true
                }
            }
        ]
    };

    
    worksheet.getCell("A13").value = {
        richText: [
            {
                text: 'Địa điểm kiểm tra/ ',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: ' Checking place:',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true
                }
            },
            {
                text: '…………Canteen………………………………… ',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
        ]
    };

     // ************ Bảng
    worksheet.getCell("A16").value = {
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
    setPosition(worksheet.getCell("A16"));
    setBorder(worksheet.getCell("A16"));

    worksheet.getCell("B16").value = {
        richText: [
            {
                text: 'Tên mẫu thức ăn',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nFood sample name',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    setPosition(worksheet.getCell("B16"));
    setBorder(worksheet.getCell("B16"));
    
    worksheet.getCell("C16").value = {
        richText: [
            {
                text: 'Bữa ăn (giờ ăn...)',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nMeal (meal time ...)',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    setPosition(worksheet.getCell("C16"));
    setBorder(worksheet.getCell("C16"));

    worksheet.getCell("D16").value = {
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
    setPosition(worksheet.getCell("D16"));
    setBorder(worksheet.getCell("D16"));

    worksheet.getCell("E16").value = {
        richText: [
            {
                text: 'Khối lượng/ thể tích mẫu (gam/ml)',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nSample mass/ volume (gram/ml)',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    setPosition(worksheet.getCell("E16"));
    setBorder(worksheet.getCell("E16"));

    worksheet.getCell("F16").value = {
        richText: [
            {
                text: 'Dụng cụ chứa mẫu thức ăn lưu',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nFood sample container',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    setPosition(worksheet.getCell("F16"));
    setBorder(worksheet.getCell("F16"));

    worksheet.getCell("G16").value = {
        richText: [
            {
                text: 'Nhiệt độ bảo quản mẫu (°C)',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nSample storage temperature (°C).',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    setPosition(worksheet.getCell("G16"));
    setBorder(worksheet.getCell("G16"));

       worksheet.getCell("H16").value = {
        richText: [
            {
                text: 'Thời gian lấy mẫu (giờ, ngày, tháng, năm)',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nSampling time (hour, day, month, year)',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    setPosition(worksheet.getCell("H16"));
    setBorder(worksheet.getCell("H16"));

    worksheet.getCell("I16").value = {
        richText: [
            {
                text: 'Thời gian hủy mẫu (giờ, ngày, tháng, năm)',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nSample cancellation time (hour, day, month, year)',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    setPosition(worksheet.getCell("I16"));
    setBorder(worksheet.getCell("I16"));

    worksheet.getCell("J16").value = {
        richText: [
            {
                text: 'Ghi chú (chất lượng mẫu thức ăn lưu...)',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nNotes (quality of stored feed sample...)',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    setPosition(worksheet.getCell("J16"));
    setBorder(worksheet.getCell("J16"));

    worksheet.getCell("K16").value = {
        richText: [
            {
                text: 'Người lưu mẫu (ký và ghi rõ họ tên)',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nSample stored by (signature and full name)',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    setPosition(worksheet.getCell("K16"));
    setBorder(worksheet.getCell("K16"));

    worksheet.getCell("L16").value = {
        richText: [
            {
                text: 'Người hủy mẫu (ký và ghi rõ họ tên)',
                font: {
                    color: { argb: 'FF000000' },
                }
            },
            {
                text: '\nSample cancelled by (signature and full name)',
                font: {
                    color: { argb: 'FF0000FF' },
                    italic: true,
                }
            }
        ]
    };
    setPosition(worksheet.getCell("L16"));
    setBorder(worksheet.getCell("L16"));

    worksheet.addRow([
        "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"
    ]);
    ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"].map((colName) => {
        setPosition(worksheet.getCell(`${colName}${17}`));
        setBorder(worksheet.getCell(`${colName}${17}`));
    });

    // chỗ này cần lấy data đưa vào
    excelKTB4Datas.forEach((data, index) => {
        const newRow = worksheet.addRow([
            index + 1,
            data.TenMonAn,
            data.Ca + "-" + data.GioAn,
            data.SoLuongSuatAn,
            data.KhoiLuongTheTichMau,
            data.DungCuChuaMauThucAnLuu,
            data.NhietDoBaoQuanMau,
            "10:00 \n" + data.Ngay,
            "10:00 \n" + data.NextNgay,
            "Đạt"
        ]);

        worksheet.getCell(`H${newRow.number}`).alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };
        worksheet.getCell(`I${newRow.number}`).alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };

        for(let i = 1; i <= 12; i++) {
            setBorder(worksheet.getCell(`${String.fromCharCode(64 + i)}${newRow.number}`));
        }
    });

    worksheet.getColumn('A').width = 5;
    worksheet.getColumn('B').width = 25;
    worksheet.getColumn('C').width = 20;
    worksheet.getColumn('D').width = 15;
    worksheet.getColumn('E').width = 20;
    worksheet.getColumn('F').width = 20;
    worksheet.getColumn('G').width = 20;
    worksheet.getColumn('H').width = 20;
    worksheet.getColumn('I').width = 20;
    worksheet.getColumn('J').width = 20;
    worksheet.getColumn('K').width = 20;
    worksheet.getColumn('L').width = 20;

    worksheet.getRow(16).height = 150;

    worksheet.mergeCells(`C1:I1`);
    worksheet.mergeCells(`C2:I2`);

    // ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q"].forEach(col => {
    //     worksheet.getColumn(col).alignment = {
    //         wrapText: true,
    //         vertical: 'middle',
    //         horizontal: 'center'
    //     };
    // });

    return workbook;
    //adjustColumnWidth(worksheet);

    // worksheet.getCell('A8').alignment = {
    //     wrapText: true,
    //     vertical: 'top',
    // };

    //await workbook.xlsx.writeFile(`exported_file${Date.now().toLocaleString().replace(/[:\/]/g, '-')}.xlsx`);
}

module.exports = {
    createKTB4ExcelFile
};