/**
 * @fileoverview This class handles the conversion of coordinates from absolute
 *   world coordinates to canvas coordinates when objects must be rendered on
 *   the canvas as the player moves around.
 * @author kennethli.3470@gmail.com (Kenneth Li)
 */

/**
 * This class manages the viewport of the client. It is mostly
 * an abstract class that handles the math of converting absolute
 * coordinates to appropriate canvas coordinates.
 * @constructor
 * @param {number} centerX The x coordinate of the center of the Viewport.
 * @param {number} centerY The y coordinate of the center of the Viewport.
 */
function Viewport(centerX, centerY) {
  this.centerX = centerX || 0;
  this.centerY = centerY || 0;
}

/**
 * This is the factory method for creating a Viewport.
 * @return {Viewport}
 */
Viewport.create = function() {
  return new Viewport();
};

/**
 * This method updates the Viewport with the new absolute world coordinates
 * of its center.
 * @param {number} centerX The x coordinate of the center of the Viewport.
 * @param {number} centerY The y coordinate of the center of the Viewport.
 */
Viewport.prototype.setCenter = function(centerX, centerY) {
  this.centerX = centerX;
  this.centerY = centerY
};

/**
 * This method converts two absolute world coordinates to canvas coordinates
 * for drawing.
 * @param {number} centerX The x coordinate to convert.
 * @param {number} centerY The y coordinate to convert.
 * @return {Array<number>}
 */
Viewport.prototype.toCanvasCoords = function(x, y) {
  var translateX = this.centerX - Constants.CANVAS_WIDTH / 2;
  var translateY = this.centerY - Constants.CANVAS_HEIGHT / 2;
  return [x - translateX,
          Constants.CANVAS_HEIGHT - (y - translateY)];
};

/**
 * This method converts two canvas coordinates to absolute world coordinates
 * for calculations.
 * @param {number} x The x coordinate to convert.
 * @param {number} y The y coordinate to convert.
 * @return {Array<number>}
 */
Viewport.prototype.toAbsoluteCoords = function(x, y) {
  var translateX = this.centerX - Constants.CANVAS_WIDTH / 2;
  var translateY = this.centerY - Constants.CANVAS_HEIGHT / 2;
  return [x + translateX,
          (Constants.CANVAS_HEIGHT - y) + translateY];
};
