let mat4 = glMatrix.mat4;
let projectionMatrix;
let shaderProgram
let shaderVertexPositionAttribute;
let shaderVertexColorAttribute;
let shaderProjectionMatrixUnifor
let shaderModelViewMatrixUniform;

let duration = 10000;

let vertexShaderSource =
    "    attribute vec3 vertexPos;\n" +
    "    attribute vec4 vertexColor;\n" +

    "    uniform mat4 modelViewMatrix;\n" +
    "    uniform mat4 projectionMatrix;\n" +

    "    varying vec4 vColor;\n" +

    "    void main(void) {\n" +
    "		// Return the transformed and projected vertex value\n" +
    "        gl_Position = projectionMatrix * modelViewMatrix * \n" +
    "            vec4(vertexPos, 1.0);\n" +
    "        // Output the vertexColor in vColor\n" +
    "        vColor = vertexColor * 1.0;\n" +
    "    }\n";

let fragmentShaderSource =
    "    precision lowp float;\n" +
    "    varying vec4 vColor;\n" +
    "    void main(void) {\n" +
    "    gl_FragColor = vColor;\n" +
    "}\n";

function main()
{
    let canvas = document.getElementById("webglcanvas");
    let gl = initWebGL(canvas);
    initViewport(gl, canvas);
    initGL(canvas);

    let octahedron = createOctahedron(gl, [4.0 , 0, -2], [0, 1, 0]);
    let dodecahedron = createDodecahedron(gl, [0.5, 0, -2], [0, 1, 0]);
    let scutoid = createScutoid(gl, [-3.0, 0, -2], [0.0, 1.0, 0.0 ]);

    initShader(gl);

    run(gl, [octahedron, dodecahedron, scutoid]);
}

function initWebGL(canvas)
{
    let gl = null;
    let msg = "Your browser does not support WebGL, " +
        "or it is not enabled by default.";
    try
    {
        gl = canvas.getContext("experimental-webgl");
    }
    catch (e)
    {
        msg = "Error creating WebGL Context!: " + e.toString();
    }

    if (!gl)
    {
        alert(msg);
        throw new Error(msg);
    }

    return gl;
 }

function initViewport(gl, canvas)
{
    gl.viewport(0, 0, canvas.width, canvas.height);
}

function initGL(canvas)
{
    projectionMatrix = mat4.create();

    mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 1, 100);
    mat4.translate(projectionMatrix, projectionMatrix, [0, 0, -5]);
}


function createOctahedron(gl, translation, rotationAxis)
{
    // Vertex Data
    let vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    let vertices = [
        // Top Faces

        // Face 1
        0.0, 1.5, 0.0,
        1.0, 0.0, 1.0,
        -1.0, 0.0, 1.0,

        // Face 2
        0.0, 1.5, 0.0,
        1.0, 0.0, -1.0,
        -1.0, 0.0, -1.0,

        // Face 3
        0.0, 1.5, 0.0,
        1.0, 0.0, 1.0,
        1.0, 0.0, -1.0,

        // Face 4
        0.0, 1.5, 0.0,
        -1.0, 0.0, 1.0,
        -1.0, 0.0, -1.0,

        // Bottom Faces

        // Face 1
        0.0, -1.5, 0.0,
        1.0, 0.0, 1.0,
        -1.0, 0.0, 1.0,

        // Face 2
        0.0, -1.5, 0.0,
        1.0, 0.0, -1.0,
        -1.0, 0.0, -1.0,

        // Face 3
        0.0, -1.5, 0.0,
        1.0, 0.0, 1.0,
        1.0,  0.0, -1.0,

        // Face 4
        0.0, -1.5,  0.0,
        -1.0, 0.0,  1.0,
        -1.0,  0.0,  -1.0

       ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // Colors
    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

    let faceColors = [
        [0.7, 0.3, 0.4, 1.0],
        [0.5, 1.0, 0.22, 1.0],
        [0.81, 0.71, 0.3, 1.0],
        [0.35, 0.57, 0.53, 1.0],
        [0.6, 0.24, 0.75, 1.0],
        [0.75, 0.33, 0.11, 1.0],
        [0.74, 0.45, 0.3, 1.0],
        [0.8, 0.44, 0.93, 1.0]
    ];

    let vertexColors = [];

    faceColors.forEach(color =>{
        for (let j=0; j < 3; j++)
            vertexColors.push(...color);
    });

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

    let cubeIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);

    let cubeIndices = [
        0, 1, 2,    3, 4, 5,
        6, 7, 8,    9, 10, 11,
        12, 13, 14,  15, 16, 17,
        18, 19, 20, 21, 22, 23,

    ];

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeIndices), gl.STATIC_DRAW);

    let octa = {
            buffer: vertexBuffer, colorBuffer:colorBuffer, indices:cubeIndexBuffer,
            vertSize:3, nVerts:24, colorSize:4, nColors: 24, nIndices:24,
            primtype:gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime : Date.now()
        };

    mat4.translate(octa.modelViewMatrix, octa.modelViewMatrix, translation);

    octa.update = function()
    {

        mat4.rotateY(this.modelViewMatrix, this.modelViewMatrix, 0.045);
    };

    return octa;
}

function createDodecahedron(gl, translation, rotationAxis)
{
    // Vertex Data
    let vertexBuffer;
    vertexBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    let vertices = [

        -1, 1, 1,
        0, 0.61803, 1.61803,
        1, 1, 1,

        -1, 1, 1,
        1, 1, 1,
        0.61803, 1.61803, 0,

        -1, 1, 1,
        0.61803, 1.61803, 0,
        -0.61803, 1.61803, 0,


        1, 1, 1,
        1.61803, 0, 0.61803,
        1.61803, 0, -0.61803,

        1, 1, 1,
        1.61803, 0, -0.61803,
        1, 1, -1,

        1, 1, 1,
        1, 1, -1,
        0.61803, 1.61803, 0,


        1.61803, 0, -0.61803,
        1, -1, -1,
        0, -0.61803, -1.61803,

        1.61803, 0, -0.61803,
        0, -0.61803, -1.61803,
        0, 0.61803, -1.61803,

        1.61803, 0, -0.61803,
        0, 0.61803, -1.61803,
        1, 1, -1,


        0, -0.61803, -1.61803,
        -1, -1, -1,
        -1.61803, 0, -0.61803,

        0, -0.61803, -1.61803,
        -1.61803, 0, -0.61803,
        -1, 1, -1,

        0, -0.61803, -1.61803,
        -1, 1, -1,
        0, 0.61803, -1.61803,


        -1, -1, -1,
        -0.61803, -1.61803, 0,
        -1, -1, 1,

        -1, -1, -1,
        -1, -1, 1,
        -1.61803, 0, 0.61803,

        -1, -1, -1,
        -1.61803, 0, 0.61803,
        -1.61803, 0, -0.61803,


        -1, 1, -1,
        -1.61803, 0, -0.61803,
        -1.61803, 0, 0.61803,

        -1, 1, -1,
        -1.61803, 0, 0.61803,
        -1, 1, 1,

        -1, 1, -1,
        -1, 1, 1,
        -0.61803, 1.61803, 0,


        -1.61803, 0, 0.61803,
        -1, -1, 1,
        0, -0.61803, 1.61803,

        -1.61803, 0, 0.61803,
        0, -0.61803, 1.61803,
        0, 0.61803, 1.61803,

        -1.61803, 0, 0.61803,
        0, 0.61803, 1.61803,
        -1, 1, 1,


        1, -1, -1,
        0.61803, -1.61803, 0,
        -0.61803, -1.61803, 0,

        1, -1, -1,
        -0.61803, -1.61803, 0,
        -1, -1, -1,

        1, -1, -1,
        -1, -1, -1,
        0, -0.61803, -1.61803,


        0, 0.61803, 1.61803,
        0, -0.61803, 1.61803,
        1, -1, 1,

        0, 0.61803, 1.61803,
        1, -1, 1,
        1.61803, 0, 0.61803,

        0, 0.61803, 1.61803,
        1.61803, 0, 0.61803,
        1, 1, 1,


        1.61803, 0, 0.61803,
        1, -1, 1,
        0.61803, -1.61803, 0,

        1.61803, 0, 0.61803,
        0.61803, -1.61803, 0,
        1, -1, -1,

        1.61803, 0, 0.61803,
        1, -1, -1,
        1.61803, 0, -0.61803,


        1, 1, -1,
        0, 0.61803, -1.61803,
        -1, 1, -1,

        1, 1, -1,
        -1, 1, -1,
        -0.61803, 1.61803, 0,

        1, 1, -1,
        -0.61803, 1.61803, 0,
        0.61803, 1.61803, 0,


        -1, -1, 1,
        -0.61803, -1.61803, 0,
        0.61803, -1.61803, 0,

        -1, -1, 1,
        0.61803, -1.61803, 0,
        1, -1, 1,

        -1, -1, 1,
        1, -1, 1,
        0, -0.61803, 1.61803

       ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // Create the Buffer in which we'll store the data for the color (r, g, b, opacity)
    let colorBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

    let faceColors = [
        [0.67, 0.1, 0.88, 1.0],
        [0.67, 0.1, 0.88, 1.0],
        [0.67, 0.1, 0.88, 1.0],

        [0.55, 1.0, 0.71, 1.0],
        [0.55, 1.0, 0.71, 1.0],
        [0.55, 1.0, 0.71, 1.0],

        [0.0, 0.25, 0.44, 1.0],
        [0.0, 0.25, 0.44, 1.0],
        [0.0, 0.25, 0.44, 1.0],

        [0.7, 0.4, 0.1, 1.0],
        [0.7, 0.4, 0.1, 1.0],
        [0.7, 0.4, 0.1, 1.0],

        [1.0, 0.7, 0.85, 1.0],
        [1.0, 0.7, 0.85, 1.0],
        [1.0, 0.7, 0.85, 1.0],

        [0.0, 0.5, 0.3, 1.0],
        [0.0, 0.5, 0.3, 1.0],
        [0.0, 0.5, 0.3, 1.0],

        [0.6, 0.55, 0.2, 1.0],
        [0.6, 0.55, 0.2, 1.0],
        [0.6, 0.55, 0.2, 1.0],

        [0.66, 0.77, 0.33, 1.0],
        [0.66, 0.77, 0.33, 1.0],
        [0.66, 0.77, 0.33, 1.0],

        [0.1, 0.11, 0.54, 1.0],
        [0.1, 0.11, 0.54, 1.0],
        [0.1, 0.11, 0.54, 1.0],

        [0.25, 0.50, 0.75, 1.0],
        [0.25, 0.50, 0.75, 1.0],
        [0.25, 0.50, 0.75, 1.0],

        [0.3, 0.3, 0.4, 1.0],
        [0.3, 0.3, 0.4, 1.0],
        [0.3, 0.3, 0.4, 1.0],

        [0.22, 0.44, 0.88, 1.0],
        [0.22, 0.44, 0.88, 1.0],
        [0.22, 0.44, 0.88, 1.0]

    ];
    let vertexColors = [];
    faceColors.forEach(color =>{
        for (let j = 0; j < 3; j++)
            vertexColors.push(...color);
    });

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

    // Define Triangle Vertices
    let cubeIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);

    let cubeIndices = [
        0, 1, 2, 3, 4, 5, 6, 7, 8,
        9, 10, 11, 12, 13, 14, 15, 16, 17,
        18, 19, 20, 21, 22, 23, 24, 25, 26,
        27, 28, 29, 30, 31, 32, 33, 34, 35,
        36, 37, 38, 39, 40, 41, 42, 43, 44,
        45, 46, 47, 48, 49, 50, 51, 52, 53,
        54, 55, 56, 57, 58, 59, 60, 61, 62,
        63, 64, 65, 66, 67, 68, 69, 70, 71,
        72, 73, 74, 75, 76, 77, 78, 79, 80,
        81, 82, 83, 84, 85, 86, 87, 88, 89,
        90, 91, 92, 93, 94, 95, 96, 97, 98,
        99, 100, 101, 102, 103, 104, 105, 106, 107

    ];

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeIndices), gl.STATIC_DRAW);

    let cube = {
            buffer: vertexBuffer, colorBuffer:colorBuffer, indices:cubeIndexBuffer,
            vertSize:3, nVerts:24, colorSize:4, nColors: 20, nIndices:108,
            primtype:gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime : Date.now()
        };

    mat4.translate(cube.modelViewMatrix, cube.modelViewMatrix, translation);

    cube.update = function()
    {

        // Use the gl matrix library to apply the rotation transformation
        mat4.rotateY(this.modelViewMatrix, this.modelViewMatrix, -0.025);
    };

    return cube;
}

function createScutoid(gl, translation, rotationAxis)
{
    let vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  let vertices = [
		// Side 1
		0.35,0,-0.5,
		0.5, 1.5, 0,
		0.35, 1.5,-0.5,

		0.5,0,0,
		0.5, 1.5, 0,
		0.35,0,-0.5,


		// Side 2
		0.35,0,-0.5,
		0.35, 1.5,-0.5,
		-0.35,0,-0.5,

		0.35, 1.5,-0.5,
		-0.35, 1.5,-0.5,
		-0.35,0,-0.5,


		// Side 3
		-0.35, 1.5,-0.5,
		-0.35,0,-0.5,
		-0.5, 1.5, 0,

		-0.5, 1.5, 0,
		-0.5,0,0,
		-0.35,0,-0.5,


		// Standout Part
		-0.5, 1.5, 0,
		-0.35,1.5,0.5,
		-0.5,0,0,

		-0.35,1.5,0.5,
		0,0,0.5,
		-0.5,0,0,

		-0.35,1.5,0.5,
		0,0,0.5,
		0.0,0.75,0.75,

		0.5,0,0,
		0.35,1.5,0.5,
		0.5, 1.5, 0,

		-0.35,1.5,0.5,
		0.35,1.5,0.5,
		0.0,0.75,0.75,

		0.35,1.5,0.5,
		0.0,0.75,0.75,
		0.5,0,0,

  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  // Color data
  let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

  let faceColors = [
    [0, 0.7, 1.0, 1.0],
    [0, 0.7, 1.0, 1.0],
    [0.88, 0.55, 0.6, 1.0],
		[0.45, 0.85, 0.8, 1.0],
		[0.45, 0.85, 0.8, 1.0],
		[0.45, 0.85, 0.8, 1.0],
		[0.3, 0.5, 1.0, 1.0],
		[0.3, 0.5, 1.0, 1.0],
		[0.6, 0.3, 0.9, 1.0],
    [0.5, 0.67, 1.0, 1.0],
		[0.5, 0.67, 1.0, 1.0],
  ];

  // Same Color for each Vertex per face
  let vertexColors = [];

    // Fully add the color to each face
    faceColors.forEach(color =>{
        for (let j=0; j < 3; j++)
            vertexColors.push(...color);
    });

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

    let cubeIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);

    let cubeIndices = [
      0, 1, 2,
      3, 4, 5,
      6, 7, 8,
      9, 10, 11,
      12, 13, 14,
      15, 16, 17,
			18, 19, 20,
      21, 22, 23,
      24, 25, 26,
      27, 28, 29,
      30, 31, 32,
      33, 34, 35,
    ];

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeIndices), gl.STATIC_DRAW);

    let escut = {
            buffer: vertexBuffer, colorBuffer:colorBuffer, indices:cubeIndexBuffer,
            vertSize:3, nVerts:36, colorSize:4, nColors: 20, nIndices:36,
            primtype:gl.TRIANGLE_STRIP, modelViewMatrix: mat4.create(), currentTime : Date.now()
        };

    mat4.translate(escut.modelViewMatrix, escut.modelViewMatrix, translation);

    escut.update = function()
    {
        mat4.rotateY(this.modelViewMatrix, this.modelViewMatrix, 0.075);
    };
    return escut;
}

function createAndCompileShader(gl, str, type)
{
    let shader;
    if (type == "fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (type == "vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

function initShader(gl)
{
    let fragmentShader = createAndCompileShader(gl, fragmentShaderSource, "fragment");
    let vertexShader = createAndCompileShader(gl, vertexShaderSource, "vertex");

    // Program Creation
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    shaderVertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertexPos");
    gl.enableVertexAttribArray(shaderVertexPositionAttribute);

    shaderVertexColorAttribute = gl.getAttribLocation(shaderProgram, "vertexColor");
    gl.enableVertexAttribArray(shaderVertexColorAttribute);

    shaderProjectionMatrixUniform = gl.getUniformLocation(shaderProgram, "projectionMatrix");
    shaderModelViewMatrixUniform = gl.getUniformLocation(shaderProgram, "modelViewMatrix");

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Unable to initialize shaders!");
    }
}

function draw(gl, objs)
{
    // Set Clear Color to White
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Tell WebGL to use the program with the compiled shaders
    gl.useProgram(shaderProgram);

    for(i = 0; i< objs.length; i++)
    {
        obj = objs[i];

        gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer);
        gl.vertexAttribPointer(shaderVertexPositionAttribute, obj.vertSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, obj.colorBuffer);
        gl.vertexAttribPointer(shaderVertexColorAttribute, obj.colorSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indices);
        gl.uniformMatrix4fv(shaderProjectionMatrixUniform, false, projectionMatrix);
        gl.uniformMatrix4fv(shaderModelViewMatrixUniform, false, obj.modelViewMatrix);

        gl.drawElements(obj.primtype, obj.nIndices, gl.UNSIGNED_SHORT, 0);
    }
}

function run(gl, objs)
{
    requestAnimationFrame(function() { run(gl, objs); });

    draw(gl, objs);

    for(i = 0; i<objs.length; i++)
        objs[i].update();
}
