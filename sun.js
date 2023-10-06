import * as THREE from 'three';
import {PointerLockControls} from 'PointerLockControls';
import {RGBELoader} from 'RGBELoader';

import * as CANNON from 'cannon-es';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

camera.position.set(0, 3, 20)

const world = new CANNON.World()
world.gravity.set(0, -10, 0)

const chaoB = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Plane()
})

chaoB 




function animate() {
    requestAnimationFrame( animate );

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render( scene, camera );
};

animate();
