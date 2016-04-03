/**
 * @fileoverview This is a class encapsulating a Player on the server.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

var Entity = require('./lib/Entity');

var Util = require('../shared/Util');

/**
 * This is the constructor for a Player class.
 * @constructor
 */
function Player(id, name, position) {
  this.position = position;

  this.id = id;
  this.name = name;
}
require('../shared/inheritable');
Player.inheritsFrom(Player);

/**
 * @const
 * @type {number}
 */
Player.START_Y = 2450;

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
