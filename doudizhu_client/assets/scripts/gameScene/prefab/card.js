import global from "./../../global";

cc.Class({
    extends: cc.Component,

    properties: {
        cardsSpriteAtlas: cc.SpriteAtlas
    },

    onLoad () {
        this.flag = false;
        this.offset = 20;
        this.node.on("init_y", ()=>{
            if (this.flag) {
                this.flag = false;
                this.node.y -= this.offset;
                cc.systemEvent.emit("un_choose_card", this.cardData);
            }
        });
        this.node.on("pushed_card",(event)=>{
            let detail = event.detail;
            for (let i = 0; i < detail.length; i++) {
                if (detail[i].id === this.id) {
                    this.runToCenter(this.node);
                }
            }
        });
    },

    runToCenter: function (node) {
        let moveAction = cc.moveTo(0.3, cc.p(0, 0));
        let scaleAction = cc.scaleTo(0.3, 0.3);
        let seq = cc.sequence(scaleAction, cc.callFunc(()=>{
            cc.systemEvent.emit("rm_card_from_list", this.id);
            this.node.destroy();
        }));
        node.runAction(moveAction);
        node.runAction(seq);
    },

    initWithData: function () {

    },

    setTouchEvent: function () {
        if (this.accountID === global.playerData.accountID) {
            this.node.on(cc.Node.EventType.TOUCH_START, ()=>{
                console.log("touch: " + this.id);
                if (!this.flag) {
                    this.node.y += this.offset;
                    this.flag = true;
                    cc.systemEvent.emit("choose_card",this.cardData);
                } else {
                    this.node.y -= this.offset;
                    this.flag = false;
                    cc.systemEvent.emit("un_choose_card",this.cardData);
                }
            });
        }
    },

    showCard: function (card, accountID) {
        console.log("card: " + JSON.stringify(card));
        if (accountID) {
            this.accountID = accountID;
        }
        this.id = card.id;
        this.cardData = card;
        //card: {"value":10,"shape":3,"id":46}

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
        this.setTouchEvent();
    }
});
