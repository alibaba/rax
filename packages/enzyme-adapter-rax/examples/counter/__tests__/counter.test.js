/* eslint-disable import/no-extraneous-dependencies */
import { createElement } from 'rax';
import { mount, render, shallow } from 'enzyme';

import Counter from '../src/Counter';
import CompositeCounter from '../src/CompositeCounter';

describe('Counter mount mode', () => {
  beforeEach(function() {
    jest.useFakeTimers();
  });

  it('should display initial count', () => {
    const wrapper = mount(<Counter initialCount={5} />);
    expect(wrapper.text()).toEqual('Current value: 5');
  });

  it('should increment after "Increment" button is clicked', () => {
    const wrapper = mount(<Counter initialCount={5} />);
    wrapper.find('button').simulate('click');
    jest.runAllTimers();
    expect(wrapper.text()).toEqual('Current value: 6');
  });
});

describe('Counter string mode', () => {
  it('should display initial count', () => {
    const wrapper = render(<Counter initialCount={5} />);
    expect(wrapper['0'].children[0].data).toEqual('Current value: 5');
  });
});

describe('Counter shallow mode', () => {
  it('should display initial count', () => {
    const wrapper = shallow(<CompositeCounter initialCount={5} />);
    expect(wrapper.text()).toEqual('<Child />Current value: 5');
  });

  it('should increment after "Increment" button is clicked', () => {
    const wrapper = shallow(<CompositeCounter initialCount={5} />);
    wrapper.find('button').simulate('click');
    jest.runAllTimers();
    expect(wrapper.text()).toEqual('<Child />Current value: 6');
  });
});
