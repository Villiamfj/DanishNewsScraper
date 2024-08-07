const fastify = require('fastify')
const { PrismaClient } = require('@prisma/client')
const newsHandler = require('./newsHandler')

// static page
const fs = require('fs');
const index = fs.readFileSync('./src/public/index.html');


const prisma = new PrismaClient()
const app = fastify()

//getting config
const { ADDRESS = '0.0.0.0', PORT = '80', maxPostAgeHours = 48, updateIntervalMinutes = 60 } = process.env;

console.log("config is ", { ADDRESS, PORT, maxPostAgeHours, updateIntervalMinutes });

//intial news
console.log('Fetching initial news...');
newsHandler.updateNews(prisma).then(async () => {
  console.log('Initial news fetched');
  await newsHandler.removeOldNews(prisma, maxPostAgeHours)
});

// update news every interval
setInterval(async () => {
  await newsHandler.updateNews(prisma)
  await newsHandler.removeOldNews(prisma, maxPostAgeHours)
}, updateIntervalMinutes * 60 * 1000); // convert minutes to milliseconds


// get all posts
app.get('/posts', async (req, res) => {
  const posts = await prisma.newsPost.findMany()
  return posts
})

app.get("/", async (req, res) => {
  res.type('text/html').send(index);
})


app.listen({ port: PORT, host: ADDRESS }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
});


