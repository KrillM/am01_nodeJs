const express = require('express');
const app = express();
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const compression = require("compression");
const sanitizeHtml = require("sanitize-html");
const template = require("./module1.js");
 
app.use(bodyParser.urlencoded({extended: false}));
app.use(compression());

// app.get('/', (req, res) => res.send('Hello World!'))
app.get("/", function(req, res){
  fs.readdir("./data", function(err, filelist){
    let title = "Welcome";
    let description = "Hello Node.js Express";
    let list = template.list(filelist);
    let html = template.html(title, list, 
      `<h2>${title}</h2>${description}`,
      `<a href="/create">create</a>`
      );
      res.send(html);
  });
});

app.get("/page/:pageId", function(req, res){
  fs.readdir('./data', function(err, filelist){
    var filteredId = path.parse(req.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
      let title = req.params.pageId;
      let sanitizedTitle = sanitizeHtml(title);
      let sanitizedDescription = sanitizeHtml(description, {
        allowedTags:['h1']
      });
      let list = template.list(filelist);
      let html = template.html(sanitizedTitle, list,
        `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
        ` <a href="/create">create</a>
          <a href="/update/${sanitizedTitle}">update</a>
          <form action="/process_delete" method="post">
            <input type="hidden" name="id" value="${sanitizedTitle}">
            <input type="submit" value="delete">
          </form>`
      );
      res.send(html);
    });
  });
});

app.get("/create", function(req, res){
  fs.readdir('./data', function(err, filelist){
    let title = 'WEB - create';
    let list = template.list(filelist);
    let html = template.html(title, list, `
      <form action="http://localhost:3002/process_create" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
          <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
          <input type="submit">
        </p>
      </form>
    `,'');
    res.send(html);
  });
});

app.post("/process_create", function(req, res){
  let post = req.body;
  let title = post.title;
  let description = post.description;
  
  fs.writeFile(`data/${title}`, description, 'utf8', function(err){
    res.writeHead(302, {Location: `/?id=${title}`});
    res.end();
  });
});

app.get("/update/:pageId", function(req, res){
  fs.readdir('./data', function(err, filelist){
    let filteredId = path.parse(req.params.pageId).base;

    fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
      let title = req.params.pageId;
      let list = template.list(filelist);
      let html = template.html(title, list,
        `
        <form action="/process_update" method="post">
          <input type="hidden" name="id" value="${title}">
          <p><input type="text" name="title" placeholder="title" value="${title}"></p>
          <p>
            <textarea name="description" placeholder="description">${description}</textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
        `,
        `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
      );
      res.send(html);
    });
  });
});

app.post("/process_update", function(req, res){
  let post = req.body;
  let id = post.id;
  let title = post.title;
  let description = post.description;

  fs.rename(`data/${id}`, `data/${title}`, function(err){
    fs.writeFile(`data/${title}`, description, 'utf8', function(err){
      res.redirect(`/?id=${title}`);
    })
  });
});

app.post("/process_delete", function(req, res){
  let post = req.body;
  let id = post.id;
  let filteredId=path.parse(id).base;

  fs.unlink(`data/${filteredId}`, function(err){
    res.redirect("/");
  });
});

// app.listen(3002, () => console.log('Example app listening on port 3000!'))
app.listen(3002, function(){
  console.log("3002번 포트에서 접속하세요.")
})