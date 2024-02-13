export class AppException extends Error {
  name: string;
  statusCode: number;

  constructor(payload: { message: string; statusCode: number; name: string }) {
    super(payload.message);
    this.statusCode = payload.statusCode;
    this.name = payload.name;
  }
}

export class NotFoundException extends AppException {
  constructor(message?: string) {
    super({
      statusCode: 404,
      name: 'Not Found',
      message: message ?? 'Item not found!',
    });
  }
}

export class ConflictException extends AppException {
  constructor(message?: string) {
    super({
      statusCode: 409,
      name: 'Conflict',
      message: message ?? 'Conflict!',
    });
  }
}
