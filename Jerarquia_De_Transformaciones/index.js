// Three js documentation
// https://threejs.org/docs/index.html#manual/introduction/Creating-a-scene
let renderer;
let camera;
let scene;
let canvas;

let duration = 10000; // ms
let currentTime = Date.now();

// Global Array that contains every figure
let globalFigureArray = [];


// DOM Buttons declaration
let addParentBtn;
let addChildBtn;
let resetBtn;

// Variable that will save the last added Parent Element
let currentParent = null;


function main(){
  canvas = document.getElementById("canvas");
  scene_setup();
  addParentBtn = document.getElementById("addParentBtn");
  addChildBtn = document.getElementById("addChildBtn");
  resetBtn = document.getElementById("resetBtn");
  addParentBtn.onclick = function(){
    let newParentGeom = generateRandomGeometry();
    let newParentMaterial = new THREE.MeshNormalMaterial;
    let newParentFigure = new THREE.Mesh(newParentGeom, newParentMaterial);

    // We make the Parent Figure smaller
    newParentFigure.scale.x = 0.25;
    newParentFigure.scale.y = 0.25;
    newParentFigure.scale.z = 0.25;

    // We generate a random coordinate for our Parent Figure
    let coords = generateCoords(20, 12);
    newParentFigure.position.z = -35;
    newParentFigure.position.x = coords[0];
    newParentFigure.position.y = coords[1];
    scene.add(newParentFigure);
    globalFigureArray.push(newParentFigure);
    console.log(globalFigureArray);

    // We assign the role of active parent to the last parent figure added to the scene
    currentParent = newParentFigure;
    
  }
  
  // Function that adds a satellite to a parent element
  addChildBtn.onclick = function(){

    // Check if Parent exists
    if(currentParent === null){
      alert("You Need a Parent Element First");
    }

    else{
      let newChildElement = generateRandomGeometry();
      let newChildMaterial = new THREE.MeshNormalMaterial;
      let newChildFigure = new THREE.Mesh(newChildElement, newChildMaterial);
      newChildFigure.scale.x = 0.3;
      newChildFigure.scale.y = 0.3;
      newChildFigure.scale.z = 0.3;
      newChildFigure.position.z = genRandomZ(5);

      // Generate random coordinates for the child
      let childCoords = generateCoords(25, 25);
      newChildFigure.position.x = childCoords[0];
      newChildFigure.position.y = childCoords[1];

      // We assign the child to the active Parent Figure
      currentParent.add(newChildFigure);

      // We add the child to the global array, so it can have an independent rotation
      globalFigureArray.push(newChildFigure);
    }
  }

  // Function that clears the page if the reset button is pressed
  resetBtn.onclick = function(){
    window.location.reload();
  }

  renderer.render(scene, camera);
  run();
}

// Function that sets up essential elements for our scene
function scene_setup()
{
    console.log(THREE.REVISION);
    

    // Create the Three.js renderer and attach it to our canvas. Different renderes can be used, for example to a 2D canvas.
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size.
    renderer.setSize(canvas.width, canvas.height);

    // Create a new Three.js scene.
    scene = new THREE.Scene();

    // Adds a color to the background
    scene.background = new THREE.Color("rgb(50,50,50)");

    // Add  a camera so we can view the scene. Three js uses these values to create a projection matrix.
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 40 );

    scene.add(camera);
}

function run(){
  requestAnimationFrame(() => run());
  // Render the scene
  renderer.render(scene, camera);

  // Apply the animation to every fugure in our global array
  globalFigureArray.forEach(function(figure){
    animate(figure);
  });
}

// Function that generates one Random Geometry, out of 5 possible
function generateRandomGeometry(){
  let randNum = Math.random();
  let geom;
  if(randNum >= 0 && randNum < 0.2){
    geom = new THREE.BoxGeometry(10, 10, 10);
  }

  else if(randNum >= 0.2 && randNum < 0.4){
    geom = new THREE.CircleGeometry(5, 32);
  }

  else if(randNum >= 0.4 && randNum < 0.6){
    geom = new THREE.CylinderGeometry(5, 5, 10, 16);
  }

  else if(randNum >= 0.6 && randNum < 0.8){
    geom = new THREE.PlaneGeometry(5, 20, 32);
  }

  else{
    geom = new THREE.TorusGeometry(10, 3, 8, 25);
  }

  return geom;
}

// Function to apply the rotation animation
function animate(figure) {		

  figure.rotation.y += 0.01;
  figure.rotation.x += -0.01;

}


// Function that generates a set of random 2D coordinates given max x and y values
function generateCoords(maxX, maxY){
  let randX = Math.random() * maxX;
  let randY = Math.random() * maxY;

  let signX = Math.random();
  let signY = Math.random();

  if(signX > 0.5){
    randX *= -1;
  }

  if(signY > 0.5){
    randY *= -1;
  }
  return [randX, randY];
}

// Function that generates a random z point given a max value
function genRandomZ(maxZ){
  let randZ = Math.random()*maxZ;
  let sign = Math.random();
  if(sign > 0.5){
    randZ *= -1;
  }

  return randZ;
}