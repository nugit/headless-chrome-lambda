const S3 = require('aws-sdk/clients/s3');
const { v4: uuid } = require('uuid');
const { createClient, uploadBufferImage } = require('../uploader');

jest.mock('uuid');
jest.mock('aws-sdk/clients/s3');

describe('uploader', () => {
  describe('createClient', () => {
    test('should returns new S3 client', () => {
      expect(createClient()).toEqual(S3.mock.instances[0]);
    });
  });

  describe('uploadBufferImage', () => {
    test('should upload given image', async () => {
      process.env.S3_BUCKET = 's3-test-bucket-name';
      delete process.env.S3_BUCKET_ENCRYPTION;

      const putObjectPromise = jest.fn().mockResolvedValue(undefined);
      const client = {
        putObject: jest.fn().mockReturnValue({
          promise: putObjectPromise,
        }),
        getSignedUrl: jest.fn().mockReturnValue('http://img-link'),
      };
      const buffer = Buffer.from('');
      uuid.mockReturnValue('uuid');

      await expect(uploadBufferImage(client, buffer)).resolves.toBe('http://img-link');
      expect(client.putObject).toHaveBeenCalledWith({
        Bucket: 's3-test-bucket-name',
        Key: 'uuid.png',
        Body: buffer,
        ContentType: 'image/png',
      });
      expect(client.getSignedUrl).toHaveBeenCalledWith(
        'getObject', { Bucket: 's3-test-bucket-name', Key: 'uuid.png', Expires: 1209600 },
      );
    });

    test('should support server-side encryption', async () => {
      process.env.S3_BUCKET = 's3-test-bucket-name';
      process.env.S3_BUCKET_ENCRYPTION = 'AES256';

      const putObjectPromise = jest.fn().mockResolvedValue(undefined);
      const client = {
        putObject: jest.fn().mockReturnValue({
          promise: putObjectPromise,
        }),
        getSignedUrl: jest.fn().mockReturnValue('http://img-link'),
      };
      const buffer = Buffer.from('');
      uuid.mockReturnValue('uuid');

      await expect(uploadBufferImage(client, buffer)).resolves.toBe('http://img-link');
      expect(client.putObject).toHaveBeenCalledWith({
        Bucket: 's3-test-bucket-name',
        Key: 'uuid.png',
        Body: buffer,
        ContentType: 'image/png',
        ServerSideEncryption: 'AES256',
      });
      expect(client.getSignedUrl).toHaveBeenCalledWith(
        'getObject', { Bucket: 's3-test-bucket-name', Key: 'uuid.png', Expires: 1209600 },
      );
    });
  });
});
