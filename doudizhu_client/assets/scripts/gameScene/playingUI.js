import global from "./../global";

cc.Class({
    extends: cc.Component,

    properties: {
        playingUI: cc.Node,
        cardPrefab: cc.Prefab,
        robUI: cc.Node,
        playUI: cc.Node,
        tipLabel: cc.Label,
        pushedCardNode: cc.Node
    },

    onLoad () {
        this.bottomCards = [];  //底牌node
        let bottomCardData = [];    //底牌数据
        this.cardList = [];     //一副牌
        this.chooseCardDataList = [];   //选中手牌

        //可以发牌
        global.socket.onPushCard((data)=>{
            console.log("push card data: " + JSON.stringify(data));
            this.pushCard(data);
        });
        // this.pushCard();
        //玩家可以抢地主
        global.socket.onCanRobMaster((data)=>{
            console.log("can rob master data: " + data);
            if (data === global.playerData.accountID) {
                this.robUI.active = true;
            }
        });
        //显示底牌
        global.socket.onShowBottomCard((data)=>{
            console.log("show bottom cards: " + JSON.stringify(data));
            bottomCardData = data;
            for (let i = 0; i < data.length; i++) {
                let card = this.bottomCards[i];
                card.getComponent('card').showCard(data[i]);
            }
            //底牌移动至桌面上部
            this.node.runAction(cc.sequence(cc.delayTime(2),cc.callFunc(()=>{
                let index = 0;
                const runActionCb = ()=>{
                    index++;
                    if (index === 3) {
                        this.node.emit("add_card_to_player");
                    }
                };
                for (let i = 0; i < this.bottomCards.length; i++) {
                    let card = this.bottomCards[i];
                    let width = card.width;
                    this.runCardAction(card,cc.p((this.bottomCards.length - 1) * - 0.5 * width * 0.7 + width * 0.7 * i, 240),runActionCb);
                }
                // this.bottomCards = [];
            })));
        });
        //玩家可以出牌
        global.socket.onCanPushCard((data)=>{
            console.log("on can push card: " + JSON.stringify(data));
            if (data === global.playerData.accountID) {
                //桌面移除上一轮出的牌
                for (let i = 0; i < this.pushedCardNode.children.length; i++) {
                    this.pushedCardNode.children[i].destroy();
                }
                this.playUI.active = true;
                // this.chooseCardDataList = [];
            }
        });
        //桌面显示自己出的牌
        global.socket.onPlayerPushedCard((data)=>{
            if (data.accountID === global.playerData.accountID) {
                let cardsData = data.cards;
                for (let i = 0; i < cardsData.length; i++) {
                    let card = cc.instantiate(this.cardPrefab);
                    card.parent = this.pushedCardNode;
                    card.scale = 0.6;
                    let width = card.width;
                    card.x = (cardsData.length - 1) * -0.5 * width * 0.7 + width * 0.7 * i;
                    // card.y = 30;
                    card.getComponent("card").showCard(cardsData[i]);
                }
            }

        });
        //地主位置
        this.node.on("master_pos",(event)=>{
            let detail = event.detail;
            this.masterPos = detail;
        });
        //地主的手牌中添加底牌
        this.node.on("add_card_to_player",()=>{
            if (global.playerData.accountID === global.playerData.masterID) {
                for (let i = 0; i < bottomCardData.length; i++) {
                    let card = cc.instantiate(this.cardPrefab);
                    card.parent = this.playingUI;
                    //设置手牌位置及间距
                    card.scale = 0.8;
                    let width = card.width;
                    // card.position = cc.p(card.width * (17 - 1) * - 0.5 + card.width * i, -250);
                    card.x = width * 0.4 * (17 - 1) * -0.5 + width * 0.4 * this.cardList.length + 500;
                    card.y = -250;
                    card.getComponent('card').showCard(bottomCardData[i], global.playerData.accountID);
                    this.cardList.push(card);
                }
                this.sortCards();
            }
        });
        //监听玩家选的手牌
        cc.systemEvent.on("choose_card",(event)=>{
            let detail = event.detail;
            this.chooseCardDataList.push(detail);
        });
        // 监听玩家放下的手牌
        cc.systemEvent.on("un_choose_card",(event)=>{
            let detail = event.detail;
            for (let i = 0; i < this.chooseCardDataList.length; i++) {
                if (this.chooseCardDataList[i].id === detail.id) {
                    this.chooseCardDataList.splice(i,1);
                }
            }
        });
        //从一副牌移除玩家出的牌
        // cc.systemEvent.on("rm_card_from_list", (event)=>{
        //     let detail = event.detail;
        //     for (let i = 0; i < this.cardList.length; i++) {
        //         let card = this.cardList[i];
        //         if (card.getComponent("card").id === detail.id) {
        //             this.cardList.splice(i,1);
        //         }
        //     }
        // })
    },

    runCardAction: function (card,pos,cb) {
        let moveAction = cc.moveTo(0.5,pos);
        let scaleAction = cc.scaleTo(0.5,0.6);
        card.runAction(scaleAction);
        card.runAction(cc.sequence(moveAction, cc.callFunc(()=>{
            // card.destroy();
            if (cb) {
                cb();
            }
        })));
    },

    //从左到右降序
    sortCards: function () {
        this.cardList.sort((x,y)=>{
            let a = x.getComponent("card").cardData;
            let b = y.getComponent("card").cardData;
            if (a.hasOwnProperty("value") && b.hasOwnProperty("value")) {
                return b.value - a.value;
            }
            if (a.hasOwnProperty("king") && !b.hasOwnProperty("king")) {
                return -1;
            }
            if (!a.hasOwnProperty("king") && b.hasOwnProperty("king")) {
                return 1;
            }
            if (a.hasOwnProperty("king") && b.hasOwnProperty("king")) {
                return b.king - a.king;
            }
        });
        let posX = this.cardList[0].x;
        for (let i = 0; i < this.cardList.length; i++) {
            let card = this.cardList[i];
            card.zIndex = i;
            card.x = posX + card.width * 0.4 * i;
        }
        this.referCardsPos();
    },

    //发牌
    pushCard: function (data) {
        //data: {"cards": [{"value":9,"shape":3,"id":42},{"king":2,"id":53}]}
        if (data) {
            data.sort((a,b)=>{
                if (a.hasOwnProperty("value") && b.hasOwnProperty("value")) {
                    return b.value - a.value;
                }
                if (a.hasOwnProperty("king") && !b.hasOwnProperty("king")) {
                    return -1;
                }
                if (!a.hasOwnProperty("king") && b.hasOwnProperty("king")) {
                    return 1;
                }
                if (a.hasOwnProperty("king") && b.hasOwnProperty("king")) {
                    return b.king - a.king;
                }
            });
            for (let i = 0; i < data.length; i++) {
                let card = cc.instantiate(this.cardPrefab);
                card.parent = this.playingUI;
                //设置手牌位置及间距
                card.scale = 0.8;
                // card.position = cc.p(card.width * (17 - 1) * - 0.5 + card.width * i, -250);
                card.x = card.width * 0.4 * (17 - 1) * - 0.5 + card.width * 0.4 * i;
                card.y = -250;
                card.getComponent('card').showCard(data[i],global.playerData.accountID);
                this.cardList.push(card);
            }
        }

        this.bottomCards = [];
        for (let i = 0; i < 3; i++) {
            let card = cc.instantiate(this.cardPrefab);
            card.parent = this.playingUI;
            card.scale = 0.8;
            card.x = (card.width * 0.8 + 20) * (3 - 1) * -0.5 + (card.width * 0.8 + 20) * i;
            card.y = 60;
            this.bottomCards.push(card);
        }
    },

    onButtonClick: function (event,customData) {
        switch (customData) {
            case "rob":
                console.log("抢地主");
                global.socket.notifyRobState("ok");
                this.robUI.active = false;
                break;
            case "no_rob":
                console.log("不抢");
                global.socket.notifyRobState("no_ok");
                this.robUI.active = false;
                break;
            case "no_push":
                console.log("不出");
                this.playUI.active = false;
                global.socket.requestPlayerPushCard([],()=>{
                    console.log("不出牌回调");
                });
                break;
            case "tip":
                console.log("提示");
                break;
            case "ok_push":
                if (this.chooseCardDataList.length === 0) {
                    return;
                }
                global.socket.requestPlayerPushCard(this.chooseCardDataList,(err,data)=>{
                    if (err) {
                        console.log("出牌err: " + err);
                        if (this.tipLabel.string === "") {
                            this.tipLabel.string = err;
                            setTimeout(()=>{
                                this.tipLabel.string = "";
                            },2000);
                        }
                        //出牌错误手牌归位
                        for (let i = 0; i < this.cardList.length; i++) {
                            this.cardList[i].emit("init_y", this.chooseCardDataList);
                        }
                        this.chooseCardDataList = [];
                    } else {
                        console.log("玩家出的牌data： " + JSON.stringify(data));
                        for (let i = 0; i < this.cardList.length; i++) {
                            this.cardList[i].emit("pushed_card",this.chooseCardDataList);
                        }
                        //从一副牌中删除玩家出的牌
                        for (let i = 0; i < this.chooseCardDataList.length; i++) {
                            let cardData = this.chooseCardDataList[i];
                            for (let j = 0; j < this.cardList.length; j++) {
                                let card = this.cardList[j];
                                if (card.getComponent("card").id === cardData.id) {
                                    this.cardList.splice(j,1);
                                }
                            }
                        }

                        this.playUI.active = false;
                        this.chooseCardDataList = [];
                        this.referCardsPos();
                    }
                });
                break;
            default:
                break;
        }
    },
    
    //更新手牌位置
    referCardsPos: function () {
        for (let i = 0; i < this.cardList.length; i++) {
            let card = this.cardList[i];
            let width = card.width;
            card.x = (this.cardList.length - 1) * width * 0.4 * -0.5 + width * 0.4 * i; //0.4：牌间距
        }
    }
});
