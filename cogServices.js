var Client = require('node-rest-client').Client;

const VISION_URL = 'https://westus.api.cognitive.microsoft.com/vision/v1.0/ocr?language=unk&detectOrientation=true'
const cogsKey = process.env.COGS_API_KEY;

var messageUser = function (session, numbers) {
    session.userData.waiting = false;
    if (numbers.length < 1) {
            session.endConversation("Either the link was bad or I couldn't find any numbers. Sorry :(");
        } else {
            session.endConversation(numbers.toString());
        }
}

module.exports.GetNumbers = function (url, session) {
    var client = new Client();
    var args = {
        data: { "url": url },
        headers: {
            "Content-Type": "application/json",
            "Ocp-Apim-Subscription-Key": cogsKey
        }
    }
    
    client.post(VISION_URL, args, function (data, response) {
        var numbers = [];
        if (data.regions && data.regions.length > 0) {
            data.regions.forEach(function (element) {
                element.lines.forEach(function (element) {
                    element.words.forEach(function (element) {
                        var num = Number.parseFloat(element.text);
                        if (!Number.isNaN(num)) { // filter for only numbers, we are going to try to solve the REALLY hard ML problem of identifying prices by just asking the user.
                            numbers.push(num);
                        }
                    }, this);
                }, this);
            }, this);
        }
        messageUser(session, numbers);
    });
}

