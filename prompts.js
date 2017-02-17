var builder = require('botbuilder');
var stringformat = require('stringformat');

//Create Promp Objects
exports.genericMain = {};


exports.genericMain.beginDialog = function (session, options) {
    session.beginDialog('genericMain', options || {});
}

exports.genericMain.create = function (bot) {
    var prompt = new builder.IntentDialog()
        .onBegin(function (session, args) {
            if (args != "failed to understand") {
                session.send(stringformat("Hey {0}, whats up?", session.userData.name));
            } else {
                session.send("Sorry, I didn't understand what you asked me. My programmer is bad at this NLP stuff...");
                session.send("Try something like \"request money\"");
            }
        })
        .onDefault(function (session) {
            var result = {};

            if (session.message.attachments.length > 0) {
                result.type = "media";
                result.response = session.message.attachments[0];
            } else {
                result.type = "text";
                result.response = session.message.text;
            }
            session.endDialogWithResult(result);
        });
    bot.dialog('genericMain', prompt);
}