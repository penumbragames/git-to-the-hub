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
  this.floaters = [];

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

  this.socket.on('floater-text', Util.bind(this, function(data) {
    this.floaters.push(data);
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
};

/**
 * Updates the state of the game client side and relays intents to the
 * server.
 */
Game.prototype.update = function() {
  if (this.self) {
    this.viewport.setCenter(this.self['x'], this.self['y']);
    var input = this.inputHandler;

    // Emits an event for the containing the player's intention to the server.
    var packet = {
      keyboardState: {
        left: input.left,
        right: input.right,
        up: input.up,
        down: input.down
      },

      mouseAngle: Math.atan2(-(input.mouseCoords[1] - Constants.CANVAS_HEIGHT / 2),
                             input.mouseCoords[0] - Constants.CANVAS_WIDTH / 2),
      leftClick: input.leftClick
    };

    this.socket.emit('player-action', packet);
  }

  for (var i = 0; i < this.floaters.length; i++) {
    this.floaters[i]['frameCount']++;
    this.floaters[i]['y'] += 3;

    if (this.floaters[i]['frameCount'] > 60) {
      this.floaters.splice(i, 1);
    }
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

  this.drawing.drawBackground();

  x = Constants.SCORING_REGION;
  var goalCoords = this.viewport.toCanvasCoords(Constants.SCORING_REGION_DRAW[0],
                                                Constants.SCORING_REGION_DRAW[1]);
  this.drawing.drawGoal(goalCoords[0], goalCoords[1],
                        Constants.SCORING_REGION_DRAW[2],
                        Constants.SCORING_REGION_DRAW[3]);
  
  for (var i = 0; i < this.platforms.length; i++) {
    var position = this.viewport.toCanvasCoords(
        this.platforms[i]['x'], this.platforms[i]['y']);
    this.drawing.drawPlatform(position[0],
                              position[1] - this.platforms[i]['height'],
                              this.platforms[i]['width'],
                              this.platforms[i]['height']);
  }

  if (this.self) {
    var position = this.viewport.toCanvasCoords(
      this.self['x'], this.self['y']);
    this.drawing.drawPlayer(position[0],
                            position[1] - this.self['height'],
                            this.self['width'],
                            this.self['height'],
                            this.self['orientation'],
                            this.self['health'],
                            this.self['name'],
                            true);
  }

  for (var i = 0; i < this.players.length; i++) {
    var position = this.viewport.toCanvasCoords(
      this.players[i]['x'], this.players[i]['y']);
    // adding height to allow bottom-left coordinate system
    this.drawing.drawPlayer(position[0],
                            position[1] - this.players[i]['height'],
                            this.players[i]['width'],
                            this.players[i]['height'],
                            this.players[i]['orientation'],
                            this.players[i]['health'],
                            this.players[i]['name'],
                            false);
  }
  
  for (var i = 0; i < this.projectiles.length; i++) {
    var position = this.viewport.toCanvasCoords(
      this.projectiles[i]['x'], this.projectiles[i]['y']);
    if (this.projectiles[i]['shouldExist']) {
      x = position[0] + " " + (position[1] - this.projectiles[i]['height']) + " " +
        this.projectiles[i]['width'] + " " + this.projectiles[i]['height'] + " " +
        this.projectiles[i]['orientation'];
    }
    this.drawing.drawProjectile(position[0],
                                position[1] - this.projectiles[i]['height'],
                                this.projectiles[i]['width'],
                                this.projectiles[i]['height'],
                                this.projectiles[i]['orientation']);
  }

  for (var i = 0; i < this.floaters.length; i++) {
    var position = this.viewport.toCanvasCoords(
      this.floaters[i]['x'], this.floaters[i]['y']);
    this.drawing.drawFloater(position[0],
                             position[1],
                             this.floaters[i]['frameCount'],
                             this.floaters[i]['text']);
  }
};
