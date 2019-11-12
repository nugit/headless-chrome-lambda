const { renderAndScreenshotPage } = require('./render');
const { createClient, uploadBufferImage } = require('./uploader');

exports.handler = async (event) => {
  const screenshots = await renderAndScreenshotPage(JSON.parse(event.body));
  const client = createClient();
  const result = await Promise.all(
    screenshots.map(buffer => uploadBufferImage(client, buffer)),
  );

  return {
    statusCode: 200,
    body: JSON.stringify(result, null, 2),
  };
};
