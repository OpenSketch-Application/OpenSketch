exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  seleniumPort: null,
  seleniumArgs: [],
  chromeOnly: true,
  capabilities: {
    'browserName': 'chrome'
  },
  specs: ['./**/*.js'],
  baseUrl: 'http://localhost:3000',
  jasmineNodeOpts: {
    onComplete: null,
    isVerbose: true,
    showColors: true,
    includeStackTrace: true
  },
  onPrepare: function(){
    global.dv = browser.driver;
  }
};

/*
  http://www.protractortest.org/#/tutorial

  multiCapabilities: [{
    browserName: 'firefox'
  }, {
    browserName: 'chrome'
  }]

 */
