var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.render('index', { title: 'big index', dawgStatus: "yo"});
});

router.get('/dawg', function(req, res, next) {
  res.render('index', { title: 'dawg', dawgStatus: "yo" });

})

router.get('/:id', function(req, res, next) {
  res.send(`${req.params.id}`)
})

module.exports = router;
