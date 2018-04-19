const Player = require("./player");
const Room = require("./room");

/**
 *  游戏管理器game-controller负责管理玩家和房间
 */

let _playerList = [];   //玩家列表
let _roomList = [];     //房间列表

//创建玩家接口
exports.createPlayer = function (data,socket,callBackIndex) {
    let player = Player(data,socket,callBackIndex,this);
    _playerList.push(player);
};

//创建房间接口
exports.createRoom = function (data,player,cb) {
    //todo check goldCount
    let room = Room(data,player);
    _roomList.push(room);
    if (cb) {
        cb(null,"create success " + room.roomID);
    }
};

//加入房间接口
exports.joinRoom = function (data,player,cb) {
    console.log("房间号data: " + JSON.stringify(data));
    for (let i = 0; i < _roomList.length; i++) {
        if(_roomList[i].roomID === data) {
            let room = _roomList[i];
            room.joinPlayer(player);
            if (cb) {
                cb(null,{gold: room.gold});
            }
            return;
        }
    }
    if (cb) {
        cb("the room is not exist: " + data);
    }
};