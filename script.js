// console.log('main.js is linked up')

import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';
BABYLON.GUI = GUI;

window.addEventListener('DOMContentLoaded', function () {

	//CAVANSSES
	// Get the canvas DOM element
	var canvas = document.getElementById('renderCanvas');

	//ENGINES
	// Load the 3D engine
	var engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });


	//CREATE SCENE
	var createScene = function () {

		//GLOBAL GAME OVER
		let gameOver = false;

		//SCENE
		// This creates a basic Babylon Scene object (non-mesh)
		var scene = new BABYLON.Scene(engine);

		//ENVIRONMENT
		scene.clearColor = new BABYLON.Color3(63/255, 15/255, 15/255);
		// var helper = scene.createDefaultEnvironment({
		//   enableGroundMirror: true
		// });       

		// helper.setMainColor(BABYLON.Color3.Teal());

		//PHYSICS
		var gravityVector = new BABYLON.Vector3(0,-19.81, 0);
		var physicsPlugin = new BABYLON.CannonJSPlugin();
		scene.enablePhysics(gravityVector, physicsPlugin);

		//CAMERA
		// This creates and positions a free camera (non-mesh)
		var camera = new BABYLON.UniversalCamera("camera1", new BABYLON.Vector3(15, 20, 85), scene);

		// This targets the camera 
		camera.setTarget(new BABYLON.Vector3(0, -10, 5));

		// This attaches the camera to the canvas
		camera.attachControl(canvas, false);

		//LIGHTS
		// This creates a light, aiming 0,1,0 - to the sky (non-mesh)
		var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
		light.intensity = 0.7;

		//POINTLIGHT
		// var pointLight = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(1, 1, 1), scene);

		//GLOW FOR EMMISSIVE LIGHTS
		var gl = new BABYLON.GlowLayer("glow", scene);
		gl.intensity = 0.5;

		//OBJECTS

		// PLAYER SPHERE Params: name, subdivs, size, scene
		var playerMesh = BABYLON.Mesh.CreateSphere("playerSphere", 16, 1.5, scene);
		var playerMaterial = new BABYLON.StandardMaterial("playerMaterial", scene);
		playerMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
		playerMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
		playerMaterial.wireframe = true;
		playerMesh.material = playerMaterial;

		// PLAYER IMPOSTER
		playerMesh.physicsImpostor = new BABYLON.PhysicsImpostor(playerMesh, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 2, friction: 1, restitution: 0.5 }, scene);

		//PLAYER CONTROLS

		//CHANGING DEFAULT KEYBOARD INPUTS.

		function KeyboardController(keys, repeat) {
			
			var timers = {};

			// When key is pressed and we don't already think it's pressed, call the
			// key action callback and set a timer to generate another one after a delay
			//
			document.onkeydown = function (event) {
				// console.log(event);
				// console.log(keys);
				var key = (event || window.event).keyCode;
				if (!(key in keys))
					return true;
				if (!(key in timers)) {
					timers[key] = null;
					keys[key]();
					if (repeat !== 0)
						timers[key] = setInterval(keys[key], repeat);
				}
				return false;
			};

			// Cancel timeout and mark key as released on keyup
			//
			document.onkeyup = function (event) {
				var key = (event || window.event).keyCode;
				if (key in timers) {
					if (timers[key] !== null)
						clearInterval(timers[key]);
					delete timers[key];
				}
			};

			// When window is unfocused we may not get key events. To prevent this
			// causing a key to 'get stuck down', cancel all held keys
			//
			window.onblur = function () {
				for (key in timers)
					if (timers[key] !== null)
						clearInterval(timers[key]);
				timers = {};
			};
		};
		then:

		KeyboardController({

			// a key
			65: () => playerMesh.applyImpulse(new BABYLON.Vector3(5, 0, 0), playerMesh.getAbsolutePosition()),

			// w key
			87: () => playerMesh.applyImpulse(new BABYLON.Vector3(0, 0, -5), playerMesh.getAbsolutePosition()),

			// d key
			68: () => playerMesh.applyImpulse(new BABYLON.Vector3(-5, 0, 0), playerMesh.getAbsolutePosition()),

			// s key
			83: () => playerMesh.applyImpulse(new BABYLON.Vector3(0, 0, 5), playerMesh.getAbsolutePosition())

			// this is the delay between repeats
		}, 50);




		//PLANES

		//ANGLED PLANE
		var angledPlane = BABYLON.MeshBuilder.CreatePlane("angledPlane", { width: 15, height: 45, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene);
		var angledPlaneMaterial = new BABYLON.StandardMaterial("angledPlaneMaterial", scene);
		angledPlaneMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
		angledPlaneMaterial.emissiveColor = new BABYLON.Color3(33 / 255, 8 / 255, 79 / 255);
		// angledPlaneMaterial.specularColor = new BABYLON.Color3(59, 239, 224);
		angledPlane.material = angledPlaneMaterial;

		//ANGLED PLANE IMPOSTER
		angledPlane.physicsImpostor = new BABYLON.PhysicsImpostor(angledPlane, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);

		//FLAT PLANE
		var flatPlane = BABYLON.MeshBuilder.CreatePlane("flatPlane", { width: 15, height: 15, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene);
		var flatPlaneMaterial = new BABYLON.StandardMaterial("flatPlaneMaterial", scene);
		flatPlaneMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
		flatPlaneMaterial.emissiveColor = new BABYLON.Color3(33 / 255, 8 / 255, 79 / 255);
		// flatPlaneMaterial.specularColor = new BABYLON.Color3(59, 239, 224);
		flatPlane.material = flatPlaneMaterial;

		//FLAT PLANE IMPOSTER
		flatPlane.physicsImpostor = new BABYLON.PhysicsImpostor(flatPlane, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);

		//POSITION AND ROTATE
		// pointLight.position.z = -10;
		// pointLight.position.y = 50;
		// pointLight.position.x = 0;

		playerMesh.position.z = 26;
		playerMesh.position.y = -14;

		angledPlane.position.z = 10;
		angledPlane.position.y = 2;
		angledPlane.rotate(BABYLON.Axis.X, Math.PI / 1.3, BABYLON.Space.WORLD);

		flatPlane.position.z = 32;
		flatPlane.position.y = -15;
		flatPlane.rotate(BABYLON.Axis.X, Math.PI / 2, BABYLON.Space.WORLD);




		// GUI
		var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

		var rect1 = new BABYLON.GUI.Rectangle();
		rect1.width = "200px";
		rect1.height = "40px";
		rect1.cornerRadius = 0;
		rect1.color = "white";
		rect1.thickness = 2;
		rect1.alpha = 0.8;
		rect1.background = "black";
		rect1.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
		rect1.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
		rect1.top = "20px";
		rect1.left = "20px";

		advancedTexture.addControl(rect1);

		var iterationText = new BABYLON.GUI.TextBlock();
		iterationText.text = "Hello world";
		iterationText.color = "white";
		iterationText.fontSize = 20;
		rect1.addControl(iterationText);

		function displayIterationText (text) {
			iterationText.text = `Waves: ${text}`;
		}

		// RESTART BUTTON
		var showRestartButton = (increment) => {
			var button = BABYLON.GUI.Button.CreateSimpleButton("but",`Nice! You survived ${increment} waves.\n Click to restart!`);
			button.width = "360px";
			button.height = "60px";
			button.color = "white";
			button.background = "green";
			button.onPointerDownObservable.add(function() {
					window.dispatchEvent(new Event('game_restart'));
			});
			advancedTexture.addControl(button);
		}

		var rect2 = new BABYLON.GUI.Rectangle();
		rect2.width = "200px";
		rect2.height = "100px";
		rect2.cornerRadius = 0;
		rect2.color = "white";
		rect2.thickness = 2;
		rect2.alpha = 0.8;
		rect2.background = "black";
		rect2.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
		rect2.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
		rect2.top = "80px";
		rect2.left = "20px";

		advancedTexture.addControl(rect2);

		var instructionText = new BABYLON.GUI.TextBlock();
		instructionText.text = "Don't fall off the platform!\nControl the glowing ball\nwith the W,A,S,D keys.";
		instructionText.color = "white";
		instructionText.fontSize = 15;
		rect2.addControl(instructionText);


		//INTERVAL AND SHAPE GENERATOR
		// This function is used to accelerate the rate of shapes dropping to increase the difficulty.
		let increment = 1;
		let intervalTime = 1000;

		function interval() {
			let interval = setTimeout(newShape, intervalTime);
			increment++;
			displayIterationText(increment);
			if (intervalTime > 50) {
				intervalTime -= 10;
			}

			//SETTING GAMEOVER CIRCUMSTANCES
			if (playerMesh.position.y < -30) {
				gameOver = true;
			}

		};
		interval();

		//SHAPE DESTRUCTOR
		// To allow the simulation to run indefinitely, let's track how many entities are in-play, and kill anything that falls into the abyss
		const MAX_ENTITIES = 400;
		const DIE_AT_Y = -25;
		let entityCount = 0;
		let entities = [];
		function addEntity (entity, imposter) {
			if (entity && imposter) {
				entities.push([entity, imposter]);
				entityCount++;
			}
		}
		function pruneEntities() {
			let entity, imposter;
			for (let i=0; i < entities.length; i++) {
				[entity, imposter] = entities[i]; // Array destructuring!
				if (entity.position.y < DIE_AT_Y) {
					entity.dispose();
					imposter.dispose();
					entities.splice(i, 1); // Delete the entity from our entity list.
					entityCount--;
				}
			}
		}

		//NEW SHAPES FUNCTION
		// Based on the time interval, this creates randomly sized/coloured shapes.
		function newShape() {
			// console.log("newshape called");
			if (entityCount < MAX_ENTITIES) {
				if (increment % 2 === 0) {
					var newSphere = BABYLON.Mesh.CreateSphere("genSphere", 16, getRandom(0.5, 3), scene);

					var newSphereMaterial = new BABYLON.StandardMaterial("playerMaterial", scene);
					newSphereMaterial.diffuseColor = new BABYLON.Color3(getRandom(0.5, 6), getRandom(0.5, 6), getRandom(0.5, 3));
					newSphere.material = newSphereMaterial;
					newSphere.position.y = getRandom(15, 35);
					newSphere.position.x = getRandom(-5, 5);
					newSphere.position.z = getRandom(0, 5);
					newSphere.physicsImpostor = new BABYLON.PhysicsImpostor(newSphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: getRandom(10, 20), restitution: getRandom(0.4, 0.6) }, scene);
					addEntity(newSphere, newSphere.physicsImpostor);
				}

				if (increment % 2 === 1) {
					var newBox = BABYLON.MeshBuilder.CreateBox("genBox", { height: getRandom(0.5, 3), width: getRandom(0.5, 3), depth: getRandom(0.5, 3) }, scene);

					var newBoxMaterial = new BABYLON.StandardMaterial("playerMaterial", scene);
					newBoxMaterial.diffuseColor = new BABYLON.Color3(getRandom(0.5, 6), getRandom(0.5, 6), getRandom(0.5, 3));
					newBox.material = newBoxMaterial;

					newBox.rotate(BABYLON.Axis.X, Math.PI / getRandom(1, 4), BABYLON.Space.WORLD);
					newBox.rotate(BABYLON.Axis.Y, Math.PI / getRandom(1, 4), BABYLON.Space.WORLD);
					newBox.position.y = getRandom(15, 35);
					newBox.position.x = getRandom(-5, 5);
					newBox.position.z = getRandom(0, 5);
					newBox.physicsImpostor = new BABYLON.PhysicsImpostor(newBox, BABYLON.PhysicsImpostor.BoxImpostor, { mass: getRandom(10, 20), restitution: getRandom(0.4, 0.6) }, scene);
					addEntity(newBox, newBox.physicsImpostor);
				}

				if (increment % 3 === 0) {
					var newSphere = BABYLON.Mesh.CreateSphere("genSphere", 16, getRandom(0.5, 3), scene);

					var newSphereMaterial = new BABYLON.StandardMaterial("playerMaterial", scene);
					newSphereMaterial.diffuseColor = new BABYLON.Color3(getRandom(0.5, 6), getRandom(0.5, 6), getRandom(0.5, 3));
					newSphere.material = newSphereMaterial;
					newSphere.position.y = getRandom(15, 35);
					newSphere.position.x = getRandom(-5, 5);
					newSphere.position.z = getRandom(0, 5);
					newSphere.physicsImpostor = new BABYLON.PhysicsImpostor(newSphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: getRandom(10, 20), restitution: getRandom(0.4, 0.6) }, scene);
					addEntity(newSphere, newSphere.physicsImpostor);
				}
			}
			pruneEntities();
			// console.log(entityCount);        
			if (gameOver === false) {
				interval();
			} else {
				showRestartButton(increment);
			}
		};
		// RETURN THE SCENE
		return scene;
	};

	//GET RANDOM NUMBER GENERIC FUNCTION
	function getRandom(min, max) {
		return Math.random() * (max - min) + min;
	};

	// CALLED SCENES
	var scene = createScene();

	window.addEventListener('game_restart', function () {
		console.log('restart');
		scene.dispose();
		scene = createScene();
	});

	// THE RENDER LOOP
	engine.runRenderLoop(function () {
		scene.render();
	});

	// CANVAS EVENT HANDLER FOR BROWSER RESIZE
	window.addEventListener('resize', function () {
		engine.resize();
	});
});
