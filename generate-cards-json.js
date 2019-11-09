const fs = require('fs');
const sha1 = require('js-sha1');
const Papa = require('papaparse');

try {
    fs.mkdirSync('src/data/');
} catch (err) {
    if (err.code !== 'EEXIST') { throw err }
}

fs.readFile('cards.csv', 'utf8', (err, data) => {
    console.log('Reading cards.csv');
    if (err) {
        console.error('Error reading cards.csv', err);
        return;
    }

    const results = Papa.parse(data, {
        header: false,
        delimiter: ',',
        skipEmptyLines: true
    });

    if (results.errors && results.errors.length > 0) {
        console.log(`Encountered ${results.errors.length} errors during CSV parsing:`);
        for (const error of results.errors) {
            console.log('    ', error);
        }
        return;
    }

    console.log(`Parsed ${results.data.length} CSV rows; metadata:`, results.meta);


    const arr = [];
    var header = true;
    for (const row of results.data) {
        if (header) {
            // skip header
            header = false;
            continue;
        }
        const [deck, territory, name, type, details, picture] = row;

        arr.push({deck: deck.trim(), territory: territory.trim(), name: name.trim(), type: type.trim(), details: details.trim(), picture: sha1(picture.trim()) + '.png'});

    }

    console.log(`Processed ${arr.length} rows`);

    arr.sort((a, b) => a.name.localeCompare(b.name));

    const json = JSON.stringify({cards: arr}, null, 2);
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
