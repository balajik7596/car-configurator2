import React from "react";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import * as THREE from "three";

const Image360Sphere = ({ imageUrl }) => {
  const texture = useLoader(TextureLoader, imageUrl);

  return (
    <mesh>
      {/* A sphere geometry with an inverted scale for 360° view */}
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
};

export default Image360Sphere;
