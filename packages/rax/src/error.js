const COMMON_ERROR_MESSAGE = 'Minified error.';

export function invokeMinifiedError() {
  throw new Error(COMMON_ERROR_MESSAGE);
}
