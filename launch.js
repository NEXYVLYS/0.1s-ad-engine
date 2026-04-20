const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const BRIGHT_DATA = {
    username: 'brd-customer-hl_66343536-zone-monitor_residential',
    password: 'qtp71woknf8q',
    host: 'brd.superproxy.io',
    port: '22225'
};

const PROXY_URL = `http://${BRIGHT_DATA.username}:${BRIGHT_DATA.password}@${BRIGHT_DATA.host}:${BRIGHT_DATA.port}`;
const COUNTRIES = ['us', 'gb', 'ca', 'au', 'de', 'ch', 'no', 'se', 'dk'];
const randomCountry = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];

async function launch() {
    console.log('[0.1s] Launching with Bright Data...');
    console.log(`[0.1s] Target country: ${randomCountry.toUpperCase()}`);
    
    const browser = await puppeteer.launch({
        headless: false,
        args: [
            `--proxy-server=${PROXY_URL}`,
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process',
            '--disable-blink-features=AutomationControlled',
            '--disable-background-timer-throttling',
            '--disable-renderer-backgrounding',
            '--disable-backgrounding-occluded-windows',
            '--disable-ipc-flooding-protection',
            '--disable-hang-monitor',
            '--disable-prompt-on-repost',
            '--disable-client-side-phishing-detection',
            '--disable-sync',
            '--disable-default-apps',
            '--disable-extensions',
            '--metrics-recording-only',
            '--mute-audio',
            '--no-default-browser-check',
            '--no-first-run',
            '--safebrowsing-disable-auto-update',
            '--window-size=1400,900',
            '--window-position=0,0'
        ],
        defaultViewport: { width: 1400, height: 900 },
        ignoreHTTPSErrors: true
    });
    
    const page = await browser.newPage();
    
    await page.authenticate({
        username: BRIGHT_DATA.username,
        password: BRIGHT_DATA.password
    });
    
    await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.google.com/'
    });
    
    const filePath = `file://${__dirname}/index.html`;
    console.log(`[0.1s] Loading: ${filePath}`);
    
    await page.goto(filePath, { waitUntil: 'networkidle2', timeout: 60000 });
    
    console.log('[0.1s] Engine loaded. Running indefinitely...');
    console.log('[0.1s] Press Ctrl+C to stop');
    
    setInterval(async () => {
        try {
            await page.evaluate(() => { window.scrollBy(0, 1); window.scrollBy(0, -1); });
        } catch (e) {}
    }, 5000);
    
    browser.on('disconnected', () => {
        console.log('[0.1s] Browser disconnected. Restarting in 10s...');
        setTimeout(launch, 10000);
    });
}

launch().catch(console.error);