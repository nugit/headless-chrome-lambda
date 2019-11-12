const chromium = require('chrome-aws-lambda');

const INITIAL_VIEWPORT = { height: 300, width: 790, deviceScaleFactor: 2 };

async function renderPage(content, pageHandler) {
  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: INITIAL_VIEWPORT,
    executablePath: await chromium.executablePath,
    headless: true,
  });

  try {
    const page = await browser.newPage();

    await page.setContent(content, { waitUntil: ['networkidle0', 'domcontentloaded', 'load'] });
    const result = await pageHandler(page);
    await browser.close();

    return result;
  } catch (error) {
    await browser.close();

    return Promise.reject(error);
  }
}

async function screenshotElement(viewport, page, element) {
  const bbox = await element.boundingBox();
  if (!bbox || !bbox.width || !bbox.height) {
    // Ignore empty elements
    // Note: bbox is null when element is not visible (display: none or visibility: hidden)
    // It's not perfect as it doesn't handle overflow hidden
    return null;
  }

  if (bbox.width > viewport.width || bbox.height > viewport.height) {
    // eslint-disable-next-line no-param-reassign
    viewport.width = Math.round(bbox.width);
    // eslint-disable-next-line no-param-reassign
    viewport.height = Math.round(bbox.height);
    await page.setViewport(viewport);
  }

  return element.screenshot({ omitBackground: true });
}

async function screenshotPage(selector, page) {
  const viewport = { ...INITIAL_VIEWPORT };
  const elements = await page.$$(selector);

  const buffers = [];
  for (let i = 0; i < elements.length; i += 1) {
    // We need to screenshot sequentially
    // eslint-disable-next-line no-await-in-loop
    const buffer = await screenshotElement(viewport, page, elements[i]);
    if (buffer !== null) {
      buffers.push(buffer);
    }
  }

  return buffers;
}

function renderAndScreenshotPage({ content, selector }) {
  return renderPage(content, page => screenshotPage(selector, page));
}

module.exports = {
  renderPage,
  renderAndScreenshotPage,
};
