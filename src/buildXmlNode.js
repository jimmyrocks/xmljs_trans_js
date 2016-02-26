var buildXmlNode = module.exports = function (inData, child, defaults) {
  var attributes;
  var newData;
  var currentSubKey;

  // Loop through the data
  for (var key in inData) {
    attributes = {};
    for (var subKey in inData[key]) {
      currentSubKey = inData[key][subKey];

      // Hack to treat arrays as XML elements
      if (Array.isArray(inData[key])) {
        subKey = defaults.arrayField;
        if (typeof (currentSubKey) !== 'object') {
          currentSubKey = {};
          currentSubKey[defaults.textField] = currentSubKey;
        }
      }

      if (typeof currentSubKey === 'object') {
        // It's either a tag or an array of tags
        newData = {};
        if (Array.isArray(currentSubKey)) {
          // It's an array of tags
          currentSubKey.forEach(function (subSubKey) {
            if (typeof subSubKey === 'object' && !Array.isArray(subSubKey)) {
              // Tags in an object
              newData[subKey] = subSubKey;
            } else {
              // Array or text in an array
              newData[key] = {};
              newData[key][defaults.arrayField] = subSubKey;
            }
            buildXmlNode(newData, child.ele(subKey), defaults);
          });
        } else {
          // Just a tag
          newData[subKey] = currentSubKey;
          buildXmlNode(newData, child.ele(subKey), defaults);
        }
      } else {
        // It's something we're going to turn into a string
        newData = (currentSubKey === 0 || currentSubKey) ? currentSubKey.toString() : '';
        if (subKey === defaults.textField || subKey === defaults.cdataField || subKey === defaults.arrayField) {
          child.text(newData);
        } else {
          attributes[subKey] = currentSubKey;
        }
      }
    }
    for (var attrIndex in attributes) {
      child.att(attrIndex || '', attributes[attrIndex] || '');
    }
  }
};
