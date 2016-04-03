/**
 * This class handles the rendering and updating of the leaderboard.
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
 */

/**
 * Constructor for the Leaderboard object.
 * @constructor
 * @param {Element} The container element of the leaderboard. This
 *   element should be an unordered list.
 */
function Leaderboard(element) {
  this.element = element;

  this.players = null;
}

/**
 * Updates the leaderboard.
 * @param {Array.<Object>} players A sorted array of the top players.
 */
Leaderboard.prototype.update = function(players) {
  this.players = players;

  while (this.element.firstChild) {
    this.element.removeChild(this.element.firstChild);
  }

  var header = document.createElement('h1');
  header.appendChild(document.createTextNode('Leaderboard'));
  this.element.appendChild(header);

  for (var i = 0; i < this.players.length; ++i) {
    var playerElement = document.createElement('li');
    playerElement.appendChild(document.createTextNode(
      this.players[i].name +
        ":  Score: "   + this.players[i]['score']));
    this.element.appendChild(playerElement);
  };
};
