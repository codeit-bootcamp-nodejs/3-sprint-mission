//캡슐화
export default class Product {
  constructor(name, description, price, tags, images, favoriteCount = 0) {
    this._name = name;
    this._description = description;
    this._price = price;
    this._tags = tags;
    this._images = images;
    this._favoriteCount = favoriteCount;
  }

  //getter
  get productName() {
    return this._name;
  }

  //setter
  set productName(name) {
    this._name = name
  }

  //getter
  get productDescription() {
    return this._description;
  }

  //setter
  set productDescription(description) {
    this._description = description
  }

  //getter
  get productPrice() {
    return this._price;
  }

  //setter
  set productPrice(price) {
    this._price = price
  }

  //getter
  get productTags() {
    return this._tags;
  }

  //setter
  set productTags(tags) {
    this._tags = tags
  }

  //getter
  get productImages() {
    return this._images;
  }

  //setter
  set productImages(images) {
    this._images = images
  }

  favorite() {
    this._favoriteCount++;
  }

  get favoriteCount() {
    return this._favoriteCount
  }
}

export class ElectronicProduct extends Product {
  constructor(name, description, price, tags, images, favoriteCount = 0, manufacturer) {
    super(name, description, price, tags, images, favoriteCount);
    this._manufacturer = manufacturer;
  }
  get productManufacturer() {
    return this._manufacturer;
  }
}