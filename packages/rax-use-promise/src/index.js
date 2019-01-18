import { useEffect, useState } from 'rax';

export default function usePromise(promise) {
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(
    () => {
      let canceled = false;

      promise
        .then(r => {
          if (!canceled) {
            setResult(r);
          }
        })
        .catch(e => {
          if (!canceled) {
            setError(e);
          }
        });

      return () => {
        canceled = true;
      };
    },
    [promise]
  );

  return [result, error];
}