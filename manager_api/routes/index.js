var express = require('express');
var router = express.Router();
var multer = require('multer');
var mysql = require('mysql');

//connect dbs
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '322999',
  database: 'mydb'
});

//process upload where
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/jpg' || file.mimetype == 'image/png')
      cb(null, './public/images');
    else
      cb(null, './uploadFile');
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

var OneUser;
var propose;

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
  if (accessAbility == "admin") {
    var idDel = req.params.id;

    con.query("delete from detailStoryChap where idStory = ?;", idDel, function (err, results) {
      con.query("delete from Story where idStory = ?;", idDel, function (err, results) {
        res.redirect('/allStory');
      });
    });

  }

});

//delete chap story 
router.get('/deleteChap/:chap/:idStory', function (req, res, next) {
  if (accessAbility == "admin") {

    var chap = req.params.chap;
    var idStory = req.params.idStory;

    con.query("delete from detailStoryChap where chap = ? and idStory = ?;", [chap, idStory], function (err, results) {

      res.redirect('/insert/' + idStory);

    });

  }

});


//insert chap for story 
var StoryInsert;
router.get('/insert/:id', function (req, res, next) {
  if (accessAbility == 'admin') {
    var idInsert = req.params.id;
    var sql = "select * from Story where idStory = ?";

    con.query(sql, [idInsert], function (err, results) {
      if (err) {
        res.send(err);
      }
      else {
        StoryInsert = [...results];


        var sqlAvail = "select * from detailStoryChap where idStory = ?";
        con.query(sqlAvail, [idInsert], function (err, resultAvail) {
          if (err) {
            res.send(err);
          }
          else {
            res.render('./Admin/insert', {
              accessAbility: accessAbility,
              StoryInsert: StoryInsert,
              data: resultAvail
            });
          }
        })
      }
    });
  }
  else {
    res.send('cần quyền truy cập admin')
  }
});

router.post('/uploadfile', upload.any(), function (req, res, next) {

  var str = req.files[0].path;
  str = str.split('/');
  str = '/read/next/' + str[1];
  image.push(str);
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

  image = [];


});


//insert new story
router.get('/insertNewStory', function (req, res, next) {
  if (accessAbility == 'admin')
    res.render('./Admin/insertNewStory', { accessAbility: accessAbility });
  else {
    res.send('cần quyền truy cập admin')
  }
});

router.post('/uploadimage', upload.any(), function (req, res, next) {

  var str = req.files[0].path;
  str = str.split('/');
  str = '/images/' + str[2];
  image.push(str);
  res.status(200).send(req.files);

});

router.post('/upInfoNewStory', function (req, res, next) {

  var Story = {
    'name': req.body.nameNewStory,
    'numchap': req.body.numchap,
    'author': req.body.author,
    'image': image[0],
    'type': req.body.typestory
  }

  var sql2 = "insert into Story (nameStory,numChap,author,avatarStory,typeStory) values (?,?,?,?,?)";

  con.query(sql2, [Story.name, Story.numchap, Story.author, Story.image, Story.type], function (err, results) {
    if (err) {
      console.log(err);
    }
    else {
      res.redirect('/allStory');
    }
  });
  console.log(Story);

  image = [];


});

//detail story 
router.get('/detail/:id', function (req, res, next) {
  if (accessAbility == 'admin') {
    var idDetail = req.params.id;
    var sql = "select * from Story where idStory = ?";

    con.query(sql, idDetail, function (err, results) {
      if (err) {
        console.log(err);
      }
      else {
        res.render('./Admin/Detail', {
          accessAbility: accessAbility,
          data: results
        });
      }
    });
  }
  else {
    res.send('cần quyền truy cập admin')
  }
});

router.post('/detail/:id', function (req, res, next) {
  var idDetail = req.params.id;

  var Story = {
    'name': req.body.name,
    'author': req.body.author,
    'numChap': req.body.numChap,
    'type': req.body.typestory
  }

  var sql = "UPDATE Story SET nameStory = ?, author = ?, numChap = ?,typeStory = ? WHERE idStory = ?";
  con.query(sql, [Story.name, Story.author, Story.numChap, Story.type, idDetail], function (err, results) {
    if (err) {
      console.log(err);
    }
    else {
      res.redirect('/allStory');
    }
  });


});

//Home page router
router.get('/', function (req, res, next) {
  nextStory = [];
  nextAndPre = 0;
  nextStory = 0;
  var sql = "select * from Story";
  con.query(sql, function (err, results) {
    if (err)
      throw err;
    else {

      var sqlPage = "select * from Story limit 8"

      con.query(sqlPage, function (err, resultsPage) {
        if (err) {
          res.send(err);
        }
        else {
          res.render('./Home/home', {
            data: resultsPage,
            accessAbility: accessAbility,
            numberItem: results.length,
            Item: 0
          })
        }
      });

    }
  });

});


//Home page router
router.get('/page/:id', function (req, res, next) {
  nextStory = [];
  nextAndPre = 0;
  nextStory = 0;
  var sql = "select * from Story";
  var page = parseInt(req.params.id);
  var changePageInt = 8 * page;
  con.query(sql, function (err, results) {
    if (err)
      throw err;
    else {

      var sqlPage = "select * from Story limit ?,8";

      con.query(sqlPage, [changePageInt], function (err, resultsPage) {
        if (err) {
          res.send(err);
        }
        else {
          res.render('./Home/home', {
            data: resultsPage,
            accessAbility: accessAbility,
            numberItem: results.length,
            Item: page
          })
        }
      });

    }
  });

});



var searchStory;
router.post('/search', function (req, res, next) {

  var temp = req.body.searchstr;

  var strSearch = '';
  for (var i = 0; i < temp.length; i++) {
    strSearch += '%' + temp[i];
  }
  strSearch = strSearch + '%';

  var sql = "select * from Story where nameStory like ?";
  con.query(sql, [strSearch], function (err, results) {
    if (err)
      throw err;
    else {
      searchStory = [...results];
      var sql = 'select * from Story limit 8';
      con.query(sql, function (err, results) {
        if (err) {
          res.send(err);
        }
        else {
          propose = [...results];
          res.render('./SearchStory/Search', {
            data: searchStory,
            accessAbility: accessAbility,
            propose: propose
          });
        }
      });
    }
  });

});


var about;
router.get('/about/:id', function (req, res, next) {

  var idAbout = req.params.id;

  var sql = "select * from Story where idStory = ?";
  con.query(sql, idAbout, function (err, results) {
    if (err)
      throw err;
    else {
      about = [...results];
      if (accessAbility != 'user') {
        var sql = 'select * from Story limit 8';
        con.query(sql, function (err, results) {
          if (err) {
            res.send(err);
          }
          else {
            propose = [...results];
            res.render('./AboutStory/AboutStory', {
              data: about,
              accessAbility: accessAbility,
              user: OneUser,
              propose: propose
            });
          }
        });
      }
      else {
        var sqlfind = "select * from LikeStory where idUserInfo = ? and idStory = ?";
        con.query(sqlfind, [OneUser[0].iduserInfo, idAbout], function (err, resultsStory) {
          if (err)
            throw err;
          else {
            var sql = 'select * from Story limit 8';
            con.query(sql, function (err, results) {
              if (err) {
                res.send(err);
              }
              else {
                propose = [...results];
                res.render('./AboutStory/AboutStory', {
                  data: about,
                  accessAbility: accessAbility,
                  user: OneUser,
                  checkLike: resultsStory,
                  propose: propose
                });
              }
            });
          }
        });
      }
    }
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
              OneUser = results;
              res.render('./Admin/AllStory', {
                data: resultsStory,
                accessAbility: accessAbility,
                user: results
              });
            }, 0)
          }
        });
      }
      if (results[0].iduserInfo != 1) {
        accessAbility = 'user';
        OneUser = results;

        var sqlstr = 'select * from Story where idStory in ( select idStory from LikeStory where idUserInfo = ? )';

        con.query(sqlstr, [OneUser[0].iduserInfo], function (err, resultsstr) {
          if (err) {
            res.send(err);
          }
          else {
            res.render('./User/Profile', {
              accessAbility: accessAbility,
              user: OneUser,
              likeStory: resultsstr
            });
          }
        });
      }
    }
    else {
      res.send("nhap lai");
    }
  });


});

router.get('/allStory', function (req, res, next) {
  if (accessAbility == 'admin') {
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
  else {
    res.send('cần quyền truy cập admin');
  }
});


router.get('/profileUser', function (req, res, next) {

  if (accessAbility == 'user') {
    var sql = 'select * from Story where idStory in ( select idStory from LikeStory where idUserInfo = ? )';

    con.query(sql, [OneUser[0].iduserInfo], function (err, results) {
      if (err) {
        res.send(err);
      }
      else {
        res.render('./User/Profile', {
          accessAbility: accessAbility,
          user: OneUser,
          likeStory: results
        });
      }
    });
  }

});

router.get('/like/:id', function (req, res, next) {

  if (accessAbility == 'user') {
    var idStory = parseInt(req.params.id);
    var sqlcheck = 'select * from LikeStory where idUserInfo = ? and idStory = ?';

    con.query(sqlcheck, [OneUser[0].iduserInfo, idStory], function (err, results) {

      if (err) {
        res.send(err);
      }
      else if (results.length == 0) {
        var sqlInsert = "insert into LikeStory (idUserInfo,idStory) values (?,?)";
        con.query(sqlInsert, [OneUser[0].iduserInfo, idStory], function (err, results) {
          if (err)
            throw err;
          else {
            res.redirect('/about/' + idStory);
          }
        });
      }
      else {
        var sqlDel = "delete from LikeStory where idUserInfo = ? and idStory = ? ";
        con.query(sqlDel, [OneUser[0].iduserInfo, idStory], function (err, results) {
          if (err)
            throw err;
          else {
            res.redirect('/about/' + idStory);
          }
        });
      }

    });
  }
  else {
    res.send('cần quyền truy cập user');
  }
});

router.get('/logout', function (req, res, next) {

  accessAbility = "awesome";
  OneUser = [];
  res.redirect("/")

});



var checkUser = false;
var checkgmail = false;
var checkpass = false;

router.get('/checkUserName/:username', function (req, res, next) {

  var userName = req.params.username;
  var sql = "select NameUser from userInfo where NameUser = ?"
  con.query(sql, [userName], function (err, results) {
    if (err) {
      res.send(err);
    }
    else {
      res.send(results.length + '');
      if (results.length) {
        checkUser = false;
      }
      else {
        checkUser = true;
      }
    }
  });

});

router.get('/checkGmail/:gmail', function (req, res, next) {

  var Gmail = req.params.gmail;
  if (Gmail) {
    var sql = "select Email from userInfo where Email = ?"
    con.query(sql, [Gmail], function (err, results) {
      if (err) {
        res.send(err);
      }
      else {
        res.send(results.length + '');

        if (results.length) {
          checkgmail = false;
        }
        else {
          checkgmail = true;
        }

      }
    });
  }
  else {
    res.send(1 + '');
  }

});


router.get('/checkpass/:before/:confirm', function (req, res, next) {

  var before = req.params.before;
  var confirm = req.params.confirm;

  if (before === confirm) {
    res.send('true');
    checkpass = true;
  }
  else {
    res.send('false');
    checkpass = false;
  }

});



router.get('/logup', function (req, res, next) {

  res.render('./LogIn/LogUp', {
    accessAbility: accessAbility
  });

});

router.post('/SignInform', function (req, res, next) {

  if (checkUser === true && checkgmail === true && checkpass === true) {
    var user = {
      userName: req.body.username,
      gmail: req.body.gmail,
      passwordBefore: req.body.passBefore,
      passwordConfirm: req.body.passConfirm
    }

    var sql = "insert into userInfo (Email,Password,NameUser) values (?,?,?);";

    con.query(sql, [user.gmail, user.passwordConfirm, user.userName], function (err, results) {
      if (err) {
        console.log(err);
      }
      else {
        checkUser = false;
        checkgmail = false;
        checkpass = false;
        res.render('./LogIn/ThanhCong', {
          accessAbility: accessAbility
        });
      }
    });

  }
  else {
    checkUser = false;
    checkgmail = false;
    checkpass = false;
    res.render('./LogIn/KhongThanhCong', {
      accessAbility: accessAbility
    });
  }


});


function typeStory(res, str, typeStory) {
  var sql = "select * from Story where typeStory like ?";
  con.query(sql, [str], function (err, results) {
    if (err) {
      res.send(err);
    }
    else {
      res.render('./TypeStory/typeStory', {
        data: results,
        accessAbility: accessAbility,
        typeStory: typeStory
      });
    }
  });
}


router.get('/action', function (req, res, next) {
  var str = "%h%à%n%h%đ%ộ%n%g%";
  var typeStory1 = "Hành Động";
  typeStory(res, str, typeStory1);
});

router.get('/love', function (req, res, next) {
  var str = "%t%ì%n%h%y%ê%u%";
  var typeStory2 = "Tình Yêu";
  typeStory(res, str, typeStory2);
});

router.get('/harem', function (req, res, next) {
  var str = "%h%a%r%e%m%";
  var typeStory3 = "Harem";
  typeStory(res, str, typeStory3);
});

module.exports = router;