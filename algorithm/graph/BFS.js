/**
 * BFS (너비 우선 탐색)
 *
 * @param {Record<string, string[]>} graph - 인접 리스트 기반 그래프
 * @param {string} start - 시작 노드
 * @returns {string} BFS 탐색 순서
 */
export const bfs = (graph, start) => {
  const visited = new Set();
  const queue = [];
  const order = [];

  queue.push(start);
  visited.add(start);

  while (queue.length > 0) {
    const node = queue.shift();
    order.push(node);

    const neighbors = graph[node] || [];
    for (const next of neighbors) {
      if (!visited.has(next)) {
        visited.add(next);
        queue.push(next);
      }
    }
  }

  return order;
};
