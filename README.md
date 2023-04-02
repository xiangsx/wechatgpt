# 介绍

实现微信聊天机器人的功能，接入chatgpt最新的模型gpt-3.5-turbo，速度提升了10倍

功能：
1. 登录自己的微信小号，作为机器人，可以回复私聊或者在群里的@消息
2. 支持自动发送登录二维码到指定邮箱，需要填写发送方的邮箱密钥(loginEmail),，以及接收方的邮箱地址(targetEmail), 我的代码只支持qq邮箱，其他邮箱可以改代码，很简单的，[nodemailer](https://www.npmjs.com/package/nodemailer)这个库啥邮箱都支持，***注意发送到邮箱的二维码，不能本机保存本机扫码，微信会识别失败，得另找个设备显示二维码，然后用手机扫码***
3. 支持docker部署
4. 支持代理
5. 自持自定义用户历史对话数

***注意：微信账号请使用小号，以防意外，微信保持登录需要完善个人信息，微信->我->服务->钱包->身份信息->个人信息，如果个人信息后面出现已完善说明就可以了，这是必须的步骤，不然容易掉线！！！***

# 配置文件说明
配置文件支持动态加载，直接修改保存即可生效

```js
module.exports = {
    email: { // 发送登录二维码到邮箱的配置，掉线时候自动发送登录的二维码到邮箱，随时随地登录
        enable: false,// 为true时 loginEmail targetEmail 必填
        loginEmail: {
            user: 'xxx@qq.com',// 发送的邮箱
            pass: 'xxx',// 开启IMAP/SMTP服务，提供的密钥，不是邮箱密码
        },
        targetEmail: 'xxx@qq.com', // 接收的邮箱
    },
    heart: { // 主要是防止微信掉线的，一段时间没有活动，wechaty会自动掉线的 建议开启
        enable: false,
        timeInterval: 3 * 60,// 单位秒
        contactName: 'xx', // 微信定时发送存活消息给指定用户，预防掉线
    },
    proxy: {
        enable: false, // 如果使用代理请改为true
        baseURL: 'https://api.openai.com/v1', //这个是固定的不用修改
        host: '127.0.0.1', // 修改为自己的代理host
        port: 1080, // 修改为自己的代理端口
        protocol: 'socks' // 支持http,https,socks
    },
    apikey: 'xxxxxxx', // 你在openai申请的key，如果你没有可以点个star联系我
    limit: {
        all: {// 所有用户的配置，默认值
            historyCount: 3, // 不同用户，保留历史对话数
            max_tokens: 2048,// 最大字数限制
        },
        user: {
            "contactName": {// 某个用户的配置，key是用户的微信昵称，不是备注，也不是群昵称，日志里面有打印
                historyCount: 0, // 针对某些话痨，可以把这个值设置成0，节省api使用字数，设置0即没有历史对话
                max_tokens: 1024,// 最大字数限制
            },
        }
    },
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

![image](https://user-images.githubusercontent.com/29322721/223895025-fe22d235-a4e3-43e2-b267-0d9f8e7873a0.png)

群聊@它即可回复哦

![image](https://user-images.githubusercontent.com/29322721/223895137-d5b2b7a4-e15d-4ad0-9900-22c427e5ba1f.png)

