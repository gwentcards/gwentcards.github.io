const fs = require('fs');
const sha1 = require('js-sha1');
const Papa = require('papaparse');

module.exports.readCardsCsv = function(callback) {
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


        const rows = results.data
            .filter((row, idx) => idx > 0) // Skip header
            .map(row => {
                const [deck, territory, name, type, details, pictureUrl] = row;
                const pictureSource = pictureUrl.trim();
                const pictureTarget = sha1(pictureSource.trim()) + '.png';
                return {
                    deck: deck.trim(),
                    territory: territory.trim(),
                    name: name.trim(),
                    type: type.trim(),
                    details: details.trim(),
                    pictureSource,
                    pictureTarget
                };
            });

        console.log(`Processed ${rows.length} rows`);

        rows.sort((a, b) => a.name.localeCompare(b.name));

        callback(rows);
    });
};
