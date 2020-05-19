const fs = require('fs');

/* 
    Случаи, когда текущий путь является подстрокой последующих путей
    (напр., "OPERATION_AUTO.columns","OPERATION_AUTO.columns.ACTUAL_COST_BUY"), назовем их "особенными", 
    должны быть учтены отдельно. Для таких случаев в объект будет добавлено поле "_": 1, 
    при встрече которого функция decodeRights будет понимать, что этот путь необходимо выделить в отдельный элемент массива.
*/

let i = 0

const encodeRights = (paths) => {
    let obj = {};
    const createObj = (currentObj, keys, index = 0, needsCutting = false) => {
        const key = keys[index];

        if ( !key ) {
            return;
        }

        const hasKey = currentObj.hasOwnProperty(key);

        if ( !hasKey ) { // если такого ключа нет, то добавляем пустой объект.
            currentObj[key] = {};
        }

        const isLast = index === keys.length - 1;

        if ( needsCutting && isLast ) { // если "особый" случай, то добавляем специальное поле
            currentObj[key] = {
                _: 1,
                ...currentObj[key]
            };
        }

        if ( index < keys.length ) {
            return createObj(currentObj[key], keys, index + 1, needsCutting);
        }

        return;
    };

    if ( paths ) {
        paths.forEach((path, index, paths) => {
            const keys = path.split(".");

            const isLastPath = index === paths.length - 1;

            const nextPath = paths[index + 1];
            const prevPath = paths[index - 1];

            const nextPathIncludesCurrent = nextPath ? nextPath.includes(`${path}.`) : null; // "OPERATION.tabs.OPERATION_UNIT".includes("OPERATION.tabs.OPERATION") вернет true, поэтому к path добавим точку
            const prevPathIncludesCurrent = prevPath ? prevPath.includes(`${path}.`) : null; // "OPERATION.tabs.OPERATION_UNIT".includes("OPERATION.tabs.OPERATION") вернет true, поэтому к path добавим точку

            if (nextPathIncludesCurrent || prevPathIncludesCurrent) {
                createObj(obj, keys, 0, true);
            } else {
                createObj(obj, keys, 0);
            }

            if (isLastPath && prevPathIncludesCurrent) {
                createObj(obj, keys, 0, true);
            }
            
        });
    }

    return obj;
}

module.exports = encodeRights;