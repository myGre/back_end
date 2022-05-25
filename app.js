var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const JwtUtil = require('./jwt')

// 导入数据库连接
var gdb = require('./libs/config')
var db;
(async ()=>{
  db = await gdb()
})();

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// // 跨域设置
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  // 添加token,content-type 字段
  res.header('Access-Control-Allow-headers', 'Content-type, Content-length, Authorization, Accept, X-request-With,token,content-type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  req.header('X-Powered-by', '3.2.1');
  if(req.method === 'OPTIONS') {
    res.sendStatus(200)
  }
  else next();
})

app.use(function (req, res, next) {
  // 除了登陆和注册请求接口，其他的请求都需要进行token校验 
  console.log(req.url);
  if (req.url != '/users/login') {
      let token = req.headers.token;
      let jwt = new JwtUtil(token);
      let result = jwt.verifyToken();
      // 如果验证通过就next，否则就返回登陆信息不正确
      if (result == 'err') {
          res.send({code: 403, msg: '登录已过期,请重新登录'});
      } else {
          next();
      }
  } else {
      next();
  }
});
// 注册路由
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/student', require('./routes/students'))
app.use('/workList', require('./routes/workList'))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;
