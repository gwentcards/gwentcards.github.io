# The Witcher 3 Gwent cards checklist
Hosted here: https://gwentcards.github.io/

A checklist webapp for Gwent cards in The Witcher 3. The collected cards are stored in the URL in the address bar, for
easy portability.

## Development tools
* Generate the `cards.json` from `cards.csv`: `npm run generate-json`
* Download pictures from the Wiki: `npm run download-pictures`
* Check card names and see if Wiki articles exist: `npm run check-wiki-links`
* Start locally: `npm run start`
* Create a production build: `npm run build`
* Deploy to GitHub Pages: `npm run deploy`

### Full steps to run locally
* Install NodeJS and NPM, e.g. using nvm: https://github.com/nvm-sh/nvm
* In this project's directory, run the following:
  * `npm run generate-json`
  * `npm run download-pictures`
  * `npm run start`

This should generate `public/cards.json` which is used by the application from `cards.csv`. Then it will download
pictures of all the cards using the URLs in `cards.csv`. Finally it will start a local development server.

You can open the page on http://localhost:3000/

Card data is edited only in `cards.csv`. Don't forget to rn `npm run generate-json` to update the `public/cards.json`
each time after making changes, before checking them locally.

### Full steps to deploy
Assuming running locally is set up (see previous section), the `public/cards.json` is generated and all pictures are
downloaded.

* `npm run build`
* `npm run deploy`

This will first create a production-optimized build of the website. Then it will deploy it to GitHub pages, into the
`master` branch. To see the changes on https://gwentcards.github.io/ you need to force refresh (e.g. ctrl+refresh or
ctrl+F5).
