import { describe, it, expect } from "vitest";

import { HashTable } from "../algorithm/HashTable";
import { Graph } from "../algorithm/graph/Graph";
import { bfs } from "../algorithm/graph/BFS";
import { dfs } from "../algorithm/graph/DFS";

/**
 * HashTable 테스트
 */
describe("HashTable 테스트", () => {
  it("값 추가 및 조회", () => {
    const table = new HashTable();

    table.put("name", "김치볶음밥");
    table.put("price", 12000);

    expect(table.get("name")).toBe("김치볶음밥");
    expect(table.get("price")).toBe(12000);
  });

  it("값 갱신", () => {
    const table = new HashTable();

    table.put("lang", "JS");
    table.put("lang", "TS");

    expect(table.get("lang")).toBe("TS");
  });

  it("키 존재 여부 확인", () => {
    const table = new HashTable();
    table.put("카푸치노", "카페라떼");

    expect(table.has("카푸치노")).toBe(true);
    expect(table.has("아메리카노")).toBe(false);
  });

  it("값 삭제", () => {
    const table = new HashTable();

    table.put("key1", "value1");
    expect(table.remove("key1")).toBe(true);
    expect(table.get("key1")).toBe(undefined);
    expect(table.remove("nothing")).toBe(false);
  });
});

/**
 * Graph 테스트
 */
describe("Graph 테스트", () => {
  it("정점 및 간선 추가", () => {
    const g = new Graph();

    g.addVertex("A");
    g.addVertex("B");
    g.addEdge("A", "B");

    expect(g.getNeighbors("A")).toEqual(["B"]);
    expect(g.vertices()).toContain("A");
    expect(g.vertices()).toContain("B");
  });

  it("양방향 간선 추가", () => {
    const g = new Graph();
    g.addUndirected("X", "Y");

    expect(g.getNeighbors("X")).toEqual(["Y"]);
    expect(g.getNeighbors("Y")).toEqual(["X"]);
  });
});

/**
 * BFS 테스트
 */
describe("BFS 테스트", () => {
  it("너비 우선 탐색 순서 확인", () => {
    const graph = {
      A: ["B", "C"],
      B: ["D", "E"],
      C: ["F"],
      D: [],
      E: ["F"],
      F: [],
    };

    const result = bfs(graph, "A");
    expect(result).toEqual(["A", "B", "C", "D", "E", "F"]);
  });

  it("고립된 정점에서 시작", () => {
    const graph = {
      X: [],
      Y: ["X"],
    };

    expect(bfs(graph, "X")).toEqual(["X"]);
  });
});

/**
 * DFS 테스트
 */
describe("DFS 테스트", () => {
  it("깊이 우선 탐색 순서 확인", () => {
    const graph = {
      A: ["B", "C"],
      B: ["D", "E"],
      C: ["F"],
      D: [],
      E: ["F"],
      F: [],
    };

    const result = dfs(graph, "A");
    expect(result).toEqual(["A", "B", "D", "E", "F", "C"]);
  });

  it("고립된 정점에서 시작", () => {
    const graph = {
      X: [],
      Y: ["X"],
    };

    expect(dfs(graph, "X")).toEqual(["X"]);
  });
});
