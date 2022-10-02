var express = require('express');
var router = express.Router();
var model = require('../model')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//注册接口
router.post('/regist', (req, res) => {
  let data = {
    username: req.body.username,
    password: req.body.password,
    password2: req.body.password2
  }
  //数据校验
  model.connect((db) => {
    db.collection('users').insertOne(data, (err, ret) => {
      if (err) {
        console.log('注册失败');
        res.redirect('/regist')
      } else {
        console.log('注册成功');
        res.redirect('/login');
      }
    })
  })
})

//登录接口
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
        console.log('账号或密码错误');
      } else {
        if (docs.length > 0) {
          //登录成功,进行session会话存储
          req.session.username = data.username;
          res.redirect('/?pageIndex=' + 1);
          console.log('登录成功');
        } else {
          res.redirect('/login');
        }
      }
    })
  })
})

//退出登录
router.get('/logout', (req, res) => {
  req.session.username = null;
  res.redirect('/login');
})

module.exports = router;
