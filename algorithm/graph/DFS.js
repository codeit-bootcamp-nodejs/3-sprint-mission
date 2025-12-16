/**
 * DFS (깊이 우선 탐색)
 * @description 재귀 호출로 한 경로를 끝까지 찾는 탐색
 *
 * @param {Record<string, string[]>} graph - 인접 리스트 기반 그래프
 * @param {string} start - 시작 노드
 * @returns {string[]} DFS 탐색 순서
 */
export const dfs = (graph, start) => {
  const visited = new Set();
  const order = [];

  const traverse = (node) => {
    if (visited.has(node)) return;

    visited.add(node);
    order.push(node);

    const neighbors = graph[node] || [];
    for (const next of neighbors) {
      traverse(next);
    }
  };

  traverse(start);
  return order;
};
