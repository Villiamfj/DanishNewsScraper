const jsdom = require("jsdom");
const { JSDOM } = jsdom;


async function scrape() {
    const result = [];

    const dom = await JSDOM.fromURL("https://migogaalborg.dk/kategori/nyheder-i-aalborg/");
    const document = dom.window.document;

    const stories = document.getElementsByClassName("color-orange");

    const date = new Date();

    for (story of stories) {

        // if the node is not a H3, it is not a story, skip it
        if (story.nodeName !== "H3")
            continue;

        const title = story.childNodes[4].textContent;
        const url = story.childNodes[4].href;

        result.push({
            title,
            url,
            date: date,
            source: "MigOgAalborg"
        });
    }

    return result;
}

exports.scrape = scrape;