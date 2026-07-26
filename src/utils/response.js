const response = {
  success(res, { data = null, message = 'Success', statusCode = 200, ...extra } = {}) {
    return res.status(statusCode).json({ success: true, message, data, ...extra });
  },

  created(res, { data = null, message = 'Created successfully', ...extra } = {}) {
    return this.success(res, { data, message, statusCode: 201, ...extra });
  },

  ok(res, message = 'Success') {
    return this.success(res, { data: null, message, statusCode: 200 });
  },

  error(res, { message = 'Internal server error', statusCode = 500 } = {}) {
    return res.status(statusCode).json({ success: false, message });
  },

  badRequest(res, message = 'Bad request') {
    return this.error(res, { message, statusCode: 400 });
  },

  notFound(res, message = 'Resource not found') {
    return this.error(res, { message, statusCode: 404 });
  },

  validationError(res, error) {
    const messages = error.issues.map((i) => i.message);
    return this.error(res, { message: messages, statusCode: 400 });
  },

  serverError(res, error) {
    if (error) console.error(error);
    return this.error(res, { message: 'Servernya ngambek coy' });
  },

  handleError(res, error) {
    if (error instanceof Error && 'statusCode' in error) {
      return this.error(res, { message: error.message, statusCode: error.statusCode });
    }
    return this.serverError(res, error);
  },
};

export default response;
