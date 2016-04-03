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
 * @param {number} x The x coordinate of this Player.
 * @param {number} y The y coordinate of this Player.
 */
function Player(id, name, x, y) {
  this.id = id;
  this.name = name;

  this.x = x;
  this.y = y;
  this.width = Player.HITBOX_WIDTH;
  this.height = Player.HITBOX_HEIGHT;

  this.gravity = Player.GRAVITY;

  this.isJumping = false;

  this.lastShotTime = 0;

  this.health = Constants.PLAYER_MAX_HEALTH;

  this.scoringTime = 0;
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
Player.JUMP_VELOCITY = 0.4;

/**
 * @const
 * @type {type}
 */
Player.DECELERATION = 0.01;

/**
 * @const
 * @type {number}
 */
Player.GRAVITY = -0.001;

/**
 * @const
 * @type {number}
 */
Player.HITBOX_WIDTH = 50;

/**
 * @const
 * @type {number}
 */
Player.HITBOX_HEIGHT = 60;

/**
 * @const
 * @type {number}
 */
Player.SHOT_COOLDOWN = 800;

/**
 * This is a factory method for creating a Player object.
 * @param {string} id The socket ID of the player.
 * @param {string} name The name of the player (non-unique).
 * @return {Player}
 */
Player.create = function(id, name) {
  var positionX = Util.randRange(Constants.WORLD_MIN,
                                 Constants.WORLD_MAX - Player.HITBOX_WIDTH);
  return new Player(id, name, positionX, Player.START_Y);
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
    this.vy = Player.JUMP_VELOCITY;
    this.isJumping = true;
  }
  if (keyboardState.left && !keyboardState.right) {
    this.vx = -Player.MOVE_VELOCITY;
    this.orientation = 0;
  } else if (keyboardState.right && !keyboardState.left) {
    this.vx = Player.MOVE_VELOCITY;
    this.orientation = Math.PI;
  } else {
    this.vx = 0;
  }

  if (leftClick && this.canShoot()) {
    var centerPoint = this.getCenterPoint();
    addProjectileCallback(centerPoint[0], centerPoint[1], mouseAngle);
    this.lastShotTime = (new Date()).getTime();
  }
};

/**
 * This method updates the position and state of the Player.
 * @param {Array<Platform>} platforms The platforms that we should check
 *   collisions against.
 * @param {Entity} goalArea The goal area in which the player is considered
 *   scoring.
 * @param {function()} playerScoreCallback The callback function to call
 *   when the player scores.
 */
Player.prototype.update = function(platforms, goalArea,
                                   playerScoreCallback) {
  this.parent.update.call(this);

  this.x = Util.bound(
      this.x, Constants.WORLD_MIN, Constants.WORLD_MAX - this.width);
  this.y = Util.bound(
      this.y, Constants.WORLD_MIN, Constants.WORLD_MAX - this.height);

  if (Math.abs(this.vx) < Player.DECELERATION) {
    this.ax = 0;
  } else {
    this.ax = -Util.getSign(this.vx) * Player.DECELERATION;
  }
  if (Math.abs(this.vy) < Player.DECELERATION) {
    this.ay = 0;
  } else {
    this.ay = -Util.getSign(this.vy) * Player.DECELERATION;
  }
  this.ay = Player.GRAVITY;

  for (var platform of platforms) {
    if (this.isCollidedWith(platform) && this.y > platform.y && this.vy < 0) {
      if (Math.abs(this.vy) > 0.85) {
        this.health -= Math.round(Math.abs(this.vy) * 2);
      }
      this.y = platform.y + platform.height;
      this.vx = 0;
      this.vy = 0;
      this.isJumping = false;
    }
  }

  if (this.isCollidedWith(goalArea)) {
    this.scoreTime += this.updateTimeDifference;
  } else {
    this.scoreTime = 0;
  }
  if (this.scoreTime > 1000) {
    this.score += 1000;
    this.scoreTime = 0;
    var centerPoint = this.getCenterPoint();
    playerScoreCallback(centerPoint[0], centerPoint[1]);
  }

  if (this.isDead()) {
    this.respawn();
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
  this.x = Util.randRange(Constants.WORLD_MIN, Constants.WORLD_MAX);
  this.y = Player.START_Y;
  this.vx = 0;
  this.vy = 0;
  this.health = Constants.PLAYER_MAX_HEALTH;
  this.score -= 10000;
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
