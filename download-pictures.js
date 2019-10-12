const fs = require('fs');
const https = require('https');
const sha1 = require('js-sha1');

try {
    fs.mkdirSync('public/pictures/');
} catch (err) {
    if (err.code !== 'EEXIST') { throw err }
}

fs.readFile('cards.txt', 'utf8', (err, data) => {
    console.log('Reading cards.txt');
    if (err) {
        console.error('Error reading cards.txt', err);
        return;
    }

    const lines = data.replace('\r\n', '\n').replace('\r', '\n').split('\n').slice(1);
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
        const [, , , , , picture] = cols;
        const filename = `public/pictures/${sha1(picture.trim())}.png`;

        console.log(`[${i}/${lines.length}] Downloading ${picture} to ${filename}`);

        const file = fs.createWriteStream(filename);
        https.get(picture, response => {
            response.pipe(file);
            file.on('finish', () => file.close());
        }).on('error', err => { // Handle errors
            console.error(`Error downloading ${picture}`, err);
            fs.unlink(filename); // Delete the file async. (But we don't check the result)
        });
    }
    console.log('Finished downloading pictures')
});
