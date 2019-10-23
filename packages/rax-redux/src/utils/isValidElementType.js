export default function isValidElementType(type) {
  return (
    typeof type === 'string' ||
    typeof type === 'function' ||
    typeof type === 'object' && type !== null
  );
}