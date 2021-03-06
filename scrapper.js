const axios = require("axios");
const cheerio = require("cheerio");

const redditNewURL = "https://www.reddit.com/r/GameDeals/new/"

const scrapRedditData = async (b_New) => {
    var finalURL = redditNewURL;
    if (!b_New)
        finalURL = redditNewURL.slice(0, 35);
    const result = await axios.get(finalURL);
    return cheerio.load(result.data);
};

const getScrappedResults = async (b_New) => {
    const titleElement = "h3._eYtD2XCVieq6emjKBH3m";
    const dealLinkElement = "div._10wC0aXnrUKfdJ4Ssz-o14";
    const redditLink = "a.SQnoC3ObvgnGjWt90zD9Z";
    const articleRoot = "div._32pB7ODBwG3OSx1u_17g58";
    const $ = await scrapRedditData(b_New);
    var titleArray = [];
    var dealLinkArray = [];
    var redditLinkArray = [];

    $(titleElement, articleRoot).each(function(index, element) {
        const title = $(this).text();
        titleArray.push(title);
    });

    $(dealLinkElement, articleRoot).children().each(function(index, element) {
        const dealLink = $(this).attr("href");
        dealLinkArray.push(dealLink);
    });

    $(redditLink, articleRoot).each(function(index, element) {
        const redditLink = "https://www.reddit.com" + $(this).attr("href");
        redditLinkArray.push(redditLink);
    });

    // for(var i = 0; i < titleArray.length; ++i) {
    //     console.log(titleArray[i]);
    //     console.log(dealLinkArray[i]);
    //     console.log(redditLinkArray[i]);
    //     console.log("");
    // }

    return {
        titles: titleArray,
        dealLinks: dealLinkArray,
        redditLinks: redditLinkArray,
    };
}

module.exports = getScrappedResults;