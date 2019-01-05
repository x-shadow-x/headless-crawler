const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const { promisify } = require('util');
const writeFile = promisify(fs.writeFile);

module.exports = {
    saveImg: (src, dir) => {
        console.info(dir, src);
    }
};

function urlToImgFn(src, dir, cb) {
    const mod = /^https:/.test(src) ? https : http;
    const ext = path.extname(src);
    const filePath = path.join(dir, `${Date.now()}${ext}`);
    const ws = fs.createWriteStream(filePath);
    mod.get(src, res => {
        res.pipe(ws).on('finish', () => {
            cb();
        });
    });
}

async function base64ToImgFn(base64Str, dir) {
    const ext = base64Str.substring(0, base64Str.indexOf(';')).split('/')[1];
    const filePath = path.join(dir, `${Date.now()}${ext}`);
    const content = '';
    await writeFile(filePath, content, 'base64');
}

const urlToImg = promisify(urlToImgFn);
const base64ToImg = promisify(base64ToImgFn);