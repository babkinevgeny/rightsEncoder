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

        const hasKey = currentObj.hasOwnProperty(key);

        if ( !hasKey ) { // если такого ключа нет, то добавляем пустой объект.
            currentObj[key] = {};
        }

        if ( keys.length === 0 && needsCutting ) { // если "особый" случай, то добавляем специальное поле
            currentObj[key] = {
                _: 1,
                ...currentObj[key]
            };
        }

        if ( keys.length ) {
            return createObj(currentObj[key], keys, needsCutting);
        }
        
        return;
    };

    if (paths) {
        paths.sort();

        paths.forEach((path, index, paths) => {
            const keys = path.split(".");
    
            const isLastPath = index === paths.length - 1;
            const nextPath = paths[index + 1];
            const nextPathIncludesCurrent = nextPath ? nextPath.includes(`${path}.`) : null; // "OPERATION.tabs.OPERATION_UNIT".includes("OPERATION.tabs.OPERATION") вернет true, поэтому к path добавим точку
    
            // проверяем является ли текущий путь последним и содержится ли текущий путь в следующем пути
            if ( !isLastPath && nextPathIncludesCurrent ) {
                createObj(obj, keys, true); // помечаем, что случай особый (needsCutting = true)
            } else {
                createObj(obj, keys);
            }
    
        });
    }

    return obj;
}

module.exports = encodeRights;