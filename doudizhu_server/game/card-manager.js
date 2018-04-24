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

    return that;
};

module.exports = CardManager;