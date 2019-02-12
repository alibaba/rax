import EventTarget from '../EventTarget';
import Event from '../Event';

describe('EventTarget', () => {
  it('addEventListener', () => {
    const eventTarget = new EventTarget();
    const handler = () => {};
    eventTarget.addEventListener('foo', handler);
    expect(eventTarget._eventListeners.foo).toEqual([handler]);
  });

  it('removeEventListener', () => {
    const eventTarget = new EventTarget();
    const handler = () => {};
    eventTarget.addEventListener('foo', handler);
    eventTarget.removeEventListener('foo', handler);
    expect(eventTarget._eventListeners.foo).toEqual([]);
  });

  it('dispatchEvent', (done) => {
    const eventTarget = new EventTarget();
    const handler = () => {
      done();
    };
    eventTarget.addEventListener('foo', handler);
    eventTarget.dispatchEvent(new Event('foo'));
  });

  it('getEvents', () => {
    const eventTarget = new EventTarget();
    const handler = () => {};
    eventTarget.addEventListener('foo', handler);
    eventTarget.removeEventListener('foo', handler);
    expect(eventTarget._getEvents()).toEqual([]);
  });


  it('bubbles', (done) => {
    const eventTarget1 = new EventTarget();
    const eventTarget2 = new EventTarget();
    eventTarget2.parentNode = eventTarget1;

    eventTarget1.addEventListener('foo', (evt) => {
      done();
    });
    eventTarget2.dispatchEvent(new Event('foo', { bubbles: true, cancelable: true }));
  });

  it('stopPropagation', (done) => {
    const eventTarget1 = new EventTarget();
    const eventTarget2 = new EventTarget();
    eventTarget2.parentNode = eventTarget1;

    eventTarget1.addEventListener('foo', (evt) => {
      expect(evt.bubbles).toEqual(false);
      throw new Error('Should not bubble event.');
    });
    eventTarget2.addEventListener('foo', (evt) => {
      expect(evt.bubbles).toEqual(true);
      evt.stopPropagation();
      setTimeout(done);
    });
    eventTarget2.dispatchEvent(new Event('foo', { bubbles: true }));
  });
});
