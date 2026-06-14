export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class PokemonNotFoundError extends AppError {
  constructor(name: string) {
    super(`Pokemon '${name}' not found`, 404);
  }
}

export class ExternalApiError extends AppError {
  constructor(service: string, originalError?: Error) {
    super(`External API error from ${service}: ${originalError?.message || 'unknown'}`, 502);
  }
}
