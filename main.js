var http = require('http');
var server = http.createServer();

//jsonのソート関数
var sort_by = function (field, reverse) {
    reverse = (reverse) ? -1 : 1;
    return function (a, b) {
        a = a[field];
        b = b[field];
        
        if (a < b) return reverse * -1;
        if (a > b) return reverse * 1;
        return 0;
    }
}

//jsonの取得→ソート
var json = require('./user.json');
json.sort(sort_by('point', true));
console.log(json);

server.on('request', function (req, res) {
    res.charset = 'utf-8'
    res.writeHead(200, { 'Content-Type': 'text/html' });
    
    res.write('<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">');
    res.write('<html lang="ja">');
    res.write('<head>');
    res.write('<meta http-equiv="Content-Type" content="text/html; charset=utf-8">');
    res.write('<title>お正月ゲーム大会</title>');
    res.write('</head>');
    res.write('<body>');

    res.write('<h1>Hello Node !</h1>');

    //得点表 作成
    res.write('<ol>');

    //while (false) {
        
        for (var i = 0; i < json.length; i++) {
            //document.write("<br><br>jsonay index: " + i);
            var obj = json[i];
            //for (var key in obj) {
            //    var value = obj[key];
            //    document.write("<br> - " + key + ": " + value);
            //}
            res.write('<li>' + obj.name + ':' + obj.point + '</li>');
        }
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