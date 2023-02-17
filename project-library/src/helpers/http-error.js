'use strict';

class HttpError {
    constructor(error, options = null) {
        if (typeof(error) === 'string' && options == null) {
            this.statusCode = 500;
            this.message = error;
            this.name = 'InternalServerError';
        } else if (typeof(error) === 'string' && options != null) {
            this.statusCode = options.statusCode;
            this.data = error;
        } else {
            if ( error.name === 'ValidationError' ) {
                error.statusCode = 422;
            }
            let errorName;

            const status = {
                422: "ValidationError",
                401: "UnauthorizedError",
                403: "ForbiddenError",
                404: "NotFoundError"
            };

            if (!status[error.statusCode]) {
                errorName = "InternalServerError";
            } else {
                errorName = status[error.statusCode];
            }

            this.statusCode = error.statusCode ? error.statusCode : 500;
            this.message = error.message || 'Something wrong!';
            this.errors = error.errors;
            this.name = errorName;
        }
    }
}

module.exports = { HttpError }