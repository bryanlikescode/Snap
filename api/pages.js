//import router
var router = require("express").Router();
var path = require("path");
var fs = require("fs");
var crypto = require("crypto");
var jwt = require("jwt-simple");
var secret = require("../configuration/supersecret");
var SQL = require("../dbConn");


//return the requested page when x-auth header is set
router.get("/", function(req, res) {
    
    //check if the x-auth header is set
    if (!req.headers["x-auth"]) {
        return res.status(401).json({error: "Missing token"});
    }
    
    // Set var for decoded username
    // Set token
    var decoded;
    var token = req.headers["x-auth"];
    
    try {
        // Decode token
        decoded = jwt.decode(token, secret);
    } catch (ex) {
        // Token could not be decoded
        console.log("Token could not be decoded.");
        return res.status(401).json({error: "Invalid JWT"});
    }
           
    var usr = decoded.username;
    
    SQL.query("SELECT * FROM user WHERE uid = ?", usr, function(err, result) {
            if (err) {
                res.send(err);
            } 
        
            if (result.length > 0) {
                    SQL.query("SELECT * FROM page WHERE pageId = ?", [req.query.pageid], function(err, result) {
                       if (err) {
                           return res.status(500).json({ error: "Server error: Try again later."});
                       } 
                        if (result.length > 0) {
                            let path2Page = path.resolve("pages/" + result[0].pageName);
                            return res.status(200).sendFile(path2Page);
                        } 
                        else {
                            console.log("Page is not found");
                            return res.status(404).json({ error: "Page not found."});
                        }
                    });
                  
            }
            
            else {
                res.status(401).json({ error: "Not authenticated."});
            }
    });
    
    
});

// Exports data to server

module.exports = router;
