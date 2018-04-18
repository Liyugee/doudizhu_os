
const Player = function (spec,socket,cbIndex) {
    let that = {};
    let _socket = socket;
    console.log("create new player: " + JSON.stringify(spec));
    that.uniqueID = spec.unique_id;
    that.accountID = spec.account_id;
    that.nickName = spec.nick_name;
    that.goldCount = spec.gold_count;
    that.avatarUrl = spec.avatar_url;

    /**服务端=>客户端回调
     * @param type socket消息类型
     * @param data  服务端接收/创建的玩家信息
     * @param callBackIndex 客户端callBackMap的key
     */
    const notify = function (type,data,callBackIndex) {
        console.log("回调 data: " + JSON.stringify(data));
        _socket.emit("notify",{
            type: type,
            data: data,
            callBackIndex: callBackIndex
        });
        console.log("回调 callBackIndex: " + callBackIndex);
    };

    notify("login",{
        goldCount: that.goldCount
    },cbIndex);

    _socket.on("notify",(notifyData)=>{
        //解析notifyData数据
        let type = notifyData.type;
        let data = notifyData.data;
        let callBackIndex = notifyData.callBackIndex;
        switch (type) {
            case "create_room" :
                notify("create_room",{data:"create_room"},callBackIndex);
                break;
            default :
                break;
        }
    });

    return that;
};

module.exports = Player;