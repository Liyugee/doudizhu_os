const Card = function (value,shape,king) {
    let that = {};
    if (value) {
        that.value = value;
    }
    if (shape) {
        that.shape = shape;
    }
    if (!!king) {
        that.king = king;
    }

    return that;
};

module.exports = Card;