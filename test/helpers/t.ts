// Тип для описания одного ребра: куда идём и сколько «стоит» переход
type Edge = {
    to: string;
    weight: number;
};

// Граф храним как объект: для каждой вершины — массив её ребер
type Graph = Record<string, Edge[]>;

// Очень простая приоритетная очередь на массиве.
// Для учебных задач пойдёт, но для больших графов лучше заменить на кучу.
class SimplePriorityQueue {
    // Храним пары [вершина, приоритет]
    private data: [string, number][] = [];

    // Вставляем элемент и тут же сортируем весь массив по приоритету
    enqueue(node: string, priority: number) {
        this.data.push([node, priority]);
        this.data.sort((a, b) => a[1] - b[1]);
    }

    // Достаём элемент с минимальным приоритетом (самый «близкий»)
    dequeue(): string | undefined {
        const pair = this.data.shift();
        return pair ? pair[0] : undefined;
    }

    // Пустая ли очередь?
    isEmpty(): boolean {
        return this.data.length === 0;
    }
}

// Основная функция: принимает граф и имя стартовой вершины
function dijkstra(graph: Graph, source: string) {
    // 1) Инициализация
    const dist: Record<string, number> = {}; // расстояния
    const prev: Record<string, string | null> = {}; // предыдущие вершины
    const pq = new SimplePriorityQueue(); // наша очередь

    // Ставим dist = ∞ для всех, кроме source = 0
    for (const node in graph) {
        dist[node] = Infinity;
        prev[node] = null;
    }
    dist[source] = 0;
    pq.enqueue(source, 0);

    // 2) Основной цикл
    while (!pq.isEmpty()) {
        // Берём вершину u с минимальным dist[u]
        const u = pq.dequeue()!;
        // Идём по всем её соседям
        for (const edge of graph[u]) {
            const v = edge.to;
            const weight = edge.weight;

            // Вычисляем альтернативное расстояние через u
            const alt = dist[u] + weight;
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
    return { dist, prev };
}

// === Пример использования ===
const graph: Graph = {
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

const result = dijkstra(graph, 'A');
console.log('Кратчайшие расстояния:', result.dist);
console.log('Предыдущие вершины:', result.prev);
