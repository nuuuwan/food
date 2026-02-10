export class Photo {
  constructor({ id = "", timestamp = Date.now(), imageUri = "" } = {}) {
    this.id = id;
    this.timestamp = timestamp;
    this.imageUri = imageUri;
  }

  static fromJSON(data) {
    return new Photo(data);
  }

  toJSON() {
    return {
      id: this.id,
      timestamp: this.timestamp,
      imageUri: this.imageUri,
    };
  }
}
