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
先在`config`目录下新建`config.js`文件，可以直接复制`config.demo`,然后填写配置

```js
module.exports = {
    loginEmail: {
        user: 'xxx@xxx.com',// 发送qq二维码的邮箱账号
        pass: 'xxxxxxx',// 需要邮箱开通IMAP/SMTP服务，并在此填写授权码，不是邮箱密码哦
    },
    targetEmail: 'xxx@xxx.com',// 接受登录二维码的邮箱
    apikey: 'xxx',// 你的openai密钥，可以在openai官网申请
}
```
运行docker-compose 启动容器
```
docker-compose up --build -d
```
直接在日志中可以查看登录二维码
```
docker-compose logs -f wechatgpt
```