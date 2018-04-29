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
    "H": 2, //Heart红红桃
    "C": 3, //Club梅花
    "D": 4  //Diamond方块
};

const Kings = {
    k: 1,
    K: 2
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
                if (map.hasOwnProperty(cardList[i].value)) {
                    map[cardList[i].value] ++;
                } else {
                    map[cardList[i].value] = 1;
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

    //出牌是否符合规则
    that.isStantardCards = function (cardList) {
        if (isOneCard(cardList)) {
            return true;
        }
        if (isOnePair(cardList)) {
            return true;
        }
        if (isThreeCard(cardList)) {
            return true;
        }
        if (isKingBoom(cardList)) {
            return true;
        }
        if (isFourBoom(cardList)) {
            return true;
        }
        if (isThreeWithOne(cardList)) {
            return true;
        }
        if (isThreeWithTwo(cardList)) {
            return true;
        }

        return false;
    };


    return that;
};

module.exports = CardManager;