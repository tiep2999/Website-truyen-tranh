var express = require('express');
var router = express.Router();
var fs = require('fs');
var mysql = require('mysql');

const con = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'rootpasswordgiven',
  database : 'mydb'
});


// /* GET home page. */
router.get('/pdf', function (req, res, next) {
});

router.get('/read', function (req, res, next) {
  res.render('./ReadStory/ReadStory', { title: 'express nodejs' });
});

router.get('/admin', function (req, res, next) {
  res.render('./Admin/AllStory', { title: 'express nodejs' });
});

router.get('/insert', function (req, res, next) {
  res.render('./Admin/insert', { title: 'express nodejs' });
});

router.get('/', function (req, res, next) {
  var sql = "SELECT * FROM MyStory";
  con.query(sql, function (err, results) {
    if (err)
      throw err;
    else
      res.render('./Home/home', { data: results });
    console.log(results);
  });

});

router.get('/search', function (req, res, next) {

  res.render('./SearchStory/Search');

});

router.get('/about', function (req, res, next) {

  res.render('./AboutStory/AboutStory');

});

module.exports = router;
