var buildJsonAttribute = module.exports = function (attribute, child, defaults) {
  // If we have an object, we can use it, other, just return it
  if (typeof (attribute) === 'object') {
    // Loop through the attribute keys
    for (var attributeKey in attribute) {
      // If the attributeKey is $ or _element it will treat it as a single valued arra7
      if (attributeKey === '$' || attributeKey === defaults.arrayField) {
        child = buildJsonAttribute(attribute[attributeKey], {}, defaults);
      } else {
        // If we have a single length array, we do the same thing as above, but with its first value
        if (Array.isArray(attribute[attributeKey]) && attribute[attributeKey].length === 1) {
          child[attributeKey] = buildJsonAttribute(attribute[attributeKey][0], {}, defaults);
        } else {
          // Otherwise is this whole thing might be an array
          if (Array.isArray(attribute)) {
            // If the child is an array too, just return the child
            if (Array.isArray(child)) {
              child.push(buildJsonAttribute(attribute[attributeKey], {}, defaults));
            } else {
              // This is the first child, so make an array with it
              child = [buildJsonAttribute(attribute[attributeKey], {}, defaults)];
            }
          } else {
            // If it's an object, just add the whole object
            child[attributeKey] = buildJsonAttribute(attribute[attributeKey], {}, defaults);
          }
        }
      }
    }
  } else {
    child = attribute;
  }
  return child;
};
