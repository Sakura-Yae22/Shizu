FROM node:14.17.3

WORKDIR /bot

COPY . .

RUN yarn install

RUN yarn build

CMD ["yarn", "start"]
