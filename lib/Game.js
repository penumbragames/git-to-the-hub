/**
 * @fileoverview This class encapsulates an active game on the server and
 *   handles the updating of the players and entities in the game.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

var HashMap = require('hashmap');

var Entity = require('./Entity');
var Map = require('./Map');
var Platform = require('./Platform');
var Player = require('./Player');
var Projectile = require('./Projectile');

var Constants = require('../shared/Constants');
var Util = require('../shared/Util');

/**
 * Constructor for the server side Game class.
 * Instantiates the data structures to track all the objects
 * in the game.
 * @constructor
 * @param {Object} io The Socket.IO server.
 * @param {Array<Platform>} platforms The existing Platforms, since they will
 *   be initialized in the factory method and will not be modified.
 * @param {Entity} goalArea The area in which the player should be in order
 *   to score.
 */
function Game(io, platforms, goalArea) {
  this.io = io;

  /**
   * This is a hashmap containing all the connected socket ids and the players
   * associated with them.
   * @type {HashMap}
   */
  this.players = new HashMap();

  /**
   * This is a list containing all the existing Projectiles.
   * @type {Array<Projectile>}
   */
  this.projectiles = [];

  /**
   * This is a list containing all the existing Platforms.
   * @type {Array<Platform>}
   */
  this.platforms = platforms;

  this.goalArea = goalArea;
}

/**
 * Factory method for creating a Game.
 * @param {Object} io The Socket.IO server.
 * @return {Game}
 */
Game.create = function(io) {
  // Map.MAP.map LOL
  var platforms = Map.generateMap().map(function(current, index, array) {
    return Platform.create(current[0], current[1], current[2], current[3]);
  });
  var goalArea = new Entity(Constants.SCORING_REGION[0],
                            Constants.SCORING_REGION[1], 0, 0, 0, 0,
                            Constants.SCORING_REGION[2],
                            Constants.SCORING_REGION[3], 0);
  return new Game(io, platforms, goalArea);
};

/**
 * Creates a new player with the given name and ID.
 * @param {string} id The socket ID of the player.
 * @param {string} name The display name of the player.
 */
Game.prototype.addNewPlayer = function(id, name) {
  this.players.set(id, Player.create(id, name));
};

/**
 * Removes the player with the given socket ID and returns the name of the
 * player removed.
 * @param {string} id The socket ID of the player.
 */
Game.prototype.removePlayer = function(id) {
  this.players.remove(id);
};

/**
 * This method updates the player with the given ID according to the
 * input state sent by that player's client.
 * @param {string} id The socket ID of the player.
 * @param {Object} data The packet sent by the player's client.
 */
Game.prototype.updatePlayerOnInput = function(id, data) {
  var player = this.players.get(id);
  if (player) {
    player.updateOnInput(data.keyboardState, data.leftClick, data.mouseAngle,
        Util.bind(this, function(x, y, orientation) {
          this.projectiles.push(Projectile.create(id, x, y, orientation));
        }));
  }
};

/**
 * This method updates the internal state of the game.
 */
Game.prototype.update = function() {
  var context = this;

  this.players.forEach(function(player, id) {
    player.update(context.platforms, context.goalArea, function(x, y) {
      context.io.sockets.emit('floater-text', {
        x: x,
        y: y,
        text: 'git commit',
        frameCount: 0
      });
    });
  });

  for (var i = 0; i < this.projectiles.length; ++i) {
    if (this.projectiles[i].shouldExist) {
      var otherProjectiles = this.projectiles.slice(0, i).concat(
          this.projectiles.slice(i + 1));
      this.projectiles[i].update(this.players.values(), otherProjectiles,
          function(x, y) {
            context.io.sockets.emit('floater-text', {
              x: x,
              y: y,
              text: 'git push',
              frameCount: 0
            });
          },
          function(x, y) {
            context.io.sockets.emit('floater-text', {
              x: x,
              y: y,
              text: 'git merge',
              frameCount: 0
            });
          });
    } else {
      this.projectiles.splice(i, 1);
      i--;
    }
  }
};

/**
 * Sends the state of the game to all the connected sockets after
 * filtering them appropriately.
 */
Game.prototype.sendState = function() {
  var players = this.players.values().sort(function(player1, player2) {
    return player2.score - player1.score;
  }).slice(0, 10);

  this.players.forEach(Util.bind(this, function(currentPlayer, socketId) {
    this.io.to(socketId).emit('update', {
      leaderboard: players,
      self: currentPlayer,
      players: this.players.values().filter(function(player) {
        return player.isVisibleTo(currentPlayer) && (
            player.id != currentPlayer.id);
      }),
      projectiles: this.projectiles.filter(function(projectile) {
        return projectile.isVisibleTo(currentPlayer);
      }),
      platforms: this.platforms
    });
  }));

};

/**
 * This line is needed on the server side since this is loaded as a module
 * into the node server.
 */
module.exports = Game;
