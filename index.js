const config = require("./config.json");
const discord = require("discord.js");
const discordClient = new discord.Client();
discordClient.login(config.botKey);

const scrapperCommands = require("./commands.js");

/*
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
*/

discordClient.once("ready", () => {
    console.log("ONLINE")
    scrapperCommands.startWebScrapping();
});
discordClient.on("channelDelete", deletedChannel => {
    if (deletedChannel.type === "dm")
        return;
    scrapperCommands.removeChannelTarget(deletedChannel.id);
});
discordClient.on("channelUpdate", (oldChannel, newChannel) => {
    if (oldChannel.type !== "text")
        return;
    if (newChannel.type !== "text")
        scrapperCommands.removeChannelTarget(newChannel.id);
});
discordClient.on("message", message => {
    if(message.author.bot || !message.content.startsWith(scrapperCommands.prefix))
        return;

    var commandStrArray = message.content.slice(scrapperCommands.prefix.length).toLowerCase().split(" ");
    if(commandStrArray[0] === "in"){
        if (message.channel.type === "dm"){
            message.channel.send("Unable to register, Only avaliable in channels.");
            return;
        }
        scrapperCommands.commandCreateTarget(message, true);
    }
    else if(commandStrArray[0] === "out"){
        scrapperCommands.commandRemoveTarget(message, true);
    }
    else if(commandStrArray[0] === "latest"){
        scrapperCommands.commandLatestDeal(message);
    }
    else if(commandStrArray[0] === "help"){
        scrapperCommands.commandHelpLog(message);
    }
    else if(commandStrArray[0] === "debuglog"){
        scrapperCommands.commandDebugLog(message);
    }
   
});
