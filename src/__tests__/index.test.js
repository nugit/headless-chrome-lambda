const AWS = require('aws-sdk');
const { renderAndScreenshotPage } = require('../render');
const { createClient, uploadBufferImage } = require('../uploader');
const { handler } = require('../index');

jest.mock('./render');
jest.mock('./uploader');

describe('index', () => {
  describe('handler', () => {
    test('should returns urls', async () => {
      const buffers = [Buffer.from('a'), Buffer.from('b'), Buffer.from('c')];
      const client = new AWS.S3();
      renderAndScreenshotPage.mockResolvedValue(buffers);
      createClient.mockReturnValue(client);
      uploadBufferImage
        .mockResolvedValueOnce('http://link1')
        .mockResolvedValueOnce('http://link2')
        .mockResolvedValueOnce('http://link3');

      const data = {
        content: '<html><body>Hello World</body></html>',
        selector: 'body',
      };
      const event = {
        body: JSON.stringify(data),
      };

      await expect(handler(event)).resolves.toEqual({
        statusCode: 200,
        body: JSON.stringify(['http://link1', 'http://link2', 'http://link3'], null, 2),
      });

      expect(renderAndScreenshotPage).toHaveBeenCalledWith(data);
      expect(uploadBufferImage).toHaveBeenCalledTimes(3);
      expect(uploadBufferImage).toHaveBeenNthCalledWith(1, client, buffers[0]);
      expect(uploadBufferImage).toHaveBeenNthCalledWith(2, client, buffers[1]);
      expect(uploadBufferImage).toHaveBeenNthCalledWith(3, client, buffers[2]);
    });
  });
});
