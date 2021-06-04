var mysql = require("mysql");

var conn = mysql.createConnection({
    host: "ec2-18-217-134-54.us-east-2.compute.amazonaws.com",
    user: "bryan",
    password: "A!e^+04!vVrHY_ut",
    database: "imageDB-bryan"
});

conn.connect(function(err){
    if (err) {
        console.log("Error connecting to MySQL", err);
    }
    else {
        console.log("Connection established");
    }
});

module.exports = conn;