import global from './../global';

cc.Class({
    extends: cc.Component,

    properties: {

    },

    start () {
        global.socket.init();
        global.eventListener.on("test",(data)=>{
            console.log("test success" + data);
        });
        global.eventListener.fire("test","ok");
    },

    onButtonClick : function (event,customData) {
        switch (customData) {
            case  'wx_login' :
                global.socket.requestLogin({
                        uniqueID: global.playerData.uniqueID,
                        accountID: global.playerData.accountID,
                        nickName: global.playerData.nickName,
                        avatarUrl: global.playerData.avatarUrl},
                    (err,result)=> {
                        if (err) {
                            console.log("login err: " + err);
                        } else {
                            console.log("login data: " + JSON.stringify(result,null,2));
                            global.playerData.goldCount = result.goldCount;
                            cc.director.loadScene("hallScene");
                        }
                    });
                break;
            default :
                break;
        }
    }

    // update (dt) {},
});
