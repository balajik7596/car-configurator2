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

function CarModel({ color, onLoad }) {
  const { scene } = useGLTF("/main-car.glb");
  useEffect(() => {
    if (onLoad) onLoad();
  }, [onLoad]);
  // Define the meshes to apply the color to
  const colorableMeshes = [
    "shell_0763_3",
    "shell_02365",
    "shell_02277",
    "shell_02161",
    "shell_0243_4",
    "shell_02732_1",
    "shell_0267",
    "shell_02344",
    "shell_02162",
    "shell_02365",
    "shell_02277",
    // "shell_03160",
    "shell_02779_2",
    "shell_02029_1",
    "shell_02161",
    "shell_0106_14",
    "shell_0_02",
    "Retopo_shell_03312",
    // "Retopo_shell_0021",//mirroe
    // "Retopo_shell_0017",
    // "shell_02732_1",
    // "shell_02733",
    // "shell_02733_1",
    // "shell_0.3160_0",
    // "shell_0.395",
  ];

  // Define the roof meshes to exclude for specific colors
  const roofMeshes = [
    "shell_02779_2",
    "shell_03160",
    "Retopo_shell_03312",
    "shell_0106_14",
    "shell_0_02",
    // "shell_02732_1",
  ];

  const nonReflectiveMeshes = [
    "LicensePlate003",
    "LicensePlate002",
    "M_xogBPo001_Blackplane_Black",
    "LicensePlate001",
    "LicensePlate",
    "shell_03361",
    "shell_03173",
    "shell_0133_2",
    "shell_0132_6",
    "shell_02662",
  ];
  const backGlass = ["Retopo_shell_0016"];
  // Define default roof color (e.g., black)
  const defaultRoofColor = "#000000";

  scene.traverse((child) => {
    if (child.isMesh) {
      if (
        child.material.isMeshPhysicalMaterial &&
        child.material.name.includes("RedClr")
      ) {
        // Set emissive color based on the mesh's base color
        // console.log(child.material.name,child.material.color);

        child.material.emissive = new THREE.Color(1, 0, 0);
      } else if (child.material.name.includes("BLACK GLASS")) {
        // console.log(child.material.name);
        if (child.material.name === "BLACK GLASS.003")
          child.material.opacity = 0.9;
        else child.material.opacity = 0.8;
      }

      // Exclude roof meshes for specific colors
      if (
        (color === "#efefef" || color === "#bbe9ff") && // Exact hex values for the black roof colors
        roofMeshes.includes(child.name)
      ) {
        child.material.roughness = 0.4;
        child.material.reflectivity = 0;
        child.material.color.set(defaultRoofColor); // Reset to default roof color
        return; // Skip applying the new color
      }

      // Apply color to the specified meshes
      if (colorableMeshes.includes(child.name)) {
        console.log(child.material.roughness);
        if (color === "#132B27") child.material.roughness = 0.3;
        child.material.reflectivity = 0.1;
        child.material.roughness = 0.5;
        child.material.color.set(color);
      }
      if (roofMeshes.includes(child.name)) {
        //&& !(color === "#efefef" || color === "#bbe9ff")){
        child.material.roughness = 0.4;
        // child.material.reflectivity = 0;
      }
      if (nonReflectiveMeshes.includes(child.name)) {
        if (child.name.includes("LicensePlate")) {
          child.material.envMap = null;
          child.material.envMapIntensity = 0;
          child.material.lightMapIntensity = 0;
        }
        // child.material.emmisive = new THREE.Color(0,0,0);
        // // child.material.lights = false;
        // child.material.specularColor = new THREE.Color(0,0,0);
        // child.material.specularIntensity = 0;
        // child.material.emmisiveIntensity = 0;
        // child.material.reflectivity = 0;

        // child.material.roughness = 1.0;
      }
      // if (backGlass.includes(child.name)) {
      //   child.material.opacity = 0.4;
      // }
      if (child.name.includes("shell_02358")) {
        child.material.color.set("#aaaaaa");
      }
      if (child.name === "running_surface001") {
        // child.material.color.set("#3D3D3D");
      }
    }
  });
  return (
    <group
      scale={[1.2, 1.2, 1.2]}
      position={[0.3, 0.03, -1.5]}
      rotation={[0, -Math.PI / 2, 0]}
    >
      {" "}
      {/* Scale up by 20% */}
      <primitive object={scene} />
    </group>
  );
}

function SkyDome() {
  const { scene } = useGLTF("/skydome.glb"); // Replace with the path to your GLB file
  return <primitive object={scene} />;
}

function CarShadow() {
  // Load the texture (replace with your actual .webp file path)
  const texture = useTexture("/carshadow.webp"); // Replace with your actual .webp path

  return (
    <mesh
      scale={[0.8, 0.8, 0.8]}
      position={[0.32, 0, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
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
function RotatingEnvironment({ path, rotationValue = 0 }) {
  const group = useRef();

  // Apply the rotation to the group (for continuous or interactive rotation)
  useFrame(() => {
    if (group.current) {
      group.current.rotation.y = rotationValue; // Set the rotation value for the Y-axis
    }
  });

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
  const [selectedColor, setSelectedColor] = useState("#bbe9ff"); // 71b1cf
  const [showColors, setShowColors] = useState(true);
  const [carColor, setCarColor] = useState("#bbe9ff");
  const [modelLoaded, setModelLoaded] = useState(false);
  const carRef = useRef();
  const handleModelLoad = () => setModelLoaded(true);
  const { active, progress } = useProgress(); // Use progress from drei
  const [maxDistance, setMaxDistance] = useState(8); // Default maxDistance

  // const colors = [
  //   { id: "Abyss Black Pearl", hex: "#020202" },
  //   { id: "Atlas White", hex: "#f0f0f0" },
  //   { id: "Fiery Red Pearl", hex: "#782924" },//#930302
  //   { id: "Starry Night", hex: "#0C2132" },//#3a496b
  //   { id: "Frost Blue Metallic", hex: "#90aebc" },
  //   { id: "Frost Blue Matte", hex: "#88aaba" },
  //   { id: "Titan Grey Matte", hex: "#939393" },
  //   { id: "Robust Emerald Matte", hex: "#132B27" },//#172f2b
  //   { id: "Atlas White with black roof", hex: "#efefef" },
  //   { id: "Frost Blue Metallic with black roof", hex: "#bbe9ff" },
  // ];
  const colors = [
    {
      id: "Abyss Black Pearl",
      hex: "#020202",
      path: "/colors/Abyss Black Pearl.png",
    },
    { id: "Atlas White", hex: "#f0f0f0", path: "./colors/Atlas White.png" },
    {
      id: "Fiery Red Pearl",
      hex: "#782924",
      path: "./colors/Fiery Red Pearl.png",
    }, //#930302
    { id: "Starry Night", hex: "#0C2132", path: "./colors/Starry Night.png" }, //#3a496b
    {
      id: "Frost Blue Metallic",
      hex: "#90aebc",
      path: "./colors/Frost Blue Metallic.png",
    },
    {
      id: "Frost Blue Matte",
      hex: "#88aaba",
      path: "./colors/Frost Blue Matte.png",
    },
    {
      id: "Titan Grey Matte",
      hex: "#939393",
      path: "./colors/Titan Grey Matte.png",
    },
    {
      id: "Robust Emerald Matte",
      hex: "#132B27",
      path: "./colors/Robust Emeraid Matte.png",
    }, //#172f2b
    {
      id: "Atlas White with black roof",
      hex: "#efefef",
      path: "./colors/Atlas White with black roof.png",
    },
    {
      id: "Frost Blue Metallic with black roof",
      hex: "#bbe9ff",
      path: "/colors/Frost Blue Metallic with black roof.png",
    },
  ];
  const handleColorChange = (hex) => {
    setCarColor(hex);
    // setShowColors(false); // Hide color options after selecting
    setSelectedColor(hex);
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
        setMaxDistance(6); // Default value for larger screens
      }
    };

    // Call the function on initial load
    updateMaxDistance();

    // Add a resize event listener to adjust maxDistance dynamically
    window.addEventListener("resize", updateMaxDistance);

    // Cleanup the event listener on unmount
    return () => window.removeEventListener("resize", updateMaxDistance);
  }, []);

  return (
    <div className="viewer-container no-select">
      {" "}
      {/* Full-screen canvas */}
      {/* Brand Banner */}
      <div className={`brand-banner ${modelLoaded ? "move-to-top-left" : ""}`}>
        <img src="/banner.png" alt="Brand Logo" className="brand-logo" />
      </div>
      {/* Loading Bar */}
      {!modelLoaded && (
        <div className="loading-bar-container">
          <div
            className="loading-bar"
            style={{ width: `${progress}%` }} // Update width based on progress
          ></div>
        </div>
      )}
      <Canvas
        camera={{ position: [-9, 6, -15], fov: 50 }}
        gl={{
          antialias: true,
          toneMapping: THREE.CineonToneMapping,
          toneMappingExposure: 1,
          // toneMapping: ACESFilmicToneMapping ,
        }} // Enable anti-aliasing
        // Set tone mapping to ACES Filmic
      >
        {/* <Perf /> */}
        <Suspense fallback={null}>
          {/* Load HDR Environment */}
          <RotatingEnvironment path="/studio_small.hdr" rotationValue={90} />
          {/* Add the 3D Model */}
          <CarModel ref={carRef} color={carColor} onLoad={handleModelLoad} />
          <SkyDome />
          <CarShadow />
        </Suspense>
        {/* Add Camera Controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minPolarAngle={Math.PI / 4} // Limit looking up/down
          maxPolarAngle={Math.PI / 2.3}
          minDistance={4} // Minimum zoom distance
          maxDistance={maxDistance} // Maximum zoom distance
        ></OrbitControls>
        <ambientLight intensity={2} color={0xaaaaaa} />
        {/* <pointLight position={[20, 0, 2]} intensity={300}></pointLight>
        <pointLight position={[-20, 0, 2]} intensity={300}></pointLight>
        <pointLight position={[0, 5, -5]} intensity={300}></pointLight>
        <pointLight position={[0, 5, 5]} intensity={300}></pointLight> */}
        <hemisphereLight
          skyColor={0xffffff} // Color of the light from the sky (top hemisphere)
          groundColor={0x444444} // Color of the light from the ground (bottom hemisphere)
          intensity={2} // Light intensity
        />

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
                        selectedColor === color.hex ? "selected" : ""
                      }`}
                      style={{ backgroundColor: color.hex }}
                      onClick={() => handleColorChange(color.hex)}
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
