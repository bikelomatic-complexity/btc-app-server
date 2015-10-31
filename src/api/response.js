import _ from 'underscore';

/**
 * Map from HTTP methods to a pair of normal success and failure codes for that
 * method. These codes don't always apply, so you can ovveride them in the
 * ResponseBuilder.
 */
const methodMap = new Map([ [
  'put', {
    success: 201, // Created
    failure: 400  // Bad request
  }
], [
  'get', {
    success: 200, // Ok
    failure: 400
  }
], [
  'post', {
    success: 200,
    failure: 400
  }
], [
  'delete', {
    success: 200,
    failure: 400
  }
] ]);

/**
 * Allows the caller to accumulate response data as it is learned. The
 * data may be applied to an Express 4.0 response object. This class uses the
 * builder design pattern with an immutable twist. Every builder method
 * returns a modified copy of the original. Since there are often many
 * branches to handle in an HTTP response, you can reuse builders within
 * a branch, and specialize them at the last moment.
 */
export class ResponseBuilder {

  /**
   * @param {ResponseBuilder} other - if specified, new builder will be a copy
   */
  constructor(other) {
    if(other) {
      /** The body of the HTTP response, in json */
      this.body = _(other.body).clone(); // Need to deep clone
      /** Will be true if the caller specifies an exact HTTP status code */
      this.forceCode = other.forceCode;
      /** HTTP response code */
      this.code = other.code;
      /** HTTP method, used for defaulting an appropriate response code */
      this.method = other.method;
    } else {
      this.body = {};
      this.forceCode = false;
    }
  }

  /** If you specify an HTTP method, this.status() will apply a default code */
  method(method) {
    const obj = new ResponseBuilder(this);
    obj.method = method;
    return obj;
  }

  /**
   * If an HTTP verb has been specified, this method will apply a default code
   * @param {boolean} success - true if the operation succeeded
   */
  status(success) {
    const obj = new ResponseBuilder(this);
    if(!this.forceCode && this.method) {
      const codes = methodMap.get(this.method);

      if(success) {
        obj.code = codes.success;
      } else {
        obj.code = codes.failure;
      }
    }
    return obj;
  }

  /** Specify the HTTP status code */
  statusCode(code) {
    const obj = new ResponseBuilder(this);
    obj.code = code;
    obj.foreCode = true;
    return obj;
  }

  /**
   * Specify a message to return in the body. Messages are appended in
   * repeated calls.
   */
  message(message) {
    const obj = new ResponseBuilder(this);
    if(this.body.message) {
      obj.body.message += message;
    } else {
      obj.body.message = message;
    }
    return obj;
  }

  /** Add a key/value pair to the body */
  set(key, value) {
    const obj = new ResponseBuilder(this);
    obj.body[key] = value;
    return obj;
  }

  /** @return the json body */
  build() {
    return this.body;
  }

  /**
   * Apply the appropriate response code to the express response object
   * and send the json body.
   * @param {Object} res - an Express 4.0 response object
   */
  send(res) {
    res.status(this.code).json(this.build())
  }
}
