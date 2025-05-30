type ErrorHandler = (error: unknown) => void;

let errorHandler: ErrorHandler = (error) => {
  console.error('Unhandled auth error:', error);
};

export const setErrorHandler = (handler: ErrorHandler) => {
  errorHandler = handler;
};

export const handleError = (error: unknown) => {
  errorHandler(error);
};

export class AuthError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.name = 'AuthError';
    this.status = status;
  }
}
