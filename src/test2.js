const fs = require('fs');
const https = require('https');
const { promisify } = require('util');
const stat = promisify(fs.stat);

// const readFile = promisify(fs.readFile);

function urlToImgFn(src, cb) {
    const ws = fs.createWriteStream('test.mp4');
    https.get(src, res => {
        res.pipe(ws).on('finish', async () => {
            const stats = await stat('test.mp4');
            cb(null, stats.size);
        });
    });
}

const urlToImg = promisify(urlToImgFn);

(async () => {
    const res = await urlToImg('https://cv.phncdn.com/videos/201810/28/189527071/720P_1500K_189527071.mp4?ejxkuXOqsKd0b5wn7C8zlkPdrz4GN2BXd14ATW3a_t1yrHEAdDC_hb0EJCXpVpOB1AB0hdD-BsXIw6RY3eFN0qTJxGioao05IdP3jAwqKQBeNmlieAL7IGycTwKypqMv8cqGsFNBehMq6Yy2kzmG0tt22Y357y0gEGu_LwykCTsOc7LaqBiDy2-r5hFP69wn4KV_lFkFrPE');
    console.info(res);
})();