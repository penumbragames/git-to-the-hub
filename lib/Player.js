/**
 * @fileoverview This is a class encapsulating a Player on the server.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

var Entity = require('./Entity');
var Platform = require('./Platform');

var Constants = require('../shared/Constants');
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

  this.lastShotTime = 0;

  this.health = Constants.PLAYER_MAX_HEALTH;
  this.score = 0;
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
Player.MOVE_VELOCITY = 0.5;

/**
 * @const
 * @type {type}
 */
Player.JUMP_VELOCITY = 0.5;

/**
 * @const
 * @type {type}
 */
Player.DECELERATION = 0.01;

/**
 * @const
 * @type {number}
 */
Player.GRAVITY = -0.002;

/**
 * @const
 * @type {type}
 */
Player.HITBOX_SIZE = [50, 50];

/**
 * @const
 * @type {type}
 */
Player.SHOT_COOLDOWN = 800;

/**
 * This is a factory method for creating a Player object.
 * @param {string} id The socket ID of the player.
 * @param {string} name The name of the player (non-unique).
 * @return {Player}
 */
Player.create = function(id, name) {
  var positionX = Util.randRange(Constants.WORLD_MIN, Constants.WORLD_MAX);
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
    this.orientation = 0;
  } else if (keyboardState.right && !keyboardState.left) {
    this.setVX(Player.MOVE_VELOCITY);
    this.orientation = Math.PI;
  } else {
    this.setVX(0);
  }

  if (leftClick && this.canShoot()) {
    addProjectileCallback(this.position, mouseAngle);
    this.lastShotTime = (new Date()).getTime();
  }
};

/**
 * This method updates the position and state of the Player.
 * @param {Array<Platform>} platforms The platforms that we should check
 *   collisions against.
 */
Player.prototype.update = function(platforms) {
  this.parent.update.call(this);

  for (var i = 0; i < 2; ++i) {
    if (Math.abs(this.velocity[i]) < Player.DECELERATION) {
      this.acceleration[i] = 0;
    } else {
      this.acceleration[i] = -Util.getSign(this.velocity[i]) * (
        Player.DECELERATION);
    }
  }
  this.setAY(Player.GRAVITY);

  for (var platform of platforms) {
    if (this.isCollidedWith(platform) && this.getY() > platform.getY() && (
        this.getVY() < 0)) {
      this.setY(platform.getY() + platform.getHeight());
      this.setVX(0);
      this.setVY(0);
      this.isJumping = false;
    }
  }
};

/**
 * This method returns whether or not the player can shoot.
 * @return {boolean}
 */
Player.prototype.canShoot = function() {
  return this.lastShotTime + Player.SHOT_COOLDOWN < (new Date()).getTime();
};

/**
 * This method places the player back at the bottom of the map and resets
 * their health.
 */
Player.prototype.respawn = function() {
  this.setX(Util.randRange(Util.WORLD_MIN, Util.WORLD_MAX));
  this.health = Constants.PLAYER_MAX_HEALTH;
};

/**
 * This method returns whether or not the player is dead.
 * @return {boolean}
 */
Player.prototype.isDead = function() {
  return this.health <= 0;
};

/**
 * This line is needed on the server side since this is loaded as a module
 * into the node server.
 */
module.exports = Player;
