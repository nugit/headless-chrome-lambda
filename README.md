# headless-chrome-lambda

Serverless Chrome Service use to take HTML Screenshots.

## API

### POST /

**Body:**

> Body should be in JSON format.

| Param    | type   | Description                                                      | Required |
|----------|--------|------------------------------------------------------------------|----------|
| content  | string | HTML Content to screenshot                                       | YES      |
| selector | string | CSS selector of HTML part to screenshot                          | YES      |
| js       | string | Synchronous javascript code to execute before taking screenshots | NO       |

**Return**

Array of screenshots urls

## Developing

> Note: you need to install [Git lfs](https://git-lfs.github.com/)

### Deployments

Before deploy to AWS, Please make sure the [serverless](https://serverless.com/cli/) has been installed and the aws credentials has been set.

#### Staging

- Create `.env` file setting `S3_BUCKET`, `CREDENTIALS_ID` & `CREDENTIALS_SECRET`

```
# S3 bucket name used to save screenshots
S3_BUCKET=
# AWS access key ID
CREDENTIALS_ID=
# AWS secret
CREDENTIALS_SECRET=
```

> Note: we can't use env vars `AWS_ACCESS_KEY_ID` & `AWS_SECRET_ACCESS_KEY` because it's reserved
> in lambda ecosystem.

```sls deploy -s staging```

#### Production

- Create `.env` file setting `S3_BUCKET`, `CREDENTIALS_ID` & `CREDENTIALS_SECRET`

```
# S3 bucket name used to save screenshots
S3_BUCKET=
# AWS access key ID
CREDENTIALS_ID=
# AWS secret
CREDENTIALS_SECRET=
```

```sls deploy -s production```

### Local Development

Install `serverless-offline` plugin, then

```sls offline -s staging```

## Reference

[AWS lambda document](https://docs.aws.amazon.com/lambda/latest/dg/programming-model.html)
