module.exports = config => {
  const frameworks = ['mocha'];
  const preprocessors = ['webpack', 'sourcemap'];
  const files = ['unit/*.spec.js'];
  const reporters = ['mocha'];
  const browsers = ['ChromeHeadless'];
  const client = {
    mocha: {
      timeout: 2000
    }
  };

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
      mode: 'development'
    }
  });
};
