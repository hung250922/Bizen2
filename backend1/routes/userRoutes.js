const { Op } = require('sequelize');
const { 
    getUsers, getUser, addUser, updateUser
} = require('../mongodb/controllers/userControllers');
var bcrypt = require("bcryptjs");
const saltRounds = 10;
var authController = require('../middleware/auth');

module.exports = (router) => {
    router.get(`/users`, authController.isBasicAuthAuthenticated, async(req, res) => {
        console.log("--- get users query:", req.query);
        try {
            // var filter = {};
            const users = await getUsers(req.query);
            return res.json({ data: users, error: null });
        } catch(error) {
            console.log("-- error", error)
            return res.json({ data: null, error: "get users is failed" });
        }
    });

    // router.get(`/users`, authController.isBasicAuthAuthenticated, async(req, res) => {
    //     try {
    //         var filter = {};
    //         let order_by = "id";  
    //         let order_dir = "desc";

    //         filter =  {
    //             [Op.and]: [
    //                 { is_active: true },
    //                 filter
    //             ],
    //         }

    //         if(req.query.company_id) {
    //             filter = {
    //                 [Op.and]: [
    //                     filter,
    //                     {
    //                         company_id: req.query.company_id
    //                     }
    //                 ]
    //             }
    //         }

    //         if(req.query.searchText) {
    //             filter = {
    //                 [Op.and]: [
    //                     filter,
    //                     {
    //                         [Op.or]: [
    //                             {
    //                                 phone: {
    //                                     [Op.like] : '%' + req.query.searchText + '%'
    //                                 }
    //                             },
    //                             {
    //                                 full_name: {
    //                                     [Op.like] : '%' + req.query.searchText + '%'
    //                                 }
    //                             },
    //                             {
    //                                 email: {
    //                                     [Op.like] : '%' + req.query.searchText + '%'
    //                                 }
    //                             }
    //                         ]
    //                     }
    //                 ]
    //             }
    //         }

    //         if(req.query.order_by) {
    //             order_by = req.query.order_by;
    //         }

    //         if(req.query.order_dir) {
    //             order_dir = req.query.order_dir;
    //         }

    //         var findUsers = await User.findAll({
    //             where: filter,
    //             limit: parseInt(req.query.limit || 25),
    //             offset: parseInt(req.query.offset || 0),
    //             order: [
    //                 [order_by, order_dir]
    //             ],
    //             include: [
    //                 {
    //                     model: Company,
    //                     as: 'companyDetail'
    //                 },
    //             ]
    //         });

    //         const totalCount = await User.count({where: filter});

    //         return res.json({      
    //             data: {
    //                 records: findUsers,
    //                 totalCount
    //             }, 
    //             error: null 
    //         });
    //     } catch(error) {
    //         console.log("-- error", error)
    //         return res.json({ data: null, error: "get users is failed" });
    //     }
    // });

    router.get(`/users/:id`, authController.isBasicAuthAuthenticated, async(req, res) => {
        try {
            const findUser = await User.findOne({
                where: {
                    [Op.and]: [
                        {
                            is_active: true
                        },
                        {
                            id: req.params.id
                        }
                    ]
                },
                include: [
                    {
                        model: Company,
                        as: 'companyDetail'
                    },
                ]
            });

            return res.json({ data: findUser, error: null });
        } catch(error) {
            console.log("-- error", error)
            return res.json({ data: null, error: "get users by id is failed" });
        }
    })

    router.post(`/user`, authController.isBasicAuthAuthenticated, async(req, res) => {
        try {
            const newUser = await addUser(req.body);
            return res.json({ data: newUser, error: null });
        } catch(error) {
            console.log("-- error", error)
            return res.json({ data: null, error: "post users is failed" });
        }
    });

    router.put(`/user/:id`, authController.isBasicAuthAuthenticated, async(req, res) => {
        console.log("--- update user req.body", req.body);
        try {
            const findUser = await getUser({ _id: req.params.id });
            if(findUser) {
                const updatedUser = await updateUser({ _id: req.params.id, ...req.body });
                return res.json({ data: updatedUser, error: null });
            } else {
                return res.json({ data: null, error: "Không tìm thấy user id!"});
            }
        } catch(error) {
            console.log("-- error", error)
            return res.json({ data: null, error: "post users is failed" });
        }
    });
}