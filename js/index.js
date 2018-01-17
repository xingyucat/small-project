//打开数据库，数据库名，版本号，数据库的描述，数据库大小
var db = openDatabase('testdb', '', '数据库', 204800);
//sql语句执行成功后执行的回调函数
function onSuccess(tx, rs) {
    console.log("Success");
    loadAll();
}
//sql语句执行失败后执行的回调函数
function onError(tx, error) {
    console.log("error：" + error.message);
}
//将所有存储在sqlLite数据库中的联系人全部取出来
function loadAll() {
    $(".progress-bar").animate({"width":"100%"});
    var list = document.getElementById("list");
    db.transaction(function (tx) {
        //如果数据表不存在，则创建数据表
        tx.executeSql('create table if not exists test(id INTERGET PARMARY KEY,work text,createtime INTEGER)', []);
        //查询所有联系人记录
        tx.executeSql('select * from test', [], function (tx, rs) {
            if (rs.rows.length > 0) {
                var result = "<table class='table table-striped table-hover'>";
                result += "<tr class='info'><th>序号</th><th>工作</th><th>添加时间</th><th>操作</th></tr>";
                for (var i = 0; i < rs.rows.length; i++) {
                    var row = rs.rows.item(i);
                    //转换时间，并格式化输出
                    var time = new Date();
                    time.setTime(row.createtime);
                    var timeStr = time.format("yyyy-MM-dd hh:mm:ss");
                    //拼装一个表格的行节点
                    result += "<tr class=''><td>" + row.id + "</td><td>" + row.work + "</td><td>" + timeStr + "</td><td><input type='button' value='修改' onclick='update(" + row.id + ")'/><input type='button' value='删除' onclick='del(" + row.id + ")'/></td></tr>";
                    var hdn = document.getElementById("hidden").innerText = row.id + 1;
                }
                list.innerHTML = result;
            } else {
                list.innerHTML = "Add Works";
            }
        });
    });
}
//保存数据
function save() {
    $(this).attributes = " disabled";
    var works = document.getElementById("works").value;
    if (works == "") {
        console.log(222);
        return;
    }
    var hdn = document.getElementById("hidden").innerText;
    //创建时间
    var time = new Date().getTime();
    db.transaction(function (tx) {
        tx.executeSql('insert into test values(?,?,?)', [hdn, works, time], onSuccess, onError);
    });
    $(".works").val("");
}
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
        (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1,
                RegExp.$1.length == 1 ? o[k] :
                    ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}
//删除工作信息
function del(id) {
    db.transaction(function (tx) {
        //注意这里需要显示的将传入的参数work转变为字符串类型
        tx.executeSql('delete from test where id=?', [String(id)], onSuccess, onError);
    });
}

//更新工作信息
function update(id) {
    var works = document.getElementById("works").value;
    db.transaction(function (tx) {
        //注意这里需要显示的将传入的参数work转变为字符串类型
        tx.executeSql('update test set work = ? where id= ?', [works, id], onSuccess, onError);
    });
}



