var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {
  res.render('users', { 
    title: 'Chat - Users',
    email: req.body.email,
    name: req.body.name
  });
});

module.exports = router;
