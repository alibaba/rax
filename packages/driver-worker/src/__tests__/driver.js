import { render, createElement } from 'rax';
import Event from '../worker/Event';
import createDriver from '../index';

describe('driver-worker', () => {
  it('should be drived by rax', (done) => {
    const addEventListener = () => {};
    const postMessage = (message) => {
      expect(message).toMatchSnapshot();
      done();
    };
    const driver = createDriver({ addEventListener, postMessage });
    render(createElement('view'), null, { driver });
  });

  it('should works with dom operation', (done) => {
    const addEventListener = (eventName, handler) => {
      // console.log('addEventListener', eventName, handler);
    };
    const postMessage = (message) => {
      expect(message).toMatchSnapshot();
      done();
    };
    const driver = createDriver({ addEventListener, postMessage });

    // Create body
    const body = driver.createBody();
    // Create element
    const container = driver.createElement({ type: 'view', props: { count: 0 } });
    // Append child
    body.appendChild(container);
    // Create comment
    const comment = driver.createComment('empty');
    driver.appendChild(comment, container);

    // removeChild
    const toBeRemoved = driver.createElement({ type: 'be-remove' });
    body.appendChild(toBeRemoved);
    driver.removeChild(toBeRemoved, body);

    // replaceChild
    const toBeReplaced = driver.createElement({ type: 'be-replace' });
    const toReplace = driver.createElement({ type: 'replaced' });
    body.appendChild(toBeRemoved);
    driver.replaceChild(toReplace, toBeReplaced, body);

    // insertAfter
    const toBeInsertAfter = driver.createElement({ type: 'be-insert-after' });
    driver.insertAfter(toBeInsertAfter, comment, body);

    // insertBefore
    const toBeInsertBefore = driver.createElement({ type: 'be-insert-before' });
    driver.insertBefore(toBeInsertBefore, comment, body);
  });

  it('should works with device width and viewport width', () => {
    let sendMessageToWorker;
    const addEventListener = (event, handler) => {
      sendMessageToWorker = handler;
    };
    const postMessage = (message) => {};
    const driver = createDriver({ addEventListener, postMessage });

    // Default device width be undefined
    expect(driver.getDeviceWidth()).toBeUndefined();

    // Mock init event.
    sendMessageToWorker({
      data: {
        type: 'init',
        width: 100,
      },
    });
    expect(driver.getDeviceWidth()).toEqual(100);

    // Set device width
    driver.setDeviceWidth(200);
    expect(driver.getDeviceWidth()).toEqual(200);

    // Set viewport width
    driver.setViewportWidth(100);
    expect(driver.getViewportWidth()).toEqual(100);
  });


  it('shuold work with event listener API', (done) => {
    const addEventListener = (event, handler) => { };
    const postMessage = (message) => {};
    const driver = createDriver({ addEventListener, postMessage });

    const body = driver.createBody();
    const onMove = (event) => {
      throw new Error('should not fire move event.');
    };
    const el = driver.createElement({
      type: 'view',
      props: {
        onMove,
        onClick: (event) => done(),
      },
    });
    body.appendChild(el);

    driver.removeEventListener(el, 'move', onMove);
    el.dispatchEvent({
      type: 'move',
      target: el,
    });

    el.dispatchEvent({
      type: 'click',
      target: el,
    });
  });

  it('shuold work with remove all event listeners', (done) => {
    const addEventListener = (event, handler) => { };
    const postMessage = (message) => {};
    const driver = createDriver({ addEventListener, postMessage });

    const body = driver.createBody();
    const toThrow = (event) => {
      throw new Error('should not fire move event.');
    };
    const el = driver.createElement({
      type: 'view',
      props: {
        onMove: toThrow,
        onClick: toThrow,
      },
    });
    body.appendChild(el);

    // Remove all event listeners will not fire anymore.
    driver.removeAllEventListeners(el);
    el.dispatchEvent({
      type: 'move',
      target: el,
    });
    el.dispatchEvent({
      type: 'click',
      target: el,
    });
    done();
  });

  it('should work with attributes', () => {
    const addEventListener = (event, handler) => { };
    const postMessage = (message) => {};
    const driver = createDriver({ addEventListener, postMessage });

    const body = driver.createBody();
    const el = driver.createElement({
      type: 'view',
    });
    body.appendChild(el);

    driver.setAttribute(el, 'key', 'value');
    expect(el.getAttribute('key')).toEqual('value');
  });

  it('should work with setNativeProps', (done) => {
    const addEventListener = (event, handler) => { };
    const postMessage = (message) => {
      expect(message).toMatchSnapshot();
      done();
    };
    const driver = createDriver({ addEventListener, postMessage });

    const body = driver.createBody();
    const el = driver.createElement({
      type: 'view',
    });
    driver.setNativeProps(el, {
      onClick: () => {},
      foo: 'bar',
      number: 0,
    });
    body.appendChild(el);
  });

  it('sanitize', () => {
    const addEventListener = (event, handler) => { };
    const postMessage = (message) => {};
    const driver = createDriver({ addEventListener, postMessage });
    const el = driver.createElement({ type: 'foo' });
    el.setAttribute('foo', 'bar');
    el.style = { color: 'red' };

    expect(driver.sanitize(el, 'addedNodes')).toMatchSnapshot();
    expect(driver.sanitize([el, el], 'addedNodes')).toMatchSnapshot();
  });

  it('convertTouchTarget', () => {
    const addEventListener = (event, handler) => { };
    const postMessage = (message) => {};
    const driver = createDriver({ addEventListener, postMessage });
    const event = new Event('touchstart');
    driver.nodesMap.set('0', 'FOO');
    const touch = {
      $$id: '0',
    };
    event.touches = [touch];
    event.changedTouches = [touch];
    driver.convertTouchTarget(event);

    expect(event).toMatchSnapshot();
  });

  it('appendChild', () => {
    const addEventListener = (event, handler) => { };
    const postMessage = (message) => {};
    const driver = createDriver({ addEventListener, postMessage });
    const parent = driver.createElement({ type: 'parent' });
    const son = driver.createElement({ type: 'son' });
    driver.appendChild(son, parent);
    expect(son.parentNode).toEqual(parent);
  });

  it('removeChild', () => {
    const addEventListener = (event, handler) => { };
    const postMessage = (message) => {};
    const driver = createDriver({ addEventListener, postMessage });
    const parent = driver.createElement({ type: 'parent' });
    const son = driver.createElement({ type: 'son' });
    parent.appendChild(son);
    driver.removeChild(son, parent);
    expect(parent.childNodes.length).toEqual(0);
  });
});
