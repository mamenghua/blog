var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();

var mongodb = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;

var db_str = "mongodb://localhost:27017/test";

var upload = require('./upload');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//登录
router.post('/login', function(req, res, next) {
	mongodb.connect(db_str,(err,dbs)=>{
		dbs.collection('user',(err,coll)=>{
			coll.find(req.body).toArray((err,data)=>{
				if(data.length>0){
					// 登录成功
					let content = {name:req.body.username}; // token主题
					let miyao = 'jwt'; // 密钥
					let token = jwt.sign(content,miyao,{expiresIn:10*1*1}); //10秒过期

					req.session.username = req.body.username;
					res.json({msg:'success',token:token});
					dbs.close();
				}else{
					res.json({msg:'用户名或密码有误'});
					dbs.close();
				}
			})
		})
	})
});

//注册
router.post('/register',function(req, res, next){
	mongodb.connect(db_str,(err,dbs)=>{
		dbs.collection('user',(err,coll)=>{
			coll.find({"username":req.body.username}).toArray((err,data)=>{
				if(data.length>0){
					res.json({msg:'用户名已存在'});
					dbs.close();
				}else{
					coll.insert(req.body,(err,data)=>{
						if(data.result.ok == "1"){
							res.json({msg:'success'});
							dbs.close();
						}else{
							res.json({msg:'注册失败'});
							dbs.close();
						}
					})
				}
			})
		})
	})
});

// 博客
router.post('/boke',function(req, res, next){
	mongodb.connect(db_str,(err,dbs)=>{
		dbs.collection('boke',(err,coll)=>{
			console.log(req.body);
			coll.insert(req.body,(err,data)=>{
				if(data.result.ok == "1"){
					res.json({msg:'插入成功'});
					dbs.close();
				}else{
					res.json({msg:'插入失败'});
					dbs.close();
				}
			})
		})
	})
});

// 删除博客
router.post('/deleteBoke',function(req,res,next){
	let id = ObjectId(req.body.id);
	mongodb.connect(db_str,(err,dbs)=>{
		dbs.collection('boke',(err,coll)=>{
			coll.remove({_id:id},()=>{
				res.json({msg:'删除成功'});
				dbs.close();
			})
		})
	})
});

// 展示博客
router.post('/showBoke',function(req,res,next){
	let id = ObjectId(req.body.id);
	mongodb.connect(db_str,(err,dbs)=>{
		dbs.collection('boke',(err,coll)=>{
			coll.find({_id:id}).toArray((err,data)=>{
				res.json({msg:data});
				dbs.close();
			})
		})
	})
});

// 修改博客
router.post('/modBoke',function(req, res, next){
	mongodb.connect(db_str,(err,dbs)=>{
		dbs.collection('boke',(err,coll)=>{
			console.log(req.body);
			let id = ObjectId(req.body.id);
			coll.update({_id:id},{$set:{title:req.body.title,content:req.body.content}},()=>{
				res.json({msg:'修改成功'});
				dbs.close();
			})
			// coll.insert(req.body,(err,data)=>{
			// 	if(data.result.ok == "1"){
			// 		res.json({msg:'插入成功'});
			// 		dbs.close();
			// 	}else{
			// 		res.json({msg:'插入失败'});
			// 		dbs.close();
			// 	}
			// })
		})
	})
});

// 上传图片
router.post('/uploadImg',(req,res)=>{
	upload(req,res);
});

module.exports = router;
