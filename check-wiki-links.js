const fs = require('fs');
const https = require('https');

fs.readFile('cards.txt', 'utf8', (err, data) => {
    console.log('Reading cards.txt');
    if (err) {
        console.error('Error reading cards.txt', err);
        return;
    }

    const lines = data.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n').slice(1);
    console.log(`Parsing ${lines.length} lines`);

    let i = 0;
    for (const line of lines) {
        i++;
        const trimmed = line.trim();
        if (trimmed.length === 0) {
            // Skip header
            continue;
        }
        const cols = trimmed.split('\t');
        const [, , name, , , ] = cols;
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
    console.log('Check of all Wiki links initiated')
});
