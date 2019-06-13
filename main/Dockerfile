FROM node:10.16.0-alpine

WORKDIR /app

COPY package*.json ./

RUN apk add docker

RUN npm install

COPY . .

EXPOSE 3001

CMD [ "npm", "start" ]
