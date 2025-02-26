const fs = require('fs');
const path = require('path');
const { en, es, ar, id, pt, rs } = require('./libs/idiomas/total-idiomas.js');

const configPath = __dirname + '/config.json';

const loadConfig = () => {
  try {
    const config = JSON.parse(require('fs').readFileSync(configPath, 'utf-8'));
    return config.owner || [];
  } catch {
    return [];
  }
};

global.owner = loadConfig();

require('fs').watch(configPath, (eventType) => {
  if (eventType === 'change') {
    global.owner = loadConfig();
  }
});

global.mods = []
global.premium = []  
global.blockList = []  

//Nombre del bot | versión
global.botname = "?? ?????????"
global.vs = '1.0.0'

//Función beta : escribe el número que quiere que sea bot para que mande el Código de 8 digitos
global.botNumberCode = "" //Ejemplo: +59309090909
global.phoneNumber = ""

//---------[ FECHA/IDIOMAS ]---------
global.place = 'America/Bogota' // Aquí puedes encontrar tu ubicación https://momentjs.com/timezone/
global.lenguaje = es //Predeterminado en idioma Español 
global.prefix = [`*`]

//---------[ APIS GLOBAL ]---------
global.keysZens = ['LuOlangNgentot', 'c2459db922', '37CC845916', '6fb0eff124', 'hdiiofficial', 'fiktod', 'BF39D349845E', '675e34de8a', '0b917b905e6f']; 
global.keysxxx = keysZens[Math.floor(keysZens.length * Math.random())]; 
global.keysxteammm = ['29d4b59a4aa687ca', '5LTV57azwaid7dXfz5fzJu', 'cb15ed422c71a2fb', '5bd33b276d41d6b4', 'HIRO', 'kurrxd09', 'ebb6251cc00f9c63']; 
global.keysxteam = keysxteammm[Math.floor(keysxteammm.length * Math.random())]; 
global.keysneoxrrr = ['5VC9rvNx', 'cfALv5']; 
global.keysneoxr = keysneoxrrr[Math.floor(keysneoxrrr.length * Math.random())]; 
global.lolkeysapi = ['GataDios']; // ['BrunoSobrino_2'] 
global.itsrose = ['4b146102c4d500809da9d1ff'];
global.API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({...query, ...(apikeyqueryname ? {[apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name]} : {})})) : '');

global.APIs = {
//ApiEmpire: 'https://',
CFROSAPI: 'https://api.cafirexos.com',
nrtm: 'https://fg-nrtm.ddns.net',
fgmods: 'https://api.fgmods.xyz', 
xteam: 'https://api.xteam.xyz',
dzx: 'https://api.dhamzxploit.my.id',
lol: 'https://api.lolhuman.xyz',
neoxr: 'https://api.neoxr.my.id',
zenzapis: 'https://api.zahwazein.xyz',
akuari: 'https://api.akuari.my.id',
akuari2: 'https://apimu.my.id',
botcahx: 'https://api.botcahx.biz.id',
ibeng: 'https://api.ibeng.tech/docs',
rose: 'https://api.itsrose.site',
popcat: 'https://api.popcat.xyz',
xcoders: 'https://api-xcoders.site',
vihangayt: 'https://vihangayt.me',
erdwpe: 'https://api.erdwpe.com',
xyroinee: 'https://api.xyroinee.xyz',
nekobot: 'https://nekobot.xyz'
},
global.APIKeys = {
'https://api.xteam.xyz': `${keysxteam}`,
'https://api.lolhuman.xyz': 'GataDios',
'https://api.neoxr.my.id': `${keysneoxr}`,
'https://api.zahwazein.xyz': `${keysxxx}`,
'https://api.fgmods.xyz': 'DRLg5kY7', 
'https://api-fgmods.ddns.net': 'fg-dylux',
'https://api.botcahx.biz.id': 'Admin',
'https://api.ibeng.tech/docs': 'tamvan',
'https://api.itsrose.site': 'Rs-Zeltoria',
'https://api-xcoders.site': 'Frieren',
'https://api.xyroinee.xyz': 'uwgflzFEh6'
};

//---------[ STICKERS ]---------
global.packname = "ɪɴғɪɴɪᴛʏʙᴏ�?-ᴍᴅ"
global.author = `${vs}`

//almacéna imagen url o el carpeta:
//global.imagen1 = fs.readFileSync('./[Direcion donde se encuentra la imagen]')
global.imagen1 = 'https://qu.ax/TPhh.jpg'

//Enlace | cuenta oficiales
global.md = 'https://github.com/elrebelde21/InfinityBot-MD'
global.yt = 'https://www.youtube.com/@elrebelde.21'
global.fb = 'https://www.facebook.com/elrebelde21'
global.faceb =  'https://www.facebook.com/groups/872989990425789/'
global.paypal = 'https://paypal.me/OfcGB' 
global.panel = 'https://live.panel-infinitywa.store'
global.dash = 'https://dashboard.infinitywa.xyz'

global.host = 'https://chat.whatsapp.com/GQ82mPnSYnm0XL2hLPk7FV' //Infinity-host 
global.nna = 'https://whatsapp.com/channel/0029Va4QjH7DeON0ePwzjS1A'
global.nn = 'https://chat.whatsapp.com/GQ82mPnSYnm0XL2hLPk7FV'
global.nn6 = 'https://chat.whatsapp.com/GI6EfsV1zIMHryC6m0yyX4'
//---------[ INFO ]--------- 

let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    const fileName = path.basename(file)
    console.log(chalk.greenBright.bold(`Update '${fileName}'.`))
    delete require.cache[file]
    require(file)
})
