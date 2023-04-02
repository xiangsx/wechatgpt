FROM node:16.18.1-alpine

RUN mkdir -p /usr/src/wechatgpt/

WORKDIR /usr/src/wechatgpt

COPY package.json /usr/src/wechatgpt/

# RUN npm i --production

RUN npm i --production --registry=https://registry.npm.taobao.org

COPY . /usr/src/wechatgpt

# EXPOSE 7001

CMD npm run start
