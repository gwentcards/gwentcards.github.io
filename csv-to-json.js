const fs = require('fs');

fs.readFile('cards.csv', 'utf8', (err, data) => {
    console.log('Reading cards.csv');
    if (err) {
        console.error('Error reading cards.csv', err);
        return;
    }

    const lines = data.replace('\r\n', '\n').replace('\r', '\n').split('\n').slice(1);
    console.log(`Parsing ${lines.length} lines`);

    const arr = [];
    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.length === 0) {
            continue;
        }
        const cols = trimmed.split(',');
        const [deck, territory, name, location] = cols;
        let details = cols.slice(4).join(',').slice(0, -1);
        if (details.startsWith("\"") && details.endsWith("\"")) {
            details = details.slice(1, -1);
        }

        arr.push({deck, territory, name, location, details});
    }
    console.log(`Parsed ${arr.length} rows`);

    fs.writeFile('cards.json', JSON.stringify(arr, null, 2), err => {
        if (err) {
            console.error('Unable to write JSON data to cards.json', err);
        } else {
            console.log('Wrote JSON data to cards.json');
        }
    });
});
