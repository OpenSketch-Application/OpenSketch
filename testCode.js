var setMoveListeners = function(AppState) {
  //var origin;
  var selected = false;
  var _this = this;
  _this.mouseData;
  _this.origin;

  console.log('setting listeners', AppState);
  console.log('this', this.graphics);
  this.graphics.interactive = true;
  this.graphics.mousedown = mousedown;
  this.graphics.mousemove = mousemove;
  this.graphics.mouseup = mouseup;

  var mousedown = function(data) {
    //console.log('mouseDownRecieved on shape', data);
    data.originalEvent.preventDefault();
    var graphics = this.graphics;
    console.log('Appstate', AppState.Tools);
    console.log('click fired with', AppState.Tools.selected);
    if(AppState.Tools.selected === 'select') {

      _this.mouseData = data;
      _this.origin = data.getLocalPosition(this);
      this.alpha = 0.9;
      selected = true;

      AppState.Tools.select.selectedObject = _this;

      //AppState.Tools.select.mouseData = data;
    }
    else if(AppState.Tools.selected === 'fill') {
      this.clear();
      console.log('fill Color: ' + AppState.Tools.fill.fillColor);
      //this.endFill(AppState.Tools.fill.fillColor);
      //AppState.Canvas.stage.addChild(this);
    }
  };

  var mousemove = function(data)
  {
    if(selected) {
      data.originalEvent.preventDefault();
      var newPosition = _this.mouseData.getLocalPosition(this.parent);
      //movingSelf = true;

      this.position.x = newPosition.x - _this.origin.x;
      this.position.y = newPosition.y - _this.origin.y;
    }
  };

  var mouseup = function(data) {
    data.originalEvent.preventDefault();
    selected = false;
    this.alpha = 1;
    //shapeObject.selected = false;
    // set the interaction data to null
    this.data = null;
    //movingSelf = false;
    //SocketObject.emitObjectMoveDone(stage.getChildIndex(this));
  };
}


