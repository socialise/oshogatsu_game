//変数群
const NANASHI = 'guest';    //ゲストのクッキー名
const MAX = 4;              //ランキング表示数
var cookie;                 //クッキー

const HOST_URL = 'http://localhost:8080';

//読み込み
var http = require('http');
var json = require('./user.json'); //jsonファイルの取得
var qs = require('querystring');
var url = require('url');
var fs = require('fs');


http.createServer(function (request, res) {
    var error_message = null;

    if (request.method == 'GET') { 

        var query = url.parse(request.url).query;
        var name = qs.parse(query).name
        if (name) {
            res.setHeader('Set-Cookie', ['name=' + encodeURIComponent(name)]);
        }
        cookie = request.headers.cookie;
        //console.log("cookie", cookie);

        if (request.url == '/member') {
            res.writeHead(200, { 'Content-Type': 'application/json' });

            res.write("{");
            //jsonの作成（名前のみ）
            for (var i = 0; i < json.length; i++) {
                var obj = json[i];
                if (obj) {
                    res.write(obj.name);
                } else {
                    continue;
                }
                //末尾でなければカンマをつける
                if (i < json.length - 1) res.write(',');
            }
            res.write("}");
            res.end();                                  //responseを閉じる - member_list
        } else if (!cookie) {
            console.log("<<guest enter>>");
            makingGuestPage(res);
            res.end();
        } else if (request.url == '/' || cookie) {

            console.log("---メインページを表示しました。---")
            makingMainPage(res);
            res.end();                                  //responseを閉じる - main_page
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
            
            console.log("--- 命令コード：" + op);
            console.log("POST-DATA", post);
            switch (op) {
                case '1': //ユーザ登録
                    res.setHeader('Set-Cookie', ['name=' + encodeURIComponent(name)]); //セッション登録
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
                        var point = Number(post.point); //加算分
                        json[index].point += point;
                        console.log(name + "さんのポイントを" + point + "加算しました。");
                        break;
                    }
                case '3': //ユーザ削除処理
                    console.log(name + "さんを削除します");

                    json = json.filter(function (v) {
                        return v.name != name
                    });
                    break;

            }
            if (!error) {
                fs.writeFile('user.json', JSON.stringify(json, null, '    ')); //JSONを上書き
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write('successed processing<br>');
                res.write('<p><a href="' + HOST_URL + '">Go to Home</a></p>');
                res.end();
                console.log('--- END.');
            } else {
                console.log(error_message);
            }
        });
    }
}).listen(8080);
console.log('Server running on 8080');

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

var header =
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

function makingMainPage(res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });

    res.write(header);

    res.charset = 'utf-8'
    
    res.write('<h1>参加者得点一覧</h1>');

    //参加者の得点リスト 作成
    res.write('<ol>');
    var name = decodeURIComponent(cookie.substring(5)) //ﾃﾞｺｰﾄﾞ

    console.log('表示テスト', name);

    json.sort(sort_by('point', true)); //降順ｿｰﾄ
    var myPoint = 0;
    for (var i = 0; i < MAX && i < json.length; i++) { //変数の値まで表示
        var obj = json[i];
        if (obj != null) {
            res.write('<li id="' + i + '">' + obj.name + ':' + obj.point + 'pt</li>');
            if (obj.name == name)
                myPoint = Number(obj.point);

        }
    }
    res.write('</ol>');

    //特定ユーザの得点表示機能
    res.write(name + 'さんのポイントは:' + myPoint);

    res.write('</body>');
    res.write('</html>');
}

function makingGuestPage(res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(header);
    res.charset = 'utf-8'

    res.write('<div style="font-size:75%">');

    res.write('既に登録している人は自分の名前を選んで隣のボタンを押してください');
    res.write('<form action="' + HOST_URL + '" method="GET">');
    res.write('<select name="name">');

    for (var i = 0; i < json.length; i++) {
        var obj = json[i];
        if (obj != null)
            res.write('<option value="' + obj.name + '">' + obj.name + '</option>');
    }
    
    res.write('</select>');
    res.write('<input type="submit" value="送信">');
    res.write('</form><br>');

    res.write('登録をしていない人は下のテキストボックスに名前を入力して、登録ボタンを押してください');
    res.write('<form action="' + HOST_URL + '" method="POST">');
    res.write('<input type="hidden" name="op" value="1">');
    res.write('<input type="text" name="name">');
    res.write('<input type="submit" value="登録">');
    res.write('</form>');
    res.write('<br>ボタンを押したら、更新ボタン(F5)を押してください。')

    res.write('</div>');
    res.write('</body>');
    res.write('</html>');
    
}