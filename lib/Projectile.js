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
Player.inheritsFrom(Entity);

/**
 * @const
 * @type {number}
 */
Projectile.VELOCITY = 4;

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
 * TODO
 */
Projectile.prototype.update = function() {
  this.parent.update.call(this);
};