const SOURCE =
  'https://gw.alipayobjects.com/os/rmsportal/IAwGkUbOEEKBuJDBZefX.mp3';

describe('<a-audio>', () => {
  it('should render a-audio', () => {
    const el = document.createElement('a-audio');
    el.setAttribute('src', SOURCE);
    el.setAttribute('autoplay', true);

    document.body.appendChild(el);
    expect(el).to.not.be.an.instanceOf(HTMLUnknownElement);
    expect(getComputedStyle(el).display).to.equal('block');
  });
});
