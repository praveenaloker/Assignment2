const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const app = express();

var bodyParser = require('body-parser');            // pagination 
const db = require('./config/db.config.js');
var maxSize =  2 * 1024 * 1024;  // 2 MB

// force: true will drop the table if it already exists
db.sequelize.sync({force: false}).then(() => {
    console.log('Drop and Resync with { force: true }');
  }); 
  
  let router = require('./routers/router.js');

//******IMAGE-VIDEO UPLAOAD******//

// to upload images of only .png extension
const multerFilter = (req, file, cb) => {
    if (file.mimetype=="image/png") {
      cb(null, true);
    } else {
      cb("Please upload only .png images.", false);
    }
  };

  const videoFilter = (req, file, cb) => {
    if (file.mimetype=="video/mp4") {
      cb(null, true);
    } else {
      cb("Please upload correct format.", false);
    }
  };  

// storage engine
const storage = multer.diskStorage({
    destination:'./upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({
    storage:storage,
    fileFilter:multerFilter   
})
const videoupload = multer({
    storage:storage,
    fileFilter:videoFilter,
    limits: { fileSize: maxSize }   
}).single('profile')

app.use('/profile',express.static('upload/images'));
app.post("/upload",upload.single('profile'), (req, res)=>{
    //console.log(req.file);
    res.json({
        success: 1,
        profile_URL: `http://localhost:8085/profile/${req.file.filename}`
    })
})

// app.post("/videoupload",videoupload.single('profile'), (req, res)=>{
//     //console.log(req.file);
//     res.json({
//         success: 1,
//         profile_URL: `http://localhost:8085/profile/${req.file.filename}`
//     })
// })
app.post("/videoupload", function (req, res, next) {
  videoupload(req, res, function (err) {
      if (err) {
          return res.json({
            error: err
          });
      }
      return res.json({
        success: 1,
        profile_URL: `http://localhost:8085/profile/${req.file.filename}`
    })
  });
});

// app.post('/videoupload',function(req,res){
//   videoupload(req,res,function(err) {
//       if(err) {
//           return res.end("Error uploading file, allowed file size is 2 MB");
//       }
//      // res.end("File is uploaded");
//      res.json({
//               success: 1,
//               message: "File uploaded successfully !",
//               profile_URL: `http://localhost:8085/profile/${req.file.filename}`
//           })
//   });
// });

//******IMAGE-VIDEO UPLAOAD******//

//******IMAGE-VIDEO DOWNLOAD******//
app.get('/download/:file(*)',(req, res) => {
  var file = req.params.file;
  const filePath = `./upload/images/${file}`;
  try{                                                      //error handling
    if (fs.existsSync(filePath)){
      var fileLocation = path.join('./upload/images',file);
      //console.log(fileLocation);
      res.download(fileLocation,file);
    }else{
      res.status(404).json({
        message: "File name does not exist"
      });
    }
  }catch(err){
    console.error(err);
  }
});
//******IMAGE-VIDEO DOWNLOAD******//

//******PAGINATION******//   
const cors = require('cors')
const corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use('/', router);
//******PAGINATION******//

app.listen(8085, () => {
    console.log("Server up and running");
})
