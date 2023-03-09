# 介绍

实现微信聊天机器人的功能，接入chatgpt最新的模型gpt-3.5-turbo，速度提升了10倍

功能：
1. 登录自己的微信小号，作为机器人，可以回复私聊或者在群里的@消息
2. 支持自动发送登录二维码到指定邮箱，需要填写发送方的邮箱密钥(loginEmail),，以及接收方的邮箱地址(targetEmail), 我的代码只支持qq邮箱，其他邮箱可以改代码，很简单的，[nodemailer](https://www.npmjs.com/package/nodemailer)这个库啥邮箱都支持，***注意发送到邮箱的二维码，不能本机保存本机扫码，微信会识别失败，得另找个设备显示二维码，然后用手机扫码***
3. 支持docker部署

# 配置文件说明

```js
module.exports = {
    email: { // 发送登录二维码到邮箱的配置，掉线时候自动发送登录的二维码到邮箱，随时随地登录
        enable: false,// 为true时 loginEmail targetEmail 必填
        loginEmail: {
            user: 'xxx@qq.com',
            pass: 'xxx',
        },
        targetEmail: 'xxx@qq.com',
    },
    heart: { // 主要是防止微信掉线的，一段时间没有活动，wechaty会自动掉线的 建议开启
        enable: false,
        timeInterval: 3 * 60,// 单位秒
        contactName: 'xx', // 微信定时发送存活消息给指定用户，预防掉线
    },
    historyCount: 3, // 不同用户，保留历史对话数，即上下文 配置3表示 只保留3次发送和3次回复，作为下一次请求的上下文
    apikey: 'xxxxxxx', // 你在openai申请的key，如果你没有可以点个star联系我
}
```

# 启动步骤

1. 先在`config`目录下新建`config.js`文件，可以直接复制`config.demo`,然后填写配置，这里默认配置修改一下apikey就可以启动了,其他配置看情况选填
```
cp config.demo config.js
```
然后填写配置

2. 启动

运行docker-compose 启动容器
```
docker-compose up --build -d
```
直接在日志中可以查看登录二维码
```
docker-compose logs -f wechatgpt
```

# 实现效果
私聊

![image](https://user-images.githubusercontent.com/29322721/223894301-f2a41c6f-4513-4ce3-848f-4affb74849d9.png)

群聊@它即可回复哦

![image](https://user-images.githubusercontent.com/29322721/223894595-a56994e1-fad2-40bc-a2c7-00211388cc36.png)

