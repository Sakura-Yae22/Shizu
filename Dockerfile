FROM node:14.17.3

LABEL name "shizu"

WORKDIR /sz

COPY . .

RUN yarn install

RUN yarn build

CMD ["yarn", "start"]
