const defines = require("./../defines");

//生成随机count位字符串
const getRandomStr = function (count) {
    let str = "";
    for (let i = 0; i < count; i++) {
        str += Math.floor(Math.random() * 10);
    }
    return str;
};

//获取玩家座位号
const getSeatIndex = function (playerList) {
    let z = 0;
    if (playerList.length === 0) {
        return z;
    }
    for (let i = 0; i < playerList.length; i++) {
        if (z !== playerList[i].seatIndex) {
            return z;
        }
        z++
    }
    console.log("z: " + z);
    return z;
};

/**
 * Room类
 * @param spec  data
 * @param player    房主
 * @returns {*}     that
 * @constructor
 */
const Room = function (spec,player) {
    let that = {};
    that.roomID = getRandomStr(6);
    let config = defines.createRoomConfig[spec.rate];
    let _bottom = config.bottom;
    let _rate = config.rate;
    that.gold = 100;
    let _houseManager = player;
    let _playerList = [];

    
    that.joinPlayer = function (player) {
        player.seatIndex = getSeatIndex(_playerList);
        for (let i = 0; i < _playerList.length; i++) {
            _playerList[i].sendPlayerJoinRoom({
                nickName: player.nickName,
                accountID: player.accountID,
                avatarUrl: player.avatarUrl,
                gold: player.goldCount,
                seatIndex: player.seatIndex
            });
        }
        _playerList.push(player);
    };

    that.playerEnterRoomScene = function (player,cb) {
        let playerData = [];
        for (let i = 0; i < _playerList.length; i++) {
            playerData.push({
                nickName: _playerList[i].nickName,
                accountID: _playerList[i].accountID,
                avatarUrl: _playerList[i].avatarUrl,
                gold: _playerList[i].goldCount,
                seatIndex: _playerList[i].seatIndex
            });
        }
        if (cb) {
            cb({
                seatIndex: player.seatIndex,
                playerData: playerData,
                roomID: that.roomID,
                houseManagerID: _houseManager.accountID
            });
        }
    };

    that.changeHouseManager = function () {
        if (_playerList.length === 0) {
            return;
        }
        _houseManager = _playerList[0];
    };

    that.gameStart = function () {
        for (let i = 0; i < _playerList.length; i++) {
            _playerList[i].sendGameStart();
        }
    };

    that.playerOffline = function (player) {
        for (let i = 0; i < _playerList.length; i++) {
            if (_playerList[i].accountID === player.accountID) {
                _playerList.splice(i,1);
                if (player.accountID === _houseManager.accountID) {
                    that.changeHouseManager();
                }
            }
        }
    };
    
    that.playerReady = function (player) {
        for (let i = 0; i < _playerList.length; i++) {
            _playerList[i].sendPlayerReady(player.accountID);
        }
    };

    that.houseManagerStartGame = function (player,cb) {
        if (_playerList.length !== defines.roomFullPlayerCount) {
            if (cb) {
                cb("人数不足，不能开始游戏");
            }
            return;
        }
        for (let i = 0; i < _playerList.length; i++) {
            if (_playerList[i].accountID !== _houseManager.accountID) {
                if (_playerList[i].isReady === false) {
                    if (cb) {
                        cb("有玩家未准备，不能开始游戏");
                    }
                    return;
                }
            }
        }
        if (cb) {
            cb(null,"success");
        }
        that.gameStart();
    };

    //外部获取私有变量的方法
    Object.defineProperty(that,"bottom",{
        get () {
            return _bottom;
        }
        // set (val) {
        //     _bottom = val;
        // }
    });

    Object.defineProperty(that,"rate",{
        get () {
            return _rate;
        }
    });

    return that;
};

module.exports = Room;