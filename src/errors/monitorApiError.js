exports.monitorApiError = class monitorApiError extends Error {
  constructor(error, statusCode) {
    super()
    this.errors = error
    // this.name = 'monitorApiError'
    // this.statusCode = 400
  }

  serializeErrors() {
    if (Array.isArray(this.errors)) {
      return this.errors.map(e => ({
        message: e.msg,
        ...(e.param && { field: e.param }),
      }))
    }

    return [{ message: this.errors.msg || this.errors.message || this.errors }]
  }
}
