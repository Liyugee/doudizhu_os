/**
 * Player类主要用于解析客户端传来数据并回调
 * @param spec  服务端接收/创建的玩家信息
 * @param socket    客户端发送socket消息类型
 * @param cbIndex   客户端callBackMap的key
 * @param gameController    方便调用gameController
 * @returns {{}}    that
 * @constructor
 */
const Player = function (spec, socket, cbIndex, gameController) {
    let that = {};
    let _socket = socket;
    console.log("create new player: " + JSON.stringify(spec));
    // create new player: {"unique_id":"100000","account_id":"2933146","nick_name":"小明72","gold_count":100,"avatar_url":"http://k1.jsqq.net/uploads/allimg/1610/14230K534-2.jpg"}
    that.goldCount = spec.gold_count;
    that.uniqueID = spec.unique_id;
    that.accountID = spec.account_id;
    that.nickName = spec.nick_name;
    that.avatarUrl = spec.avatar_url;
    that.seatIndex = 0;
    let _room = undefined;
    that.isReady = false;
    that.cards = [];


    const notify = function (type, data, callBackIndex) {
        _socket.emit("notify", {
            type: type,
            data: data,
            callBackIndex: callBackIndex
        });
        console.log("callBackIndex: " + callBackIndex);
        // callBackIndex: 1
    };

    notify("login", {
        goldCount: that.goldCount
    }, cbIndex);

    _socket.on("disconnect", () => {
        console.log("player is offline");
        if (_room) {
            _room.playerOffline(that);
        }
    });

    _socket.on("notify", (notifyData) => {
        //解析notifyData数据
        let type = notifyData.type;
        let callBackIndex = notifyData.callBackIndex;
        switch (type) {
            case "create_room" :
                gameController.createRoom(notifyData.data, that, (err, data) => {
                    if (err) {
                        console.log("err: " + err);
                        notify("create_room", {err: err}, callBackIndex);
                    } else {
                        console.log("create room ID: " + JSON.stringify(data));
                        // data: {"create room ID: ":"023612"}
                        notify("create_room", {data: data}, callBackIndex);
                    }
                    console.log("create room success");
                });
                break;
            case "join_room" :
                console.log("join room data:  " + JSON.stringify(notifyData.data));
                // join room data:  "023612"
                gameController.joinRoom(notifyData.data, that, (err, data) => {
                    if (err) {
                        notify("join_room", {err: err}, callBackIndex);
                    } else {
                        _room = data.room;
                        notify("join_room", {data: data.data}, callBackIndex);
                    }
                });
                break;
            case "enter_room_scene" :
                if (_room) {
                    _room.playerEnterRoomScene(that, (data) => {
                        that.seatIndex = data.seatIndex;
                        notify("enter_room_scene", data, callBackIndex);
                    });
                }
                break;
            case "ready":
                that.isReady = true;
                if (_room) {
                    _room.playerReady(that);
                }
                break;
            case "start_game":
                if (_room) {
                    _room.houseManagerStartGame(that, (err, data) => {
                        if (err) {
                            notify("start_game", {err: err}, callBackIndex);
                        } else {
                            notify("start_game", {data: data}, callBackIndex);
                        }
                    });
                }
                break;
            case "rob_state":
                if (_room) {
                    _room.playerRobMasterState(that, notifyData.data);
                }
                break;
            default :
                break;
        }
    });

    //服务端发送玩家加入消息
    that.sendPlayerJoinRoom = function (data) {
        notify("player_join_room", data, null);
    };

    //服务端发送玩家准备消息
    that.sendPlayerReady = function (data) {
        notify("player_ready", data, null);
    };

    //服务端发送游戏开始消息
    that.sendGameStart = function () {
        notify("game_start", {}, null);
    };

    //服务端发送改变房主消息
    that.sendChangeHouseManager = function (data) {
        notify("change_house_manager", data, null);
    };

    //服务端发送发牌消息
    that.sendPushCard = function (cards) {
        that.cards = cards;
        notify("push_card", cards, null);
    };

    //服务器向玩家发送可以抢地主消息
    that.sendPlayerCanRobMaster = function (data) {
        notify("can_rob_master", data, null);
    };

    //服务器发送玩家抢地主状态
    that.sendPlayerRobMasterState = function (accountID, value) {
        notify("player_rob_state", {accountID: accountID, value: value}, null);
    };

    that.sendChangeMaster = function (player) {
        notify("change_master", player.accountID);
    };

    return that;
};

module.exports = Player;