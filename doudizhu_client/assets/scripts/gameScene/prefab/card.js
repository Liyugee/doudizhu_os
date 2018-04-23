
cc.Class({
    extends: cc.Component,

    properties: {
        cardsSpriteAtlas: cc.SpriteAtlas
    },


    onLoad () {

    },

    initWithData: function () {

    },

    showCard: function (card) {
        this.node.getComponent(cc.Sprite).spriteFrame = ""
    }

});
