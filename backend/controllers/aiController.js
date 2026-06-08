import Anthropic from '@anthropic-ai/sdk'
import masterModel from '../models/masterModel.js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const recommendMaster = async (req, res) => {
    try {
        const { service, budget, priorities, additionalInfo } = req.body

        const doctors = await masterModel.find({ available: true, archived: false })
            .select('name speciality experience fees about degree')
            .lean()

        if (doctors.length === 0) {
            return res.json({ success: false, message: 'Нет доступных мастеров' })
        }

        const mastersText = doctors.map((d, i) =>
            `${i + 1}. ${d.name} | Специализация: ${d.speciality} | Опыт: ${d.experience} | Цена: ${d.fees} руб | О себе: ${d.about}`
        ).join('\n')

        const prompt = `Ты — помощник по подбору мастера красоты. Проанализируй список мастеров и помоги клиенту выбрать подходящего.

Запрос клиента:
- Услуга: ${service}
- Бюджет: ${budget}
- Приоритеты: ${priorities.join(', ')}
${additionalInfo ? `- Дополнительно: ${additionalInfo}` : ''}

Список мастеров:
${mastersText}

Ответь строго в формате JSON (без markdown-блоков, только чистый JSON):
{
  "recommendedIndex": <номер мастера от 1 до ${doctors.length}>,
  "masterName": "<имя мастера>",
  "matchScore": <процент совпадения от 70 до 99>,
  "reason": "<краткое объяснение выбора на русском, 2-3 предложения>",
  "tips": ["<совет 1>", "<совет 2>", "<совет 3>"]
}`

        const response = await client.messages.create({
            model: 'claude-sonnet-4-6',
            max_tokens: 1024,
            messages: [{ role: 'user', content: prompt }]
        })

        const rawText = response.content[0].text.trim()
        const jsonText = rawText.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
        const result = JSON.parse(jsonText)

        const recommended = doctors[result.recommendedIndex - 1]

        res.json({
            success: true,
            recommendation: {
                master: recommended,
                matchScore: result.matchScore,
                reason: result.reason,
                tips: result.tips
            }
        })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { recommendMaster }
