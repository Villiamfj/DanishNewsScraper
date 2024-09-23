// This scraper is not working because the website is rendered with JavaScript
// selenium webdriver is needed jsdom cannot do it

const jsdom = require("jsdom");
const { JSDOM } = jsdom;


async function scrape() {
    const result = [];

    const dom = await JSDOM.fromURL("https://www.tv2nord.dk/");
    const document = dom.window.document;

    const stories = document.getElementsByClassName("font-medium");
    // First result is a hotbar, remove the hotbar¨


    const date = new Date();


    for (let i = 1; i < stories.length; i++) {
        const story = stories[i];
        const title = story.textContent.replace(/\n/g, "").trim().replace(/\s+/g, " ");
        let url = story.parentNode.href;

        if (!url) { // There are multiple kinds of news containers on the site
            url = story.parentNode.parentNode.href;
        }

        // if url is still not found, log it
        if (!url) console.log("No url found for title: " + title, " (TV2 Nord)");

        result.push({
            title,
            url,
            date: date,
            source: "TV2 Nord"
        });
    }

    return result;
}

exports.scrape = scrape;