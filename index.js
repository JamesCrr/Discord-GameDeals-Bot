const getResults = require("./scrapper");
const config = require("./config.json");
const discord = require("discord.js");
const discordClient = new discord.Client();
discordClient.login(config.botKey);

const timerFunc = async () => {
    const results = await getResults();
    const channelTarget = discordClient.channels.cache.find(channel => channel.name === "game-deals");
    var msg = ""
    //console.log(results);
    for(var i = 0; i < results.titles.length; ++i) {
        msg = "**" + results.titles[i] + "**" + "\n";
        msg += results.dealLinks[i];
        channelTarget.send(msg);
    }
}
var myTimer;

discordClient.once("ready", () => {
    console.log("ONLINE")
});
discordClient.on("message", message => {
    if(message.author.bot)
        return;

    if(message.content === "!starttimer"){
        setInterval(timerFunc, 1000);
    }   
    else if(message.content === "!stoptimer"){
        clearInterval(myTimer);
        message.channel.send("Timer Cleared!");
    }
});
