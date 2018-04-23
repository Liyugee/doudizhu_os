import global from "./../global";

cc.Class({
    extends: cc.Component,

    properties: {
        playingUI: cc.Node,
        cardPrefab: cc.Prefab
    },

    onLoad () {
        global.socket.onPushCard(()=>{
            console.log("push card");
            this.pushCard();
        });
    },
    
    pushCard: function () {
        for (let i = 0; i < 17; i++) {
            let card = cc.instantiate(this.cardPrefab);
            card.parent = this.playingUI;
            //设置手牌位置及间距
            card.position = cc.p(card.width * (17 - 1) * - 0.5 + card.width * i, 0);
        }
    }

});
