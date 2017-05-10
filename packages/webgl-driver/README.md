# webgl-driver

> WebGL driver for Rax.

components and apis are based on `three.js` design and implementation. Use markup language and declarative writing to simplify development.
## Install

```bash
$ npm install --save webgl-driver
```

## Use

```jsx
import {createElement, Component, render} from 'rax';
import webGLDriver from 'webgl-driver';

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

  onAfterAnimate = () => {
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
        onAfterAnimate={this.onAfterAnimate}
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

render(<HelloWorld />, null, {
  driver: webGLDriver
});
```

## Support components

### Scenes
* Scene

### Cameras
* PerspectiveCamera

### Controls
* OrbitControls
* TrackballControls

### Core
* BufferGeometry
* Geometry
* Object3D
* Raycaster

### Geometries
* BoxGeometry
* CylinderGeometry
* SphereGeometry

### Lights
* AmbientLight
* DirectionalLight

### Materials
* LineBasicMaterial
* LineDashedMaterial
* MeshBasicMaterial
* MeshLambertMaterial
* MeshPhongMaterial
* PointsMaterial

### Objects
* Line
* Mesh
* Points
