const fs = require('fs');

const beforeEncoding = fs.readFileSync('./rights.json');
const afterDecoding = fs.readFileSync('./decoded_rights.json');
const bEp = JSON.parse(beforeEncoding).view;
const aDp = JSON.parse(afterDecoding).view;
const arr = [];

bEp.forEach(key => {
    return !aDp.includes(key) ? arr.push(key) : null
})

if (arr.length) {
    console.log(`Rights before encoding IS NOT equal rigths after decoding. Here is the difference: ${arr}`)
} else {
    console.log('Rights after decoding contents all original rights!')
}