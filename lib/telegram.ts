/**
 * Envía un mensaje de texto a tu chat privado de Telegram.
 * Usa parse_mode HTML para dar formato al mensaje.
 */
export async function sendTelegramMessage(text: string): Promise<void> {
    const token = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID

    if (!token || !chatId) {
        throw new Error("Faltan variables de entorno TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID")
    }

    const url = `https://api.telegram.org/bot${token}/sendMessage`

    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: chatId,
            text,
            parse_mode: "HTML",
        }),
    })

    if (!res.ok) {
        const body = await res.text()
        throw new Error(`Error al enviar mensaje de Telegram: ${res.status} ${body}`)
    }
}
