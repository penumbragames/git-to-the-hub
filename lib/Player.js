/**
 * @fileoverview This is a class encapsulating a Player on the server.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

var Entity = require('./Entity');

var Util = require('../shared/Util');

/**
 * This is the constructor for a Player class.
 * @constructor
 */
function Player(id, name, position) {
  this.id = id;
  this.name = name;

  this.position = position;
  this.hitboxSize = Player.HITBOX_SIZE;
  this.gravity = Player.GRAVITY;
}
require('../shared/inheritable');
Player.inheritsFrom(Player);

/**
 * @const
 * @type {number}
 */
Player.START_Y = 80;

/**
 * @const
 * @type {number}
 */
Player.GRAVITY = 0.001;

/**
 * @const
 * @type {type}
 */
Player.HITBOX_SIZE = 40;

/**
 * Factory method for creating a Player object.
 * @param {string} id The socket ID of the player.
 * @param {string} name The name of the player (non-unique).
 * @return {Player}
 */
Player.create = function(id, name) {
  var positionX = Util.randRange(Util.WORLD_MIN, Util.WORLD_MAX);
  return new Player(id, name, [positionX, Player.START_Y]);
};

/**
 *
 */
Player.prototype.updateOnInput = function(keyboardState) {

};

/**
 *
 */
Player.prototype.update = function() {

};
