var $ = require('jquery');

module.exports = function () {
  $(document).ready(function($){
    var toolItems = $('#flyout_menu li a');

    toolItems.on('click', function(event) {
      var selectedItem = $(this);

      if(!selectedItem.hasClass('menuSelected')) {
        toolItems.removeClass('menuSelected');
        selectedItem.addClass('menuSelected');
      }
      else {
        toolItems.removeClass('menuSelected');
      }
    });

    var tabItems = $('.cd-tabs-navigation a'),
    tabContentWrapper = $('.cd-tabs-content');

    tabItems.on('click', function(event){
      event.preventDefault();
      var selectedItem = $(this);
      if( !selectedItem.hasClass('selected') ) {
        var selectedTab = selectedItem.data('content'),
        selectedContent = tabContentWrapper.find('li[data-content="'+selectedTab+'"]'),
        slectedContentHeight = selectedContent.innerHeight();

        tabItems.removeClass('selected');
        selectedItem.addClass('selected');
        selectedContent.addClass('selected').siblings('li').removeClass('selected');
        //animate tabContentWrapper height when content changes 
        tabContentWrapper.animate({
          'height': slectedContentHeight
        }, 200);
      }
    });

    checkScrolling($('.cd-tabs nav'));
    $(window).on('resize', function(){
      checkScrolling($('.cd-tabs nav'));
      tabContentWrapper.css('height', 'auto');
    });
    $('.cd-tabs nav').on('scroll', function(){ 
      checkScrolling($(this));
    });

    function checkScrolling(tabs){
      var totalTabWidth = parseInt(tabs.children('.cd-tabs-navigation').width()),
      tabsViewport = parseInt(tabs.width());
      if( tabs.scrollLeft() >= totalTabWidth - tabsViewport) {
        tabs.parent('.cd-tabs').addClass('is-ended');
      } else {
        tabs.parent('.cd-tabs').removeClass('is-ended');
      }
    }
  });
};