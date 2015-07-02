describe('Whiteboard test suite', function() {
  beforeEach(function(){
    browser.ignoreSynchronization = true;
  })

  it('should be at the application home page', function() {
    // Root is set at localhost:3000
    // This should load the whiteboard instance that is already
    // saved on the db
    browser.get("#!/whiteboard/h2gHF9cBx3w5vPqKAAAB");

    //expect(browser.wait());
  })
})
