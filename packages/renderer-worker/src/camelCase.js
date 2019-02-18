const CAMELCASE_REG = /-[a-z]/g;
const CamelCaseCache = {};

export default function camelCase(str) {
  return (
    CamelCaseCache[str] ||
    (CamelCaseCache[str] = str.replace(CAMELCASE_REG, $1 =>
      $1.slice(1).toUpperCase()
    ))
  );
}
