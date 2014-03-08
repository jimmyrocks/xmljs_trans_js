var xmljs_translator = require('../'),
  geoJson = require('./sample_geojson.json');

//console.log(JSON.stringify(xmljs_translator.jsonify(xmljs_translator.xmlify(geoJson)),null, 2));
console.log(xmljs_translator.xmlify(geoJson));
