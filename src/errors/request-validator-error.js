const { monitorApiError } = require('./monitorApiError')

exports.RequestValidationError = class RequestValidationError extends (
  monitorApiError
) {
  constructor(errors) {
    super(errors)
    this.errors = errors
    this.name = 'RequestValidationError'
    this.statusCode = 400
  }

  serializeErrors() {
    return this.errors.map(e => {
      if (e.nestedErrors) {
        return e.nestedErrors.map(nestedError => {
          if (nestedError.name !== 'RequestValidationError')
            return {
              message: nestedError.msg,
              ...(nestedError.param && { field: nestedError.param }),
            }
        })
      } else return { message: e.msg, ...(e.param && { field: e.param }) }
    })
  }
}
