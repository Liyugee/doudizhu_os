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
    for (let i in CardValue) {
        for (let j in CardShape) {
            _cardList.push(Card(CardValue[i],CardShape[j],0));
        }
    }
    _cardList.push(Card(0,0,Kings.k));
    _cardList.push(Card(0,0,Kings.K));

    // for (let i = 0; i < _cardList.length; i++) {
    //     console.log("value: " + _cardList[i].value + " shape: " + _cardList[i].shape + "king: " + _cardList[i].king);
    // }

    //洗牌
    const referCard = function () {
        for (let i = 0; i < _cardList.length; i++) {
            let random = Math.floor(Math.random() * _cardList.length);
            let temp = _cardList[random];
            _cardList[random] = _cardList[i];
            _cardList[i] = temp;
        }
        for (let i = 0; i < _cardList.length; i++) {
            console.log("value: " + _cardList[i].value + " shape: " + _cardList[i].shape + " king: " + _cardList[i].king);
        }
    };
    referCard();

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

    return that;
};

module.exports = CardManager;