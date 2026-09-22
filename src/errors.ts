export class ActionError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'ActionError';
  }
}

export class BadRequestError extends ActionError {
  constructor(message: string) {
    super(400, message);
  }
}
export class NotFoundError extends ActionError {
  constructor(message: string) {
    super(404, message);
  }
}
export class UnAuthorizedError extends ActionError {
  constructor(message: string) {
    super(401, message);
  }
}
export class ForbiddenError extends ActionError {
  constructor(message: string) {
    super(403, message);
  }
}
