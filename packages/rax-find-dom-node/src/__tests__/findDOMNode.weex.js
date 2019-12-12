/* @jsx createElement */

import {shared} from 'rax';
import ServerDriver from 'driver-server';
import findDOMNode from '../';
import getElementById from 'rax-get-element-by-id';

// mock weex env
jest.mock('rax-get-element-by-id', () => ({
  __esModule: true,
  default: (id) => {
    const { shared } = require('rax');
    const { Host } = shared;
    return Host.driver && Host.driver.getElementById(id);
  }
}));

const { Host } = shared;
Host.driver = ServerDriver;

describe('findDOMNode', () => {
  it('getElementById with id', () => {
    let mockFn = jest.fn();
    Host.driver = {
      getElementById: mockFn,
    };
    getElementById('id');
    expect(mockFn).toBeCalledWith('id');
  });

  it('findDOMNode with id', () => {
    let mockFn = jest.fn();
    Host.driver = {
      getElementById: mockFn,
    };
    findDOMNode('id');
    expect(mockFn).toBeCalledWith('id');
  });
});