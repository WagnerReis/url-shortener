export class DatabaseError extends Error {
  constructor(
    message: string,
    public readonly originalError?: Error,
  ) {
    super(`Database error: ${message}`);
    this.name = 'DatabaseError';
  }
}
