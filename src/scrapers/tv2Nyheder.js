const jsdom = require("jsdom");
const { JSDOM } = jsdom;


async function scrape() {
    const result = [];

    const dom = await JSDOM.fromURL('https://nyheder.tv2.dk/seneste');

    let titles = dom.window.document.getElementsByClassName("tc_heading tc_heading--5")
    titles = Array.from(titles).map(title => title.textContent);

    let urls = dom.window.document.getElementsByClassName("tc_teaser__link")
    urls = Array.from(urls).map(url => url.href);

    let themes = dom.window.document.getElementsByClassName("tc_label tc_label--color-nyheder")
    themes = Array.from(themes).map(theme => theme.textContent);

    let times = dom.window.document.getElementsByClassName("tc_teaser__tagline__text")
    times = Array.from(times).map(time => time.textContent);

    for (let i = 0; i < titles.length; i++) {
        result.push({
            title: titles[i],
            url: urls[i],
            theme: themes[i],
            date: convertTV2Time(times[i]),
            source: "tv2.dk/nyheder"
        });
    }

    return result;
}

// converts time string from dr.dk to a Date object
function convertTV2Time(time) {
    // from x secounds ago
    if (time.includes("sek siden")) {
        const seconds = parseInt(time.split(" ")[0]);
        const date = new Date();
        date.setSeconds(date.getSeconds() - seconds);
        return date;
    }

    // from x minuts ago
    if (time.includes("min siden")) {
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
        const hhmm = timeSplit.split(".");
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
        const hhmm = timeSplit.split(".");
        const hours = parseInt(hhmm[0]);
        const minutes = parseInt(hhmm[1]);

        // create a new Date object
        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes);
        date.setDate(date.getDate() - 1);

        return date;
    }

    throw new Error("Unknown time format: " + time);
}

exports.scrape = scrape;