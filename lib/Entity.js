/**
 * @fileoverview This is a wrapper class for all entities on the server.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

var Constants = require('../shared/Constants');
var Util = require('../shared/Util');

/**
 * All entities will inherit from this class.
 * @constructor
 * @param {?number=} x The x coordinate of this Entity.
 * @param {?number=} y The y coordinate of this Entity.
 * @param {?number=} vx The velocity in the x direction of this Entity.
 * @param {?number=} vy The velocity in the y direction of this Entity.
 * @param {?number=} ax The acceleration in the x direction of this Entity.
 * @param {?number=} ay The acceleration in the y direction of this Entity.
 * @param {?number=} width The width of this Entity.
 * @param {?number=} height The height of this Entity.
 * @param {?number=} orientation The orientation of this Entity in radians.
 */
function Entity(x, y, vx, vy, ax, ay, width, height, orientation) {
  this.x = x || 0;
  this.y = y || 0;
  this.vx = vx || 0;
  this.vy = vy || 0;
  this.ax = ax || 0;
  this.ay = ay || 0;
  this.width = width || 0;
  this.height = height || 0;

  this.orientation = orientation || 0;

  this.lastUpdateTime = 0;
  this.updateTimeDifference = 0;
}

/**
 * This method returns the coordinates of the center of the Entity.
 * @return {Array<number>}
 */
Entity.prototype.getCenterPoint = function() {
  return [
    this.x + this.width / 2,
    this.y + this.height / 2
  ];
};

/**
 * Returns true if this entity has collided with the given entity using
 * AABB collision detection.
 * @param {Entity} other The entity to check collision against.
 * @return {boolean}
 */
Entity.prototype.isCollidedWith = function(other) {
  var thisCenter = this.getCenterPoint();
  var otherCenter = other.getCenterPoint();
  var xDifference = Math.abs(thisCenter[0] - otherCenter[0]);
  var yDifference = Math.abs(thisCenter[1] - otherCenter[1]);
  return xDifference < (this.width / 2 + other.width / 2) &&
      yDifference < (this.height / 2 + other.height / 2);
};

/**
 * Returns true if this entity is visible to the given player.
 * @param {Player} player The player to check visibility to.
 * @return {boolean}
 */
Entity.prototype.isVisibleTo = function(player) {
  return Util.inBound(
      this.x,
      player.x - Constants.VISIBILITY_THRESHOLD_X,
      player.x + Constants.VISIBILITY_THRESHOLD_X) && Util.inBound(
      this.y,
      player.y - Constants.VISIBILITY_THRESHOLD_Y,
      player.y + Constants.VISIBILITY_THRESHOLD_Y);
};

/**
 * Updates the entity's position based on its velocity according to
 * the amount of time the passed between this update and the last
 * update.
 */
Entity.prototype.update = function() {
  var currentTime = (new Date()).getTime();
  if (this.lastUpdateTime == 0) {
    this.updateTimeDifference = 0;
  } else {
    this.updateTimeDifference = currentTime - this.lastUpdateTime;
  }
  this.x += this.vx * this.updateTimeDifference;
  this.y += this.vy * this.updateTimeDifference;
  this.vx += this.ax * this.updateTimeDifference;
  this.vy += this.ay * this.updateTimeDifference;
  this.lastUpdateTime = currentTime;
};

/**
 * This line is needed on the server side since this is loaded as a module
 * into the node server.
 */
module.exports = Entity;
