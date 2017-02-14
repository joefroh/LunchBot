var builder = require('botbuilder');

module.exports = {
    linkButtonResponse: function (session, url, text) {
        var card = new builder.ThumbnailCard(session)
            .title('')
            .subtitle('')
            .text('')
            .images()
            .buttons([
                builder.CardAction.openUrl(session, url, text)
            ]);
        return card;
    }
};