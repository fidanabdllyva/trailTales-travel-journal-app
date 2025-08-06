import { useEffect, useRef } from "react";
import * as THREE from "three";

const PastelParticleBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parent = mountRef.current;
    if (!parent) return;

    const width = parent.clientWidth;
    const height = parent.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#f0f8ff"); // Soft background

    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
    camera.position.z = 300;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    parent.appendChild(renderer.domElement);

    const particleCount = 100;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * width;
      positions[i + 1] = (Math.random() - 0.5) * height;
      positions[i + 2] = (Math.random() - 0.5) * 500;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const circleTexture = new THREE.TextureLoader().load(
      "https://threejs.org/examples/textures/sprites/circle.png"
    );

    const colors = ["#A8E6CF", "#D3C0F9", "#B2EBF2"]; // Pastel green, purple, turquoise
    const group = new THREE.Group();

    colors.forEach((color, index) => {
      const material = new THREE.PointsMaterial({
        color,
        size: 30,
        map: circleTexture,
        transparent: true,
        depthWrite: false,
        opacity: 0.6,
      });

      const points = new THREE.Points(geometry.clone(), material);
      points.rotation.z = (index / colors.length) * Math.PI * 2;
      group.add(points);
    });

    scene.add(group);

    const animate = () => {
      group.rotation.z += 0.0006;
      group.rotation.y += 0.0004;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      const width = parent.clientWidth;
      const height = parent.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      parent.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
      }}
    />
  );
};

export default PastelParticleBackground;
