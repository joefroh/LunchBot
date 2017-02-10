var restify = require('restify');
var builder = require('botbuilder');

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
        if(session.message.text == '/delete'){
            session.userData.name = null;
        }
       if(!session.userData.name){
           session.beginDialog('/profile');
       }
       else{
           next();
       }
    },
    function (session) {
        session.send('Hey %s! What can I do for you?', session.userData.name);
    }
]);

bot.dialog('/profile',[
    function (session, args){
        if(args == 'retry'){
            builder.Prompts.text(session,"What is your paypal.me id?");
        }
        else{
            builder.Prompts.text(session, "Hey! This is your first time chatting with me, we need to set up your profile.\r\nWhat is your paypal.me name?");
        }
    },
    function(session, results){
        session.userData.name = results.response;
        
        builder.Prompts.confirm(session, "Is "+ session.userData.name + " correct?");
    },
    function(session, results){
        if(results.response == true)
        {
            session.endDialog();
        }
        else
        {
            session.send("Good thing we caught that! Let's try again")
            session.beginDialog('/profile','retry');
        }
    }
]);