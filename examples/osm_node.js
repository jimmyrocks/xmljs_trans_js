var xmljs_translator = require('../');

var osmAttributes = {
  'attr' : {
    'version': '0.6',
    'generator': 'OpenStreetMap server',
    'copyright': 'OpenStreetMap and contributors',
    'attribution': 'http://www.openstreetmap.org/copyright',
    'license': 'http://opendatacommons.org/licenses/odbl/1-0/'
  }
};

var inD = {
  'node': {
    'id': 267,
    'versions': 1,
    'changeset': 65,
    'lat': '-26.0',
    'lon': '152.0',
    'user': 'JohnSmith2',
    'uid': 7,
    'visible': true,
    'timestamp': '2009-09-06T03:48:36Z',
    'tag': [
      {'k': 'name', v: 'test'},
      {'k': 'operator', v: 'test'},
      {'k': 'sport', v: 'shooting'},
      {'k': 'type', v: 'paintball'}
    ]
  }
};

var outData = {osm: osmAttributes.attr};
for (var key in inD) {
  outData.osm[key] = inD[key];
}

//console.log(outData);
//console.log(xmljs_translator.xmlify(outData));
console.log(JSON.stringify(xmljs_translator.jsonify(xmljs_translator.xmlify(inD)), null, 2));
