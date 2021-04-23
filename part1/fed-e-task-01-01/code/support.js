class Maybe {
   static of (value) {
    return new Maybe(value)
  }

  constructor(value) {
    this._value = value
  }

  map(fn) {
     if (this._value === null || this._value === undefined) return Maybe.of(this._value)
    return Maybe.of(fn(this._value))
  }
}

class Container{
  static of (value) {
    return new Container(value)
  }

  constructor(value) {
    this._value = value
  }

  map(fn) {
    return Container.of(fn(this._value))
  }
}

module.exports = {
  Maybe: Maybe,
  Container: Container
}
