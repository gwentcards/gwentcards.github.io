const fs = require('fs');
const sha1 = require('js-sha1');

try {
    fs.mkdirSync('src/data/');
} catch (err) {
    if (err.code !== 'EEXIST') { throw err }
}

fs.readFile('cards.txt', 'utf8', (err, data) => {
    console.log('Reading cards.txt');
    if (err) {
        console.error('Error reading cards.txt', err);
        return;
    }

    const lines = data.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n').slice(1);
    console.log(`Parsing ${lines.length} lines`);

    const arr = [];
    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.length === 0) {
            // Skip header
            continue;
        }
        const cols = trimmed.split('\t');
        let [deck, territory, name, type, details, picture] = cols;
        if (details.startsWith('\"') && details.endsWith('\"')) {
            details = details.slice(1, -1)
        }

        arr.push({deck: deck.trim(), territory: territory.trim(), name: name.trim(), type: type.trim(), details: details.trim(), picture: sha1(picture.trim()) + '.png'});
    }
    console.log(`Parsed ${arr.length} rows`);

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
