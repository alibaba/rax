import PerspectiveCamera from './cameras/PerspectiveCamera';

import OrbitControls from './controls/OrbitControls';
import TrackballControls from './controls/TrackballControls';

import BufferGeometry from './core/BufferGeometry';
import Geometry from './core/Geometry';
import Object3D from './core/Object3D';
import Raycaster from './core/Raycaster';

import BoxGeometry from './geometries/BoxGeometry';
import CylinderGeometry from './geometries/CylinderGeometry';
import SphereGeometry from './geometries/SphereGeometry';

import AmbientLight from './lights/AmbientLight';
import DirectionalLight from './lights/DirectionalLight';

import LineBasicMaterial from './materials/LineBasicMaterial';
import LineDashedMaterial from './materials/LineDashedMaterial';
import MeshBasicMaterial from './materials/MeshBasicMaterial';
import MeshLambertMaterial from './materials/MeshLambertMaterial';
import MeshPhongMaterial from './materials/MeshPhongMaterial';
import PointsMaterial from './materials/PointsMaterial';

import Line from './objects/Line';
import Mesh from './objects/Mesh';
import Points from './objects/Points';

import Scene from './scenes/Scene';

export default {
  'perspective-camera': PerspectiveCamera,
  'orbit-controls': OrbitControls,
  'trackball-controls': TrackballControls,
  'buffer-geometry': BufferGeometry,
  'geometry': Geometry,
  'object-3d': Object3D,
  'raycaster': Raycaster,
  'box-geometry': BoxGeometry,
  'cylinder-geometry': CylinderGeometry,
  'sphere-geometry': SphereGeometry,
  'ambient-light': AmbientLight,
  'directional-light': DirectionalLight,
  'line-basic-material': LineBasicMaterial,
  'line-dashed-material': LineDashedMaterial,
  'mesh-basic-material': MeshBasicMaterial,
  'mesh-lambert-material': MeshLambertMaterial,
  'mesh-phong-material': MeshPhongMaterial,
  'points-material': PointsMaterial,
  'line': Line,
  'mesh': Mesh,
  'points': Points,
  'scene': Scene
};
