import Timeline from '../../../src/components/animation/Timeline';

const data = {
  name: 'position',
  keyframes: [
    { time: 0, value: [0, 0] },
    { time: 2, value: [100, 100], ease: 'bounceOut' },
    { time: 4, value: [0, 100], ease: 'expoOut' }
  ]
};
const timeline = new Timeline([data]);

describe('#Timeline', function() {
  it('should return a timeline object', () => {
    expect(timeline).to.be.a('object');
    expect(timeline.properties).to.have.lengthOf(1);
    expect(timeline.properties[0].keyframes.frames).to.have.lengthOf(3);
  });
});
