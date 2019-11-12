
const { format } = require('prettier');
const { Page } = require('puppeteer/lib/api');
const { toMatchImageSnapshot } = require('jest-image-snapshot');
const { renderAndScreenshotPage, renderPage } = require('../render');
const { nugit1, helloWorld } = require('../fixtures');

expect.extend({ toMatchImageSnapshot });

const compareImageOptions = { failureThreshold: 0.01, failureThresholdType: 'percent' };

describe('render', () => {
  describe('renderPage', () => {
    test('should call pageHandler with page htmlContent', async () => {
      let pageContent = null;
      const pageHandler = jest.fn().mockImplementation(async (page) => {
        pageContent = format(await page.content(), { parser: 'html' });
        return 42;
      });

      await expect(renderPage(helloWorld, pageHandler)).resolves.toBe(42);
      expect(pageHandler).toHaveBeenCalledWith(expect.any(Page));
      expect(pageContent).toBe(format(helloWorld, { parser: 'html' }));
    }, 30000);

    test('should close browser instance when pageHandler is finished', async () => {
      const pageHandler = jest.fn().mockResolvedValue(42);

      await expect(renderPage(helloWorld, pageHandler)).resolves.toBe(42);
      expect(pageHandler).toHaveBeenCalledWith(expect.any(Page));
      const page = pageHandler.mock.calls[0][0];
      await expect(page.content()).rejects.toThrow(
        'Protocol error (Runtime.callFunctionOn): Session closed. Most likely the page has been closed.',
      );
    }, 30000);

    test('should catch errors in pageHandler and close browser', async () => {
      const e = new Error('Oops');
      const pageHandler = jest.fn().mockRejectedValue(e);

      await expect(renderPage(helloWorld, pageHandler)).rejects.toThrow(e);
      expect(pageHandler).toHaveBeenCalledWith(expect.any(Page));
      const page = pageHandler.mock.calls[0][0];
      await expect(page.content()).rejects.toThrow(
        'Protocol error (Runtime.callFunctionOn): Session closed. Most likely the page has been closed.',
      );
    }, 30000);
  });

  describe('renderAndScreenshotPage', () => {
    test('should properly screenshot basic html', async () => {
      const job = renderAndScreenshotPage({ content: helloWorld, selector: 'p' });
      await expect(job).resolves.toEqual([expect.any(Buffer)]);
      const result = await job;
      expect(result[0]).toMatchImageSnapshot(compareImageOptions);
    }, 30000);

    test('should properly screenshot nugit with selector', async () => {
      const job = renderAndScreenshotPage({ content: nugit1, selector: '.vis-key-metrics__item' });
      await expect(job).resolves.toEqual(
        [expect.any(Buffer), expect.any(Buffer), expect.any(Buffer)],
      );
      const result = await job;
      expect(result[0]).toMatchImageSnapshot(compareImageOptions);
      expect(result[1]).toMatchImageSnapshot(compareImageOptions);
      expect(result[2]).toMatchImageSnapshot(compareImageOptions);
    }, 30000);
  });
});
