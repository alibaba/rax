/**
 * ErrorCode mapping:
 *  0: Type of createElement  should not be null or undefined.
 *  1: Hooks can only be called inside a component.
 *  2: Invalid element type.
 *  3: ref: multiple version of Rax used in project.
 * @param errCode {Number}
 */
export function invokeMinifiedError(errCode) {
  throw new Error('Minified error: ' + errCode);
}
