var http = require('http');

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
        });
        request.on("end", function () {
            var post = qs.parse(body);
            console.log(post);
            var op = post.op;
            var name = post.name;

            var fs = require('fs');

            switch (op) {
                case '1': //ユーザ登録
                    console.log('ユーザ試作');
                    var obj = {
                        "name": name,
                        "point":0
                    }
                    json[json.length] = obj;
                    console.log("ユーザ作成", obj);
                    fs.writeFile('user.json', JSON.stringify(json, null, '    '));
                    break;
                case '2': //得点操作
                case '3': //ユーザ削除

                    var index = -1;
                    for (var i = 0; i < json.length; i++) {
                        var obj = json[i];
                        if (obj.name == name) index = i;
                    }

                    if (index == -1) break;

                    if (op == 3) {
                        //削除処理
                        break;
                    } else {
                        //得点操作
                        var point = post.point;//加算分
                    }
                    
                    
                    break;
            }
            
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
            res.write('<li id="' + i + '">' + obj.name + ':' + obj.point + 'pt</li>');
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