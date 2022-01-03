import React, { useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import {
  FirstPersonControls,
  Stats,
  Text,
  Line,
  Plane,
} from "@react-three/drei";
import { TextureLoader } from "three/src/loaders/TextureLoader";

import artData from "./artData.json";

const Texture = ({ texture, position, text, size }) => {
  return (
    <Plane castShadow position={position} args={[size.width, size.height]}>
      <boxGeometry args={[size.width, size.height, 0.01]} />
      <meshStandardMaterial attach="material" map={texture} />
      <Line
        points={[
          [size.width / 2 - 0.3, 0, -0.01],
          [size.width / 2 - 0.3, 50, -0.01],
        ]}
        color={"gray"}
        lineWidth={0.4}
      />
      <Line
        points={[
          [size.width / -2 + 0.3, 0, -0.01],
          [size.width / -2 + 0.3, 50, -0.01],
        ]}
        color={"gray"}
        lineWidth={0.4}
      />
      <Text
        color="black"
        anchorX="left"
        anchorY="top"
        position={[size.width / -2, size.height / -2, 0]}
      >
        {text.artist} "{text.name}"
      </Text>
    </Plane>
  );
};
const Image = ({ url, text, position }) => {
  const texture = useLoader(TextureLoader, url);
  return (
    <Texture
      texture={texture}
      position={position}
      text={text}
      size={{
        width: texture.image.width / 300,
        height: texture.image.height / 300,
      }}
    />
  );
};

const Art = () => {
  return (
    <>
      {artData.map((art, i) => {
        return (
          <Image
            key={i}
            url={art.fileName}
            text={art.text}
            position={[i * 5, 0.5, 0]}
          />
        );
      })}
    </>
  );
};

function Box(props) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef();
  // Hold state for hovered and clicked events
  const [hovered, setHover] = useState(false);
  const [clicked, setClick] = useState(false);
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => (ref.current.rotation.x += 0.01), []);

  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => setClick(!clicked)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
}

export default function App() {
  return (
    <Canvas shadows colorManagement>
      <FirstPersonControls
        activeLook={true}
        lookVertical={false}
        lookSpeed={0.1}
        movementSpeed={3}
      />

      {/*
      <spotLight castShadow position={[10, 10, 10]} angle={0.15} penumbra={1} />
       */}
      <group>
        <fog attach="fog" args={["red", 0, 30]} />
        <ambientLight intensity={0.1} />
        <directionalLight
          intensity={0.5}
          castShadow
          shadow-mapSize-height={512}
          shadow-mapSize-width={512}
          position={[2, 2, 3]}
        />

        <Art />

        <Plane
          receiveShadow
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -3, 0]}
          args={[1000, 1000]}
        >
          <meshStandardMaterial attach="material" color="white" />
        </Plane>
      </group>

      <Stats showPanel={0} />
    </Canvas>
  );
}
