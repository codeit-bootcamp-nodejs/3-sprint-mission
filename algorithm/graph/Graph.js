/**
 * 그래프 (Graph)
 * @description 인접 리스트 기반 그래프 구현
 *
 * @function
 * - addVertex(v): 정점 추가
 * - addEdge(v1, v2): 간선 추가 (단방향)
 * - addUndirected(v1, v2): 간선 추가 (양방향)
 * - getNeighbors(v): 인접 정점 리스트 반환
 * - vertices: 모든 정점 목록 반환
 */
export class Graph {
  constructor() {
    this.adjList = {};
  }

  /**
   * 정점 추가
   * @param {string} v
   */
  addVertex(v) {
    if (!this.adjList[v]) this.adjList[v] = [];
  }

  /**
   * 단방향 간선 추가 (v1 → v2)
   * @param {string} v1
   * @param {string} v2
   */
  addEdge(v1, v2) {
    this.addVertex(v1);
    this.addVertex(v2);
    this.adjList[v1].push(v2);
  }

  /**
   * 양방향 간선 추가 (v1 ↔ v2)
   * @param {string} v1
   * @param {string} v2
   */
  addUndirected(v1, v2) {
    this.addEdge(v1, v2);
    this.addEdge(v2, v1);
  }

  /**
   * 인접 정점 목록 반환
   * @param {string} v
   * @returns {string[]}
   */
  getNeighbors(v) {
    return this.adjList[v] || [];
  }

  /**
   * 그래프 내 정점 목록 반환
   * @returns {string[]}
   */
  vertices() {
    return Object.keys(this.adjList);
  }
}
