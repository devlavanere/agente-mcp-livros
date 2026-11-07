const fs = require('node:fs/promises');
const puppeteer = require('puppeteer');

const FANTASY_URL =
  'https://books.toscrape.com/catalogue/category/books/fantasy_19/index.html';
const AUTOMATION_URL = 'https://automationexercise.com/products';
const BOOKS_TO_CAPTURE = [
  { term: 'Harry Potter', filename: 'print-harry.png' },
  { term: 'The Chronicles of Narnia', filename: 'print-narnia.png' },
];

async function findBooksInFantasy(page) {
  const foundBooks = new Map();
  const visitedPages = new Set();
  let pageUrl = FANTASY_URL;

  while (pageUrl && !visitedPages.has(pageUrl)) {
    visitedPages.add(pageUrl);
    await page.goto(pageUrl, { waitUntil: 'domcontentloaded' });

    const books = await page.$$eval('article.product_pod h3 a', (links) =>
      links.map((link) => ({
        title: link.getAttribute('title') || link.textContent.trim(),
        url: new URL(link.getAttribute('href'), window.location.href).href,
      })),
    );

    for (const requestedBook of BOOKS_TO_CAPTURE) {
      const match = books.find(({ title }) =>
        title.toLowerCase().includes(requestedBook.term.toLowerCase()),
      );
      if (match) {
        foundBooks.set(requestedBook.term, {
          ...match,
          filename: requestedBook.filename,
        });
      }
    }

    pageUrl = await page.$eval('.next a', (link) => link.href).catch(() => null);
  }

  return foundBooks;
}

async function captureBooks(page) {
  const foundBooks = await findBooksInFantasy(page);
  const missingBooks = [];

  for (const requestedBook of BOOKS_TO_CAPTURE) {
    const book = foundBooks.get(requestedBook.term);
    if (!book) {
      missingBooks.push(requestedBook.term);
      console.error(
        `Book not found in the Fantasy category: ${requestedBook.term}`,
      );
      continue;
    }

    await page.goto(book.url, { waitUntil: 'domcontentloaded' });
    await page.screenshot({ path: requestedBook.filename, fullPage: true });
    console.log(`Saved ${requestedBook.filename} for "${book.title}".`);
  }

  return missingBooks;
}

async function scrapeAutomationExercise(page) {
  await page.goto(AUTOMATION_URL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#search_product');
  await page.locator('#search_product').fill('Jeans');
  await page.locator('#submit_search').click();
  await page.waitForSelector('.features_items .product-image-wrapper');

  const products = await page.$$eval(
    '.features_items .product-image-wrapper',
    (cards) =>
      cards.slice(0, 3).map((card) => ({
        name: card.querySelector('.productinfo p')?.textContent.trim(),
        price: card.querySelector('.productinfo h2')?.textContent.trim(),
      })),
  );
  const validProducts = products.filter(({ name, price }) => name && price);

  if (validProducts.length !== 3) {
    throw new Error(
      `Expected 3 Jeans products with names and prices, found ${validProducts.length}.`,
    );
  }

  const report = [
    '# Resultados: Automation Exercise',
    '',
    'Busca por **Jeans** em [Automation Exercise](' + AUTOMATION_URL + ').',
    '',
    '| # | Produto | Preço |',
    '|---:|---|---:|',
    ...validProducts.map(
      ({ name, price }, index) => `| ${index + 1} | ${name} | ${price} |`,
    ),
    '',
  ].join('\n');

  await fs.writeFile('resultado-automation.md', report, 'utf8');
  console.log('Saved 3 Jeans products to resultado-automation.md.');
}

async function main() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const errors = [];

  try {
    try {
      const missingBooks = await captureBooks(page);
      if (missingBooks.length > 0) {
        errors.push(
          `Missing books in Fantasy category: ${missingBooks.join(', ')}`,
        );
      }
    } catch (error) {
      errors.push(`Book capture failed: ${error.message}`);
    }

    try {
      await scrapeAutomationExercise(page);
    } catch (error) {
      errors.push(`Automation Exercise scrape failed: ${error.message}`);
    }
  } finally {
    await browser.close();
  }

  if (errors.length > 0) {
    throw new Error(errors.join('\n'));
  }
}

main().catch((error) => {
  console.error('Final test failed:', error);
  process.exitCode = 1;
});
