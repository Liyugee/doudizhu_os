import global from "../../global";

cc.Class({
    extends: cc.Component,

    properties: {
        headImage: cc.Sprite,
        idLabel: cc.Label,
        nickNameLabel: cc.Label,
        goldLabel: cc.Label,
        readyIcon: cc.Node,
        offlineIcon: cc.Node,
        cardsNode: cc.Node,
        pushedCardNode: cc.Node,
        cardPrefab: cc.Prefab,
        infoNode: cc.Node,
        tipsLabel: cc.Label,
        timeLabel: cc.Label,
        robIconSprite: cc.Sprite,
        robIcon: cc.SpriteFrame,
        noRobIcon: cc.SpriteFrame,
        masterIcon: cc.Node
    },

    onLoad () {
        this.cardList = [];
        this.readyIcon.active = false;
        this.offlineIcon.active = false;

        //监听游戏开始
        this.node.on("game_start",()=>{
            this.readyIcon.active = false;
        });
        //监听发牌
        this.node.on("push_card",()=>{
            if (this.accountID !== global.playerData.accountID) {
                this.pushCard();
            }
        });
        // 监听可以抢地主
        this.node.on("can_rob_master",(event)=>{
            let detail = event.detail;
            if (detail === this.accountID && detail !== global.playerData.accountID) {
                this.infoNode.active = true;
                this.tipsLabel.string = "正在抢地主";
                this.timeLabel.string = "5";
            }
        });
        //监听玩家抢地主状态
        this.node.on("rob_state",(event)=>{
            let detail = event.detail;
            console.log("player node rob state detail: " + JSON.stringify(detail));
            //detail: {accountID: accountID, value: value}
            if (detail.accountID === this.accountID) {
                this.infoNode.active = false;
                switch (detail.value) {
                    case "ok":
                        this.robIconSprite.node.active = true;
                        this.robIconSprite.spriteFrame = this.robIcon;
                        break;
                    case "no_ok":
                        this.robIconSprite.node.active = true;
                        this.robIconSprite.spriteFrame = this.noRobIcon;
                        break;
                    default:
                        break;
                }
            }
        });
        //监听确定地主
        this.node.on("change_master",(event)=>{
            let detail = event.detail;
            console.log("=============change master detail: " + JSON.stringify(detail));
            this.robIconSprite.node.active = false;
            if (detail === this.accountID) {
                this.masterIcon.active = true;
                this.masterIcon.scale = 0.6;
                this.masterIcon.runAction(cc.scaleTo(0.3,1).easing(cc.easeBackOut()));
            }
        });
        //地主手牌添加三张底牌
        this.node.on("add_three_card",(event)=>{
            let detail = event.detail;
            if (detail === this.accountID) {
                for (let i = 0; i < 3; i++) {
                    this.pushOneCard();
                }
            }
        });
        //监听玩家出的牌
        this.node.on("player_pushed_card", (event)=>{
            let detail = event.detail;
            if (detail.accountID === this.accountID && this.accountID !== global.playerData.accountID) {
                this.playerPushedCard(detail.cards);
            }
        })
    },

    initWithData: function (data,index) {
        // enter room scene: {"seatIndex":0,"playerData":[{"nickName":"小明72","accountID":"2933146","avatarUrl":"http://k1.jsqq.net/uploads/allimg/1610/14230K534-2.jpg","gold":100}]}
        this.accountID = data.accountID;
        this.idLabel.string = "ID:" + data.accountID;
        this.nickNameLabel.string = data.nickName;
        this.goldLabel.string = data.gold;
        this.index = index;
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
        this.node.on("can_rob_master",(event)=>{
            let detail = event.detail;
            if (detail === this.accountID) {
                this.tipsLabel.string = "正在抢地主";
            }
        });

        if (index === 1) {
            this.cardsNode.x *= -1;
            this.pushedCardNode.x *= -1;
        }
    },
    
    pushCard: function () {
        this.cardsNode.active = true;
        for (let i = 0; i < 17; i++) {
            let card = cc.instantiate(this.cardPrefab);
            card.parent = this.cardsNode;
            card.scale = 0.3;
            let height = card.height;
            card.y = (17 - 1) * 0.5 * height * 0.4 * 0.3 - height * 0.4 * 0.3 * i;
            this.cardList.push(card);
        }
    },
    
    pushOneCard: function () {
        let card = cc.instantiate(this.cardPrefab);
        card.parent = this.cardsNode;
        card.scale = 0.3;
        let height = card.height;
        card.y = (17 - 1) * 0.5 * height * 0.4 * 0.3 - this.cardList.length * height * 0.4 * 0.3;
        this.cardList.push(card);
    },
    
    playerPushedCard: function (cardsData) {
        for (let i = 0; i < this.pushedCardNode.children.length; i++) {
            this.pushedCardNode.children[i].destroy();
        }
        for (let i = 0; i < cardsData.length; i++) {
            let card = cc.instantiate(this.cardPrefab);
            card.parent = this.pushedCardNode;
            card.scale = 0.4;
            let height = card.height;
            card.y = (cardsData.length - 1) * 0.5 * height * 0.4 * 0.3 - i * height * 0.4 * 0.3;
            card.getComponent("card").showCard(cardsData[i]);
        }
        for (let i = 0; i < cardsData.length; i++) {
            let card = this.cardList.pop();
            card.destroy();
        }
        this.referCardsPos();
    },

    //更新手牌位置
    referCardsPos: function () {
        for (let i = 0; i < this.cardList.length; i++) {
            let card = this.cardList[i];
            let height = card.height;
            card.y = (this.cardList.length - 1) * 0.5 * height * 0.4 * 0.3 - height * 0.4 * 0.3 *i;
        }
    }
});
