const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const { promisify } = require('util');
const writeFile = promisify(fs.writeFile);
const stat = promisify(fs.stat);

module.exports = {
    saveImg: async (src, dir) => {
        if(/^https?:\/\//.test(src)) {
            const path = await urlToImg(src, dir);
            const stats = await stat(path);
            console.info(path, '-----', stats.size);
        } else {
            await base64ToImg(src, dir);
        }
    }
};

/**
 * 
 * @param {网络图连接} src 
 * @param {保存到本地的文件夹路径} dir 
 * @param {保存完毕后的回调，若无错误，将通过第二个参数返回保存资源后的本地文件路径} cb 
 */
function urlToImgFn(src, dir, cb) {
    const mod = /^https:/.test(src) ? https : http;
    const ext = path.extname(src);
    const filePath = path.join(dir, `${Date.now()}${ext}`);
    const ws = fs.createWriteStream(filePath);
    mod.get(src, res => {
        res.pipe(ws).on('finish', async () => {
            cb(null, filePath);
        });
    });
}

async function base64ToImgFn(base64Str, dir) {
    const matches = base64Str.match(/^data:image\/(.+?);base64,(.+)$/);
    try {
        const ext = matches[1];
        const content = matches[2];
        const filePath = path.join(dir, `${Date.now()}.${ext}`);
        await writeFile(filePath, content, 'base64');
    } catch (error) {
        console.error(error);
    }
}

const urlToImg = promisify(urlToImgFn);
const base64ToImg = promisify(base64ToImgFn);