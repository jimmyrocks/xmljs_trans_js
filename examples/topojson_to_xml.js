var xmljs_translator = require('../'),
  http = require('https'),
  options = {
    'host': 'raw.githubusercontent.com',
    'port': '443',
    'path': '/mbostock/topojson/master/examples/us-10m.json'
  };

// Utility function that downloads a URL and invokes
// callback with the data.
function download (options, callback) {
  http.get(options, function (res) {
    var data = '';
    res.on('data', function (chunk) {
      data += chunk;
    });
    res.on('end', function () {
      callback(null, data);
    });
  }).on('error', function (e) {
    callback(e);
  });
}

function convertData (err, data) {
  if (!err) {
    console.log(xmljs_translator.xmlify(JSON.parse(data)));
  } else {
    throw err;
  }
}

download(options, convertData);
