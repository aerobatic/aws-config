var AWS = require('aws-sdk');

module.exports = function(options) {
  if (!options) options = {};

  if (!options.region) options.region = process.env.AWS_DEFAULT_REGION;
  if (!options.profile) options.profile = process.env.AWS_DEFAULT_PROFILE;

  var awsOptions = {};
  var awsAttributes = ['accessKeyId', 'secretAccessKey', 'sessionToken', 'region',
    'timeout', 'logger', 'sslEnabled'];

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
    } catch(err) {
      globalTimeout = null;
    }
  }

  if (options.timeout) {
    if (globalTimeout && options.timeout > globalTimeout) {
      options.timeout = globalTimeout;
    }

    awsOptions.httpOptions.timeout = options.timeout;
  }

  if (options.profile) {
    awsOptions.credentials = new AWS.SharedIniFileCredentials({
      profile: options.profile
    });
    delete awsOptions.profile;
  }

  // Configure the proxy
  if (process.env.HTTPS_PROXY && options.sslEnabled !== false) {
    if (!awsOptions.httpOptions.agent) {
      var HttpsProxyAgent = require('https-proxy-agent');
      awsOptions.httpOptions.agent = new HttpsProxyAgent(process.env.HTTPS_PROXY);
    }
  }

  return awsOptions;
}
