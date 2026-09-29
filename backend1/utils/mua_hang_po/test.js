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

const setGroupBackground = (cell) => {
	cell.fill = {
		type: 'pattern',
		pattern: 'solid',
		fgColor: {
			argb: 'FFFFE699'
		}
	};
	cell.font = {
		bold: true,
		color: { argb: 'FFFF0000' }
	};
}

const setTotalBackground = (cell) => {
	cell.fill = {
		type: 'pattern',
		pattern: 'solid',
		fgColor: {
			argb: 'FFC99A00'
		}
	};
	cell.font = {
		bold: true,
		color: { argb: 'FFFFFFFF' }
	};
}

const setPosition = (cell) => {
	cell.alignment = {
		wrapText: true,
		vertical: 'middle',
		horizontal: 'center'
	};
}

const addHeader = (worksheet) => {
	HEADERS.forEach((header, index) => {
		const cell = worksheet.getCell(`${String.fromCharCode(65 + index)}1`);
		cell.value = {
			richText: [
				{
					text: header,
					font: {
						color: { argb: 'FFFFFFFF' },
					}
				}
			]
		};
		setPosition(cell);
		setBorder(cell);
		setBackground(cell);
	});
	worksheet.getRow(1).height = 30;
};

const addDataRow = (worksheet, values, options = {}) => {
	const newRow = worksheet.addRow(values);
	if (options.height != null) newRow.height = options.height;
	for (let index = 1; index <= HEADERS.length; index++) {
		setBorder(newRow.getCell(index));
		setPosition(newRow.getCell(index));
	}
	return newRow;
};

const addTotalRow = (worksheet) => {
	const totalRow = worksheet.addRow(['Tổng:', ...Array(HEADERS.length - 1).fill(null)]);
	totalRow.eachCell({ includeEmpty: true }, (cell) => {
		setTotalBackground(cell);
		setBorder(cell);
		setPosition(cell);
	});
};

const HEADERS = [
	'Mã SO',
	'Mã PR',
	'Trạng thái',
	'Ngày',
	'Khách hàng',
	'Site ăn',
	'Số lượng cô Nga duyệt đặt hàng',
	'Nguyên vật liệu',
	'Nguyên vật liệu sản xuất',
];

async function createForm2PRFile(groups) {
	const workbook = new Excel.Workbook();
	const worksheet = workbook.addWorksheet('Sheet1');
	addHeader(worksheet);

	for (const group of Array.isArray(groups) ? groups : []) {
		const groupName = group.name;
		const groupRow = addDataRow(worksheet, [groupName, ...Array(HEADERS.length - 1).fill(null)], { height: 24 });
		for (let index = 1; index <= HEADERS.length; index++) {
			setGroupBackground(groupRow.getCell(index));
		}
		worksheet.mergeCells(`A${groupRow.number}:I${groupRow.number}`);

		for (const values of group.rows || []) {
			addDataRow(worksheet, values);
		}
	}

	addTotalRow(worksheet);
	[16, 16, 18, 14, 20, 24, 24, 30, 30].forEach((width, index) => { worksheet.getColumn(index + 1).width = width; });
	worksheet.autoFilter = { from: 'A1', to: `I${worksheet.rowCount - 1}` };
	    await workbook.xlsx.writeFile(`exported_file${Date.now().toLocaleString().replace(/[:\/]/g, '-')}.xlsx`);
    //return workbook;
}

module.exports = { createForm2PRFile, HEADERS };
