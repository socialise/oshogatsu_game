var arr = [{ "id": "10", "class": "child-of-9" }, { "id": "11", "class": "child-of-10" }];

for (var i = 0; i < arr.length; i++) {
    console.log("<br><br>array index: " + i);
    var obj = arr[i];
    for (var key in obj) {
        var value = obj[key];
        console.log("<br> - " + key + ": " + value);
    }
}