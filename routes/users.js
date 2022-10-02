var express = require('express');
var router = express.Router();
var model = require('../model')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//register interface
router.post('/regist', (req, res) => {
  let data = {
    username: req.body.username,
    password: req.body.password,
    password2: req.body.password2
  }
  //Data validation
  model.connect((db) => {
    db.collection('users').insertOne(data, (err, ret) => {
      if (err) {
        console.log('registration failed');
        res.redirect('/regist')
      } else {
        console.log('registration success');
        res.redirect('/login');
      }
    })
  })
})

//login interface
router.post('/login', (req, res) => {
  let data = {
    username: req.body.username,
    password: req.body.password
  }
  console.log(data);
  model.connect((db) => {
    db.collection('users').find(data).toArray((err, docs) => {
      if (err) {
        res.redirect('/login');
        console.log('Incorrect username or password');
      } else {
        if (docs.length > 0) {
          //Successful login, session session storage
          req.session.username = data.username;
          res.redirect('/?pageIndex=' + 1);
          console.log('login successful');
        } else {
          res.redirect('/login');
        }
      }
    })
  })
})

//sign out
router.get('/logout', (req, res) => {
  req.session.username = null;
  res.redirect('/login');
})

module.exports = router;
