/**
 * @fileoverview This is a class encapsulating a Player on the server.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

var Entity = require('./Entity');

var Util = require('../shared/Util');

/**
 * This is the constructor for a Player class.
 * @constructor
 * @param {string} id The socket ID of the player.
 * @param {string} name The display name of the player.
 * @param {Array<number>} position The position of the player.
 */
function Player(id, name, position) {
  this.id = id;
  this.name = name;

  this.position = position;
  this.hitboxSize = Player.HITBOX_SIZE;

  this.gravity = Player.GRAVITY;

  this.isJumping = false;
  this.fallThrough = false;

  this.lastShotTime = 0;

  this.health = Player.MAX_HEALTH;
}
require('../shared/inheritable');
Player.inheritsFrom(Entity);

/**
 * @const
 * @type {number}
 */
Player.START_Y = 80;

/**
 * @const
 * @type {number}
 */
Player.MOVE_VELOCITY = 1;

/**
 * @const
 * @type {type}
 */
Player.JUMP_VELOCITY = 4;

/**
 * @const
 * @type {number}
 */
Player.GRAVITY = -0.001;

/**
 * @const
 * @type {type}
 */
Player.HITBOX_SIZE = 40;

/**
 * @const
 * @type {type}
 */
Player.SHOT_COOLDOWN = 800;

/**
 * @const
 * @type {type}
 */
Player.MAX_HEALTH = 10;

/**
 * This is a factory method for creating a Player object.
 * @param {string} id The socket ID of the player.
 * @param {string} name The name of the player (non-unique).
 * @return {Player}
 */
Player.create = function(id, name) {
  var positionX = Util.randRange(Util.WORLD_MIN, Util.WORLD_MAX);
  return new Player(id, name, [positionX, Player.START_Y]);
};

/**
 * This method updates the Player based on the input received from the client.
 * @param {Object} keyboardState The state of this player's keyboard.
 * @param {boolean} leftClick The state of this player's left click.
 * @param {number} mouseAngle The angle of the player's mouse relative to
 *   their sprite.
 * @param {function()} addProjectileCallback The callback function if the player
 *   has shot.
 */
Player.prototype.updateOnInput = function(keyboardState, leftClick, mouseAngle,
    addProjectileCallback) {
  if (keyboardState.up && !this.isJumping) {
    this.setVY(Player.JUMP_VELOCITY);
    this.isJumping = true;
  }
  if (keyboardState.left && !keyboardState.right) {
    this.setVX(-Player.MOVE_VELOCITY);
  } else if (keyboardState.right && !keyboardState.left) {
    this.setVX(Player.MOVE_VELOCITY);
  } else {
    this.setVX(0);
  }

  this.fallthrough = keyboardState.down;

  if (leftClick && this.canShoot()) {
    addProjectileCallback(this.position, mouseAngle);
    this.lastShotTime = (new Date()).getTime();
  }
};

/**
 * This method updates the position and state of the Player.
 * @param {Array<Projectile>} projectiles The Projectiles in existence on the
 *   server.
 */
Player.prototype.update = function(projectiles) {
  this.parent.update.call(this);
};

/**
 *
 */
Player.prototype.canShoot = function() {
  return this.lastShotTime + Player.SHOT_COOLDOWN > (new Date()).getTime();
};

/**
 * This line is needed on the server side since this is loaded as a module
 * into the node server.
 */
module.exports = Player;
