import { useEffect, useRef } from 'rax';

function useInterval(fn, delay) {
  const ref = useRef();

  // Update to the latest function.
  useEffect(
    () => {
      ref.fn = fn;
    },
    [fn]
  );

  useEffect(() => {
    if (delay !== null) {
      let id = setInterval(ref.fn, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default useInterval;