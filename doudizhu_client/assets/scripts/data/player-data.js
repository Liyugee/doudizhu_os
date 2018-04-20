//生成随机count位字符串
const getRandomStr = function (count) {
    let str = "";
    for (let i = 0; i < count; i++) {
        str += Math.floor(Math.random() * 10);
    }
    return str;
};

let PlayerData = function () {
    let that = {};
    that.uniqueID = "1" + getRandomStr(6);
    // that.uniqueID = "100000";
    that.accountID = "2" + getRandomStr(6);
    that.nickName = "小明" + getRandomStr(2);
    that.avatarUrl = "http://k1.jsqq.net/uploads/allimg/1610/14230K534-2.jpg";
    that.goldCount = 0;


    //微信登录成功返回uniqueID
    that.wxLoginSuccess = function (data) {
        that.uniqueID = data.uniqueID;
        that.nickName = data.nickName;
        that.avatarUrl = data.avatarUrl;
    };

    //给客户端返回登录成功消息
    that.loginSuccess = function (data) {
        console.log("登录成功data: " + JSON.stringify(data,null,2));
        that.accountID = data.accountID;
        that.nickName = data.nickName;
        that.avatarUrl = data.avatarUrl;
    };

    return that;
};

export default PlayerData;