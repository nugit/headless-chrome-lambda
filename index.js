const chromium = require('chrome-aws-lambda');

exports.handler = async (event, context) => {
  let browser = null;
  let result = null;
  let response = null;
  const expiry = 60000;

  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: { height: 300, width: 400, deviceScaleFactor: 2 },
      executablePath: await chromium.executablePath,
      headless: true,
    });

    const page = await browser.newPage();

    const html = event.body;

    if (html) {
      page.setContent(html);
    }

    // for offline debugging, using `queryStringParameters`
    if ('url' in event) {
      await page.goto(event.url || 'https://phantom.nugit.co/', {
        timeout: expiry,
        waitUntil: 'networkidle0',
      });
    }

    const buffer = await page.screenshot({ omitBackground: true });

    await browser.close();
    result = buffer.toString('base64');
    console.log(result);
    response = {
      isBase64Encoded: true,
      statusCode: 200,
      body: result,
    };
  } catch (error) {
    console.warn(error);
    return context.fail(response);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }

  return response;
};
