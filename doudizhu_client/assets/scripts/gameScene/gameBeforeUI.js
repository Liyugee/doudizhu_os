import global from "./../global";

cc.Class({
    extends: cc.Component,

    properties: {
        readyButton: cc.Node,
        startButton: cc.Node
    },

    onButtonClick: function (event,customeData) {
        switch (customeData) {
            case "ready":
                console.log("ready: " + customeData);
                global.socket.notifyReady();
                break;
            case "start":
                break;
            default:
                break;
        }
    }
});
