var restify = require('restify');
var builder = require('botbuilder');
var paymentData = {}; //todo: dialogData
//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', [
    function (session, args, next) {
        if (session.message.text == '/delete') {
            session.userData.name = null;
        }
        if (!session.userData.name) {
            session.beginDialog('/profile');
        }
        else {
            next();
        }
    },
    function (session) {
        session.beginDialog('/main');
    }
]);

bot.dialog('/profile', [
    function (session, args) {
        if (args == 'retry') {
            builder.Prompts.text(session, "What is your paypal.me id?");
        }
        else {
            builder.Prompts.text(session, "Hey! This is your first time chatting with me, we need to set up your profile.\r\nWhat is your paypal.me name?");
        }
    },
    function (session, results) {
        session.userData.name = results.response;

        builder.Prompts.confirm(session, "Is " + session.userData.name + " correct?");
    },
    function (session, results) {
        if (results.response) {
            session.endDialog();
        }
        else {
            session.send("Good thing we caught that! Let's try again")
            session.beginDialog('/profile', 'retry');
        }
    }
]);

bot.dialog('/main', [
    function (session, args) {
        if (!args) {
            builder.Prompts.text(session, 'Hey ' + session.userData.name + '! What can I do for you?');
            //session.send('Hey %s! What can I do for you?', session.userData.name);
        } else {
            session.send("Sorry, I didn't understand what you asked me. My programmer is bad at this NLP stuff...");
            builder.Prompts.text(session, "Try something like \"request money\"");
        }
    },
    function (session, results) {
        if (results.response == "request money") {
            session.beginDialog('/sendmoney');
        }
        else {
            session.beginDialog('/main', "failed to understand");
        }
    },
    function (session) {
        session.endDialog();
    }
]);

bot.dialog('/sendmoney', [
    function (session, args, next) {
        paymentData = {};
        builder.Prompts.text(session, "Who do you want to request money from?");
    },
    function (session, results) {
        paymentData.who = results.response;
        builder.Prompts.number(session, "How much do you want to charge them?");
    },
    function (session, results) {
        paymentData.howMuch = results.response;
        builder.Prompts.confirm(session, "You want to request $" + paymentData.howMuch.toFixed(2) + " from " + paymentData.who + "?");
    },
    function (session, results) {
        if (results.response) {
            //Actually send request here
            session.send("Cool, I'll send the request for you right now!");
            session.send("www.paypal.me/"+session.userData.name+"/"+paymentData.howMuch.toFixed(2));
            session.endDialog();
        } else {
            session.send("Sorry about that! Let's try again.");
            session.beginDialog('/sendmoney', "failed");
        }
    }
]);