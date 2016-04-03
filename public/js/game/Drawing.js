/**
 * Methods for drawing all the sprites onto the HTML5 canvas. All coordinates
 * passed the methods of the Drawing class should be canvas coordinates and not
 * absolute game coordinates. They must be passed through the Viewport class
 * before coming into the Drawing class.
 * @author kennethli.3470@gmail.com (Kenneth Li)
 */

/**
 * Creates a Drawing object.
 * @param {CanvasRenderingContext2D} context The context this object will
 *   draw to.
 * @constructor
 */
function Drawing(context, selfPlayerImg, otherPlayerImg,
                 projectileImg, platformImg, backgroundImg) {
  this.context = context;
  this.selfPlayerImg = selfPlayerImg;
  this.otherPlayerImg = otherPlayerImg;
  this.projectileImg = projectileImg;
  this.platformImg = platformImg;
  this.backgroundImg = backgroundImg;
}

/**
 * @const
 * @type {string}
 */
Drawing.BASE_IMG_URL = '/public/img/';
Drawing.SELF_PLAYER_LEFT_SRC = Drawing.BASE_IMG_URL + 'self-player-left.png';
Drawing.SELF_PLAYER_RIGHT_SRC = Drawing.BASE_IMG_URL + 'self-player-right.png';
Drawing.OTHER_PLAYER_LEFT_SRC = Drawing.BASE_IMG_URL + 'other-player-left.png';
Drawing.OTHER_PLAYER_RIGHT_SRC = Drawing.BASE_IMG_URL + 'other-player-right.png';
Drawing.PROJECTILE_SRC = Drawing.BASE_IMG_URL + 'projectile.png';
Drawing.PLATFORM_SRC = Drawing.BASE_IMG_URL + 'platform.png';
Drawing.BACKGROUND_SRC = Drawing.BASE_IMG_URL + 'background.png';

/**
 * This is a factory method for creating a Drawing object.
 * @param {CanvasRenderingContext2D} context The context this object will
 *   draw to.
 * @return {Drawing}
 */
Drawing.create = function(context) {
  var selfPlayerImg = [Drawing.createImage(Drawing.SELF_PLAYER_LEFT_SRC, 0, 0),
                       Drawing.createImage(Drawing.SELF_PLAYER_RIGHT_SRC, 0, 0)];
  var otherPlayerImg = [Drawing.createImage(Drawing.OTHER_PLAYER_LEFT_SRC, 0, 0),
                        Drawing.createImage(Drawing.OTHER_PLAYER_RIGHT_SRC, 0, 0)];
  var projectileImg = Drawing.createImage(Drawing.PROJECTILE_SRC, 0, 0);
  var platformImg = Drawing.createImage(Drawing.PLATFORM_SRC, 0, 0);
  var backgroundImg = Drawing.createImage(Drawing.BACKGROUND_SRC, 0, 0);

  return new Drawing(context, selfPlayerImg, otherPlayerImg,
                     projectileImg, platformImg, backgroundImg);
};

/**
 * This method creates and returns an Image object.
 * @param {string} src The path to the image
 * @param {number} width The width of the image in pixels
 * @param {number} height The height of the image in pixels
 * @return {Image}
 */
Drawing.createImage = function(src, width, height) {
  var image = new Image(width, height);
  image.src = src;
  return image;
};

/**
 * Clears the canvas context.
 */
Drawing.prototype.clear = function() {
  this.context.clearRect(
      0, 0, Constants.CANVAS_WIDTH, Constants.CANVAS_HEIGHT);
};

/**
 * Draws a player onto the canvas.
 * @param {number} x The x coordinate of the player in canvas coordinates
 * @param {number} y The y coordinate of the player in canvas coordinates
 * @param {number} width The width of the player
 * @param {number} height The height of the player
 * @param {number} health The health of the player
 * @param {string} name The name of the player
 * @param {boolean} self True if the player is the self player, otherwise false
 */
Drawing.prototype.drawPlayer = function(x, y, width, height, orientation, health, name, self) {
  if (self) {
    if (orientation == 0) {
      this.context.drawImage(this.selfPlayerImg[0], x, y, width, height);
    } else {
      this.context.drawImage(this.selfPlayerImg[1], x, y, width, height);
    }
  } else {
    if (orientation == 0) {
      this.context.drawImage(this.otherPlayerImg[0], x, y, width, height);
    } else {
      this.context.drawImage(this.otherPlayerImg[1], x, y, width, height);
    }
  }

  var healthX = x + width / 2 - Constants.PLAYER_MAX_HEALTH / 2 * 10;
  var healthY = y - 15;
  
  for (var i = 0; i < Constants.PLAYER_MAX_HEALTH; i++) {
    if (i < health) {
      this.context.fillStyle = 'green';
    } else {
      this.context.fillStyle = 'red';
    }

    this.context.fillRect(healthX, healthY, 10, 10);
    healthX += 10;
  }

  var nameX = x + width / 2;
  var nameY = y - 25;
  
  this.context.font = '16px Consolas';
  this.context.textAlign = 'center';
  this.context.fillText(name, nameX, nameY);
};

Drawing.prototype.drawProjectile = function(x, y, width, height, orientation) {
  this.context.save();
  this.context.translate(x, y);
  this.context.rotate(orientation);
  this.context.drawImage(this.projectileImg, x, y, width, height);
  this.context.restore();
};

Drawing.prototype.drawPlatform = function(x, y, width, height) {
  this.context.drawImage(this.platformImg, x, y, width, height);
};

Drawing.prototype.drawBackground = function() {
  this.context.fillStyle = this.context.createPattern(this.backgroundImg, 'repeat');
  this.context.fillRect(0, 0, Constants.CANVAS_WIDTH, Constants.CANVAS_HEIGHT);
}

/**
 * Draws a circle on the canvas.
 * @param {number} x The x coordinate of the center.
 * @param {number} y The y coordinate of the center.
 * @param {number} r The radius of he circle.
 * @param {string} color The color of the circle.
 */
Drawing.prototype.drawCircle = function(x, y, r, color) {
  this.context.beginPath();
  this.context.arc(x, y, r, 0, 2 * Math.PI, false);
  this.context.fillStyle = color;
  this.context.fill();
}
