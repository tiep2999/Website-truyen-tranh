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

  var sql = "select ImgStory from detailStoryChap inner join Story on detailStoryChap.idStory = Story.idStory where Story.idStory = 1";
  con.query(sql, function (err, results) {
    var rs = [];
    for(var i = 0; i<results.length; i++){
      var str = JSON.stringify(results[i]);
      str = str.substring(13,str.length-2);
      rs.push(str);
    }
    
    res.render('./ReadStory/ReadStory', { data: rs });
  });
});

router.get('/admin', function (req, res, next) {

  var sql = "select * from Story";
  con.query(sql, function (err, results) {
    if (err)
      throw err;
    else
      res.render('./Admin/AllStory', { data: results })
  });

});

//delete story 
router.get('/delete/:id', function (req, res, next) {

  var idDel = req.params.id;

  con.query("delete from Story where idStory = ?;",idDel, function (err, results) {
    res.redirect('/admin');
  });

});

router.get('/insert', function (req, res, next) {
  res.render('./Admin/insert', { title: 'express nodejs' });
});

router.get('/', function (req, res, next) {
  var sql = "select * from Story";
  con.query(sql, function (err, results) {
    if (err)
      throw err;
    else
      res.render('./Home/home', { data: results })
  });

});

router.get('/search', function (req, res, next) {

  res.render('./SearchStory/Search');

});

router.get('/about', function (req, res, next) {

  res.render('./AboutStory/AboutStory');

});

module.exports = router;
