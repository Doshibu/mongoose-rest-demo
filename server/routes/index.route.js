var express = require('express');
var mongodb = require('../db');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
   mongodb.getVal(res);
	//res.render('index', { title: 'Express' });
});
router.post('/values', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  var val = req.body.value;

  if (val === undefined || val === "") {
    res.send(JSON.stringify({status: "error", value: "Value undefined"}));
    return
  }
  mongodb.sendVal(val, res);
});
router.put('/values/:id/:data', function(req,res){ //patch pour des champs en particulier
	var id = req.params.id;
	
	var val = req.params.data;

	if (id === undefined || id === "" || val === "undefined" || val === ""){
		res.send('error: empty id or val');
		return;
	}
	mongodb.updVal(id,val,res);
//	res.send(JSON.stringify({status:'ok', value: id}));
	
});
router.delete('/values/:id', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  var uuid = req.params.id;

  if (uuid === undefined || uuid === "") {
    res.send(JSON.stringify({status: "error", value: "UUID undefined"}));
    return
  }
  mongodb.delVal(uuid);
  res.send(JSON.stringify({status: "ok", value: uuid}));
});

module.exports = router;