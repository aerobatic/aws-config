Reduce boilerplate code by encapsulating common configuration setup when working with the Node [aws-sdk](http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-intro.html).

Takes care of the following:
* Handles corporate proxy via [https-proxy-agent](https://www.npmjs.com/package/https-proxy-agent)  if `HTTPS_PROXY` environment variable exists.
* Utilize a named profile from `.aws/credentials` file if `profile` option specified
* Support `AWS_TIMEOUT` environment variable to enforce a maximum timeout for all AWS SDK operations

## Installation

~~~sh
npm install aws-config
~~~

### Options

~~~js
awsConfig({
  region: 'us-east-1'                  // explicitly set AWS region
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
