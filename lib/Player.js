/**
 * @fileoverview This is a class encapsulating a Player on the server.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

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

Player.create = function(name) {
  return new Player([0, 0], name);
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
