const pup = require('puppeteer');

const url = "https://www.mercadolivre.com.br/"
const searchFor = "macbook";

let c = 1;

const list = [];

(async () =>{
    const browser = await pup.launch({headless: true});
    const page = await browser.newPage();


    await page.goto(url);
 

    await page.waitForSelector('#cb1-edit')

    await page.type('#cb1-edit', searchFor)

    await Promise.all([
        page.waitForNavigation(),
        page.click('.nav-search-btn')
    ])

    const links = await page.$$eval('.ui-search-result__image > a', e => e.map(link => link.href))

    for(let link of links){
        if(c===5) continue

        await page.goto(link);
        await page.waitForSelector('.ui-pdp-title');

        const title = await page.$eval('.ui-pdp-title', element => element.innerText);
        const price = await page.$eval('.andes-money-amount__fraction', element => element.innerText);

        const seller = await page.evaluate(() => {
            const el = document.querySelector('.ui-pdp-seller__link-trigger');
            if(!el) return null
            return el.innerText
        })

        const obj = {};
        obj.title = title;
        obj.price = price;
        (seller ? obj.seller = seller : 'n/d');
        obj.link = link

        list.push(obj);

        c++;
    }

    console.log(list)
  

    await page.waitForTimeout(2000)

    await browser.close();
})();