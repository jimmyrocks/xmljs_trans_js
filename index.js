var buildXmlNode = require('./src/buildXmlNode');
var builder = require('./node_modules/xml2js/node_modules/xmlbuilder');
var buildJsonAttribute = require('./src/buildJsonAttribute');
var defaults = require('./defaults');
var mergeObjects = require('./src/mergeObjects');
var xml2js = require('xml2js');

module.exports = {
  'jsonify': function (xml, options) {
    // Create the parser
    var parser = new xml2js.Parser(options);

    // Create the new json object
    var json = {};

    // Add any options
    options = mergeObjects(options, defaults.jsonSetings);

    parser.parseString(xml, function (err, result) {
      if (!err) {
        json = buildJsonAttribute(result, json, options);
      } else {
        throw err;
      }
    });
    return json;
  },
  'xmlify': function (jsToConvert, options) {
    var outData;

    // Go through the options and assign them
    options = mergeObjects(options, defaults);

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
          // TODO: This might be an error
          outData = builder.create(rootNode, options.xmlSettings);
        }
      }
      buildXmlNode(jsToConvert, outData, options);
    } else {
      throw new Error('Type: ' + typeof jsToConvert + ' is not object');
    }

    return outData.end({
      pretty: true
    });
  }
};
