import global from "./../global";

cc.Class({
    extends: cc.Component,

    properties: {
        bottomLabel: cc.Label,
        rateLabel: cc.Label,
        playerNodePrefab: cc.Prefab
    },

    onLoad () {
        this.bottomLabel.string = "底：" + global.playerData.bottom;
        this.rateLabel.string = "倍数：" + global.playerData.rate;
        global.socket.requestEnterRoomScene((err,data)=>{
            if (err) {
                console.log("err: " + err)
            } else {
                console.log("enter room scene: " + JSON.stringify(data));
                // enter room scene: {"seatIndex":0,"playerData":[{"nickName":"小明72","accountID":"2933146","avatarUrl":"http://k1.jsqq.net/uploads/allimg/1610/14230K534-2.jpg","gold":100}]}
                let seatIndex = data.seatIndex;
                let playerData = data.playerData;
                for (let i = 0; i < playerData.length; i++) {
                    this.addPlayerNode(playerData[i]);
                }
            }
        })
    },

    addPlayerNode : function (data) {
        let playerNode = cc.instantiate(this.playerNodePrefab);
        playerNode.parent = this.node;
        playerNode.getComponent("playerNode").initWithData(data);
    }

});
