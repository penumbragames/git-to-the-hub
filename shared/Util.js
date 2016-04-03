/**
 * @fileoverview This is a utility class containing utility methods used on the
 * server and client.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

/**
 * Empty constructor for the Util class, all functions will be static.
 */
function Util() {
  throw new Error('Util should not be instantiated!');
}

/**
 * Binds a function to a context, useful for assigning event handlers and
 * function callbacks.
 * @param {Object} context The context to assign the method to.
 * @param {function(?)} method The method to bind the context to.
 * @return {function(?)}
 */
Util.bind = function(context, method) {}
  return function() {
    return method.apply(context, arguments);
  };
};

/**
 * This method returns the sign of a number.
 * @param {number} x The number to check.
 * @return {number}
 */
Util.getSign = function(x) {
  if (x > 0) {
    return 1;
  } else if (x < 0) {
    return -1;
  }
  return 0;
};

/**
 * Generates and returns a UID.
 * @param {?number=} length An optional length parameter for the UID to
 *   to generate. If the length is not provided, this function will return a
 *   UID of length 32.
 * @return {string}
 */
Util.generateUID = function(length) {
  if (!length) {
    length = 32;
  }
  var choice = 'abcdefghijklmnopqrstuvwxyz' +
               'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
               '1234567890';
  var uid = '';
  for (var i = 0; i < length; ++i) {
    uid += choice.charAt(Math.floor(Math.random() * choice.length));
  }
  return uid;
};

/**
 * This method linearly scales a number from one range to another.
 * @param {number} x The number to scale.
 * @param {number} a1 The lower bound of the range to scale from.
 * @param {number} a2 The upper bound of the range to scale from.
 * @param {number} b1 The lower bound of the range to scale to.
 * @param {number} b2 The upper bound of the range to scale to.
 * @return {number}
 */
Util.linearScale = function(x, a1, a2, b1, b2) {
  return ((x - a1) * (b2 - b1) / (a2 - a1)) + b1;
};

/**
 * Returns the Manhattan Distance between two points given their x and y
 * coordinates.
 * @param {number} x1 The x-coordinate of the first point.
 * @param {number} y1 The y-coordinate of the first point.
 * @param {number} x2 The x-coordinate of the second point.
 * @param {number} y2 The y-coordinate of the second point.
 * @return {number}
 */
Util.getManhattanDistance = function(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
};

/**
 * Returns the squared Euclidean distance between two points given their
 * x and y coordinates.
 * @param {number} x1 The x-coordinate of the first point.
 * @param {number} y1 The y-coordinate of the first point.
 * @param {number} x2 The x-coordinate of the second point.
 * @param {number} y2 The y-coordinate of the second point.
 * @return {number}
 */
Util.getEuclideanDistance2 = function(x1, y1, x2, y2) {
  return ((x1 - x2) * (x1 - x2)) + ((y1 - y2) * (y1 - y2));
};

/**
 * Returns the true Euclidean distance between two points given their
 * x and y coordinates.
 * @param {number} x1 The x-coordinate of the first point.
 * @param {number} y1 The y-coordinate of the first point.
 * @param {number} x2 The x-coordinate of the second point.
 * @param {number} y2 The y-coordinate of the second point.
 * @return {number}
 */
Util.getEuclideanDistance = function(x1, y1, x2, y2) {
  return Math.sqrt(Util.getEuclideanDistance2(x1, y1, x2, y2));
};

/**
 * Given a value, a minimum, and a maximum, returns true if value is
 * between the minimum and maximum, inclusive of both bounds. This
 * functio will still work if min and max are switched.
 * @param {number} val The value to check.
 * @param {number} min The minimum bound.
 * @param {number} max The maximum bound.
 * @return {boolean}
 */
Util.inBound = function(val, min, max) {
  if (min > max) {
    return val >= max && val <= min;
  }
  return val >= min && val <= max;
};

/**
 * Bounds a number to the given minimum and maximum, inclusive of both
 * bounds. This function will still work if min and max are switched.
 * @param {number} val The value to check.
 * @param {number} min The minimum number to bound to.
 * @param {number} max The maximum number to bound to.
 * @return {number}
 */
Util.bound = function(val, min, max) {
  if (min > max) {
    return Math.min(Math.max(val, max), min);
  }
  return Math.min(Math.max(val, min), max);
};

/**
 * Returns a random floating-point number between the given min and max
 * values, exclusive of the max value.
 * @param {number} min The minimum number to generate.
 * @param {number} max The maximum number to generate.
 * @return {number}
 */
Util.randRange = function(min, max) {
  if (min >= max) {
    var swap = min;
    min = max;
    max = swap;
  }
  return (Math.random() * (max - min)) + min;
};

/**
 * Returns a random integer between the given min and max values, exclusive
 * of the max value.
 * @param {number} min The minimum number to generate.
 * @param {number} max The maximum number to generate.
 * @return {number}
 */
Util.randRangeInt = function(min, max) {
  if (min >= max) {
    var swap = min;
    min = max;
    max = swap;
  }
  return Math.floor(Math.random() * (max - min)) + min;
};

/**
 * Returns a random element in a given array.
 * @param {Array.<*>} array The array from which to select a random
 *   element from.
 * @return {*}
 */
Util.choiceArray = function(array) {
  return array[Util.randRangeInt(0, array.length)];
};

if (typeof module === 'object') {
  /**
   * This is used if Constants is being imported as a Node module.
   */
  module.exports = Util;
} else {
  /**
   * Otherwise, if this class is used on the client side, then just load
   * it into the window context.
   */
  window.Constants = Util;
}
