const getScrappedResults = require("./scrapper");

const prefix = "!";
var b_newDeals = true;
var array_ChannelTargets = [];
var obj_previousResults = null;
var obj_results = null;
var myTimer = null;

const sendScrapResult = async () => {
    const array_resultDiff = await fetchNewScrapResultDiff();
    for(var i = 0; i < array_resultDiff.length; ++i) {
        var msg = "";
        msg = "**" + array_resultDiff[i].title + "**" + "\n";
        msg += array_resultDiff[i].dealLink;
        // Send msg to all target channels
        for(var targetIndex = 0; targetIndex < array_ChannelTargets.length; ++targetIndex) {
            array_ChannelTargets[targetIndex].send(msg);
        }
        console.log(array_resultDiff[i].title + "\nNew Deal SENT!\n");
    }
}
const fetchNewScrapResultDiff = async () => {
    obj_results = await getScrappedResults(b_newDeals);
    var array_resultDiff = getResultsDifference();
    var currentDate = new Date();
    console.log("Time: " + currentDate.toTimeString() +
    "\nRecordedDeal: " + (obj_previousResults === null ? "null" : obj_previousResults.titles[0]) +
    "\nLatestDeal: " + obj_results.titles[0]);
    if (array_resultDiff.length < 1)
        console.log("No New Deals..\n");
    obj_previousResults = obj_results;
    return array_resultDiff;
}
/**
 * Resets the scrapped results 
 */
const resetScrapResults = () => {
    obj_previousResults = null;
    obj_results = null;
    fetchNewScrapResultDiff();
}
/**
 * Compare results between previously scrapped results and the current results
 * Returns the differences in a Object Array  
 */
const getResultsDifference = () => {
    var arrayDiff = []
    if (obj_results === null || obj_previousResults === null)
        return arrayDiff;
    for (var i = obj_results.titles.length-1; i >= 0; --i) {
        for(var p = i; p >= 0; --p) {
            if (obj_results.titles[i] === obj_previousResults.titles[p])
                break;
            if (p - 1 < 0){
                var newItem = {
                    title: obj_results.titles[i],
                    dealLink: obj_results.dealLinks[i],
                    redditLink: obj_results.redditLinks[i],
                }
                arrayDiff.push(newItem)
            }
        }
    }
    return arrayDiff;
}
const getDebugLog = () => {
    var msg = "Results:\n"
    if (obj_results === null)
      return msg;
    for(var i = 0; i < obj_results.titles.length; ++i){
        msg += (i + ": " + obj_results.titles[i] + "\n");
    }

    if (obj_previousResults === null)
      return msg;
    msg += "\nRecorded:\n";
    for(var i = 0; i < obj_previousResults.titles.length; ++i){
        msg += (i + ": " + obj_previousResults.titles[i] + "\n");
    }
    return msg;
}
const filterChannelTargets = () => {
    var removables = [];
    for(var i = 0; i < array_ChannelTargets.length; ++i) {
        if (array_ChannelTargets[i].type !== "text" ||
            array_ChannelTargets[i].deleted === true)
        {
            removables.push(i);
        }
    }
    for (var i = 0; i < removables.length; ++i){
        array_ChannelTargets.splice(removables, 1);
    }
}
const getChannelTargetIndex = (channelID) => {
    for(var i = 0; i < array_ChannelTargets.length; ++i) {
        if (channelID === array_ChannelTargets[i].id)
            return i;
    }
    return null;
}

/**************************************
    Command Functions
***************************************/
const startScrapping = () => {
    if (myTimer !== null)
        return;
    fetchNewScrapResultDiff();
    myTimer = setInterval(sendScrapResult, 3600000);    // 3 600 000 miliseconds = 1 hr
    //myTimer = setInterval(timerFunc, 300000);    // 300 000 miliseconds = 5 min
}
const removeChannelTarget = (channelID) => {
    var index = getChannelTargetIndex(channelID);
    if (index === null)
        return false;
    array_ChannelTargets.splice(index, 1);
    return true;
}
const commandCreateChannelTarget = (message) => {
    if (getChannelTargetIndex(message.channel.id) !== null){
        message.channel.send("**Channel Already Registered!**")
        return false;
    }
    array_ChannelTargets.push(message.channel);
    message.channel.send("**Channel Registered!**\nI will now send you new Deals using this Channel!")
    return true;
}
const commandRemoveChannelTarget = (message) => {
    if (removeChannelTarget(message.channel.id) === false){
        message.channel.send("**Unable to Remove!**\nThis Channel was not registered prior")
        return false;
    }
    message.channel.send("**Channel Unregistered!**\nThis channel will no longer receive deals");
    return true;
}
const commandGetLatestDeal = async(message) => {
    await fetchNewScrapResultDiff();
    var msg = "";
    msg = "**" + obj_previousResults.titles[0] + "**" + "\n";
    msg += obj_previousResults.dealLinks[0];
    message.channel.send(msg);
};
const commandPrintDebugLog = (message) => {
    message.channel.send(getDebugLog());
}
const commandPrintHelp = (message) => {
    const msg = "**Commands:**\n" +
    "\t**!in :** Registers this channel to receive Deals\n" + 
    "\t**!out :** Unregisters this channel from receiving Deals\n" +
    "\t**!latest :** Returns the latest deal\n" +  
    "\t**!help :** Displays information about all avaliable commands\n"; 
    message.channel.send(msg);
}

module.exports = {
    prefix: prefix,
    startWebScrapping: startScrapping,
    removeChannelTarget: removeChannelTarget,
    commandCreateTarget: commandCreateChannelTarget,
    commandRemoveTarget: commandRemoveChannelTarget,
    commandLatestDeal: commandGetLatestDeal,
    commandHelpLog: commandPrintHelp,
    commandDebugLog: commandPrintDebugLog
}