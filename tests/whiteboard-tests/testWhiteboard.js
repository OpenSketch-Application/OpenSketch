describe('Whiteboard test suite', function() {
  beforeEach(function(){
    browser.ignoreSynchronization = true;
  })

  it('should be at the application home page', function() {
    // Root is set at localhost:3000
    browser.get("/");

    expect(browser.getTitle()).toEqual('Open Sketch');
  })
})
