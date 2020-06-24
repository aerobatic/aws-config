var AWS = require("aws-sdk");
var url = require("url");
var https = require("https");
var isec2 = require("is-ec2");

// Incorporate workaround agent settings to deal with Node/OpenSSL issue connecting to DynamoDB
// https://github.com/aws/aws-sdk-js/issues/862
var httpsAgentWorkaroundOptions = {
  rejectUnauthorized: true,
  keepAlive: true, // workaround part i.
  secureProtocol: "TLSv1_method", // workaround part ii.
  ciphers: "ALL" // workaround part ii.
};

var isEc2 = isec2();

module.exports = function(options) {
  if (!options) options = {};

  if (!options.region) options.region = process.env.AWS_DEFAULT_REGION;
  if (!options.profile) options.profile = process.env.AWS_DEFAULT_PROFILE;

  var awsOptions = {};
  var awsAttributes = [
    "accessKeyId",
    "secretAccessKey",
    "sessionToken",
    "region",
    "timeout",
    "logger",
    "sslEnabled",
    "endpoint",
    "useAccelerateEndpoint"
  ];

  if (options) {
    awsAttributes.forEach(function(attr) {
      if (options[attr]) {
        awsOptions[attr] = options[attr];
      }
    });
  }

  if (!awsOptions.httpOptions) awsOptions.httpOptions = {};

  // If there is a timeout environment variable, make sure the specified timeout
  // cannot exceed that.
  var globalTimeout;
  if (process.env.AWS_TIMEOUT) {
    try {
      globalTimeout = parseInt(process.env.AWS_TIMEOUT, 10);
    } catch (err) {
      globalTimeout = null;
    }
  }

  if (options.timeout) {
    if (globalTimeout && options.timeout > globalTimeout) {
      options.timeout = globalTimeout;
    }

    awsOptions.httpOptions.timeout = options.timeout;
  }

  // Configure the proxy, but not if we are on EC2.
  if (options.sslEnabled !== false && isEc2 !== true) {
    if (process.env.HTTPS_PROXY) {
      var HttpsProxyAgent = require("https-proxy-agent");
      var proxyOpts = url.parse(process.env.HTTPS_PROXY);
      if (options.httpsAgentWorkaround === true) {
        proxyOpts = { ... proxyOpts, ... httpsAgentWorkaroundOptions };
      }
      awsOptions.httpOptions.agent = new HttpsProxyAgent(proxyOpts);
    } else if (options.httpsAgentWorkaround === true) {
      awsOptions.httpOptions.agent = new https.Agent(
        httpsAgentWorkaroundOptions
      );
    }
  }
  if (options.profile) {
    awsOptions.credentials = new AWS.SharedIniFileCredentials({
      profile: options.profile
    });
    delete awsOptions.profile;
  } else if (process.env.AWS_WEB_IDENTITY_TOKEN_FILE) {
    // support for kubernetes service accounts linked to IAM roles:
    //    https://aws.amazon.com/blogs/opensource/introducing-fine-grained-iam-roles-service-accounts/
    awsOptions.credentials = new AWS.TokenFileWebIdentityCredentials(
      { 
        ... awsOptions,
        // VPC endpoint friendly
        stsRegionalEndpoints: 'regional'
      }
    );
  }

  return awsOptions;
};
