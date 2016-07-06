var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.writeHead(301,
    {Location: '/checkurl'}
  );
res.end();
  //res.render('index', { title: 'Express' });
});

module.exports = router;
