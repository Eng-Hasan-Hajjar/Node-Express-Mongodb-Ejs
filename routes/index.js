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
        console.log('Failed to get article list');
      } else {
        data.pageTotal = Math.ceil(docs.length/data.pageSize);
        //Query the list of articles on the current page
        model.connect((db) => {
          db.collection('article').find().sort({_id: -1}).limit(data.pageSize).skip((data.pageIndex-1)*data.pageSize).toArray((err, docs2) => {
            if (err) {
              console.log('Failed to get article list pagination data');
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

//Rendering the registration page
router.get('/regist', (req, res) => {
  res.render('regist', {});
})

//Rendering the login page
router.get('/login', (req, res) => {
  res.render('login', {});
})

//Render the write article page
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
          console.log('Article find failed');
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

//Render the article details page
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
        console.log('Article find failed');
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
