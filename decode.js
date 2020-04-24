function decodeRights(data) { // принимаем объект
    const result = [];

    const createPath = (currentObj, path) => { // функция принимает объект и текущее значение пути
        let keys = Object.keys(currentObj); // собираем ключи объекта

        if ( keys.length ) { // если объект НЕпустой
            keys.forEach((key) => { // для каждого поля рекурсивно вызываем функцию
                if ( key === "_" ) { // базовый случай (если объект имеет специальное поле, которое задается функцией encodeRigths)
                    result.push(path);
                } else {
                    const pathSummary = path ? `${path}.${key}` : key;
                    createPath(currentObj[key], pathSummary);
                }

            });
        } else {
            result.push(path);
        }
    };

    createPath(data, "");
    return result;
}

module.exports = decodeRights;