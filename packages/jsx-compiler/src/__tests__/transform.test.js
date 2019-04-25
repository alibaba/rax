const transform = require('../index');

describe('transform JSX', () => {
  it('should throw error with JSX inline method ref.', () => {
    expect(() => {
      transform(`
        import { Component } from 'rax';
        export default class extends Component {
          render() {
            return (
              <view>
                {foo.map(this.renderItem)
              </view>
            );
          }
        }
      `);
    }).toThrowError();
  });

  it('should throw error with JSX + IIFE', () => {
    expect(() => {
      transform(`
        import { Component } from 'rax';
        export default class extends Component {
          render() {
            return (
              <view>
                {(function(fn) {fn()})(this.renderItem)
              </view>
            );
          }
        }
      `);
    }).toThrowError();
  });
});
