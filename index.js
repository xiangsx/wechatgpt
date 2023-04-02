const { WechatyBuilder } = require('wechaty')
const nodemailer = require('nodemailer')
const qrTerm = require('qrcode-terminal')
const qrImg = require('qr-image');
const fs = require('fs')

const { getChatGPTResponse } = require('./gpt')
const config = require('./config');
const moment = require('moment');

let transporter;

let interval;

async function saveQrCode(qrcodeValue) {
    qrTerm.generate(qrcodeValue, { small: true })  // show qrcode on console
    const { email } = config;
    if (!email.enable) {
        return
    }
    const { loginEmail, targetEmail } = email;
    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: 'smtp.qq.com',
            port: 465,
            secure: true,
            auth: {
                user: loginEmail.user,
                pass: loginEmail.pass,
            }
        })
    }
    const qrpng = qrImg.image(qrcodeValue, { type: 'png' });
    qrpng.pipe(require('fs').createWriteStream('./qrcode.png'));
    const info = await transporter.sendMail({
        from: loginEmail.user,
        to: targetEmail,
        subject: '登录微信',
        text: `请使用微信扫描二维码登录`,
        html: `<p>请使用微信扫描以下二维码登录</p><br/><img src="cid:qrcode"/>`,
        attachments: [{
            filename: 'qrcode.png',
            path: './qrcode.png',
            cid: 'qrcode'
        }]
    })
    console.log(`已发送二维码链接到邮箱：${info.messageId}`)
}

async function loginWechaty() {
    const bot = WechatyBuilder.build()

    bot.on('scan', async (qrcodeValue, status) => {
        if (status === 2) {
            await saveQrCode(qrcodeValue)
        }
    })

    bot.on('login', async user => {
        console.log(`登录成功，用户名：${user}`)
        const { heart } = config;
        if (heart.enable) {
            const startTime = moment()
            const { interval: timeInterval, contactName } = heart;
            if (interval) {
                clearInterval(interval);
            }
            interval = setInterval(async () => {
                const contact = await bot.Contact.find({ name: contactName });
                if (contact) {
                    await contact.say(`我还活着！已经活了 ${moment().diff(startTime, 'minutes')}分钟 ${moment().format("YYYY-MM-DD HH:mm:ss")}`);
                }
            }, timeInterval * 1000);
        }
    })

    bot.on('logout', async user => {
        console.log(`用户${user}已退出登录`)
        process.exit(0)
    })

    bot.on('message', async message => {
        if (message.self()) {
            return
        }
        if (message.room()) {
            const metionself = await message.mentionSelf();
            if (!metionself) {
                return
            }
            console.log("收到@我的消息")
            const room = await message.room()
            const text = await message.mentionText()
            // await room.say("不支持群聊了哦", message.talker())
            // return

            const response = await getChatGPTResponse(text, message.talker())
            await room.say(response, message.talker())
            return
        }
        console.log("收到私聊")
        const talker = message.talker()
        if (talker.type() !== bot.Contact.Type.Individual) {
            console.log(`这不是来自个人的消息的，这是来自${talker.type()}`);
            return;
        }

        const response = await getChatGPTResponse(message.text(), talker)

        await talker.say(response)
    })

    bot.on('error', async (err) => {
        console.error(err);
    })

    await bot.start()
}

loginWechaty()
