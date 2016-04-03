/**
 * @fileoverview This class encapsulates an active game on the server and
 *   handles the updating of the players and entities in the game.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

var HashMap = require('hashmap');

var Player = require('./Player');

var Util = require('../shared/Util');

/**
 * Constructor for the server side Game class.
 * Instantiates the data structures to track all the objects
 * in the game.
 * @constructor
 * @param {Object} io The Socket.IO server.
 */
function Game(io) {
  this.io = io;

  /**
   * This is a hashmap containing all the connected socket ids and the players
   * associated with them.
   */
  this.players = new HashMap();

  this.bullets = new HashMap();
}

/**
 * Factory method for creating a Game.
 * @param {Object} io The Socket.IO server.
 * @return {Game}
 */
Game.create = function(io) {
  return new Game(io);
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
 * Updates the player with the given ID according to the
 * input state sent by that player's client.
 * @param {string} id The socket ID of the player.
 * @param {Object} data The packet sent by the player's client.
 */
Game.prototype.updatePlayerOnInput = function(id, data) {
  this.players.get(id).updateOnInput(data);
};

/**
 * Sends the state of the game to all the connected sockets after
 * filtering them appropriately.
 */
Game.prototype.sendState = function() {
  this.players.forEach(Util.bind(this, function(currentPlayer, socketId) {
    this.io.to(socketId).emit('update', {
      self: currentPlayer,
      players: this.players.filter(function(player) {
        return player.isVisibleTo(currentPlayer) && (
            player.id != currentPlayer.id);
      }),
      bullets: this.bullets.values().filter(function(bullet) {
        return bullet.isVisibleTo(currentPlayer);
      })
    });
  }));

};

/**
 * This line is needed on the server side since this is loaded as a module
 * into the node server.
 */
module.exports = Game;
