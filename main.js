var http = require('http');
var postData = "e";
var querystring = require("querystring");

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
var json = require('./user.json'); //jsonファイルの取得
json.sort(sort_by('point', true)); //降順ソート

var qs = require('querystring');
http.createServer(function (request, res) {

    if (request.method == 'POST') {
        var body = '';
        request.on("data", function (data) {
            body += data;

            //postData += chunk;
            //console.log(chunk);

            //res.write("POST DATA is " + querystring.parse(postData).text);
        });

        request.on("end", function () {
            var post = qs.parse(body);
            console.log(post.id);
            res.end();
        });

    } else {

        res.charset = 'utf-8'
        writeHeader(res); //ヘッダー

        res.write('<h1>参加者得点一覧</h1>');

        //参加者の得点リスト 作成
        res.write('<ol>');

        for (var i = 0; i < json.length; i++) {
            var obj = json[i];
            res.write('<li>' + obj.name + ':' + obj.point + 'pt</li>');
        }
        res.write('</ol>');

        //特定ユーザの得点表示機能
        res.write('あなたのポイントは:');


        writeFooter(res); //フッター

    }
}).listen(8080);

console.log('Server running on 8080');


function writeHeader(res) {

    res.writeHead(200, { 'Content-Type': 'text/html' });

    var text = 
        '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">' +
        '<html lang="ja">' +
        '<head>' +
        '<meta http-equiv="Content-Type" content="text/html; charset=utf-8">' +
        
        //CSS記述
        '<style type="text/css">' +
            'h1{' +
            '    color:red;' +
            '    background:#4cff00;' +
            '}' +
        '</style>' +

        '<title>お正月ゲーム大会</title>' +
        '</head>' +
        '<body>';
    
    res.write(text);
}

function writeFooter(res) {
    res.write('</body>');
    res.write('</html>');
}