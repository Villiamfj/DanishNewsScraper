# A News scraper build using Fastify and Prisma
This is my take on a news scraping service, used for scraping danish news sites and presenting the headlines on a single page. The service uses Fastify to serve the news and Prisma with SQlite to store the news.

This project can be extended to scrape other news sites by adding Javascript files that exports a `scrape` function within the `src/scrapers` folder.

A SQLite database is used to store the news headlines, this can be switched by changing the file at `prisma/schema.prisma`.


## How to run

### Migrate
To setup the database before usage run the following command:

``` npx prisma migrate --name init```

### Running with docker
This service can then be started by using docker-compose as such:

```docker-compose up```

Before running the service you want to check the docker-compose file, to check the enviroment variables, these are:

| Variable              | Explanation                                                                        |
|-----------------------|------------------------------------------------------------------------------------|
| port                  | The port of the service                                                            |
| address               | The address of the service                                                         |
| updateIntervalMinutes | The interval at which news is scraped from the news sites, do not set this too low |
| maxPostAgeHours       | The maximum age of a news headline                                                 |

