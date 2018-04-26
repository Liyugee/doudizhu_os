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
        this.playerNodeList = [];
        this.bottomLabel.string = "底：" + global.playerData.bottom;
        this.rateLabel.string = "倍数：" + global.playerData.rate;

        global.socket.requestEnterRoomScene((err, data) => {
            if (err) {
                console.log("err: " + err)
            } else {
                console.log("enter room scene: " + JSON.stringify(data));
                // enter room scene: {"seatIndex":0,"playerData":[{"nickName":"小明80","accountID":"2290966","avatarUrl":"http://k1.jsqq.net/uploads/allimg/1610/14230K534-2.jpg","gold":100,"seatIndex":0}],"roomID":"229540"}
                this.playerPosList = [];
                this.initPlayerPos(data.seatIndex);
                let playerData = data.playerData;
                let roomID = data.roomID;
                this.roomIDLabel.string = "房间号：" + roomID;
                global.playerData.houseManagerID = data.houseManagerID;
                for (let i = 0; i < playerData.length; i++) {
                    this.addPlayerNode(playerData[i]);
                }
            }
            this.node.emit("init");
        });
        global.socket.onPlayerJoinRoom((data) => {
            this.addPlayerNode(data);
        });
        global.socket.onPlayerReady((data) => {
            for (let i = 0; i < this.playerNodeList.length; i++) {
                this.playerNodeList[i].emit("player_ready", data);
            }
        });
        global.socket.onGameStart(() => {
            for (let i = 0; i < this.playerNodeList.length; i++) {
                this.playerNodeList[i].emit("game_start");
            }
        });
        global.socket.onPushCard(() => {
            for (let i = 0; i < this.playerNodeList.length; i++) {
                this.playerNodeList[i].emit("push_card");
            }
        });
        global.socket.onCanRobMaster((data) => {
            for (let i = 0; i < this.playerNodeList.length; i++) {
                this.playerNodeList[i].emit("can_rob_master", data);
            }
        });
        global.socket.onPlayerRobMasterState((data) => {
            for (let i = 0; i < this.playerNodeList.length; i++) {
                this.playerNodeList[i].emit("rob_state", data);
            }
        });
        global.socket.onChangeMaster((data) => {
            console.log("on change master: " + data);
            global.playerData.masterID = data;
            for (let i = 0; i < this.playerNodeList.length; i++) {
                // this.playerNodeList[i].emit("change_master", data);
                let node = this.playerNodeList[i];
                node.emit("change_master", data);
                if (node.getComponent("playerNode").accountID === data) {
                    this.node.emit("master_pos",node.position);
                }
            }
        });
        this.node.on("add_card_to_player", ()=>{
            if (global.playerData.accountID !== global.playerData.masterID) {
                for (let i = 0; i < this.playerNodeList.length; i++) {
                    this.playerNodeList[i].emit("add_three_card", global.playerData.masterID);
                }
            }
        });
    },

    initPlayerPos: function (seatIndex) {
        // let children = this.playerPosNode.children;
        switch (seatIndex) {
            case 0:
                this.playerPosList[0] = 0;
                this.playerPosList[1] = 1;
                this.playerPosList[2] = 2;
                break;
            case 1:
                this.playerPosList[1] = 0;
                this.playerPosList[2] = 1;
                this.playerPosList[0] = 2;
                break;
            case 2:
                this.playerPosList[2] = 0;
                this.playerPosList[0] = 1;
                this.playerPosList[1] = 2;
                break;
            default:
                break;
        }
    },

    addPlayerNode: function (data) {
        let playerNode = cc.instantiate(this.playerNodePrefab);
        playerNode.parent = this.node;
        playerNode.getComponent("playerNode").initWithData(data, this.playerPosList[data.seatIndex]);
        playerNode.position = this.playerPosNode.children[this.playerPosList[data.seatIndex]].position;
        this.playerNodeList.push(playerNode);
    }

});
