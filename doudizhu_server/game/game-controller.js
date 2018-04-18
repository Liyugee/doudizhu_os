const Player = require("./player");
const Room = require("./room");

/**
 *  游戏管理器game-controller负责创建玩家和创建房间
 */

let _playerList = [];   //玩家列表
let _roomList = [];

exports.createPlayer = function (data,socket,callBackIndex) {
    let player = Player(data,socket,callBackIndex,this);
    _playerList.push(player);
};

exports.createRoom = function (data,player,cb) {
    //todo check goldCount
    let room = Room(data,player);
    _roomList.push(room);
    if (cb) {
        cb(null,"create success " + room.roomID);
    }
};