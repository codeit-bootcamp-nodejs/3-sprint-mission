import { Product } from './Product.js';

export class ElectronicProduct extends Product {
  #manufacturer;

  constructor({ manufacturer, ...rest }) {
    super(rest);
    this.manufacturer = manufacturer;
  }

  get manufacturer() {
    return this.#manufacturer;
  }
  set manufacturer(i) {
    this.#manufacturer = i;
  }
}