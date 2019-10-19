var express = require('express');
var mongodb = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var jwt = require('jsonwebtoken');
var router = express.Router();
var db_str = "mongodb://localhost:27017/test";

var async = require('async');

/* GET home page. */
router.get('/', function(req, res, next) {
	// res.render('index', { title: 'Express', username : req.session.username });




	mongodb.connect(db_str,(err,dbs)=>{
		dbs.collection('boke',(err,coll)=>{
			

			// pageNo为显示的页码
			let pageNo = req.query.pageNo;
			pageNo = pageNo ? pageNo : 1;

			// 每页显示的条数
			let size = 3;

			// 总页数
			let page = 0;

			// 记录总条数
			let count = 0;


			async.series([function(callback){
				coll.find().toArray((err,data)=>{
					// 总条数赋值
					count = data.length;

					// 总页数赋值
					page = Math.ceil(count/size);

					// 判断pageNo是否越界
					pageNo = pageNo<=1 ? 1 : pageNo;
					pageNo = pageNo>=page ? page : pageNo;
					
					callback(null,'');
					dbs.close();

				});

			},function(callback){
				coll.find().sort({_id:-1}).limit(size).skip((pageNo-1)*size).toArray((err,data)=>{
					callback(null,data);
					dbs.close();
				})
		
			}
			],(err,data)=>{
				// 注： 此时的data值为 [null,data] 即上面两个回调函数的返回值构成的数组
				res.render('index',{title: 'Express', username : req.session.username,data:data[1],pageNo:pageNo,page:page});
			});

		})

	});
	
	
	// mongodb.connect(db_str,(err,dbs)=>{
	// 	dbs.collection('boke',(err,coll)=>{
	// 		coll.find().sort({_id:-1}).toArray((err,data)=>{
	// 			res.render('index',{title: 'Express', username : req.session.username,data:data});
	// 		})
	// 	})
	// });


	
});

//登录
router.get('/login',(req,res)=>{
	res.render('login',{});
});

//注册
router.get('/register',(req,res)=>{
	res.render('register',{});
});

//退出登录
router.get('/relogin',(req,res)=>{
	req.session.destroy((err)=>{
		if(err) throw err;
		res.redirect('/login');
	});
});

// 校验
router.post('/jiaoyan',(req,res)=>{
	let token = req.headers.token;
	let miyao = 'jwt';
	jwt.verify(token,miyao,(err)=>{
		if(err){
			res.json({code:401,msg:'用户登录已过期'});
		}else{
			res.json({code:200,msg:'登录未过期'});
		}
	});
});

// 博客
router.get('/boke',(req,res)=>{
	res.render('boke',{});
});

// 详情
router.get('/detail',(req,res)=>{
	let id = ObjectId(req.query.id);
	mongodb.connect(db_str,(err,dbs)=>{
		dbs.collection('boke',(err,coll)=>{
			coll.find({_id:id}).toArray((err,data)=>{
				console.log(data);
				res.render('detail',{username:req.session.username,data:data[0]});
			})
		})
	})
})

module.exports = router;
