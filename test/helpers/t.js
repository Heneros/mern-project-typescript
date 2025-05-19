// Очень простая приоритетная очередь на массиве.
// Для учебных задач пойдёт, но для больших графов лучше заменить на кучу.
var SimplePriorityQueue = /** @class */ (function () {
    function SimplePriorityQueue() {
        // Храним пары [вершина, приоритет]
        this.data = [];
    }
    // Вставляем элемент и тут же сортируем весь массив по приоритету
    SimplePriorityQueue.prototype.enqueue = function (node, priority) {
        this.data.push([node, priority]);
        this.data.sort(function (a, b) { return a[1] - b[1]; });
    };
    // Достаём элемент с минимальным приоритетом (самый «близкий»)
    SimplePriorityQueue.prototype.dequeue = function () {
        var pair = this.data.shift();
        return pair ? pair[0] : undefined;
    };
    // Пустая ли очередь?
    SimplePriorityQueue.prototype.isEmpty = function () {
        return this.data.length === 0;
    };
    return SimplePriorityQueue;
}());
// Основная функция: принимает граф и имя стартовой вершины
function dijkstra(graph, source) {
    // 1) Инициализация
    var dist = {}; // расстояния
    var prev = {}; // предыдущие вершины
    var pq = new SimplePriorityQueue(); // наша очередь
    // Ставим dist = ∞ для всех, кроме source = 0
    for (var node in graph) {
        dist[node] = Infinity;
        prev[node] = null;
    }
    dist[source] = 0;
    pq.enqueue(source, 0);
    // 2) Основной цикл
    while (!pq.isEmpty()) {
        // Берём вершину u с минимальным dist[u]
        var u = pq.dequeue();
        // Идём по всем её соседям
        for (var _i = 0, _a = graph[u]; _i < _a.length; _i++) {
            var edge = _a[_i];
            var v = edge.to;
            var weight = edge.weight;
            // Вычисляем альтернативное расстояние через u
            var alt = dist[u] + weight;
            // Если лучше, чем текущее dist[v] — обновляем
            if (alt < dist[v]) {
                dist[v] = alt;
                prev[v] = u;
                // И помещаем v в очередь с новым приоритетом
                pq.enqueue(v, alt);
            }
        }
    }
    // Возвращаем оба словаря
    return { dist: dist, prev: prev };
}
// === Пример использования ===
var graph = {
    A: [
        { to: 'B', weight: 5 },
        { to: 'C', weight: 2 },
    ],
    B: [
        { to: 'C', weight: 1 },
        { to: 'D', weight: 2 },
    ],
    C: [
        { to: 'B', weight: 3 },
        { to: 'D', weight: 7 },
    ],
    D: [],
};
var result = dijkstra(graph, 'A');
console.log('Кратчайшие расстояния:', result.dist);
console.log('Предыдущие вершины:', result.prev);
