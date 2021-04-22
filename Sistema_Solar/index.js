let renderer = null,
scene = null, 
camera = null,
astArr = [],
planets=[],
beltVertices=[];

let duration = 5000; // ms
let currentTime = Date.now();

function main() {
                    
    const canvas = document.getElementById("canvas");

    // Scene Setup
    createScene(canvas);
    // Run
    run();
}

// Independent Rotation for the Planets
function animate() 
{
    let now = Date.now();
    let deltat = now - currentTime;
    currentTime = now;
    let fract = deltat / duration;
    let angle = Math.PI * 2 * fract;
    planets.forEach(function(planet){
        planet.rotation.y += angle;
    });

}

function run() {
    requestAnimationFrame(function() { run(); });
    renderer.render( scene, camera );
    animate();
}


function createScene(canvas)
{    
    for (let i = 0; i <= 100; i ++ ) {
        v = ( i / 100) * ( Math.PI * 2 );
        x = Math.sin(v);
        z = Math.cos(v);
        beltVertices.push(x, 0, z);
    }
    
    renderer = new THREE.WebGLRenderer( {canvas:canvas, antialias:true} );
    renderer.setSize (canvas.width, canvas.height);
    document.body.appendChild (renderer.domElement);

    camera = new THREE.PerspectiveCamera (45, canvas.width/canvas.height, 1, 10000);
    camera.position.y = 80;
    camera.position.z = 200;
    camera.lookAt (new THREE.Vector3(0,0,0));

    // Orbit Controls Implementation
    let controls = new THREE.OrbitControls (camera, renderer.domElement);

    // Ambient Light Implemengtation
    let lightAmbient = new THREE.AmbientLight( 0xffffff, .2);
    lightAmbient.position.set(100, 100, 0);

    scene = new THREE.Scene();
    scene.add(lightAmbient);

    // We generate our planets with their respective materials and orbits
    let sunMat = genMaterial("2k_sun.png");
    let sun = genPlanet(sunMat, scene, [0, 0, 0], 2.2);

    let earthMat = genMaterial("2k_earth.jpg");
    let earth = genPlanet(earthMat, sun, [50, 0, 0], 1);
    orbit([50, 0, 0], sun);

    // We generate a moon for planet earth
    let earthMoonMat = genMaterial("2k_moon.png");
    let earthMoon = genPlanet(earthMoonMat, earth, [15, 0, 0], 0.3);

    let marsMat = genMaterial("2k_mars.jpg");
    let mars = genPlanet(marsMat, sun, [80, 0, 0], 0.75);
    orbit([80, 0, 0], sun);

    // Moons for Mars
    let marsMoon1 = genPlanet(earthMoonMat, mars, [15, 0, 0], 0.15);
    let marsMoon2 = genPlanet(earthMoonMat, mars, [10, 10, 0], 0.15);

    let venusMat = genMaterial("2k_venus.jpg");
    let venus = genPlanet(venusMat, sun, [370, 0, 0], 1.3);
    orbit([370, 0, 0], sun);
    
    // Asteroid Belt
    let astMat = genMaterial("4k_asteroid.jpg");
    astBelt(astMat, sun, 230);

    let plutoMat = genMaterial("2k_pluto.jpg");
    let pluto = genPlanet(plutoMat, sun, [150, 0, 0], 0.5);
    orbit([150, 0, 0], sun);

    let saturnMat = genMaterial("2k_saturn.jpg");
    let saturn = genPlanet(saturnMat, sun, [200, 0, 0], 1.2);
    orbit([15, 0, 0], saturn); // Saturn Ring
    orbit([200, 0, 0], sun);

    // Moons for Saturn
    let satMoon1 = genPlanet(earthMoonMat, saturn, [15, 10, 0], 0.35);
    let satMoon2 = genPlanet(earthMoonMat, saturn, [-15, 10, 0], 0.35);

    let neptuneMat = genMaterial("2k_neptune.jpg");
    let neptune = genPlanet(neptuneMat, sun, [250, 0, 0], 1.45);
    orbit([250, 0, 0], sun);

    // Moon for Neptune
    let nepMoon1 = genPlanet(earthMoonMat, neptune, [15, 10, 0], 0.2);

    let mercuryMat = genMaterial("2k_mercury.jpg");
    let mercury = genPlanet(mercuryMat, sun, [300, 0, 0], 2.2);
    orbit([300, 0, 0], sun);

    let uranusMat = genMaterial("2k_uranus.jpg");
    let uranus = genPlanet(uranusMat, sun, [430, 0, 0], 3);
    orbit([430, 0, 0], sun);

    // Uranus Moon
    let uranusMoon1 = genPlanet(earthMoonMat, uranus, [40, 10, 0], 1);

}


// Function that generates a Sphere Geometry with the characteristics of a planet
function genPlanet(material, parent, position, scale){
    let planetGeom = new THREE.SphereGeometry(10*scale, 20, 20);
    let planet = new THREE.Mesh(planetGeom, material);
    planet.position.set(position[0],position[1],position[2])
    planets.push(planet);
    parent.add(planet);
    return planet;
}

// Function that generates an asteroid based on a cube geometry
function genAsteroid(material, parent, position){
    let astGeom = new THREE.CubeGeometry(5, 5, 5);
    let ast = new THREE.Mesh(astGeom, material);
    ast.position.set(position[0],position[1],position[2]);
    astArr.push(ast);
    parent.add(ast);
    return ast;
}

// Function that generates a chain of asteroids that will serve as the Asteroid Belt
function astBelt(material, parent, r){
    for (let i = 0; i <= 100; i ++ ) {
        v = ( i / 100) * ( Math.PI * 2 );
        x = Math.sin( v );
        z = Math.cos(v);
        genAsteroid(material, parent, [x*r, 0, z*r]);
    }
}

// Function that generates a material given a texture
function genMaterial(texture, bump){

    let textureMap = new THREE.TextureLoader().load(texture);
    let bumpMap = new THREE.TextureLoader().load(bump);
    return new THREE.MeshPhongMaterial({map: textureMap, bumpMap: bumpMap, bumpScale: .05});

}

// Generates and Draws an Orbit for a Planet
function orbit(planetPosition, parent){

    // given x**2  y**2 + z**2 = r**2
    let r = Math.sqrt(Math.pow(planetPosition[0], 2) + Math.pow(planetPosition[1], 2) + Math.pow(planetPosition[2], 2));
    
    let geomBuffer = new THREE.BufferGeometry();
    geomBuffer.setAttribute( 'position', new THREE.Float32BufferAttribute(beltVertices.map(function(x) { return x * r; }),3));

    // We define the material for the line
    let orbitMat=new THREE.LineBasicMaterial( {
        color: 0xffffff,
        linewidth: 2
    } );


    let line = new THREE.Line(geomBuffer, orbitMat);

    // We draw the line on screen
    parent.add(line);
    return line;
}

