var jwt = require("jwt-simple");
var router = require("express").Router();
var bcrypt = require("bcrypt-nodejs");
var bodyParser = require('body-parser');
var secret = require("../configuration/supersecret");
var SQL = require("../dbConn");


//router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
//add a new user to the database
router.post("/user", function (req, res) {
    
        
    bcrypt.hash(req.body.signUpPassword, null, null, function (err, hash) {
        var userData = { uid: req.body.signUpUsername, password: hash, full_name: req.body.full_name, date_created: new Date(), administrator: false };
        
        SQL.query("INSERT INTO user SET ?", userData, function(err, result) {
            if (err) {
                res.send(err);
            }
            else {
                res.status(201);
                res.redirect("/index.html");
                //res.send("Inserted user with ID " + result.insertId);
            }
        });
    
    });
 
});

//send a token when given a valid username/password
router.post("/auth", function(req, res) {   
    
        SQL.query("SELECT uid, password FROM user WHERE uid = ?", [req.body.username], function(err, result){
            
            if (err) {
                console.log(err);
            } else if ( result.length > 0) {
                
                if (result) {
                    bcrypt.compare(req.body.password, result[0].password, function (err, valid){
                        if (err) {
                            res.status(400).json({ error:err });
                        }
                        
                        else if (valid) {
                            var token = jwt.encode({ username: result[0].uid }, secret);
                            return res.json({token: token});
                        }
                        
                        else {
                            res.status(401).json({ error: "Invalid login"});
                        }
                    })
                }
            }
        
        });
   
});

module.exports = router;