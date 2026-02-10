export class Ingredient {
  constructor({ name = "", quantity = "" } = {}) {
    this.name = name;
    this.quantity = quantity;
  }

  static fromJSON(data) {
    if (typeof data === "string") {
      return new Ingredient({ name: data, quantity: "" });
    }
    return new Ingredient(data);
  }

  toJSON() {
    return {
      name: this.name,
      quantity: this.quantity,
    };
  }

  toString() {
    return this.quantity ? `${this.name} - ${this.quantity}` : this.name;
  }
}
