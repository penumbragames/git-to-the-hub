/**
 * Methods for drawing all the sprites onto the HTML5 canvas. All coordinates
 * passed the methods of the Drawing class should be canvas coordinates and not
 * absolute game coordinates. They must be passed through the Viewport class
 * before coming into the Drawing class.
 * @author kennethli.3470@gmail.com (Kenneth Li)
 */

/**
 * Creates a Drawing object.
 * @param {CanvasRenderingContext2D} context The context this object will
 *   draw to.
 * @constructor
 */
function Drawing(context, selfPlayerImg, otherPlayerImg) {
  this.context = context;
  this.selfPlayerImg = selfPlayerImg;
  this.otherPlayerImg = otherPlayerImg;
}

/**
 * @const
 * @type {string}
 */
Drawing.BASE_IMG_URL = '/public/img/';
Drawing.SELF_PLAYER_SRC = Drawing.BASE_IMG_URL + 'self-player.png';
Drawing.OTHER_PLAYER_SRC = Drawing.BASE_IMG_URL + 'other-player.png';
Drawing.PROJECTILE_SRC = Drawing.BASE_IMG_URL + 'projectile.png';
Drawing.PLATFORM_SRC = Drawing.BASE_IMG_URL + 'platform.png';

/**
 * This is a factory method for creating a Drawing object.
 * @param {CanvasRenderingContext2D} context The context this object will
 *   draw to.
 * @return {Drawing}
 */
Drawing.create = function(context) {
  var selfPlayerImg = Drawing.createImage(Drawing.SELF_PLAYER_SRC, 100, 100);
  var otherPlayerImg = Drawing.createImage(Drawing.OTHER_PLAYER_SRC, 100, 100);
  return new Drawing(context, selfPlayerImg, otherPlayerImg);
};

/**
 * This method creates and returns an Image object.
 * @param {string} src The path to the image
 * @param {number} width The width of the image in pixels
 * @param {number} height The height of the image in pixels
 * @return {Image}
 */
Drawing.createImage = function(src, width, height) {
  var image = new Image(width, height);
  image.src = src;
  return image;
};

/**
 * Clears the canvas context.
 */
Drawing.prototype.clear = function() {
  this.context.clearRect(
      0, 0, Constants.CANVAS_WIDTH, Constants.CANVAS_HEIGHT);
};

Drawing.prototype.drawPlayer = function(x, y, width, height, health, name, self) {
  if (self) {
    this.context.drawImage(this.selfPlayerImg, x, y, width, height);
  } else {
    this.context.drawImage(this.otherPlayerImg, x, y, width, height);
  }

  var healthX = x + width / 2 - Constants.PLAYER_MAX_HEALTH / 2 * 10;
  var healthY = y - 10;
  
  for (var i = 0; i < Constants.PLAYER_MAX_HEALTH; i++) {
    if (i < health) {
      this.context.fillStyle = 'green';
    } else {
      this.context.fillStyle = 'red';
    }

    this.context.fillRect(healthX, healthY, 10, 10);
    healthX += 10;
  }

  var nameX = x + width / 2;
  var nameY = y - 20;
  
  this.context.font = '16px Consolas';
  this.context.textAlign = 'center';
  this.context.fillText(name, nameX, nameY);
};

Drawing.prototype.drawPlatform = function(x, y, width, height) {
  this.context.fillStyle = 'black';
  this.context.fillRect(x, y, width, height);
};

Drawing.prototype.drawProjectile = function(x, y, width, height, orientation) {
  this.context.save();
  this.context.translate(x, y);
  this.context.rotate(orientation);
  this.context.fillStyle = 'gray';
  this.context.fillRect(0, 0, 10, 10);
  this.context.restore();
};

/**
 * Draws a circle on the canvas.
 * @param {number} x The x coordinate of the center.
 * @param {number} y The y coordinate of the center.
 * @param {number} r The radius of he circle.
 * @param {string} color The color of the circle.
 */
Drawing.prototype.drawCircle = function(x, y, r, color) {
  this.context.beginPath();
  this.context.arc(x, y, r, 0, 2 * Math.PI, false);
  this.context.fillStyle = color;
  this.context.fill();
}
