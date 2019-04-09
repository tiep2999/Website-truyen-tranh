var express = require('express');
var router = express.Router();
var mysql = require('mysql');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rootpasswordgiven',
  database: 'mydb'
});

var nextAndPre = 0;
var nextStory = new Array();

router.get('/read/:id.html', function (req, res, next) {

  var idRead = req.params.id;
  var idReadAbs = Math.abs(idRead);

  var sql = "select * from detailStoryChap inner join Story on detailStoryChap.idStory = Story.idStory where Story.idStory = ?";
  con.query(sql, idReadAbs, function (err, results) {
    if (err) {
      res.send(err);
    }
    else {
        nextStory = [...results];
      res.render('./ReadStory/ReadStory', { data: results[0],len: nextAndPre,max:nextStory.length });
    }
  });
});

router.get('/read/next', function (req, res, next) {

  nextAndPre++;
  res.render('./ReadStory/ReadStory', { data: nextStory[nextAndPre],len: nextAndPre,max:nextStory.length });

});

router.get('/read/previous', function (req, res, next) {
  nextAndPre--;
  res.render('./ReadStory/ReadStory', { data: nextStory[nextAndPre],len: nextAndPre,max:nextStory.length });

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

  con.query("delete from Story where idStory = ?;", idDel, function (err, results) {
    res.redirect('/admin');
  });

});

router.get('/insert', function (req, res, next) {
  res.render('./Admin/insert', { title: 'express nodejs' });
});

router.get('/', function (req, res, next) {
  nextStory = [];
  nextAndPre = 0;
  nextStory = 0;
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

router.get('/about/:id', function (req, res, next) {

  var idAbout = req.params.id;

  var sql = "select * from Story where idStory = ?";
  con.query(sql, idAbout, function (err, results) {
    if (err)
      throw err;
    else
      res.render('./AboutStory/AboutStory', { data: results });
  });

});

module.exports = router;
