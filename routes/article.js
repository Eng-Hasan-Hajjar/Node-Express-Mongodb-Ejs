var express = require('express');
var router = express.Router();
var model = require('../model')

/* GET home page. */
// router.get('/', (req, res) => {
//   let username = req.session.username;
//   res.render('index', { username: username });
// });

//Article addition operation
router.post('/add', (req, res) => {
  var id = parseInt(req.body.id);
  var pageIndex = req.body.pageIndex;
  if (id) {
    var title = req.body.title;
    var content = req.body.content;
    model.connect((db) => {
      db.collection('article').updateOne({id: id}, {$set:{title: title, content: content}}, (err, docs) => {
        if (err) {
          console.log('Article update failed' + err);
        } else {
          console.log('Article updated successfully');
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
          console.log('Article publishing failed');
        } else {
          console.log('Article published successfully');
          res.redirect('/');
        }
      })
    })
  }
})

//Article delete operation
router.get('/delete', (req, res) => {
  var id = parseInt(req.query.id);
  var pageIndex = req.query.pageIndex;
  model.connect((db) => {
    db.collection('article').deleteOne({id: id}, (err, ret) => {
      if (err) {
        console.log('Article deletion failed');
      } else {
        console.log('Article deleted successfully');
      }
      res.redirect('/?pageIndex=' + pageIndex);
    })
  })
})

module.exports = router;