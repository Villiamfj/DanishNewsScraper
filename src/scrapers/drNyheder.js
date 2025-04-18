const jsdom = require("jsdom");
const { JSDOM } = jsdom;

// Some of these feeds are commented out because of duplicate news.
const drRssFeeds = [
    //{ theme: "Seneste nyt", url: "https://www.dr.dk/nyheder/service/feeds/senestenyt" },
    //{ theme: "Indland", url: "https://www.dr.dk/nyheder/service/feeds/indland" },
    { theme: "Udland", url: "https://www.dr.dk/nyheder/service/feeds/udland" },
    { theme: "Penge", url: "https://www.dr.dk/nyheder/service/feeds/penge" },
    { theme: "Politik", url: "https://www.dr.dk/nyheder/service/feeds/politik" },
    { theme: "Sporten", url: "https://www.dr.dk/nyheder/service/feeds/sporten" },
    //{ theme: "Seneste sport", url: "https://www.dr.dk/nyheder/service/feeds/senestesport" },
    { theme: "Viden", url: "https://www.dr.dk/nyheder/service/feeds/viden" },
    { theme: "Kultur", url: "https://www.dr.dk/nyheder/service/feeds/kultur" },
    { theme: "Musik", url: "https://www.dr.dk/nyheder/service/feeds/musik" },
    { theme: "Vejret", url: "https://www.dr.dk/nyheder/service/feeds/vejret" },
    //{ theme: "Regionale", url: "https://www.dr.dk/nyheder/service/feeds/regionale" },
    { theme: "DR Hovedstadsområdet", url: "https://www.dr.dk/nyheder/service/feeds/regionale/kbh" },
    { theme: "DR Bornholm", url: "https://www.dr.dk/nyheder/service/feeds/regionale/bornholm" },
    { theme: "DR Syd og Sønderjylland", url: "https://www.dr.dk/nyheder/service/feeds/regionale/syd" },
    { theme: "DR Fyn", url: "https://www.dr.dk/nyheder/service/feeds/regionale/fyn" },
    { theme: "DR Midt- og Vestjylland", url: "https://www.dr.dk/nyheder/service/feeds/regionale/vest" },
    { theme: "DR Nordjylland", url: "https://www.dr.dk/nyheder/service/feeds/regionale/nord" },
    { theme: "DR Trekantområdet", url: "https://www.dr.dk/nyheder/service/feeds/regionale/trekanten" },
    { theme: "DR Sjælland", url: "https://www.dr.dk/nyheder/service/feeds/regionale/sjaelland" },
    { theme: "DR Østjylland", url: "https://www.dr.dk/nyheder/service/feeds/regionale/oestjylland" }
]


async function rssScraper() {
    const result = [];

    for (const feed of drRssFeeds) {
        result.push(...(await scrapeRss(feed.url, feed.theme)))
    }

    return result;
}

async function scrapeRss(rssLink, theme) {
    const result = [];
    const dom = await JSDOM.fromURL(rssLink)

    const articles = dom.window.document.getElementsByTagName("item")

    for (const article of articles) {
        const url = article.getElementsByTagName("link")[0].innerHTML;
        const title = removeCdataFromTitle(article.getElementsByTagName("title")[0].innerHTML)
        const time = article.getElementsByTagName("pubDate")[0].innerHTML;

        result.push({
            title,
            url,
            theme,
            date: new Date(time),
            source: "dr.dk rss"
        });
    }

    return result;
}

function removeCdataFromTitle(title) {
    return title.replace("<![CDATA[", "").replace("]]>", "")
}

exports.scrape = rssScraper;
