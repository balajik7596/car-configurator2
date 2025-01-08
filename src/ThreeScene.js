import React, { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame,useThree } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import {
  Environment,
  OrbitControls,
  useGLTF,
  useTexture,
  useProgress,
  PerspectiveCamera
} from "@react-three/drei";
import { DirectionalLightHelper, ACESFilmicToneMapping } from "three"; // Import from 'three'
import * as THREE from "three";
import { Raycaster, Vector2 } from "three";
import { useLoader } from '@react-three/fiber';
import SidePanel from './SidePanel'; // Import the side panel component

import "./app.css";
// import { useLoader } from "@react-three/fiber";
// import { RGBELoader } from "three-stdlib";
function CarModel({ color, lightsOn, selColor, onLoad ,selectedAnimation,setPlayAnimation}) {
  // const hdrEquirect = useLoader(RGBELoader, '/studio_small.hdr');
  const { scene, animations } = useGLTF("/main-car.glb");
  const [mixer, setMixer] = useState(new THREE.AnimationMixer(scene));
  const ambientLightRef = useRef();
  const clock = new THREE.Clock(); // to manage the animation time
  // const [isReversed, setIsReversed] = useState(true); // Track if animation should play in reverse
// console.log(animations);

  useEffect(() => {
    if (animations && mixer && scene) {
      // mixer = new THREE.AnimationMixer(scene);

      // Find animations by name
      const frontLeftDoor = animations.find((clip) => clip.name === "DOOR LEFT  FRONT CONTROLLERAction");
      const frontRightDoor = animations.find((clip) => clip.name === "DOOR RIGHT FRONT CONTROLLERAction");
      const rearLeftDoor = animations.find((clip) => clip.name === "DOOR LEFT BACKAction");
      const rearRightDoor = animations.find((clip) => clip.name === "DOOR RIGHT BACKAction");
      const behindBootDoor = animations.find((clip) => clip.name === "BACK GATE CONTROLLERAction");
      const leftWheelRotation = animations.find((clip) => clip.name === "WHEEL L");
      const rightWheelRotation = animations.find((clip) => clip.name === "WHEEL R");
      const sunroofAnimation = animations.find((clip) => clip.name === "SUN ROOF");
      const frontChargerFlap = animations.find((clip) => clip.name === "FRNT CHARGER FLAPAction"); // Front Charger Flap Animation

      const createAction = (clip) => {
        if (!clip) return null;
        const action = mixer.clipAction(clip);
        action.loop = THREE.LoopOnce; // Play only once
        action.clampWhenFinished = true; // Freeze at the last frame
        return action;
      };

      const actions = {
        frontLeft: createAction(frontLeftDoor),
        frontRight: createAction(frontRightDoor),
        rearLeft: createAction(rearLeftDoor),
        rearRight: createAction(rearRightDoor),
        behindBoot: createAction(behindBootDoor),
        leftWheel: createAction(leftWheelRotation),
        rightWheel: createAction(rightWheelRotation),
        sunroof: createAction(sunroofAnimation),
        chargerFlap: createAction(frontChargerFlap), // Charger Flap Action
      };

      const playToggle = (action, isReversed) => {
        
        if (!action) return;
        action.paused = false;
        action.setEffectiveTimeScale(isReversed ? -1 : 1); // Reverse or forward playback
        action.setEffectiveWeight(1); // Ensure the action is fully active
        if (isReversed) {
          action.time = action.getClip().duration; // Start from the end of the clip
        } else {
          action.time = 0; // Start from the beginning of the clip
        }
        action.play(); // Play the animation
      };

      // Set play functions with toggle
      setPlayAnimation({
        openFrontLeftDoor: (isReversed) => playToggle(actions.frontLeft, isReversed),
        openFrontRightDoor: (isReversed) => playToggle(actions.frontRight, isReversed),
        openRearLeftDoor: (isReversed) => playToggle(actions.rearLeft, isReversed),
        openRearRightDoor: (isReversed) => playToggle(actions.rearRight, isReversed),
        openBehindBootDoor: (isReversed) => playToggle(actions.behindBoot, isReversed),
        playLeftWheel: (isReversed) => playToggle(actions.leftWheel, isReversed),
        playRightWheel: (isReversed) => playToggle(actions.rightWheel, isReversed),
        toggleSunroof: (isReversed) => playToggle(actions.sunroof, isReversed),
        toggleChargerFlap: (isReversed) => playToggle(actions.chargerFlap, isReversed), // Charger Flap Toggle
      });
    }
    
  }, [animations, scene, setPlayAnimation]);
    // Setup the animation mixer when the GLTF model is loaded
    // useEffect(() => {
    //   if (animations && animations.length > 0) {
    //     const animationMixer = new THREE.AnimationMixer(scene);
    //     animations.forEach((clip) => {
    //       animationMixer.clipAction(clip).paused = true; // Start paused
    //     });
    //     setMixer(animationMixer);
    //   }
  
    //   if (onLoad) onLoad();
    // }, [animations, scene, onLoad]);
  
    // Update the animation mixer on each frame
    useFrame(() => {
      if (mixer) {
        mixer.update(clock.getDelta());
      }
    });

  useEffect(() => {
    if (onLoad) onLoad();
  }, [onLoad]);

  // Define the roof meshes to exclude for specific colors
  const roofMeshes = ["Retopo_shell_0017", "Retopo_shell_0021", "Roof"];

  scene.traverse((child) => {
    if (child.isMesh) {
      if(child.material.name === 'BLACK GLASS'){
        child.material.opacity = 0.7;
        child.material.aoMap = null;        
      }
            if(child.material.name === "E_xogRUo007_Default_Rubber_BlackTireSidewall17"){
              child.material.color.set('#000000');
            }

      //lights
      if (child.material.name === "M_xogGLo001_Glass_WhiteClr.002") {
        if (lightsOn) {
          child.material.emissive.set(0xffffff);
          child.material.emissiveIntensity = 10;
          child.material.needsUpdate = true;
        } else {
          child.material.emissive.set(0x000000);
          child.material.emissiveIntensity = 1;
          child.material.needsUpdate = true;
        }
      }
      if (child.material.name === "CRETA_GLOW") {
        child.material.color.set("#ffffff");
      }

      if (child.material.name === "GROUND_SAHDOW ") {
        child.material.color.set("#000000");
        child.material.roughness = 1;
        child.material.opacity = 0.9;
      }

      if (child.material.name.includes("GLOW")) {
        if (lightsOn) child.material.opacity = 1.0;
        else child.material.opacity = 0;
      }
      if (child.material.name === "Front-Headlight-White") {
        if (lightsOn){
          child.material.emissive = new THREE.Color(255,255,255);      
          child.material.emissiveIntensity = 15.0;
                }
        else child.material.emissiveIntensity = 0;
      }
      if(child.name === 'SPOT-LIGHT'){
        if(lightsOn)child.material.opacity = 1.0;
        else child.material.opacity = 0;

      }
      if(child.material.name.includes("GLOW") ||
      child.material.name.includes("WHITE EMIT LIGHT") ||
      child.material.name.includes("CRETA_GLOW")
    ) {
      child.visible = true;
      // if (lightsOn) child.material.opacity = 1;
      // else child.material.opacity = 0;

      if (lightsOn) child.material.emissiveIntensity = 100;
      else child.material.emissiveIntensity = 1;
    }
    //back light
    if(child.material.name.includes("RedClr")){
      if (lightsOn) child.material.emissiveIntensity = 3;
      else child.material.emissiveIntensity = 1;
    }
      //glass
      if (child.material.name === "Glass") {
        child.material.roughness = 0.1;
        child.material.metalness = 1;
        child.material.color.set("#9E9E9E");
      }
      if (child.material.name === "M_xogGLo001_Glass_WhiteClr.002") {
        child.material.color.set("#ffffff");
        // child.material.emissive.set(0xffffff);
        // child.material.emissiveIntensity = 10;
        child.material.needsUpdate = true;
        child.material.metalness = 1;
      }
      if (roofMeshes.includes(child.name)) {
        if (!selColor.includes("black roof")) {
          child.material.color.set(color);
        } else {
          child.material.color.set("#000000");
        }
        // if(selColor.includes('Ocean Blue')){
        //   child.material.color.set(color);
        //   child.material.emissive.setHex('#000000');
        //   child.material.emissiveIntensity = 1;
        //   child.material.IOR = 1.0;
        // }
        if (selColor.includes("Matte")) child.material.roughness = 0.2;
        else child.material.roughness = 0.13;
        return;
      }
      if(child.material.name === 'UPPER-ROOF-BACK'){
        if (!selColor.includes("black roof")) {
          child.material.color.set('#141414');
        } else {
          child.material.color.set("#000000");
        }
      }
      if (child.name === "Top-SIDE-SILVER" || child.name ==='TOP-silver002' ) {
        child.material.roughness = 0.12;
      }
      if (
        child.material.name === "M_A2Boxox_Default_Lacquer_AbyssBlackPea.011"
      ) {
        child.material.roughness = 0.22;
        child.material.metalness = 0.6;
      }
      if(child.name === 'OVRM_bottom'){
        child.material.color.set("#1c1c1c");
      }
      if(child.name === 'shell_0096' || child.name === 'shell_0098'){
        child.material.color.set("#0a0a0a");
        child.material.roughness = 0.12;
      }

      if (
        (child.name === "Top-SIDE-SILVER"|| child.name ==='TOP-silver002' ) &&
        !selColor.includes("black roof")
      ) {
        child.material.color.set("#8F8F8F");
      }
      if ((child.name === "Top-SIDE-SILVER" || child.name ==='TOP-silver002' ) && selColor.includes("black roof")) {
        child.material.color.set("#1A1B23");
      }
      if (
        (child.name === "Top-SIDE-SILVER"|| child.name ==='TOP-silver002' ) &&
        selColor.includes("Atlas White with black roof")
      ) {
        child.material.color.set("#000000");
      }
      if (child.material.name.includes("ROOF-RAIL")) {
        if (!selColor.includes("black roof")) {
          child.material.color.set("#C4C4C4");
          child.material.roughness = 0.15;
          child.material.IOR = 1.5;
          child.material.metalness = 0.75;
        } else {
          child.material.color.set("#000000");
        }
      }
      if (
        child.material.name === "UPPER_ALL" &&
        selColor.includes("Atlas White with black roof")
      ) {
        child.material.color.set("#000000");
      }
      if (child.material.name.includes("CAR_PAINT_BODY-white") || child.material.name.includes("White-side-panel-bake")) {
        if (selColor.includes("Ocean Blue")) {
          child.material.color.set(color);
          child.material.emissive.setHex("#000000");
          child.material.emissiveIntensity = 1;
          child.material.IOR = 1.0;
          child.material.reflectivity = 0.5;
          if(selColor.includes('Metallic')){
            child.material.roughness = 0.13
            child.material.reflectivity = 0.68;
          }
        } else if (selColor === "Starry Night") {
          child.material.color.set(color);
          child.material.emissive.setHex("#678908"); // Set emissive color to red
          child.material.emissiveIntensity = 3; // Increase the intensity
          child.material.IOR = 1.8;
          child.material.reflectivity = 0.71;
        } else if (selColor === "Robust Emerald Matte") {
          child.material.color.set(color);
          child.material.emissive.setHex("#000000"); // Set emissive color to red
          child.material.emissiveIntensity = 1.0; // Increase the intensity
          child.material.roughness = 0.2;
          child.material.IOR = 1.778;
          child.material.reflectivity = 0.71;
        } else if (selColor === "Fiery Red Pearl") {
          child.material.color.set(color);
          child.material.emissive.setHex("#000000"); // Set emissive color to red
          child.material.emissiveIntensity = 1; // Increase the intensity
          child.material.IOR = 1.778;
          child.material.reflectivity = 0.7;
        } else if (selColor === "Titan Grey Matte") {
          child.material.color.set(color);
          child.material.emissive.setHex("#1f1e1e");
          child.material.emissiveIntensity = 1;
          child.material.IOR = 1.0;
          child.material.reflectivity = 0.5;
        } else if (selColor.includes("Atlas White")) {
          child.material.color.set(color);
          child.material.emissive.setHex("#ffffff");
          child.material.emissiveIntensity = 1;
          child.material.IOR = 1.0;
          child.material.reflectivity = 0.5;
        } else if (selColor.includes("Abyss Black Pearl")) {
          child.material.color.set(color);
          child.material.emissive.setHex("#050505");
          child.material.emissiveIntensity = 1.2;
          child.material.IOR = 1.0;
          child.material.reflectivity = 0.5;
        }
        //ambient light
        if (ambientLightRef.current){
          if(selColor.includes("Atlas White") || selColor === "Fiery Red Pearl" || selColor === "Starry Night" ) {
            ambientLightRef.current.intensity = 3;
          }else{
            ambientLightRef.current.intensity = 2;
          }
        } 

        if (selColor.includes("Matte")){
           child.material.roughness = 0.2;
           if(selColor.includes('Ocean')){
              child.material.roughness = 0.2;
              child.material.reflectivity = 0.4;
            }
        }
        else child.material.roughness = 0.13;
      }
    }
  });
  return (
    <group
      scale={[1.2, 1.2, 1.2]}
      position={[0, 0.03, -1.5]}
      rotation={[0, (3 * Math.PI) / 2, 0]}
    >
    <ambientLight ref ={ambientLightRef} intensity={2} color="#ffffff" />

      {" "}
      {/* Scale up by 20% */}
      <primitive object={scene} />
    </group>
  );
}

function SkyDome({onClick}) {
  const { scene } = useGLTF("/skydome.glb"); // Replace with the path to your GLB file
  const handleClick = (event) => {
    // console.log(event.object.name);
        
    // Call the parent handler when clicked
    if (onClick && typeof onClick === 'function') {
      onClick(event.object.name); // Pass event if needed or modify the handler
    }
  };
  return (
    <group rotation={[0, (3 * Math.PI) / 2, 0]} onClick = {handleClick}>
      <primitive object={scene} />
    </group>
  );
}
function IntDome({onClick}) {
  const { scene } = useGLTF("/pano.glb"); // Replace with the path to your GLB file
  const handleClick = (event) => {
    // console.log(event.object.name);
        
    // Call the parent handler when clicked
    if (onClick && typeof onClick === 'function') {
      onClick(event.object.name); // Pass event if needed or modify the handler
    }
  };
  return (
    <group rotation={[0, (3 * Math.PI) / 2, 0]} onClick = {handleClick}>
      <primitive object={scene} />
    </group>
  );
}
function CarShadow() {
  // Load the texture (replace with your actual .webp file path)
  const texture = useTexture("/carshadow.webp"); // Replace with your actual .webp path

  return (
    <mesh
      scale={[0.8, 0.8, 0.8]}
      position={[0, 0, 0]}
      rotation={[Math.PI / 2, 0, 0]}
    >
      {/* Plane Geometry with texture */}
      <planeGeometry args={[10, 10]} /> {/* Plane size: 10x10 */}
      <meshStandardMaterial
        map={texture}
        transparent={true}
        opacity={0.9}
      />{" "}
      {/* Apply the texture */}
    </mesh>
  );
}
function RotatingEnvironment({ path, rotationValue = 180 }) {
  const group = useRef();

  return (
    <group ref={group}>
      <Environment files={path} background />
    </group>
  );
}
const createSpriteWithSvg = (svgString, position,scene) => {
  // Create a canvas to render the SVG
  const canvas = document.createElement('canvas');
  canvas.width = 128; // Adjust size as needed
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  // Create an Image element for the SVG
  const img = new Image();
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(svgBlob);

  img.onload = () => {
    // Draw the SVG onto the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Create a texture from the canvas
    const texture = new THREE.CanvasTexture(canvas);

    // Create the sprite material and sprite
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);

    // Set sprite position
    sprite.position.copy(position);

    // Scale the sprite (optional)
    sprite.scale.set(0.5, 0.5, 0.5); // Adjust size as needed
    sprite.position.set(position.x, position.y, position.z - 0.01); // Adjust Z as needed

    sprite.renderOrder = 13; // This ensures it's rendered above other objects

    // Add the sprite to the scene
    scene.add(sprite);

    // Clean up the URL object
    URL.revokeObjectURL(url);
  };

  // Set the image source to the generated URL
  img.src = url;
};

function RaycasterHandler() {
  const { camera, scene, gl } = useThree(); // Access Three.js objects
  const raycaster = useRef(new Raycaster());
  const pointer = useRef(new Vector2());

  const handleClick = (event) => {
    const { clientX, clientY } = event;
    const rect = gl.domElement.getBoundingClientRect();
  
    // Calculate normalized device coordinates
    pointer.current.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointer.current.y = -((clientY - rect.top) / rect.height) * 2 + 1;
  
    // Update the raycaster
    raycaster.current.setFromCamera(pointer.current, camera);
  
    // Perform raycasting
    const intersects = raycaster.current.intersectObjects(scene.children, true);
    if (intersects.length > 0) {
      const intersectionPoint = intersects[0].point;
      // console.log("Intersection point:", intersectionPoint);
  
      const svgString = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" width="12px" height="12px">
        <!-- Outer Circle (more transparent) -->
        <circle cx="6" cy="6" r="2.5" fill="white" fill-opacity="0.4" />
        
        <!-- Inner Circle (less transparent) -->
        <circle cx="6" cy="6" r="1.25" fill="white" fill-opacity="1" />
      </svg>
    `;
    
    
  
      // Call the function to create the sprite with the SVG
      // createSpriteWithSvg(svgString, intersectionPoint,scene);
    }
  };
  

  useEffect(() => {
    // Attach event listener to canvas
    const canvas = gl.domElement;
    canvas.addEventListener("click", handleClick);

    // Cleanup event listener on unmount
    return () => {
      canvas.removeEventListener("click", handleClick);
    };
  }, [gl, camera, scene]);

  return null; // No visible component needed
}

// CameraMover Component
const CameraMover = ({ targetPosition, spriteClicked }) => {
  const { camera } = useThree(); // Access the camera object

  useEffect(() => {
    if (spriteClicked) {
      // Smoothly move the camera to the target position
      const duration = 1000; // Animation duration in ms
      const startPosition = { ...camera.position };
      const startTime = performance.now();

      const animate = () => {
        // console.log(camera.position);
        
        const elapsed = performance.now() - startTime;
        const t = Math.min(elapsed / duration, 1); // Ensure t is between 0 and 1

        // Linear interpolation (you can use easing functions here)
        camera.position.lerpVectors(
          startPosition,
          new THREE.Vector3(...targetPosition),
          t
        );

        // Update the camera
        camera.updateProjectionMatrix();

        if (t < 1) {
          requestAnimationFrame(animate);
        }
      };

      animate();
    }
  }, [spriteClicked, targetPosition, camera]);

  return null; // No visual output
};

// Create a function component that adds a sprite with a given SVG string at a given position
const SpriteWithSVG = ({ id, svgString, position = [0, 0, 0] , onClick}) => {
  
  // Create a texture from the SVG string using a loader
  const texture = useLoader(THREE.TextureLoader, `data:image/svg+xml;base64,${btoa(svgString)}`);


  const spriteRef = useRef();

  useEffect(() => {
    if (spriteRef.current) {
      // If we have a reference to the sprite, set the position
      spriteRef.current.position.set(...position);
    }
  }, [position]);

  const handleClick = (event) => {
    // console.log(event.object.name);
        
    // Call the parent handler when clicked
    if (onClick && typeof onClick === 'function') {
      onClick(event.object.name); // Pass event if needed or modify the handler
    }
  };
  return (
    <sprite name={id} ref={spriteRef} scale={[0.25,0.25,0.25]} onClick={handleClick}>
      <spriteMaterial attach="material" map={texture} transparent={true} />
    </sprite>
  );
};


export default function ThreeScene() {
  const lightRef = useRef(); // Reference for the directional light
  const helperRef = useRef(); // Reference for the light helper
  const targetRef = useRef(); // Reference for the light target
  //const [selectedColor, setSelectedColor] = useState("#bbe9ff"); // 71b1cf
  const [selectedColor, setSelectedColor] = useState("#EBF9FF"); // 71b1cf
  const [selColor, setSelColor] = useState(
    "Ocean Blue Metallic with black roof"
  ); // 71b1cf

  const [showColors, setShowColors] = useState(true);
  const [carColor, setCarColor] = useState("#7BCCF4");
  const [lightsOn, setlightsOn] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const carModelRef = useRef();
  const handleModelLoad = () => setModelLoaded(true);
  const { active, progress } = useProgress(); // Use progress from drei
  const [currentBox, setCurrentBox] = useState(0);
  const [spriteClicked, setSpriteClicked] = useState(false);
  const [hideOthers, sethideOthers] = useState(false);

  const [target, setTarget] = useState([-5, 3, -8]);
  const [minDistance, setMinDistance] = useState(5);
  const [maxDistance, setMaxDistance] = useState(8); // Default maxDistance
  const [enablePan, setEnablePan] = useState(false); 
  const [enableZoom, setEnableZoom] = useState(true); 
  const [minPolarAngle, setMinPolarAngle] = useState(Math.PI / 5); 
  const [maxPolarAngle, setMaxPolarAngle] = useState(Math.PI / 2.3); 
  const [selectedSpriteId, setselectedSpriteId] = useState("");
  const [activeCamera, setActiveCamera] = useState("default"); // State to manage the active camera
  const [selectedAnimation, setselectedAnimation] = useState(""); // State to manage the active camera
  const defaultCameraRef = useRef();
  const interiorCameraRef = useRef();
  const [toneMapexp, settoneMapexp] = useState(1.2);
  const [toneMap, settoneMap] = useState(THREE.ACESFilmicToneMapping);


  const [sunroofState, setSunroofState] = useState(false);
  const [playAnimation, setPlayAnimation] = useState({
    openFrontLeftDoor: () => { },
    openFrontRightDoor: () => { },
    openRearLeftDoor: () => { },
    openRearRightDoor: () => { },
    openBehindBootDoor: () => { },
    toggleSunroof: () => { },
  });
  const svgString = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" width="100px" height="100px">
    <!-- Outer Circle (more transparent) -->
    <circle cx="6" cy="6" r="2.5" fill="white" fill-opacity="0.4" />
    
    <!-- Inner Circle (less transparent) -->
    <circle cx="6" cy="6" r="1.25" fill="white" fill-opacity="1" />
  </svg>
`;
  const colors = [
    {
      id: "Abyss Black Pearl",
      hex: "#020202",
      path: "/colors/Abyss Black Pearl.png",
    },
    { id: "Atlas White", hex: "#f0f0f0", path: "./colors/Atlas White.png" },
    {
      id: "Fiery Red Pearl",
      hex: "#8D0C07",
      path: "./colors/Fiery Red Pearl.png",
    }, //#930302
    { id: "Starry Night", hex: "#122544", path: "./colors/Starry Night.png" }, //#3a496b
    {
      id: "Ocean Blue Metallic",
      hex: "#7BCCF4",
      path: "./colors/Ocean Blue Metallic.png",
    },
    {
      id: "Ocean Blue Matte",
      hex: "#7BCCF4",
      path: "./colors/Ocean Blue Matte.png",
    },
    {
      id: "Titan Grey Matte",
      hex: "#474747",
      path: "./colors/Titan Grey Matte.png",
    },
    {
      id: "Robust Emerald Matte",
      hex: "#014638",
      path: "./colors/Robust Emeraid Matte.png",
    }, //#172f2b
    {
      id: "Atlas White with black roof",
      hex: "#efefef",
      path: "./colors/Atlas White with black roof.png",
    },
    {
      id: "Ocean Blue Metallic with black roof",
      hex: "#7BCCF4",
      path: "/colors/Ocean Blue Metallic with black roof.png",
    },
  ];
  const sprites = [
    { id: 'charger', event: 'handleSpriteClick', position: [0.026, 0.8, -2.65] },
    { id: 'airflaps', event: 'handleSpriteClick', position: [-0.257, 0.46, -2.7] },
    { id: 'bumper', event: 'handleSpriteClick', position: [-0.16973610994713895, 0.600119960444232, 2.7082867790909097] },
    { id: 'wheel', event: 'handleSpriteClick', position: [1.166633102010636, 0.6027375218705294, -1.6985152476025873] },
    // { id: 'interior', event: 'switchTointerior', position: [1.1206609966479046, 1.1603088054062152, 0.2972193984778875] },
    // { id: 'exterior', event: 'switchTointerior', position: [0.6864094940674355, 1.0438238091050263, 0.16418587917159022] },
    { id: 'steering', event: 'handleSpriteClick', position: [0.42432859476185947, 1.2086424446862685, -0.3089562841676877] },
    { id: 'display', event: 'handleSpriteClick', position: [0.17507262595172307, 1.3055110190586945, -0.5184277591798003] },
    { id: 'seat', event: 'handleSpriteClick', position: [-0.6472811047481658, 0.8115163349545533, -0.3406045298454772] },
    { id: 'console', event: 'handleSpriteClick', position: [0.018167740087783865, 1.0581931975720994, -0.32555558189381917] },
    { id: 'v2l', event: 'handleSpriteClick', position: [-0.0661013940479657, 1.1417463582073824, 0.31539398673229235] }
  ];

    
  const handleColorChange = (hex, id) => {
    setCarColor(hex);
    setSelColor(id);
    // setShowColors(false); // Hide color options after selecting
    setSelectedColor(hex);
  };
  const handleLightChange = () => {
    setlightsOn(!lightsOn);
  };
  const handleBrushClick = () => {
    setShowColors((prev) => !prev); // Toggle visibility
  };
  const handleClosePanel = () => {
    setSpriteClicked(!spriteClicked); // Hide the side panel
  };
  const handleSpriteClick = (id) => {
    // Handle the click event here and update the state
    setSpriteClicked(!spriteClicked);
    setselectedSpriteId(id);
    // console.log("Sprite clicked! Current state:", spriteClicked);
  }
  const switchTointerior = (id) => {
    // setSpriteClicked(!spriteClicked);
    // setselectedSpriteId('new');
    console.log(activeCamera,id);
    
    if(activeCamera === 'default' && id === 'in'){
      setActiveCamera("interior");
      sethideOthers(true);
      settoneMap(THREE.LinearToneMapping);
      settoneMapexp(1);

    }
    else if (activeCamera === 'interior' && id === 'out'){
      setActiveCamera("default");
      sethideOthers(false);
      settoneMap(THREE.ACESFilmicToneMapping);
      settoneMapexp(1.2);
    }
  }
  const handlePlayAnimation = (door) => {
    setDoorStates((prev) => {
      const isReversed = prev[door];
      if (playAnimation[`open${door.charAt(0).toUpperCase() + door.slice(1)}Door`]) {
        playAnimation[`open${door.charAt(0).toUpperCase() + door.slice(1)}Door`](isReversed);
      }
      return { ...prev, [door]: !prev[door] }; // Toggle the door state
    });
  };

  const handleStopAnimation = () => {
    carModelRef.current?.stopAnimation("YourAnimationName"); // Replace with your animation name
  };

  const handleToggleSunroof = () => {
    setSunroofState((prev) => {
      playAnimation.toggleSunroof(prev); // Play or reverse the sunroof animation
      return !prev; // Toggle the state
    });
  };
  const [doorStates, setDoorStates] = useState({
    frontLeft: false,
    frontRight: false,
    rearLeft: false,
    rearRight: false,
    behindBoot: false,
  });
  const handlePlayAllDoors = () => {
    const allDoorsOpen = Object.values(doorStates).every((state) => state === true);

    setDoorStates((prev) => {
      const newStates = {};
      for (const door in prev) {
        const isReversed = allDoorsOpen; // Reverse if all doors are open
        if (!allDoorsOpen && prev[door] === false) {
          // Only play animation to open doors that are closed
          if (playAnimation[`open${door.charAt(0).toUpperCase() + door.slice(1)}Door`]) {
            playAnimation[`open${door.charAt(0).toUpperCase() + door.slice(1)}Door`](isReversed);
          }
          newStates[door] = true; // Mark door as open
        } else if (allDoorsOpen && prev[door] === true) {
          // Only play animation to close doors that are open
          if (playAnimation[`open${door.charAt(0).toUpperCase() + door.slice(1)}Door`]) {
            playAnimation[`open${door.charAt(0).toUpperCase() + door.slice(1)}Door`](isReversed);
          }
          newStates[door] = false; // Mark door as closed
        } else {
          // Keep state unchanged for already open/closed doors
          newStates[door] = prev[door];
        }
      }
      return newStates;
    });
  };
  const eventHandlers = {
    handleSpriteClick: handleSpriteClick,
    switchTointerior: switchTointerior
  };
  const handleCanvasClick = (event) => {    
    if(spriteClicked)
      setSpriteClicked(false);
  };
  useEffect(() => {
    if (lightRef.current && !helperRef.current) {
      // Add DirectionalLightHelper after light is added
      const helper = new DirectionalLightHelper(lightRef.current, 1); // 1 is the size of the helper
      helperRef.current = helper;
      // lightRef.current.parent.add(helper); // Add the helper to the light's parent
    }
  
    if (lightRef.current && targetRef.current) {
      // Set the target of the directional light to the origin (0, 0, 0)
      lightRef.current.target = targetRef.current;
    }
  
    const updateMaxDistance = () => {
      if (window.innerWidth <= 768) {
        // For tablets and smaller devices
        setMaxDistance(12); // Assign a smaller maxDistance
      } else {
        setMaxDistance(7); // Default value for larger screens
      }
    };
  
    // Call the function on initial load
    updateMaxDistance();
  
    // Add a resize event listener to adjust maxDistance dynamically
    window.addEventListener("resize", updateMaxDistance);
  
    // **New Logic**: Manage animation for boxes
    if (!modelLoaded) {
      const interval = setInterval(() => {
        setCurrentBox((prev) => (prev + 1) % 4); // Cycle through 0 to 3
      }, 300); // Adjust the duration (500ms per box)
  
      // Cleanup the interval when the model is loaded or the component unmounts
      return () => {
        clearInterval(interval);
        window.removeEventListener("resize", updateMaxDistance); // Cleanup resize event listener
      };
    }
  
    return () => {
      // Ensure cleanup happens even if `modelLoaded` is already true
      window.removeEventListener("resize", updateMaxDistance);
    };
  }, [modelLoaded]);
  

  return (
    <div className="viewer-container no-select">
      {" "}
      {/* Full-screen canvas */}
      {modelLoaded && !spriteClicked && !hideOthers && (
        <div className="bottom-banner-container">
          <div className="bottom-banner">
            <div className="banner-image">
              <img src="/Functions.png" alt="Functions Banner" />
            </div>
            <div className="button-list">
              <button className="function-button" onClick={handleLightChange}>
                <img src="/Light Indicator.png" alt="Icon 1" />
              </button>
              <button className="function-button" onClick={() =>handlePlayAnimation("frontRight")}>
                <img src="/doorrf.png" alt="Icon 1" />
              </button>
              <button className="function-button" onClick={() =>handlePlayAnimation('frontLeft')}>
                <img src="/doorlf.png" alt="Icon 1" />
              </button>
              <button className="function-button" onClick={() =>handlePlayAnimation('rearRight')}>
                <img src="/doorbr.png" alt="Icon 1" />
              </button>
              <button className="function-button" onClick={() =>handlePlayAnimation('rearLeft')}>
                <img src="/doorbl.png" alt="Icon 1" />
              </button>
              <button className="function-button" onClick={handlePlayAllDoors}>
                <img src="/door.png" alt="Icon 1" />
              </button>
              {/* <button className="function-button" onClick={handleToggleSunroof}>
                <img src="/Light Indicator.png" alt="Icon 1" />
              </button> */}
              <button className="function-button" onClick={() => handlePlayAnimation("behindBoot")}>
                <img src="/back.png" alt="Icon 1" />
              </button>
              <button className="function-button" onClick={() => switchTointerior("in")}>
                <img src="/in.png" alt="Icon 1" />
              </button>
              <button className="function-button" onClick={() =>  switchTointerior("out")}>
                <img src="/out.png" alt="Icon 1" />
              </button>
            </div>
          </div>
        </div>
      )}
        {modelLoaded && hideOthers && (
        <div className="bottom-banner-container">
          <div className="bottom-banner">
            <div className="banner-image">
              <img src="/Functions.png" alt="Functions Banner" />
            </div>
            <div className="button-list">              
              <button className="function-button" onClick={() => switchTointerior("in")}>
                <img src="/in.png" alt="Icon 1" />
              </button>
              <button className="function-button" onClick={() => switchTointerior("out")}>
                <img src="/out.png" alt="Icon 1" />
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Brand Banner */}
      {!modelLoaded && (
        <div className={`brand-banner `}>
          <img src="/banner.png" alt="Brand Logo" className="brand-logo" />
        </div>
      )}
      {!modelLoaded && (
        <div className="loading-box-container">
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className={`loading-box ${currentBox === index ? "filled" : ""}`}
              ></div>
            ))}
        </div>
      )}
      <Canvas
        // camera={{ position: [-5, 3, -8], fov: 50 }}
        gl={{
          antialias: true,
          toneMapping: toneMap,
          toneMappingExposure: toneMapexp,
        }}
      >
      <PerspectiveCamera
          makeDefault={activeCamera === "default"} // Activate this camera when it's active
          ref={defaultCameraRef}
          position={[-5, 3, -8]}
          fov={50}
        />

        {/* Interior Camera */}
        <PerspectiveCamera
          makeDefault={activeCamera === "interior"} // Activate this camera when it's active
          ref={interiorCameraRef}
          position={(activeCamera === "interior")?[0, 1.5, 0.0]:[0,0,0]} // Position for interior view
          fov={60}
          target={[0,50,0]}
        />
        <Suspense fallback={null}>
          {/* Load HDR Environment */}
          {/* <Image360Sphere imageUrl="/360.jpg" /> */}

          {activeCamera === 'default' && (
            <group>
              <RotatingEnvironment path="/studio_small.hdr" rotationValue={180} />
              <SkyDome onClick={handleCanvasClick} />
              
              <CarShadow />
              {/* Add the 3D Model */}
              <CarModel
                ref={carModelRef}
                color={carColor}
                selColor={selColor}
                onLoad={handleModelLoad}
                lightsOn={lightsOn}
                setPlayAnimation={setPlayAnimation}
                selectedAnimation={selectedAnimation}
              />
              
            </group>)}
            {activeCamera === 'interior' && (
            <group>
              {/* <IntDome></IntDome> */}
              <RotatingEnvironment path="/pano.hdr" rotationValue={Math.PI/2} />

            </group>)} 
          {!hideOthers?(spriteClicked
          ? sprites.map((sprite) =>
              sprite.id === selectedSpriteId ? (
                <SpriteWithSVG
                  key={sprite.id}
                  id={sprite.id}
                  svgString={svgString}
                  position={sprite.position}
                  onClick={eventHandlers[sprite.event]}  // Dynamically assign the correct event handler
                />
              ) : null // Hide other sprites
            )
          : sprites.map((sprite) => (
              <SpriteWithSVG
                key={sprite.id}
                id={sprite.id}
                svgString={svgString}
                position={sprite.position}
                onClick={eventHandlers[sprite.event]}  // Dynamically assign the correct event handler
              />
          ))):null}


          {/* <CameraMover targetPosition={[0,0,0]} targetRotation={[Math.PI2,0,0]} spriteClicked={activeCamera === 'interior'} /> */}

        </Suspense>
        {modelLoaded && <RaycasterHandler />}

        {/* Add Camera Controls */}
        <OrbitControls
          target={activeCamera === "default" ? [-0, 0, -0] : [2, 1.5, 0.0]}
          enablePan={activeCamera === "default" ?enablePan:false}
          enableZoom={activeCamera === "default" ?enableZoom:false}
          enableRotate={true}
          minPolarAngle={activeCamera === "default" ?minPolarAngle : Math.PI/6} // Limit looking up/down
          maxPolarAngle={activeCamera === "default" ?maxPolarAngle : Math.PI}
          minDistance={activeCamera === "default" ?minDistance:-20} // Minimum zoom distance
          maxDistance={activeCamera === "default" ?maxDistance:20} // Maximum zoom distance
        ></OrbitControls>        
        <hemisphereLight
          skyColor={0xffffff} // Color of the light from the sky (top hemisphere)
          groundColor={0x000000} // Color of the light from the ground (bottom hemisphere)
          intensity={0.5}
          rotation={[0, 0, 0]}
          position={[0, 5, -5]} // Light intensity
        />
      </Canvas>
      {/* {activeCamera === "interior" && (
        <button
          style={{ position: "absolute", top: 20, right: 20 }}
          onClick={switchToDefaultView}
        >
          Switch to Exterior
        </button>
      )} */}
      <SidePanel id={selectedSpriteId} show={spriteClicked} heading={'test'} description ={'testkndsknfnfdnkjfkjd'} imgsrc={''} onClose={handleClosePanel} />
      {modelLoaded && !spriteClicked && !hideOthers && (
        <div
          className={
            showColors ? "color-picker-container" : "color-picker-container-new"
          }
        >
          <div className="color-options-opened">
            {showColors && (
              <div className="color-options">
                {colors.map((color) => (
                  <div key={color.id} className="tooltip">
                    <div
                      className={`color-circle ${
                        selColor === color.id ? "selected" : ""
                      }`}
                      style={{ backgroundColor: color.hex }}
                      onClick={() => handleColorChange(color.hex, color.id)}
                    >
                      {/* Add the image inside the color circle if needed */}
                      <img
                        src={color.path}
                        alt={color.id}
                        className="color-image"
                        style={{
                          display: "block",
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    </div>
                    <span className="tooltiptext">{color.id}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="brush-icon" onClick={handleBrushClick}>
            <img
              src="/bottom-img6.png"
              alt="Brush"
              style={{ width: "60px", cursor: "pointer" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
