const fs = require('fs');
const { PrismaClient } = require('@prisma/client');

async function scrapeAll() {
    const results = [];
    for (let file of fs.readdirSync('./src/scrapers')) {
        if (file.endsWith('.js')) {
            const scraper = require(`./scrapers/${file}`);
            try {
                const data = await scraper.scrape();
                results.push(data);
            } catch (error) {
                console.error(`Error in scraper ${file}: ${error}`);
            }
        }
        else {
            console.log(`Skipping ${file} it is not a javascript file`);
        }
    }
    return results;
}

async function addToDatabase(prismaClient, data) {
    for (let sourceData of data) {
        for (let news of sourceData) {
            try {
                // find or create news post, "don't update if it already exists"
                await prismaClient.newsPost.upsert({
                    where: { title_source: { title: news.title, source: news.source } },
                    update: {},
                    create: news
                });
            }
            catch (error) {
                console.error(`Could not create post: ${error}`);
            }
        }
    }
}

async function removeOldNews(prismaClient, maxAgeHours) {
    // getting timestamp
    const timestamp = Date.now() - maxAgeHours * 60 * 60 * 1000;

    // converting timestmap to date object
    const date = new Date(timestamp);

    try {
        await prismaClient.newsPost.deleteMany({
            where: {
                date: {
                    lt: date
                }
            }
        });
    }
    catch (error) {
        console.error(`Could not delete old news: ${error}`);
    }
}

async function updateNews(prismaClient) {
    const data = await scrapeAll();
    await addToDatabase(prismaClient, data);
}

exports.updateNews = updateNews;
exports.removeOldNews = removeOldNews;