const fs = require('fs');
const https = require('https');
const parser = require('./cards-csv-parser');

try {
    fs.mkdirSync('public/pictures/');
} catch (err) {
    if (err.code !== 'EEXIST') { throw err }
}

parser.readCardsCsv(data => {
    for (const row of data) {
        const pictureSource = row.pictureSource;
        const pictureTarget = row.pictureTarget;
        const filename = `public/pictures/${pictureTarget}`;

        console.log(`[${i}/${lines.length}] Downloading ${pictureSource} to ${filename}`);

        const file = fs.createWriteStream(filename);
        https.get(pictureSource, response => {
            response.pipe(file);
            file.on('finish', () => file.close());
        }).on('error', err => { // Handle errors
            console.error(`Error downloading ${picture}`, err);
            fs.unlink(filename); // Delete the file async. (But we don't check the result)
        });
    }
    console.log(`Download of ${data.length} pictures initiated`)
});
