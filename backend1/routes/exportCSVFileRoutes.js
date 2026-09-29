const { Op } = require('sequelize');
const { Patient, Medicine, ServicePrice } = require('../models');
const { writeToPath, writeToBuffer } = require("@fast-csv/format")
var authController = require('../middleware/auth');

module.exports = (router) => {
    // router.post(`/export_csv_file/test`, async(req, res) => {
    //     const path = `${__dirname}/people.csv`;
    //     const data = [{ name: 'Lê Thị Thu Hoài', id: 10 }, { name: 'Trần Xuân Giá', id: 20 }];
    //     const options = { headers: true, quoteColumns: true }

    //     writeToPath(path, data, options)
    //         .on("error", err => console.error(err))
    //         .on("finish", () => console.log("Done writing ..."))

    //     return res.json({
    //         status: 200,
    //         data: "test export csv file",
    //     });
    // });

    router.post(`/export_csv_file/patients`, authController.isBasicAuthAuthenticated, async(req, res) => {
        try {
            const options = { headers: true, quoteColumns: true }

            var filter = { is_active: true };

            if(req.body.company_id) {
                filter = {
                    [Op.and]: [
                        filter,
                        {
                            company_id: req.body.company_id
                        }
                    ]
                }
            }
    
            if(req.body.enterprise_id) {
                filter = {
                    [Op.and]: [
                        filter,
                        {
                            enterprise_id: req.body.enterprise_id
                        }
                    ]
                }
            }

            var allPatients = await Patient.findAll({ 
                where: filter,
                attributes: [
                    "name","yearOfBirth","passport","issued_by","gender","address","phone","email", "social_insurance"
                ],
                raw: true
            });

            writeToBuffer(allPatients, options).then(result => {
                return res.end(result);
            });
        } catch(error) {
            console.log("-- error", error)
            return res.end(null);
        }
    });

    router.post(`/export_csv_file/medicines`, authController.isBasicAuthAuthenticated, async(req, res) => {
        try {
            const options = { headers: true, quoteColumns: true };

            const allMedicines = await Medicine.findAll({ 
                where: {
                    [Op.and]: [
                        {
                            is_active: true
                        },
                        {
                            company_id: req.body.company_id
                        },
                    ] 
                },
                attributes: [
                    "code","name","unit","price","defaultOneDay","usage","medicine_group","quantity"
                ],
                raw: true
            });

            writeToBuffer(allMedicines, options).then(result => {
                return res.end(result);
            });
        } catch(error) {
            console.log("-- error", error)
            return res.end(null);
        }
    });

    router.post(`/export_csv_file/service_prices`, authController.isBasicAuthAuthenticated, async(req, res) => {
        try {
            const options = { headers: true, quoteColumns: true };

            const allServicePrices = await ServicePrice.findAll({ 
                where: {
                    [Op.and]: [
                        {
                            is_active: true
                        },
                        {
                            company_id: req.body.company_id
                        },
                    ] 
                },
                attributes: [
                    "name","price","is_initial_fee"
                ],
                raw: true
            });

            writeToBuffer(allServicePrices, options).then(result => {
                return res.end(result);
            });
        } catch(error) {
            console.log("-- error", error)
            return res.end(null);
        }
    });
}