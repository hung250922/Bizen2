require("dotenv").config();
const { Op } = require('sequelize');
var dateFormat = require("date-format");
var authController = require('../middleware/auth');
const { Company, ScheduleMedical, Patient, Doctor, Department } = require('../models');
const { 
    newRegisterEmailContext, extendCompanyEmailContext, confirmScheduleMedicalEmailContext, 
    forgotPasswordEmailContext, newAdsEmailContext 
} = require('../email_templates/index')

module.exports = (router) => {
    router.post(`/emails/send-confirm-schedule-medical`, authController.isBasicAuthAuthenticated, async(req, res) => {
    // router.post(`/emails/send-confirm-schedule-medical`, async(req, res) => {
        var firstScheduleMedical = await ScheduleMedical.findOne({
            where: {
                [Op.and]: [
                    {
                        is_active: true
                    },
                    {
                        id: req.body.schedule_medical_id
                    }
                ]
            },
            include: [
                {
                    model: Company,
                    as: 'companyDetail'
                },
                {
                    model: Patient,
                    as: 'patientDetail'
                },
                {
                    model: Doctor,
                    as: 'doctorDetail'
                },
                {
                    model: Department,
                    as: 'departmentDetail'
                },
            ],
        });
    
        if(firstScheduleMedical) {
            const { 
                schedule_number, companyDetail, patientDetail, doctorDetail, departmentDetail, 
                day_schedule, time_schedule, description, service_prices
            } = firstScheduleMedical;

            const service_price_names = service_prices && Object.values(service_prices).map(item => item.name).join(", ") || "";

            let payload = {
                sender: 'admin@moctrasoft.com',
                //to_address: ["nguyenducngochoang@gmail.com"],
                to_address: ["nguyenducngochoang@gmail.com", companyDetail.email, patientDetail.email],
                company_name: companyDetail?.name,
                patient_name: patientDetail?.name,
                schedule_number,
                passport: patientDetail?.passport,
                phone: patientDetail?.phone,
                yearOfBirth: patientDetail?.yearOfBirth,
                gender: patientDetail?.gender,
                department_name: departmentDetail?.name + " (" + departmentDetail?.specialist + ")",
                day_schedule: day_schedule && dateFormat("dd/MM/yyyy", day_schedule), 
                time_schedule: time_schedule,
                doctor_name: doctorDetail?.name,
                service_price_names: service_price_names,
                description
            }

            const response = await confirmScheduleMedicalEmailContext(payload);

            if(response.messageId) {
                return res.status(200).send({
                    status: 200,
                    data: response.messageId,
                    msg: "send email successful",
                }); 
            } else {
                return res.status(200).send({
                    status: 0,
                    data: null,
                    msg: "send email fail",
                }); 
            }
        } else {
            return res.status(200).send({
                status: 0,
                data: null,
                msg: "send email fail",
            });
        }
    })

    router.post(`/emails/new-register-company`, authController.isBasicAuthAuthenticated, async(req, res) => {
        var payload = {
            sender: 'admin@moctrasoft.com',
            to_address: ["nguyenducngochoang@gmail.com", req.body.companyEmail],
            companyName: req.body.companyName,
            createNewUserUrl: `${process.env.APP_URL}/create_new_user/` + req.body.register_code,
        }

        const response = await newRegisterEmailContext(payload);

        if(response.messageId) {
            return res.status(200).send({
                status: 200,
                data: response.messageId,
                msg: "send email successful",
            }); 
        } else {
            return res.status(200).send({
                status: 0,
                data: null,
                msg: "send email fail",
            }); 
        }
    })

    router.post(`/emails/extend-company`, authController.isBasicAuthAuthenticated, async(req, res) => {
        const { companyName, companyEmail, pricingType, dueDate } = req.body;

        var payload = {
            sender: 'admin@moctrasoft.com',
            to_address: ["nguyenducngochoang@gmail.com", companyEmail],
            companyName,
            pricingType,
            dueDate: dueDate && dateFormat("dd/MM/yyyy", new Date(dueDate))
        }

        const response = await extendCompanyEmailContext(payload);

        if(response.messageId) {
            return res.status(200).send({
                status: 200,
                data: response.messageId,
                msg: "send email successful",
            }); 
        } else {
            return res.status(200).send({
                status: 0,
                data: null,
                msg: "send email fail",
            }); 
        }
    })

    router.post(`/emails/forgot-password`, authController.isBasicAuthAuthenticated, async(req, res) => {
        const { name, email, provideNewPasswordUrl } = req.body;

        var payload = {
            sender: 'admin@moctrasoft.com',
            to_address: [email],
            name,
            provideNewPasswordUrl,
        }

        const response = await forgotPasswordEmailContext(payload);

        if(response.messageId) {
            return res.status(200).send({
                status: 200,
                data: response.messageId,
                msg: "send email successful",
            }); 
        } else {
            return res.status(200).send({
                status: 0,
                data: null,
                msg: "send email fail",
            }); 
        }
    })

    router.post(`/emails/send-ads`, async(req, res) => {
        console.log('send-ads-email', req.body)
        const CLIENT_INFOS = [
            {
                "name": "Phòng Khám Đa Khoa Dân Y",
                "email": "phongkhamdany@gmail.com"
            },
            {
                "name": "Phòng Khám Đa Khoa Liên Chi",
                "email": "tienlienchi@yahoo.com"
            },
            {
                "name": "Phòng Khám Đa Khoa Ái Nghĩa",
                "email": "info@ainghia.vn"
            },
            {
                "name": "Phòng Khám Đa Khoa Hạnh Phúc",
                "email": "pkdkhanhphuc99@gmail.com"
            },
            {
                "name": "Phòng Khám Đa Khoa Hạnh Phúc",
                "email": "pkd@buuhoapharma.com.vn"
            },
            {
                "name": "Phòng Khám Đa Khoa Quốc Tế Long Bình",
                "email": "mediclongbinh@yahoo.com.vn"
            },
            {
                "name": "Phòng Khám Đa Khoa Sài Gòn Tam Phước",
                "email": "PKDKSAIGONTAMPHUOC@gmail.com"
            },
            {
                "name": "Bệnh Viện Đa Khoa Tâm Hồng Phước",
                "email": "bvtamhongphuoc@gmail.com"
            },
            {
                "name": "Phòng Khám Đa Khoa Y Đức",
                "email": "hotro@phongkhamyduc.vn"
            },
            {
                "name": "Phòng Khám đa khoa Đông Sài Gòn",
                "email": "dakhoadongsaigon.whs@gmail.com"
            },
            {
                "name": "Phòng Khám Đa Khoa Hoàng Anh Đức",
                "email": "PKDKHOANGANHDUC@gmail.com"
            },
            {
                "name": "Phòng khám đa khoa  Hoàng Gia Tam Phước",
                "email": "pkdkhoanggiatp@gmail.com"
            },
        ];

        const CLIENT_INFOS_2 = [
            {
                "name": "Phòng Khám Đa Khoa An Bình Clinic ",
                "email": "phongkhamdakhoaanbinh@gmail.com"
            },
            {
                "name": "Phòng khám đa khoa Sài Gòn-Long Khánh",
                "email": "ketoan-pksglk@hotmail.com"
            },
            {
                "name": "Phòng khám đa khoa Tâm Bình An",
                "email": "cskh@pkdktambinhan.vn"
            },
            {
                "name": "PKĐK Y Dược Miền Đông Sài Gòn",
                "email": "yduocmiendongsaigon@gmail.com"
            },
            {
                "name": "Phòng Khám Đa Khoa Phúc Trạch",
                "email": "hohuu.11@gmail.com"
            },
            {
                "name": "Phòng Khám Đa Khoa Tam Phước",
                "email": "ytetamphuoc@gmail.com"
            },
            {
                "name": "Phòng Khám Đa Khoa Đại Phước",
                "email": "info@ytedaiphuoc.vn"
            },
            {
                "name": "Phòng Khám Đa Khoa Medical Tâm Đức",
                "email": "phongkhamtamduc270122@gmail.com"
            },
            {
                "name": "Phòng khám đa khoa Việt Hương",
                "email": "pkviethuong@gmail.com"
            },
            {
                "name": "PKĐK HOÀNG ANH ĐỨC",
                "email": "PKDKHOANGANHDUC@gmail.com"
            },
            {
                "name": "PHÒNG KHÁM ĐA KHOA LÊ THÀNH",
                "email": "dakhoalethanh@gmail.com"
            },
            {
                "name": "Phòng Khám Đa Khoa Xuân Triệu",
                "email": "cobemiko1390@gmail.com"
            },
            {
                "name": "Phòng Khám Thành Tâm ",
                "email": "Thanhtamdnclinic@gmail.com"
            },
            {
                "name": "Phòng Khám Đa Khoa Duy Khang",
                "email": "pklongthanh@dkgroup.health.vn"
            },
            {
                "name": "PKĐK HOÀNG TIẾN DŨNG",
                "email": "Pkdkhoangtiendung@gmail.com"
            },
            {
                "name": "Phòng khám đa khoa Ân Khánh",
                "email": "pkdkankhanh@gmail.com"
            },
            {
                "name": "Phòng khám đa khoa An Phúc",
                "email": "contact@phongkhamanphuc.vn"
            },
            {
                "name": "PKĐK HOÀNG DŨNG",
                "email": "pkdkhoangdung1@gmail.com"
            },
            {
                "name": "PHÒNG KHÁM ĐA KHOA NHÂN ÁI SÀI GÒN",
                "email": "pknhanaisaigon@gmail.com"
            },
            {
                "name": "Phòng khám đa khoa Nam Thành Phát",
                "email": "drthach@namthanhphatclinic.com"
            },
            {
                "name": "Phòng Khám Đa Khoa Tín Đức",
                "email": "tinducclinic@gmail.com"
            },
            {
                "name": "Phòng khám đa khoa Thiện Nhân",
                "email": "thiennhanclinic@gmail.com"
            },
            {
                "name": "Phòng khám đa khoa Sài Gòn Tâm Trí",
                "email": "saigontamtri@gmail.com"
            },
        ]

        let idx = 0;

        const sendEmailInterval = setInterval(async() => {
            var payload = {
                sender: 'admin@moctrasoft.com',
                to_address: [CLIENT_INFOS_2[idx].email],
                clientName: CLIENT_INFOS_2[idx].name
            }

            //console.log("--- idx", idx, payload)
    
            await newAdsEmailContext(payload);

            if(idx === (CLIENT_INFOS_2.length - 1)) {
                //console.log("--- FINISHED send email")
                clearInterval(sendEmailInterval);

                return res.status(200).send({
                    status: 1,
                    msg: "send email successful",
                }); 
            }

            idx++;
        }, 5000);



        // var payload = {
        //     sender: 'admin@moctrasoft.com',
        //     to_address: ["nguyenducngochoang@gmail.com", req.body.clientEmail],
        //     clientName: req.body.clientName
        // }

        // await newAdsEmailContext(payload);

        // return res.status(200).send({
        //     status: 1,
        //     msg: "send email successful",
        // }); 
    })
}