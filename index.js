var xml2js = require('xml2js'),
builder = require('./node_modules/xml2js/node_modules/xmlbuilder'),
defaults = {
  'xmlRootElement': 'document',
  'textField': '_text',
  'arrayField': '_element',
  'cdataField': '_cdata',
  'breakOutSingleField': true,
  'alwaysUseRootElement': false,
  'jsonSettings': {
    'mergeAttrs': true
  },
  'xmlSettings': {
    version: '1.0',
    encoding: 'UTF-8'
  }
};

exports.jsonify = function(xml, options) {
  var parser = new xml2js.Parser(options),
  json = {},
  cleanAttributes = function(attribute, child) {
    var innerAttribute;
    if (typeof(attribute) === 'object') {
      for (innerAttribute in attribute) {
        if (innerAttribute === '$' || innerAttribute === defaults.arrayField) {
          child = cleanAttributes(attribute[innerAttribute], {});
        } else {
          if (Object.prototype.toString.call(attribute[innerAttribute]) === '[object Array]' && attribute[innerAttribute].length === 1) {
            child[innerAttribute] = cleanAttributes(attribute[innerAttribute][0], {});
          } else {
            if (Object.prototype.toString.call(attribute) === '[object Array]') {
              if (Object.prototype.toString.call(child) === '[object Array]') {
                child.push(cleanAttributes(attribute[innerAttribute], {}));
              } else {
                child = [cleanAttributes(attribute[innerAttribute], {})];
              }
            } else {
              child[innerAttribute] = cleanAttributes(attribute[innerAttribute], {});
            }
          }
        }
      }
    } else {
      child = attribute;
    }
    return child;
  };

  // Go through the options and assign them
  for (var option in defaults.jsonSettings) {
    options = options ? options : {};
    options[option] = options[option] ? options[option] : defaults[option];
  }

  parser.parseString(xml, function (err, result) {
    cleanAttributes(result, json);
  });
  return json;
};

exports.xmlify = function(jsToConvert, options) {
  var outData;
  var buildNodes = function(inData, child) {
    var attributes,
    newData,
    currentSubKey;

    // Loop through the data
    for (var key in inData) {
      attributes = {};
      for (var subKey in inData[key]) {
        currentSubKey = inData[key][subKey];

        // Hack to treat arrays as XML elements
        if( Object.prototype.toString.call( inData[key] ) === '[object Array]' ) {
          subKey = options.arrayField;
          if (typeof (currentSubKey) !== 'object') {
            currentSubKey = {};
            currentSubKey[options.textField] = currentSubKey;
          }
        }

        if (typeof currentSubKey === 'object') {
          // It's either a tag or an array of tags
          newData = {};
          if( Object.prototype.toString.call( currentSubKey ) === '[object Array]' ) {
            // It's an array of tags
            for (var index in currentSubKey) {
              if ( Object.prototype.toString.call( currentSubKey[index] ) === '[object Object]') {
                // Tags in an array
                newData[subKey] = currentSubKey[index];
              } else {
                // Array or text in an array
                newData[key] = {};
                newData[key][options.arrayField] = currentSubKey[index];
              }
              buildNodes(newData, child.ele(subKey));
            }
          } else {
            // Just a tag
            newData[subKey] = currentSubKey;
            buildNodes(newData, child.ele(subKey));
          }
        } else {
          // It's something we're going to turn into a string
          newData = (currentSubKey === 0 || currentSubKey) ? currentSubKey.toString() : '';
          if (subKey === options.textField || subKey === options.cdataField || subKey === options.arrayField) {
            child.text(newData);
          } else {
            attributes[subKey] = currentSubKey;
          }
        }
      }
      for (var attrIndex in attributes) {
        child.att(attrIndex, attributes[attrIndex]);
      }
    }
  };

  // Go through the options and assign them
  for (var option in defaults) {
    options = options ? options : {};
    options[option] = options[option] ? options[option] : defaults[option];
  }


  // Do some error checking on the input
  if (typeof jsToConvert === 'object') {
    if (Object.keys(jsToConvert).length > 1) {
      // If there's more than one object in the root level, we need to put it in a wrapper
      var newJsToConvert = {};
      newJsToConvert[options.xmlRootElement] = jsToConvert;
      jsToConvert = newJsToConvert;
      outData = builder.create(options.xmlRootElement, options.xmlSettings);
    } else {
      for (var rootNode in jsToConvert) {
        outData = builder.create(rootNode, options.xmlSettings);
      }
    }
    buildNodes(jsToConvert, outData);
  } else {
    throw 'Type: ' + typeof(jsToConvert) + ' is not object';
  }

  return outData.end({pretty: true});
};
