require('jasmine-given');

describe('Homepage test suite', function() {
  beforeEach(function(){
    return browser.ignoreSynchronization = true;
  })
  // Helpers
  var urlChanged = function(url) {
    return function () {
      return browser.getCurrentUrl().then(function(actualUrl) {
        return url != actualUrl;
      });
    };
  };

  it('should start without issue', function() {
    var a = true;

    expect(a).toBe(true);
  })

  it('should navigate to the application home page', function() {
    browser.get("/");
    expect(browser.getTitle()).toEqual('Open Sketch');
  })

  it('should show url with /home as last url string', function() {
    expect(browser.executeScript('return window.location.href'))
    .toEqual('http://localhost:3000/#!/home');
  })

  describe('visiting the home page', function() {
    Given(function() {
      browser.get('/');
    });

    describe('when user logs in', function() {

      var emailField, maxUsers, canChat, canDraw, createBtn;

      Given(function() {
        emailField = element(By.id('inputName'));
        maxUsers = element(By.id('inputMax'));
        canChat = element(By.id('roundedOne'));
        canDraw = element(By.id('roundedTwo'));
        createBtn = element(By.css('.btn'));
      })
      Given(function() {
        emailField.sendKeys('iamlegend');
        maxUsers.sendKeys('5');
        canChat.click();
        canDraw.click();
      })
      When(function() {
        createBtn.click();
      })
      Then(function() {
        browser.wait(urlChanged('http://localhost:3000/#!/home'), 3000);
      })
    })
  })
})
