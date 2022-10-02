var express = require('express');
var router = express.Router();
var model = require('../model');
var moment = require('moment');

/* GET home page. */
router.get('/', function(req, res) {
  let username = req.session.username;
  var data = {
    pageIndex: req.query.pageIndex || 1,
    pageTotal: 0,
    pageSize: 3,
    list: []
  }
  model.connect((db) => {
    db.collection('article').find().toArray((err, docs) => {
      if (err) {
        console.log('获取文章列表失败');
      } else {
        data.pageTotal = Math.ceil(docs.length/data.pageSize);
        //查询当前页的文章列表
        model.connect((db) => {
          db.collection('article').find().sort({_id: -1}).limit(data.pageSize).skip((data.pageIndex-1)*data.pageSize).toArray((err, docs2) => {
            if (err) {
              console.log('获取文章列表分页数据失败');
            } else {
              if (docs2.length === 0) {
                res.redirect('/?pageIndex='+ ((data.pageIndex-1) || 1))
              } else {
                data.list = docs2;
                data.list.map((item) => {
                  item['time'] = moment(item.id).format('YYYY-MM-DD HH:mm:ss');
                })
                res.render('index', { username: username, data: data });
              }
            }
          })
        })
      }
    })
  })
});

//渲染注册页
router.get('/regist', (req, res) => {
  res.render('regist', {});
})

//渲染登录页
router.get('/login', (req, res) => {
  res.render('login', {});
})

//渲染写文章页面
router.get('/write', (req, res) => {
  let username = req.session.username;
  var id = parseInt(req.query.id);
  var pageIndex = req.query.pageIndex;
  var currentArticle = {
    title: '',
    content: ''
  }
  if (id) {
    model.connect((db) => {
      db.collection('article').findOne({id: id}, (err, docs) => {
        if (err) {
          console.log('文章查找失败');
        } else {
          currentArticle = docs;
          currentArticle['pageIndex'] = pageIndex; 
          res.render('write', {username: username, currentArticle: currentArticle});
        }
      })
    })
  } else {
    res.render('write', {username: username, currentArticle: currentArticle});
  }
})

//渲染文章详情页面
router.get('/article-detail', (req, res) => {
  var id = parseInt(req.query.id);
  var username = req.session.username;
  var currentArticle = {
    title: '',
    content: ''
  }
  model.connect((db) => {
    db.collection('article').findOne({id: id}, (err, docs) => {
      if (err) {
        console.log('文章查找失败');
      } else {
        currentArticle = docs;
        currentArticle['time'] = moment(currentArticle.id).format('YYYY-MM-DD HH:mm:ss');
        console.log(currentArticle);
        res.render('article-detail', {username: username, currentArticle: currentArticle});
      }
    })
  })
})

module.exports = router;
