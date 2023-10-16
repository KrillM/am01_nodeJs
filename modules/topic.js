const express = require('express');
const router = express.Router();
const fs = require("fs");
const path = require("path");
const sanitizeHtml = require("sanitize-html");
const template = require("./module1.js");
  
router.get("/create", function(req, res){
    let title = 'WEB - create';
    let list = template.list(req.list);
    let html = template.html(title, list, `
        <form action="/topic/process_create" method="post">
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

router.post("/process_create", function(req, res){
    let post = req.body;
    let title = post.title;
    let description = post.description;

    fs.writeFile(`data/${title}`, description, 'utf8', function(err){
        res.redirect(`/topic/${title}`);
    });
});

router.get("/update/:pageId", function(req, res){
    let filteredId = path.parse(req.params.pageId).base;

    fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
        let title = req.params.pageId;
        let list = template.list(req.list);
        let html = template.html(title, list,
        `
        <form action="/topic/process_update" method="post">
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
        `<a href="/topic/create">create</a> <a href="/topic/update/${title}">update</a>`
        );
        res.send(html);
    });
});
  
router.post("/process_update", function(req, res){
    let post = req.body;
    let id = post.id;
    let title = post.title;
    let description = post.description;

    fs.rename(`data/${id}`, `data/${title}`, function(err){
        fs.writeFile(`data/${title}`, description, 'utf8', function(err){
        res.redirect(`/topic/${title}`);
        })
    });
});
  
router.post("/process_delete", function(req, res){
    let post = req.body;
    let id = post.id;
    let filteredId=path.parse(id).base;

    fs.unlink(`data/${filteredId}`, function(err){
        res.redirect("/");
    });
});

router.get("/:pageId", function(req, res, next){
    var filteredId = path.parse(req.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
        if(err){
            next(err);
        }
        else{
            let title = req.params.pageId;
            let sanitizedTitle = sanitizeHtml(title);
            let sanitizedDescription = sanitizeHtml(description, {
                allowedTags:['h1']
            });
            let list = template.list(req.list);
            let html = template.html(sanitizedTitle, list,
                `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
                ` <a href="/topic/create">create</a>
                <a href="/topic/update/${sanitizedTitle}">update</a>
                <form action="/topic/process_delete" method="post">
                    <input type="hidden" name="id" value="${sanitizedTitle}">
                    <input type="submit" value="delete">
                </form>`
            );
            res.send(html);
        }
    });
});
module.exports=router;