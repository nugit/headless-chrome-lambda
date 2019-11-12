
const AWS = require('aws-sdk');
const uuid = require('uuid/v4');

function createClient() {
  return new AWS.S3();
}

async function uploadBufferImage(client, buffer) {
  const { S3_BUCKET, S3_BUCKET_ENCRYPTION = '' } = process.env;
  const key = `${uuid()}.png`;

  const payload = {
    Bucket: S3_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: 'image/png',
    ...(S3_BUCKET_ENCRYPTION && { ServerSideEncryption: S3_BUCKET_ENCRYPTION }),
  };

  await client.putObject(payload).promise();

  return client.getSignedUrl('getObject', {
    Bucket: S3_BUCKET,
    Key: key,
  });
}

module.exports = {
  createClient,
  uploadBufferImage,
};
