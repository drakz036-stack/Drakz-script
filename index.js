const { default: makeWASocket, useMultiFileAuthState } = require("@adiwajshing/baileys")
const pino = require("pino")

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("session")

    const sock = makeWASocket({
        logger: pino({ level: "silent" }),
        auth: state,
        printQRInTerminal: true
    })

    sock.ev.on("creds.update", saveCreds)

    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0]
        if (!msg.message) return

        const text = msg.message.conversation || msg.message.extendedTextMessage?.text

        if (!text) return

        const from = msg.key.remoteJid

        // MENU
        if (text === "!menu") {
            await sock.sendMessage(from, {
                text: "🤖 *BOT AKTIF*\n\n!menu\n!ping\n!owner"
            })
        }

        // PING
        if (text === "!ping") {
            await sock.sendMessage(from, { text: "🏓 Pong!" })
        }

        // OWNER
        if (text === "!owner") {
            await sock.sendMessage(from, { text: "👤 Owner: Danendra" })
        }
    })
}

startBot()
