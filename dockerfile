FROM node:lts-alpine

WORKDIR /app

# setting timezoen to Europe/Copenhagen
RUN apk add --no-cache tzdata
ENV TZ=Europe/Copenhagen

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY . .

# database setup
RUN npx prisma generate

CMD [ "npm", "run" , "dev" ]