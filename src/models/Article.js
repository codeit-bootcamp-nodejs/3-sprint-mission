export class Article {
  #title;
  #content;
  #writer;
  #likeCount = 0;
  #createdAt;

  constructor({ title, content, writer = '익명' }) {//writer 반환 X
    this.title = title;
    this.content = content;
    this.writer = writer;
    this.createdAt = new Date();
  }

  get title() {
    return this.#title;
  }
  set title(i) {
    this.#title = i;
  }

  get content() {
    return this.#content;
  }
  set content(i) {
    this.#content = i;
  }

  get writer() {
    return this.#writer;
  }
  set writer(i) {
    this.#writer = i;
  }

  get createdAt() {
    return this.#createdAt;
  }
  set createdAt(i) {
    this.#createdAt = new Date(i);
  }

  like() {
    this.#likeCount++;
  }

  getLikeCount() {
    return this.#likeCount;
  }
}

/* 
※ Article에도 상속이 필요하다면,
아래와 같은 느낌으로 prioirty를 두고 상속 및 다형성(override) 구현 가능할 것.

import { Article } from './Article.js';

export class NoticeArticle extends Article {
  #priority;
  constructor({ priority = 'high', ...rest }) {
    super(rest);
    this.priority = priority;
  }
  get priority() {
    return this.#priority;
  }
  set priority(i) {
    this.#priority = i;
  }

  like() {
    super.like();
    super.like();
  }
}
 */