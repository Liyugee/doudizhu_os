// import defines from './../defines';
// const io = require('socket.io-client');

const SocketController = function () {
    let that = {};
    let _socket = io(defines.serverUrl);
    let _callBackMap = {};
    let _callBackIndex = 0;

    that.init = function () {

    };

    _socket.on("connection",()=>{
        console.log("链接成功");
    });

    _socket.on("notify",(data)=>{
        console.log("notify: " + JSON.stringify(data));
        let callBackIndex = data.callBackIndex;
        if (_callBackMap.hasOwnProperty(callBackIndex)) {
            let cb = _callBackMap[callBackIndex];
            if (data.err) {
                cb(data.err);
            } else {
                cb(null,data.data); //null为占位符，没有err时填null
            }
        }
    });

    const request = function (type,data,cb) {
         _callBackIndex++;
         _callBackMap[_callBackIndex] = cb; //保存回调
        notify(type,data,_callBackIndex);
    };

    //向服务端链接消息"notify"，发送数据{}
    const notify = function (type,data,callBackIndex) {
        _socket.emit("notify",{type:type, data:data, callBackIndex:callBackIndex});
    };

    //微信登陆=>发送玩家信息给服务器并接收回调
    that.requestLogin = function (data,cb) {
        request("login",data,cb);
    };

    //发送创建房间信息并接收回调
    that.requestCreateRoom = function (data,cb) {
        request("create_room",data,cb)
    };

    //发送加入房间信息并接收回调
    that.requestJoinRoom = function (data,cb) {
        request("join_room",data,cb)
    };

    return that;
};
export default SocketController;