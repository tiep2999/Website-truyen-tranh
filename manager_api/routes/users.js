var express = require('express');
var router = express.Router();
var mysql = require('mysql');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rootpasswordgiven',
  database: 'mydb'
});

var nextStory = 0;

router.get('/lol/:id', function (req, res, next) {

  var idRead = req.params.id;

  var sql = "select * from detailStoryChap inner join Story on detailStoryChap.idStory = Story.idStory where Story.idStory = ?";
  con.query(sql, idRead, function (err, results) {
    if (err) {
      res.send(err);
    }
    else {
      res.render('./ReadStory/ReadStory', { data: results[nextStory] });
      nextStory++;
    }
  });
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  nextStory = 0;
  res.send('respond with a resource');
});

module.exports = router;
