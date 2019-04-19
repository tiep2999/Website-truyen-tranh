var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var index = require('./index');
//connect dbs
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rootpasswordgiven',
    database: 'mydb'
});

router.get('/', function (req, res, next) {
    var str = "%h%à%n%h%đ%ộ%n%g%";
    var sql = "select * from Story where typeStory like ?";
    con.query(sql,[str],function (err, results) {
        if (err) {
            res.send(err);
        }
        else {
            // res.render('./TypeStory/typeStory',{
            //     data:results
            // });
            console.log(index.accessAbility);
        }
    });
});

module.exports = router;