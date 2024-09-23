const jsdom = require("jsdom");
const { JSDOM } = jsdom;


async function scrape() {
    const result = [];

    const dom = await JSDOM.fromURL('https://dr.dk/nyheder');
    const news = dom.window.document.getElementsByClassName("hydra-latest-news-teaser__content");

    for (let story of news) {
        const title = story.childNodes[1].text
        const url = story.childNodes[1].href

        const time = story.childNodes[0].childNodes[0].childNodes[0].childNodes[0].textContent

        const theme = story.childNodes[0].childNodes[0].childNodes[0].childNodes[1].textContent

        result.push({
            title,
            url,
            theme,
            date: convertDRTime(time),
            source: "dr.dk/nyheder"
        });
    }

    return result;
}


// converts time string from dr.dk to a Date object
function convertDRTime(time) {
    // two cases to consider:
    // from x minuts ago
    if (time.includes("min. siden")) {
        // extract number of minutes
        const minutes = parseInt(time.split(" ")[0]);

        // create a new Date object
        const date = new Date();
        date.setMinutes(date.getMinutes() - minutes);
        return date;
    }
    // Today at hh:mm
    if (time.includes("I dag")) {
        // extract time
        const timeSplit = time.split("kl. ")[1];
        const hhmm = timeSplit.split(":");
        const hours = parseInt(hhmm[0]);
        const minutes = parseInt(hhmm[1]);

        // create a new Date object
        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes);
        return date;
    }
    if (time.includes("Lige nu")) {
        return new Date(); // current time
    }
    if (time.includes("I går")) {
        // extract time
        const timeSplit = time.split("kl. ")[1];
        const hhmm = timeSplit.split(":");
        const hours = parseInt(hhmm[0]);
        const minutes = parseInt(hhmm[1]);

        // create a new Date object
        const date = new Date();
        date.setDate(date.getDate() - 1);
        date.setHours(hours);
        date.setMinutes(minutes);
        return date;
    }

    throw new Error("Unknown time format: " + time);
}


exports.scrape = scrape;