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
    that.roomID = getRandomStr(5);
    let _houseManager = player;
    // that.gold = spec.gold;

    return that;
};

module.exports = Room;