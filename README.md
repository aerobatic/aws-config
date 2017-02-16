[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build Status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]

Reduce boilerplate code when configuring the AWS Node.js SDK.
http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html

Takes care of the following:
* Handles corporate proxy via [https-proxy-agent](https://www.npmjs.com/package/https-proxy-agent)  if `HTTPS_PROXY` environment variable exists.
* Utilize a named profile from `.aws/credentials` file if `profile` option specified
* Support `AWS_TIMEOUT` environment variable to enforce a maximum timeout for all AWS SDK operations
* Honors the `AWS_DEFAULT_PROFILE` and `AWS_DEFAULT_REGION` environment variables used by the [AWS CLI](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html#cli-environment).

## Installation

~~~sh
npm install aws-config
~~~

### Options

~~~js
awsConfig({
  region: 'us-east-1'                  // explicitly set AWS region
  sslEnabled: true,                    // override whether SSL is enabled
  maxRetries: 3,                       // override the number of retries for a request
  accessKeyId: 'your_aws_access_key',  // can omit access key and secret key
  secretAccessKey: 'your_secret_key'   // if relying on a profile or IAM
  profile: 'profile_name',             // name of profile from ~/.aws/credentials
  timeout: 15000                       // optional timeout in ms. Will use AWS_TIMEOUT
});
~~~

## Usage

~~~js
var AWS = require('aws-sdk');
var awsConfig = require('aws-config');

// demonstrating different sample usage at the individual service level
var s3 = new AWS.S3(awsConfig({accessKeyId: '123', secretAccessKey: 'abc'}));
var ec2 = new AWS.EC2(awsConfig({profile: 'aws-profile-name'}));
var dynamo = new AWS.DynamoDB(awsConfig({timeout: 5000}));

// you can also set the AWS config globally and use empty constructors on
// individual services.
AWS.config = awsConfig();

var s3 = new AWS.S3();
~~~

[npm-image]: https://img.shields.io/npm/v/aws-config.svg?style=flat
[npm-url]: https://npmjs.org/package/aws-config
[travis-image]: https://img.shields.io/travis/aerobatic/aws-config.svg?style=flat
[travis-url]: https://travis-ci.org/aerobatic/aws-config
[coveralls-image]: https://img.shields.io/coveralls/aerobatic/aws-config.svg?style=flat
[coveralls-url]: https://coveralls.io/r/aerobatic/aws-config?branch=master
[downloads-image]: https://img.shields.io/npm/dm/aws-config.svg?style=flat
[downloads-url]: https://npmjs.org/package/aws-config
