'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass';

interface AudioVisualizerProps {
  isPlaying: boolean;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isPlaying }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    // Initialize scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Initialize camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.z = 50;
    cameraRef.current = camera;

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 5000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      // Position particles in a sphere
      const radius = 30;
      const theta = THREE.MathUtils.randFloatSpread(360);
      const phi = THREE.MathUtils.randFloatSpread(360);

      positions[i] = radius * Math.sin(theta) * Math.cos(phi);
      positions[i + 1] = radius * Math.sin(theta) * Math.sin(phi);
      positions[i + 2] = radius * Math.cos(theta);

      // Give each particle a gradient color from purple to blue
      const color = new THREE.Color();
      color.setHSL(THREE.MathUtils.randFloat(0.7, 0.8), 1, 0.5);
      colors[i] = color.r;
      colors[i + 1] = color.g;
      colors[i + 2] = color.b;
    }

    particlesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3),
    );
    particlesGeometry.setAttribute(
      'color',
      new THREE.BufferAttribute(colors, 3),
    );

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // Post processing
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85,
    );
    const outputPass = new OutputPass();

    composer.addPass(renderPass);
    composer.addPass(bloomPass);
    composer.addPass(outputPass);
    composerRef.current = composer;

    // Mouse movement handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      scene.remove(particles);
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
      composer.dispose();
    };
  }, []);

  useEffect(() => {
    if (!particlesRef.current || !composerRef.current || !cameraRef.current)
      return;

    const particles = particlesRef.current;
    const positions = particles.geometry.attributes.position;
    const initialPositions = positions.array.slice();
    let time = 0;

    const animate = () => {
      time += 0.005;

      // Update particle positions
      for (let i = 0; i < positions.count; i++) {
        const i3 = i * 3;
        const x = initialPositions[i3];
        const y = initialPositions[i3 + 1];
        const z = initialPositions[i3 + 2];

        // Add wave effect when playing
        if (isPlaying) {
          const distance = Math.sqrt(x * x + y * y + z * z);
          const amplitude = 2;
          const frequency = 0.5;
          const wave = Math.sin(distance * frequency - time * 3) * amplitude;

          positions.array[i3] = x + (wave * x) / distance;
          positions.array[i3 + 1] = y + (wave * y) / distance;
          positions.array[i3 + 2] = z + (wave * z) / distance;
        } else {
          // Gentle floating motion when not playing
          positions.array[i3] = x + Math.sin(time + i) * 0.1;
          positions.array[i3 + 1] = y + Math.cos(time + i) * 0.1;
          positions.array[i3 + 2] = z + Math.sin(time + i) * 0.1;
        }
      }
      positions.needsUpdate = true;

      // Camera movement based on mouse position
      cameraRef.current!.position.x +=
        (mouseRef.current.x * 10 - cameraRef.current!.position.x) * 0.05;
      cameraRef.current!.position.y +=
        (mouseRef.current.y * 10 - cameraRef.current!.position.y) * 0.05;
      cameraRef.current!.lookAt(0, 0, 0);

      // Rotate the entire particle system
      particles.rotation.y += 0.001;

      composerRef.current!.render();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current || !composerRef.current)
        return;

      const camera = cameraRef.current;
      const renderer = rendererRef.current;
      const composer = composerRef.current;

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      ref={containerRef}
      className='absolute inset-0 -z-10'
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default AudioVisualizer;
