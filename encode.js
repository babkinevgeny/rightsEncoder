const fs = require('fs');
let jsonData = fs.readFileSync('./rights.json');
let obj = JSON.parse(jsonData);

/* 
    Случаи, когда текущий путь является подстрокой последующих путей
    (напр., "OPERATION_AUTO.columns","OPERATION_AUTO.columns.ACTUAL_COST_BUY"), назовем их "особенными", 
    должны быть учтены отдельно. Для таких случаев в объект будет добавлено поле "_": 1, 
    при встрече которого функция decodeRights будет понимать, что этот путь необходимо выделить в отдельный элемент массива.

    В нашей БД права хранятся в порядке от общего к частному:
    [
        "OPERATION_AUTO.columns",
        "OPERATION_AUTO.columns.MIN_GTD_DATE_ADD_UNITS",
        "OPERATION_AUTO.columns.ACTUAL_COST_BUY",
        "OPERATION_AUTO.columns.ACTUAL_COST_SALE"...
    ]

    Порядок прав в массиве важен, тк функция encodeRights не рассматривает случаи, когда "особенные" поля находятся в конце массива.
*/

const encodeRights = (paths) => {
    let obj = {};

    const createObj = (currentObj, keys, needsCutting = false) => {
        const key = keys.shift();

        if (!currentObj.hasOwnProperty(key)) { // если такого ключа нет, то добавляем пустой объект.
            currentObj[key] = {}
        }

        if (keys.length === 0 && needsCutting) { // если "особый" случай, то добавляем специальное поле
            currentObj[key] = {
                "_": 1,
                ...currentObj[key]
            }
        }

        return keys.length ? createObj(currentObj[key], keys, needsCutting) : null;
    }

    paths.forEach((path, index, paths) => {
        const keys = path.split(".");

        const isLastPath = index === paths.length - 1;
       
        // проверяем является ли текущий путь последним и содержит ли следующий путь текущий
        if ( !isLastPath && paths[index + 1].includes(`${path}.`)) { // "OPERATION.tabs.OPERATION_UNIT".includes("OPERATION.tabs.OPERATION") вернет true, поэтому к path добавим точку
            createObj(obj, keys, true); // помечаем, что случай особый (needsCutting = true)
        } else {
            createObj(obj, keys);
        }
        
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

console.log(`Old size: ${oldSize / 1000} KB, New size: ${newSize / 1000} KB. We've saved ${difference / 1000} KB ${Math.round(difference/ (oldSize / 100))} %`);