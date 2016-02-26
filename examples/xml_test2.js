var xmljs_translator = require('../');

var json = {
  osm: {
    names: 'fun',
    filler: [
      [1, 2, 3],
      [
        [4, 7, 8], 5, 6
      ]
    ],
    tags: [{
      'k': 'building',
      'v': 'yes'
    }, {
      'k': 'awesome',
      'v': 'no'
    }]
  }
};

// console.log(JSON.stringify(xmljs_translator.jsonify(xmljs_translator.xmlify(json)),null,2));
console.log(xmljs_translator.xmlify(json));
