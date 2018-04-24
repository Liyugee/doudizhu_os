import global from "./../global";

cc.Class({
    extends: cc.Component,

    properties: {
        playingUI: cc.Node,
        cardPrefab: cc.Prefab
    },

    onLoad () {
        global.socket.onPushCard((data)=>{
            console.log("push card data: " + JSON.stringify(data));
            this.pushCard(data);
        });
    },
    
    pushCard: function (data) {
        //data: {"cards": [{"value":9,"shape":3,"id":42},{"king":2,"id":53}]}
        console.log("----data: " + JSON.stringify(data));
        console.log("data.cards.length: " + data.cards.length);     //17
        for (let i = 0; i < data.cards.length; i++) {
            let card = cc.instantiate(this.cardPrefab);
            card.parent = this.playingUI;
            //设置手牌位置及间距
            card.scale = 0.8;
            // card.position = cc.p(card.width * (17 - 1) * - 0.5 + card.width * i, -250);
            card.x = card.width * 0.4 * (17 - 1) * - 0.5 + card.width * 0.4 * i;
            card.y = -250;
            // card.active = true;
            card.getComponent('card').showCard(data.cards[i]);
            card.getComponent('card').showCard(data[i]);
        }
    }
});
