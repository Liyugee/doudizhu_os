/**
 * Player类主要用于解析客户端传来数据并回调
 * @param spec  服务端接收/创建的玩家信息
 * @param socket    客户端发送socket消息类型
 * @param cbIndex   客户端callBackMap的key
 * @param gameController    方便调用gameController
 * @returns {{}}    that
 * @constructor
 */
const Player = function (spec,socket,cbIndex,gameController) {
    let that = {};
    let _socket = socket;
    console.log("create new player: " + JSON.stringify(spec));
    that.uniqueID = spec.unique_id;
    that.accountID = spec.account_id;
    that.nickName = spec.nick_name;
    that.goldCount = spec.gold_count;
    that.avatarUrl = spec.avatar_url;

    const notify = function (type,data,callBackIndex) {
        console.log("data: " + JSON.stringify(data));
        _socket.emit("notify",{
            type: type,
            data: data,
            callBackIndex: callBackIndex
        });
        console.log("callBackIndex: " + callBackIndex);
    };

    notify("login",{
        goldCount: that.goldCount
    },cbIndex);

    _socket.on("notify",(notifyData)=>{
        //解析notifyData数据
        let type = notifyData.type;
        let callBackIndex = notifyData.callBackIndex;
        switch (type) {
            case "create_room" :
                gameController.createRoom(notifyData.data,that,(err,data)=>{
                    if (err) {
                        console.log("err: " + err);
                        notify("create_room",{err:err},callBackIndex);
                    } else {
                        console.log("data: " + JSON.stringify(data));
                        notify("create_room",{data: data},callBackIndex);
                    }
                    console.log("create room success");
                });
                break;
            case "join_room" :
                console.log("join room data:  " + JSON.stringify(notifyData.data));
                gameController.joinRoom(notifyData.data,that,(err,data)=>{
                    if (err) {
                        notify("join_room",{err: err},callBackIndex);
                    } else {
                        notify("join_room",{data: data},callBackIndex);
                    }
                });
                break;
            default :
                break;
        }
    });

    return that;
};

module.exports = Player;