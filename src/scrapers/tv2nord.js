// This scraper is not working because the website is rendered with JavaScript
// selenium webdriver is needed jsdom cannot do it

const jsdom = require("jsdom");
const { JSDOM } = jsdom;


async function scrape() {
    const result = [];

    const dom = await JSDOM.fromURL('https://www.tv2nord.dk/seneste-nyt');

    let stories = dom.window.document.getElementsByClassName("nav-entry-wrapper relative pb-[5px]");

    const date = new Date();
    /*
        using the current date instead of scraping because of difficulties with their website
        the website is rendered with JavaScript which makes it difficult to scrape
    */

    for (story of stories) {

        result.push(
            {
                title: story.textContent.trim(),
                date: date,
                url: story.childNodes[4].href,
                source: "TV2 Nord",
            }
        )
    }
    return result;
}


function formatTime(time) {
    // 24. JUL 2024, 12:34
    console.log(time);

    const date = time.split(".")[0];
    const month = time.split(" ")[1];
    const year = time.split(" ")[2];

    const hours = time.split(", ")[1].split(":")[0];
    const minutes = time.split(":")[1];

    return new Date(`${year}-${month}-${date}T${hours}:${minutes}`);
}

exports.scrape = scrape;