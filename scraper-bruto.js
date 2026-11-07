const fs = require('node:fs/promises');
const puppeteer = require('puppeteer');
const TurndownService = require('turndown');

const CATEGORY_URL =
  'http://books.toscrape.com/catalogue/category/books/fantasy_19/index.html';
const SEARCH_TERMS = ['Harry Potter', 'The Chronicles of Narnia'];
const OUTPUT_FILE = 'dados-brutos.md';

async function findMatchingBooks(page) {
  const books = [];
  const visitedPages = new Set();
  let pageUrl = CATEGORY_URL;

  while (pageUrl && !visitedPages.has(pageUrl)) {
    visitedPages.add(pageUrl);
    await page.goto(pageUrl, { waitUntil: 'domcontentloaded' });

    const pageBooks = await page.$$eval('article.product_pod h3 a', (links) =>
      links.map((link) => ({
        title: link.getAttribute('title'),
        url: new URL(link.getAttribute('href'), window.location.href).href,
      })),
    );

    books.push(
      ...pageBooks.filter(
        ({ title }) =>
          title && SEARCH_TERMS.some((term) => title.includes(term)),
      ),
    );

    const nextPageLink = await page.$('.next a');
    pageUrl = nextPageLink
      ? await nextPageLink.evaluate((link) => link.href)
      : null;
  }

  return books;
}

async function extractBookHtml(page, book) {
  await page.goto(book.url, { waitUntil: 'domcontentloaded' });

  const details = await page.evaluate(() => {
    const getOuterHtml = (selector) => {
      const element = document.querySelector(selector);
      if (!element) {
        throw new Error(`Required product detail not found: ${selector}`);
      }
      return element.outerHTML;
    };
    const ratingElement = document.querySelector('div.product_main p.star-rating');
    if (!ratingElement) {
      throw new Error('Required product detail not found: star rating');
    }
    const ratingName = [...ratingElement.classList].find((className) =>
      ['One', 'Two', 'Three', 'Four', 'Five'].includes(className),
    );
    if (!ratingName) {
      throw new Error(`Unrecognized star rating: ${ratingElement.className}`);
    }

    return {
      title: getOuterHtml('div.product_main h1'),
      price: getOuterHtml('div.product_main .price_color'),
      availability: getOuterHtml('div.product_main .availability'),
      rating: ratingElement.outerHTML.replace(
        '</p>',
        `${ratingName} stars</p>`,
      ),
      description: getOuterHtml('#product_description + p'),
    };
  });

  return [
    details.title,
    '<h2>Price</h2>',
    details.price,
    '<h2>Availability</h2>',
    details.availability,
    '<h2>Rating</h2>',
    details.rating,
    '<h2>Description</h2>',
    details.description,
  ].join('\n');
}

async function main() {
  const browser = await puppeteer.launch({ headless: true });

  try {
    const page = await browser.newPage();
    const books = await findMatchingBooks(page);
    const turndown = new TurndownService({ headingStyle: 'atx' });

    turndown.addRule('starRating', {
      filter: (node) =>
        node.nodeName === 'P' && node.classList.contains('star-rating'),
      replacement: (_content, node) => {
        const rating = String(node.className).split(/\s+/).find((className) =>
          ['One', 'Two', 'Three', 'Four', 'Five'].includes(className),
        );
        if (!rating) {
          throw new Error(`Unrecognized star rating: ${node.className}`);
        }
        return `Rating: ${rating} star${rating === 'One' ? '' : 's'}\n\n`;
      },
    });

    const markdown = [];
    for (const book of books) {
      const html = await extractBookHtml(page, book);
      markdown.push(turndown.turndown(html));
    }

    if (markdown.length === 0) {
      throw new Error('No matching books were found in the fantasy category.');
    }

    await fs.writeFile(OUTPUT_FILE, `${markdown.join('\n\n---\n\n')}\n`, 'utf8');
    console.log(`Saved ${books.length} book(s) to ${OUTPUT_FILE}.`);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error('Scraping failed:', error);
  process.exitCode = 1;
});
