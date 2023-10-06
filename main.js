import * as THREE from 'three';
import {PointerLockControls} from 'PointerLockControls';
import {RGBELoader} from 'RGBELoader';
import * as CANNON from 'cannon-es';

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
scene.add(camera)

const loader = new RGBELoader()
loader.load('./bk_studio.hdr', function(texture){
    texture.mapping = THREE.EquirectangularReflectionMapping
    scene.background = texture
    scene.environment = texture
})

const orbit = new PointerLockControls(camera, renderer.domElement);

camera.position.set(0, 4, 30);



window.addEventListener('click', ()=>{
    orbit.lock()
})

const boxGeo = new THREE.BoxGeometry(2, 2, 2);
const boxMat = new THREE.MeshLambertMaterial({
	color: 0x00ff00,
	//wireframe: true
});
const boxMesh = new THREE.Mesh(boxGeo, boxMat);
scene.add(boxMesh);


const boxGeo2 = new THREE.BoxGeometry(2, 2, 2);
const boxMat2 = new THREE.MeshLambertMaterial({
	color: 0xffff00,
	//wireframe: true
});
const boxMesh2 = new THREE.Mesh(boxGeo2, boxMat2);
scene.add(boxMesh2);

const sphereGeo = new THREE.SphereGeometry(2);
const sphereMat = new THREE.MeshPhysicalMaterial({ 
	reflectivity: 1,
    roughness:0,
    color: 0x00ff00,
    metalness:0,
    transmission: 0.5
	//wireframe: true,
 });
const sphereMesh = new THREE.Mesh( sphereGeo, sphereMat);
scene.add(sphereMesh);
sphereMesh.castShadow = true



const sphereGeo2 = new THREE.SphereGeometry(3);
const sphereMat2 = new THREE.MeshPhysicalMaterial({ 
	reflectivity: 1,
    roughness:0.1,
    color: 0xFFFFFF,
    metalness:0.6,
    transmission: 0.5
	//wireframe: true,
 });
const sphereMesh2 = new THREE.Mesh( sphereGeo2, sphereMat2);
scene.add(sphereMesh2);
sphereMesh2.castShadow = true


const groundGeo = new THREE.PlaneGeometry(400, 400);
const groundMat = new THREE.MeshPhysicalMaterial({ 
	color: 0x00FF00,
	side: THREE.DoubleSide,
	//wireframe: true 
 });
const groundMesh = new THREE.Mesh(groundGeo, groundMat);
scene.add(groundMesh);
groundMesh.castShadow = true
groundMesh.receiveShadow = true;

const light = new THREE.PointLight(0xffffff, 1, 100)
light.position.set(0, 15, 0)
scene.add(light)

const ambLight = new THREE.AmbientLight(0x454545, 1, 10)
scene.add(ambLight)



const characterg = new THREE.BoxGeometry(2, 6, 2);
const characterm = new THREE.MeshLambertMaterial({
	color: 0xffff00,
    position: new THREE.Vector3(0, 2, 0)
	//wireframe: true
});
const character = new THREE.Mesh(characterg, characterm);
scene.add(character);
 





const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -10, 0)
});

const groundPhysMat = new CANNON.Material();

const groundBody = new CANNON.Body({
    //shape: new CANNON.Plane(),
    //mass: 10
    shape: new CANNON.Box(new CANNON.Vec3(200, 200, 0.1)),
    type: CANNON.Body.STATIC,
    material: groundPhysMat
});
world.addBody(groundBody);
groundBody.quaternion.setFromEuler(-Math.PI /2, 0,0);

const boxPhysMat = new CANNON.Material();

const boxBody = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
    position: new CANNON.Vec3(1, 0, 0),
    material: boxPhysMat
});
world.addBody(boxBody);

const boxBody2 = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
    position: new CANNON.Vec3(1, 6, 0),
    material: boxPhysMat
});
world.addBody(boxBody2);



const characterBody = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Box(new CANNON.Vec3(3, 6, 3)),
    
    material: boxPhysMat
});
world.addBody(characterBody);



boxBody.angularVelocity.set(0, 10, 0);
boxBody.angularDamping = 0.5;

const groundBoxContactMat = new CANNON.ContactMaterial(
    groundPhysMat,
    boxPhysMat,
    {friction: 0.04}
);

world.addContactMaterial(groundBoxContactMat);

const spherePhysMat = new CANNON.Material();

const sphereBody = new CANNON.Body({
    mass: 4,
    shape: new CANNON.Sphere(2),
    position: new CANNON.Vec3(0, 10, 0),
    material: spherePhysMat
});
world.addBody(sphereBody);

sphereBody.linearDamping = 0.21

const groundSphereContactMat = new CANNON.ContactMaterial(
    groundPhysMat,
    spherePhysMat,
    {restitution: 0.2}
);








const sphereBody2 = new CANNON.Body({
    mass: 14,
    shape: new CANNON.Sphere(3),
    position: new CANNON.Vec3(-12, 10, 0),
    material: spherePhysMat
});
world.addBody(sphereBody2);

sphereBody2.linearDamping = 0.21


//jump variables
let isJumping = false
let jumpStartTime = 0
let jumpStartHeight = 0
let maxH = 6
let duration = 0.5


let keyboard = []
const clock = new THREE.Clock()

addEventListener('keydown', function(e){
    keyboard[e.keyCode] = true
})

addEventListener('keyup', function(e){
    keyboard[e.keyCode] = false
})

function eventkey(){
if(keyboard[87])orbit.moveForward(0.5)
if(keyboard[83])orbit.moveForward(-0.5)

if(keyboard[65])orbit.moveRight(-0.5)
if(keyboard[68])orbit.moveRight(0.5)
if(keyboard[16] && keyboard[87])orbit.moveForward(1)

if (keyboard[32] && !isJumping) {
    isJumping = true
    jumpStartTime = clock.getElapsedTime()
    jumpStartHeight = camera.position.y
  }

  if (isJumping) {
    const elapsed = clock.getElapsedTime() - jumpStartTime
    if (elapsed >= duration) {
      isJumping = false
      camera.position.y = jumpStartHeight
    } else {

      const jumpProgress = elapsed / duration
      const jumpHeightOffset = Math.sin(jumpProgress * Math.PI) * maxH
      camera.position.y = jumpStartHeight + jumpHeightOffset
    }
  }
}

world.addContactMaterial(groundSphereContactMat);

const timeStep = 1 / 60;

function animate() {
    requestAnimationFrame(animate)
    world.step(timeStep);

    groundMesh.position.copy(groundBody.position);
    groundMesh.quaternion.copy(groundBody.quaternion);

    boxMesh.position.copy(boxBody.position);
    boxMesh.quaternion.copy(boxBody.quaternion);

    character.position.copy(characterBody.position);
    character.quaternion.copy(characterBody.quaternion);
    //ESSE É O ALGORITMO!!!!
    characterBody.position.copy(camera.position);
    characterBody.quaternion.copy(camera.quaternion);
    //

    boxMesh2.position.copy(boxBody2.position);
    boxMesh2.quaternion.copy(boxBody2.quaternion);

    sphereMesh.position.copy(sphereBody.position);
    sphereMesh.quaternion.copy(sphereBody.quaternion);

    sphereMesh2.position.copy(sphereBody2.position);
    sphereMesh2.quaternion.copy(sphereBody2.quaternion);

    eventkey(clock.getDelta)

    renderer.render(scene, camera);
}
animate()


window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
