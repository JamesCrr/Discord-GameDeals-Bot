const getResults = require("./scrapper");
const config = require("./config.json");
const discord = require("discord.js");
const discordChannelTargetName = "game-deals";
const discordClient = new discord.Client();
discordClient.login(config.botKey);

var previousResults = {
    titles: null,
    dealLinks: null,
    redditLinks: null,
};
var myTimer;
var channelTarget;
const timerFunc = async () => {
    // Channel got deleted
    if (getChannel() === undefined) 
        setUpChannel();

    var results = await getResults();
    var currentDate = new Date();
    console.log("Time: " + currentDate.toTimeString() +
    "\nRecordedDeal: " + previousResults.titles +
    "\nLatestDeal: " + results.titles[0] +
    "\nNo New Deals..\n");
    if (previousResults.titles === null)
        recordLatestTitle(results);
    else if (previousResults.titles !== results.titles[0]) {
        var changeLength = 0;
        for(var i = 0; i < results.titles.length; ++i){
            if(previousResults.titles !== results.titles[i]){
                changeLength++;
                continue;
            }
            break;
        }
        for(var i = changeLength-1; i >= 0; --i) {
            var msg = ""
            msg = "**" + results.titles[i] + "**" + "\n";
            msg += results.dealLinks[i];
            channelTarget.send(msg);
            console.log("New Deal SENT!\n");
        }
        recordLatestTitle(results);
    }
}
const recordLatestTitle = (newResults) => {
    previousResults.titles = newResults.titles[0];
    previousResults.dealLinks = newResults.dealLinks[0];
    previousResults.redditLinks = newResults.redditLinks[0];
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

    if(message.content === "!fetch"){
        timerFunc();
    }
    else if(message.content === "!exit"){
        clearInterval(myTimer);
        myTimer = null;
        discordClient.destroy();
    }   
});
