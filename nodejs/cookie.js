const http=require("http");
const cookie=require("cookie");

http.createServer(function(req, res){
    console.log(req.headers.cookie);
    let cookies = {};
    
    if(req.headers.cookie!=undefined){
        cookies=cookie.parse(req.headers.cookie);
    }

    console.log(cookies.yummy_cookie);
    res.writeHead(200, {
        'Set-Cookie':['yummy_cookie=choco', 'tasty_cookie=strawberry']
    });
    res.end("Cookie Monster!!");
}).listen(3000);