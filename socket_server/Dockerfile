FROM node:10

COPY . /mq

WORKDIR /mq

RUN npm install yarn

RUN node_modules/.bin/yarn

EXPOSE 4337

CMD ["yarn", "start:dev"]
