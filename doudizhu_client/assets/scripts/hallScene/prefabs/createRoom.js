
import global from "./../../global";

cc.Class({
    extends: cc.Component,

    properties: {

    },

    onButtonClick : function (event,customData) {
        if (customData.indexOf("rate") !== -1) {
            global.socket.requestCreateRoom({rate: customData}, (err,data)=>{
                if (err) {
                    console.log("create room err: " + err);
                } else {
                    console.log("create room data: " + JSON.stringify(data));
                    //create room data: {"data":{"bottom":10,"rate":2}}
                    let roomID = data.data;
                    global.socket.requestJoinRoom(roomID,(err,data)=>{
                        if (err) {
                            console.log("join room err: " + err)
                        } else {
                            console.log("join room ID: " + JSON.stringify(data));
                            // join room ID: {"data":{"rate":2}}
                            global.playerData.bottom = data.data.bottom;
                            global.playerData.rate = data.data.rate;
                            cc.director.loadScene("gameScene");
                        }
                    })
                }
            });
        }
        this.node.destroy();
    }
});
