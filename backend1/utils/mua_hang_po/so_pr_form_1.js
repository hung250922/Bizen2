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

async function createSO_PRForm1ExcelFile(payloadTitle, datas){
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
				text: 'Bếp',
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
				text: 'Ca',
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
				text: 'Site ăn',
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
				text: 'Cơ cấu menu',
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
				text: 'Món ăn BOM',
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
				text: 'Số lượng suất ăn dự báo',
				font: {
					color: { argb: 'FFFFFFFF' },
				}
			}
		]
	};
	setPosition(worksheet.getCell("L3"));
	setBorder(worksheet.getCell("L3"));
	setBackground(worksheet.getCell("L3"));

	worksheet.getCell("M3").value = {
		richText: [
			{
				text: 'Khối lượng yêu cầu sản xuất',
				font: {
					color: { argb: 'FFFFFFFF' },
				}
			}
		]
	};
	setPosition(worksheet.getCell("M3"));
	setBorder(worksheet.getCell("M3"));
	setBackground(worksheet.getCell("M3"));

	// worksheet.getCell("N3").value = {
	// 	richText: [
	// 		{
	// 			text: 'Nguyên vật liệu',
	// 			font: {
	// 				color: { argb: 'FFFFFFFF' },
	// 			}
	// 		}
	// 	]
	// };
	// setPosition(worksheet.getCell("N3"));
	// setBorder(worksheet.getCell("N3"));
	// setBackground(worksheet.getCell("N3"));

	/// chỗ này cần lấy data đưa vào
	let previousSO = null;

	if(datas && datas.length > 0) {
		datas.forEach((data, index) => {
			const newRow = worksheet.addRow([
				data.MaSO, data.MaPR, data.TrangThai, data.Ngay, data.Bep, data.KhachHang, data.Ca, data.SiteAn, 
				data.CoCauSuatAn, data.CoCauMenu, data.MonAnBOM, data.SoLuongDuBao, 
				data.NguyenLieu + " " + Math.round(data.KhoiLuongYeuCauSanXuat * 100)/100 + " " + data.DonViTinhMuaHang
			]);

			for(let i = 1; i <= 13; i++) {
				setBorder(worksheet.getCell(`${String.fromCharCode(64 + i)}${newRow.number}`));
			}

			// ** xuống dòng cho BOM MÓN ĂN & NGUYÊN LIỆU CHO KIỂM THỰC BƯỚC 2
			// ["A", "B", "C", "D", "E", "F", "G", "I", "J", "K", "L", "M", "N", "O", "P", "Q"].forEach(col => {
			//     worksheet.getCell(`${col}${newRow.number}`).alignment = {
			//         wrapText: true,
			//         vertical: 'middle',
			//         horizontal: 'center'
			//     };
			// });

			worksheet.getCell(`K${newRow.number}`).alignment = {
				wrapText: true,
				vertical: 'middle',
				horizontal: 'center'
			};

			worksheet.getCell(`J${newRow.number}`).alignment = {
				wrapText: true,
				vertical: 'middle',
				horizontal: 'center'
			};
			
			// ** merge cho SO
			if (previousSO === null) {
				previousSO = { value: data.MaSO, startRow: newRow.number };
			} else if (previousSO.value !== data.MaSO) {
				if (previousSO.startRow !== newRow.number - 1) {
					worksheet.mergeCells(`A${previousSO.startRow}:A${newRow.number - 1}`);
					worksheet.getCell(`A${previousSO.startRow}`).alignment = {
						wrapText: true,
						vertical: 'middle',
						horizontal: 'center'
					};
				}
				previousSO = { value: data.MaSO, startRow: newRow.number };
			}

			// merge the last group
			if (index === datas.length - 1 && previousSO.startRow !== newRow.number) {
				worksheet.mergeCells(`A${previousSO.startRow}:A${newRow.number}`);
				worksheet.getCell(`A${previousSO.startRow}`).alignment = {
					wrapText: true,
					vertical: 'middle',
					horizontal: 'center'
				};
			}
		});
	}

	worksheet.getColumn('A').width = 15;
	worksheet.getColumn('B').width = 15;
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
	createSO_PRForm1ExcelFile
};