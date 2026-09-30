import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Hero3DSceneProps {
  isLoading?: boolean;
  score?: number | null;
  className?: string;
  interactive?: boolean;
}

export const Hero3DScene: React.FC<Hero3DSceneProps> = ({
  isLoading = false,
  score = null,
  className = "h-[190px] w-full",
  interactive = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const width = container.clientWidth || 280;
    const height = container.clientHeight || 180;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5.2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    // Group for mouse interaction and animation
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // Color computation based on state & score
    let baseColor = 0x4f46e5; // Indigo default
    let wireColor = 0x818cf8;

    if (isLoading) {
      baseColor = 0x6366f1;
      wireColor = 0xa5b4fc;
    } else if (score !== null) {
      if (score >= 75) {
        baseColor = 0x059669; // Emerald
        wireColor = 0x34d399;
      } else if (score >= 40) {
        baseColor = 0xd97706; // Amber
        wireColor = 0xfbbf24;
      } else {
        baseColor = 0xe11d48; // Crimson / Rose
        wireColor = 0xf43f5e;
      }
    }

    // Outer Wireframe Cage (Icosahedron)
    const cageGeometry = new THREE.IcosahedronGeometry(1.5, 1);
    const cageMaterial = new THREE.MeshStandardMaterial({
      color: wireColor,
      wireframe: true,
      roughness: 0.2,
      metalness: 0.8
    });
    const cageMesh = new THREE.Mesh(cageGeometry, cageMaterial);
    masterGroup.add(cageMesh);

    // Inner Solid Core (Dodecahedron with faceted shading)
    const coreGeometry = new THREE.DodecahedronGeometry(0.95, 0);
    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: baseColor,
      roughness: 0.15,
      metalness: 0.25,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
      flatShading: true
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    masterGroup.add(coreMesh);

    // Orbiting 3D Ring 1
    const ring1Geo = new THREE.TorusGeometry(1.95, 0.03, 16, 48);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.9,
      roughness: 0.1
    });
    const ring1 = new THREE.Mesh(ring1Geo, ringMat);
    ring1.rotation.x = Math.PI / 3;
    masterGroup.add(ring1);

    // Orbiting 3D Ring 2
    const ring2Geo = new THREE.TorusGeometry(2.15, 0.025, 16, 48);
    const ring2 = new THREE.Mesh(ring2Geo, ringMat);
    ring2.rotation.y = Math.PI / 4;
    masterGroup.add(ring2);

    // Floating particles
    const particleCount = 20;
    const particleGeo = new THREE.SphereGeometry(0.035, 6, 6);
    const particleMat = new THREE.MeshBasicMaterial({ color: wireColor });
    const particleGroup = new THREE.Group();

    for (let i = 0; i < particleCount; i++) {
      const pMesh = new THREE.Mesh(particleGeo, particleMat);
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 2.2 + (Math.random() - 0.5) * 0.6;
      pMesh.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 1.5,
        Math.sin(angle) * radius
      );
      particleGroup.add(pMesh);
    }
    masterGroup.add(particleGroup);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight1.position.set(5, 8, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(baseColor, 1.8);
    dirLight2.position.set(-5, -5, -2);
    scene.add(dirLight2);

    // Mouse Interaction handling
    let targetRotationX = 0;
    let targetRotationY = 0;
    let isMouseDown = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      if (isMouseDown) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        targetRotationY += deltaX * 0.012;
        targetRotationX += deltaY * 0.012;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      } else {
        targetRotationY = x * 0.5;
        targetRotationX = -y * 0.5;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      isMouseDown = true;
      setIsInteracting(true);
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseUp = () => {
      isMouseDown = false;
      setIsInteracting(false);
    };

    if (interactive) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mouseup', handleMouseUp);
    }

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera/object tilt towards target
      masterGroup.rotation.y += (targetRotationY - masterGroup.rotation.y) * 0.08;
      masterGroup.rotation.x += (targetRotationX - masterGroup.rotation.x) * 0.08;

      // Base rotation speeds
      const speedMultiplier = isLoading ? 3.5 : 1.0;
      cageMesh.rotation.y += 0.007 * speedMultiplier;
      cageMesh.rotation.x -= 0.003 * speedMultiplier;

      coreMesh.rotation.y -= 0.01 * speedMultiplier;
      coreMesh.rotation.z += 0.005 * speedMultiplier;

      ring1.rotation.z += 0.008 * speedMultiplier;
      ring2.rotation.x += 0.006 * speedMultiplier;
      particleGroup.rotation.y += 0.003 * speedMultiplier;

      // Gentle floating breathing animation
      masterGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.08;

      // Pulse core scale if loading
      if (isLoading) {
        const pulse = 1.0 + Math.sin(elapsedTime * 8) * 0.08;
        coreMesh.scale.set(pulse, pulse, pulse);
      } else {
        coreMesh.scale.set(1, 1, 1);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Observer
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      if (newWidth === 0 || newHeight === 0) return;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (interactive) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mouseup', handleMouseUp);
      }
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      cageGeometry.dispose();
      cageMaterial.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      ring1Geo.dispose();
      ring2Geo.dispose();
      ringMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, [isLoading, score, interactive]);

  return (
    <div className={`relative flex items-center justify-center select-none ${interactive ? 'cursor-grab active:cursor-grabbing' : ''} ${className}`}>
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="w-full h-full" style={{ touchAction: 'pan-y' }} />

      {/* 3D Status HUD Badge */}
      <div className="absolute top-2 left-2 pointer-events-none">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 bg-white/95 px-2 py-0.5 rounded-md border-2 border-slate-900 shadow-[1px_1px_0px_#0f172a] flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-indigo-600 animate-ping' : score !== null && score >= 75 ? 'bg-emerald-500' : score !== null && score >= 40 ? 'bg-amber-500' : score !== null ? 'bg-rose-500' : 'bg-indigo-600'}`} />
          {isLoading ? 'Simulating' : score !== null ? `Score: ${score}` : '3D Reality Core'}
        </span>
      </div>

      {interactive && (
        <div className="absolute bottom-2 right-2 pointer-events-none hidden sm:block">
          <span className="text-[9px] font-bold text-slate-500 bg-white/90 px-1.5 py-0.5 rounded border border-slate-300 shadow-xs">
            {isInteracting ? 'Rotating 3D' : 'Drag to Rotate'}
          </span>
        </div>
      )}
    </div>
  );
};
