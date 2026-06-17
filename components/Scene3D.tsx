'use client';

import { useRef, useMemo, useState, useEffect, lazy, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Sphere, Ring } from '@react-three/drei';
import * as THREE from 'three';

// 检测是否为移动设备
const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
};

// 检测是否支持WebGL
const supportsWebGL = () => {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
};

// 创建二维定位图标纹理
function createLocationIcon(emoji: string, name: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  
  // 清空画布
  ctx.clearRect(0, 0, 512, 512);
  
  // 计算位置
  const centerX = 256;
  const centerY = 256;
  
  // 使用浅紫色
  const iconColor = '#D1C4E9';
  
  // 绘制底部的定位指针（浅紫色）
  ctx.beginPath();
  ctx.moveTo(centerX, centerY + 180);
  ctx.lineTo(centerX - 35, centerY + 100);
  ctx.lineTo(centerX, centerY + 85);
  ctx.lineTo(centerX + 35, centerY + 100);
  ctx.closePath();
  ctx.fillStyle = iconColor;
  ctx.fill();
  
  // 绘制外圈圆环
  ctx.beginPath();
  ctx.arc(centerX, centerY + 30, 90, 0, Math.PI * 2);
  ctx.strokeStyle = iconColor;
  ctx.lineWidth = 14;
  ctx.stroke();
  
  // 绘制内圈白色圆
  ctx.beginPath();
  ctx.arc(centerX, centerY + 30, 65, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  
  // 绘制头像背景圆（深紫色）
  ctx.beginPath();
  ctx.arc(centerX, centerY + 30, 50, 0, Math.PI * 2);
  ctx.fillStyle = '#4c1d95';
  ctx.fill();
  
  // 绘制emoji头像
  ctx.font = 'bold 55px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, centerX, centerY + 30);
  
  // 绘制昵称背景
  ctx.beginPath();
  ctx.roundRect(centerX - 75, centerY + 115, 150, 45, 22);
  ctx.fillStyle = 'rgba(76, 29, 149, 0.95)';
  ctx.fill();
  
  // 绘制昵称文字
  ctx.font = 'bold 22px sans-serif';
  ctx.fillStyle = '#D1C4E9';
  ctx.fillText(name.length > 6 ? name.slice(0, 6) + '...' : name, centerX, centerY + 142);
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

import type { Character } from '../lib/types';

interface LocationMarkerProps {
  character: Character;
  position: [number, number, number];
  onClick?: () => void;
  onDoubleClick?: () => void;
  onHoverChange?: (character: Character | null) => void;
}

function LocationMarker({ character, position, onClick, onDoubleClick, onHoverChange }: LocationMarkerProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [lastClickTime, setLastClickTime] = useState(0);
  
  const iconTexture = useMemo(() => {
    return createLocationIcon(character.emoji, character.name);
  }, [character.emoji, character.name]);
  
  // 始终面向相机
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.lookAt(state.camera.position);
    }
  });
  
  const handleClick = () => {
    const currentTime = Date.now();
    const timeSinceLastClick = currentTime - lastClickTime;
    
    if (timeSinceLastClick < 300) {
      onDoubleClick?.();
    } else {
      onClick?.();
    }
    setLastClickTime(currentTime);
  };
  
  const handlePointerOver = () => {
    setIsHovered(true);
    onHoverChange?.(character);
  };
  
  const handlePointerOut = () => {
    setIsHovered(false);
    onHoverChange?.(null);
  };
  
  return (
    <mesh 
      ref={meshRef}
      position={position}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <planeGeometry args={[1.2, 1.8]} />
      <meshStandardMaterial
        map={iconTexture}
        transparent
        opacity={1}
        side={THREE.DoubleSide}
        emissive="#D1C4E9"
        emissiveIntensity={isHovered ? 0.4 : 0.15}
      />
    </mesh>
  );
}

// 土星组件
interface SaturnProps {
  characters?: Array<Character & { color?: string }>;
  onCharacterClick?: (id: string) => void;
  onCharacterDoubleClick?: (id: string) => void;
  onCharacterHover?: (character: Character | null) => void;
}

function Saturn({ characters = [], onCharacterClick, onCharacterDoubleClick, onCharacterHover }: SaturnProps) {
  const saturnRef = useRef<THREE.Mesh>(null);

  // 土星自转动画
  useFrame((state) => {
    if (saturnRef.current) {
      saturnRef.current.rotation.y += 0.002;
    }
  });

  // 土星表面纹理
  const saturnMaterial = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    // 创建渐变背景
    const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
    gradient.addColorStop(0, '#d8b4fe');
    gradient.addColorStop(0.3, '#a855f7');
    gradient.addColorStop(0.6, '#8b5cf6');
    gradient.addColorStop(1, '#4c1d95');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);
    
    // 添加柔和的紫色云层效果（使用模糊渐变，避免边缘突兀）
    for (let i = 0; i < 8; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const radius = Math.random() * 80 + 40;
      
      const cloudGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      cloudGradient.addColorStop(0, `rgba(216, 180, 254, ${Math.random() * 0.15 + 0.05})`);
      cloudGradient.addColorStop(0.5, `rgba(168, 85, 247, ${Math.random() * 0.1 + 0.05})`);
      cloudGradient.addColorStop(1, 'rgba(76, 29, 149, 0)');
      
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = cloudGradient;
      ctx.fill();
    }
    
    // 添加多层叠加的柔和渐变，让颜色过渡更自然
    for (let i = 0; i < 5; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const radius = Math.random() * 100 + 50;
      
      const softGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      softGradient.addColorStop(0, `rgba(196, 181, 253, ${Math.random() * 0.1 + 0.03})`);
      softGradient.addColorStop(1, 'rgba(76, 29, 149, 0)');
      
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = softGradient;
      ctx.fill();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    return new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.8,
      metalness: 0.2,
      emissive: '#4c1d95',
      emissiveIntensity: 0.1,
    });
  }, []);
  
  // 计算角色在星球表面的位置（上半球）
  const characterPositions = useMemo(() => {
    if (characters.length === 0) return [];
    
    const radius = 1.8;
    
    return characters.map((char, index) => {
      // 只在上半球分布 (phi 范围: 0 到 PI/2)
      const phi = Math.acos(1 - (index + 0.5) / characters.length);
      const theta = (index / characters.length) * 2 * Math.PI;
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);
      
      return { ...char, position: [x, y, z] as [number, number, number] };
    });
  }, [characters]);

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={1}>
      <group position={[0, -0.8, 0]}>
        {/* 土星本体 */}
        <Sphere ref={saturnRef} args={[1.5, 64, 64]}>
          <primitive object={saturnMaterial} attach="material" />
        </Sphere>
        
        {/* 土星光晕 */}
        <mesh>
          <sphereGeometry args={[1.6, 32, 32]} />
          <meshBasicMaterial
            color="#a855f7"
            transparent
            opacity={0.15}
            side={THREE.BackSide}
          />
        </mesh>
        
        {/* 内层星环 */}
        <Ring args={[1.8, 2.8, 64]} rotation={[Math.PI / 2.1, 0, 0]}>
          <meshStandardMaterial
            color="#a855f7"
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </Ring>
        
        {/* 角色定位标记（跟随土星旋转） */}
        {characterPositions.map((char) => (
          <LocationMarker
            key={char.id}
            character={char}
            position={char.position}
            onClick={() => onCharacterClick?.(char.id)}
            onDoubleClick={() => onCharacterDoubleClick?.(char.id)}
            onHoverChange={onCharacterHover}
          />
        ))}
        
        {/* 最内层星环 */}
        <Ring args={[1.65, 2.2, 64]} rotation={[Math.PI / 2.3, 0, 0]}>
          <meshStandardMaterial
            color="#c4b5fd"
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
          />
        </Ring>
      </group>
    </Float>
  );
}

// 星轨线组件
function OrbitLine() {
  const curve = useMemo(() => {
    return new THREE.EllipseCurve(
      0, 0,            // 中心
      6, 4,            // 半径
      0, 2 * Math.PI,  // 角度范围
      false,           // 顺时针
      0                // 起始偏移
    );
  }, []);

  const points = useMemo(() => {
    return curve.getPoints(100);
  }, [curve]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(
      points.map(p => new THREE.Vector3(p.x, p.y * 0.3 - 0.8, p.y))
    );
    return geo;
  }, [points]);

  return (
    <line>
      <primitive object={geometry} attach="geometry" />
      <lineBasicMaterial color="#a855f7" transparent opacity={0.3} linewidth={2} />
    </line>
  );
}

// 主场景组件
interface Scene3DProps {
  characters?: Array<Character & { color: string }>;
  onCharacterClick?: (id: string) => void;
  onCharacterDoubleClick?: (id: string) => void;
  onCharacterHover?: (character: Character | null) => void;
}

// 3D场景加载器组件
function SceneLoader() {
  return (
    <div className="flex items-center justify-center h-full">
      <motion.div
        className="text-cosmic-purple"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      >
        <span className="text-5xl">🪐</span>
      </motion.div>
    </div>
  );
}

// 错误边界组件
function SceneError({ error }: { error: Error }) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <p className="text-gray-400">3D场景加载失败</p>
        <p className="text-gray-500 text-sm mt-2">{error.message}</p>
      </div>
    </div>
  );
}

export default function Scene3D({ characters = [], onCharacterClick, onCharacterDoubleClick, onCharacterHover }: Scene3DProps) {
  const [mobile, setMobile] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);
  const [sceneLoaded, setSceneLoaded] = useState(false);
  
  useEffect(() => {
    // 检测设备类型
    setMobile(isMobile());
    
    // 检测WebGL支持
    if (!supportsWebGL()) {
      setWebglSupported(false);
      return;
    }

    const handleResize = () => {
      setMobile(isMobile());
    };
    
    window.addEventListener('resize', handleResize);
    
    // 模拟场景加载
    const timer = setTimeout(() => {
      setSceneLoaded(true);
    }, 500);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  // 如果不支持WebGL，显示错误信息
  if (!webglSupported) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-6xl mb-4">🔧</div>
          <p className="text-gray-400">您的浏览器不支持3D场景</p>
          <p className="text-gray-500 text-sm mt-2">请尝试使用现代浏览器访问</p>
        </div>
      </div>
    );
  }

  // 如果场景还未加载完成，显示加载器
  if (!sceneLoaded) {
    return <SceneLoader />;
  }

  return (
    <Canvas
      camera={{ position: mobile ? [0, 4, 10] : [0, 3, 8], fov: mobile ? 45 : 50 }}
      style={{ background: 'transparent' }}
      dpr={mobile ? 1 : Math.min(window.devicePixelRatio, 2)}
      gl={{ 
        antialias: !mobile,
        alpha: true,
        powerPreference: 'high-performance'
      }}
    >
      {/* 环境光 */}
      <ambientLight intensity={0.3} />
      
      {/* 主光源 */}
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      {/* 补光 */}
      <pointLight position={[-10, -5, -10]} intensity={0.5} color="#a855f7" />
      
      {/* 底部反光 */}
      <pointLight position={[0, -5, 0]} intensity={0.3} color="#6366f1" />
      
      {/* 背景星空 - 移动端减少数量 */}
      <Stars
        radius={100}
        depth={50}
        count={mobile ? 300 : 2000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />
      
      {/* 星轨线 */}
      <OrbitLine />
      
      {/* 土星（包含角色定位标记） */}
      <Saturn 
        characters={characters}
        onCharacterClick={onCharacterClick}
        onCharacterDoubleClick={onCharacterDoubleClick}
        onCharacterHover={onCharacterHover}
      />
      
      {/* 轨道控制器（允许旋转查看） */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={mobile ? 6 : 5}
        maxDistance={mobile ? 18 : 15}
        autoRotate={true}
        autoRotateSpeed={mobile ? 0.3 : 0.5}
        enableDamping
        dampingFactor={0.05}
        touches={{
          ONE: true, // 单指旋转
          TWO: false // 禁用双指缩放，改用滚轮
        }}
      />
    </Canvas>
  );
}
