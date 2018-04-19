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

    /**
     * @param type  消息号
     * @param data  传输数据
     * @param cb    回调
     */
    const request = function (type,data,cb) {
         _callBackIndex++;
         _callBackMap[_callBackIndex] = cb; //保存回调
        notify(type,data,_callBackIndex);
    };

    /**
     * @param type  消息号
     * @param data  微信登陆传来的data
     * @param callBackIndex _callBackMap的key
     */
    const notify = function (type,data,callBackIndex) {
        _socket.emit("notify",{type:type, data:data, callBackIndex:callBackIndex});
    };

    /**微信登陆返回数据
     * @param data
     * @param cb
     */
    that.requestLogin = function (data,cb) {
        request("login",data,cb);
    };

    that.requestCreateRoom = function (data,cb) {
        request("create_room",data,cb)
    };

    return that;
};
export default SocketController;