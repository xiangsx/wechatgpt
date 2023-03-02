const { Configuration, OpenAIApi } = require('openai')
const config = require('./config/config')

// 配置 OpenAI API 密钥和模型名称
const configuration = new Configuration({
    apiKey: config.apikey,
});

const openai = new OpenAIApi(configuration);
const conMap = new Map()

// 使用 OpenAI GPT 模型生成回复
// 使用 OpenAI GPT 模型生成回复
async function getChatGPTResponse(message, contack) {
    let his = conMap.get(contack.id) || []
    try {
        let currMsg = { role: "user", content: message }
        his.push(currMsg);
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: his,
            n: 1,
            max_tokens: 2048,
            temperature: 0.6,
        })
        let res = response.data.choices[0].message
        res.content = res.content.trim()
        his.push(res)
        if (his.length > 6) {
            his = his.slice(-6)
        }
        console.log(his.map(item => `${item.role}:${item.content}`).join('\n'))
        conMap.set(contack.id, his)
        return res.content;
    } catch (error) {
        console.error('OpenAI GPT 模型生成回复失败：' + error)
        return '很抱歉，我现在无法回复您的消息。'
    }
}

module.exports = { getChatGPTResponse }

if (require.main === module) {
    getChatGPTResponse("哈哈哈", { id: "user" }).then(console)
}