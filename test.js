const encodeRights = require('./encode');
const decodeRights = require('./decode');

const fs = require('fs');

const files = [];
fs.readdirSync('./db').forEach(file => {
    files.push(file);
});

for (let i = 0; i < files.length; i++) {

    let originalJSON= fs.readFileSync(`./db/${files[i]}`);
    originalJSON = JSON.parse(originalJSON);

    let compressedJSON = {...originalJSON};

    compressedJSON.view ? compressedJSON.view = encodeRights(compressedJSON.view) : null;
    compressedJSON.edit ? compressedJSON.edit = encodeRights(compressedJSON.edit) : null;


    let decompressedJSON = {}

    compressedJSON.view ? decompressedJSON.view = decodeRights(compressedJSON.view) : null;
    compressedJSON.edit ? decompressedJSON.edit = decodeRights(compressedJSON.edit) : null;

    const viewDifference = [];
    const editDifference = [];

    if (originalJSON.view) {
        originalJSON.view.forEach(key => {
            return !decompressedJSON.view.includes(key) ? viewDifference.push(key) : null
        });
    }
    
    if (originalJSON.edit) {
        originalJSON.edit.forEach(key => {
            return !decompressedJSON.edit.includes(key) ? editDifference.push(key) : null
        });
    }

    if (viewDifference.length || editDifference.length) {
        console.log(`\nTest #${i+1}. Rights before encoding IS NOT equal rigths after decoding.\nDifference in view part: ${viewDifference ? viewDifference : null}.\nDifference in edit part: ${editDifference ? editDifference : null}\n`)
    } else {
        console.log(`\nTest #${i+1}. Rights after decoding contents all original rights!\n`)
    }
}

