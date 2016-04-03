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
function Drawing(context) {
  this.context = context;
}

/**
 * @const
 * @type {string}
 */
Drawing.BASE_IMG_URL = '/public/img/';

/**
 * This is a factory method for creating a Drawing object.
 * @param {CanvasRenderingContext2D} context The context this object will
 *   draw to.
 * @return {Drawing}
 */
Drawing.create = function(context) {
  return new Drawing(context);
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

Drawing.prototype.drawPlayer = function(x, y, width, height) {
  this.context.fillStyle = 'blue';
  this.context.fillRect(x, y, width, height);
};

Drawing.prototype.drawPlatform = function(x, y, width, height, color) {
  this.context.fillStyle = color;
  this.context.fillRect(x, y, width, height);
};

Drawing.prototype.drawProjectile = function(x, y, width, height, color) {
  this.context.fillStyle = color;
  this.context.fillRect(x, y, width, height);
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
