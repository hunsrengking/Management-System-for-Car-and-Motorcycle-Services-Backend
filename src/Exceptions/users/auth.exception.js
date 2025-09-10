class AuthException extends Error {
  constructor(message = "Authentication error", status = 401) {
    super(message);
    this.status = status;
    this.name = "AuthException";
  }
}
module.exports = AuthException;