import {createElement, Component, render} from 'rax';
import Button from '../common/Button';
import Panel from '../common/Panel';

class Example extends Component {

  state = {
    getJsonpResult: 'loading...',
    getResult: 'loading...',
    postResult: 'loading...',
    putResult: 'loading...',
    deleteResult: 'loading...',
    headResult: 'loading...',
    patchResult: 'loading...',
  };

  componentDidMount() {
    var stream = __weex_require__('@weex-module/stream');
    var GET_URL_JSONP = 'http://jsfiddle.net/echo/jsonp/?callback=anything&result=content_in_response';
    var GET_URL = 'http://httpbin.org/get';
    var POST_URL = 'http://httpbin.org/post';
    var PUT_URL = 'http://httpbin.org/put';
    var DELETE_URL = 'http://httpbin.org/delete';
    var HEAD_URL = 'http://httpbin.org/status/418';
    var PATCH_URL = 'http://httpbin.org/patch';

    stream.fetch({
      method: 'GET',
      url: GET_URL_JSONP,
      type: 'jsonp'
    }, (ret) => {
      if (!ret.ok) {
        this.setState({
          getJsonpResult: 'request failed'
        });
      } else {
        console.log('get:' + ret);
        this.setState({
          getJsonpResult: JSON.stringify(ret.data)
        });
      }
    }, (response) => {
      console.log('get jsonp in progress:' + response.length);
      this.setState({
        getJsonpResult: 'bytes received:' + response.length
      });
    });

    stream.fetch({
      method: 'GET',
      url: GET_URL,
      type: 'json'
    }, (ret) => {
      if (!ret.ok) {
        this.setState({
          getResult: 'request failed'
        });
      } else {
        console.log('get:' + ret);
        this.setState({
          getResult: JSON.stringify(ret.data)
        });
      }
    }, (response) => {
      console.log('get in progress:' + response.length);
      this.setState({
        getResult: 'bytes received:' + response.length
      });
    });
    stream.fetch({
      method: 'POST',
      url: POST_URL,
      type: 'json'
    }, (ret) => {
      if (!ret.ok) {
        this.setState({
          postResult: 'request failed'
        });
      } else {
        console.log('get:' + JSON.stringify(ret));
        this.setState({
          postResult: JSON.stringify(ret.data)
        });
      }
    }, (response) => {
      console.log('get in progress:' + response.length);
      this.setState({
        postResult: 'bytes received:' + response.length
      });
    });

    stream.fetch({
      method: 'PUT',
      url: PUT_URL,
      type: 'json'
    }, (ret) => {
      if (!ret.ok) {
        this.setState({
          putResult: 'request failed'
        });
      } else {
        console.log('get:' + JSON.stringify(ret));
        this.setState({
          putResult: JSON.stringify(ret.data)
        });
      }
    }, (response) => {
      console.log('get in progress:' + response.length);
      this.setState({
        putResult: 'bytes received:' + response.length
      });
    });
    stream.fetch({
      method: 'DELETE',
      url: DELETE_URL,
      type: 'json'
    }, (ret) => {
      if (!ret.ok) {
        this.setState({
          deleteResult: 'request failed'
        });
      } else {
        console.log('get:' + JSON.stringify(ret));
        this.setState({
          deleteResult: JSON.stringify(ret.data)
        });
      }
    }, (response) => {
      console.log('get in progress:' + response.length);
      this.setState({
        deleteResult: 'bytes received:' + response.length
      });
    });

    stream.fetch({
      method: 'HEAD',
      url: HEAD_URL,
      type: 'json'
    }, (ret) => {
      if (ret.statusText !== 'I\'m a teapot') {
        this.setState({
          headResult: 'request failed'
        });
      } else {
        console.log('get:' + JSON.stringify(ret));
        this.setState({
          headResult: ret.statusText
        });
      }
    }, (response) => {
      console.log('get in progress:' + response.length);
      this.setState({
        headResult: 'bytes received:' + response.length
      });
    });
    stream.fetch({
      method: 'PATCH',
      url: PATCH_URL,
      type: 'json'
    }, (ret) => {
      if (!ret.ok) {
        this.setState({
          patchResult: 'request failed'
        });
      } else {
        console.log('get:' + JSON.stringify(ret));
        this.setState({
          patchResult: JSON.stringify(ret.data)
        });
      }
    }, (response) => {
      console.log('get in progress:' + response.length);
      this.setState({
        patchResult: 'bytes received:' + response.length
      });
    });
  }

  render() {
    return (
      <scroller>
        <Panel title="stream.fetch" type="primary">
          <Panel title="method = GET">
            <text>{this.state.getResult}</text>
          </Panel>
          <Panel title="method = GET / type = jsonp">
            <text>{this.state.getJsonpResult}</text>
          </Panel>
          <Panel title="method = POST">
            <text>{this.state.postResult}</text>
          </Panel>
          <Panel title="method = PUT">
            <text>{this.state.putResult}</text>
          </Panel>
          <Panel title="method = DELETE">
            <text>{this.state.deleteResult}</text>
          </Panel>
          <Panel title="method = HEAD">
            <text>{this.state.headResult}</text>
          </Panel>
          <Panel title="method = PATCH">
            <text>{this.state.patchResult}</text>
          </Panel>
        </Panel>
      </scroller>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  }
};

render(<Example />);
