/**
 * @fileoverview This is a class encapsulating a platform that players.
 *   can jump on.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

var Entity = require('./Entity');

var Util = require('../shared/Util');

/**
 * This is the constructor for a Platform object.
 * @constructor
 * @param {number} x The x coordinate of this Platform.
 * @param {number} y The y coordinate of this Platform.
 * @param {number} width The width of this Platform.
 * @param {number} height The height of this Platform.
 */
function Platform(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
}
require('../shared/inheritable');
Platform.inheritsFrom(Entity);

/**
 * This is a factory method for creating a Platform object.
 * @param {number} x The x coordinate of this Platform.
 * @param {number} y The y coordinate of this Platform.
 * @param {number} width The width of this Platform.
 * @param {number} height The height of this Platform.
 * @return {Platform}
 */
Platform.create = function(x, y, width, height) {
  return new Platform(x, y, width, height);
};

/**
 * This line is needed on the server side since this is loaded as a module
 * into the node server.
 */
module.exports = Platform;
