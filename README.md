# headless-chrome-lambda

This project based on [chrome-aws-lamdba](https://www.npmjs.com/package/chrome-aws-lambda). Nodejs version = `8.10`.

#### Usage
Checkout the API endpoint from API Gateway in AWS lambda.
- `METHOD`: POST
- `Request body` : HTML entity
- `URL Params: url(Optional)` : The url to be rendered. If this param has been sent, it will cover the HTML rendering.

`Return`: Base64-encoded string of PNG file

#### Deploy
Before deploy to AWS, Please make sure the [serverless](https://serverless.com/cli/) has been installed and the aws credentials has been set.

```sls deploy```

#### Local Development
Install `serverless-offline` plugin , then

```sls offline```

#### Reference
[AWS lambda document](https://docs.aws.amazon.com/lambda/latest/dg/programming-model.html)
