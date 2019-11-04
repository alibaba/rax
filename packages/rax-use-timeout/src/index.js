import { useEffect, useRef } from 'rax';

export default function useTimeout(fn, delay) {
  const ref = useRef();

  // Update to the latest function.
  useEffect(() => {
    ref.fn = fn;
  }, [fn]);

  useEffect(() => {
    const id = setTimeout(ref.fn, delay);
    return () => clearTimeout(id);
  }, [delay]);
}
