/**
 * @fileoverview This is class encapsulating a Projectile on the server.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

var Entity = require('./Entity');

var Constants = require('../shared/Constants');
var Util = require('../shared/Util');

/**
 * This is the constructor for a Projectile class.
 * @constructor
 * @param {string} ownerId The socket ID of the player that shot this
 *   Projectile.
 * @param {number} x The x coordinate of this Projectile.
 * @param {number} y The y coordinate of this Projectile.
 * @param {number} vx The velocity in the x direction of this Projectile.
 * @param {number} vy The velocity in the y direction of this Projectile.
 * @param {Array<number>} orientation The orientation of this Projectile.
 */
function Projectile(ownerId, x, y, vx, vy, orientation) {
  this.ownerId = ownerId;
  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;
  this.orientation = orientation;

  this.hitboxSize = Projectile.HITBOX_SIZE;

  this.shouldExist = true;
}
require('../shared/inheritable');
Projectile.inheritsFrom(Entity);

/**
 * @const
 * @type {number}
 */
Projectile.VELOCITY = 1;

/**
 * @const
 * @type {number}
 */
Projectile.PUSH_VELOCITY = 1;

/**
 * @const
 * @type {Array<number>}
 */
Projectile.HITBOX_SIZE = [10, 10];

/**
 * This is a factory method for creating a Projectile object.
 * @param {string} ownerId The socket ID of the player that shot this
 *   Projectile.
 * @param {number} x The x coordinate of this Projectile.
 * @param {number} y The y coordinate of this Projectile.
 * @return {Projectile}
 */
Projectile.create = function(ownerId, x, y, orientation) {
  var vx = Projectile.VELOCITY * Math.cos(orientation);
  var vy = Projectile.VELOCITY * Math.sin(orientation);
  return new Projectile(ownerId, x, y, vx, vy, orientation);
};

/**
 * This method updates the Projectile and does collision detection against
 * the connected players.
 * @param {Array<Player>} players The list of players to do collsion detection
 *   against.
 */
Projectile.prototype.update = function(players) {
  this.parent.update.call(this);

  if (!Util.inBound(this.x, Constants.WORLD_MIN, Constants.WORLD_MAX) &&
      !Util.inBound(this.y, Constants.WORLD_MIN, Constants.WORLD_MAX)) {
    this.shouldExist = false;
  }

  for (var player of players) {
    if (this.isCollidedWith(player) && this.ownerId != player.id) {
      player.health--;
      this.shouldExist = false;
      var thisCenter = this.getCenterPoint();
      var playerCenter = player.getCenterPoint();
      var angle = Math.atan2(playerCenter[1] - thisCenter[1],
                             playerCenter[0] - thisCenter[0]);
      player.vx += Projectile.PUSH_VELOCITY * Math.cos(angle);
      player.vy += Projectile.PUSH_VELOCITY * Math.sin(angle);
    }
  }
};

/**
 * This line is needed on the server side since this is loaded as a module
 * into the node server.
 */
module.exports = Projectile;
