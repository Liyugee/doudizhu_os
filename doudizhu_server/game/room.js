const defines = require("./../defines");
const CardManager = require("./card-manager");

//房间状态机
const RoomState = {
    Invailed: -1,
    WaitingReady: 1,
    StartGame: 2,
    PushCard: 3,
    RobMaster: 4,
    ShowBottomCard: 5,
    Playing: 6
};

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
 * @param spec      data
 * @param player    房主
 * @returns {*}     that
 * @constructor
 */
const Room = function (spec, player) {
    let that = {};
    that.roomID = getRandomStr(6);                      //随机房间ID
    let config = defines.createRoomConfig[spec.rate];   //房间规则
    let _bottom = config.bottom;                        //底分
    let _rate = config.rate;                            //倍数
    that.gold = 100;                                    //基础金币
    let _houseManager = player;                         //房主
    let _playerList = [];                               //玩家列表
    let _state = RoomState.Invailed;                    //前一个状态
    let _cardManager = CardManager();                   //卡牌管理器
    let _losePlayer = undefined;                        //上一局输的玩家
    let _robMasterPlayerList = [];                      //抢地主玩家列表
    let _master = undefined;                            //地主
    let _threeCardsList = [];                           //分成四堆的一副牌
    let _pushPlayerList = [];                           //出牌玩家列表
    let _masterIndex = undefined;
    let _currentPlayerPushCardList = undefined;         //当前玩家出的牌

    //设置状态
    const setState = function (state) {
        if (state === _state) {
            return;
        }
        switch (state) {
            case RoomState.WaitingReady:
                break;
            case RoomState.StartGame:
                for (let i = 0; i < _playerList.length; i++) {
                    _playerList[i].sendGameStart();
                }
                setState(RoomState.PushCard);
                break;
            case RoomState.PushCard:
                console.log("push card");
                _threeCardsList = _cardManager.getThreeCards();
                for (let i = 0; i < _playerList.length; i++) {
                    _playerList[i].sendPushCard(_threeCardsList[i]);
                }
                setState(RoomState.RobMaster);
                break;
            case RoomState.RobMaster:
                _robMasterPlayerList = [];
                if (_losePlayer === undefined) {
                    for (let i = _playerList.length - 1; i >= 0; i--) {
                        _robMasterPlayerList.push(_playerList[i]);
                    }
                }
                turnPlayerRobMaster();
                break;
            case RoomState.ShowBottomCard:
                for (let i = 0; i < _playerList.length; i++) {
                    _playerList[i].sendShowBottomCard(_threeCardsList[3]);
                }
                setTimeout(() => {
                    setState(RoomState.Playing);
                }, 2000);
                break;
            case RoomState.Playing:
                for (let i = 0; i < _playerList.length; i++) {
                    if (_playerList[i].accountID === _master.accountID) {
                        _masterIndex = i;
                    }
                }

                turnPlayerPushCard();
                break;
            default:
                break;
        }
        _state = state;
    };
    setState(RoomState.WaitingReady);


    // 玩家加入
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

    //玩家进入房间
    that.playerEnterRoomScene = function (player, cb) {
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

    //广播玩家抢地主状态，轮番抢地主
    that.playerRobMasterState = function (player, value) {
        if (value === "ok") {
            console.log("rob master ok");
            _master = player;
        } else if (value === "no_ok") {
            console.log("rob master no ok");
        }
        for (let i = 0; i < _playerList.length; i++) {
            _playerList[i].sendPlayerRobMasterState(player.accountID, value);
        }
        turnPlayerRobMaster();
    };

    //改变房主（房主退出/离线）
    const changeHouseManager = function () {
        if (_playerList.length === 0) {
            return;
        }
        _houseManager = _playerList[0];
        for (let i = 0; i < _playerList.length; i++) {
            _playerList[i].sendChangeHouseManager(_houseManager.accountID);
        }
    };

    //轮番抢地主
    const turnPlayerRobMaster = function () {
        if (_robMasterPlayerList.length === 0) {
            console.log("抢地主结束");
            changeMaster();
            return;
        }
        let player = _robMasterPlayerList.pop();
        if (_robMasterPlayerList.length === 0 && _master === undefined) {
            _master = player;
            changeMaster();
            return;
        }
        for (let i = 0; i < _playerList.length; i++) {
            _playerList[i].sendPlayerCanRobMaster(player.accountID);
        }
    };

    //确定地主
    const changeMaster = function () {
        for (let i = 0; i < _playerList.length; i++) {
            _playerList[i].sendChangeMaster(_master);
        }
        setState(RoomState.ShowBottomCard);
    };

    //轮流出牌
    const turnPlayerPushCard = function () {
        if (_pushPlayerList.length === 0) {
            referTurnPushPlayer();
        }
        let player = _pushPlayerList.pop();
        for (let i = 0; i < _playerList.length; i++) {
            _playerList[i].sendPlayerCanPushCard(player.accountID);
        }
    };

    //刷新轮流出牌
    const referTurnPushPlayer = function () {
        let index = _masterIndex;
        for (let i = _playerList.length - 1; i >= 0; i--) {
            let z = index;
            if (z >= 3) {
                z -= 3;
            }
            _pushPlayerList[i] = _playerList[z];
            index++;
        }
    };

    //玩家出牌
    that.playerPushCard = function (player, cards, cb) {
        console.log("玩家出牌cards: " + JSON.stringify(cards));
        //玩家选择不出牌
        if (cards.length === 0) {
            turnPlayerPushCard();
        } else {
            //玩家出的牌符合规则
            if (_cardManager.isStantardCards(cards)) {
                //还没有人出牌
                if (_currentPlayerPushCardList === undefined) {
                    if (cb) {
                        cb(null, "出牌成功");
                    }
                    turnPlayerPushCard();
                } else {

                }
            } else {
                if (cb) {
                    cb("不可用的牌型");
                }
            }
        }
    };

    //玩家离线
    that.playerOffline = function (player) {
        for (let i = 0; i < _playerList.length; i++) {
            if (_playerList[i].accountID === player.accountID) {
                _playerList.splice(i, 1);
                if (player.accountID === _houseManager.accountID) {
                    changeHouseManager();
                }
            }
        }
    };

    // 玩家准备
    that.playerReady = function (player) {
        for (let i = 0; i < _playerList.length; i++) {
            _playerList[i].sendPlayerReady(player.accountID);
        }
    };

    //房主开始游戏
    that.houseManagerStartGame = function (player, cb) {
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
            cb(null, "success");
        }
        setState(RoomState.StartGame);
    };


    //外部获取私有变量的方法
    Object.defineProperty(that, "bottom", {
        get() {
            return _bottom;
        }
        // set (val) {
        //     _bottom = val;
        // }
    });

    Object.defineProperty(that, "rate", {
        get() {
            return _rate;
        }
    });

    return that;
};

module.exports = Room;