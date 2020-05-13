const fs = require('fs');

let originalJSON = fs.readFileSync(`./db/13.json`);
originalJSON = JSON.parse(originalJSON);

let compressedJSON = {
    ...originalJSON
};

class Graph {
    constructor(noOfVertices) {
        this.noOfVertices = noOfVertices;
        this.AdjList = new Map();
    }

    addVertex(v) {
        this.AdjList.set(v, []);
    }

    addEdge(v, w) {
        this.AdjList.get(v).push(w);
    }
}


const graph = new Graph();

const groups = Object.keys(compressedJSON);

groups.forEach((group) => {
    compressedJSON[group].sort();

    compressedJSON[group].forEach((path) => {

        const keys = path.split('.');
        keys.forEach((key, index, arr) => {
            const hasVertex = graph.AdjList.has(key);

            if (!hasVertex) {           // если вершины нет, то добавляем вершину
                graph.addVertex(key);
            } else {                    // если вершина есть
                const edges = graph.AdjList.get(key); // собираем дуги этой вершины
                const isLastPart = index === arr.length - 1; // проверяем является ли вершина последней в наборе
                const hasNextPartIn = edges.includes(arr[index + 1]); // проверяем добавлена ли следующая вершина, чтобы избежать дублирования 
                
                if (!isLastPart && !hasNextPartIn) {
                    graph.addEdge(key, arr[index + 1]);
                }
            }
        });

        compressedJSON[group] = [...graph.AdjList];
    });
});


fs.writeFileSync('./encoded_rights.json', JSON.stringify(compressedJSON));