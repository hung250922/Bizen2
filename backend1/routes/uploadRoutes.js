const multer = require('multer');
const uuid = require('uuid');
const path = require('path');
const fs = require('fs');
var authController = require('../middleware/auth');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        console.log('-------------------multer storage', req.query);
        // cb(null, './public/uploads/' + req.query.subPath)
        cb(null, './public/uploads/' + req.query.subPath)
    },
    filename(req, file, cb) {
        // req.files[0].originalname = Buffer.from(req.files[0].originalname, 'latin1').toString('utf-8');
        file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf-8');
        // console.log('------- filename', file)
        let extension = path.extname(file.originalname);
        let baseName = path.basename(file.originalname, extension);
        // console.log("baseName", baseName)

        let id = baseName + extension;

        if(fs.existsSync(`./public/uploads/${req.query.subPath}/${id}`)) {
            id = baseName + "_" + uuid.v4() + extension;
        }
   
        //var id = baseName + "_" + uuid.v4() + extension;
        //var id = baseName + "-" + uuid.v4() + extension;
        //console.log('--- id', id)
        cb(null, id);
    }
});

const upload = multer({ storage });

module.exports = (router) => {
    router.post(`/upload`, upload.single('uri'), async (req, res) => {
        //console.log('----- req', req)
        req.file.originalname = Buffer.from(req.file.originalname, 'latin1').toString('utf-8');
        // console.log('---- UPLOAD req.file', req.file);
        if(!req.file){
          return res.status(200).send({
              status: 0,
              error: "file haven't uploaded yet!"
          });
        }

        const isLt2M = req.file.size / 1024 / 1024 < 10;

        if (!isLt2M) {
          // return res.status(200).send({
          //   status: 0,
          //   error: "File must smaller than 10MB!"
          // });
          return res.json({
            status: 0,
            fileName: null,
            error: `File ${req.file.filename} lớn hơn 10MB!`
          });
        }

        //console.log('---- upload file vuot qua < 200Mb')

        const file = req.file;
        // const meta = req.body;
        // var dataFile = {
        //     id: file.filename,
        //     // file: {
        //     //    name: file.filename
        //     // }
        // }

        // console.log('---- UPLOAD FILE', file);
        //console.log('---- dataFile', dataFile)

        return res.json({
          status: 200,
          fileName: file.filename
        });
    });

    router.delete(`/upload/delete/:id`, async (req, res) => {
        const { id } = req.params;
        var path = "./public/uploads/" + req.query.subPath + "/" + id;
        console.log('---- delete file', id)
        try {
            fs.unlink(path, (err) => {
              if (err) {
                console.error(err)
              }
            })
        } catch(err) {
            console.log('err', err);
        }

        return res.json(id);
    });
}