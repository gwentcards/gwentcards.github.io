const https = require('https');
const parser = require('./cards-csv-parser');

parser.readCardsCsv(data => {
    for (const row of data) {
        const name = row.name;

        const underscored = name.replace(/\(\d of \d\)/, '').trim().replace(/ /g, '_');
        const wiki = `https://witcher.fandom.com/wiki/${underscored}_(gwent_card)`;

        https.request(wiki, {method: 'HEAD'}, r => {
            if (r.statusCode !== 200) {
                console.error(`${r.statusCode} ${name} ${wiki}`);
            }
        }).on('error', err => { // Handle errors
            console.error(`Error ${name} ${wiki}`, err);
        }).end();
    }
    console.log(`Check of ${data.length} Wiki links initiated`)
});
