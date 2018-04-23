
cc.Class({
    extends: cc.Component,

    properties: {
        headImage: cc.Sprite,
        idLabel: cc.Label,
        nickNameLabel: cc.Label,
        goldLabel: cc.Label,
        readyIcon: cc.Node,
        offlineIcon: cc.Node
    },

    onLoad () {
        this.readyIcon.active = false;
        this.offlineIcon.active = false;
        this.node.on("game_start",()=>{
            this.readyIcon.active = false;
        });
    },

    initWithData: function (data) {
        // enter room scene: {"seatIndex":0,"playerData":[{"nickName":"小明72","accountID":"2933146","avatarUrl":"http://k1.jsqq.net/uploads/allimg/1610/14230K534-2.jpg","gold":100}]}
        this.accountID = data.accountID;
        this.idLabel.string = "ID:" + data.accountID;
        this.nickNameLabel.string = data.nickName;
        this.goldLabel.string = data.gold;
        cc.loader.load({url: data.avatarUrl, type: 'jpg'}, (err, tex)=> {
            cc.log('Should load a texture from RESTful API by specify the type: ' + (tex instanceof cc.Texture2D));
            let oldWidth = this.headImage.node.width;
            this.headImage.spriteFrame = new cc.SpriteFrame(tex);
            let newWidth = this.headImage.node.width;
            this.headImage.node.scale = oldWidth / newWidth;
        });

        //用palyerNode监听事件，当palyerNode被删除时其绑定的所有消息都会被off，这样可以免去维护子节点
        this.node.on("player_ready",(event)=>{
            let detail = event.detail;
            console.log("player ready detail: " + JSON.stringify(detail));
            if (detail === this.accountID) {
                this.readyIcon.active = true;
            }

        });
    }
});
