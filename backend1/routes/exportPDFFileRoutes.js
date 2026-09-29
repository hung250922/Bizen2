const { Op } = require('sequelize');
var fs = require('fs');
var Mustache = require('mustache');
const Puppeteer = require('puppeteer');
const dateFormat = require("date-format")
const { Export, ExportItem, Import, ImportItem, Customer, Company, Item } = require('../models');
const { formatter } = require('../utils/helpers')
const defaultPDFPageOptions = {
    format: 'A4',
    landscape: false,
    //-- 1in = 2.54cm = 96px
    margin: {
        top:    '0.5in',
        right:  '0.5in',
        bottom: '0.5in',
        left:   '0.5in',
    },
    displayHeaderFooter: false,
    printBackground: true
};

// Lưu ý: cài đặt Puppeteer trên Linux
// Đầu tiên chúng ta sẽ cài: "sudo apt-get install chromium-browser"
// sau đó thì chúng ta khai báo như sau:
// "const browser = await puppeteer.launch({
//    executablePath: '/usr/bin/chromium-browser'
//  })"

module.exports = (router) => {
    router.post(`/exports/pdf`, async(req, res) => {
        try {
            let { pageId } = req.body;
            pageId = "export-pdf";
            let pageData = {};

            let findExport = await Export.findOne({
                where: {
                    [Op.and]: [
                        {
                            is_active: true
                        },
                        {
                            id: req.body.id
                        }
                    ]
                },
                include: [
                    {
                        model: Company,
                        as: 'companyDetail'
                    },
                    {
                        model: Customer,
                        as: 'customerDetail'
                    },
                ]
            });

            let findExportItems = await ExportItem.findAll({
                where: {
                    [Op.and]: [
                        {
                            is_active: true
                        },
                        {
                            export_id: req.body.id
                        }
                    ]
                },
                    include: [
                    {
                        model: Item,
                        as: 'itemDetail'
                    }
                ]
            });

            const { companyDetail, customerDetail } = findExport || {};

            pageData.company_name = companyDetail?.name;
            // pageData.companyLogoUrl = WEB_SERVER_URL + '/uploads/companies/' + companyDetail?.logo_url;
            pageData.company_phone = companyDetail?.phone;
            pageData.customer_name = customerDetail?.name;
            pageData.export_date = dateFormat("dd/MM/yyyy", new Date(findExport?.export_date) || new Date());
            pageData.description = findExport?.description;

            let export_items = [];
            let total_money = 0;

            findExportItems.map((exportItem, idx) => {
                const { itemDetail, price, quantity } = exportItem;
                let _total_money = (price || 0) * (quantity || 0);
                total_money += _total_money;

                export_items.push({
                    index: idx + 1,
                    item_name: itemDetail?.item_name,
                    price: formatter.format(price || 0),
                    quantity: formatter.format(quantity || 0),
                    totalMoney: formatter.format(_total_money)
                })
            })

            pageData.export_items = export_items;
            pageData.total_money = formatter.format(total_money);
            pageData.day = (new Date()).getDate();
            pageData.month = (new Date()).getMonth() + 1;
            pageData.year = (new Date()).getFullYear();

            let pdf = await generatePDFFromHTML(pageId, pageData, defaultPDFPageOptions);
            res.set({ 'Content-Type': 'application/pdf', 'Content-Length': pdf.length })

            return res.send(pdf);
        } catch(error) {
            console.log("-- error", error)
            return res.json({ data: null, error: "created export pdf is failed" });
        }
    });

    router.post(`/imports/pdf`, async(req, res) => {
        try {
            console.log("---- /imports/pdf", req.body)
            let { pageId } = req.body;
            pageId = "import-pdf";
            let pageData = {};

            let findImport = await Import.findOne({
                where: {
                    [Op.and]: [
                        {
                            is_active: true
                        },
                        {
                            id: req.body.id
                        }
                    ]
                },
                include: [
                    {
                        model: Company,
                        as: 'companyDetail'
                    }
                ]
            });

            let findImportItems = await ImportItem.findAll({
                where: {
                    [Op.and]: [
                        {
                            is_active: true
                        },
                        {
                            import_id: req.body.id
                        }
                    ]
                },
                    include: [
                    {
                        model: Item,
                        as: 'itemDetail'
                    }
                ]
            });

            const { companyDetail } = findImport || {};

            pageData.company_name = companyDetail?.name;
            pageData.company_phone = companyDetail?.phone;
            pageData.vendor = findImport?.vendor;
            pageData.import_date = dateFormat("dd/MM/yyyy", new Date(findImport?.import_date) || new Date());
            pageData.description = findImport?.description;

            let import_items = [];
            let total_money = 0;

            findImportItems.map((importItem, idx) => {
                const { itemDetail, price, quantity } = importItem;
                let _total_money = (price || 0) * (quantity || 0);
                total_money += _total_money;

                import_items.push({
                    index: idx + 1,
                    item_name: itemDetail?.item_name,
                    price: formatter.format(price || 0),
                    quantity: formatter.format(quantity || 0),
                    totalMoney: formatter.format(_total_money)
                })
            })

            pageData.import_items = import_items;
            pageData.total_money = formatter.format(total_money);
            pageData.day = (new Date()).getDate();
            pageData.month = (new Date()).getMonth() + 1;
            pageData.year = (new Date()).getFullYear();

            let pdf = await generatePDFFromHTML(pageId, pageData, defaultPDFPageOptions);
            res.set({ 'Content-Type': 'application/pdf', 'Content-Length': pdf.length })

            return res.send(pdf);
        } catch(error) {
            console.log("-- error", error)
            return res.json({ data: null, error: "created import pdf is failed" });
        }
    });


    generatePDFFromHTML = async(pageId, viewData, pdfPageOptions = defaultPDFPageOptions, externalScripts = []) => {
        const viewTemplate = fs.readFileSync('./public/htmlTemplates/' + pageId + '.html', "utf-8");
        const viewOutput = Mustache.render(viewTemplate, viewData);

        //-- Prepare header and Footer if any
        if (pdfPageOptions && pdfPageOptions.displayHeaderFooter) {
            let headerFile, footerFile;
            // if (pdfPageOptions.headerTemplateName)
            //     headerFile = pdfPageOptions.headerTemplateName;
            // else
            //     //headerFile = pageId + '.pageHeader';
            //     headerFile = pageId + '-header';

            // const headerTemplate = fs.readFileSync(__dirname + '/templates/' + headerFile + '.html', "utf-8");
            // if (headerTemplate) {
            //     pdfPageOptions.headerTemplate = Mustache.render(headerTemplate, viewData);
            // }

            if (pdfPageOptions.footerTemplateName)
                footerFile = pdfPageOptions.footerTemplateName;
            else
                // footerFile = pageId + '.pageFooter';
                footerFile = pageId + '-footer';
            const footerTemplate = fs.readFileSync('./public/htmlTemplates/' + footerFile + '.html', "utf-8");
            if (footerTemplate)
                pdfPageOptions.footerTemplate = Mustache.render(footerTemplate, viewData);
        }

        const browser = await Puppeteer.launch({
            headless: true, 
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            executablePath: '/usr/bin/chromium-browser'
        });

        const page = await browser.newPage();
        if (externalScripts) {
            //-- Load external javascripts
            for (let jscript of externalScripts)
                await page.addScriptTag({path: jscript});
        }

        try {
           await page.goto(`data:text/html,${viewOutput}`, { waitUntil: 'networkidle0', timeout: 25000 });
        } catch (e) {
           // console.log('--- error', e)
        }

        await page.setContent(viewOutput);

        const pdf = await page.pdf(pdfPageOptions);
        await page.close();
        await browser.close();

        return pdf;
    }
}