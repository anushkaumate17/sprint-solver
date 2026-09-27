import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { REAGENTS } from '../../data/labData';
import { MilkSample, Reagent } from '../../types/lab';

interface Lab3DSceneProps {
  currentSample: MilkSample;
  currentReagentsInTube: string[];
  hasMilkInTube: boolean;
  tubeFluidColor: string; // hex
  tubeFluidVolume: number; // 0 to 1
  isHeating: boolean;
  heatingProgress: number; // 0 to 100
  onSelectReagent: (reagent: Reagent) => void;
  onAddMilk: () => void;
  onHeatSample: () => void;
  onResetTube: () => void;
  showLabels: boolean;
  cameraPreset: 'overview' | 'tube' | 'reagents' | 'heater';
}

interface LabelPosition {
  id: string;
  name: string;
  subText?: string;
  x: number;
  y: number;
  visible: boolean;
  type: 'reagent' | 'milk' | 'tube' | 'heater';
  reagentData?: Reagent;
  badgeColor?: string;
}

export const Lab3DScene: React.FC<Lab3DSceneProps> = ({
  currentSample,
  currentReagentsInTube,
  hasMilkInTube,
  tubeFluidColor,
  tubeFluidVolume,
  isHeating,
  heatingProgress,
  onSelectReagent,
  onAddMilk,
  onHeatSample,
  onResetTube,
  showLabels,
  cameraPreset,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [labels, setLabels] = useState<LabelPosition[]>([]);
  const [isPipetting, setIsPipetting] = useState(false);
  const [pipetteFluidColor, setPipetteFluidColor] = useState<string>('#ffffff');

  // Three.js instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  // Mesh & animation references
  const testTubeGroupRef = useRef<THREE.Group | null>(null);
  const tubeFluidGroupRef = useRef<THREE.Group | null>(null);
  const tubeFluidMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const tubeFluidColMeshRef = useRef<THREE.Mesh | null>(null);
  const tubeFluidMeniscusRef = useRef<THREE.Mesh | null>(null);

  const pipetteGroupRef = useRef<THREE.Group | null>(null);
  const pipetteLiquidRef = useRef<THREE.Mesh | null>(null);
  const steamParticlesRef = useRef<THREE.Points | null>(null);
  const heatIndicatorLampRef = useRef<THREE.Mesh | null>(null);
  const interactiveObjectsRef = useRef<Map<string, THREE.Object3D>>(new Map());

  // Pipette animation state
  const animationStateRef = useRef<{
    active: boolean;
    stage: 'approach_source' | 'draw' | 'lift_source' | 'move_to_tube' | 'dispense' | 'return';
    progress: number;
    sourcePos: THREE.Vector3;
    targetPos: THREE.Vector3;
    homePos: THREE.Vector3;
    color: string;
  }>({
    active: false,
    stage: 'approach_source',
    progress: 0,
    sourcePos: new THREE.Vector3(),
    targetPos: new THREE.Vector3(0.04, 1.45, 0.4),
    homePos: new THREE.Vector3(0, 3.2, 0.4),
    color: '#ffffff',
  });

  // Camera targets for smooth cinematic lerp
  const targetCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 3.6, 5.2));
  const targetLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.2, 0));

  // Sync fluid inside test tube (handles presence, color, height, and meniscus)
  const syncTubeFluid = useCallback((hasMilk: boolean, colorHex: string, volume: number) => {
    if (!tubeFluidGroupRef.current || !tubeFluidMatRef.current || !tubeFluidColMeshRef.current || !tubeFluidMeniscusRef.current) {
      return;
    }

    if (!hasMilk || volume <= 0) {
      tubeFluidGroupRef.current.visible = false;
      return;
    }

    tubeFluidGroupRef.current.visible = true;

    // Update color
    tubeFluidMatRef.current.color.set(colorHex);

    // Calculate realistic liquid column height (0.42 = standard 5 mL milk fill)
    // Scale slightly higher if additional reagents are pipetted in
    const fillHeight = 0.42 * Math.max(0.4, Math.min(1.4, volume / 0.5));
    tubeFluidColMeshRef.current.scale.set(1, fillHeight, 1);

    // Place the meniscus surface disc right at the fluid level
    tubeFluidMeniscusRef.current.position.y = -0.045 + fillHeight;
  }, []);

  // Sync fluid when props change
  useEffect(() => {
    syncTubeFluid(hasMilkInTube, tubeFluidColor, tubeFluidVolume);
  }, [hasMilkInTube, tubeFluidColor, tubeFluidVolume, syncTubeFluid]);

  // Handle camera presets
  useEffect(() => {
    switch (cameraPreset) {
      case 'overview':
        targetCamPosRef.current.set(0, 3.8, 5.2);
        targetLookAtRef.current.set(0, 1.3, 0);
        break;
      case 'tube':
        targetCamPosRef.current.set(0, 1.8, 2.2);
        targetLookAtRef.current.set(0, 1.1, 0.4);
        break;
      case 'reagents':
        targetCamPosRef.current.set(0, 3.4, 2.8);
        targetLookAtRef.current.set(0, 2.3, -0.6);
        break;
      case 'heater':
        targetCamPosRef.current.set(2.0, 2.2, 2.4);
        targetLookAtRef.current.set(1.7, 0.7, 0.4);
        break;
    }
  }, [cameraPreset]);

  // Handle heating position animation for test tube
  useEffect(() => {
    if (testTubeGroupRef.current) {
      if (isHeating) {
        testTubeGroupRef.current.position.set(1.5, 0.85, 0.4);
      } else {
        testTubeGroupRef.current.position.set(0, 0.75, 0.4);
      }
    }
  }, [isHeating]);

  // Main Three.js Scene Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf1f5f9); // Clean laboratory slate
    scene.fog = new THREE.FogExp2(0xf1f5f9, 0.035);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 3.8, 5.2);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // 4. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05;
    controls.minDistance = 1.2;
    controls.maxDistance = 8.5;
    controls.target.set(0, 1.3, 0);
    controlsRef.current = controls;

    // 5. Lighting (Studio 3-Point setup)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffbeb, 1.5);
    keyLight.position.set(4, 7, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe0f2fe, 0.8);
    fillLight.position.set(-5, 4, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.9);
    rimLight.position.set(0, 5, -5);
    scene.add(rimLight);

    // ==========================================
    // 6. BUILD THE WOODEN LABORATORY WORKBENCH
    // ==========================================
    const woodTextureCanvas = document.createElement('canvas');
    woodTextureCanvas.width = 512;
    woodTextureCanvas.height = 512;
    const ctx = woodTextureCanvas.getContext('2d')!;
    ctx.fillStyle = '#c27b38';
    ctx.fillRect(0, 0, 512, 512);
    ctx.fillStyle = '#b36d2c';
    for (let i = 0; i < 50; i++) {
      ctx.fillRect(0, i * 10, 512, 3);
    }
    const woodTexture = new THREE.CanvasTexture(woodTextureCanvas);
    woodTexture.wrapS = THREE.RepeatWrapping;
    woodTexture.wrapT = THREE.RepeatWrapping;
    woodTexture.repeat.set(4, 2);

    const woodMat = new THREE.MeshStandardMaterial({
      map: woodTexture,
      roughness: 0.45,
      metalness: 0.05,
    });

    // Main Table Top Surface
    const tableGeom = new THREE.BoxGeometry(6.2, 0.2, 3.2);
    const tableMesh = new THREE.Mesh(tableGeom, woodMat);
    tableMesh.position.set(0, 0.4, 0.2);
    tableMesh.receiveShadow = true;
    scene.add(tableMesh);

    // Two-tiered stepped shelf backing
    const shelfBackGeom = new THREE.BoxGeometry(5.8, 1.5, 0.15);
    const shelfBackMesh = new THREE.Mesh(shelfBackGeom, woodMat);
    shelfBackMesh.position.set(0, 1.25, -1.1);
    shelfBackMesh.receiveShadow = true;
    shelfBackMesh.castShadow = true;
    scene.add(shelfBackMesh);

    // Top Reagent Shelf Ledge
    const shelfLedgeGeom = new THREE.BoxGeometry(5.6, 0.1, 0.7);
    const shelfLedgeMesh = new THREE.Mesh(shelfLedgeGeom, woodMat);
    shelfLedgeMesh.position.set(0, 1.7, -0.75);
    shelfLedgeMesh.receiveShadow = true;
    shelfLedgeMesh.castShadow = true;
    scene.add(shelfLedgeMesh);

    // Shelf support brackets
    const bracketGeom = new THREE.BoxGeometry(0.08, 0.5, 0.6);
    [-2.2, 0, 2.2].forEach((bx) => {
      const bracket = new THREE.Mesh(bracketGeom, woodMat);
      bracket.position.set(bx, 1.4, -0.8);
      scene.add(bracket);
    });

    // Floor shadow plane
    const floorGeom = new THREE.PlaneGeometry(16, 16);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.8 });
    const floorMesh = new THREE.Mesh(floorGeom, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = 0;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Reagent Bottle Glass (High clarity borosilicate)
    const bottleGlassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.32,
      roughness: 0.08,
      metalness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      reflectivity: 0.9,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    const capMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.3,
    });

    // ==========================================
    // 7. REAGENT BOTTLES ON THE TOP SHELF
    // ==========================================
    const bottleSpacing = 0.68;
    const startX = -((REAGENTS.length - 1) * bottleSpacing) / 2;

    REAGENTS.forEach((reagent, idx) => {
      const bottleGroup = new THREE.Group();
      const bX = startX + idx * bottleSpacing;
      const bY = 1.75;
      const bZ = -0.75;
      bottleGroup.position.set(bX, bY, bZ);

      // Glass Bottle Body
      const bodyGeom = new THREE.CylinderGeometry(0.18, 0.18, 0.45, 24);
      const bodyMesh = new THREE.Mesh(bodyGeom, bottleGlassMaterial.clone());
      bodyMesh.castShadow = true;
      bodyMesh.receiveShadow = true;
      bodyMesh.renderOrder = 10;
      bottleGroup.add(bodyMesh);

      // Liquid inside bottle
      const liqGeom = new THREE.CylinderGeometry(0.165, 0.165, 0.35, 24);
      const liqMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(reagent.fluidColor),
        roughness: 0.2,
        metalness: 0.05,
        depthWrite: true,
      });
      const liqMesh = new THREE.Mesh(liqGeom, liqMat);
      liqMesh.position.y = -0.04;
      liqMesh.renderOrder = 2;
      bottleGroup.add(liqMesh);

      // Neck & Cap
      const neckGeom = new THREE.CylinderGeometry(0.09, 0.12, 0.14, 20);
      const neckMesh = new THREE.Mesh(neckGeom, bottleGlassMaterial.clone());
      neckMesh.position.y = 0.28;
      neckMesh.renderOrder = 10;
      bottleGroup.add(neckMesh);

      const capGeom = new THREE.CylinderGeometry(0.1, 0.1, 0.12, 20);
      const capMesh = new THREE.Mesh(capGeom, capMaterial);
      capMesh.position.y = 0.38;
      bottleGroup.add(capMesh);

      // Label band
      const labelGeom = new THREE.CylinderGeometry(0.182, 0.182, 0.22, 24, 1, true);
      const labelCanvas = document.createElement('canvas');
      labelCanvas.width = 256;
      labelCanvas.height = 128;
      const lctx = labelCanvas.getContext('2d')!;
      lctx.fillStyle = '#ffffff';
      lctx.fillRect(0, 0, 256, 128);
      lctx.strokeStyle = '#0284c7';
      lctx.lineWidth = 6;
      lctx.strokeRect(4, 4, 248, 120);
      lctx.fillStyle = '#0f172a';
      lctx.font = 'bold 36px monospace';
      lctx.textAlign = 'center';
      lctx.fillText(reagent.chemicalFormula.slice(0, 8), 128, 72);
      const labelTex = new THREE.CanvasTexture(labelCanvas);
      const labelMat = new THREE.MeshBasicMaterial({ map: labelTex, side: THREE.DoubleSide });
      const labelBand = new THREE.Mesh(labelGeom, labelMat);
      bottleGroup.add(labelBand);

      // Shadow disc on shelf
      const shadowGeom = new THREE.CircleGeometry(0.2, 16);
      const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.25 });
      const shadowMesh = new THREE.Mesh(shadowGeom, shadowMat);
      shadowMesh.rotation.x = -Math.PI / 2;
      shadowMesh.position.y = -0.22;
      bottleGroup.add(shadowMesh);

      scene.add(bottleGroup);
      interactiveObjectsRef.current.set(`reagent_${reagent.id}`, bottleGroup);
    });

    // ==========================================
    // 8. MILK SAMPLE FLASK (Foreground Left)
    // ==========================================
    const flaskGroup = new THREE.Group();
    flaskGroup.position.set(-1.6, 0.5, 0.5);

    // Conical Erlenmeyer flask body
    const flaskGeom = new THREE.CylinderGeometry(0.15, 0.45, 0.7, 32);
    const flaskMesh = new THREE.Mesh(flaskGeom, bottleGlassMaterial.clone());
    flaskMesh.castShadow = true;
    flaskMesh.position.y = 0.35;
    flaskMesh.renderOrder = 10;
    flaskGroup.add(flaskMesh);

    // Opaque Milk fluid inside flask
    const milkGeom = new THREE.CylinderGeometry(0.18, 0.42, 0.45, 32);
    const milkMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.25,
      metalness: 0.05,
      depthWrite: true,
    });
    const milkMesh = new THREE.Mesh(milkGeom, milkMat);
    milkMesh.position.y = 0.23;
    milkMesh.renderOrder = 2;
    flaskGroup.add(milkMesh);

    // Neck of flask
    const flaskNeckGeom = new THREE.CylinderGeometry(0.14, 0.14, 0.25, 24);
    const flaskNeckMesh = new THREE.Mesh(flaskNeckGeom, bottleGlassMaterial.clone());
    flaskNeckMesh.position.y = 0.75;
    flaskNeckMesh.renderOrder = 10;
    flaskGroup.add(flaskNeckMesh);

    // Flask shadow
    const flaskShadowGeom = new THREE.CircleGeometry(0.48, 24);
    const flaskShadow = new THREE.Mesh(flaskShadowGeom, new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.25 }));
    flaskShadow.rotation.x = -Math.PI / 2;
    flaskShadow.position.y = 0.01;
    flaskGroup.add(flaskShadow);

    scene.add(flaskGroup);
    interactiveObjectsRef.current.set('milk_sample', flaskGroup);

    // =======================================================
    // 9. TEST TUBE IN STAND & VIBRANT COLLOIDAL FLUID (Center)
    // =======================================================
    const tubeGroup = new THREE.Group();
    tubeGroup.position.set(0, 0.75, 0.4);
    testTubeGroupRef.current = tubeGroup;

    // Test Tube Stand: Heavy dark slate base
    const standBaseGeom = new THREE.BoxGeometry(0.55, 0.08, 0.35);
    const standBaseMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.3,
      metalness: 0.6,
    });
    const standBase = new THREE.Mesh(standBaseGeom, standBaseMat);
    standBase.position.y = -0.2;
    standBase.castShadow = true;
    standBase.receiveShadow = true;
    tubeGroup.add(standBase);

    // Vertical metal rod
    const rodGeom = new THREE.CylinderGeometry(0.02, 0.02, 0.9, 16);
    const rodMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.2 });
    const rod = new THREE.Mesh(rodGeom, rodMat);
    rod.position.set(-0.16, 0.22, 0);
    rod.castShadow = true;
    tubeGroup.add(rod);

    // Holding Ring clamp
    const ringGeom = new THREE.TorusGeometry(0.12, 0.018, 16, 32);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8 });
    const ring = new THREE.Mesh(ringGeom, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(0.04, 0.45, 0);
    tubeGroup.add(ring);

    // --- TEST TUBE FLUID GROUP (Milk & Reacting Chemicals) ---
    // Fluid inner radius: 0.088 (snugly fills inside 0.095 radius glass)
    const fluidGroup = new THREE.Group();
    tubeFluidGroupRef.current = fluidGroup;

    const fluidMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(tubeFluidColor),
      roughness: 0.22,
      metalness: 0.02,
      depthWrite: true,
      side: THREE.DoubleSide,
    });
    tubeFluidMatRef.current = fluidMat;

    // 1. Fluid Rounded Bottom Hemisphere (fills the rounded bottom of the tube)
    const liqBottomGeom = new THREE.SphereGeometry(0.088, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    const liqBottomMesh = new THREE.Mesh(liqBottomGeom, fluidMat);
    liqBottomMesh.position.set(0.04, -0.045, 0);
    liqBottomMesh.renderOrder = 2;
    fluidGroup.add(liqBottomMesh);

    // 2. Fluid Cylinder Column (translated so scale.y scales upward from base)
    const liqColGeom = new THREE.CylinderGeometry(0.088, 0.088, 1.0, 32);
    liqColGeom.translate(0, 0.5, 0); // origin is at bottom
    const liqColMesh = new THREE.Mesh(liqColGeom, fluidMat);
    liqColMesh.position.set(0.04, -0.045, 0);
    liqColMesh.scale.set(1, 0.42, 1); // 0.42 height default (5 mL milk)
    liqColMesh.renderOrder = 2;
    fluidGroup.add(liqColMesh);
    tubeFluidColMeshRef.current = liqColMesh;

    // 3. Fluid Meniscus Top Surface Disc
    const meniscusGeom = new THREE.CircleGeometry(0.088, 32);
    const meniscusMesh = new THREE.Mesh(meniscusGeom, fluidMat);
    meniscusMesh.rotation.x = -Math.PI / 2;
    meniscusMesh.position.set(0.04, -0.045 + 0.42, 0);
    meniscusMesh.renderOrder = 2;
    fluidGroup.add(meniscusMesh);
    tubeFluidMeniscusRef.current = meniscusMesh;

    tubeGroup.add(fluidGroup);

    // --- TEST TUBE GLASS ENVELOPE (Clear borosilicate glass) ---
    const tubeGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0xf8fafc,
      transparent: true,
      opacity: 0.28,
      roughness: 0.04,
      metalness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      reflectivity: 0.95,
      depthWrite: false, // Ensures liquid inside is never occluded
      side: THREE.DoubleSide,
    });

    // Glass cylinder body (height 0.85, bottom at -0.045, top at 0.805)
    const tubeGlassGeom = new THREE.CylinderGeometry(0.095, 0.095, 0.85, 32, 1, true);
    const tubeGlass = new THREE.Mesh(tubeGlassGeom, tubeGlassMat);
    tubeGlass.position.set(0.04, 0.38, 0);
    tubeGlass.castShadow = true;
    tubeGlass.renderOrder = 10;
    tubeGroup.add(tubeGlass);

    // Rounded tube bottom hemisphere
    const bottomDomeGeom = new THREE.SphereGeometry(0.095, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    const bottomDome = new THREE.Mesh(bottomDomeGeom, tubeGlassMat);
    bottomDome.position.set(0.04, -0.045, 0);
    bottomDome.renderOrder = 10;
    tubeGroup.add(bottomDome);

    // Lip rim ring at top of tube
    const rimGeom = new THREE.TorusGeometry(0.095, 0.01, 16, 32);
    const rimMesh = new THREE.Mesh(rimGeom, tubeGlassMat);
    rimMesh.rotation.x = Math.PI / 2;
    rimMesh.position.set(0.04, 0.805, 0);
    rimMesh.renderOrder = 10;
    tubeGroup.add(rimMesh);

    scene.add(tubeGroup);
    interactiveObjectsRef.current.set('test_tube', tubeGroup);

    // Immediately sync fluid with initial props
    syncTubeFluid(hasMilkInTube, tubeFluidColor, tubeFluidVolume);

    // ==========================================
    // 10. HEATING WATER BATH BLOCK (Foreground Right)
    // ==========================================
    const heaterGroup = new THREE.Group();
    heaterGroup.position.set(1.5, 0.5, 0.4);

    const heaterChassisGeom = new THREE.BoxGeometry(0.95, 0.42, 0.65);
    const heaterChassisMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.35,
      metalness: 0.5,
    });
    const heaterChassis = new THREE.Mesh(heaterChassisGeom, heaterChassisMat);
    heaterChassis.position.y = 0.21;
    heaterChassis.castShadow = true;
    heaterChassis.receiveShadow = true;
    heaterGroup.add(heaterChassis);

    // 3 round heating wells
    const wellPositions = [-0.26, 0, 0.26];
    wellPositions.forEach((wx) => {
      const wellGeom = new THREE.CylinderGeometry(0.11, 0.11, 0.05, 24);
      const wellMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
      const well = new THREE.Mesh(wellGeom, wellMat);
      well.position.set(wx, 0.42, 0);
      heaterGroup.add(well);
    });

    // Indicator lamp on front of heater
    const lampGeom = new THREE.SphereGeometry(0.04, 16, 16);
    const lampMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });
    const lamp = new THREE.Mesh(lampGeom, lampMat);
    lamp.position.set(0.35, 0.21, 0.33);
    heaterGroup.add(lamp);
    heatIndicatorLampRef.current = lamp;

    // Steam particle system
    const steamParticleCount = 80;
    const steamGeo = new THREE.BufferGeometry();
    const steamPositions = new Float32Array(steamParticleCount * 3);
    for (let i = 0; i < steamParticleCount * 3; i += 3) {
      steamPositions[i] = (Math.random() - 0.5) * 0.4;
      steamPositions[i + 1] = 0.2 + Math.random() * 0.7;
      steamPositions[i + 2] = (Math.random() - 0.5) * 0.3;
    }
    steamGeo.setAttribute('position', new THREE.BufferAttribute(steamPositions, 3));
    const steamMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.07,
      transparent: true,
      opacity: 0,
    });
    const steamParticles = new THREE.Points(steamGeo, steamMat);
    steamParticles.position.set(0, 0.4, 0);
    heaterGroup.add(steamParticles);
    steamParticlesRef.current = steamParticles;

    scene.add(heaterGroup);
    interactiveObjectsRef.current.set('heater', heaterGroup);

    // ==========================================
    // 11. DYNAMIC LABORATORY MICRO-PIPETTE
    // ==========================================
    const pipetteGroup = new THREE.Group();
    pipetteGroup.position.set(0, 3.2, 0.4);
    pipetteGroup.visible = false;

    // Pipette Body
    const pipBodyGeom = new THREE.CylinderGeometry(0.035, 0.035, 0.5, 16);
    const pipBodyMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 });
    const pipBody = new THREE.Mesh(pipBodyGeom, pipBodyMat);
    pipBody.position.y = 0.35;
    pipetteGroup.add(pipBody);

    // Pipette Glass Tip
    const pipTipGeom = new THREE.ConeGeometry(0.035, 0.4, 16);
    const pipTipMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.5,
      roughness: 0.1,
      depthWrite: false,
    });
    const pipTip = new THREE.Mesh(pipTipGeom, pipTipMat);
    pipTip.rotation.x = Math.PI;
    pipTip.position.y = -0.1;
    pipetteGroup.add(pipTip);

    // Pipette Internal Fluid Cone
    const pipLiqGeom = new THREE.ConeGeometry(0.028, 0.32, 16);
    const pipLiqMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const pipLiq = new THREE.Mesh(pipLiqGeom, pipLiqMat);
    pipLiq.rotation.x = Math.PI;
    pipLiq.position.y = -0.08;
    pipLiq.visible = false;
    pipetteGroup.add(pipLiq);
    pipetteLiquidRef.current = pipLiq;

    // Top plunger button
    const plungerGeom = new THREE.CylinderGeometry(0.02, 0.02, 0.1, 16);
    const plungerMat = new THREE.MeshStandardMaterial({ color: 0xef4444 });
    const plunger = new THREE.Mesh(plungerGeom, plungerMat);
    plunger.position.y = 0.65;
    pipetteGroup.add(plunger);

    scene.add(pipetteGroup);
    pipetteGroupRef.current = pipetteGroup;

    // ==========================================
    // 12. ANIMATION LOOP & 2D SCREEN PROJECTION
    // ==========================================
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Smooth camera interpolation towards target presets
      if (cameraRef.current && controlsRef.current) {
        cameraRef.current.position.lerp(targetCamPosRef.current, 0.04);
        controlsRef.current.target.lerp(targetLookAtRef.current, 0.04);
        controlsRef.current.update();
      }

      // Steam animation if heating
      if (steamParticlesRef.current) {
        const mat = steamParticlesRef.current.material as THREE.PointsMaterial;
        if (isHeating) {
          mat.opacity = 0.65;
          const pos = steamParticlesRef.current.geometry.attributes.position.array as Float32Array;
          for (let i = 0; i < steamParticleCount; i++) {
            pos[i * 3 + 1] += delta * 0.4;
            pos[i * 3] += (Math.random() - 0.5) * 0.005;
            if (pos[i * 3 + 1] > 0.9) {
              pos[i * 3 + 1] = 0.1;
            }
          }
          steamParticlesRef.current.geometry.attributes.position.needsUpdate = true;
          if (heatIndicatorLampRef.current) {
            (heatIndicatorLampRef.current.material as THREE.MeshBasicMaterial).color.setHex(0xef4444);
          }
        } else {
          mat.opacity = 0;
          if (heatIndicatorLampRef.current) {
            (heatIndicatorLampRef.current.material as THREE.MeshBasicMaterial).color.setHex(0x22c55e);
          }
        }
      }

      // Pipette Transfer Animation
      const anim = animationStateRef.current;
      if (anim.active && pipetteGroupRef.current) {
        anim.progress += delta * 1.5;
        const p = Math.min(1.0, anim.progress);

        if (anim.stage === 'approach_source') {
          pipetteGroupRef.current.visible = true;
          pipetteGroupRef.current.position.lerpVectors(anim.homePos, anim.sourcePos, p);
          if (p >= 1.0) {
            anim.stage = 'draw';
            anim.progress = 0;
          }
        } else if (anim.stage === 'draw') {
          if (pipetteLiquidRef.current) {
            (pipetteLiquidRef.current.material as THREE.MeshBasicMaterial).color.set(anim.color);
            pipetteLiquidRef.current.visible = true;
          }
          if (p >= 0.5) {
            anim.stage = 'lift_source';
            anim.progress = 0;
          }
        } else if (anim.stage === 'lift_source') {
          const liftPos = anim.sourcePos.clone().add(new THREE.Vector3(0, 0.8, 0));
          pipetteGroupRef.current.position.lerpVectors(anim.sourcePos, liftPos, p);
          if (p >= 1.0) {
            anim.stage = 'move_to_tube';
            anim.progress = 0;
          }
        } else if (anim.stage === 'move_to_tube') {
          const highPos = anim.targetPos.clone().add(new THREE.Vector3(0, 0.4, 0));
          pipetteGroupRef.current.position.lerpVectors(pipetteGroupRef.current.position, highPos, p);
          if (p >= 1.0) {
            anim.stage = 'dispense';
            anim.progress = 0;
          }
        } else if (anim.stage === 'dispense') {
          if (p >= 0.8) {
            if (pipetteLiquidRef.current) {
              pipetteLiquidRef.current.visible = false;
            }
            anim.stage = 'return';
            anim.progress = 0;
          }
        } else if (anim.stage === 'return') {
          pipetteGroupRef.current.position.lerpVectors(pipetteGroupRef.current.position, anim.homePos, p);
          if (p >= 1.0) {
            anim.active = false;
            pipetteGroupRef.current.visible = false;
            setIsPipetting(false);
          }
        }
      }

      // Project 3D positions to 2D screen coordinates for DOM tags
      if (showLabels && cameraRef.current && rendererRef.current) {
        const newLabels: LabelPosition[] = [];
        const tempVec = new THREE.Vector3();

        // Reagent labels with staggered height to prevent overlapping
        REAGENTS.forEach((r, idx) => {
          const obj = interactiveObjectsRef.current.get(`reagent_${r.id}`);
          if (obj) {
            obj.getWorldPosition(tempVec);
            tempVec.y += 0.38 + (idx % 2 === 0 ? 0.08 : 0);
            tempVec.project(cameraRef.current!);

            const isFront = tempVec.z < 1;
            const x = ((tempVec.x + 1) * width) / 2;
            const y = ((-tempVec.y + 1) * height) / 2;

            newLabels.push({
              id: r.id,
              name: r.name.split(' ')[0],
              subText: r.chemicalFormula.slice(0, 6),
              badgeColor: r.fluidColor,
              x,
              y,
              visible: isFront && x >= -20 && x <= width + 20 && y >= -20 && y <= height + 20,
              type: 'reagent',
              reagentData: r,
            });
          }
        });

        // Milk Sample Label
        const milkObj = interactiveObjectsRef.current.get('milk_sample');
        if (milkObj) {
          milkObj.getWorldPosition(tempVec);
          tempVec.y += 0.65;
          tempVec.project(cameraRef.current);
          const x = ((tempVec.x + 1) * width) / 2;
          const y = ((-tempVec.y + 1) * height) / 2;
          newLabels.push({
            id: 'milk_sample',
            name: 'Milk sample',
            subText: '5 mL Flask',
            badgeColor: '#ffffff',
            x,
            y,
            visible: tempVec.z < 1,
            type: 'milk',
          });
        }

        // Test tube Label (dynamic based on whether milk is present)
        const tubeObj = interactiveObjectsRef.current.get('test_tube');
        if (tubeObj) {
          tubeObj.getWorldPosition(tempVec);
          tempVec.y += 0.65;
          tempVec.project(cameraRef.current);
          const x = ((tempVec.x + 1) * width) / 2;
          const y = ((-tempVec.y + 1) * height) / 2;
          newLabels.push({
            id: 'test_tube',
            name: hasMilkInTube ? 'Reaction Tube (Milk Loaded)' : 'Test Tube (Empty)',
            subText: hasMilkInTube ? `${tubeFluidColor === '#ffffff' ? 'Pure Milk' : 'Reacting'}` : 'Click to add milk',
            badgeColor: hasMilkInTube ? tubeFluidColor : '#94a3b8',
            x,
            y,
            visible: tempVec.z < 1,
            type: 'tube',
          });
        }

        // Heating Station Label
        const heaterObj = interactiveObjectsRef.current.get('heater');
        if (heaterObj) {
          heaterObj.getWorldPosition(tempVec);
          tempVec.y += 0.25;
          tempVec.z += 0.3;
          tempVec.project(cameraRef.current);
          const x = ((tempVec.x + 1) * width) / 2;
          const y = ((-tempVec.y + 1) * height) / 2;
          newLabels.push({
            id: 'heater',
            name: isHeating ? `${Math.round(heatingProgress)}% BOILING` : 'READY',
            subText: 'Water Bath 95°C',
            badgeColor: isHeating ? '#ef4444' : '#22c55e',
            x,
            y,
            visible: tempVec.z < 1,
            type: 'heater',
          });
        }

        setLabels(newLabels);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [syncTubeFluid]);

  // Raycaster for clicking 3D objects
  const handleCanvasClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!rendererRef.current || !cameraRef.current || !sceneRef.current) return;
    const rect = rendererRef.current.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    // Test intersects with interactive objects
    for (const [key, obj] of interactiveObjectsRef.current.entries()) {
      const intersects = raycaster.intersectObjects(obj.children, true);
      if (intersects.length > 0) {
        if (key.startsWith('reagent_')) {
          const reagentId = key.replace('reagent_', '');
          const reagent = REAGENTS.find((r) => r.id === reagentId);
          if (reagent) {
            triggerPipetteReagent(reagent);
            onSelectReagent(reagent);
          }
        } else if (key === 'milk_sample') {
          triggerPipetteMilk();
          onAddMilk();
        } else if (key === 'test_tube') {
          if (!hasMilkInTube) {
            triggerPipetteMilk();
            onAddMilk();
          }
        } else if (key === 'heater') {
          onHeatSample();
        }
        break;
      }
    }
  };

  const triggerPipetteReagent = (reagent: Reagent) => {
    if (isPipetting) return;
    setIsPipetting(true);
    setPipetteFluidColor(reagent.fluidColor);
    const obj = interactiveObjectsRef.current.get(`reagent_${reagent.id}`);
    const sourcePos = obj ? obj.position.clone().add(new THREE.Vector3(0, 0.45, 0)) : new THREE.Vector3(0, 2, -0.6);

    animationStateRef.current = {
      active: true,
      stage: 'approach_source',
      progress: 0,
      sourcePos,
      targetPos: new THREE.Vector3(0.04, 1.45, 0.4),
      homePos: new THREE.Vector3(0, 3.2, 0.4),
      color: reagent.fluidColor,
    };
  };

  const triggerPipetteMilk = () => {
    if (isPipetting) return;
    setIsPipetting(true);
    setPipetteFluidColor('#ffffff');
    const obj = interactiveObjectsRef.current.get('milk_sample');
    const sourcePos = obj ? obj.position.clone().add(new THREE.Vector3(0, 0.8, 0)) : new THREE.Vector3(-1.6, 1.2, 0.5);

    animationStateRef.current = {
      active: true,
      stage: 'approach_source',
      progress: 0,
      sourcePos,
      targetPos: new THREE.Vector3(0.04, 1.45, 0.4),
      homePos: new THREE.Vector3(0, 3.2, 0.4),
      color: '#ffffff',
    };
  };

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-slate-900 rounded-xl border border-slate-800 shadow-2xl">
      {/* 3D WebGL Canvas */}
      <div
        ref={mountRef}
        onClick={handleCanvasClick}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Floating 3D Object Labels */}
      {showLabels && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {labels.map((lbl) => {
            if (!lbl.visible) return null;
            return (
              <div
                key={lbl.id}
                style={{
                  transform: `translate(${lbl.x}px, ${lbl.y}px) translate(-50%, -100%)`,
                }}
                className="absolute transition-all duration-75 pointer-events-auto"
              >
                <button
                  type="button"
                  onClick={() => {
                    if (lbl.type === 'reagent' && lbl.reagentData) {
                      triggerPipetteReagent(lbl.reagentData);
                      onSelectReagent(lbl.reagentData);
                    } else if (lbl.type === 'milk') {
                      triggerPipetteMilk();
                      onAddMilk();
                    } else if (lbl.type === 'tube') {
                      if (!hasMilkInTube) {
                        triggerPipetteMilk();
                        onAddMilk();
                      }
                    } else if (lbl.type === 'heater') {
                      onHeatSample();
                    }
                  }}
                  className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono font-semibold tracking-wide shadow-md transition-all flex items-center gap-1.5 ${
                    lbl.type === 'heater'
                      ? isHeating
                        ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                        : 'bg-white/95 text-slate-800 border-slate-300 hover:bg-slate-50'
                      : lbl.type === 'milk'
                      ? 'bg-white/95 text-slate-900 border-sky-400/80 hover:bg-sky-50 shadow-sky-100 ring-2 ring-sky-300/40'
                      : lbl.type === 'tube'
                      ? hasMilkInTube
                        ? 'bg-white/95 text-slate-900 border-emerald-400/80 hover:bg-emerald-50'
                        : 'bg-white/95 text-slate-700 border-amber-400 hover:bg-amber-50 animate-bounce'
                      : 'bg-white/95 text-slate-900 border-slate-300 hover:border-sky-500 hover:bg-sky-50'
                  }`}
                >
                  {lbl.badgeColor && (
                    <span
                      className="inline-block w-2.5 h-2.5 rounded-full border border-slate-300 shadow-sm shrink-0"
                      style={{ backgroundColor: lbl.badgeColor }}
                    />
                  )}
                  <div className="flex flex-col text-left leading-tight">
                    <span>{lbl.name}</span>
                    {lbl.subText && (
                      <span className="text-[10px] text-slate-500 font-normal">{lbl.subText}</span>
                    )}
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Pipetting status indicator */}
      {isPipetting && (
        <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-sky-600/90 text-white text-xs font-semibold rounded-lg shadow-lg backdrop-blur-md animate-pulse">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span>Pipetting in progress...</span>
        </div>
      )}

      {/* Bench Floor Label Notice */}
      <div className="absolute bottom-3 left-4 pointer-events-none text-xs text-slate-400 font-mono bg-slate-900/80 px-2.5 py-1 rounded border border-slate-800 backdrop-blur-sm">
        Drag: Orbit 360° · Scroll: Zoom · Right-Click: Pan · Click bottles or labels to pipette
      </div>
    </div>
  );
};
