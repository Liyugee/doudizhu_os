import global from "./../../global";

cc.Class({
    extends: cc.Component,

    properties: {
        labelNode: cc.Node
    },

    onLoad : function () {
        this.labelList = this.labelNode.children;
        this.roomIDStr = "";
    },

    onButtonClick : function (event,customData) {
        console.log("click: " + customData);
        if (customData.length === 1) {
            this.roomIDStr += customData;
            if (this.roomIDStr.length === 6) {
                console.log("join room");
                global.socket.requestJoinRoom(this.roomIDStr,(err,data)=>{
                    if (err) {
                        console.log("join room err: " + err)
                    } else {
                        console.log("join room ID: " + JSON.stringify(data));
                    }
                })
            }
            if (this.roomIDStr.length > 6) {
                this.roomIDStr = this.roomIDStr.substring(0,this.roomIDStr.length-1)
            }
        }

        switch (customData) {
            case "close" :
                this.node.destroy();
                break;
            case "back" :
                this.roomIDStr = this.roomIDStr.substring(0,this.roomIDStr.length-1);
                break;
            case "clear" :
                this.roomIDStr = "";
                break;
            default :
                break;
        }
    },

    update : function (dt) {
        //初始化this.labelList[i]="",使其不可见
        for (let i = 0; i < this.labelList.length; i++) {
            this.labelList[i].getComponent(cc.Label).string = "";
        }
        for (let i = 0; i < this.roomIDStr.length; i++) {
            this.labelList[i].getComponent(cc.Label).string = this.roomIDStr[i];
        }
    }

});
