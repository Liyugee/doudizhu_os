// import defines from './../defines';
import EventListener from "./../utility/event-listener";

const SocketController = function () {
    let that = {};
    let _socket = io(defines.serverUrl);
    let _callBackMap = {};
    let _callBackIndex = 0;
    let _event = EventListener({});     //事件收发

    that.init = function () {

    };

    _socket.on("connection",()=>{
        console.log("链接成功");
    });

    _socket.on("notify",(data)=>{
        console.log("notify: " + JSON.stringify(data));
        // notify: {"type":"login","data":{"goldCount":100},"callBackIndex":1}
        // notify: {"type":"create_room","data":{"data":"229540"},"callBackIndex":2}
        // notify: {"type":"join_room","data":{"data":{"bottom":10,"rate":2}},"callBackIndex":3}
        let callBackIndex = data.callBackIndex;
        if (_callBackMap.hasOwnProperty(callBackIndex)) {
            let cb = _callBackMap[callBackIndex];
            if (data.data.err) {
                cb(data.data.err);
            } else {
                cb(null,data.data); //null为占位符，没有err时填null
            }
        } else {
            let type = data.type;
            _event.fire(type,data.data);
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

    //发送进入房间消息并接收回调
    that.requestEnterRoomScene = function (cb) {
        request("enter_room_scene",{},cb);
    };

    that.requestStartGame = function (cb) {
        request("start_game",{},cb);
    };

    that.requestPlayerPushCard = function (value, cb) {
        request("player_push_card",value,cb);
    };

    //发送其他玩家准备消息
    that.notifyReady = function () {
        notify("ready",{},null);
    };

    that.notifyRobState = function (value) {
        notify("rob_state",value,null);
    };

    //接收其他玩家加入房间信息
    that.onPlayerJoinRoom = function (cb) {
        _event.on("player_join_room",cb);
    };

    //接收其他玩家准备信息
    that.onPlayerReady = function (cb) {
        _event.on("player_ready",cb);
    };

    that.onGameStart = function (cb) {
        _event.on("game_start",cb);
    };
    
    that.onChangeHouseManager = function (cb) {
        _event.on("change_house_manager",cb);
    };

    that.onPushCard = function (cb) {
        _event.on("push_card",cb);
    };

    that.onCanRobMaster = function (cb) {
        _event.on("can_rob_master",cb);
    };

    that.onPlayerRobMasterState = function (cb) {
        _event.on("player_rob_state",cb);
    };

    that.onChangeMaster = function (cb) {
        _event.on("change_master",cb);
    };

    that.onShowBottomCard = function (cb) {
        _event.on("show_bottom_card",cb);
    };

    that.onCanPushCard = function (cb) {
        _event.on("can_push_card",cb);
    };

    return that;
};
export default SocketController;