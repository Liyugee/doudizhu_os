const socket = require("socket.io");
const app = socket("3000");
const myDB = require("./db");
const defines = require("./defines");

//连接数据库
myDB.connect({
    "host": "127.0.0.1",
    "port": 3306,
    "user": "root",
    "password": "2046",
    "database": "doudizhu"
});

//创建玩家信息接口
// myDB.createPlayerInfo("10000","1000","小明",5,"http://k1.jsqq.net/uploads/allimg/1610/14230K534-2.jpg");

//获取玩家信息接口
// myDB.getPlayerInfoWithAccountID("100000",(err,data)=>{
//     if (err) {
//         console.log("err: " + err);
//     } else {
//         console.log("data: " + JSON.stringify(data));
//     }
// });

app.on("connection",function (socket) {
    console.log("a user connected");
    socket.emit('connection', 'connection success');    //链接客户端测试
    socket.on("notify",(notifyData)=> {
        console.log("notify " + JSON.stringify(notifyData,null,2));
        // socket.emit("notify",{callBackIndex: data.callBackIndex, data: "login success"});    //测试
        switch (notifyData.type) {
            case "login":
                let uniqueID = notifyData.data.uniqueID;
                console.log("===========uniqueID: " + uniqueID);
                myDB.getPlayerInfoWithUniqueID(uniqueID,(err,data)=>{
                    if (err) {
                        console.log("err: " + err);
                    } else {
                        console.log("data: " + JSON.stringify(data));
                        if (data.length === 0) {
                            let loginData = notifyData.data;
                            myDB.createPlayerInfo(
                                loginData.uniqueID,
                                loginData.accountID,
                                loginData.nickName,
                                defines.defaultGoldCount,
                                loginData.avatarUrl
                            )
                        } else {
                            console.log("data: " + JSON.stringify(data,null,2));
                        }
                    }
                });
                break;
            default:
                break;
        }
    });
});

console.log("listen 3000");