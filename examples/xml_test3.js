var xmljs_translator = require('../');

var json = {
  'group1': {
    'data': [
      ['1', '2'], '3'
    ],
    'fields': [{
      'k': 'a',
      'v': 'b'
    }]
  }
};

console.log(JSON.stringify(xmljs_translator.jsonify(xmljs_translator.xmlify(json)), null, 2));
// console.log(xmljs_translator.xmlify(json));
