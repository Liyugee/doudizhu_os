const Card = require("./card");

const CardValue = {
    "A": 12,
    "2": 13,
    "3": 1,
    "4": 2,
    "5": 3,
    "6": 4,
    "7": 5,
    "8": 6,
    "9": 7,
    "10": 8,
    "J": 9,
    "Q": 10,
    "K": 11
};

const CardShape = {
    "S": 1, //Spade黑桃
    "H": 2, //Heart红桃
    "C": 3, //Club梅花
    "D": 4  //Diamond方块
};

const Kings = {
    k: 54,  //小王
    K: 53   //大王
};

const CardManager = function () {
    let that = {};
    let _cardList = [];

    // 创建一副牌，洗牌
    const createCards = function () {
        let cardList = [];
        for (let i in CardValue) {
            for (let j in CardShape) {
                let card = Card(CardValue[i],CardShape[j],0);
                card.id = cardList.length;
                cardList.push(card);
            }
        }
        for (let i in Kings) {
            let card = Card(undefined,undefined,Kings[i]);
            card.id = cardList.length;
            cardList.push(card);
        }
        for (let i = 0; i < cardList.length; i++) {
            let random = Math.floor(Math.random() * cardList.length);
            let temp = cardList[random];
            cardList[random] = cardList[i];
            cardList[i] = temp;
        }
        // for (let i = 0; i < cardList.length; i++) {
        //     console.log("card id: " + cardList[i].id);
        // }
        return cardList;
    };

    _cardList = createCards();

    //发牌，3个人各分17张，每分一张从排队减一张，剩3张底牌
    that.getThreeCards = function () {
        let threeCardsMap = {};
        for (let i = 0; i < 17; i++) {
            for (let j = 0; j < 3; j++) {
                if (threeCardsMap.hasOwnProperty(j)) {
                    threeCardsMap[j].push(_cardList.pop());
                } else {
                    threeCardsMap[j] = [_cardList.pop()];
                }
            }
        }
        let cardlist  = [
            Card(CardValue["3"],CardShape["S"]),
            Card(CardValue["3"],CardShape["S"]),
            Card(CardValue["3"],CardShape["S"]),
            Card(CardValue["4"],CardShape["S"]),
            Card(CardValue["4"],CardShape["S"]),
            Card(CardValue["4"],CardShape["S"]),
            Card(CardValue["5"],CardShape["H"]),
            Card(CardValue["5"],CardShape["H"]),
            Card(CardValue["5"],CardShape["H"]),
            Card(CardValue["6"],CardShape["H"]),
            Card(CardValue["6"],CardShape["H"]),
            Card(CardValue["6"],CardShape["H"]),
            Card(CardValue["7"],CardShape["H"]),
            Card(CardValue["7"],CardShape["H"]),
            Card(CardValue["7"],CardShape["H"]),
            Card(undefined,undefined,Kings.K),
            Card(undefined,undefined,Kings.k)
        ];
        for (let i = 0; i < threeCardsMap[0].length; i++) {
            let id = threeCardsMap[0][i].id;
            cardlist[i].id = id;
            threeCardsMap[0][i] = cardlist[i];
        }
        return [threeCardsMap[0],threeCardsMap[1],threeCardsMap[2],_cardList];
    };

    //判断单张
    const isOneCard = function (cardList) {
        if (cardList.length === 1) {
            return true;
        }
    };

    //判断对子
    const isOnePair = function (cardList) {
        if (cardList.length === 2) {
            if (cardList[0].value !== undefined && cardList[0].value === cardList[1].value) {
                return true;
            }
        }
        return false;
    };

    //判断三张
    const isThreeCard = function (cardList) {
        if (cardList.length === 3) {
            let map = {};
            for (let i = 0; i < cardList.length; i++) {
                if (map.hasOwnProperty(cardList[i].value)) {
                    map[cardList[i].value]++;
                } else {
                    map[cardList[i].value] = 1;
                }
            }
            if (map[cardList[0].value] === 3) {
                return true;
            }
        }
        return false;
    };

    //判断王炸
    const isKingBoom = function (cardList) {
        if (cardList[0].king !== undefined && cardList[1].king !== undefined) {
            return true;
        }
        return false;
    };

    //判断普通炸弹
    const isFourBoom = function (cardList) {
        if (cardList.length === 4) {
            let map = {};
            for (let i = 0; i < cardList.length; i++) {
                if (map.hasOwnProperty(cardList[i].value)) {
                    map[cardList[i].value]++;
                } else {
                    map[cardList[i].value] = 1;
                }
            }
            if (map[cardList[0].value] === 4) {
                return true;
            }
        }
        return false;
    };

    //判断三带一
    const isThreeWithOne = function (cardList) {
        if (cardList.length === 4) {
            let map = {};
            for (let i = 0; i < cardList.length; i++) {
                let key = -1;
                if (cardList[i].value === undefined) {
                    key = cardList[i].king;
                } else {
                    key = cardList[i].value;
                }
                if (map.hasOwnProperty(key)) {
                    map[key] ++;
                } else {
                    map[key] = 1;
                }
            }
            let count = 0;
            let maxNum = -1;
            for (let i in map) {
                count++;
                if (maxNum < map[i]) {
                    maxNum = map[i];
                }
            }
            if (count === 2 && maxNum === 3) {
                return true;
            }
        }
        return false;
    };

    //判断三带二
    const isThreeWithTwo = function (cardList) {
        if (cardList.length === 5) {
            let map = {};
            for (let i = 0; i < cardList.length; i++) {
                let key = -1;
                if (cardList[i].value === undefined) {
                    key = cardList[i].king;
                } else {
                    key = cardList[i].value;
                }
                if (map.hasOwnProperty(key)) {
                    map[key] ++;
                } else {
                    map[key] = 1;
                }
            }
            let count = 0;
            let maxNum = -1;
            for (let i in map) {
                count++;
                if (maxNum < map[i]) {
                    maxNum = map[i];
                }
            }
            if (count === 2 && maxNum === 3) {
                return true;
            }
        }
        return false;
    };

    //判断飞机
    const isPlane = function (cardList) {
        if (cardList.length === 6) {
            let map = {};
            for (let i = 0; i < cardList.length; i++) {
                if (map.hasOwnProperty(cardList[i].value)) {
                    map[cardList[i].value] ++;
                } else {
                    map[cardList[i].value] = 1;
                }
            }
            let count = 0;
            for (let i in map) {
                count++;
                if (map[i] !== 3) {
                    return false;
                }
            }
            if (count === 2) {
                return true;
            }
        }
        return false;
    };

    //判断飞机带两单张
    const isPlaneWithOne = function (cardList) {
        if (cardList.length === 8) {
            let map = {};
            for (let i = 0; i < cardList.length; i++) {
                let key = -1;
                if (cardList[i].king === undefined) {
                    key = cardList[i].value;
                } else {
                    key = cardList[i].king;
                }
                if (map.hasOwnProperty(key)) {
                    map[key] ++;
                } else {
                    map[key] = 1;
                }
            }
            let keys = Object.keys(map);
            if (keys.length !== 4) {
                return false;
            }
            let threeList = [];
            let oneCount = 0;
            for (let i in map) {
                if (map[i] === 3) {
                    threeList.push(i);
                }
                if (map[i] === 1) {
                    oneCount ++;
                }
            }
            if (threeList.length !== 2 || oneCount !== 2) {
                return false;
            }
            if (Math.abs(Number(threeList[0]) - Number(threeList[1])) === 1) {
                return true;
            }
        } else {
            return false;
        }
    };

    // 判断飞机带两对
    const isPlaneWithTwo = function (cardList) {
        if (cardList.length === 10) {
            let map = {};
            for (let i = 0; i < cardList.length; i++) {
                let key = -1;
                if (cardList[i].king === undefined) {
                    key = cardList[i].value;
                } else {
                    key = cardList[i].king;
                }
                if (map.hasOwnProperty(key)) {
                    map[key] ++;
                } else {
                    map[key] = 1;
                }
            }
            let keys = Object.keys(map);
            if (keys.length !== 4) {
                return false;
            }
            let threeList = [];
            let twoCount = 0;
            for (let i in map) {
                if (map[i] === 3) {
                    threeList.push(i);
                }
                if (map[i] === 2) {
                    twoCount ++;
                }
            }
            if (threeList.length !== 2 || twoCount !== 2) {
                return false;
            }
            if (Math.abs(Number(threeList[0]) - Number(threeList[1])) === 1) {
                return true;
            }

        }
        return false;
    };

    //出牌是否符合规则
    that.isStantardCards = function (cardList) {
        //是否散牌
        if (isOneCard(cardList)) {
            return true;
        }
        //判断对子
        if (isOnePair(cardList)) {
            return true;
        }
        //判断三张
        if (isThreeCard(cardList)) {
            return true;
        }
        //判断王炸
        if (isKingBoom(cardList)) {
            return true;
        }
        //判断普通炸弹
        if (isFourBoom(cardList)) {
            return true;
        }
        //判断三带一
        if (isThreeWithOne(cardList)) {
            return true;
        }
        //判断三带二
        if (isThreeWithTwo(cardList)) {
            return true;
        }
        //判断飞机
        if (isPlane(cardList)) {
            return true;
        }
        //判断飞机带两单张
        if (isPlaneWithOne(cardList)) {
            return true;
        }
        //判断飞机带两对
        if (isPlaneWithTwo(cardList)) {
            return true;
        }

        return false;
    };


    return that;
};

module.exports = CardManager;