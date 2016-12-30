var http = require('http');
var json = require('./user.json'); //jsonファイルの取得
var qs = require('querystring');
var url = require('url');

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

http.createServer(function (request, res) {
    var error_message = null;

    if (request.method == 'GET') {

        if (request.url == '/') {
            console.log("write")
            makingMainPage(res);

        } else if (request.url == '/member') {
            res.writeHead(200, { 'Content-Type': 'application/json' });

            res.write("{");
            //jsonの走査
            for (var i = 0; i < json.length; i++) {
                var obj = json[i];
                if (obj != null) {
                    res.write(obj.name);
                } else {
                    //res.write('null');
                    continue;
                }
                //末尾でなければカンマをつける
                if (i < json.length - 1) res.write(',');
            }
            res.write("}");
        }
    } else {
        var body = '';

        request.on("data", function (data) {
            body += data;
        });
        request.on("end", function () {
            var post = qs.parse(body);
            var op = post.op;
            var name = post.name;
            var error = false;
            console.log("POST-DATA", post);
            console.log("---命令コード：" + op);
            switch (op) {
                case '1': //ユーザ登録
                    var obj = {
                        "name": name,
                        "point": 0
                    }
                    json.push(obj);
                    console.log("ユーザ作成", obj);
                    break;
                case '2': //得点操作

                    var index = -1;
                    for (var i = 0; i < json.length; i++) {
                        var obj = json[i];
                        if (obj != null && obj.name == name) index = i;
                    }
                    if (index == -1) {
                        error = true;
                        error_message = "該当データはありませんでした。"
                        break;
                    }

                    if (op == '2') {
                        console.log(name + "さんのポイントを" + point + "加算します。")
                        var point = Number(post.point); //加算分
                        json[index].point += point;
                        break;
                    }
                case '3': //ユーザ削除処理
                    console.log(name + "さんを削除します");

                    json = json.filter(function (v) {
                        return v.name != name
                    });

                    //delete json[index];
                    break;

            }
            if (!error) {
                var fs = require('fs');
                fs.writeFile('user.json', JSON.stringify(json, null, '    '));
                res.write('successed processing');
                res.end();
            } else {
                console.log(error_message);
            }
        });

    }
}).listen(8080);

console.log('Server running on 8080');

function makingMainPage(res) {
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

    res.charset = 'utf-8'
    
    res.write('<h1>参加者得点一覧</h1>');

    //参加者の得点リスト 作成
    res.write('<ol>');

    json.sort(sort_by('point', true)); //降順ソート
    for (var i = 0; i < json.length; i++) {
        var obj = json[i];
        if (obj != null)
            res.write('<li id="' + i + '">' + obj.name + ':' + obj.point + 'pt</li>');
    }
    res.write('</ol>');

    //特定ユーザの得点表示機能
    res.write('あなたのポイントは:');

    res.write('</body>');
    res.write('</html>');
}