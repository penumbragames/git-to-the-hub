/**
 * @fileoverview This file contains the data for drawing the platforms on the
 * map.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

var Constants = require('../shared/Constants');
var Util = require('../shared/Util');

/**
 * Empty constructor for the Map class.
 * @constructor
 */
function Map() {
  throw new Error('Map should not be instantiated!');
}

Map.generateMap = function() {
  var map = [];
  var padding = 0;
  for (var y = 75; y < Constants.WORLD_MAX - 200; y += 75) {
    var x = Constants.WORLD_MIN + padding + Util.randRange(175, 400);
    while (x < Constants.WORLD_MAX - padding) {
      map.push([x, y, 100, 20]);
      x += Util.randRange(350, 550);
    }
    padding += 75;
  }
  map.push([0, -90, 2500, 100]);
  map.push([1250, 1175, 400, 50]);
  return map;
};

/**
 * This line is needed on the server side since this is loaded as a module
 * into the node server.
 */
module.exports = Map;
