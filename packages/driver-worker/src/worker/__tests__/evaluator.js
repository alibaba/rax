import Evaluator from '../Evaluator';

describe('Evaluator', () => {
  it('send', (done) => {
    const data = { hello: 'world' };
    const sender = (message) => {
      expect(message).toEqual({
        type: 'EvaluationRecord',
        data,
      });
      done();
    };
    const evaluator = new Evaluator(sender);
    evaluator._send(data);
  });

  it('get', (done) => {
    const sender = (message) => {
      expect(message).toMatchSnapshot();
      done();
    };
    const evaluator = new Evaluator(sender);
    evaluator.get('document.body.clientWidth');
  });

  it('set', (done) => {
    const sender = (message) => {
      expect(message).toMatchSnapshot();
      done();
    };
    const evaluator = new Evaluator(sender);
    evaluator.set('document.body.innerHTML', JSON.stringify('hello world'));
  });

  it('delete', (done) => {
    const sender = (message) => {
      expect(message).toMatchSnapshot();
      done();
    };
    const evaluator = new Evaluator(sender);
    evaluator.delete('foo.bar');
  });

  it('call with success', (done) => {
    const evaluator = new Evaluator((message) => {
      expect(message).toMatchSnapshot();

      setTimeout(() => {
        evaluator.apply({
          id: message.data.id,
          type: 'success',
          success: 'YES',
        });
      }, 300);
    });
    evaluator.call('foo.bar', 123, 'hello')
      .then((val) => {
        expect(val).toEqual('YES');
        done();
      });
  });

  it('call with error', (done) => {
    const evaluator = new Evaluator((message) => {
      expect(message).toMatchSnapshot();

      setTimeout(() => {
        evaluator.apply({
          id: message.data.id,
          type: 'error',
          error: 'NO',
        });
      }, 300);
    });
    evaluator.call('foo.bar', 123, 'hello')
      .catch((error) => {
        expect(error).toEqual('NO');
        done();
      });
  });
});
