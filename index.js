const puppeteer = require('puppeteer');
const fmt = require('./helpers/node-colors.js');

(async () => {
    let municipalities = await getMadeiraMunicipalities();
    let nif = await getNif();

    console.log(fmt.format('info'), 'Municipalities');

    console.log(fmt.format('info', 1), 'municipalities', municipalities);
    console.log(fmt.format('info', 1), 'nif', nif);
})();


async function getMadeiraMunicipalities() {
    const ulr = 'https://pt.wikipedia.org/wiki/Lista_de_freguesias_da_Madeira';

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(ulr);
    // await page.screenshot({path: 'example.png'});
    // const html = await page.content();

    let municipios = await page.evaluate(processMunicipalities);

    await browser.close();
    return municipios;
}


function processMunicipalities() {
    let municipalities = [ // municipios
        ...document.querySelectorAll('.thumbinner .thumbcaption .legend')
    ].map((nodeMunicipalitie) => (
        {
            municipalitieName: nodeMunicipalitie.innerText.trim(),
            parishes: [],
        }
    ))

    const parishes = [ // freguesias
        ...document.querySelectorAll('table.prettytable tbody tr:not(:first-child)')
    ].map((nodeParish) => (
        {
            parishes: nodeParish.querySelector('td:nth-child(1)').innerText.trim(),
            municipalitie: nodeParish.querySelector('td:nth-child(2)').innerText.trim(),
        }
    ))

    municipalities.forEach(function(municipalitie) {
        parishes.forEach(function(parish) {
            if (parish.municipalitie.localeCompare(municipalitie.municipalitieName) === 0) {
                municipalitie.parishes.push(parish.parishes)
            }
        })
    });

    return municipalities;
}

async function getNif() {
    const ulr = 'https://nif.marcosantos.me/';

    const browser = await puppeteer.launch(
        {
            // headless: false,
            // slowMo: 250, // slow down by 250ms
            // devtools: true,
        }
    );
    const page = await browser.newPage();
    await page.goto(ulr);

    let nif = await page.evaluate(processNifPage);
    await browser.close();
    return nif;
}

function processNifPage() {
    let nif = document.querySelector('#nif').innerText.trim();
    return nif;
}
