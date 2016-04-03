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

Map.MAP = [
  [0, 0, 2500, 20],
];

Map.generateMap = function() {
  var map = [
    [0, 0, 2500, 20]
  ];
  var padding = 0;
  for (var y = 75; y < Constants.WORLD_MAX - 200; y += 75) {
    var x = Constants.WORLD_MIN + padding;
    while (x < Constants.WORLD_MAX - padding) {
      map.push([x, y, 100, 20]);
      x += Util.randRange(175, 400);
    }
    padding += 75;
  }
  return map;
};

/**
 * This line is needed on the server side since this is loaded as a module
 * into the node server.
 */
module.exports = Map;
