import global from "./../global";

cc.Class({
    extends: cc.Component,

    properties: {
        bottomLabel: cc.Label,
        rateLabel: cc.Label,
        roomIDLabel: cc.Label,
        playerNodePrefab: cc.Prefab,
        playerPosNode: cc.Node

    },

    onLoad() {
        this.bottomLabel.string = "底：" + global.playerData.bottom;
        this.rateLabel.string = "倍数：" + global.playerData.rate;
        global.socket.requestEnterRoomScene((err, data) => {
            if (err) {
                console.log("err: " + err)
            } else {
                console.log("enter room scene: " + JSON.stringify(data));
                // enter room scene: {"seatIndex":0,"playerData":[{"nickName":"小明80","accountID":"2290966","avatarUrl":"http://k1.jsqq.net/uploads/allimg/1610/14230K534-2.jpg","gold":100,"seatIndex":0}],"roomID":"229540"}
                this.playerList = [];
                this.initPlayerPos(data.seatIndex);
                let playerData = data.playerData;
                let roomID = data.roomID;
                this.roomIDLabel.string = "房间号：" + roomID;
                for (let i = 0; i < playerData.length; i++) {
                    this.addPlayerNode(playerData[i]);
                }
            }
        });
        global.socket.onPlayerJoinRoom((data)=>{
            this.addPlayerNode(data);
        });
    },

    initPlayerPos: function (seatIndex) {
        let children = this.playerPosNode.children;
        switch (seatIndex) {
            case 0:
                this.playerList[0] = children[0].position;
                this.playerList[1] = children[1].position;
                this.playerList[2] = children[2].position;
                break;
            case 1:
                this.playerList[1] = children[0].position;
                this.playerList[2] = children[1].position;
                this.playerList[0] = children[2].position;
                break;
            case 2:
                this.playerList[2] = children[0].position;
                this.playerList[0] = children[1].position;
                this.playerList[1] = children[2].position;
                break;
            default:
                break;
        }
    },

    addPlayerNode: function (data) {
        let playerNode = cc.instantiate(this.playerNodePrefab);
        playerNode.parent = this.node;
        playerNode.getComponent("playerNode").initWithData(data);
        playerNode.position = this.playerList[data.seatIndex];
    }

});
