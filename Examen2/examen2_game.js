import * as THREE from './libs/three.module.js'

let renderer = null, scene = null, camera = null, root = null;

let raycaster = null, mouse = new THREE.Vector2(), intersected, clicked;

let directionalLight = null, spotLight = null, ambientLight = null;

let cubes = [];
let score = 0;

let z = -80;

const mapUrl = "images/checker_large.gif";
let currentTime = Date.now();

function animate()
{
    const now = Date.now();
    const deltat = now - currentTime;
    currentTime = now;
    cubes.forEach(function(c){
        c.position.z += 0.5;
        if(c.position.z > 70){
            scene.remove(c);
        }
    });
}

function update() 
{
    requestAnimationFrame(function() { update(); });
    renderer.render( scene, camera );
    animate();
}

function createScene(canvas) 
{
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    renderer.setSize(canvas.width, canvas.height);
    
    scene = new THREE.Scene();

    raycaster = new THREE.Raycaster();

    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.set(0, 15, 125);
    scene.add(camera);
    
    root = new THREE.Object3D;
    
    directionalLight = new THREE.DirectionalLight( 0xaaaaaa, 1);
    directionalLight.position.set(0, 5, 100);

    root.add(directionalLight);
    
    spotLight = new THREE.SpotLight (0xffffff);
    spotLight.position.set(0, 8, 100);
    root.add(spotLight);

    ambientLight = new THREE.AmbientLight ( 0xffffff, 0.3);
    root.add(ambientLight);

    let map = new THREE.TextureLoader().load(mapUrl);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(10, 10);

    scene.add(map);

    let geometry = new THREE.PlaneGeometry(1000, 1000, 50, 50);
    let mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({map:map, side:THREE.DoubleSide}));

    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -4;
    root.add( mesh );
    
    raycaster = new THREE.Raycaster();

    document.addEventListener('pointermove', onDocumentPointerMove);
    document.addEventListener('pointerdown', onDocumentPointerDown);

    scene.add( root );
    
    window.setInterval(addCube, 500);
}

function onDocumentPointerMove( event ) 
{
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );

    const intersects = raycaster.intersectObjects( scene.children );

    if ( intersects.length > 0 ) 
    {
        
        if ( intersected != intersects[ 0 ].object ) 
        {
            if ( intersected )
                intersected.material.emissive.setHex( intersected.currentHex );

            intersected = intersects[ 0 ].object;
            console.log(intersected);
            intersected.currentHex = intersected.material.emissive.getHex();
            intersected.material.emissive.setHex( 0xff0000 );
        }
    } 
    else 
    {
        if ( intersected ) 
            intersected.material.emissive.setHex( intersected.currentHex );

        intersected = null;
    }
}

function onDocumentPointerDown(event)
{
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );

    let intersects = raycaster.intersectObjects( scene.children );
    

    if ( intersects.length > 0 ) 
    {
        clicked = intersects[ 0 ].object;
        updateScore();
        scene.remove(clicked);
        
    } 
}

function main()
{
    const canvas = document.getElementById("webglcanvas");

    createScene(canvas);

    update();
}

function genX(){
    let sign = Math.random();
    let x = Math.random() * 40;
    if(sign < 0.5){
        x *= -1;
    }

    return x;
}

function genY(){
    let y = Math.random() *40;
    return y;
}

function genRandomColor(){
    return Math.random() * 0xffffff; 
}

function addCube(){
    let cubeGeom = new THREE.BoxGeometry(5, 5, 5);
    let cubeColor = genRandomColor();
    let material = new THREE.MeshPhongMaterial({color: cubeColor});
    let cube = new THREE.Mesh(cubeGeom, material);
    cube.position.x = genX();
    cube.position.y = genY();
    cube.position.z = z;
    scene.add(cube);
    cubes.push(cube);
}

function resize()
{
    const canvas = document.getElementById("webglcanvas");

    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;

    camera.aspect = canvas.width / canvas.height;

    camera.updateProjectionMatrix();
    renderer.setSize(canvas.width, canvas.height);
}

window.onload = () => {
    main();
    resize(); 
};

window.addEventListener('resize', resize, false);


function updateScore(){
    score+=1;
    let scoreText = document.getElementById("scoreText");
    scoreText.textContent = "Score: " + score;
}