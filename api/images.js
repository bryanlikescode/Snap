var router = require("express").Router();
var multer = require('multer');
var path = require('path');
var jwt = require("jwt-simple");
var secret = require("../configuration/supersecret");
var thumb = require("node-thumbnail").thumb;
var SQL = require("../dbConn");
///let userSubDir = crypto.creathash(sha256).update(user.uid).disget(hex);

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    cb(null,  file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

// set upload object to store pictures to correct location
var upload = multer({ storage: storage });

// Add a new image to the database
router.post("/", upload.single('photo'), (req, res)=> {
    
    // log the file upload to console
    if(req.file) { 
        //res.json(req.file);
        console.log("File: " + req.body.photoName + " saved on.");
    }
    else throw 'error';
    
    //check if the x-auth header is set
    if (!req.headers["x-auth"]) {
        return res.status(401).json({error: "Missing X-Auth header"});
    }
    var to = "./public/images/" + req.file.filename;
    var thumbEnd = "public/images/thumbs";
    
    thumb({
        source: to,
        destination: thumbEnd
    }).catch(function(err) {
        console.log(err.toString());
    });
    
    // x-auth should contain the token
    var token = req.headers["x-auth"];
    var decoded = jwt.decode(token, secret);
    var usr = decoded.username;
    try {
                
        var imageData = { 
            filename: req.file.filename,
            photo_name: req.body.photoName,
            path: "images/" + decoded.username + "/" + req.file.filename,
            owner: decoded.username,
            album: req.body.album,
            description: req.body.description,
            upload_date: new Date(),
            fStop: req.body.fStop,
            speed: req.body.speed,
            iso: req.body.iso,
            focalLength: req.body.focalLength,
            cameraType: req.body.cameraType
        };
        
        
        SQL.query("INSERT INTO image SET ?", imageData, function(err, result) {
            if (err) {
                res.send(err);
            } else {
                res.send("Image was saved.");
            }
        });

    }  
    
    catch (ex) {
        res.status(401).json({ error: "Invalid JWT"});
    }
    
});

// Retrieve images from database of specified user
router.get("/images", function(req, res) {
    
    //check if the x-auth header is set
    if (!req.query.u) {
        return res.status(401).json({error: "Missing token"});
    }
    
    // x-auth should contain the token
    var token = req.query.u;
    try {
        
        var decoded = jwt.decode(token, secret);
        
        SQL.query("SELECT filename FROM image WHERE owner = ?", decoded.username, function(err, result) {
            if (err) {
                res.send(err);
            } else {
                return res.json(result);
            }
        });
        
    }
    catch (ex) {
        res.status(401).json({ error: "Invalid JWT"});
    }
});


// this is used to communicate with all other modules

module.exports = router;
