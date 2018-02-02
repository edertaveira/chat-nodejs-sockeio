var express = require('express');
var router = express.Router();
var users = [];

/* GET home page. */
router.post('/', function(req, res, next) {
   

  res.render('room', { 
    title: 'Chat - Room',
    email: req.body.email,
    name: req.body.name,
    toEmail: req.body.toEmail
  });



});




module.exports = router;
