export class Product {
  #name;
  #description;
  #price;
  #tags;
  #images;
  #favoriteCount = 0;

  constructor({ name, description, price, tags, images }) {//리턴값에 id도 포함됨.
    this.#name = name;
    this.#description = description;
    this.#price = price;
    this.#tags = tags;
    this.#images = images;
  }

  get name() {
    return this.#name;
  }
  set name(i) {
    this.#name = i;
  }

  get description() {
    return this.#description;
  }
  set description(i) {
    this.#description = i;
  }

  get price() {
    return this.#price;
  }
  set price(i) {
    this.#price = i;
  }

  get tags() {
    return this.#tags;
  }
  set tags(i) {
    this.#tags = i;
  }

  get images() {
    return this.#images;
  }
  set images(i) {
    this.#images = i;
  }

  favorite() {
    this.#favoriteCount++;
  }

  getFavoriteCount() {
    return this.#favoriteCount;
  }
}