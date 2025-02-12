'use client';

import { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';

const vertexShader = `
  uniform float uTime;
  uniform float uNoiseFreq;
  uniform float uNoiseAmp;
  uniform float uFresnelIntensity;
  
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vDistortion;
  varying float vFresnel;
  
  vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }
  
  vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }
  
  vec4 permute(vec4 x) {
    return mod289(((x * 34.0) + 1.0) * x);
  }
  
  vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
  }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vUv = uv;
    
    float slowNoise = snoise(position * uNoiseFreq * 0.3 + uTime * 0.2);
    float mediumNoise = snoise(position * uNoiseFreq * 1.0 + uTime * 0.5);
    float fastNoise = snoise(position * uNoiseFreq * 2.0 + uTime * 0.8);
    float noise = (slowNoise * 0.5 + mediumNoise * 0.3 + fastNoise * 0.2);
    
    vDistortion = noise;
    
    vec3 newPosition = position + normal * (noise * uNoiseAmp);
    
    float delta = 0.01;
    vec3 nearby1 = position + vec3(delta, 0.0, 0.0);
    vec3 nearby2 = position + vec3(0.0, delta, 0.0);
    
    float noise1 = snoise(nearby1 * uNoiseFreq + uTime * 0.5);
    float noise2 = snoise(nearby2 * uNoiseFreq + uTime * 0.5);
    
    vec3 distorted1 = nearby1 + normal * noise1 * uNoiseAmp;
    vec3 distorted2 = nearby2 + normal * noise2 * uNoiseAmp;
    
    vec3 computedNormal = normalize(cross(
      normalize(distorted1 - newPosition),
      normalize(distorted2 - newPosition)
    ));
    
    vNormal = normalize(normalMatrix * computedNormal);
    vPosition = (modelViewMatrix * vec4(newPosition, 1.0)).xyz;
    
    vec3 viewVector = normalize(cameraPosition - newPosition);
    vFresnel = uFresnelIntensity * (1.0 - max(0.0, dot(computedNormal, viewVector)));
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const fragmentShader = `
  #ifdef GL_ES
  precision highp float;
  #endif

  uniform float uTime;
  uniform vec3 uLightPosition;
  uniform vec3 uLightPosition2;
  uniform vec3 uBackgroundColor;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  void main() {
    vec3 viewDirection = normalize(-vPosition);
    vec3 lightPosition = normalize(uLightPosition);
    vec3 lightPosition2 = normalize(uLightPosition2);
    
    // Calculate light intensities from both directions
    float light1 = pow(max(0.0, dot(vNormal, lightPosition)), 12.0);
    float light2 = pow(max(0.0, dot(vNormal, lightPosition2)), 12.0);
    
    // Enhanced fresnel for transparency
    float fresnel = pow(1.0 - max(0.0, dot(viewDirection, vNormal)), 3.0);
    float edge = smoothstep(0.2, 1.0, fresnel);
    
    // Use the passed colors directly for highlights
    vec3 color1 = uColor1 * light1 * 2.0;
    vec3 color2 = uColor2 * light2 * 2.0;
    
    // Start with darker base color
    vec3 finalColor = mix(uColor1, uColor2, 0.5) * 0.3;
    
    // Add colored highlights
    finalColor += color1;
    finalColor += color2;
    
    // Add atmospheric glow using the passed colors
    float atmosphere = pow(1.0 - max(0.0, dot(viewDirection, vNormal)), 4.0);
    finalColor += mix(uColor1, uColor2, atmosphere) * atmosphere * 0.5;
    
    float alpha = smoothstep(0.0, 1.0, max(max(light1, light2) * 0.7, edge * 0.3));
    alpha = clamp(alpha * 0.9, 0.0, 0.95);
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

interface OrganicSphereProps {
  isPlaying?: boolean;
  imageColors?: string[];
}

export const OrganicSphereWrapper = ({
  isPlaying = false,
  imageColors = ['rgb(77, 74, 69)', 'rgb(169, 157, 145)'],
}: OrganicSphereProps) => {
  // Use colors as key to force remount when they change
  const key = imageColors.join('-');

  return (
    <OrganicSphere key={key} isPlaying={isPlaying} imageColors={imageColors} />
  );
};

export const OrganicSphere = ({
  isPlaying = false,
  imageColors = ['rgb(77, 74, 69)', 'rgb(169, 157, 145)'],
}: OrganicSphereProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const sphereRef = useRef<THREE.Mesh | null>(null);
  const targetScale = useRef(1);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // Convert RGB strings to THREE.Color objects
  const colors = useMemo(() => {
    const c1 = new THREE.Color(imageColors[0] || 'rgb(77, 74, 69)');
    const c2 = new THREE.Color(imageColors[1] || 'rgb(169, 157, 145)');
    c1.multiplyScalar(1.2);
    c2.multiplyScalar(1.2);
    const result = { color1: c1, color2: c2 };

    return result;
  }, [imageColors?.[0], imageColors?.[1]]);

  useEffect(() => {
    // Skip if no container
    if (!containerRef.current) {
      return;
    }

    // Immediate cleanup of existing instances
    if (rendererRef.current) {
      if (containerRef.current.contains(rendererRef.current.domElement)) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current.dispose();
      rendererRef.current = null;
    }

    if (materialRef.current) {
      materialRef.current.dispose();
      materialRef.current = null;
    }

    if (sphereRef.current?.geometry) {
      sphereRef.current.geometry.dispose();
    }

    // Clear the container
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }

    // Now initialize new instance
    const scene = new THREE.Scene();
    const backgroundColor = new THREE.Color(0x08020c);
    scene.background = backgroundColor;

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000,
    );
    camera.position.z = 2.4;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      stencil: false,
      depth: true,
    });
    rendererRef.current = renderer;

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight,
    );
    renderer.setClearColor(0x000000, 0);

    containerRef.current.appendChild(renderer.domElement);

    // Create a larger sphere
    const geometry = new THREE.SphereGeometry(1.2, 512, 512);
    geometry.computeVertexNormals();
    geometry.normalizeNormals();

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: true,
      uniforms: {
        uTime: { value: 0 },
        uNoiseFreq: { value: 1.4 },
        uNoiseAmp: { value: 0.15 },
        uFresnelIntensity: { value: 2.0 },
        uLightPosition: { value: new THREE.Vector3(2, 2, 2) },
        uLightPosition2: { value: new THREE.Vector3(-2, -2, 2) },
        uBackgroundColor: { value: backgroundColor },
        uColor1: { value: colors.color1.clone() },
        uColor2: { value: colors.color2.clone() },
      },
    });
    materialRef.current = material;

    const sphere = new THREE.Mesh(geometry, material);
    sphereRef.current = sphere;

    // Initial scale
    sphere.scale.set(1, 1, 1);
    targetScale.current = 1;

    // Adjust initial rotation
    sphere.rotation.x = 0.2;
    sphere.rotation.y = -0.3;

    scene.add(sphere);

    const handleMouseMove = (event: MouseEvent) => {
      mousePosition.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      };

      // Update both light positions based on mouse
      material.uniforms.uLightPosition.value.set(
        mousePosition.current.x * 4,
        mousePosition.current.y * 4,
        2,
      );
      material.uniforms.uLightPosition2.value.set(
        -mousePosition.current.x * 4,
        -mousePosition.current.y * 4,
        2,
      );
    };

    window.addEventListener('mousemove', handleMouseMove);

    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      material.uniforms.uTime.value = elapsedTime;

      // Smooth scale animation
      const currentScale = sphere.scale.x;
      const scaleDiff = targetScale.current - currentScale;
      sphere.scale.lerp(
        new THREE.Vector3(
          targetScale.current,
          targetScale.current,
          targetScale.current,
        ),
        0.05,
      );

      // Base rotation speed
      let rotationSpeed = 0.0004;
      // Increase rotation speed when playing
      if (isPlaying) {
        rotationSpeed = 0.0006;
      }

      sphere.rotation.x += rotationSpeed;
      sphere.rotation.y += rotationSpeed;

      // Base movement
      const baseMovement = 0.01;
      const mouseInfluence = isPlaying ? 0.05 : 0.04;

      sphere.position.x =
        Math.sin(elapsedTime * 0.3) * baseMovement +
        mousePosition.current.x * mouseInfluence;
      sphere.position.y =
        Math.cos(elapsedTime * 0.3) * baseMovement +
        mousePosition.current.y * mouseInfluence;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;

      camera.aspect =
        containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight,
      );
    };

    window.addEventListener('resize', handleResize);

    return () => {
      // Cleanup on unmount
      if (materialRef.current) {
        materialRef.current.dispose();
        materialRef.current = null;
      }
      if (sphereRef.current?.geometry) {
        sphereRef.current.geometry.dispose();
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (containerRef.current?.contains(rendererRef.current.domElement)) {
          containerRef.current.removeChild(rendererRef.current.domElement);
        }
        rendererRef.current = null;
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [imageColors?.[0], imageColors?.[1]]);

  // Update target scale when isPlaying changes
  useEffect(() => {
    if (!sphereRef.current) return;

    targetScale.current = isPlaying ? 1.12 : 1.0;
  }, [isPlaying]);

  return (
    <div
      ref={containerRef}
      className='absolute inset-0 z-5'
      style={{
        width: '100%',
        height: '100%',
        willChange: 'transform',
        pointerEvents: 'none',
      }}
    />
  );
};
