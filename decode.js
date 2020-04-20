const fs = require('fs');
let jsonData = fs.readFileSync('./encoded_rights.json');
let obj = JSON.parse(jsonData);

function decodeRights(data) { // принимаем объект
    const result = [];

    const createPath = (currentObj, path) => { // функция принимает объект и текущее значение пути

        for (let prop in currentObj) {  // проверяем каждое поле объекта
            let keys = Object.keys(currentObj[prop]);

            if (keys.length) { // если поле не является пустым...
                createPath(
                    currentObj[prop], // ...рекурсивно запускаем функцию для вложенного НЕпустого объекта
                    path ? `${path}.${prop}` : prop // прибавляем название свойства к пути
                ); 
            } else { // если поле - пустой объект...
                path = `${path}.${prop}`; // ...заканчиваем вызов и пушим путь в массив
                result.push(path);
            }
        }
    }

    createPath(data, "");
    return result;
}

obj.view ? obj.view = decodeRights(obj.view) : null;
obj.edit ? obj.edit = decodeRights(obj.edit) : null;

jsonData = JSON.stringify(obj);

fs.writeFileSync('./decoded_rights.json', jsonData);