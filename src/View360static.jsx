import React, { useRef, useEffect } from "react";
import "./App.css";
import * as THREE from 'three';
import CameraControls from "camera-controls";
import Image1 from "./assets/Classroom1.jpg"; // Adjust the path based on your project structure
CameraControls.install({ THREE: THREE });

function App() {
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const meshRef = useRef(null);
  const clockRef = useRef(null);

  useEffect(() => {
    const initThree = () => {
      const renderer = new THREE.WebGLRenderer();
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);

      const scene = new THREE.Scene(); //scene
      const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000000);


      const controls = new CameraControls(camera, renderer.domElement);
      controls.setPosition(camera.position.x + 0.1, camera.position.y, camera.position.z);
      document.getElementById('webglviewer').appendChild(renderer.domElement);

      rendererRef.current = renderer;
      sceneRef.current = scene;
      cameraRef.current = camera;
      controlsRef.current = controls;

      animate();
      createMeshWithMaterial(); // Call the function to create the mesh with material
    };

    const clock = new THREE.Clock();  //camera-controls function dependency, otherwise, glitched
    clockRef.current = clock;

    const animate = () => {
      if (controlsRef.current) {
        requestAnimationFrame(animate);
        controlsRef.current.azimuthRotateSpeed = 0.1;  //horizontal
        controlsRef.current.polarRotateSpeed = 0.1;   //verticle
        controlsRef.current.minZoom = 0.8;
        controlsRef.current.maxZoom = 1.0;
        controlsRef.current.update(clock.getDelta());  

        if (rendererRef.current && sceneRef.current && cameraRef.current) {
          rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
      }
    };

    initThree();

    return () => {
      if (rendererRef.current) {
        rendererRef.current.dispose(); //RELEASE RESOURCES
      }
      if (sceneRef.current) {
        sceneRef.current.dispose();
      }
      if (cameraRef.current) {
        cameraRef.current.dispose();
      }
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
    };
  }, []); // Empty dependency array ensures this effect runs once on mount

  useEffect(() => {
    controlsRef.current.update(clockRef.current.getDelta());
  }, [])

  const createMeshWithMaterial = () => {
    const texturePath = Image1;
    const loader = new THREE.TextureLoader();

    loader.load(texturePath, function (texture) {
      if (meshRef.current) {
        sceneRef.current.remove(meshRef.current);
      }

      // Set texture filtering options
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;

      const material = new THREE.MeshBasicMaterial({
        map: texture,
      });

      // Increase the resolution of the sphere geometry
      const geometry = new THREE.SphereGeometry(3.2, 82, 82);
      geometry.scale(-1, 1, 1);  //imageshow 

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(cameraRef.current.position);
      sceneRef.current.add(mesh);

      meshRef.current = mesh;
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    });
  };

  return (
    <>
      <div id="webglviewer" style={{ width: '100%', height: "100vh", zIndex:1 }} />
    </>
  );
}

export default App;
