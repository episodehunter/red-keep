export class ShowExistError extends Error {
  constructor(msg) {
    super(msg)
    this.name = this.constructor.name
  }
}

export class ShowNotExistError extends Error {
  constructor(msg) {
    super(msg)
    this.name = this.constructor.name
  }
}

export class BadInput extends Error {
  constructor(msg) {
    super(msg)
    this.name = this.constructor.name
  }
}
