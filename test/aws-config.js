var assert = require('assert');
var AWS = require('aws-sdk');
var awsConfig = require('..');

describe('awsConfig', function() {
  it('ignore non-supported attributes', function() {
    var options = {
      accessKeyId: 'abc',
      secretAccessKey: '123',
      ignoreMe: true
    };

    assert.isMatch(awsConfig(options), {
      accessKeyId: 'abc',
      secretAccessKey: '123'
    });
  });

  it('uses https-proxy-agent', function() {
    process.env.HTTPS_PROXY = 'http://proxy.corp.net:8000';
    assert.ok(awsConfig().httpOptions.agent);
  });

  it('uses shared ini credentials', function() {
    assert.ok(awsConfig({profile: 'aws-profile-name'}).credentials instanceof AWS.SharedIniFileCredentials);
  });

  it('uses specified timeout if less than AWS_TIMEOUT', function() {
    process.env.AWS_TIMEOUT = '15000';
    var config = awsConfig({timeout: 10000});
    assert.equal(10000, config.httpOptions.timeout);
  });

  it('cannot set timeout greater than AWS_TIMEOUT', function() {
    process.env.AWS_TIMEOUT = '15000';
    var config = awsConfig({timeout: 20000});
    assert.equal(15000, config.httpOptions.timeout);
  });
});
