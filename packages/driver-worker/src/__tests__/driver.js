import Rax from 'rax';
import createDriver from '../index';

describe('driver-worker', () => {
  it('should postMessage by driver', (done) => {
    const addEventListener = () => {};
    const postMessage = (message) => {
      expect(message).toMatchSnapshot();
      done();
    };
    const driver = createDriver({ addEventListener, postMessage });
    Rax.render(Rax.createElement('view'), null, { driver });
  });
});
