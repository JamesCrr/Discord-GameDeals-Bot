const getResults = require("./scrapper");

var array_ChannelTargets = [];
var obj_previousResults = null;
var obj_results = null;
var myTimer = null;

const sendScrapperResult = async () => {
    obj_results = await getResults();
    var resultDiff = getResultsDiff();
    var currentDate = new Date();
    if (resultDiff.length < 1){
        console.log("Time: " + currentDate.toTimeString() +
        "\nRecordedDeal: " + (obj_previousResults === null ? "null" : obj_previousResults.titles[0]) +
        "\nLatestDeal: " + obj_results.titles[0] +
        "\nNo New Deals..\n");
        obj_previousResults = obj_results;
        return;
    }
    
    var array_msg = []
    for(var i = 0; i < resultDiff.length; ++i) {
        var msg = ""
        msg = "**" + resultDiff[i].title + "**" + "\n";
        msg += resultDiff[i].dealLink;
        array_msg.push(msg);
        console.log("Time: " + currentDate.toTimeString() +
        "\nRecordedDeal: " + (obj_previousResults === null ? "null" : obj_previousResults.titles[0]) +
        "\nLatestDeal: " + obj_results.titles[0] +
        "\nNew Deal SENT!\n");
    }
    obj_previousResults = obj_results;

    // Send msgs to all target channels
    for(var targetIndex = 0; targetIndex < array_ChannelTargets.length; ++targetIndex) {
        for (var msgIndex = 0; msgIndex < array_msg.length; ++msgIndex) {
            array_ChannelTargets[targetIndex].send(array_msg[msgIndex]);
        }
    }
}
const getResultsDiff = () => {
    var arrayDiff = []
    if (obj_results === null || obj_previousResults === null)
        return arrayDiff;
    for (var i = obj_results.titles.length-1; i >= 0; --i) {
        for(var p = obj_previousResults.titles.length-1; p >= 0; --p) {
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
const getChannelTargetIndex = (channelID) => {
    for(var i = 0; i < array_ChannelTargets.length; ++i) {
        if (channelID === array_ChannelTargets[i].id)
            return i;
    }
    return null;
}

const commandStartScrapping = () => {
    sendScrapperResult();
    myTimer = setInterval(sendScrapperResult, 3600000);    // 3 600 000 miliseconds = 1 hr
    //myTimer = setInterval(timerFunc, 300000);    // 300 000 miliseconds = 5 min
}
const commandCreateChannelTarget = (message) => {
    if (getChannelTargetIndex(message.channel.id) !== null)
        return false;
    array_ChannelTargets.push(message.channel);
    return true;
}
const commandRemoveChannelTarget = (message) => {
    var index = getChannelTargetIndex(message.channel.id);
    if (index === null)
        return false;
    array_ChannelTargets.splice(index, 1);
    return true;
}
const commandPrintDebugLog = (message) => {
    for (var i = 0; i < array_ChannelTargets.length; ++i) {
        array_ChannelTargets[i].send(getDebugLog());
    }
}

module.exports = {
    commandStartScrapper: commandStartScrapping,
    commandCreateTarget: commandCreateChannelTarget,
    commandRemoveTarget: commandRemoveChannelTarget,
    commandDebugLog: commandPrintDebugLog,
}