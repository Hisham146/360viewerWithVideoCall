import React, { useRef, useState, useEffect } from "react";
import "./App.css";
import * as THREE from 'three';
import CameraControls from "camera-controls";
import Image1 from './assets/Classroom1.jpg'
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
CameraControls.install({ THREE: THREE });

function App() {
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const meshRef = useRef(null);
  const zoomRef = useRef(0);
  const clockRef = useRef(null);

  // Set the initial image to the default image
  const initialImage = Image1;

  useEffect(() => {
    const initThree = () => {
      const renderer = new THREE.WebGLRenderer();
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);

      const scene = new THREE.Scene();

      const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000000);
      const controls = new CameraControls(camera, renderer.domElement);
      controls.setPosition(camera.position.x + 0.1, camera.position.y, camera.position.z);
      document.getElementById('webglviewer').appendChild(renderer.domElement);

      rendererRef.current = renderer;
      sceneRef.current = scene;
      cameraRef.current = camera;
      controlsRef.current = controls;

      // Use the initialImage by default
      createMeshWithMaterial(initialImage);

      animate();
    };

    const clock = new THREE.Clock();
    clockRef.current = clock;

    const animate = () => {
      if (controlsRef.current) {
        requestAnimationFrame(animate);
        controlsRef.current.azimuthRotateSpeed = 0.1;
        controlsRef.current.polarRotateSpeed = 0.1;
        const zoomStep = zoomRef.current;
        controlsRef.current.minZoom = 0.8;
        controlsRef.current.maxZoom = 1.3
        controlsRef.current.zoom(zoomStep, false);

        controlsRef.current.update(clock.getDelta());

        if (rendererRef.current && sceneRef.current && cameraRef.current) {
          rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
      }
    };

    initThree();

    return () => {
      if (rendererRef.current) {
        rendererRef.current.dispose();
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

  const createMeshWithMaterial = (texturePath) => {
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
      const geometry = new THREE.SphereGeometry(3.5, 94, 94);
      geometry.scale(-1, 1, 1);

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(cameraRef.current.position);
      sceneRef.current.add(mesh);

      meshRef.current = mesh;
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    });
  };

  function handleFileChange() {
    const fileInput = document.getElementById("select-file-input");
    const tempselectedFile = fileInput.files[0];

    if (tempselectedFile) {
      const img = new Image();
      img.src = URL.createObjectURL(tempselectedFile);

      img.onload = function () {
        const width = img.width;
        const height = img.height;

        // Adjust the threshold as needed for what you consider a panoramic image
        const panoramicThreshold = 1.73;

        if (width > height) {
          if (width / height > panoramicThreshold) {
            // Use the user-selected image
            createMeshWithMaterial(URL.createObjectURL(tempselectedFile));
          } else {
            console.log("Please choose a panoramic image");
            alert("Please choose a panoramic image.");
            fileInput.value = "";
          }
        } else {
          console.log("Please choose a panoramic image");
          alert("Please choose a panoramic image.");
          fileInput.value = "";
        }
      };
    }
  }

  return (
    <>
      <div style={{ position: 'absolute', right: 10, bottom: 10, padding: '20px', display: 'flex', flexDirection: "column" }}>
        <input
          type="file"
          accept="image/png, image/gif, image/jpeg, image/jpg"
          id="select-file-input"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <label htmlFor="select-file-input">
          <Button
            variant="outlined"
            component="span"
            startIcon={<CloudUploadIcon />}
            style={{ color: "Blue" }}
          >
            Change 360 Cover
          </Button>
        </label>
      </div>

      <div id="webglviewer" style={{ width: '100%', height: "100vh", zIndex: 1 }} />
    </>
  );
}

export default App;
