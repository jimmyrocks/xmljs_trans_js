module.exports = function (newObj, baseObj) {
  // Go through the options and assign them
  var destination = {};
  newObj = newObj || {};
  for (var key in baseObj) {
    destination[key] = newObj[key] || baseObj[key];
  }
  return destination;
};
