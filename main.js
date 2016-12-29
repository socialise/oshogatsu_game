var http = require('http');
var server = http.createServer();


//ファイルの読み込み
var fs = require('fs');
var text = fs.readFileSync('user.txt', 'utf-8');
console.log(text);


server.on('request', function (req, res) {
    res.charset = 'utf-8'
    res.writeHead(200, { 'Content-Type': 'text/html' });
    
    res.write('<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">');
    res.write('<html lang="ja">');
    res.write('<head>');
    res.write('<meta http-equiv="Content-Type" content="text/html; charset=utf-8">');
    res.write('<title>');res.write('</title>');
    res.write('</head>');
    res.write('<body>');

    res.write('<h1>Hello Node !</h1>');

    //テンプレ
    res.write('<h2>test</h2>');

    //得点表

    
    res.write('<ol>');

    //while (false) {
        res.write('<li>a</li>');
       
    //}


    res.write('</ol>');


    //特定ユーザの得点表示昨日
    res.write('あなたのポイントは:');

    res.write('</body>');
    res.write('</html>');

    res.end();
});


server.listen(8080);
console.log('Server running on 8080');