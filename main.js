//Código desde cero y comentarios hecho por: 
// @gata_dios    
// @Skidy89  
// @elrebelde21 

// Importaciones 
const baileys = require('@whiskeysockets/baileys'); // trabajar a través de descargas por Whatsapp 
const { WaMessageStubType, WA_DEFAULT_EPHEMERAL, BufferJSON, areJidsSameUser, downloadContentFromMessage, generateWAMessageContent, generateWAMessageFromContent, generateWAMessage, prepareWAMessageMedia, getContentType,  relayMessage} = require('@whiskeysockets/baileys'); // Importa los objetos 'makeWASocket' y 'proto' desde el módulo '@whiskeysockets/baileys'      
const { default: makeWASocket, proto } = require("@whiskeysockets/baileys")   
const moment = require('moment-timezone') // Trabajar con fechas y horas en diferentes zonas horarias
const gradient = require('gradient-string') // Aplicar gradientes de color al texto     
const { exec, spawn, execSync } =  require("child_process")// Función 'execSync' del módulo 'child_process' para ejecutar comandos en el sistema operativo 
const chalk = require('chalk') // Estilizar el texto en la consola  
const os = require('os') // Proporciona información del sistema operativo 
const fs = require('fs') // Trabajar con el sistema de archivos    
const scp1 = require('./libs/scraper') 
const fetch = require('node-fetch')
const axios = require('axios') 
const {fileURLToPath} = require('url') 
const cheerio = require('cheerio')
const yts = require('yt-search') 
const gpt = require('api-dylux')
const util = require('util')
const createHash = require('crypto') 
const mimetype = require("mime-types")  
const ws = require('ws')
const JavaScriptObfuscator = require('javascript-obfuscator')
const webp = require("node-webpmux")
const Jimp = require('jimp')
const { File } = require("megajs")
const speed = require("performance-now")
const ffmpeg = require("fluent-ffmpeg")
const similarity = require('similarity')   
const ytdl = require('ytdl-core') 
const fg = require('api-dylux') 
const {savefrom, lyrics, lyricsv2, youtubedl, youtubedlv2} = require('@bochilteam/scraper') 
const translate = require('@vitalets/google-translate-api') 
const { smsg, fetchBuffer, getBuffer, buffergif, getGroupAdmins, formatp, tanggal, formatDate, getTime, isUrl, sleep, clockString, runtime, fetchJson, jsonformat, delay, format, logic, generateProfilePicture, parseMention, getRandom, msToTime, downloadMediaMessage, convertirMsADiasHorasMinutosSegundos, pickRandom, getUserBio, asyncgetUserProfilePic} = require('./libs/fuctions')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid, writeExif, toAudio } = require('./libs/fuctions2');
const { ytmp4, ytmp3, ytplay, ytplayvid } = require('./libs/youtube')
const {sizeFormatter} = require('human-readable') 
const formatSize = sizeFormatter({
std: 'JEDEC', decimalPlaces: 2, keepTrailingZeroes: false, render: (literal, symbol) => `${literal} ${symbol}B`});

const color = (text, color) => { // Función 'color' que toma un texto y un color como parámetros
return !color ? chalk.cyanBright(text) : color.startsWith('#') ? chalk.hex(color)(text) : chalk.keyword(color)(text)} // Si no hay color, utilizar el color celeste brillante (por defecto)

const msgs = (message) => {  
if (message.length >= 10) { 
return `${message.substr(0, 500)}` 
} else {  
return `${message}`}}
const getFileBuffer = async (mediakey, MediaType) => {  
const stream = await downloadContentFromMessage(mediakey, MediaType)  
let buffer = Buffer.from([])  
for await(const chunk of stream) {  
buffer = Buffer.concat([buffer, chunk]) }  
return buffer 
}   

module.exports = conn = async (conn, m, chatUpdate, mek, store) => { 
conn.ev.on('group-participants.update', async (update) => {
    if (!global.publicMode) return;
    let { id, participants, action } = update;
    if (action === 'add') {
        for (let participant of participants) {
            let metadata = await conn.groupMetadata(id);
            let groupName = metadata.subject;
            let welcomeText = `🌟 ¡Bienvenido @${participant.split('@')[0]} al grupo *${groupName}*!`;
            await conn.sendMessage(id, { text: welcomeText, mentions: [participant] });
        }
    }
});
conn.sendAlbumMessage = async function (jid, medias, options = {}) {
    let img, video;
    const caption = options.text || options.caption || "";

    const album = generateWAMessageFromContent(jid, {
        albumMessage: {
            expectedImageCount: medias.filter(media => media.type === "image").length,
            expectedVideoCount: medias.filter(media => media.type === "video").length,
            ...(options.quoted ? {
                contextInfo: {
                    remoteJid: options.quoted.key.remoteJid,
                    fromMe: options.quoted.key.fromMe,
                    stanzaId: options.quoted.key.id,
                    participant: options.quoted.key.participant || options.quoted.key.remoteJid,
                    quotedMessage: options.quoted.message
                }
            } : {})
        }
    }, { quoted: options.quoted });

    await conn.relayMessage(album.key.remoteJid, album.message, {
        messageId: album.key.id
    });

    for (const media of medias) {
        const { type, data } = media;

        if (/^https?:\/\//i.test(data.url)) {
            try {
                const response = await fetch(data.url);
                const contentType = response.headers.get('content-type');

                if (/^image\//i.test(contentType)) {
                    img = await prepareWAMessageMedia({ image: { url: data.url } }, { upload: conn.waUploadToServer });
                } else if (/^video\//i.test(contentType)) {
                    video = await prepareWAMessageMedia({ video: { url: data.url } }, { upload: conn.waUploadToServer });
                }
            } catch (error) {
                console.error("Error al obtener el tipo MIME:", error);
            }
        }

        const mediaMessage = await generateWAMessage(album.key.remoteJid, {
            [type]: data,
            ...(media === medias[0] ? { caption } : {})
        }, {
            upload: conn.waUploadToServer
        });

        mediaMessage.message.messageContextInfo = {
            messageAssociation: {
                associationType: 1,
                parentMessageKey: album.key
            }
        };

        await conn.relayMessage(mediaMessage.key.remoteJid, mediaMessage.message, {
            messageId: mediaMessage.key.id
        });
    }

    return album;
};
var budy = (m.mtype === 'conversation') ? m.message.conversation : (m.mtype == 'imageMessage') ? m.message.imageMessage.caption : (m.mtype == 'videoMessage') ? m.message.videoMessage.caption : (m.mtype == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (m.mtype == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : (m.mtype == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.mtype == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : (m.mtype === 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text) : ''

//----------------------[ ATRIBUTOS ]-------------------------
if (m.key.id.startsWith("BAE5")) return;

var body = (typeof m.text == 'string' ? m.text : '');
var budy = body;

const allowedPrefixes = /^[./*#!]/;
const isCmd = allowedPrefixes.test(body) || true;
const command = isCmd 
? body.replace(allowedPrefixes, '').trim().split(/ +/).shift().toLocaleLowerCase() 
: body.trim().split(/ +/).shift().toLocaleLowerCase();

const args = body.trim().split(/ +/).slice(isCmd ? 1 : 0);
const from = m.chat;
const msg = JSON.parse(JSON.stringify(m, undefined, 2));
m.reply = (text) => {
  conn.sendMessage(m.chat, {
    text: text,
    contextInfo: {
    forwardingScore: 9999999,
      isForwarded: true,
      externalAdReply: {
        showAdAttribution: false,
        title: `𝑴𝒊𝒄𝒂𝑺𝒉𝒂𝒅𝒆 ${SetEmoji[userSender] || SetEmoji.default}`,
        mediaType: 2,
        sourceUrl: 'https://whatsapp.com/channel/0029VadxAUkKLaHjPfS1vP36',
        thumbnailUrl: FotosMenu[userSender] || FotosMenu.default
      }
    }
  }, { quoted: m });
};
const content = JSON.stringify(m.message);
const type = m.mtype;
let t = m.messageTimestamp;
const pushname = m.pushName || "Sin nombre";
const botnm = conn.user.id.split(":")[0] + "@s.whatsapp.net";
const _isBot = conn.user.jid;
const userSender = m.key.fromMe
? botnm
: m.isGroup && m.key.participant.includes(":")
? m.key.participant.split(":")[0] + "@s.whatsapp.net"
: m.key.remoteJid.includes(":")
? m.key.remoteJid.split(":")[0] + "@s.whatsapp.net"
: m.key.fromMe
? botnm
: m.isGroup
? m.key.participant
: m.key.remoteJid;
//const allowedNumber = '50582340051@s.whatsapp.net';
//if (userSender !== allowedNumber) return;
const isCreator = [
conn.decodeJid(conn.user.id),
...global.owner.map(([numero]) => numero),
]
.map((v) => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net")
.includes(m.sender);

const isOwner = isCreator || m.fromMe;
const isMods =
isOwner ||
global.mods
.map((v) => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net")
.includes(m.sender);
const isPrems =
isOwner ||
global.premium
.map((v) => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net")
.includes(m.sender);

const itsMe = m.sender == conn.user.id;
const text = args.join(" ");
const q = args.join(" ");
const quoted = m.quoted ? m.quoted : m;
const sender = m.key.fromMe ? botnm : m.isGroup ? m.key.participant : m.key.remoteJid;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const mime = (quoted.msg || quoted).mimetype || '';
const isMedia = /image|video|sticker|audio/.test(mime);
const mentions = [];

if (m.message[type].contextInfo) {
if (m.message[type].contextInfo.mentionedJid) {
const msd = m.message[type].contextInfo.mentionedJid;
for (let i = 0; i < msd.length; i++) {
mentions.push(msd[i]);
}
}
}

//----------------------[ FUNCION/GRUPO ]-------------------------
const groupMetadata = m.isGroup ? await conn.groupMetadata(from) : ''
const groupName = m.isGroup ? groupMetadata.subject : '' 
const participants = m.isGroup ? await groupMetadata.participants : '' 
const groupAdmins = m.isGroup ? await getGroupAdmins(participants) : '' 
const isBotAdmins = m.isGroup ? groupAdmins.includes(botnm) : false  
const isGroupAdmins = m.isGroup ? groupAdmins.includes(userSender) : false 
const isBaneed = m.isGroup ? blockList.includes(userSender) : false 
const isPremium = m.isGroup ? premium.includes(userSender) : false   
const who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
const thumb = 'https://telegra.ph/file/16a28106fa7c2109f3ff9.jpg'
let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${userSender.split('@')[0]}:${userSender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
const ftroli ={key: {fromMe: false,"participant":"0@s.whatsapp.net", "remoteJid": "status@broadcast"}, "message": {orderMessage: {itemCount: 2022,status: 200, thumbnail: thumb, surface: 200, message: "puta gata", orderTitle: "puto aiden me lo folle", sellerJid: '0@s.whatsapp.net'}}, contextInfo: {"forwardingScore":999,"isForwarded":true},sendEphemeral: true}
const fdoc = {key : {participant : '0@s.whatsapp.net', ...(from ? { remoteJid: `status@broadcast` } : {}) },message: {documentMessage: {title: "A", jpegThumbnail: null}}}//const fgif = {key: {participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: "status@broadcast" } : {})},message: {"videoMessage": { "title":botname, "h": wm,'seconds': '359996400', 'gifPlayback': 'true', 'caption': ownername, 'jpegThumbnail': thumb}}}
const kick = function (from, orangnya) {
for (let i of orangnya) {
conn.groupParticipantsUpdate(from, [i], "remove");
}}
const time = moment(Number(msg.messageTimestamp + "000")).locale("es-mx").tz("America/Asuncion").format('MMMM Do YYYY, h:mm:ss a')

const reply = (text) => {  
  conn.sendMessage(m.chat, {
    text: text,
    contextInfo: {
      isForwarded: true,
      externalAdReply: {
        showAdAttribution: false,
        title: `𝑴𝒊𝒄𝒂𝑺𝒉𝒂𝒅𝒆 ${SetEmoji[userSender] || SetEmoji.default}`,
        mediaType: 2,
        sourceUrl: 'https://whatsapp.com/channel/0029VadxAUkKLaHjPfS1vP36',
        thumbnailUrl: FotosMenu[userSender] || FotosMenu.default
      }
    }
  }, { quoted: m });
};
const sendAdMessage = (text, title, body, image, url) => { conn.sendMessage(m.chat, {text: text, contextInfo: { externalAdReply: { title: title, body: body, mediaUrl: url, sourceUrl: url, previewType: 'PHOTO', showAdAttribution: true, thumbnail: image, sourceUrl: url }}}, {})}  
const sendImage = ( image, caption ) => { conn.sendMessage(m.chat, { image: image, caption: caption }, {quoted: m, ephemeralExpiration: 24*60*100, disappearingMessagesInChat: 24*60*100})}  
const sendImageAsUrl = ( url, caption ) => { conn.sendMessage(m.chat, { image:  {url: url }, caption: caption }, {quoted: m, ephemeralExpiration: 24*60*100, disappearingMessagesInChat: 24*60*100})}  

//-------------[ TIPOS DE MENSAJES Y CITADOS ]----------------
const isAudio = type == 'audioMessage' // Mensaje de Audio  
const isSticker = type == 'stickerMessage' // Mensaje de Sticker  
const isContact = type == 'contactMessage' // Mensaje de Contacto  
const isLocation = type == 'locationMessage' // Mensaje de Localización   
const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')  
const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')  
const isQuotedAudio = type === 'extendedTextMessage' && content.includes('audioMessage')  
const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')  
const isQuotedDocument = type === 'extendedTextMessage' && content.includes('documentMessage')  
const isQuotedMsg = type === 'extendedTextMessage' && content.includes('Message') // Mensaje citado de cualquier tipo  
const isViewOnce = (type === 'viewOnceMessage') // Verifica si el tipo de mensaje es (mensaje de vista única)  

//base de datos
let user = global.db.data.users[m.sender]
let chats = global.db.data.users[m.chat]
let setting = global.db.data.settings[conn.user.jid]  

//autoread
if (m.message) {
conn.readMessages([m.key])}	

//Marcar como (Escribiendo...) 
/*if (command) {
await conn.sendPresenceUpdate('composing', m.chat)
}*///Para que le guste :v

//--------------------[ MODO SELF ]-----------------------
const configPath = './config.json';
function loadConfig() {
if (!fs.existsSync(configPath)) {
fs.writeFileSync(configPath, JSON.stringify({ publicMode: false }, null, 2));
}
return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
}

function saveConfig(config) {
fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

let config = loadConfig();
global.publicMode = config.publicMode;

if (!global.publicMode && !isCreator) {
if (!m.key.fromMe) return;
}
//--------------------[ BANEAR EL CHAT ]-----------------------
if (global.db.data.chats[m.chat].ban && !isCreator) {
return
}

//--------------------[ MODO ADMINS ]-----------------------
if (global.db.data.chats[m.chat].modeadmin && !isGroupAdmins) {
return
}

//--------------------[ UPTIME ]-----------------------      
//Tiempo de Actividad del bot
const used = process.memoryUsage()
const cpus = os.cpus().map(cpu => {
cpu.total = Object.keys(cpu.times).reduce((last, type) => last + cpu.times[type], 0)
return cpu
})
//conn.sendReadReceipt(from,sender,[m.key.id])

const cpu = cpus.reduce((last, cpu, _, { length }) => {
last.total += cpu.total
last.speed += cpu.speed / length
last.times.user += cpu.times.user
last.times.nice += cpu.times.nice
last.times.sys += cpu.times.sys
last.times.idle += cpu.times.idle
last.times.irq += cpu.times.irq
return last
}, {
speed: 0,
total: 0,
times: {
user: 0,
nice: 0,
sys: 0,
idle: 0,
irq: 0
}})

// ‿︵‿︵ʚɞ『 INFO CONSOLE 』ʚɞ‿︵‿︵	
if (m.message) {
console.log(
chalk.black.bold(`[⚠] 𝑴𝒊𝒄𝒂𝑺𝒉𝒂𝒅𝒆 - by EliasarYT\n`) +
chalk.red(`> Usuario: ${conn.user.jid.split`@`[0]}\n`) +
chalk.gray(`> Fecha: ${moment(t * 1000).tz(place).format('DD/MM/YY HH:mm:ss')}\n`) +
chalk.red(`> Privacidad: [${global.publicMode ? 'Público' : 'Privado'}]\n`) +
chalk.red(`> Tipo: ${type}\n`) +
(m.isGroup
? chalk.magenta(`> Grupo: ${groupName} | ${from}\n`)
: chalk.magenta(`> Remitente: ${userSender}\n`)) +
chalk.cyan(`> Nombre: ${pushname} | ${userSender}\n`) +
chalk.black.bold(`> Mensaje:\n`) +
chalk.gray(`${msgs(m.text)}\n`)
);
}
const filePath = './emojis.json';

let SetEmoji = {};

try {
SetEmoji = JSON.parse(fs.readFileSync(filePath, 'utf8'));
} catch (error) {
SetEmoji = { default: '🍂' };
}
const fileFotoPath = './fotosMenu.json';
let FotosMenu = {};

try {
FotosMenu = JSON.parse(fs.readFileSync(fileFotoPath, 'utf8'));
} catch (error) {
FotosMenu = { default: 'https://i.ibb.co/RpQTH7d2/d666ec41e31d.jpg' };
}
const commandsPath = './commands.json';
const mainFilePath = __filename;

function extraerComandos() {
  const contenidoMain = fs.readFileSync(mainFilePath, 'utf-8');
  const regexCase = /case\s+['"](.+?)['"]\s*:/g;
  let coincidencia;
  const comandos = {};

  while ((coincidencia = regexCase.exec(contenidoMain)) !== null) {
    comandos[coincidencia[1]] = { iscmd: true };
  }

  return comandos;
}

function actualizarComandos() {
  const comandos = extraerComandos();
  fs.writeFileSync(commandsPath, JSON.stringify(comandos, null, 2));
}

fs.watchFile(mainFilePath, () => {
  actualizarComandos();
});

actualizarComandos();

global.cmdjs = require(commandsPath);

const countPath = './cmdCount.json';
const loadCounts = () => {
  if (!fs.existsSync(countPath)) {
    fs.writeFileSync(countPath, JSON.stringify({ cmduse: 0, cmdmasuse: '', cmdCount: {} }, null, 2));
  }
  return JSON.parse(fs.readFileSync(countPath));
};

const saveCounts = (data) => {
  fs.writeFileSync(countPath, JSON.stringify(data, null, 2));
};

const counts = loadCounts();

global.cmduse = counts.cmduse || 0;
global.cmdmasuse = counts.cmdmasuse || '';
global.cmdCount = counts.cmdCount || {};

if (global.cmdjs[command]?.iscmd) {
  global.cmduse++;
  global.cmdCount[command] = (global.cmdCount[command] || 0) + 1;

  global.cmdmasuse = Object.entries(global.cmdCount).reduce((max, cmd) =>
    cmd[1] > max[1] ? cmd : max
  )[0];

  saveCounts({ cmduse: global.cmduse, cmdmasuse: global.cmdmasuse, cmdCount: global.cmdCount });
}
switch (command) {
case 'setemoji': {
if (!text) return reply(`${SetEmoji.default} Ingresa un emoji`);
SetEmoji[userSender] = text;
fs.writeFileSync(filePath, JSON.stringify(SetEmoji, null, 2));
reply(`${text} Emoji asignado`);
break;
}

case 'setmenu': {
if (!isMedia && !isQuotedImage) 
return reply(`${SetEmoji[userSender] || SetEmoji.default} Por favor, responde o envía una imagen para configurarla como foto de menú.`);

const { uploadImage } = require('./libs/tourl2.js');
const media = await quoted.download();
const tempFilePath = `./tmp/${Math.random().toString(36).substring(7)}.jpg`;
fs.writeFileSync(tempFilePath, media);

try {
const url = await uploadImage(tempFilePath);
fs.unlinkSync(tempFilePath);
FotosMenu[userSender] = url;
fs.writeFileSync(fileFotoPath, JSON.stringify(FotosMenu, null, 2));

reply(`${SetEmoji[userSender] || SetEmoji.default} Foto de menú actualizada con éxito`);
} catch (error) {
fs.unlinkSync(tempFilePath);
reply(`${SetEmoji[userSender] || SetEmoji.default} Error al subir la imagen. Intenta nuevamente.`);
}
break;
}
case 'git':  
case 'gitclone':  
case 'gitc': {  
    if (!text) return m.reply(`${SetEmoji[userSender] || SetEmoji.default} Ingresa el enlace de un repositorio de GitHub.`)  

    let cleanedText = text.replace(/^https?:\/\//, '').replace(/\.git$/, '');

    let repoUrlMatch = cleanedText.match(/github\.com\/([^\/]+)\/([^\/]+)/);  
    if (!repoUrlMatch) return m.reply(`${SetEmoji[userSender] || SetEmoji.default} El enlace proporcionado no es válido.`);  

    let owner = repoUrlMatch[1];  
    let repo = repoUrlMatch[2];  

    let branch = 'main'; 
    let apiUrl = `https://api.github.com/repos/${owner}/${repo}/branches/${branch}`;

    try {  
        let response = await fetch(apiUrl);
        if (!response.ok) {
            branch = 'master';
            apiUrl = `https://api.github.com/repos/${owner}/${repo}/branches/${branch}`;
            response = await fetch(apiUrl);
            if (!response.ok) {
                return m.reply(`${SetEmoji[userSender] || SetEmoji.default} No se encontró la rama principal del repositorio.`);  
            }
        }

        let zipUrl = `https://github.com/${owner}/${repo}/archive/refs/heads/${branch}.zip`;

        await conn.sendMessage(m.chat, {  
            document: { url: zipUrl },  
            mimetype: 'application/zip',  
            fileName: `${repo}.zip`,  
            caption: `Aquí tienes el repositorio en formato ZIP.`  
        }, { quoted: m });  

    } catch (err) {  
        console.error(err);  
        m.reply(`${SetEmoji[userSender] || SetEmoji.default} Ocurrió un error al procesar el comando. Error: ${err.message || 'Desconocido'}`);  
    }  
    break  
}
case 'tourl': {
if (!isMedia && !isQuotedImage) return m.reply(`${SetEmoji[userSender] || SetEmoji.default} Por favor, responde o envía una imagen para convertirla a URL.`);
const { uploadImage } = require('./libs/tourl2.js');
const media = await quoted.download();
const tempFilePath = `./tmp/${Math.random().toString(36).substring(7)}.jpg`;
fs.writeFileSync(tempFilePath, media);
try {
const url = await uploadImage(tempFilePath);
fs.unlinkSync(tempFilePath);
m.reply(`${SetEmoji[userSender] || SetEmoji.default} Imagen subida con éxito: ${url}`);
} catch (error) {
fs.unlinkSync(tempFilePath);
m.reply(`${SetEmoji[userSender] || SetEmoji.default} Error al subir la imagen. Intenta nuevamente.`);
}
break;
}
case 'ds': {
    if (!isOwner) return m.reply(`${SetEmoji[userSender] || SetEmoji.default} Solo el propietario puede usar este comando.`);
    const pathToDirectory = './sessions';
    const fs = require('fs');
    const path = require('path');

    fs.readdir(pathToDirectory, (err, files) => {
        if (err) return m.reply(`${SetEmoji[userSender] || SetEmoji.default} Error leyendo la carpeta: ${err.message}`);

        files.forEach(file => {
            if (file !== 'creds.json') {
                const filePath = path.join(pathToDirectory, file);
                fs.unlink(filePath, err => {
                    if (err) {
                        m.reply(`${SetEmoji[userSender] || SetEmoji.default} Error eliminando archivo ${file}: ${err.message}`);
                    }
                });
            }
        });

        m.reply(`${SetEmoji[userSender] || SetEmoji.default} Archivos eliminados, excepto el importante creds.json.`);
        setTimeout(() => {
            m.reply(`${SetEmoji[userSender] || SetEmoji.default} ¿Hola? ¿Puedes verme?`);
        }, 1000);
    });
    break;
}
case 'infomsg': {
if (!isOwner) return m.reply(`${SetEmoji[userSender] || SetEmoji.default} Este comando solo puede ser ejecutado por el owner.`);

if (m.quoted) {
m.reply(JSON.stringify(m.quoted, null, 2));
} else {
m.reply(`${SetEmoji[userSender] || SetEmoji.default} Por favor, responde a un mensaje para obtener su información.`);
}
break;
}
case 'eval': {
  if (!isCreator) return m.reply(`${SetEmoji[userSender] || SetEmoji.default} Solo el creador puede ejecutar código.`);

  try {
    let result = eval(text);
    if (typeof result !== 'string') result = require('util').inspect(result);
    m.reply(`${result}`);
  } catch (err) {
    m.reply(`${SetEmoji[userSender] || SetEmoji.default} Error:\n${err.message}`);
  }
  break;
}
case 'exec': {
  if (!isCreator) return m.reply(`${SetEmoji[userSender] || SetEmoji.default} Solo el creador puede ejecutar comandos.`);

  if (!text) return m.reply(`${SetEmoji[userSender] || SetEmoji.default} Ingresa un comando para ejecutar.`);

  exec(text, (err, stdout, stderr) => {
    if (err) return m.reply(`${SetEmoji[userSender] || SetEmoji.default} Error: ${err.message}`);
    if (stderr) return m.reply(`${SetEmoji[userSender] || SetEmoji.default} Stderr: ${stderr}`);
    m.reply(`${SetEmoji[userSender] || SetEmoji.default} Resultado:\n${stdout}`);
  });
  break;
}
case 'play': {
  if (!text) return m.reply(`${SetEmoji[userSender] || SetEmoji.default} Ingresa el nombre de la canción o el enlace de YouTube.`)

  try {
    let search = await yts(text)
    if (!search.videos.length) return m.reply(`${SetEmoji[userSender] || SetEmoji.default} No se encontraron resultados.`)

    let video = search.videos[0]
    let videoInfo = `
${SetEmoji[userSender] || SetEmoji.default} Título: ${video.title}
${SetEmoji[userSender] || SetEmoji.default} Link: ${video.url}
${SetEmoji[userSender] || SetEmoji.default} Vistas: ${video.views}
${SetEmoji[userSender] || SetEmoji.default} Publicado: ${video.ago}
${SetEmoji[userSender] || SetEmoji.default} Duración: ${video.timestamp}`

    await conn.sendMessage(m.chat, {
      image: { url: video.thumbnail },
      caption: videoInfo
    }, { quoted: m })

    let audioResponse = await fetch(`https://api.siputzx.my.id/api/d/ytmp3?url=${video.url}`)
    let audioData = await audioResponse.json()

    if (!audioData.status || !audioData.data || !audioData.data.dl) 
      return m.reply(`${SetEmoji[userSender] || SetEmoji.default} No se pudo obtener el audio.`)

    await conn.sendMessage(m.chat, {
      audio: { url: audioData.data.dl },
      mimetype: 'audio/mpeg',
      fileName: `${audioData.data.title}.mp3`
    }, { quoted: m })

  } catch (err) {
    m.reply(`${SetEmoji[userSender] || SetEmoji.default} Ocurrió un error al procesar el comando.`)
  }
  break
}

case 'play2': {
  if (!text) return m.reply(`${SetEmoji[userSender] || SetEmoji.default} Ingresa el nombre de la canción o el enlace de YouTube.`)

  try {
    let search = await yts(text)
    if (!search.videos.length) return m.reply(`${SetEmoji[userSender] || SetEmoji.default} No se encontraron resultados.`)

    let video = search.videos[0]
    let videoInfo = `
${SetEmoji[userSender] || SetEmoji.default} Título: ${video.title}
${SetEmoji[userSender] || SetEmoji.default} Link: ${video.url}
${SetEmoji[userSender] || SetEmoji.default} Vistas: ${video.views}
${SetEmoji[userSender] || SetEmoji.default} Publicado: ${video.ago}
${SetEmoji[userSender] || SetEmoji.default} Duración: ${video.timestamp}`

    await conn.sendMessage(m.chat, {
      image: { url: video.thumbnail },
      caption: videoInfo
    }, { quoted: m })

    let videoResponse = await fetch(`https://api.siputzx.my.id/api/d/ytmp4?url=${video.url}`)
    let videoData = await videoResponse.json()

    if (!videoData.status || !videoData.data || !videoData.data.dl) 
      return m.reply(`${SetEmoji[userSender] || SetEmoji.default} No se pudo obtener el vídeo.`)

    await conn.sendMessage(m.chat, {
      video: { url: videoData.data.dl },
      mimetype: 'video/mp4',
      caption: `${SetEmoji[userSender] || SetEmoji.default} Vídeo descargado: ${videoData.data.title}`
    }, { quoted: m })

  } catch (err) {
    m.reply(`${SetEmoji[userSender] || SetEmoji.default} Ocurrió un error al procesar el comando.`)
  }
  break
}
case 'brat': {
    if (!text) return m.reply(`${SetEmoji[userSender] || SetEmoji.default} Ingresa un texto para generar el sticker.`);

    try {
        let apiUrl = `https://api.fgmods.xyz/api/maker/attp?text=${encodeURIComponent(text)}&apikey=foJRF6Py`;
        let response = await fetch(apiUrl);
        let buffer = await response.buffer();
        let tempFilePath = `./tmp/${Math.random().toString(36).substring(7)}.webp`;
        fs.writeFileSync(tempFilePath, buffer);

        const d = new Date(new Date() + 3600000);
        const locale = 'es-ES';
        const dias = d.toLocaleDateString(locale, { weekday: 'long' });
        const fecha = d.toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' });

        let authorInfo = `{
            "developer": "by EliasarYT",
            "usuario": "${pushname}",
            "fecha": "${fecha}",
            "día": "${dias}"
        }`;

        await conn.sendVideoAsSticker(m.chat, buffer, m, { 
            packname: "",
            author: authorInfo,
            contextInfo: { 
                forwardedNewsletterMessageInfo: { 
                    newsletterJid: '120363160031023229@newsletter', 
                    serverMessageId: '', 
                    newsletterName: 'INFINITY-WA 💫'
                }, 
                forwardingScore: 9999999,  
                isForwarded: true, 
                externalAdReply: { 
                    showAdAttribution: false, 
                    title: `𝑴𝒊𝒄𝒂𝑺𝒉𝒂𝒅𝒆 ${SetEmoji[userSender] || SetEmoji.default}`, 
                    mediaType: 2, 
                    sourceUrl: 'https://whatsapp.com/channel/0029VadxAUkKLaHjPfS1vP36', 
                    thumbnailUrl: FotosMenu[userSender] || FotosMenu.default
                } 
            } 
        });

        fs.unlinkSync(tempFilePath);
    } catch (err) {
        m.reply(`${SetEmoji[userSender] || SetEmoji.default} Error al generar el sticker.`);
    }
    break;
}
case 'delowner': {
  if (m.sender !== '50582340051@s.whatsapp.net') {
    return m.reply(`${SetEmoji[userSender] || SetEmoji.default} Solo el usuario autorizado puede eliminar owners.`);
  }

  const number = args.join('').replace(/\D/g, '');
  if (number.length < 7) return m.reply(`${SetEmoji[userSender] || SetEmoji.default} Uso correcto: .delowner 50582340051`);

  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  const index = config.owner.findIndex(([num]) => num === number);

  if (index === -1) return m.reply(`${SetEmoji[userSender] || SetEmoji.default} El número no está registrado como owner.`);

  config.owner.splice(index, 1);
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

  m.reply(`${SetEmoji[userSender] || SetEmoji.default} Owner eliminado correctamente: ${number}`);
  break;
}

case 'botones': {
conn.sendMessage(m.chat, { text: "ANSI-BOT", caption: "ANSIBOT", footer: "EliasarYT", buttons: [
{
buttonId: ".menu", 
buttonText: { 
displayText: 'menu' 
}
}, {
buttonId: ".test", 
buttonText: {
displayText: "test"
}
}
],
viewOnce: true,
headerType: 1,
}, { quoted: m })
break;
}

case 'addowner': {
  if (!isCreator) return m.reply(`${SetEmoji[userSender] || SetEmoji.default} Solo el creador puede añadir nuevos owners.`);

  const input = args.join(' ').trim();
  const numberMatch = input.match(/(\+?\d[\d\s().-]*)/);
  const name = input.replace(numberMatch ? numberMatch[0] : '', '').trim();

  if (!numberMatch || !name) return m.reply(`${SetEmoji[userSender] || SetEmoji.default} Uso correcto: .addowner +505 XXXX Nombre`);

  const cleanNumber = numberMatch[0].replace(/\D/g, '');
  if (cleanNumber.length < 7) return m.reply(`${SetEmoji[userSender] || SetEmoji.default} El número no es válido.`);

  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  config.owner.push([cleanNumber, name, true]);
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

  m.reply(`${SetEmoji[userSender] || SetEmoji.default} Nuevo owner añadido:\n- Número: ${cleanNumber}\n- Nombre: ${name}`);
  break;
}
case 'menu': {
const pairingCode = JSON.parse(fs.readFileSync('./sessions/creds.json', 'utf8')).pairingCode;
let menuImage = FotosMenu[userSender] || FotosMenu.default;
let menuText = `
_❲𝑴𝒊𝒄𝒂𝑺𝒉𝒂𝒅𝒆❳_  
MODE: [${global.publicMode ? 'Public' : 'Private'}]
SESSION: ${pairingCode}
EXECUTED COMMANDS: ${cmduse}

𝑫𝑶𝑾𝑵𝑳𝑶𝑨𝑫𝑺 ° ᭄
ﾟplay
ﾟfb
ﾟtt
ﾟig
ﾟgit
ﾟspotify
ﾟplay2

𝑮𝑹𝑶𝑼𝑷𝑺 ° ᭄
ﾟkick
ﾟtag
ﾟlink

𝑷𝑬𝑹𝑺𝑶𝑵𝑨𝑳𝑰𝑧𝑬 ° ᭄
ﾟsetemoji
ﾟsetmenu

𝑻𝑶𝑶𝑳𝑺 ° ᭄
ﾟrvo
ﾟava
ﾟs
ﾟbrat

𝑺𝑬𝑨𝑹𝑪𝑯𝑬𝑹𝑺 ° ᭄
ﾟpinterest
ﾟtourl

𝑶𝑾𝑵𝑬𝑹 ° ᭄
ﾟmodopc
ﾟmodopv
ﾟaddowner
ﾟdelowner
ﾟexec
ﾟeval
ﾟds
ﾟinfomsg

> © by EliasarYT  
`;
conn.sendMessage(m.chat, {
text: menuText,
linkPreview: true,
contextInfo: {
mentionedJid: [m.sender],
forwardingScore: 9999999,
isForwarded: true,
businessMessageForwardInfo: {
businessOwnerJid: '50582340051@s.whatsapp.net',
},
forwardedNewsletterMessageInfo: {
newsletterJid: '120363296103096943@newsletter',
serverMessageId: null,
newsletterName: `𝑴𝒊𝒄𝒂𝑺𝒉𝒂𝒅𝒆 ${SetEmoji[userSender] || SetEmoji.default}`
},
externalAdReply: {
title: `𝑴𝒊𝒄𝒂𝑺𝒉𝒂𝒅𝒆 ${SetEmoji[userSender] || SetEmoji.default}`,
body: null,
mediaType: 1,
previewType: 0,
showAdAttribution: false,
renderLargerThumbnail: true,
thumbnailUrl: menuImage,
sourceUrl: 'https://whatsapp.com/channel/0029VadxAUkKLaHjPfS1vP36'
}
}
}, { quoted: m });
break;
}
case 'modopv': {
if (!isCreator) return m.reply(`${SetEmoji[userSender] || SetEmoji.default} Solo el creador puede usar este comando.`);

global.publicMode = false;
config.publicMode = false;
saveConfig(config);

m.reply(`${SetEmoji[userSender] || SetEmoji.default} Modo privado activado. Solo responderé al propietario.`);
break;
}

case 'modopc': {
if (!isCreator) return m.reply(`${SetEmoji[userSender] || SetEmoji.default} Solo el creador puede usar este comando.`);

global.publicMode = true;
config.publicMode = true;
saveConfig(config);

m.reply(`${SetEmoji[userSender] || SetEmoji.default} Modo público activado. Responderé a todos.`);
break;
}
case 'pinterest': {
    if (!text) return m.reply(`${SetEmoji[userSender] || SetEmoji.default} Ingresa una palabra clave para buscar imágenes en Pinterest`);

    let apiUrl = `https://api.dorratz.com/v2/pinterest?q=${encodeURIComponent(text)}`;

    try {
        let response = await fetch(apiUrl);
        let json = await response.json();

        if (!json || json.length === 0) {
            return m.reply(`${SetEmoji[userSender] || SetEmoji.default} No se encontraron imágenes para "${text}".`);
        }

        let images = json.map(item => ({
            type: "image",
            data: { url: item.image }
        }));

        await conn.sendAlbumMessage(m.chat, images);

    } catch (err) {
        m.reply(`${SetEmoji[userSender] || SetEmoji.default} Hubo un error al obtener las imágenes.`);
    }
    break;
}
case 'tiktok': 
case 'tt': {
if (!text) return m.reply(`${SetEmoji[userSender] || SetEmoji.default} Ingresa un enlace de TikTok válido`);
if (!text.includes('tiktok.com')) return m.reply(`${SetEmoji[userSender] || SetEmoji.default} El enlace proporcionado no es válido.`);

let apiUrl = `https://eliasar-yt-api.vercel.app/api/download/tiktok?query=${encodeURIComponent(text)}`;

try {
let response = await fetch(apiUrl);
let json = await response.json();

if (!json.status || !json.results || !json.results.video.noWatermark) 
return m.reply(`${SetEmoji[userSender] || SetEmoji.default} No se pudo obtener el video. Verifica el enlace.`);

let videoUrl = json.results.video.noWatermark;
let audioUrl = json.results.music.playUrl;
let author = json.results.author;
let stats = json.results.stats;

let caption = `${SetEmoji[userSender] || SetEmoji.default} *TikTok Video*\n\n🔹 *Título:* ${json.results.title}\n🔹 *Creador:* ${author.authorName} (@${author.authorUniqueId})\n🔹 *Fecha:* ${json.results.created_at}\n🔹 *Reproducciones:* ${stats.playCount}\n🔹 *Me gusta:* ${stats.likeCount}\n🔹 *Comentarios:* ${stats.commentCount}\n🔹 *Compartidos:* ${stats.shareCount}\n🔹 *Guardados:* ${stats.saveCount}`;

await conn.sendMessage(m.chat, { video: { url: videoUrl }, mimetype: 'video/mp4', caption }, { quoted: m });
await conn.sendMessage(m.chat, { audio: { url: audioUrl }, mimetype: 'audio/mp4', ptt: false }, { quoted: m });

} catch (err) {
console.error(err);
m.reply(`${SetEmoji[userSender] || SetEmoji.default} Hubo un error al obtener el video.`);
}
break;
}
case 'spotify':
case 'music': {
if (!text) return m.reply(`${SetEmoji[userSender] || SetEmoji.default} Ingresa el nombre de la canción.`)

try {
let search = await fetch(`https://api.vreden.my.id/api/spotifysearch?query=${encodeURIComponent(text)}`)
let data = await search.json()

if (data.status !== 200 || !data.result.length) {
return m.reply(`${SetEmoji[userSender] || SetEmoji.default} No encontré resultados.`)
}

let song = data.result[Math.floor(Math.random() * data.result.length)]

let caption = `
${SetEmoji[userSender] || SetEmoji.default} Título: ${song.title}
Artista: ${song.artist}
Álbum: ${song.album}
Duración: ${song.duration}
Popularidad: ${song.popularity}
Lanzamiento: ${song.releaseDate}
Link _(${song.spotifyLink})_`

await conn.sendMessage(m.chat, {
image: { url: song.coverArt },
caption: caption
}, { quoted: m })

let download = await fetch(`https://api.vreden.my.id/api/spotify?url=${encodeURIComponent(song.spotifyLink)}`)
let songData = await download.json()

if (!songData.result || !songData.result.music) {
return m.reply(`${SetEmoji[userSender] || SetEmoji.default} No pude descargar la canción.`)
}

await conn.sendMessage(m.chat, {
audio: { url: songData.result.music },
mimetype: 'audio/mpeg',
fileName: `${song.title}.mp3`,
ptt: false
}, { quoted: m })

} catch (err) {
console.error(err)
m.reply(`${SetEmoji[userSender] || SetEmoji.default} Error al obtener la música.`)
}
break
}
case 'fb': 
case 'facebook': {
if (!text) return m.reply(`${SetEmoji[userSender] || SetEmoji.default} Ingresa un enlace de Facebook válido`);

if (!text.includes('facebook.com') && !text.includes('fb.watch')) {
return m.reply(`${SetEmoji[userSender] || SetEmoji.default} El enlace proporcionado no es válido.`);
}

let apiUrl = `https://eliasar-yt-api.vercel.app/api/facebookdl?link=${encodeURIComponent(text)}`;

try {
let response = await fetch(apiUrl);
let json = await response.json();

if (!json.status || !json.data || json.data.length === 0) {
return m.reply(`${SetEmoji[userSender] || SetEmoji.default} No se pudo obtener el video. Verifica el enlace.`);
}

let videoUrl = json.data[0].url;
let caption = `${SetEmoji[userSender] || SetEmoji.default} *Facebook Video*\n\n🔹 *Calidad:* 720p`;

await conn.sendMessage(m.chat, { video: { url: videoUrl }, mimetype: 'video/mp4', caption }, { quoted: m });

} catch (err) {
console.error(err);
m.reply(`${SetEmoji[userSender] || SetEmoji.default} Hubo un error al obtener el video.`);
}
break;
}
case 'ig': {
if (!text) return m.reply(`${SetEmoji[userSender] || SetEmoji.default} Ingresa un enlace de Instagram válido`);

if (!text.includes('instagram.com')) {
return m.reply(`${SetEmoji[userSender] || SetEmoji.default} El enlace proporcionado no es válido.`);
}

let apiUrl = `https://api.dorratz.com/igdl?url=${encodeURIComponent(text)}`;

try {
let response = await fetch(apiUrl);
let json = await response.json();

if (!json.data || json.data.length === 0) {
return m.reply(`${SetEmoji[userSender] || SetEmoji.default} No se pudo obtener el video. Verifica el enlace.`);
}

let videoUrl = json.data[0].url;
let thumbnail = json.data[0].thumbnail;

let caption = `${SetEmoji[userSender] || SetEmoji.default} Aquí tienes tu video de Instagram`;

await conn.sendMessage(m.chat, { video: { url: videoUrl }, mimetype: 'video/mp4', caption }, { quoted: m });

} catch (err) {
console.error(err);
m.reply(`${SetEmoji[userSender] || SetEmoji.default} Hubo un error al obtener el video.`);
}
break;
}
case 'rvo': {
if (!m.quoted) return m.reply(`${SetEmoji[userSender] || SetEmoji.default} Responde a un mensaje de una vista junto al mismo comando.`);

const quotedMsg = m.quoted.fakeObj?.message;
let mediaType = null;
let mediaMessage = null;

if (quotedMsg?.imageMessage?.viewOnce) {
mediaType = "image";
mediaMessage = quotedMsg.imageMessage;
} else if (quotedMsg?.videoMessage?.viewOnce) {
mediaType = "video";
mediaMessage = quotedMsg.videoMessage;
} else if (quotedMsg?.audioMessage?.viewOnce) {
mediaType = "audio";
mediaMessage = quotedMsg.audioMessage;
}

if (mediaType) {
delete mediaMessage.viewOnce;

const caption = m.quoted?.caption || mediaMessage?.caption;
let contextInfo = { isForwarded: false };
if (caption) {
contextInfo.mentionedJid = (caption);
}

return conn.sendMessage(m.chat, { forward: m.quoted.fakeObj, contextInfo: contextInfo }, { quoted: m });
} else {
return m.reply(`${SetEmoji[userSender] || SetEmoji.default} Este no es un mensaje de una vista.`);
}
}
break;

case 'ava': {
let number = text.replace(/\D/g, '');
let member = null;

if (text) {
member = number + '@s.whatsapp.net';
} else if (m.quoted?.sender) {
member = m.quoted.sender;
} else if (m.mentionedJid?.length > 0) {
member = m.mentionedJid[0];
} else {
return m.reply(`${SetEmoji[userSender] || SetEmoji.default} Debes escribir un número, mencionar a alguien o responder a un mensaje.`, m);
}

try {
let onWhatsapp = await conn.onWhatsApp(member);
if (!onWhatsapp || !onWhatsapp.length) {
return m.reply(`${SetEmoji[userSender] || SetEmoji.default} El número no está registrado en WhatsApp.`, m);
}

let pic;
try {
pic = await conn.profilePictureUrl(member, 'image');
} catch {
pic = null;
}

if (!pic) {
return m.reply(`${SetEmoji[userSender] || SetEmoji.default} Él/Ella no tiene foto de perfil o la tiene privada.`, m);
}

await conn.sendMessage(m.chat, {
image: { url: pic },
caption: `${SetEmoji[userSender] || SetEmoji.default} Aquí está la foto de perfil solicitada.`
}, { quoted: m });

} catch (err) {
console.error(err);
m.reply(`${SetEmoji[userSender] || SetEmoji.default} Hubo un error al obtener la foto de perfil.`, m);
}
break;
}

case 'kick': 
case 'echar': 
case 'sacar': 
case 'expulsar': {
if (!m.isGroup) return m.reply(`${SetEmoji[userSender] || SetEmoji.default} Este comando solo funciona en grupos`);
if (!isGroupAdmins) return m.reply(`${SetEmoji[userSender] || SetEmoji.default} Solo los administradores pueden usar este comando`);
if (!isBotAdmins) return m.reply(`${SetEmoji[userSender] || SetEmoji.default} Necesito ser administrador para expulsar miembros`);

let userToKick = m.mentionedJid[0] || (text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null);
if (!userToKick && m.quoted && m.quoted.sender) {
userToKick = m.quoted.sender;
}

if (!userToKick) return m.reply(`${SetEmoji[userSender] || SetEmoji.default} Menciona a un usuario, proporciona su número o responde a un mensaje`);

try {
await conn.groupParticipantsUpdate(m.chat, [userToKick], 'remove');
m.reply(`${SetEmoji[userSender] || SetEmoji.default} Usuario expulsado correctamente`);
} catch (e) {
m.reply(`${SetEmoji[userSender] || SetEmoji.default} No se pudo expulsar al usuario`);
}
break;
}

case 'link': 
case 'gruplink': 
case 'invitelink': {
if (!m.isGroup) return m.reply(`${SetEmoji[userSender] || SetEmoji.default} Este comando solo funciona en grupos`);
if (!isBotAdmins) return m.reply(`${SetEmoji[userSender] || SetEmoji.default} Necesito ser administrador para obtener el enlace del grupo`);

try {
let inviteCode = await conn.groupInviteCode(m.chat);
let groupLink = `https://chat.whatsapp.com/${inviteCode}`;
m.reply(`${SetEmoji[userSender] || SetEmoji.default} Aquí está el enlace del grupo:\n${groupLink}`);
} catch (e) {
m.reply(`${SetEmoji[userSender] || SetEmoji.default} No pude obtener el enlace del grupo`);
}
break;
}
case 'tag': 
case 'everyone': 
case 'tagall': {
if (!m.isGroup) return m.reply(`${SetEmoji[userSender] || SetEmoji.default} Este comando solo funciona en grupos`);
if (!isGroupAdmins && !isOwner) return m.reply(`${SetEmoji[userSender] || SetEmoji.default} Solo los administradores o el owner pueden usar este comando`);

if (!args.length) return m.reply(`${SetEmoji[userSender] || SetEmoji.default} Debes escribir un mensaje para etiquetar a todos`);

let mensaje = args.join(" ");    
let mentionsArray = participants.map(u => u.id);

conn.sendMessage(m.chat, { 
text: mensaje,
mentions: mentionsArray
}, { quoted: m });

break;
}
case 's': case 'sticker': {
const d = new Date(new Date() + 3600000);
const locale = 'es-ES';
const dias = d.toLocaleDateString(locale, { weekday: 'long' });
const fecha = d.toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' });

let authorInfo = `{
"developer": "by EliasarYT",
"usuario": "${pushname}",
"fecha": "${fecha}",
"día": "${dias}"
}`;

if (/image/.test(mime)) {  
media = await quoted.download();
let encmedia = await conn.sendImageAsSticker(m.chat, media, m, { 
packname: "", 
author: authorInfo, 
contextInfo: { 
forwardedNewsletterMessageInfo: { 
newsletterJid: '120363160031023229@newsletter', 
serverMessageId: '', 
newsletterName: 'INFINITY-WA 💫' 
}, 
forwardingScore: 9999999,  
isForwarded: true, 
externalAdReply: { 
showAdAttribution: false, 
title: `𝑴𝒊𝒄𝒂𝑺𝒉𝒂𝒅𝒆 ${SetEmoji[userSender] || SetEmoji.default}`, 
mediaType: 2, 
sourceUrl: 'https://whatsapp.com/channel/0029VadxAUkKLaHjPfS1vP36', 
thumbnailUrl: FotosMenu[userSender] || FotosMenu.default
} 
} 
});
await fs.unlinkSync(encmedia);
} else if (/video/.test(mime)) {  
if ((quoted.msg || quoted).seconds > 20) return m.reply(lenguaje.sticker.text1);
media = await quoted.download();
let encmedia = await conn.sendVideoAsSticker(m.chat, media, m, { 
packname: "", 
author: authorInfo, 
contextInfo: { 
forwardedNewsletterMessageInfo: { 
newsletterJid: '120363160031023229@newsletter', 
serverMessageId: '', 
newsletterName: 'INFINITY-WA 💫' 
}, 
forwardingScore: 9999999,  
isForwarded: true, 
externalAdReply: { 
showAdAttribution: false, 
title: `𝑴𝒊𝒄𝒂𝑺𝒉𝒂𝒅𝒆 ${SetEmoji[userSender] || SetEmoji.default}`, 
mediaType: 2, 
sourceUrl: 'https://whatsapp.com/channel/0029VadxAUkKLaHjPfS1vP36', 
thumbnailUrl: FotosMenu[userSender] || FotosMenu.default
} 
} 
});
await new Promise((resolve) => setTimeout(resolve, 2000));
await fs.unlinkSync(encmedia);
} else {  
m.reply(`*${SetEmoji[userSender] || SetEmoji.default} ¿Y la imagen?*`);
}
break;
}
}
}

//•━━━『 UPDATE DEL ARCHIVO 』━━━━•     
let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(chalk.redBright(`Update ${__filename}`))
delete require.cache[file]
require(file)
})
