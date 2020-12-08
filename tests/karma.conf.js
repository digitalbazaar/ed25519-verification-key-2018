const path = require('path');

module.exports = config => {
  const bundler = process.env.BUNDLER || 'webpack';
  const frameworks = ['mocha'];
  const files = ['unit/*.spec.js'];
  const reporters = ['mocha'];
  const browsers = ['ChromeHeadless'];
  const client = {
    mocha: {
      timeout: 2000
    }
  };
  // main bundle preprocessors
  const preprocessors = [];
  preprocessors.push(bundler);
  preprocessors.push('sourcemap');

  return config.set({
    frameworks,
    files,
    reporters,
    basePath: '',
    port: 9876,
    colors: true,
    browsers,
    client,
    singleRun: true,
    preprocessors: {
      'unit/*.js': preprocessors
    },
    webpack: {
      devtool: 'inline-source-map',
      mode: 'development',
      node: {
        Buffer: false,
        crypto: false,
        util: false,
        bs58: false,
        setImmediate: false
      },
      resolve: {
        alias: {
          // throw an error if trying to import 'crypto'
          // workaround for "node" feature not working in sub-dependencies
          crypto$: path.resolve(__dirname, '..', 'no-crypto.js')
        }
      }
    }
  });
};
