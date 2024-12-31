import React, { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import {
  Environment,
  OrbitControls,
  useGLTF,
  useTexture,
  useProgress,
} from "@react-three/drei";
import { DirectionalLightHelper, ACESFilmicToneMapping } from "three"; // Import from 'three'
import * as THREE from "three";
import "./app.css";
// import { useLoader } from "@react-three/fiber";
// import { RGBELoader } from "three-stdlib";
function CarModel({ color, lightsOn, selColor, onLoad }) {
  // const hdrEquirect = useLoader(RGBELoader, '/studio_small.hdr');
  const ambientLightRef = useRef();

  const { scene } = useGLTF("/main-car.glb");
  useEffect(() => {
    if (onLoad) onLoad();
  }, [onLoad]);

  // Define the roof meshes to exclude for specific colors
  const roofMeshes = ["Retopo_shell_0017", "Retopo_shell_0021", "Roof"];

  scene.traverse((child) => {
    if (child.isMesh) {
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
      if (child.name === "Top-SIDE-SILVER") {
        child.material.roughness = 0.12;
      }
      if (
        child.material.name === "M_A2Boxox_Default_Lacquer_AbyssBlackPea.011"
      ) {
        child.material.roughness = 0.22;
        child.material.metalness = 0.6;
      }

      if (
        child.name === "Top-SIDE-SILVER" &&
        !selColor.includes("black roof")
      ) {
        child.material.color.set("#8F8F8F");
      }
      if (child.name === "Top-SIDE-SILVER" && selColor.includes("black roof")) {
        child.material.color.set("#1A1B23");
      }
      if (
        child.name === "Top-SIDE-SILVER" &&
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
        console.log(child.material.name);
      }
      if (child.material.name === "CAR_PAINT_BODY-white") {
        if (selColor.includes("Ocean Blue")) {
          child.material.color.set(color);
          child.material.emissive.setHex("#000000");
          child.material.emissiveIntensity = 1;
          child.material.IOR = 1.0;
          child.material.reflectivity = 0.5;
        } else if (selColor === "Starry Night") {
          child.material.color.set(color);
          child.material.emissive.setHex("#678908"); // Set emissive color to red
          child.material.emissiveIntensity = 3; // Increase the intensity
          child.material.IOR = 1.8;
          child.material.reflectivity = 0.71;
        } else if (selColor === "Robust Emerald Matte") {
          child.material.color.set(color);
          child.material.emissive.setHex("#001404"); // Set emissive color to red
          child.material.emissiveIntensity = 1.2; // Increase the intensity
          child.material.roughness = 0.2;
          child.material.IOR = 1.8;
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
          if(selColor.includes("Atlas White") || selColor === "Fiery Red Pearl" || selColor === "Starry Night") {
            ambientLightRef.current.intensity = 3;
          }else{
            ambientLightRef.current.intensity = 2;
          }
        } 

        if (selColor.includes("Matte")) child.material.roughness = 0.2;
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

function SkyDome() {
  const { scene } = useGLTF("/skydome.glb"); // Replace with the path to your GLB file
  return (
    <group rotation={[0, (3 * Math.PI) / 2, 0]}>
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
  const carRef = useRef();
  const handleModelLoad = () => setModelLoaded(true);
  const { active, progress } = useProgress(); // Use progress from drei
  const [maxDistance, setMaxDistance] = useState(8); // Default maxDistance
  const [currentBox, setCurrentBox] = useState(0);
  
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
      hex: "#3F4B3F",
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
      {modelLoaded && (
        <div className="bottom-banner-container">
          <div className="bottom-banner">
            <div className="banner-image">
              <img src="/Functions.png" alt="Functions Banner" />
            </div>
            <div className="button-list">
              <button className="function-button" onClick={handleLightChange}>
                <img src="/Light Indicator.png" alt="Icon 1" />
              </button>
              {/* <button className="function-button">
            <img src="/path-to-icon2.png" alt="Icon 2" />
          </button>
          <button className="function-button">
            <img src="/path-to-icon3.png" alt="Icon 3" />
          </button>
          <button className="function-button">
            <img src="/path-to-icon4.png" alt="Icon 4" />
          </button>
          <button className="function-button">
            <img src="/path-to-icon5.png" alt="Icon 5" />
          </button> */}
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
      {/* Loading Bar */}
      {/* {!modelLoaded && (
        <div className="loading-bar-container">
          <div
            className="loading-bar"
            style={{ width: `${progress}%` }} // Update width based on progress
          ></div>
        </div>
      )} */}
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
        camera={{ position: [-5, 3, -8], fov: 50 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
          // toneMapping: ACESFilmicToneMapping ,
        }}
        // onCreated={({ gl, camera }) => {
        //   gl.physicallyCorrectLights = true;
        //   gl.outputEncoding = THREE.SRGBColorSpace;

        // }}
      >
        {/* <Perf /> */}
        <Suspense fallback={null}>
          {/* Load HDR Environment */}
          <RotatingEnvironment path="/studio_small.hdr" rotationValue={180} />
          {/* Add the 3D Model */}
          <CarModel
            ref={carRef}
            color={carColor}
            selColor={selColor}
            onLoad={handleModelLoad}
            lightsOn={lightsOn}
          />
          <SkyDome />
          <CarShadow />
        </Suspense>
        {/* Add Camera Controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minPolarAngle={Math.PI / 5} // Limit looking up/down
          maxPolarAngle={Math.PI / 2.3}
          minDistance={5} // Minimum zoom distance
          maxDistance={maxDistance} // Maximum zoom distance
        ></OrbitControls>
        {/* <pointLight position={[20, 0, 2]} intensity={300}></pointLight>
        <pointLight position={[-20, 0, 2]} intensity={300}></pointLight>
        <pointLight position={[0, 5, -5]} intensity={300}></pointLight>
        <pointLight position={[0, 5, 5]} intensity={300}></pointLight> */}
        <hemisphereLight
          skyColor={0xffffff} // Color of the light from the sky (top hemisphere)
          groundColor={0x000000} // Color of the light from the ground (bottom hemisphere)
          intensity={0.5}
          rotation={[0, 0, 0]}
          position={[0, 5, -5]} // Light intensity
        />
        {/* <hemisphereLight
          skyColor={0x005075} // Color of the light from the sky (top hemisphere)
          groundColor={0x000000} // Color of the light from the ground (bottom hemisphere)
          intensity={0.5}
          rotation={[0,0,0]}
          position={[0,5,-12]} // Light intensity
        /> */}
        {/* Directional Light with Shadow Settings */}
        {/* <directionalLight
          // ref={lightRef} // Attach the reference to the light
          position={[5, 14.2, -7]}
          target={carRef.current}
          intensity={1}
        />
        <directionalLight
          // ref={lightRef} // Attach the reference to the light
          position={[0, 3, 10]}
          target={carRef.current}
          intensity={1}
        />
        //right left
        <directionalLight
          // ref={lightRef} // Attach the reference to the light
          position={[5, 5, 0]}
          target={carRef.current}
          intensity={0.8}
        />
        <directionalLight
          // ref={lightRef} // Attach the reference to the light
          position={[-5, 5, 0]}
          target={carRef.current}
          intensity={4}
        /> */}
      </Canvas>
      {modelLoaded && (
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
