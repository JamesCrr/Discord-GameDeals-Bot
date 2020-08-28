const getResults = require("./scrapper");
const config = require("./config.json");
const discord = require("discord.js");
const discordChannelTargetName = "game-deals";
const discordClient = new discord.Client();
discordClient.login(config.botKey);

var previousResults = null;
var results = null;
var myTimer;
var channelTarget;
const timerFunc = async () => {
    // Channel got deleted
    if (getChannel() === undefined) 
        setUpChannel();

    results = await getResults();
    var resultDiff = getResultsDiff();
    var currentDate = new Date();
    if (resultDiff.length < 1){
        console.log("Time: " + currentDate.toTimeString() +
        "\nRecordedDeal: " + (previousResults === null ? "null" : previousResults.titles[0]) +
        "\nLatestDeal: " + results.titles[0] +
        "\nNo New Deals..\n");
        previousResults = results;
        return;
    }

    for(var i = 0; i < resultDiff.length; ++i) {
        var msg = ""
        msg = "**" + resultDiff[i].title + "**" + "\n";
        msg += resultDiff[i].dealLink;
        channelTarget.send(msg);
        console.log("Time: " + currentDate.toTimeString() +
        "\nRecordedDeal: " + (previousResults === null ? "null" : previousResults.titles[0]) +
        "\nLatestDeal: " + results.titles[0] +
        "\nNew Deal SENT!\n");
    }
    previousResults = results;
}
const setUpChannel = () => {
    if (getChannel() !== undefined){
        channelTarget = getChannel();
        return;
    }
    // Create a new text channel
    const discordGuild = discordClient.guilds.cache.first();
    discordGuild.channels.create(discordChannelTargetName, { 
        type: "text",
        topic: "Game Deals Channel" 
    })
    .then(() => {
        channelTarget = getChannel();
        channelTarget.send("I am using this Channel to send you Deals!\nPlease don't delete this Channel.");
        console.log("Channel Target: " + channelTarget);
    })
    .catch(console.error);
}
const getChannel = () => {
    const channelExists = discordClient.channels.cache.find(channel => channel.name === discordChannelTargetName);
    return channelExists;
}
const getResultsDiff = () => {
    var arrayDiff = []
    if (results === null || previousResults === null)
        return arrayDiff;
    for (var i = results.titles.length-1; i >= 0; --i) {
        for(var p = previousResults.titles.length-1; p >= 0; --p) {
            if (results.titles[i] === previousResults.titles[p])
                break;
            if (p - 1 < 0){
                var newItem = {
                    title: results.titles[i],
                    dealLink: results.dealLinks[i],
                    redditLink: results.redditLinks[i],
                }
                arrayDiff.push(newItem)
            }
        }
    }
    return arrayDiff;
}
const debugLog = () => {
    var msg = "Results:\n"
    for(var i = 0; i < results.titles.length; ++i){
        msg += (i + ": " + results.titles[i] + "\n");
    }
    channelTarget.send(msg);

    if (previousResults === null)
      return;
    msg = "Recorded:\n";
    for(var i = 0; i < previousResults.titles.length; ++i){
        msg += (i + ": " + previousResults.titles[i] + "\n");
    }
    channelTarget.send(msg);
}

discordClient.once("ready", () => {
    console.log("ONLINE")
    setUpChannel();
    timerFunc();
    setInterval(timerFunc, 3600000);    // 3 600 000 miliseconds = 1 hr
    //setInterval(timerFunc, 300000);    // 300 000 miliseconds = 5 min
});
discordClient.on("message", message => {
    if(message.author.bot)
        return;

    if(message.content === "!check"){
        timerFunc();
    }
    else if (message.content === "!debuglog"){
        debugLog();
    }
    else if(message.content === "!exit"){
        clearInterval(myTimer);
        myTimer = null;
        discordClient.destroy();
    }   
});
