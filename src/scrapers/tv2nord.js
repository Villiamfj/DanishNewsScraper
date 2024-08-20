// This scraper is not working because the website is rendered with JavaScript
// selenium webdriver is needed jsdom cannot do it

const jsdom = require("jsdom");
const { JSDOM } = jsdom;


async function scrape() {
    const result = [];

    const dom = await JSDOM.fromURL("https://www.tv2nord.dk/");
    const document = dom.window.document;

    const stories = document.getElementsByClassName("@container relative w-full block")
    const hrefs = [];


    for (story of stories) {
        const href = story.href;
        hrefs.push(href);
    }

    const titleHeaders = document.getElementsByClassName(" text-white group-hover:underline font-medium text-xl/tight @4xs:text-lg/tight @3xs:text-xl/tight @2xs:text-2xl/tight @xs:text-3xl/tight @sm:text-4xl/tight")
    const titles = [];
    for (title of titleHeaders) {
        // removing newlines and extra spaces
        titles.push(title.textContent.replace(/\n/g, "").trim().replace(/\s+/g, " "));
    }
    for (let i = 0; i < titles.length; i++) {
        result.push({
            title: titles[i],
            date: new Date(),
            url: hrefs[i],
            source: "TV2 Nord"
        });
    }

    return result;
}

exports.scrape = scrape;