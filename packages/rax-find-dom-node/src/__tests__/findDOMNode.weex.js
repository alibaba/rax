/* @jsx createElement */

import {shared} from 'rax';
import ServerDriver from 'driver-server';
import getElementById from 'rax-get-element-by-id';
import {isWeex, isWeb} from 'universal-env';
import findDOMNode from '../../lib/';

const { Host } = shared;

jest.mock('universal-env', () => {
  return {
    isMiniApp: false,
    isNode: false,
    isWeChatMiniprogram: false,
    isWeb: false,
    isWeex: true
  };
});

describe('findDOMNode', () => {

  beforeEach(function() {
    Host.driver = ServerDriver;
  });

  afterEach(function() {
    Host.driver = null;
  });

  it('findDOMNode with id', () => {
    let mockFn = jest.fn();
    Host.driver = {
      getElementById: mockFn
    };
    
    findDOMNode('id');
    expect(mockFn).toBeCalledWith('id');
  });

});
