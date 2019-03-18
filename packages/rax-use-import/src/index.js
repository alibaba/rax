import { useMemo } from 'rax';
import usePromise from 'rax-use-promise';

export default function useImport(create) {
  let [mod, error] = usePromise(
    useMemo(create, [])
  );

  if (mod) {
    mod = mod.__esModule ? mod.default : mod;
  }

  return [mod, error];
}