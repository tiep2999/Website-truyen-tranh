var express = require('express');
var router = express.Router();
var multer = require('multer');
var mysql = require('mysql');

//connect dbs
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rootpasswordgiven',
  database: 'mydb'
});

//process upload where
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploadFile');
    // cb(null, './upload2')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

var upload = multer({ storage: storage });
var image = [];

var accessAbility = "awesome";

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
      res.render('./ReadStory/ReadStory', {
        data: results[0],
        len: nextAndPre,
        max: nextStory.length,
        accessAbility: accessAbility
      });
    }
  });
});

router.get('/read/next', function (req, res, next) {

  nextAndPre++;
  res.render('./ReadStory/ReadStory', {
    data: nextStory[nextAndPre],
    len: nextAndPre,
    max: nextStory.length,
    accessAbility: accessAbility
  });

});

router.get('/read/previous', function (req, res, next) {
  nextAndPre--;
  res.render('./ReadStory/ReadStory', {
    data: nextStory[nextAndPre],
    len: nextAndPre, max: nextStory.length,
    accessAbility: accessAbility
  });

});


//delete story 
router.get('/delete/:id', function (req, res, next) {
  if (accessAbility = "admin") {
    var idDel = req.params.id;

    con.query("delete from Story where idStory = ?;", idDel, function (err, results) {
      res.redirect('/admin');
    });
  }

});

router.get('/insert', function (req, res, next) {
  res.render('./Admin/insert', { accessAbility: accessAbility });
});

router.post('/uploadfile', upload.any(), function (req, res, next) {

  var str = req.files[0].path;
  str = str.split('/');
  str = '/read/next/'+ str[1];
  image.push(str);
  console.log(image);
  res.status(200).send(req.files);
});

router.post('/upInfo', function (req, res, next) {

  var Story = {
    'name': req.body.nameStory,
    'chap': req.body.chap,
    'image': image[0],
    'idStory': -1
  }

  var sql = "select idStory from Story where nameStory = ?";

  con.query(sql, [Story.name], function (err, result) {
    if (err) {
      console.log(err);
    }
    else {
      Story.idStory = result[0].idStory;

      var sql2 = "insert into detailStoryChap (idStory,chap,ImgStory) values (?,?,?);";

      con.query(sql2, [Story.idStory, Story.chap, Story.image], function (err, results) {
        if (err) {
          console.log(err);
        }
        else {
          res.send("thanh cong");
        }
      });

    }
  })


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
      res.render('./Home/home', {
        data: results,
        accessAbility: accessAbility
      })
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
      res.render('./AboutStory/AboutStory', {
        data: results,
        accessAbility: accessAbility
      });
  });

});


router.get('/login', function (req, res, next) {

  res.render('./LogIn/Login', {
    accessAbility: accessAbility
  });

});


//check login
router.post('/loginform', function (req, res, next) {

  var user = {
    'Email': req.body.gmail,
    'Password': req.body.pass
  };
  var sql = "select * from userInfo where Email = ? and Password = ?";
  con.query(sql, [user.Email, user.Password], function (err, results) {
    console.log(results);
    if (err) {
      throw err;
    }
    else if (results.length !== 0) {
      if (results[0].iduserInfo === 1) {
        var sql = "select * from Story";
        con.query(sql, function (err, resultsStory) {
          if (err)
            throw err;
          else {
            setTimeout(() => {
              accessAbility = "admin";
              res.render('./Admin/AllStory', {
                data: resultsStory,
                accessAbility: accessAbility
              });
            }, 0)
          }
        });
      }
      if (results[0].iduserInfo != 1) {
        accessAbility = "user";
        res.redirect('/');
      }
    }
    else {
      res.send("nhap lai");
    }
    console.log(results);
  });


});

router.get('/logout', function (req, res, next) {

  accessAbility = "awesome";
  res.redirect("/")

});

router.get('/logup', function (req, res, next) {

  res.render('./LogIn/LogUp', {
    accessAbility: accessAbility
  });

});

// router.get('/xemsp', function (req, res, next) {

//   var sql = "select * from detailStoryChap";
//   con.query(sql, function (err, results) {
//     if (err)
//       throw err;
//     else {
//       res.render('test', {
//         data: results,
//         accessAbility: accessAbility
//       })
//       console.log(results);
//     }
//   });

// });

module.exports = router;
