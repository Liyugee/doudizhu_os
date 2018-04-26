import global from "./../../global";

cc.Class({
    extends: cc.Component,

    properties: {
        cardsSpriteAtlas: cc.SpriteAtlas
    },


    onLoad () {

    },

    initWithData: function () {

    },

    showCard: function (card) {
        console.log("card: " + JSON.stringify(card));
        this.id = card.id;
        // {"value":10,"shape":3,"id":46}
        const CardValue = {
            "12": 1,
            "13": 2,
            "1": 3,
            "2": 4,
            "3": 5,
            "4": 6,
            "5": 7,
            "6": 8,
            "7": 9,
            "8": 10,
            "9": 11,
            "10": 12,
            "11": 13
        };
        const CardShape = {
            "1": 3, //Spade黑桃
            "2": 2, //Heart红桃
            "3": 1, //Club梅花
            "4": 0  //Diamond方块
        };
        const Kings = {
            "1": 54,
            "2": 53
        };
        let spriteKey = "";
        if (card.shape) {
            spriteKey = "card_" + (CardShape[card.shape] * 13 + CardValue[card.value]);
        } else {
            spriteKey = "card_" + (Kings[card.king]);
        }
        console.log("sprite key: " + spriteKey);
        this.node.getComponent(cc.Sprite).spriteFrame = this.cardsSpriteAtlas.getSpriteFrame(spriteKey);
    }
});
