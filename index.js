const puppeteer = require('puppeteer');

(async () => {
    const ulr = 'https://pt.wikipedia.org/wiki/Lista_de_freguesias_da_Madeira';

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(ulr);
    // await page.screenshot({path: 'example.png'});
    const html = await page.content();

    let municipios = await page.evaluate(
        () => {
            let municipios = [ // municipios
                ...document.querySelectorAll('.thumbinner .thumbcaption .legend')
            ].map((nodeMunicipalitie) => (
                {
                    municipio: nodeMunicipalitie.innerText.trim(),
                    freguesias: [],
                }
            ))

            const freguesiasList = [ // freguesias
                ...document.querySelectorAll('table.prettytable tbody tr:not(:first-child)')
            ].map((nodeParish) => (
                {
                    freguesia: nodeParish.querySelector('td:nth-child(1)').innerText.trim(),
                    municipio: nodeParish.querySelector('td:nth-child(2)').innerText.trim(),
                }
            ))

            municipios.forEach(function(municipio) {
                freguesiasList.forEach(function(freg) {
                    if (freg.municipio.localeCompare(municipio.municipio) === 0) {
                        municipio.freguesias.push(freg.freguesia)
                    }
                })
            });

            return municipios;
        }
    );
    console.log(municipios);
    await browser.close();
})();
