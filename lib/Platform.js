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
 * @param {Array<number>} position The position of the Platform.
 * @param {Array<number>} hitboxSize The hitbox size of the Platform.
 */
function Platform(position, hitboxSize) {
  this.position = position;
  this.hitboxSize = hitboxSize;
}
require('../shared/inheritable');
Platform.inheritsFrom(Entity);

/**
 * This is a factory method for creating a Platform object.
 * @param {Array<number>} position The position of the Platform.
 * @param {Array<number>} hitboxSize The hitbox size of the Platform.
 * @return {Platform}
 */
Platform.create = function(position, hitboxSize) {
  return new Platform(position, hitboxSize);
};

/**
 * This line is needed on the server side since this is loaded as a module
 * into the node server.
 */
module.exports = Platform;
