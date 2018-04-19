
import global from "./../../global";

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onButtonClick : function (event,customData) {
        if (customData.indexOf("rate") !== -1) {
            global.socket.requestCreateRoom({rate: customData}, (err,data)=>{
                if (err) {
                    console.log("create room err: " + err);
                } else {
                    console.log("create room data: " + JSON.stringify(data));
                }
            });
        }
        this.node.destroy();
    }
});
