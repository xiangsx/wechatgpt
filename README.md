# 介绍

实现微信聊天机器人的功能，接入chatgpt最新的模型gpt-3.5-turbo，速度提升了10倍

功能：
1. 登录自己的微信小号，作为机器人，可以回复私聊或者在群里的@消息
2. 支持自动发送登录二维码到指定邮箱，需要填写发送方的邮箱密钥(loginEmail),，以及接收方的邮箱地址(targetEmail)
```js
{
    loginEmail: {
        user: 'xxx@xxx.com',
        pass: 'xxxxxxx',
    },
    targetEmail: 'xxx@xxx.com',
}
```
3. 支持docker部署
```
docker-compose up --build -d
```
直接在日志中可以查看登录二维码
```
docker-compose logs -f wechatgpt
```