const puppeteer = require('puppeteer');
const conf = require('./config/default-config');
const { saveImg } = require('./helper/save-resource');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://image.baidu.com/');
    console.info('go to https://image.baidu.com/');

    await page.setViewport({
        width: 1920,
        height: 1080
    });
    console.info('reset viewport');

    await page.focus('#kw');
    await page.keyboard.sendCharacter('扁平');
    await page.click('.s_search');
    console.info('go to search list');

    page.on('load', async () => {
        console.info('load list done, start fetch.....');
        const srcs = await page.$$eval('img.main_img', imgs => imgs.map(img => img.src));
        // const srcs = await page.evaluate(() => {
        //     const images = document.querySelectorAll('img.main_img');
        //     return Array.prototype.map.call(images, img => img.src);
        // });

        srcs.forEach(src => {
            saveImg(conf.resourcePath, src);
        });
        console.info(srcs.length);
    });
})();