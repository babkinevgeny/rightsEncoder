const fs = require('fs');
const isEqual = require('lodash.isequal');

const beforeEncoding = fs.readFileSync('./rights.json');
const afterDecoding = fs.readFileSync('./decoded_rights.json');

console.log(isEqual(beforeEncoding, afterDecoding));