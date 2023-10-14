const express = require('express');
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser");
const compression = require("compression");
const template = require("./modules/module1.js");
const topicRouter=require("./modules/topic");

app.use("/img", express.static(__dirname + "/img"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(compression());
app.get('*', function(req, res, next){
  fs.readdir('./data', function(err, filelist){
    req.list = filelist;
    next();
  });
});
app.use("/topic", topicRouter);

app.get("/", function(req, res){
  let title = "Welcome";
  let description = "Hello Node.js Express";
  let list = template.list(req.list);
  let html = template.html(title, list, 
    `<h2>${title}</h2>${description}
    <img src="/img/picnic.jpg" style="width:300px; display:block; margin-top:10px;">`,
    `<a href="/topic/create">create</a>`
    );
    res.send(html);
});

app.use(function(req, res, next){
  res.status(404).send("찾을 수 없는 정보입니다.");
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send("서버 이상입니다.");
});

// app.listen(3002, () => console.log('Example app listening on port 3000!'))
app.listen(3002, function(){
  console.log("3002번 포트에서 접속하세요.")
})