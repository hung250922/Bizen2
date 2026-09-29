
const nodemailer = require("nodemailer");
const dotenv = require("dotenv")
dotenv.config()

const newRegisterEmailContext = async(payload) => {
    var { 
        sender, to_address, companyName, createNewUserUrl
    } = payload; 

    let transporter = nodemailer.createTransport({
        host: "mcloud.vn",
        port: 587,
        secure: false,
        auth: {
            user: "admin@moctrasoft.com",
            pass: "zhXy6c",
        },

    });

    const info = await transporter.sendMail({
        from: {
            name: "Mộc Trà Soft",
            address: sender
        },
        to: to_address,
        subject: "ĐĂNG KÝ PHÒNG KHÁM",
        html: `
             <body>
                <div style="width: 100%; height: 800px; background-color: #f5f5f5;line-height: 20px;">
                    <div style="width: 700px; height: 300px;margin-left: auto;margin-right: auto;padding-top: 30px;">
                        <div style="background-color: #43a047;padding-left: 30px;padding-top: 20px;padding-bottom: 20px;border-top-left-radius: 4px;border-top-right-radius: 4px;">
                            <strong style="font-size: 20px;color: #fff;">MỘC TRÀ SOFT</strong>
                        </div>
                        <div style="text-align: center; background-color: #fff; padding-top: 20px;">
                            <strong style="font-size: 20px;">ĐĂNG KÝ PHÒNG KHÁM</strong>
                        </div>
                        <div style="padding-top: 10px; padding-bottom: 10px; padding-left: 20px; padding-right: 20px; background-color: #fff;">
                            <div>
                                <strong style="font-size: 20px;">Kính gửi <span style="color: #e65100">"` + companyName + `"</span></strong>
                            </div>
                            <div style="margin-top: 20px;margin-bottom: 20px;">
                                <div style="margin-top:5px; font-size: 16px;">
                                    Cảm ơn quý khách hàng đã quan tâm đến phần mềm <span style="color: #e65100">QUẢN LÝ PHÒNG KHÁM</span> của chúng tôi.<br />
                                    Để hoàn tất việc đăng ký, quý khách vui lòng click vào nút "TẠO TÀI KHOẢN" bên dưới.
                                </div>
            
                                <a href="` + createNewUserUrl + `" target="_blank" style="text-decoration: none;">
                                    <div style="background-color: #3f51b5; color: #ffffff; margin-top: 20px; margin-left: auto;margin-right: auto; padding: 10px 10px; text-align: center; width: 160px; cursor: pointer;border-radius: 4px;">
                                        <strong>TẠO TÀI KHOẢN</strong>
                                    </div>
                                </a>
            
                                <div style="margin-top:40px">
                                    <strong>
                                        Thân mến, <br /> Mộc Trà Soft Team
                                    </strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
        `
    })

    console.log("Message sent: %s", info, info.accepted[0]);

    return info
}

const extendCompanyEmailContext = async(payload) => {
    var { 
        sender, to_address, companyName, pricingType, dueDate
    } = payload; 

    let transporter = nodemailer.createTransport({
        host: "mcloud.vn",
        port: 587,
        secure: false,
        auth: {
            user: "admin@moctrasoft.com",
            pass: "zhXy6c",
        },
    });

    const info = await transporter.sendMail({
        from: {
            name: "Mộc Trà Soft",
            address: sender
        },
        to: to_address,
        subject: "GIA HẠN PHÒNG KHÁM",
        html: `
            <body>
                <div style="width: 100%; height: 800px; background-color: #f5f5f5;line-height: 20px;">
                    <div style="width: 700px; height: 300px;margin-left: auto;margin-right: auto;padding-top: 30px;">
                        <div style="background-color: #43a047;padding-left: 30px;padding-top: 20px;padding-bottom: 20px;border-top-left-radius: 4px;border-top-right-radius: 4px;">
                            <strong style="font-size: 20px;color: #fff;">MỘC TRÀ SOFT</strong>
                        </div>
                        <div style="text-align: center; background-color: #fff; padding-top: 20px;">
                            <strong style="font-size: 20px;">GIA HẠN PHÒNG KHÁM</strong>
                        </div>
                        <div style="padding-top: 10px; padding-bottom: 10px; padding-left: 20px; padding-right: 20px; background-color: #fff;">
                            <div>
                                <strong style="font-size: 20px;">Kính gửi <span style="color: #e65100">` + companyName + `"</span></strong>
                            </div>
                            <div style="margin-top: 20px;margin-bottom: 20px;">
                                <div style="margin-top:5px; font-size: 16px;">
                                    Quý khách hàng đã gia hạn gói <span style="color: #e65100">` + pricingType + `"</span> thành công.<br />
                                    Thời gian sử dụng phần mềm đến ngày <span style="color: #43a047">` + dueDate + `</span>.
                                </div>
            
                                <div style="margin-top:40px">
                                    <strong>
                                        Thân mến, <br /> Mộc Trà Soft Team
                                    </strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
        `
    })

    console.log("Message sent: %s", info, info.accepted[0]);

    return info
}

const confirmScheduleMedicalEmailContext = async(payload) => {
    var { 
        sender, to_address, 
        company_name, patient_name, schedule_number, passport, 
        phone, yearOfBirth, gender, department_name, day_schedule, time_schedule, doctor_name, service_price_names
    } = payload; 

    let transporter = nodemailer.createTransport({
        host: "mcloud.vn",
        port: 587,
        secure: false,
        auth: {
            user: "admin@moctrasoft.com",
            pass: "zhXy6c",
        },

    });

    const info = await transporter.sendMail({
        from: {
            name: "Mộc Trà Soft",
            address: sender
        },
        to: to_address,
        subject: `XÁC NHẬN LỊCH ĐẶT KHÁM`,
        html: `
            <body>
                <div style="width: 100%; height: 800px; background-color: #f5f5f5;line-height: 20px;">
                    <div style="width: 700px; height: 300px;margin-left: auto;margin-right: auto;padding-top: 30px;">
                        <div style="background-color: #43a047;padding-left: 30px;padding-top: 20px;padding-bottom: 20px;border-top-left-radius: 4px;border-top-right-radius: 4px;">
                            <strong style="font-size: 20px;color: #fff;">MỘC TRÀ SOFT</strong>
                        </div>
                        <div style="text-align: center; background-color: #fff; padding-top: 20px;">
                            <strong style="font-size: 20px;">XÁC NHẬN LỊCH ĐẶT KHÁM</strong>
                        </div>
                        <div style="padding-top: 10px; padding-bottom: 10px; padding-left: 20px; padding-right: 20px; background-color: #fff; font-size: 16px">
                            <div>
                                <strong style="font-size: 20px;">Kính gửi ông/bà <span style="color: #e65100">` + patient_name + `</span></strong>
                            </div>
                            <div style="margin-top: 20px;margin-bottom: 20px;">
                                <div style="margin-top:5px">
                                    <strong style="font-size: 20px;"><span style="color: #e65100">` + company_name + `</span> xin gửi thông tin lịch đặt khám của khách hàng</strong>
                                </div>
                                <div style="margin-top:20px">
                                    <table style="width: 800px;">
                                        <colgroup>
                                            <col style="width: 40%"/>
                                            <col style="width: 60%"/>
                                        </colgroup>
                                        <tbody>
                                            <tr>
                                                <td><strong>Mã Khám:</strong></td>
                                                <td><strong style="color: #0277bd">` + schedule_number + `</strong></td>
                                            </tr>
                                            <tr>
                                                <td><strong>Căn cước công dân:</strong></td>
                                                <td><strong>` + passport + `</strong></td>
                                            </tr>
                                            <tr>
                                                <td><strong>Số Điện thoại:</strong></td>
                                                <td><strong>` + phone + `</strong></td>
                                            </tr>
                                            <tr>
                                                <td><strong>Năm sinh:</strong></td>
                                                <td><strong>` + yearOfBirth + `</strong></td>
                                            </tr>
                                            <tr>
                                                <td><strong>Giới tính:</strong></td>
                                                <td><strong>` + gender + `</strong></td>
                                            </tr>
                                            <tr>
                                                <td><strong>Phòng khám:</strong></td>
                                                <td><strong style="color: #0277bd">` + department_name + `</strong></td>
                                            </tr>
                                            <tr>
                                                <td><strong>Ngày khám:</strong></td>
                                                <td><strong style="color: #0277bd">` + day_schedule + `</strong></td>
                                            </tr>
                                            <tr>
                                                <td><strong>Giờ khám:</strong></td>
                                                <td><strong style="color: #0277bd">` + time_schedule + `</strong></td>
                                            </tr>
                                            <tr>
                                                <td><strong>Bác sỹ khám:</strong></td>
                                                <td><strong style="color: #0277bd">` + doctor_name + `</strong></td>
                                            </tr>
                                            <tr>
                                                <td><strong>Gói dịch vụ:</strong></td>
                                                <td><strong style="color: #0277bd;white-space:initial">` + service_price_names + `</strong></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                
                                <div style="margin-top:40px">
                                    <strong>
                                        Thân mến, <br /> Mộc Trà Soft Team
                                    </strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
        `
    })

    console.log("Message sent: %s", info, info.accepted[0]);

    return info
}

const forgotPasswordEmailContext = async(payload) => {
    var { 
        sender, to_address, name, provideNewPasswordUrl
    } = payload; 

    let transporter = nodemailer.createTransport({
        host: "mcloud.vn",
        port: 587,
        secure: false,
        auth: {
            user: "admin@moctrasoft.com",
            pass: "zhXy6c",
        },

    });

    const info = await transporter.sendMail({
        from: {
            name: "Mộc Trà Soft",
            address: sender
        },
        to: to_address,
        subject: "CẤP MẬT KHẨU MỚI",
        html: `
            <body>
                <div style="width: 100%; height: 800px; background-color: #f5f5f5;line-height: 20px;">
                    <div style="width: 700px; height: 300px;margin-left: auto;margin-right: auto;padding-top: 30px;">
                        <div style="background-color: #43a047;padding-left: 30px;padding-top: 20px;padding-bottom: 20px;border-top-left-radius: 4px;border-top-right-radius: 4px;">
                            <strong style="font-size: 20px;color: #fff;">MỘC TRÀ SOFT</strong>
                        </div>
                        <div style="text-align: center; background-color: #fff; padding-top: 20px;">
                            <strong style="font-size: 20px;">MẬT KHẨU MỚI</strong>
                        </div>
                        <div style="padding-top: 10px; padding-bottom: 10px; padding-left: 20px; padding-right: 20px; background-color: #fff;">
                            <div>
                                <strong style="font-size: 20px;">Kính gửi "` + name + `"</strong>
                            </div>
                            <div style="margin-top: 20px;margin-bottom: 20px;">
                                <div style="margin-top:5px; font-size: 16px;">
                                    Hệ thống nhận được yêu cầu cấp lại mật khẩu mới của bạn.<br />
                                    Để hoàn tất việc cấp lại, bạn vui lòng click vào nút "MẬT KHẨU MỚI" bên dưới.
                                </div>
            
                                <a href="` + provideNewPasswordUrl + `" target="_blank" style="text-decoration: none;">
                                    <div style="background-color: #3f51b5; color: #ffffff; margin-top: 20px; margin-left: auto;margin-right: auto; padding: 10px 10px; text-align: center; width: 160px; cursor: pointer;border-radius: 4px;">
                                        <strong>MẬT KHẨU MỚI</strong>
                                    </div>
                                </a>
            
                                <div style="margin-top:40px">
                                    <strong>
                                        Thân mến, <br /> Mộc Trà Soft Team
                                    </strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
        `
    })

    console.log("Message sent: %s", info, info.accepted[0]);

    return info
}

const newAdsEmailContext = async(payload) => {
    var { 
        sender, to_address, clientName
    } = payload; 

    let transporter = nodemailer.createTransport({
        host: "mcloud.vn",
        port: 587,
        secure: false,
        auth: {
            user: "admin@moctrasoft.com",
            pass: "zhXy6c",
        },

    });

    const info = await transporter.sendMail({
        from: {
            name: "Mộc Trà Soft",
            address: sender
        },
        to: to_address,
        subject: "PHẦN MỀM QUẢN LÝ PHÒNG KHÁM - NHANH, THAO TÁC ĐƠN GIẢN, NHIỀU TÍNH NĂNG MỚI",
        html: `
            <!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
            <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

            <head>
            <!--[if gte mso 9]>
            <xml>
            <o:OfficeDocumentSettings>
                <o:AllowPNG/>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
            </xml>
            <![endif]-->
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta name="x-apple-disable-message-reformatting">
            <!--[if !mso]><!-->
            <meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
            <title></title>

            <style type="text/css">
                @media only screen and (min-width: 620px) {
                .u-row {
                    width: 600px !important;
                }

                .u-row .u-col {
                    vertical-align: top;
                }


                .u-row .u-col-100 {
                    width: 600px !important;
                }

                }

                @media only screen and (max-width: 620px) {
                .u-row-container {
                    max-width: 100% !important;
                    padding-left: 0px !important;
                    padding-right: 0px !important;
                }

                .u-row {
                    width: 100% !important;
                }

                .u-row .u-col {
                    display: block !important;
                    width: 100% !important;
                    min-width: 320px !important;
                    max-width: 100% !important;
                }

                .u-row .u-col>div {
                    margin: 0 auto;
                }


                .u-row .u-col img {
                    max-width: 100% !important;
                }

                }

                body {
                margin: 0;
                padding: 0
                }

                table,
                td,
                tr {
                border-collapse: collapse;
                vertical-align: top
                }

                p {
                margin: 0
                }

                .ie-container table,
                .mso-container table {
                table-layout: fixed
                }

                * {
                line-height: inherit
                }

                a[x-apple-data-detectors=true] {
                color: inherit !important;
                text-decoration: none !important
                }


                table,
                td {
                color: #000000;
                }

                #u_body a {
                color: #0000ee;
                text-decoration: underline;
                }
            </style>



            </head>

            <body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #F9F9F9;color: #000000">
            <!--[if IE]><div class="ie-container"><![endif]-->
            <!--[if mso]><div class="mso-container"><![endif]-->
            <table id="u_body" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #F9F9F9;width:100%" cellpadding="0" cellspacing="0">
                <tbody>
                <tr style="vertical-align: top">
                    <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #F9F9F9;"><![endif]-->



                    <div class="u-row-container" style="padding: 0px;background-color: transparent">
                        <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                        <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->

                            <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                            <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                            <div style="height: 100%;width: 100% !important;">
                                <!--[if (!mso)&(!IE)]><!-->
                                <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->

                                <table style="font-family:verdana,geneva;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                    <tr>
                                        <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:verdana,geneva;" align="left">

                                        <div style="font-family: verdana,geneva; font-size: 16px; line-height: 140%; text-align: left; word-wrap: break-word;">
                                            <p style="line-height: 140%;"><span style="color: #3b3f44; text-align: left; white-space: normal; background-color: #ffffff; float: none; display: inline; line-height: 22.4px;">Thân chào Quý khách hàng "<span style="color:orange">` + clientName + `</span>"</span></p>
                                        </div>

                                        </td>
                                    </tr>
                                    </tbody>
                                </table>

                                <table style="font-family:verdana,geneva;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                    <tr>
                                        <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:verdana,geneva;" align="left">

                                        <div style="font-family: verdana,geneva; font-size: 16px; line-height: 140%; text-align: left; word-wrap: break-word;">
                                            <p style="margin: 0px; color: #3f3d56; text-align: left; white-space: normal; background-color: #ffffff; line-height: 140%;">
                                                <strong style="color: #4caf50">Công ty Mộc Trà Soft</strong> hân hạnh giới thiệu phần mềm <span style="color: #e67e23; line-height: 22.4px;">
                                                <strong>"Quản lý Phòng khám"</strong></span> với các tính năng nổi bật như sau:
                                            </p>
                                        </div>

                                        </td>
                                    </tr>
                                    </tbody>
                                </table>

                                <table style="font-family:verdana,geneva;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                        <tr>
                                            <td style="overflow-wrap:break-word;word-break:break-word;padding:5px 10px;font-family:verdana,geneva;">
                                                <div style="font-family: verdana,geneva; font-size: 16px; font-weight: 700; line-height: 150%; text-align: left; word-wrap: break-word;">
                                                    <p style="line-height: 150%;">- Đặt lịch khám nhanh gọn với chỉ vài thao tác</p>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="overflow-wrap:break-word;word-break:break-word;padding:5px 10px;font-family:verdana,geneva;">
                                                <div style="font-family: verdana,geneva; font-size: 16px; font-weight: 700; color: #6e66ed; line-height: 150%; text-align: left; word-wrap: break-word;">
                                                    <p style="line-height: 150%;">- Trả kết quả khám qua mã QR Code, bệnh nhân quét mã để xem ngay kết quả</p>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="overflow-wrap:break-word;word-break:break-word;padding:5px 10px;font-family:verdana,geneva;">
                                                <div style="font-family: verdana,geneva; font-size: 16px; font-weight: 700; color: #6e66ed; line-height: 150%; text-align: left; word-wrap: break-word;">
                                                    <p style="line-height: 150%;">- Khám sức khoẻ định kỳ cho doanh nghiệp theo yêu cầu</p>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="overflow-wrap:break-word;word-break:break-word;padding:5px 10px;font-family:verdana,geneva;">
                                                <div style="font-family: verdana,geneva; font-size: 16px; font-weight: 700; color: #6e66ed; line-height: 150%; text-align: left; word-wrap: break-word;">
                                                    <p style="line-height: 150%;">- Tích hợp thanh toán online cho các dịch vụ của phòng khám</p>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="overflow-wrap:break-word;word-break:break-word;padding:5px 10px;font-family:verdana,geneva;">
                                                <div style="font-family: verdana,geneva; font-size: 16px; font-weight: 700; line-height: 150%; text-align: left; word-wrap: break-word;">
                                                    <p style="line-height: 150%;">- Thông báo qua email, zalo đến cho khách hàng</p>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="overflow-wrap:break-word;word-break:break-word;padding:5px 10px;font-family:verdana,geneva;">
                                                <div style="font-family: verdana,geneva; font-size: 16px; font-weight: 700; line-height: 150%; text-align: left; word-wrap: break-word;">
                                                    <p style="line-height: 150%;">- Cùng nhiều tính năng khác như: quản lý kho thuốc, quản lý bác sỹ, quản lý phòng chức năng, tài khoản, lưu log thanh toán, tài khoản ....</p>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <span style="margin: 40px 40px;font-size: 14px;">Video tính năng phần mềm:</span>
                                                <span style="margin-left: 10px;font-size: 18px;">https://www.youtube.com/watch?v=KOxQ8l1oQrU</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                <table style="font-family:verdana,geneva;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                    <tr>
                                        <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:verdana,geneva;" align="left">

                                        <div style="font-size: 14px; line-height: 140%; text-align: left; word-wrap: break-word;">
                                            <p style="line-height: 140%;">🚀Giá dịch vụ sử dụng phần mềm của chúng tôi rẻ hơn các sản phẩm khác cùng loại với nhiều tính năng hữu ích hơn 
                                                <br>Thời gian sử dụng thử dài hạn (<span style="background-color: #0000ee; line-height: 19.6px; color: #f9f9f9;">2 tháng</span> thay vì 
                                                    <span style="background-color: #e03e2d; line-height: 19.6px; color: #ffffff;">1 tháng</span> như các phần mềm khác)
                                            </p>
                                        </div>

                                        </td>
                                    </tr>
                                    </tbody>
                                </table>

                                <table style="font-family:verdana,geneva;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                    <tr>
                                        <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:verdana,geneva;" align="left">

                                        <div style="font-size: 16px; line-height: 140%; text-align: left; word-wrap: break-word;">
                                            <p style="line-height: 140%;">
                                                <strong style="color: #3f3d56; text-align: left; white-space: normal; background-color: #ffffff;">
                                                    ⚡ <a style="margin: 40px 40px;font-size: 18px;" href="http://clinic.moctrasoft.com">Link Phần mềm Quản Lý Phòng khám</a>
                                                </strong>
                                            </p>
                                        </div>

                                        </td>
                                    </tr>
                                    </tbody>
                                </table>

                                <table style="font-family:verdana,geneva;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                    <tr>
                                        <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:verdana,geneva;" align="left">

                                        <div style="font-size: 15px; line-height: 140%; text-align: left; word-wrap: break-word;">
                                            <p style="line-height: 140%;"><span style="color: #e03e2d; line-height: 21px;">☏</span>&nbsp; Nếu cần hỗ trợ để giải đáp các thắc mắc khách hàng có thể liên hệ qua số điện thoại: <strong>
                                                <span style="color: #e03e2d; line-height: 21px; font-size:24px">0896157760</span></strong>
                                            </p>
                                        </div>

                                        </td>
                                    </tr>
                                    </tbody>
                                </table>

                                <table style="font-family:verdana,geneva;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                    <tr>
                                        <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:verdana,geneva;" align="left">

                                        <div style="font-size: 14px; line-height: 140%; text-align: left; word-wrap: break-word;">
                                            <p style="line-height: 140%;"><span style="background-color: #ffffff; line-height: 19.6px; color: #f1c40f;">⚓ </span>
                                            Trụ sở chính của chúng tôi ngay tại <strong>Thành phố Biên Hoà, Đồng Nai</strong> nên <br>có thể nhanh chóng hỗ trợ Quý khách hàng khi cần thiết, trong thời gian sớm nhất</p>
                                        </div>

                                        </td>
                                    </tr>
                                    </tbody>
                                </table>

                                <table style="font-family:verdana,geneva;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                    <tr>
                                        <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:verdana,geneva;" align="left">

                                        <div style="font-size: 14px; line-height: 140%; text-align: left; word-wrap: break-word;">
                                            <p style="line-height: 140%;"><span style="color: #f1c40f; line-height: 19.6px;">⚑</span> 
                                            Cảm ơn Quý khách hàng đã dành thời gian quý báu để xem các thông tin và rất vui mừng nếu nhận được sự liên hệ của Quý khách hàng.</p>
                                        </div>

                                        </td>
                                    </tr>
                                    </tbody>
                                </table>

                                <table style="font-family:verdana,geneva;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                    <tr>
                                        <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:verdana,geneva;" align="left">

                                        <div style="font-family: verdana,geneva; font-size: 14px; font-weight: 700; line-height: 140%; text-align: left; word-wrap: break-word;">
                                            <p style="line-height: 140%;"><span style="color: #2dc26b; line-height: 19.6px;">Mộc Trà Soft</span></p>
                                        </div>

                                        </td>
                                    </tr>
                                    </tbody>
                                </table>

                                <!--[if (!mso)&(!IE)]><!-->
                                </div><!--<![endif]-->
                            </div>
                            </div>
                            <!--[if (mso)|(IE)]></td><![endif]-->
                            <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                        </div>
                        </div>
                    </div>



                    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                    </td>
                </tr>
                </tbody>
            </table>
            <!--[if mso]></div><![endif]-->
            <!--[if IE]></div><![endif]-->
            </body>

            </html>
        `
    })

    console.log("Message sent: %s", info, info.accepted[0]);

    return info
}

module.exports = { 
    newRegisterEmailContext, 
    extendCompanyEmailContext, 
    confirmScheduleMedicalEmailContext, 
    forgotPasswordEmailContext, 
    newAdsEmailContext 
}