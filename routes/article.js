var express = require('express');
var router = express.Router();
var model = require('../model')

/* GET home page. */
// router.get('/', (req, res) => {
//   let username = req.session.username;
//   res.render('index', { username: username });
// });

//文章添加操作
router.post('/add', (req, res) => {
  var id = parseInt(req.body.id);
  var pageIndex = req.body.pageIndex;
  if (id) {
    var title = req.body.title;
    var content = req.body.content;
    model.connect((db) => {
      db.collection('article').updateOne({id: id}, {$set:{title: title, content: content}}, (err, docs) => {
        if (err) {
          console.log('文章更新失败' + err);
        } else {
          console.log('文章更新成功');
          res.redirect('/?pageIndex=' + pageIndex);
        }
      })
    })
  } else {
    let data = {
      id: Date.now(),
      username: req.session.username,
      title: req.body.title,
      content: req.body.content
    }
    model.connect((db) => {
      db.collection('article').insertOne(data, (err, ret) => {
        if (err) {
          console.log('文章发布失败');
        } else {
          console.log('文章发布成功');
          res.redirect('/');
        }
      })
    })
  }
})

//文章删除操作
router.get('/delete', (req, res) => {
  var id = parseInt(req.query.id);
  var pageIndex = req.query.pageIndex;
  model.connect((db) => {
    db.collection('article').deleteOne({id: id}, (err, ret) => {
      if (err) {
        console.log('文章删除失败');
      } else {
        console.log('文章删除成功');
      }
      res.redirect('/?pageIndex=' + pageIndex);
    })
  })
})

module.exports = router;