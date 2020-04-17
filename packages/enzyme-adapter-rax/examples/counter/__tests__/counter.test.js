/* eslint-disable import/no-extraneous-dependencies */
import { createElement } from 'rax';
import { mount } from 'enzyme';

import Counter from '../src/Counter';

describe('Counter', () => {
  beforeEach(function() {
    jest.useFakeTimers();
  });

  it('should display initial count', () => {
    const wrapper = mount(<Counter initialCount={5} />);
    jest.runAllTimers();
    const text = wrapper.text();
    expect(text).toEqual('Current value: 5');
  });

  // it('should increment after "Increment" button is clicked', () => {
  //   const wrapper = mount(<Counter initialCount={5} />);
  //   jest.runAllTimers();
  //   wrapper.find('button').simulate('click');

  //   expect(wrapper.text()).to.include('Current value: 6');
  // });
});
