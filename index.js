const fs = require('fs');
let jsonData = fs.readFileSync('./rights.json');
let obj = JSON.parse(jsonData);

const encodeRights = (paths) => {
    let obj = {};

    const createObj = (currentObj, keys) => {
        const key = keys.shift();

        if (!currentObj.hasOwnProperty(key)) { // если такого ключа нет, то добавляем пустой объект.
            currentObj[key] = {};
        }

        return keys.length ? createObj(currentObj[key], keys) : null;
    }

    paths.forEach(path => {
        const keys = path.split(".");
        createObj(obj, keys);
    })

    return obj;
}

obj.view ? obj.view = encodeRights(obj.view) : null;
obj.edit ? obj.edit = encodeRights(obj.edit) : null;

jsonData = JSON.stringify(obj);

fs.writeFileSync('./encoded_rights.json', jsonData);


const oldSize = fs.statSync('./rights.json').size;
const newSize = fs.statSync('./encoded_rights.json').size;
const difference = oldSize - newSize;

console.log(`Old size: ${oldSize / 1000} KB, New size: ${newSize / 1000} KB. We've saved ${difference / 1000} KB or ${Math.round(difference/ (oldSize / 100))} %`);


// function encodeRights(paths) {
//     return paths.reduce((obj, path) => {
//         path.split('.').reduce((obj, key, index, parts) => {
//             if (index === parts.length - 1) { // последний элемент массива
//                 let parentKey = parts[index - 1];
//                 obj[key] = {
//                     '.': true
//                 }
//             } else {
//                 obj[key] = {}
//             }
//             return obj[key]

//         }, obj);
//         return obj;
//     }, {});
// };