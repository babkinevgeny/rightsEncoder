const fs = require('fs');
let jsonData = fs.readFileSync('./rights.json');
let obj = JSON.parse(jsonData);

function encodeRights(pathes) {
    return pathes.reduce(function (obj, path) {
        path.split('.').reduce((obj, key) => obj[key] = obj[key] || {}, obj);
        return obj;
    }, {});
};

obj.view = encodeRights(obj.view);
obj.edit = encodeRights(obj.edit);

jsonData = JSON.stringify(obj);

fs.writeFileSync('./encoded_rights.json', jsonData);


const oldSize = fs.statSync('./rights.json').size;
const newSize = fs.statSync('./encoded_rights.json').size;
const difference = oldSize - newSize;

console.log(`Old size: ${oldSize / 1000} KB, New size: ${newSize / 1000} KB. We've saved ${difference / 1000} KB or ${Math.round(difference/ (oldSize / 100))} %`);
