import { useMemo } from 'rax';
import usePromise from 'rax-use-promise';

export default function useFetch(input, init, responseType = 'json') {
  return usePromise(
    useMemo(
      () => fetch(input, init).then((response) => {
        return response[responseType]();
      }),
      [input, init]
    )
  );
}