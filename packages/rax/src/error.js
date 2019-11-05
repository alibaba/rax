/**
 * ErrorCode mapping:
 *  0: Type of createElement should not be null or undefined.
 *  1: Hooks can only be called inside a component.
 *  2: Invalid component type.
 *  3: ref: multiple version of Rax used in project.
 * @param code {Number}
 */
export function invokeMinifiedError(code, info) {
  throw new Error(`Error: ${code} ${info}`);
}
