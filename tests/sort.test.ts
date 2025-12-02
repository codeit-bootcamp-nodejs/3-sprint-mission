import { describe, it, expect } from "vitest";
import {
  selectionSort,
  insertionSort,
  mergeSort,
  quickSort,
  treeSort,
} from "../algorithm/sorts";

// 기본
const unsorted = [5, 1, 4, 2, 3];
const sorted = [1, 2, 3, 4, 5];

// 큰 랜덤 배열
const bigArray = Array.from({ length: 200 }, () =>
  Math.floor(Math.random() * 1000)
);
const bigSorted = [...bigArray].sort((a, b) => a - b);

// 중복
const duplicates = [4, 1, 4, 3, 3, 2, 1, 4];
const duplicatesSorted = [...duplicates].sort((a, b) => a - b);

describe("정렬 알고리즘 테스트", () => {
  // ---------------------
  // 기본 케이스
  // ---------------------
  it("선택 정렬", () => {
    const arr = [...unsorted];
    selectionSort(arr);
    expect(arr).toEqual(sorted);
  });

  it("삽입 정렬", () => {
    const arr = [...unsorted];
    insertionSort(arr);
    expect(arr).toEqual(sorted);
  });

  it("병합 정렬", () => {
    const result = mergeSort(unsorted);
    expect(result).toEqual(sorted);
  });

  it("퀵 정렬", () => {
    const arr = [...unsorted];
    quickSort(arr);
    expect(arr).toEqual(sorted);
  });

  it("트리 정렬", () => {
    const result = treeSort(unsorted);
    expect(result).toEqual(sorted);
  });

  // ---------------------
  // 큰 배열 케이스
  // ---------------------
  it("병합 정렬 (큰 배열)", () => {
    expect(mergeSort(bigArray)).toEqual(bigSorted);
  });

  it("퀵 정렬 (큰 배열)", () => {
    const arr = [...bigArray];
    quickSort(arr);
    expect(arr).toEqual(bigSorted);
  });

  // ---------------------
  // 중복 케이스
  // ---------------------
  it("트리 정렬 (중복 포함)", () => {
    expect(treeSort(duplicates)).toEqual(duplicatesSorted);
  });

  // ---------------------
  // 스트레스 테스트 (편향/정렬)
  // ---------------------
  it("퀵 정렬 (이미 정렬된 배열)", () => {
  expect(quickSort([...sorted])).toEqual(sorted);
  });

  it("트리 정렬 (편향 케이스)", () => {
  expect(treeSort(sorted)).toEqual(sorted);
  });
});
