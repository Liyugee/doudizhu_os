const socket = require("socket.io");
const app = socket("3000");
const myDB = require("./db");
const defines = require("./defines");
const gameController = require("./game/game-controller");

//连接数据库
myDB.connect({
    "host": "127.0.0.1",
    "port": 3306,
    "user": "root",
    "password": "2046",
    "database": "doudizhu"
});

//创建玩家信息
// myDB.createPlayerInfo("10000","1000","小明",5,"http://k1.jsqq.net/uploads/allimg/1610/14230K534-2.jpg");

myDB.getPlayerInfoWithUniqueID("100000",(err,data)=>{
    console.log("data: " + JSON.stringify(data,null,2));
});

app.on("connection",function (socket) {
    console.log("a user connected");
    socket.emit('connection', 'connection success');    //链接客户端测试
    socket.on("notify",(notifyData)=> {
        console.log("接收 notify " + JSON.stringify(notifyData,null,2));
        // socket.emit("notify",{callBackIndex: data.callBackIndex, data: "login success"});    //测试
        switch (notifyData.type) {
            case "login":
                let uniqueID = notifyData.data.uniqueID;
                let callBackIndex = notifyData.callBackIndex;
                myDB.getPlayerInfoWithUniqueID(uniqueID,(err,data)=>{
                    if (err) {
                        console.log("err: " + err);
                    } else {
                        console.log("接收 data: " + JSON.stringify(data));
                        if (data.length === 0) {
                            let loginData = notifyData.data;
                            myDB.createPlayerInfo(
                                loginData.uniqueID,
                                loginData.accountID,
                                loginData.nickName,
                                defines.defaultGoldCount,
                                loginData.avatarUrl
                            );
                            gameController.createPlayer({
                                "unique_id": notifyData.data.uniqueID,
                                "account_id": notifyData.data.accountID,
                                "nick_name": notifyData.data.nickName,
                                "gold_count": defines.defaultGoldCount,
                                "avatar_url": notifyData.data.avatarUrl
                            },socket,callBackIndex);
                        } else {
                            console.log("创建玩家 data: " + JSON.stringify(data,null,2));
                            gameController.createPlayer(data[0],socket,callBackIndex);
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