const Player = require("./player");

let _playerList = [];
exports.createPlayer = function (data,socket,callBackIndex) {
    let player = Player(data,socket,callBackIndex);
    _playerList.push(player);
};