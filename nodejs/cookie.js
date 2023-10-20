const http=require("http");
const cookie=require("cookie");

http.createServer(function(req, res){
    console.log(req.headers.cookie);
    let cookies = {};
    
    if(req.headers.cookie!==undefined){
        cookies=cookie.parse(req.headers.cookie);
        // parse 함수는 쿠키가 사라지면 그냥 에러 메시지 전송한다.
    }

    console.log(cookies.yummy_cookie);
    res.writeHead(200, {
        'Set-Cookie':[
            'yummy_cookie=choco', 
            'tasty_cookie=strawberry',
            `Permanent=cookies; Max-Age=${60*60*24*30}`,
            'Secure=Secure; Secure',
            'HttpOnly=HttpOnly; HttpOnly',
            'Path=Path; Path=/cookie',
            'Doamin=Domain; Domain=test.o2.org'
        ]
    });
    res.end("Cookie Monster!!");
}).listen(3000);