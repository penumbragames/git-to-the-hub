/**
 * @fileoverview This file contains the data for drawing the platforms on the
 * map.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

/**
 * Empty constructor for the Map class.
 * @constructor
 */
function Map() {
  throw new Error('Map should not be instantiated!');
}

Map.MAP = [
  [0, 0, 2500, 20],
  [100, 75, 100, 20],
  [300, 75, 100, 20],
  [900, 75, 100, 20],
  [500, 150, 100, 20]
];

/**
 * This line is needed on the server side since this is loaded as a module
 * into the node server.
 */
module.exports = Map;
