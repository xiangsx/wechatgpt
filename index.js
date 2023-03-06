const { WechatyBuilder } = require('wechaty')
const Qrterminal = require('qrcode-terminal')
const nodemailer = require('nodemailer')
const qrTerm = require('qrcode-terminal')
const qrImg = require('qr-image');
const fs = require('fs')

const { getChatGPTResponse } = require('./gpt')
const config = require('./config/config');
const moment = require('moment');
const { start } = require('repl');

const transporter = nodemailer.createTransport({
    host: 'smtp.qq.com',
    port: 465,
    secure: true,
    auth: {
        user: config.loginEmail.user,
        pass: config.loginEmail.pass,
    }
})

const startTime = moment()
let interval;

async function saveQrCode(qrcodeValue) {
    qrTerm.generate(qrcodeValue, { small: true })  // show qrcode on console
    const qrpng = qrImg.image(qrcodeValue, { type: 'png' });
    qrpng.pipe(require('fs').createWriteStream('./qrcode.png'));
    const info = await transporter.sendMail({
        from: config.loginEmail.user,
        to: config.targetEmail,
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
        if (interval) {
            clearInterval(interval);
        }
        interval = setInterval(async () => {
            const contact = await bot.Contact.find({ name: "盛翔" });
            if (contact) {
                await contact.say(`我还活着！已经活了 ${moment().from(startTime)} ${moment().format("YYYY-MM-DD HH:mm:ss")}`);
            }
        }, 3 * 60 * 1000);
    })

    bot.on('logout', async user => {
        console.log(`用户${user}已退出登录`)
        process.exit(0)
        // await saveQrCode(await bot.generateQRCode())
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
        if (talker.type() === bot.Contact.Type.Official) {
            console.log('这是来自微信团队的消息。');
            return;
        }

        const response = await getChatGPTResponse(message.text(), message.talker())

        await talker.say(response)
    })

    bot.on('error', async (err) => {
        console.error(err);
    })

    await bot.start()
}

loginWechaty()
