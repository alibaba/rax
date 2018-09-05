import { handlerSubmit } from '../../../src/shared/utils/';

describe('form', () => {
  const childStirng = `
    <a-input name="input" value="alibaba" id="input"></a-input>
    <a-checkbox-group name="checkbox">
      <a-checkbox value="China" checked>China</a-checkbox>
      <a-checkbox value="UK">UK</a-checkbox>
      <a-checkbox value="Korea">Korea</a-checkbox>
    </a-checkbox-group>
    <a-radio-group name="radio">
      <a-radio value="React" checked> React </a-radio>
      <a-radio value="Vue"> Vue </a-radio>
    </a-radio-group>
    <a-slider name="slider"></a-slider>
    <a-textarea name="textarea" id="textarea"></a-textarea>
    <a-switch name="switch" checked></a-switch>
  `;
  it('submit', done => {
    const form = document.createElement('a-form');

    form.innerHTML = childStirng;
    document.body.appendChild(form);
    // change the input value
    form.querySelector('#input').value = 'Taobao';
    // change the textarea value
    form.querySelector('#textarea').value = 'test textrea';
    const expectValue = {
      input: 'Taobao',
      checkbox: ['China'],
      radio: 'React',
      slider: 0,
      textarea: 'test textrea',
      switch: true
    };
    let evtValue;
    form.addEventListener('submit', evt => {
      evtValue = evt.detail.value;
    });
    handlerSubmit(form);

    expect(evtValue).to.deep.equal(expectValue);

    done();
  });

  it('reset', done => {
    const form = document.createElement('a-form');

    form.innerHTML = `
      ${childStirng}
      <a-button form-type="reset" id="btn">Reset</a-button>
    `;
    document.body.appendChild(form);
    const resetFn = sinon.spy();
    form.addEventListener('custom-reset', resetFn);

    const clickEvt = new Event('click');
    const btn = form.querySelector('#btn');
    btn.dispatchEvent(clickEvt);

    expect(resetFn.called).to.have.be.true;

    done();
  });
});
