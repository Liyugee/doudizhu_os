import global from "./../global";

cc.Class({
    extends: cc.Component,

    properties: {
        readyButton: cc.Node,
        gameStartButton: cc.Node,
        gameBeforeUI: cc.Node
    },

    onLoad () {
        this.node.on("init",()=>{
            if (global.playerData.houseManagerID === global.playerData.accountID) {
                this.readyButton.active = false;
                this.gameStartButton.active = true;
            } else {
                this.readyButton.active = true;
                this.gameStartButton.active = false;
            }
        });
        global.socket.onGameStart(()=>{
            this.gameBeforeUI.active = false;
        });
    },

    onButtonClick: function (event,customeData) {
        switch (customeData) {
            case "ready":
                console.log("ready: " + customeData);
                global.socket.notifyReady();
                break;
            case "start_game":
                console.log("start game");
                global.socket.requestStartGame((err,data)=>{
                    if (err) {
                        console.log("start game err: " + err);
                    } else {
                        console.log("start game data: " + JSON.stringify(data));
                    }
                });
                break;
            default:
                break;
        }
    }
});
