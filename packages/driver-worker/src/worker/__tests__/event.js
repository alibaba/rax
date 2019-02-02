import Event from '../Event';

describe('Event', () => {
  it('contructor', () => {
    const event = new Event('input', {
      bubbles: true,
      cancelable: true,
    });
    expect(event.type).toEqual('input');
    expect(event.bubbles).toEqual(true);
    expect(event.cancelable).toEqual(true);
  });

  it('stopPropagation', () => {
    const event = new Event('input');
    event.stopPropagation();
    expect(event.bubbles).toEqual(false);
  });

  it('stopImmediatePropagation', () => {
    const event = new Event('input');
    event.stopImmediatePropagation();
    expect(event.bubbles).toEqual(false);
    expect(event._end).toEqual(true);
  });

  it('preventDefault', () => {
    const cancelableEvent = new Event('input', { cancelable: true });
    cancelableEvent.preventDefault();
    expect(cancelableEvent.defaultPrevented).toEqual(true);

    const uncancelableEvent = new Event('input', { cancelable: false });
    uncancelableEvent.preventDefault();
    expect(uncancelableEvent.defaultPrevented).toEqual(false);
  });
});
