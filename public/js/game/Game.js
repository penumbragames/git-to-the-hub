/**
 * @fileoverview This is a class encapsulating the client side of the game,
 *   which handles the rendering of the game and the sending of
 *   user input to the server.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */
/**
 * Creates a Game on the client side to render the players and entities as
 * well as the player UI.
 * @constructor
 * @param {Object} socket The socket connected to the server.
 * @param {Input} inputHandler The Input object that will track user input.
 * @param {Drawing} drawing The Drawing object that will render the game.
 * @param {Viewport} viewport The Viewport object that will manage the player's
 *   current view.
 */
function Game(socket, inputHandler, drawing, viewport) {
  this.socket = socket;

  this.inputHandler = inputHandler;
  this.drawing = drawing;
  this.viewport = viewport;

  this.self = null;
  this.players = [];
  this.projectiles = [];
  this.platforms = [];
  
  this.animationFrameId = 0;
}

var x;
var clear = true;

/**
 * Factory method to create a Game object.
 * @param {Object} socket The Socket connected to the server.
 * @param {Element} canvasElement The canvas element that the game will use to
 *   draw to.
 * @return {Game}
 */
Game.create = function(socket, canvasElement) {
  canvasElement.width = Constants.CANVAS_WIDTH;
  canvasElement.height = Constants.CANVAS_HEIGHT;
  var canvasContext = canvasElement.getContext('2d');

  var inputHandler = Input.create(canvasElement);
  var drawing = Drawing.create(canvasContext);
  var viewport = Viewport.create();
  return new Game(socket, inputHandler, drawing, viewport);
};

/**
 * Initializes the Game object and its child objects as well as setting the
 * event handlers.
 */
Game.prototype.init = function() {
  this.socket.on('update', Util.bind(this, function(data) {
    this.receiveGameState(data);
  }));
};

/**
 * This method begins the animation loop for the game.
 */
Game.prototype.animate = function() {
  this.animationFrameId = window.requestAnimationFrame(
      Util.bind(this, this.update));
};

/**
 * This method stops the animation loop for the game.
 */
Game.prototype.stopAnimation = function() {
  window.cancelAnimationFrame(this.animationFrameId);
};

/**
 * Updates the game's internal storage of all the powerups, called each time
 * the server sends packets.
 * @param {Object} state The game state received from the server.
 */
Game.prototype.receiveGameState = function(state) {
  this.self = state['self'];
  this.players = state['players'];
  this.projectiles = state['projectiles'];
  this.platforms = state['platforms'];
  x = this.platforms;
  this.viewport.setCenter(this.self['position']);
};

/**
 * Updates the state of the game client side and relays intents to the
 * server.
 */
Game.prototype.update = function() {
  if (this.self) {
    var input = this.inputHandler;
    
    // Emits an event for the containing the player's intention to the server.
    var packet = {
      keyboardState: {
        left: input.left,
        right: input.right,
        up: input.up,
        down: input.down
      },
      
      mouseCoords: input.mouseCoords,
      leftClick: input.leftClick
    };
    
    this.socket.emit('player-action', packet);
  }

  this.draw();
  this.animate();
};

/**
 * Draws the state of the game using the internal Drawing object.
 */
Game.prototype.draw = function() {
  // Clear the canvas.
  if (clear) {
    this.drawing.clear();
  }
  
  for (var i = 0; i < this.players.length; i++) {
    var position = this.viewport.toCanvasCoords(this.players[i]['position']);
    this.drawing.drawPlayer(position[0],
                            position[1] - this.players[i]['hitboxSize'][1], // adding height to allow bottom-left coordinate system
                            this.players[i]['hitboxSize'][0],
                            this.players[i]['hitboxSize'][1],
                            this.players[i]['orientation'],
                            this.players[i]['health'],
                            this.players[i]['name'],
                            false);
  }

  for (var i = 0; i < this.projectiles.length; i++) {
    var position = this.viewport.toCanvasCoords(this.projectiles[i]['position']);
    this.drawing.drawProjectile(position[0],
                                position[1] - this.projectiles[i]['hitboxSize'][1],
                                this.projectiles[i]['hitboxSize'][0],
                                this.projectiles[i]['hitboxSize'][1],
                                this.projectiles[i]['orientation']);
  }

  for (var i = 0; i < this.platforms.length; i++) {
    var position = this.viewport.toCanvasCoords(this.platforms[i]['position']);
    this.drawing.drawPlatform(position[0],
                              position[1] - this.platforms[i]['hitboxSize'][1],
                              this.platforms[i]['hitboxSize'][0],
                              this.platforms[i]['hitboxSize'][1]);
  }
  
  if (this.self) {
    var position = this.viewport.toCanvasCoords(this.self['position']);
    this.drawing.drawPlayer(position[0],
                            position[1] - this.self['hitboxSize'][1],
                            this.self['hitboxSize'][0],
                            this.self['hitboxSize'][1],
                            this.self['orientation'],
                            this.self['health'],
                            this.self['name'],
                            true);
  }
};
