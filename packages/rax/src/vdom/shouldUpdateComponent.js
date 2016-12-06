function shouldUpdateComponent(prevElement, nextElement) {
  // TODO: prevElement and nextElement could be array
  let prevEmpty = prevElement === null;
  let nextEmpty = nextElement === null;
  if (prevEmpty || nextEmpty) {
    return prevEmpty === nextEmpty;
  }

  let prevType = typeof prevElement;
  let nextType = typeof nextElement;
  if (prevType === 'string' || prevType === 'number') {
    return nextType === 'string' || nextType === 'number';
  } else {
    return (
      prevType === 'object' &&
      nextType === 'object' &&
      prevElement.type === nextElement.type &&
      prevElement.key === nextElement.key
    );
  }
}

export default shouldUpdateComponent;
