const fs = require('fs');
let jsonData = fs.readFileSync('./encoded_rights.json');
let obj = JSON.parse(jsonData);

function decodeRights(data) { // принимаем объект
    const result = [];

    const createPath = (currentObj, path) => { // функция принимает объект и текущее значение пути
        let keys = Object.keys(currentObj); // собираем ключи объекта

        if (keys.length) { // если объект НЕпустой
            keys.forEach(key => { // для каждого ключа рекурсивно вызываем функцию
                if (key === "_") {
                    result.push(path)
                } else {
                    createPath(
                        currentObj[key], // передаем ключ
                        path ? `${path}.${key}` : key // и прибавляем ключ в значение пути
                    );
                }
                
            })
        } else {
            result.push(path)
        }
    }

    createPath(data, "");
    return result;
}

obj.view ? obj.view = decodeRights(obj.view) : null;
obj.edit ? obj.edit = decodeRights(obj.edit) : null;

jsonData = JSON.stringify(obj);

fs.writeFileSync('./decoded_rights.json', jsonData);