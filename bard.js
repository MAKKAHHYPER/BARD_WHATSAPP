var fs = require("fs");
const qrcode = require("qrcode-terminal");
const { Client, LocalAuth, MessageMedia, List } = require("whatsapp-web.js");

const pt = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
pt.use(StealthPlugin());

//CHECKING FOR SAVED AUTHENTICATION OR LOGIN OPTION
const client = new Client({
  authStrategy: new LocalAuth(),
});

client.initialize();

//GENERATE QR CODE
client.on("qr", (qr) => {
//QR CODE SHOW IN CMD
  qrcode.generate(qr, { small: true }); 
 
});
//AUTHENTICATION MESSAGE
client.on("authenticated", () => {
  console.log("WHATSAPP LOGIN SUCCESSFULLY");
});
//READY MESSAGE
client.on("ready", () => {
  console.log("THE BOT SYSTEM IS READY !");
});



async function selectorFunTextXpath() {
	
	//launch browser in headless mode
    const browser = await pt.launch({
        headless: 'new',
        args: [
            '--no-sandbox', // disable sandbox mode
            '--disable-setuid-sandbox',
            '--disable-infobars', // disable info bars
            '--disable-web-security', // disable web security
            '--disable-extensions', // disable extensions
            '--disable-dev-shm-usage', // disable dev shm usage
            '--disable-accelerated-2d-canvas', // disable 2d canvas acceleration
            '--disable-gpu', // disable GPU
        ],
    })

    //browser new page
    const page = await browser.newPage()
    //launch URL
    await page.goto('https://bard.google.com/?hl=en');

    const signin = (await page.$x("/html/body/header/div[2]/div[3]/div[1]/a"))[0];
    await signin.click();
    // username
    await page.waitForSelector("#identifierId");
    await page.type("#identifierId", "tharmad01");
    // Click the "Next" button.
    await page.click('#identifierNext');
    //password
    await page.waitForSelector('input[type="password"]', { visible: true });
    await page.type('input[type="password"]', 'Makkah@123');
    await page.click('div[id="passwordNext"]');
    console.log("BARD LOGIN SUCCESS");
//GET CLIENT MESSAGE
client.on("message", async (message) => {
    
	
	//SEND LIST MESSAGE
    if (message.body !== 'basil') {

        async function getValue() {
            const msg = await message.body;
            //type something in serach box
            await page.waitForSelector("#mat-input-0");
            await page.type("#mat-input-0", msg);
            //search button
            const button = await page.$('[aria-label="Send message"]');
            await button.click();
            


            async function getText() {
                //get text from div tag 
                const element = await page.waitForSelector('div.response-container-content');
                const text = await page.evaluate(element => element.textContent, element);
                const answer = await text;
                console.log("Replayed Success");
                client.sendMessage(message.from, answer);

                async function reset() {
                    const reset = (await page.$x("/html/body/chat-app/side-navigation/mat-sidenav-container/mat-sidenav/div/mat-nav-list/button[1]"))[0];
                    await reset.click();

                    async function yes() {
                        const yes = (await page.$x("/html/body/div[8]/div[2]/div/mat-dialog-container/div/div/message-dialog/mat-dialog-actions/button[2]"))[0];
                        await yes.click();
                    };

                    //wait untill answer reset yes appear finish
                    await page.waitForFunction(() => {
                        const body = document.querySelector('body');
                        return body && body.textContent.includes('Reset chat?');
                    }, { timeout: 30000000 });

                    yes();
                };
                reset();

            };


            //wait untill answer generate finish
            await page.waitForFunction(() => {
                const body = document.querySelector('body');
                return body && body.textContent.includes(' Google it ');
            }, { timeout: 30000000 });

            getText();

        };

        getValue();
    };

});

}
selectorFunTextXpath()