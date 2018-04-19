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
    that.joinPlayer = function (player) {
    };

    //用于外部获取本地变量（如_bottom）
    Object.defineProperty(that, "bottom",{
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