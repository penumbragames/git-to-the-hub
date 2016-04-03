/**
 * @fileoverview This is class encapsulating a Bullet on the server.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

var Entity = require('./Entity');

var Util = require('../shared/Util');

/**
 * This is the constructor for a Bullet class.
 * @constructor
 * @param {string} owner The socket ID of the player that shot this Bullet.
 * @param {Array<number>} position The starting position of this Bullet.
 * @param {Array<number>} velocity The velocity of this Bullet.
 * @param {Array<number>} orientation The orientation of this Bullet.
 */
function Bullet(owner, position, velocity, orientation) {
  this.owner = owner;
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
Bullet.VELOCITY = 4;

/**
 * This is a factory method for creating a Bullet object.
 * @param {string} owner The socket ID of the player that shot this Bullet.
 * @param {Array<number>} position The starting position of this Bullet.
 * @param {Array<number>} orientation The orientation of this Bullet.
 * @return {Bullet}
 */
Bullet.create = function(owner, position, orientation) {
  var velocity = [
    Bullet.VELOCITY * Math.cos(orientation),
    Bullet.VELOCITY * Math.sin(orientation)
  ];
  return new Bullet(owner, position, velocity, orientation);
};

/**
 * TODO
 */
Bullet.prototype.update = function() {

};
