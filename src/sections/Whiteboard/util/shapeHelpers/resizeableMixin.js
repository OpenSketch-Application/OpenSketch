module.exports = {
  resizeByVector: function(vectorOrigin, coords) {
    var newWidth = this.originalWidth + this.origin.x - coords.x;
    var newHeight = this.originalHeight + this.origin.y - coords.y;
    var newX = coords.x;// < this.origin.x ? coords.x : this.origin.x;
    var newY = coords.y;// < this.origin.y ? coords.y : this.origin.y;

    // if(newWidth < 5) return;
    // if(newHeight < 5) return;

    // switch(vectorOrigin) {
    //   case 1:
    //     newX = this.origin.x;
    //     newY = this.origin.y;
    //     break;
    //   case 2:
    //     newX = this.origin.x;
    //     newY = this.origin.y;
    //     break;
    // }

    this.draw({
      x: newX,
      y: newY,
      width: newWidth,
      height: newHeight
    });

  }

};
