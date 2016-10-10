
const xml = require('xml2js');
const zipLib = require('node-stream-zip');
const _ = require('lodash');
const fs = require('fs');

const readFile = process.argv[2] || './test.zip';
const writeDir = process.argv[3] || './temp';

try {
  fs.statSync(writeDir)
}
catch(x) {
  fs.mkdirSync(writeDir);
}

const zip = new zipLib({
  file: readFile,
  storeEntries: true
});

zip.on('error', (err) => console.error('Error extracting archive: ', err));
zip.on('extract', function(entry, file) {
    fs.readFile(file, (err, data) => {
      if(err) throw err;

      const parser = new xml.Parser();
      parser.parseString(data, (err, data) => {
        if(err) throw err;
        console.log(data);
      })
    })
});
zip.on('entry', function(entry) {
    zip.extract(entry.name, writeDir, function(err, count) {
      if(err) throw err;
    });
});
