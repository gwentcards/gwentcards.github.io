const fs = require('fs');
const parser = require('./cards-csv-parser');

try {
    fs.mkdirSync('src/data/');
} catch (err) {
    if (err.code !== 'EEXIST') { throw err }
}

parser.readCardsCsv(data => {
    const arr = [];
    for (const row of data) {
        arr.push({
            expansion: row.expansion,
            deck: row.deck,
            territory: row.territory,
            name: row.name,
            type: row.type,
            details: row.details,
            picture: row.pictureTarget
        });
    }

    const json = JSON.stringify({ cards: arr }, null, 2);
    fs.writeFile('src/data/cards.json', json, err => {
        if (err) {
            console.error('Unable to write JSON data to src/data/cards.json', err);
        } else {
            console.log('Wrote JSON data to src/data/cards.json, now writing to public/cards.json');
            fs.writeFile('public/cards.json', json, err => {
                if (err) {
                    console.error('Unable to write JSON data to public/cards.json', err);
                } else {
                    console.log('Wrote JSON data to public/cards.json');
                }
            });
        }
    });
});
