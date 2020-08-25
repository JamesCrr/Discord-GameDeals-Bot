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
    if (getChannel() === false) 
        setUpChannel();

    const results = await getResults();
    if (previousResults.titles === null)
        recordLatestTitle(results);
    else if (previousResults.titles !== results.titles[0]) {
        var msg = ""
        msg = "**" + results.titles[0] + "**" + "\n";
        msg += results.dealLinks[0];
        channelTarget.send(msg);
        recordLatestTitle(results);
    }
    console.log("No New Deals..");
}
const recordLatestTitle = (newResults) => {
    previousResults.titles = newResults.titles[0];
    previousResults.dealLinks = newResults.dealLinks[0];
    previousResults.redditLinks = newResults.redditLinks[0];
}
const setUpChannel = () => {
    if (getChannel() === true)
        return;
    // Create a new text channel
    const discordGuild = discordClient.guilds.cache.first();
    discordGuild.channels.create(discordChannelTargetName, { 
        type: "text",
        topic: "Game Deals Channel" 
    })
    .then(() => {
        channelTarget = discordClient.channels.cache.find(channel => channel.name === discordChannelTargetName);
        channelTarget.send("I am using this Channel to send you Deals!\nPlease don't delete this Channel.");
        console.log("Channel Target: " + channelTarget);
    })
    .catch(console.error);
}
const getChannel = () => {
    const channelExists = discordClient.channels.cache.find(channel => channel.name === discordChannelTargetName);
    if (channelExists === undefined)
        return false;
    return true;
}

discordClient.once("ready", () => {
    console.log("ONLINE")
    setUpChannel();
    setInterval(timerFunc, 3600000);    // 3 600 000 miliseconds = 1 hr
});
discordClient.on("message", message => {
    if(message.author.bot)
        return;

    if(message.content === "!exit"){
        clearInterval(myTimer);
        myTimer = null;
        discordClient.destroy();
    }   
});
