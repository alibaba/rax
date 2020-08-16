# driver-webgl

> WebGL driver for Rax.

Components and APIs are based on `three.js` design and implementation. Use markup language and declarative writing to simplify development.

## Install
s
```bash
$ npm install --save driver-webgl
```

## Usage

```jsx
import {createElement, Component, render} from 'rax';
import WebGLDriver from 'driver-webgl';

class HelloWorld extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      cubeRotation: [0, 0, 0]
    };
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.cameraPosition = [0, 0, 5];
  }

  onFrame = () => {
    this.setState({
      cubeRotation: [
        this.state.cubeRotation[0] + 0.01,
        this.state.cubeRotation[1] + 0.01,
        0
      ]
    });
  }

  render() {
    return (
      <scene
        width={this.width}
        height={this.height}
        onFrame={this.onFrame}
      >
        <perspective-camera
          fov={75}
          aspect={this.width / this.height}
          near={0.1}
          far={1000}
          position={this.cameraPosition}
        />
        <mesh
          rotation={this.state.cubeRotation}
        >
          <box-geometry
            width={1}
            height={1}
            depth={1}
          />
          <mesh-basic-material
            color={0x00ff00}
          />
        </mesh>
      </scene>
    );
  }
}

render(<HelloWorld />, document.body, {
  driver: WebGLDriver
});
```

## Built-in Tags

### Scenes
* scene

### Cameras
* perspective-camera

### Controls
* orbit-controls
* trackball-controls

### Core
* geometry
* buffer-geometry
* object-3d
* raycaster

### Geometries
* box-geometry
* cylinder-geometry
* sphere-geometry

### Lights
* ambient-light
* directional-light

### Materials
* line-basic-material
* line-dashed-material
* mesh-basic-material
* mesh-lambert-material
* mesh-phong-material
* points-material

### Objects
* line
* mesh
* points
