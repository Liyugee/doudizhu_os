const defines = require("./../defines");

//生成随机count位字符串
const getRandomStr = function (count) {
    let str = "";
    for (let i = 0; i < count; i++) {
        str += Math.floor(Math.random() * 10);
    }
    return str;
};

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
        let index = 0;  //测试座位号
        if (cb) {
            cb({
                seatIndex: index,
                playerData: playerData
            });
        }
    };


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