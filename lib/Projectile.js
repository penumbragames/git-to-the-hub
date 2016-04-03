/**
 * @fileoverview This is class encapsulating a Projectile on the server.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

var Entity = require('./Entity');

var Util = require('../shared/Util');

/**
 * This is the constructor for a Projectile class.
 * @constructor
 * @param {string} ownerId The socket ID of the player that shot this
 *   Projectile.
 * @param {Array<number>} position The starting position of this Projectile.
 * @param {Array<number>} velocity The velocity of this Projectile.
 * @param {Array<number>} orientation The orientation of this Projectile.
 */
function Projectile(ownerId, position, velocity, orientation) {
  this.ownerId = ownerId;
  this.position = position;
  this.orientation = orientation;

  this.shouldExist = true;
}
require('../shared/inheritable');
Projectile.inheritsFrom(Entity);

/**
 * @const
 * @type {number}
 */
Projectile.VELOCITY = 4;

/**
 * @const
 * @type {type}
 */
Projectile.PUSH_VELOCITY = 2;

/**
 * This is a factory method for creating a Projectile object.
 * @param {string} ownerId The socket ID of the player that shot this
 *   Projectile.
 * @param {Array<number>} position The starting position of this Projectile.
 * @param {Array<number>} orientation The orientation of this Projectile.
 * @return {Projectile}
 */
Projectile.create = function(ownerId, position, orientation) {
  var velocity = [
    Projectile.VELOCITY * Math.cos(orientation),
    Projectile.VELOCITY * Math.sin(orientation)
  ];
  return new Projectile(ownerId, position, velocity, orientation);
};

/**
 * This method updates the Projectile and does collision detection against
 * the connected players.
 * @param {Array<Player>} players The list of players to do collsion detection
 *   against.
 */
Projectile.prototype.update = function(players) {
  this.parent.update.call(this);

  if (!Util.inBound(this.getX(), Constants.WORLD_MIN, Constants.WORLD_MAX) &&
      !Util.inBound(this.getY(), Constants.WORLD_MIN, Constants.WORLD_MAX)) {
    this.shouldExist = false;
  };

  for (var player in players) {
    if (this.isCollidedWith(player)) {
      player.health--;
      this.shouldExist = false;
      var thisCenter = this.getCenterPoint();
      var playerCenter = player.getCenterPoint();
      var angle = Math.atan2(playerCenter[1] - thisCenter[1],
                             playerCenter[0] - thisCenter[0]);
      player.setVX(
          player.getVX() + Projectile.PUSH_VELOCITY * Math.cos(angle));
      player.setVY(
          player.getVY() + Projectile.PUSH_VELOCITY * Math.sin(angle));
    }
  }
};
