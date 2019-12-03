const S3 = require('aws-sdk/clients/s3');
const uuid = require('uuid/v4');

function createClient() {
  return new S3({
    accessKeyId: process.env.CREDENTIALS_ID,
    secretAccessKey: process.env.CREDENTIALS_SECRET,
  });
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
    Expires: 14 * 24 * 3600, // 2 weeks
  });
}

module.exports = {
  createClient,
  uploadBufferImage,
};
