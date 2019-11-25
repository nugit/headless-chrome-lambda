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

- Create `.env` file setting `S3_BUCKET`

```
S3_BUCKET=
```

```sls deploy -s staging```

#### Production

- Create `.env` file setting `S3_BUCKET`

```
S3_BUCKET=
```

```sls deploy -s production```

### Local Development

Install `serverless-offline` plugin, then

```sls offline```

## Reference

[AWS lambda document](https://docs.aws.amazon.com/lambda/latest/dg/programming-model.html)
