require("dotenv").config()
var jwt = require('jsonwebtoken');


exports.isAuthenticated = function(req, res, next) {
    console.log('--- isAuthenticated', req.headers.authorization)
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('--- ip', ip);

    if(req.headers && req.headers.authorization) {
        var jwtToken = req.headers.authorization.replace("Bearer ", "");
        console.log("jwtToken", jwtToken, process.env.JWT_SECRET)
        jwt.verify(jwtToken, process.env.JWT_SECRET, async(err, payload) => {
            console.log('err', err)
            if(err) {
                res.status(401).json({ message: "Unauthorized user!" });
            } else {
                console.log('decoded: ', payload.username);

                next();
            }
        })
    } else {
        res.status(401).json({ message: 'Unauthorized user!' });
    }
}

exports.isBasicAuthAuthenticated = function(req, res, next) {
    next();
    // const authorization = req.headers.authorization;
    // //console.log("authorization", authorization)

    // if(!authorization || authorization.indexOf('Basic ') === -1) {
    //     return res.status(401).json({
    //         msg: "Unauthorized user!"
    //     })
    // }

    // // verify auth credentials
    // const base64Credentials = authorization.split(' ')[1];
    // const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    // const [username, password] = credentials.split(':');

    // if(username === process.env.BASIC_AUTH_USERNAME && password === process.env.BASIC_AUTH_PASSWORD) {
    //     //saveUserActivityLog(req);
    //     next();
    // } else {
    //     return res.status(401).json({
    //         msg: "Unauthorized user!"
    //     })
    // }
}

// const saveUserActivityLog = (req) => {
//     if(req.method === "POST" || req.method === "PUT") {
//         const { company_id, user_id } = req.body;
//         if(company_id) {
//             var newUserLog = UserLog.build({
//                 company_id,
//                 user_id,
//                 original_url: req.originalUrl,
//                 method: req.method,
//                 body_datas: req.body,
//                 param_datas: req.params,
//                 query_datas: req.query
//             });
//             newUserLog.save();
//         }
//     }
// }