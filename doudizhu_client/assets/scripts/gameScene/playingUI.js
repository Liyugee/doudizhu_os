import global from "./../global";

cc.Class({
    extends: cc.Component,

    properties: {
        playingUI: cc.Node,
        cardPrefab: cc.Prefab,
        robUI: cc.Node
    },

    onLoad () {
        global.socket.onPushCard((data)=>{
            console.log("push card data: " + JSON.stringify(data));
            this.pushCard(data);
        });
        // this.pushCard();
        global.socket.onCanRobMaster((data)=>{
            console.log("can rob master data: " + data);
            if (data === global.playerData.accountID) {
                this.robUI.active = true;
            }
        });
    },
    
    pushCard: function (data) {
        //data: {"cards": [{"value":9,"shape":3,"id":42},{"king":2,"id":53}]}
        if (data) {
            data.sort((a,b)=>{
                if (a.hasOwnProperty("value") && b.hasOwnProperty("value")) {
                    return b.value - a.value;
                }
                if (a.hasOwnProperty("king") && !b.hasOwnProperty("king")) {
                    return -1;
                }
                if (!a.hasOwnProperty("king") && b.hasOwnProperty("king")) {
                    return 1;
                }
                if (a.hasOwnProperty("king") && b.hasOwnProperty("king")) {
                    return b.king - a.king;
                }
            });
            for (let i = 0; i < data.length; i++) {
                let card = cc.instantiate(this.cardPrefab);
                card.parent = this.playingUI;
                //设置手牌位置及间距
                card.scale = 0.8;
                // card.position = cc.p(card.width * (17 - 1) * - 0.5 + card.width * i, -250);
                card.x = card.width * 0.4 * (17 - 1) * - 0.5 + card.width * 0.4 * i;
                card.y = -250;
                // card.active = true;
                card.getComponent('card').showCard(data[i]);
            }
        }

        for (let i = 0; i < 3; i++) {
            let card = cc.instantiate(this.cardPrefab);
            card.parent = this.playingUI;
            card.scale = 0.8;
            card.x = (card.width * 0.8 + 20) * (3 - 1) * -0.5 + (card.width * 0.8 + 20) * i;
            card.y = 60;
        }
    },

    onButtonClick: function (event,customData) {
        switch (customData) {
            case "rob":
                console.log("抢地主");
                global.socket.notifyRobState("ok");
                this.robUI.active = false;
                break;
            case "no_rob":
                console.log("不抢");
                global.socket.notifyRobState("no_ok");
                this.robUI.active = false;
                break;
            default:
                break;
        }
    }
});
