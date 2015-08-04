module.exports = {
  // Returns a Vector Origin coordinate (0-3 vertices)
  getSelectableCoordinate: function(localCoords) {
    // 4 corner coordinates
    //var localCoords = data.getLocalPosition(this.graphics.stage);//this.origin;
    console.log(this.bounds);
    console.log(localCoords);
    // Top Right
    if(localCoords.x >= (this.bounds.x - 5) && localCoords.x <= (this.bounds.x + 5)) {
      if(localCoords.y >= (this.bounds.y - 5) && localCoords.y <= (this.bounds.y + 5)) {
        console.log('TOP LEFT BOUNDS clicked');
        return 0;
      }
      else if(localCoords.y + this.height >= (this.bounds.y2 - 5) && localCoords.y + this.height <= (this.bounds.y2 + 5)) {
        console.log('BOTTOM LEFT BOUNDS clicked');
        return 2;
      }


      console.log('LEFT SIDE CLICKED');
      return 4;
    }
    // else if(localCoords.x + this.width >= (this.bounds.x + this.width - 5) && localCoords.x + this.width <= (this.bounds.x + this.width + 5)) {
    //   //debugger;
    //   if(localCoords.y >= (this.bounds.y - 5) && localCoords.y <= (this.bounds.y + 5)) {
    //     console.log('TOP RIGHT BOUNDS clicked');
    //     return 1;
    //   }
    //   else if(localCoords.y + this.height >= (this.bounds.y - 5) && localCoords.y + this.height <= (this.bounds.y + 5)) {
    //     console.log('TOP RIGHT BOUNDS clicked');
    //     return 3;
    //   }
    //   debugger;
    // }
    // else if(localCoords.x >= (this.bounds.x - 5) && localCoords.x <= (this.bounds.x + 5)) {

    // }
    // else if(localCoords.x + this.width >= (this.bounds.x - 5) && localCoords.x + this.width <= (this.bounds.x + 5)) {

    // }

    return null;
    // 4 side coordinates
  }
};
