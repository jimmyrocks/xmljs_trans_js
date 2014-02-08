var xmljs_translator = require('../');

var json = {osm: {
    name: 'fun',
    fill: [
      {k: 'building', v: 'yes'},
      {k: 'color', v: 'green'},
      {k: 'border', v: 'thick'}
    ],
    coords: [
      [
      [0,1],
      [5,6]
    ],
    [
      [25,26],
      [32,35]
    ]
    ]
  }
};

console.log(xmljs_translator.xmlify(json));
//console.log(JSON.stringify(xmljs_translator.jsonify(xmljs_translator.xmlify(json)),null, 2));


