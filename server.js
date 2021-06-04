const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

var router = express.Router();

router.use("/api/pages", require("./api/pages"));
router.use("/api/images", require("./api/images"));
router.use("/api", require("./api/users"));

app.use(router);


app.listen(PORT, () => {
    console.log('Listening at ' + PORT );
});