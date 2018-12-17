import Keyframes from '../../../src/components/animation/Keyframes';

describe('#Keyframes', function() {
  const keyframes = [{
    value: 1,
    time: 0
  }, {
    value: 0.5,
    time: 0.5
  }, {
    value: 0,
    time: 1
  }];

  it('should return a keyframe object', () => {
    const keyframe = new Keyframes(keyframes);
    expect(keyframe).to.be.a('object');
    expect(keyframe.value(0.6)).to.equal(0.4);
  });

  it('should pass a easing function', () => {
    const keyframe = new Keyframes(keyframes, 'ease');
    expect(keyframe.easing).to.equal('ease');
    expect(keyframe.value(0.6)).to.equal(0.3523790698484504);
  });

  it('should parse a color string', () => {
    const keyframe = new Keyframes([{
      value: 'red',
      time: 0
    }, {
      value: 'yellow',
      time: 1
    }]);
    expect(keyframe.value(0.4)).to.equal('rgba(255, 102, 0, 1)');
  });

  it('should parse array', () => {
    const keyframe = new Keyframes([{
      value: [0, 0],
      time: 0
    }, {
      value: [100, 50],
      time: 1
    }]);
    const value = keyframe.value(0.7);
    expect(value[0]).to.equal(70);
    expect(value[1]).to.equal(35);
  });

  it('should return next keyframe with near time', () => {
    const keyframe = new Keyframes(keyframes);
    const value = keyframe.next(0.3);
    expect(value.value).to.equal(0.5);
    expect(value.time).to.equal(0.5);
  });

  it('should return previous keyframe with near time', () => {
    const keyframe = new Keyframes(keyframes);
    const value = keyframe.previous(0.3);
    expect(value.value).to.equal(1);
    expect(value.time).to.equal(0);
  });
});
