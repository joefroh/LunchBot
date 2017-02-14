var stringformat = require('stringformat');
module.exports = {
    createRequestLink: function (user, amount) {
        return stringformat("http://www.paypal.me/{0}/{1}", user, amount.toFixed(2));
    }
};