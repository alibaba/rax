export default class AnimatedValueSubscription {
  // _value;
  // _token: string;

  constructor(value, callback) {
    this._value = value;
    this._token = value.addListener(callback);
  }

  remove() {
    this._value.removeListener(this._token);
  }
}
