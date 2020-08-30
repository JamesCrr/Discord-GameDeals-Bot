const config = require("./config.json");
const discord = require("discord.js");
const discordClient = new discord.Client();
discordClient.login(config.botKey);

const scrapperCommands = require("./commands.js");

/* const setUpChannel = () => {
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
discordClient.on("message", message => {
    if(message.author.bot)
        return;

    message.content = message.content.toLowerCase();
    if(message.content === "!target"){
        if (message.channel.type === "dm"){
            message.channel.send("Unable to register, Only avaliable in channels.");
            return;
        }
        scrapperCommands.commandCreateTarget(message, true);
    }
    else if(message.content === "!rmtarget"){
        scrapperCommands.commandRemoveTarget(message, true);
    }
    else if(message.content === "!debuglog"){
        scrapperCommands.commandDebugLog(message);
    }
    else if(message.content === "!help"){
        scrapperCommands.commandHelpLog(message);
    }
    else if(message.content === "!fetch"){
        scrapperCommands.commandTest();
    }
   
});
