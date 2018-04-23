const Card = function (value,shape,king) {
    let that = {};
    that.value = value;
    that.shape = shape;
    if (king) {
        that.king = king;
    }

    return that;
};

module.exports = Card;