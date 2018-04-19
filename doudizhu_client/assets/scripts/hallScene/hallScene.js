import global from "./../global";

cc.Class({
    extends: cc.Component,

    properties: {
        nickNameLabel: cc.Label,
        idLabel: cc.Label,
        goldCountLabel: cc.Label,
        headImage: cc.Sprite,
        createRoomPrefab: cc.Prefab,
        joinRoomPrefab: cc.Prefab
    },

    onLoad () {
        this.nickNameLabel.string = global.playerData.nickName;
        this.idLabel.string = "ID:" + global.playerData.accountID;
        this.goldCountLabel.string = global.playerData.goldCount;
        cc.loader.load({url: global.playerData.avatarUrl, type: 'jpg'}, (err, tex)=> {
            cc.log('Should load a texture from RESTful API by specify the type: ' + (tex instanceof cc.Texture2D));
            let oldWidth = this.headImage.node.width;
            this.headImage.spriteFrame = new cc.SpriteFrame(tex);
            let newWidth = this.headImage.node.width;
            this.headImage.node.scale = oldWidth / newWidth;
        });
    },

    onButtonClick : function (event,customData) {
        switch (customData) {
            case "create_room" :
                console.log("create_room");
                let createRoom = cc.instantiate(this.createRoomPrefab);
                // this.addChild(createRoom);
                createRoom.parent = this.node;
                break;
            case "join_room" :
                console.log("join_room");
                let joinRoom = cc.instantiate(this.joinRoomPrefab);
                joinRoom.parent = this.node;
                break;
            default :
                break;
        }
    },
});
