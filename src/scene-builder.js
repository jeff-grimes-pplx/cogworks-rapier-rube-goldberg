import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { STAGE_DEFINITIONS } from './physics-engine.js';

// ============================================================================
// COGWORKS — TAKE 606 PHYSICS ATELIER
// Three.js PBR Gallery Scene, Sculpted Automotive Parts, Camera Rig & Overlays
// ============================================================================

class HelixCurve extends THREE.Curve {
  constructor(radius = 0.14, height = 0.42, turns = 6.5) {
    super();
    this.radius = radius;
    this.height = height;
    this.turns = turns;
  }
  getPoint(t, optionalTarget = new THREE.Vector3()) {
    const angle = t * Math.PI * 2 * this.turns;
    const x = Math.cos(angle) * this.radius;
    const z = Math.sin(angle) * this.radius;
    const y = (t - 0.5) * this.height;
    return optionalTarget.set(x, y, z);
  }
}

function createHelicalSpringMesh(radius, height, turns, wireRadius, material) {
  const curve = new HelixCurve(radius, height, turns);
  const geo = new THREE.TubeGeometry(curve, 96, wireRadius, 12, false);
  const mesh = new THREE.Mesh(geo, material);
  mesh.castShadow = true;
  return mesh;
}

function createParquetTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Warm honey-oak gallery parquet base
  ctx.fillStyle = '#b98952';
  ctx.fillRect(0, 0, 512, 512);

  const plankW = 64;
  const plankH = 16;
  const tones = ['#c4955d', '#b5834b', '#ca9c65', '#ab7942', '#bf8e56'];

  for (let y = 0; y < 512; y += plankH) {
    for (let x = 0; x < 512; x += plankW) {
      const idx = ((x / plankW) * 3 + (y / plankH) * 7) % tones.length;
      ctx.fillStyle = tones[idx];
      const offset = ((y / plankH) % 2) * (plankW / 2);
      ctx.fillRect((x + offset) % 512, y, plankW - 1.5, plankH - 1.5);

      ctx.strokeStyle = 'rgba(70, 42, 18, 0.16)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo((x + offset) % 512, y + plankH * 0.5);
      ctx.lineTo(((x + offset) % 512) + plankW - 2, y + plankH * 0.5);
      ctx.stroke();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(54, 30);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createStagePlaqueTexture(stageDef, status = 'ready') {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle =
    status === 'active'
      ? '#2c1f0f'
      : status === 'complete'
        ? '#11261c'
        : status === 'failed'
          ? '#2d1212'
          : '#18181b';
  ctx.fillRect(0, 0, 512, 256);

  ctx.strokeStyle =
    status === 'active'
      ? '#f59e0b'
      : status === 'complete'
        ? '#10b981'
        : status === 'failed'
          ? '#ef4444'
          : '#52525b';
  ctx.lineWidth = 12;
  ctx.strokeRect(8, 8, 496, 240);

  ctx.fillStyle =
    status === 'active'
      ? '#fbbf24'
      : status === 'complete'
        ? '#34d399'
        : status === 'failed'
          ? '#f87171'
          : '#e4e4e7';
  ctx.font = '700 82px "JetBrains Mono", monospace';
  ctx.fillText(`STAGE ${stageDef.code}`, 32, 108);

  ctx.fillStyle = '#ffffff';
  ctx.font = '700 48px "Space Grotesk", sans-serif';
  ctx.fillText(stageDef.shortName.toUpperCase(), 32, 196);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = false;
  return tex;
}

function createFinaleBannerTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1280;
  canvas.height = 260;
  const ctx = canvas.getContext('2d');

  // Clean museum ivory canvas banner with crimson & brass trim — single plain title line only
  ctx.fillStyle = '#faf6ee';
  ctx.fillRect(0, 0, 1280, 260);

  ctx.strokeStyle = '#dc2626';
  ctx.lineWidth = 12;
  ctx.strokeRect(12, 12, 1256, 236);

  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 3;
  ctx.strokeRect(26, 26, 1228, 208);

  ctx.fillStyle = '#18181b';
  ctx.font = '800 42px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText("TAKE 606 — ISN'T IT NICE WHEN THINGS JUST WORK?", 640, 130);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export class CogworksSceneView {
  constructor(canvas) {
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(
      canvas.clientWidth || window.innerWidth,
      canvas.clientHeight || window.innerHeight,
      false
    );
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.12;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xe6decb);
    this.scene.fog = new THREE.FogExp2(0xe6decb, 0.0055);

    // Studio HDRI environment for realistic chrome, brass, copper & glass reflections
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    const roomEnv = new RoomEnvironment();
    this.scene.environment = pmrem.fromScene(roomEnv, 0.04).texture;
    roomEnv.dispose();
    pmrem.dispose();

    this.camera = new THREE.PerspectiveCamera(
      40,
      (canvas.clientWidth || window.innerWidth) / (canvas.clientHeight || window.innerHeight),
      0.2,
      180
    );
    this.camera.position.set(-23.5, 4.45, 5.95);

    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.07;
    this.controls.target.set(-23.5, 4.10, 0);
    this.controls.maxPolarAngle = Math.PI * 0.52;
    this.controls.minDistance = 2.2;
    this.controls.maxDistance = 140.0;

    // Camera Mode ('dolly' | 'overview' | 'stage' | 'orbit')
    this.cameraMode = 'dolly';
    this.inspectedStageId = 1;
    this.drawerOpen = true;
    this.drawerWidth = 336;
    this.desiredCamPos = new THREE.Vector3(-23.5, 4.45, 5.95);
    this.desiredTarget = new THREE.Vector3(-23.5, 4.10, 0);

    // Debug overlay flags (CoM markers default off for a clean cold open; user can toggle anytime)
    this.overlays = {
      wireframes: false,
      comMarkers: false,
      velocityVectors: false,
      impulseArrows: false
    };

    // Shared PBR Material Library
    this.materials = this._createMaterials();

    // Scene sub-groups
    this.environmentGroup = new THREE.Group();
    this.staticGroup = new THREE.Group();
    this.dynamicGroup = new THREE.Group();
    this.overlayGroup = new THREE.Group();
    this.scene.add(this.environmentGroup);
    this.scene.add(this.staticGroup);
    this.scene.add(this.dynamicGroup);
    this.scene.add(this.overlayGroup);

    // Maps of dynamic meshes, plaques, cables, overlays
    this.dynamicMeshes = new Map();
    this.wireframeMeshes = new Map();
    this.comMarkers = new Map();
    this.velocityArrows = new Map();
    this.impulseArrows = [];
    this.stagePlaques = new Map();
    this.stageBeacons = new Map();
    this.glassCableLines = [];
    this.rainDropletsGroup = null;
    this.finaleBannerMesh = null;
    this.keyFobButtonMesh = null;

    this._setupLighting();
    this._buildGalleryArchitecture();
    this._applyCameraViewOffset();
  }

  _createMaterials() {
    const parquetTex = createParquetTexture();
    return {
      parquet: new THREE.MeshStandardMaterial({
        map: parquetTex,
        roughness: 0.44,
        metalness: 0.05
      }),
      chrome: new THREE.MeshStandardMaterial({
        color: 0xf4f6f8,
        metalness: 0.94,
        roughness: 0.09
      }),
      gunmetal: new THREE.MeshStandardMaterial({
        color: 0x3b4252,
        metalness: 0.85,
        roughness: 0.24
      }),
      castIron: new THREE.MeshStandardMaterial({
        color: 0x272a30,
        metalness: 0.68,
        roughness: 0.42
      }),
      brass: new THREE.MeshStandardMaterial({
        color: 0xd99b26,
        metalness: 0.88,
        roughness: 0.18
      }),
      copper: new THREE.MeshStandardMaterial({
        color: 0xe06d3b,
        metalness: 0.86,
        roughness: 0.18,
        emissive: 0x7c2d12,
        emissiveIntensity: 0.22
      }),
      aluminum: new THREE.MeshStandardMaterial({
        color: 0xd8dee9,
        metalness: 0.78,
        roughness: 0.22
      }),
      walnut: new THREE.MeshStandardMaterial({
        color: 0x7c4d2b,
        metalness: 0.08,
        roughness: 0.50
      }),
      timberRamp: new THREE.MeshStandardMaterial({
        color: 0x8c5a32,
        metalness: 0.06,
        roughness: 0.46
      }),
      oakSlat: new THREE.MeshStandardMaterial({
        color: 0xc29b68,
        metalness: 0.04,
        roughness: 0.62
      }),
      tireRubber: new THREE.MeshStandardMaterial({
        color: 0x1c1d21,
        metalness: 0.12,
        roughness: 0.76
      }),
      glass: new THREE.MeshPhysicalMaterial({
        color: 0x7dd3fc,
        metalness: 0.05,
        roughness: 0.08,
        transmission: 0.72,
        transparent: true,
        opacity: 0.86,
        ior: 1.52
      }),
      tintedGlass: new THREE.MeshPhysicalMaterial({
        color: 0x1e293b,
        metalness: 0.15,
        roughness: 0.08,
        transmission: 0.55,
        transparent: true,
        opacity: 0.88,
        ior: 1.5
      }),
      hondaRed: new THREE.MeshPhysicalMaterial({
        color: 0xdc2626,
        metalness: 0.45,
        roughness: 0.16,
        clearcoat: 0.92,
        clearcoatRoughness: 0.1
      }),
      headlightGlow: new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        emissive: 0xfef08a,
        emissiveIntensity: 1.4,
        roughness: 0.1
      }),
      taillightGlow: new THREE.MeshStandardMaterial({
        color: 0xef4444,
        emissive: 0xdc2626,
        emissiveIntensity: 1.2,
        roughness: 0.15
      }),
      springRed: new THREE.MeshStandardMaterial({
        color: 0xe11d48,
        metalness: 0.55,
        roughness: 0.28
      }),
      bilsteinYellow: new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        metalness: 0.35,
        roughness: 0.26
      }),
      sensorPad: new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        metalness: 0.5,
        roughness: 0.2,
        emissive: 0x0369a1,
        emissiveIntensity: 0.4
      }),
      wireframeCyan: new THREE.MeshBasicMaterial({
        color: 0x06b6d4,
        wireframe: true,
        transparent: true,
        opacity: 0.72
      }),
      wireframeAmber: new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        wireframe: true,
        transparent: true,
        opacity: 0.52
      })
    };
  }

  _setupLighting() {
    const hemi = new THREE.HemisphereLight(0xfffbeb, 0xcbd5e1, 0.88);
    this.scene.add(hemi);

    this.sunLight = new THREE.DirectionalLight(0xfff7ed, 2.15);
    this.sunLight.position.set(4, 18, 14);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 2;
    this.sunLight.shadow.camera.far = 52;
    this.sunLight.shadow.camera.left = -36;
    this.sunLight.shadow.camera.right = 38;
    this.sunLight.shadow.camera.top = 11;
    this.sunLight.shadow.camera.bottom = -2;
    this.sunLight.shadow.bias = -0.0005;
    this.scene.add(this.sunLight);

    [-20, 0, 20].forEach((lx) => {
      const pt = new THREE.PointLight(0xffedd5, 18, 26, 1.4);
      pt.position.set(lx, 5.4, 3.8);
      this.scene.add(pt);
    });
  }

  _buildGalleryArchitecture() {
    // 1. Herringbone Parquet Gallery Floor (160m x 92m — fills full wide-angle view with zero void)
    const floorGeo = new THREE.BoxGeometry(160, 0.5, 92);
    const floorMesh = new THREE.Mesh(floorGeo, this.materials.parquet);
    floorMesh.position.set(3, -0.25, 34);
    floorMesh.receiveShadow = true;
    this.environmentGroup.add(floorMesh);

    // 2. Studio Gallery Back Wall with Multi-Tier Clerestory & Acoustic Slat Bays
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xe2dac7,
      roughness: 0.82,
      metalness: 0.02
    });
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(160, 36, 0.4), wallMat);
    backWall.position.set(3, 17.5, -2.40);
    backWall.receiveShadow = true;
    this.environmentGroup.add(backWall);

    // Lower gallery wainscot paneling (adds architectural depth to lower wall)
    const wainscotMat = new THREE.MeshStandardMaterial({
      color: 0xd0c6b0,
      roughness: 0.72,
      metalness: 0.04
    });
    const wainscot = new THREE.Mesh(new THREE.BoxGeometry(160, 1.85, 0.34), wainscotMat);
    wainscot.position.set(3, 0.92, -2.30);
    wainscot.receiveShadow = true;
    this.environmentGroup.add(wainscot);

    const chairRail = new THREE.Mesh(
      new THREE.BoxGeometry(160, 0.09, 0.38),
      this.materials.walnut
    );
    chairRail.position.set(3, 1.86, -2.26);
    this.environmentGroup.add(chairRail);

    // Baseboard, mezzanine girders & high gallery frieze beams
    const beamMat = this.materials.castIron;
    const baseboard = new THREE.Mesh(new THREE.BoxGeometry(160, 0.24, 0.38), beamMat);
    baseboard.position.set(3, 0.12, -2.22);
    this.environmentGroup.add(baseboard);

    const highFrieze = new THREE.Mesh(new THREE.BoxGeometry(160, 0.24, 0.45), beamMat);
    highFrieze.position.set(3, 6.35, -2.08);
    this.environmentGroup.add(highFrieze);

    const upperMezzanineBeam = new THREE.Mesh(new THREE.BoxGeometry(160, 0.28, 0.48), beamMat);
    upperMezzanineBeam.position.set(3, 12.2, -2.08);
    this.environmentGroup.add(upperMezzanineBeam);

    const clerestoryTopBeam = new THREE.Mesh(new THREE.BoxGeometry(160, 0.34, 0.54), beamMat);
    clerestoryTopBeam.position.set(3, 18.0, -2.05);
    this.environmentGroup.add(clerestoryTopBeam);

    // Overhead Gallery Ceiling Deck & Transverse Steel Trusses (fills top of Overview Gallery Wide)
    const ceilingMat = new THREE.MeshStandardMaterial({
      color: 0xd6cebc,
      roughness: 0.85,
      metalness: 0.05
    });
    const ceilingSlab = new THREE.Mesh(new THREE.BoxGeometry(160, 0.5, 92), ceilingMat);
    ceilingSlab.position.set(3, 19.2, 34);
    this.environmentGroup.add(ceilingSlab);

    for (let tx = -45; tx <= 51; tx += 8) {
      const truss = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.55, 76), beamMat);
      truss.position.set(tx, 18.6, 26);
      this.environmentGroup.add(truss);
    }

    // Vertical industrial studio columns every 4 meters + warm oak slat bays across two tiers
    const windowGlassMat = new THREE.MeshBasicMaterial({
      color: 0xf7eed7
    });
    const upperWindowMat = new THREE.MeshBasicMaterial({
      color: 0xf5e9cc
    });
    for (let x = -49; x <= 55; x += 4) {
      const col = new THREE.Mesh(new THREE.BoxGeometry(0.20, 20.0, 0.40), beamMat);
      col.position.set(x, 9.6, -2.18);
      col.castShadow = true;
      this.environmentGroup.add(col);

      if (x < 55) {
        // Tier 1 studio window bay
        const winPane = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 3.6), windowGlassMat);
        winPane.position.set(x + 2.0, 4.2, -2.18);
        this.environmentGroup.add(winPane);

        // Tier 2 clerestory window bay (visible in Overview Gallery Wide)
        const upperPane = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 4.6), upperWindowMat);
        upperPane.position.set(x + 2.0, 9.3, -2.18);
        this.environmentGroup.add(upperPane);

        // Tier 3 upper studio clerestory bay
        const topPane = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 4.4), windowGlassMat);
        topPane.position.set(x + 2.0, 15.1, -2.18);
        this.environmentGroup.add(topPane);

        // Subtle vertical architectural wood mullion fins inside each bay
        for (let m = -1; m <= 1; m++) {
          const fin = new THREE.Mesh(
            new THREE.BoxGeometry(0.05, 3.6, 0.08),
            this.materials.oakSlat
          );
          fin.position.set(x + 2.0 + m * 0.95, 4.2, -2.16);
          this.environmentGroup.add(fin);

          const upperFin = new THREE.Mesh(
            new THREE.BoxGeometry(0.05, 4.6, 0.08),
            this.materials.oakSlat
          );
          upperFin.position.set(x + 2.0 + m * 0.95, 9.3, -2.16);
          this.environmentGroup.add(upperFin);
        }
      }
    }

    // 3. Stage Number Plaques (01..13) & Illuminated Beacons — positioned forward at z = -1.25 so never occluded or depth-clipped
    const plaqueBackMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.4,
      metalness: 0.6
    });
    STAGE_DEFINITIONS.forEach((stageDef) => {
      const group = new THREE.Group();
      const plaqueY =
        stageDef.id === 1
          ? 5.34
          : stageDef.id === 2
            ? 4.92
            : stageDef.id === 6
              ? 4.22
              : stageDef.id === 7
                ? 4.22
                : stageDef.id === 9
                  ? 4.55
                  : stageDef.id === 13
                    ? 3.45
                    : stageDef.id % 2 === 1
                      ? 4.45
                      : 4.15;
      const plaqueX =
        stageDef.id === 1
          ? -24.35
          : stageDef.id === 2
            ? -20.85
            : stageDef.id === 5
              ? -7.95
              : stageDef.id === 6
                ? -4.35
                : stageDef.id === 7
                  ? -0.55
                  : stageDef.id === 13
                    ? 27.35
                    : stageDef.cameraX;
      group.position.set(plaqueX, plaqueY, -1.25);

      const backing = new THREE.Mesh(new THREE.BoxGeometry(1.78, 0.90, 0.05), plaqueBackMat);
      backing.position.set(0, 0, -0.03);
      group.add(backing);

      // Vertical brushed-steel stanchions connecting the plaque to the workbench structure below
      const stanchions = [];
      [-0.68, 0.68].forEach((sx) => {
        const stanchion = new THREE.Mesh(
          new THREE.CylinderGeometry(0.018, 0.018, 1.35, 10),
          this.materials.gunmetal
        );
        stanchion.position.set(sx, -1.05, -0.04);
        group.add(stanchion);
        stanchions.push(stanchion);
      });

      const tex = createStagePlaqueTexture(stageDef, 'ready');
      const mat = new THREE.MeshBasicMaterial({ map: tex });
      const plaque = new THREE.Mesh(new THREE.PlaneGeometry(1.75, 0.88), mat);
      group.add(plaque);

      const beaconMat = new THREE.MeshStandardMaterial({
        color: 0x52525b,
        emissive: 0x000000,
        emissiveIntensity: 0.0,
        roughness: 0.2
      });
      const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 16), beaconMat);
      beacon.position.set(0, 0.56, 0.05);
      group.add(beacon);

      const overviewX =
        stageDef.id === 1
          ? -23.85
          : stageDef.id === 2
            ? -20.55
            : stageDef.id === 3
              ? -16.85
              : stageDef.id === 5
                ? -8.15
                : stageDef.id === 6
                  ? -4.75
                  : stageDef.id === 7
                    ? -1.15
                    : stageDef.id === 10
                      ? 13.55
                      : stageDef.id === 11
                        ? 18.05
                        : stageDef.id === 12
                          ? 23.3
                          : stageDef.id === 13
                            ? 29.2
                            : stageDef.cameraX;
      const overviewYMap = {
        1: 6.15,
        2: 5.15,
        3: 5.85,
        4: 3.95,
        5: 5.85,
        6: 4.55,
        7: 6.05,
        8: 4.25,
        9: 5.95,
        10: 4.45,
        11: 6.25,
        12: 4.85,
        13: 3.35
      };
      this.environmentGroup.add(group);
      this.stagePlaques.set(stageDef.id, {
        group,
        mesh: plaque,
        stanchions,
        stageDef,
        lastStatus: 'ready',
        baseX: plaqueX,
        baseY: plaqueY,
        overviewX,
        overviewY: overviewYMap[stageDef.id] || plaqueY
      });
      this.stageBeacons.set(stageDef.id, beacon);
    });

    // 4. Overhead Unfurling Finale Banner above Stage 13 (sleek gallery ribbon crowning the Hero Coupe)
    const bannerTex = createFinaleBannerTexture();
    const bannerMat = new THREE.MeshBasicMaterial({
      map: bannerTex,
      side: THREE.DoubleSide
    });
    this.finaleBannerMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.15, 0.58), bannerMat);
    this.finaleBannerMesh.position.set(30.35, 3.45, -1.05);
    this.finaleBannerMesh.scale.set(1, 0.01, 1);
    this.finaleBannerMesh.visible = false;
    this.environmentGroup.add(this.finaleBannerMesh);
  }

  rebuildFromSimulation(sim) {
    this._clearGroup(this.staticGroup);
    this._clearGroup(this.dynamicGroup);
    this._clearGroup(this.overlayGroup);
    this.dynamicMeshes.clear();
    this.wireframeMeshes.clear();
    this.comMarkers.clear();
    this.velocityArrows.clear();
    this.impulseArrows = [];
    this.glassCableLines = [];
    this.overviewCircularMeshes = [];

    for (const [id, entry] of this.stagePlaques.entries()) {
      entry.lastStatus = 'ready';
      entry.mesh.material.map.dispose();
      entry.mesh.material.map = createStagePlaqueTexture(entry.stageDef, 'ready');
      entry.mesh.material.needsUpdate = true;
      const beacon = this.stageBeacons.get(id);
      if (beacon) {
        beacon.material.color.setHex(0x52525b);
        beacon.material.emissive.setHex(0x000000);
      }
    }

    if (this.finaleBannerMesh) {
      this.finaleBannerMesh.visible = false;
      this.finaleBannerMesh.scale.set(1, 0.01, 1);
    }

    // 1. Build Static Ramps, Worktables, Stanchions & Pedestals
    for (const st of sim.staticColliders) {
      if (st.id === 'gallery-floor' || st.id === 'parquet-floor') continue;
      const mat = this._resolveStaticMaterial(st.kind);
      const geo = new THREE.BoxGeometry(st.hx * 2, st.hy * 2, st.hz * 2);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(st.x, st.y, st.z);
      mesh.rotation.z = st.angleZ || 0;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.staticGroup.add(mesh);

      // Add vertical gallery table support legs + horizontal tie crossbars down to floor
      if (st.y > 0.45 && st.hx >= 0.18 && st.kind !== 'glass-guide') {
        const legH = st.y - st.hy;
        if (legH > 0.2) {
          const legGeo = new THREE.CylinderGeometry(0.048, 0.058, legH, 12);
          const legOffsets = st.hx > 1.1 ? [-st.hx * 0.78, st.hx * 0.78] : [0];
          legOffsets.forEach((ox) => {
            const worldLegX = st.x + ox * Math.cos(st.angleZ || 0);
            const worldLegTopY = st.y + ox * Math.sin(st.angleZ || 0) - st.hy;
            const actualLegH = Math.max(0.2, worldLegTopY);
            const cLegGeo = new THREE.CylinderGeometry(0.048, 0.058, actualLegH, 12);
            [-st.hz * 0.72, st.hz * 0.72].forEach((oz) => {
              const leg = new THREE.Mesh(cLegGeo, this.materials.castIron);
              leg.position.set(worldLegX, actualLegH * 0.5, st.z + oz);
              leg.castShadow = true;
              this.staticGroup.add(leg);
            });
          });

          // Structural horizontal mid-brace between long table legs
          if (legOffsets.length === 2 && legH > 1.2) {
            const span = Math.abs(legOffsets[1] - legOffsets[0]) * 2 * Math.cos(st.angleZ || 0);
            const brace = new THREE.Mesh(
              new THREE.BoxGeometry(span, 0.06, 0.06),
              this.materials.gunmetal
            );
            brace.position.set(st.x, legH * 0.48, 0);
            this.staticGroup.add(brace);
          }
        }
      }

      // Special detail: Stage 01 Machined Brass Solenoid Starter Plunger Assembly
      if (st.id === 's1-backstop') {
        const solenoidGroup = new THREE.Group();
        solenoidGroup.position.set(st.x - 0.18, st.y - 0.05, st.z);

        const housing = new THREE.Mesh(
          new THREE.CylinderGeometry(0.14, 0.14, 0.36, 20),
          this.materials.brass
        );
        housing.rotation.z = Math.PI / 2;
        solenoidGroup.add(housing);

        const collar = new THREE.Mesh(
          new THREE.CylinderGeometry(0.17, 0.17, 0.08, 20),
          this.materials.gunmetal
        );
        collar.rotation.z = Math.PI / 2;
        collar.position.set(0.14, 0, 0);
        solenoidGroup.add(collar);

        const strikerRod = new THREE.Mesh(
          new THREE.CylinderGeometry(0.045, 0.045, 0.34, 16),
          this.materials.chrome
        );
        strikerRod.rotation.z = Math.PI / 2;
        strikerRod.position.set(0.24, 0, 0);
        solenoidGroup.add(strikerRod);

        const spring = createHelicalSpringMesh(0.075, 0.22, 5, 0.014, this.materials.springRed);
        spring.rotation.z = Math.PI / 2;
        spring.position.set(0.24, 0, 0);
        solenoidGroup.add(spring);

        this.staticGroup.add(solenoidGroup);
        this.solenoidGroup = solenoidGroup;
      }

      // Special detail: Key-Fob Red Illuminated Button on s13-fob-pedestal
      if (st.id === 's13-fob-pedestal') {
        const fobBase = new THREE.Mesh(
          new THREE.BoxGeometry(0.56, 0.08, 0.44),
          this.materials.gunmetal
        );
        fobBase.position.set(st.x, st.y + st.hy + 0.03, st.z);
        this.staticGroup.add(fobBase);

        const fobBtn = new THREE.Mesh(
          new THREE.CylinderGeometry(0.20, 0.23, 0.10, 24),
          this.materials.hondaRed
        );
        fobBtn.position.set(st.x, st.y + st.hy + 0.08, st.z);
        this.staticGroup.add(fobBtn);
        this.keyFobButtonMesh = fobBtn;
      }

      // Special detail: Twin Cross-Drilled Ventilated Brake Rotors + Crimson 4-Piston Calipers at Stage 12
      if (st.id === 's12-rotor-chute') {
        [-0.28, 0.28].forEach((oz) => {
          const rotorGroup = new THREE.Group();
          rotorGroup.position.set(st.x - 0.35, st.y + 0.18, oz);

          // Main stainless friction disc
          const disc = new THREE.Mesh(
            new THREE.CylinderGeometry(0.72, 0.72, 0.045, 36),
            this.materials.chrome
          );
          disc.rotation.x = Math.PI / 2;
          disc.castShadow = true;
          rotorGroup.add(disc);

          // Dark gunmetal center rotor hat + 5 wheel lugs
          const hat = new THREE.Mesh(
            new THREE.CylinderGeometry(0.32, 0.35, 0.08, 24),
            this.materials.gunmetal
          );
          hat.rotation.x = Math.PI / 2;
          rotorGroup.add(hat);

          for (let l = 0; l < 5; l++) {
            const la = (l / 5) * Math.PI * 2;
            const lug = new THREE.Mesh(
              new THREE.CylinderGeometry(0.028, 0.028, 0.11, 12),
              this.materials.brass
            );
            lug.rotation.x = Math.PI / 2;
            lug.position.set(Math.cos(la) * 0.19, Math.sin(la) * 0.19, 0);
            rotorGroup.add(lug);
          }

          // 12 radial cross-drilled ventilation slot bars across friction ring
          for (let s = 0; s < 12; s++) {
            const sa = (s / 12) * Math.PI * 2;
            const slot = new THREE.Mesh(
              new THREE.BoxGeometry(0.24, 0.018, 0.052),
              this.materials.castIron
            );
            slot.position.set(Math.cos(sa) * 0.52, Math.sin(sa) * 0.52, 0);
            slot.rotation.z = sa + 0.35;
            rotorGroup.add(slot);
          }

          // Crimson 4-Piston Brake Caliper gripping the upper-left quadrant
          const caliper = new THREE.Mesh(
            new THREE.BoxGeometry(0.36, 0.22, 0.14),
            this.materials.hondaRed
          );
          caliper.position.set(-0.46, 0.44, 0);
          caliper.rotation.z = 0.72;
          rotorGroup.add(caliper);

          const caliperBridge = new THREE.Mesh(
            new THREE.BoxGeometry(0.24, 0.08, 0.16),
            this.materials.brass
          );
          caliperBridge.position.set(-0.46, 0.44, 0);
          caliperBridge.rotation.z = 0.72;
          rotorGroup.add(caliperBridge);

          this.staticGroup.add(rotorGroup);
          this.overviewCircularMeshes.push(rotorGroup);
        });
      }

      // Static collider wireframe overlay
      const wf = new THREE.Mesh(geo, this.materials.wireframeAmber);
      wf.position.copy(mesh.position);
      wf.rotation.copy(mesh.rotation);
      wf.visible = this.overlays.wireframes;
      this.overlayGroup.add(wf);
      this.wireframeMeshes.set(`static_${st.id}`, wf);
    }

    // Add Rain Droplets particle group above Stage 10 sensor pad
    this.rainDropletsGroup = new THREE.Group();
    this.rainDropletsGroup.position.set(13.85, 1.65, 0);
    this.rainDropletsGroup.visible = false;
    const dropMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    for (let i = 0; i < 8; i++) {
      const d = new THREE.Mesh(new THREE.SphereGeometry(0.028, 8, 8), dropMat);
      d.position.set((i - 3.5) * 0.06, (i % 3) * 0.08, (i % 2 - 0.5) * 0.08);
      this.rainDropletsGroup.add(d);
    }
    this.staticGroup.add(this.rainDropletsGroup);

    // 2. Build Dynamic Automotive Component Meshes + Debug Overlays
    for (const [id, entry] of sim.bodies.entries()) {
      const group = this._buildComponentMesh(id, entry);
      this.dynamicGroup.add(group);
      this.dynamicMeshes.set(id, group);

      // Dynamic wireframe
      const wfGeo = entry.radius
        ? new THREE.SphereGeometry(entry.radius, 18, 14)
        : new THREE.BoxGeometry((entry.hx || 0.3) * 2, (entry.hy || 0.2) * 2, (entry.hz || 0.2) * 2);
      const wfMesh = new THREE.Mesh(wfGeo, this.materials.wireframeCyan);
      wfMesh.visible = this.overlays.wireframes;
      this.overlayGroup.add(wfMesh);
      this.wireframeMeshes.set(id, wfMesh);

      // Center-of-Mass (CoM) marker (3D crosshair diamond)
      const isTire = entry.kind === 'tire' || entry.kind === 'uphill-tire';
      const comGroup = new THREE.Group();
      const comSphere = new THREE.Mesh(
        new THREE.OctahedronGeometry(isTire ? 0.10 : 0.065, 0),
        new THREE.MeshBasicMaterial({
          color: isTire ? 0xf97316 : 0xec4899
        })
      );
      comGroup.add(comSphere);
      comGroup.visible = this.overlays.comMarkers;
      this.overlayGroup.add(comGroup);
      this.comMarkers.set(id, comGroup);

      // Velocity Vector Arrow
      const velArrow = new THREE.ArrowHelper(
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(0, 0, 0),
        0.5,
        0x10b981,
        0.16,
        0.09
      );
      velArrow.visible = false;
      this.overlayGroup.add(velArrow);
      this.velocityArrows.set(id, velArrow);

      // Suspended Glass Louver Cables
      if (entry.kind === 'glass-louver') {
        const lineMat = new THREE.LineBasicMaterial({ color: 0x94a3b8 });
        const pts = [
          new THREE.Vector3(entry.pivotX, entry.pivotY, 0),
          new THREE.Vector3(entry.pivotX, entry.pivotY - 1.15, 0)
        ];
        const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
        const line = new THREE.Line(lineGeo, lineMat);
        this.staticGroup.add(line);
        this.glassCableLines.push({ id, line, pivotX: entry.pivotX, pivotY: entry.pivotY });
      }
    }

    // Pool of Contact Impulse Force Arrows
    for (let i = 0; i < 13; i++) {
      const impArrow = new THREE.ArrowHelper(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 0, 0),
        0.8,
        0xf97316,
        0.22,
        0.12
      );
      impArrow.visible = false;
      this.overlayGroup.add(impArrow);
      this.impulseArrows.push(impArrow);
    }

    this.syncFromSnapshot(sim.getTelemetrySnapshot());
    this._syncResponsiveSceneScale();
  }

  _resolveStaticMaterial(kind) {
    switch (kind) {
      case 'wood-ramp':
        return this.materials.walnut;
      case 'timber-ramp':
        return this.materials.timberRamp;
      case 'brass':
        return this.materials.brass;
      case 'steel-shelf':
      case 'cable-rail':
      case 'rotor-track':
        return this.materials.gunmetal;
      case 'aluminum-deck':
        return this.materials.aluminum;
      case 'sensor-pad':
        return this.materials.sensorPad;
      case 'key-fob':
        return this.materials.castIron;
      case 'glass-guide':
        return this.materials.glass;
      default:
        return this.materials.castIron;
    }
  }

  _buildComponentMesh(id, entry) {
    const g = new THREE.Group();

    switch (entry.kind) {
      case 'sphere': {
        const mat = entry.material === 'chrome' ? this.materials.chrome : this.materials.brass;
        const sphere = new THREE.Mesh(new THREE.SphereGeometry(entry.radius, 32, 28), mat);
        sphere.castShadow = true;
        g.add(sphere);
        const band = new THREE.Mesh(
          new THREE.TorusGeometry(entry.radius * 0.99, entry.radius * 0.045, 12, 32),
          this.materials.brass
        );
        g.add(band);
        break;
      }

      case 'synchro':
      case 'synchro-ring': {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(0.20, 0.055, 16, 28),
          this.materials.brass
        );
        ring.castShadow = true;
        g.add(ring);

        // Synchro dog teeth around outer ring
        for (let i = 0; i < 8; i++) {
          const a = (i / 8) * Math.PI * 2;
          const dog = new THREE.Mesh(
            new THREE.BoxGeometry(0.05, 0.05, 0.14),
            this.materials.brass
          );
          dog.position.set(Math.cos(a) * 0.24, Math.sin(a) * 0.24, 0);
          dog.rotation.z = a;
          g.add(dog);
        }

        const strut = new THREE.Mesh(
          new THREE.BoxGeometry(0.09, 0.42, 0.14),
          this.materials.chrome
        );
        g.add(strut);
        break;
      }

      case 'gear':
      case 'helical-gear': {
        const R = entry.radius;
        // Machined gunmetal gear web
        const body = new THREE.Mesh(
          new THREE.CylinderGeometry(R * 0.86, R * 0.86, 0.24, 32),
          this.materials.gunmetal
        );
        body.rotation.x = Math.PI / 2;
        body.castShadow = true;
        g.add(body);

        // Stepped outer rim collar
        const rimRing = new THREE.Mesh(
          new THREE.TorusGeometry(R * 0.82, 0.04, 12, 32),
          this.materials.chrome
        );
        rimRing.position.set(0, 0, 0.11);
        g.add(rimRing);

        // Chamfered bronze synchronizer cone + splined central bore
        const hub = new THREE.Mesh(
          new THREE.CylinderGeometry(R * 0.36, R * 0.44, 0.30, 24),
          this.materials.brass
        );
        hub.rotation.x = Math.PI / 2;
        g.add(hub);

        const bore = new THREE.Mesh(
          new THREE.CylinderGeometry(R * 0.18, R * 0.18, 0.33, 20),
          this.materials.castIron
        );
        bore.rotation.x = Math.PI / 2;
        g.add(bore);

        // 6 machined lightening pockets on the gear face
        for (let p = 0; p < 6; p++) {
          const pa = (p / 6) * Math.PI * 2;
          const pocket = new THREE.Mesh(
            new THREE.CylinderGeometry(R * 0.13, R * 0.13, 0.26, 16),
            this.materials.castIron
          );
          pocket.rotation.x = Math.PI / 2;
          pocket.position.set(Math.cos(pa) * (R * 0.60), Math.sin(pa) * (R * 0.60), 0);
          g.add(pocket);
        }

        // 18 angled Helical Gear Teeth (twisted at 20° helix angle)
        const toothGeo = new THREE.BoxGeometry(0.068, 0.11, 0.25);
        for (let i = 0; i < 18; i++) {
          const angle = (i / 18) * Math.PI * 2;
          const tooth = new THREE.Mesh(toothGeo, this.materials.chrome);
          tooth.position.set(Math.cos(angle) * (R * 0.91), Math.sin(angle) * (R * 0.91), 0);
          tooth.rotation.z = angle;
          tooth.rotation.x = 0.34; // Helical tooth twist
          tooth.castShadow = true;
          g.add(tooth);
        }
        break;
      }

      case 'camshaft': {
        const beam = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.16, 0.32), this.materials.castIron);
        beam.castShadow = true;
        g.add(beam);
        const lobe = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.72, 0.28), this.materials.brass);
        lobe.position.set(0, 0.36, 0);
        lobe.castShadow = true;
        g.add(lobe);
        const journal = new THREE.Mesh(
          new THREE.CylinderGeometry(0.18, 0.18, 0.42, 24),
          this.materials.chrome
        );
        journal.rotation.x = Math.PI / 2;
        g.add(journal);
        break;
      }

      case 'pushrod': {
        const rod = new THREE.Mesh(
          new THREE.CylinderGeometry(0.055, 0.055, entry.hx * 2, 16),
          this.materials.chrome
        );
        rod.rotation.z = Math.PI / 2;
        rod.castShadow = true;
        g.add(rod);
        [-entry.hx + 0.06, entry.hx - 0.06].forEach((ox) => {
          const cap = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.14, 0.22), this.materials.brass);
          cap.position.set(ox, 0, 0);
          g.add(cap);
        });
        break;
      }

      case 'trolley': {
        const sheave = new THREE.Mesh(
          new THREE.CylinderGeometry(entry.radius, entry.radius, 0.16, 24),
          this.materials.brass
        );
        sheave.rotation.x = Math.PI / 2;
        sheave.castShadow = true;
        g.add(sheave);
        const rim = new THREE.Mesh(
          new THREE.TorusGeometry(entry.radius * 0.85, 0.04, 10, 24),
          this.materials.chrome
        );
        g.add(rim);
        break;
      }

      case 'valve':
      case 'valve-domino': {
        const stem = new THREE.Mesh(
          new THREE.CylinderGeometry(0.032, 0.032, entry.hy * 1.9, 14),
          this.materials.chrome
        );
        stem.castShadow = true;
        g.add(stem);
        const head = new THREE.Mesh(
          new THREE.CylinderGeometry(0.08, 0.14, 0.08, 20),
          this.materials.chrome
        );
        head.position.set(0, -entry.hy + 0.04, 0);
        g.add(head);
        const tip = new THREE.Mesh(
          new THREE.CylinderGeometry(0.055, 0.055, 0.09, 16),
          this.materials.brass
        );
        tip.position.set(0, entry.hy - 0.05, 0);
        g.add(tip);
        break;
      }

      case 'tire':
      case 'uphill-tire': {
        // Sculpted radial automotive tire (R = 0.52m) with 5-spoke alloy wheel
        // AND internal Copper Counterweight Crescent housed completely INSIDE the rim barrel!
        const R = entry.radius;
        const tireTread = new THREE.Mesh(
          new THREE.CylinderGeometry(R, R, 0.34, 36, 1, false),
          this.materials.tireRubber
        );
        tireTread.rotation.x = Math.PI / 2;
        tireTread.castShadow = true;
        tireTread.receiveShadow = true;
        g.add(tireTread);

        // Molded rubber sidewalls (outer radius stays within R = 0.52m)
        [-0.15, 0.15].forEach((oz) => {
          const wall = new THREE.Mesh(
            new THREE.TorusGeometry(R * 0.78, R * 0.19, 14, 36),
            this.materials.tireRubber
          );
          wall.position.set(0, 0, oz);
          g.add(wall);
        });

        // Deep-dish alloy rim barrel (dark gunmetal inner well so the copper counterweight inside stands out)
        const innerWell = new THREE.Mesh(
          new THREE.CylinderGeometry(R * 0.62, R * 0.62, 0.28, 32),
          this.materials.castIron
        );
        innerWell.rotation.x = Math.PI / 2;
        g.add(innerWell);

        // Outer machined alloy wheel lip
        [-0.16, 0.16].forEach((oz) => {
          const lip = new THREE.Mesh(
            new THREE.TorusGeometry(R * 0.62, 0.028, 12, 32),
            this.materials.aluminum
          );
          lip.position.set(0, 0, oz);
          g.add(lip);
        });

        // Internal Copper Counterweight Crescent bolted INSIDE the rim barrel (at r = 0.24m < rim 0.32m)
        // Never protrudes outside the tire tread!
        const cwOffset = entry.cwOffset || { x: 0.035, y: 0.43 };
        const cwCenterAngle = Math.atan2(cwOffset.y, cwOffset.x);
        const arcSpan = Math.PI * 0.76;
        const cwArc = new THREE.Mesh(
          new THREE.TorusGeometry(R * 0.45, 0.068, 14, 28, arcSpan),
          this.materials.copper
        );
        cwArc.rotation.z = cwCenterAngle - arcSpan * 0.5;
        cwArc.position.set(0, 0, 0.11);
        g.add(cwArc);

        const cwArcBack = cwArc.clone();
        cwArcBack.position.set(0, 0, -0.11);
        g.add(cwArcBack);

        // 5 sculpted alloy spokes on the wheel face + center cap
        const spokeGeo = new THREE.BoxGeometry(R * 1.18, 0.065, 0.045);
        for (let s = 0; s < 5; s++) {
          const spFront = new THREE.Mesh(spokeGeo, this.materials.chrome);
          spFront.rotation.z = (s / 5) * Math.PI;
          spFront.position.z = 0.155;
          g.add(spFront);
        }

        const centerCap = new THREE.Mesh(
          new THREE.CylinderGeometry(0.09, 0.09, 0.36, 20),
          this.materials.brass
        );
        centerCap.rotation.x = Math.PI / 2;
        g.add(centerCap);
        break;
      }

      case 'piston': {
        const crown = new THREE.Mesh(
          new THREE.CylinderGeometry(0.24, 0.24, 0.36, 28),
          this.materials.aluminum
        );
        crown.position.set(0, 0.08, 0);
        crown.castShadow = true;
        g.add(crown);

        // 3 machined piston compression rings
        [0.18, 0.12, 0.06].forEach((ry) => {
          const pRing = new THREE.Mesh(
            new THREE.TorusGeometry(0.242, 0.012, 8, 28),
            this.materials.brass
          );
          pRing.rotation.x = Math.PI / 2;
          pRing.position.set(0, ry, 0);
          g.add(pRing);
        });

        const conRod = new THREE.Mesh(
          new THREE.BoxGeometry(0.11, 0.48, 0.14),
          this.materials.castIron
        );
        conRod.position.set(0, -0.14, 0);
        g.add(conRod);
        break;
      }

      case 'seesaw': {
        const beam = new THREE.Mesh(
          new THREE.BoxGeometry(entry.hx * 2, entry.hy * 2, entry.hz * 2),
          this.materials.castIron
        );
        beam.castShadow = true;
        g.add(beam);
        const pivotCap = new THREE.Mesh(
          new THREE.CylinderGeometry(0.14, 0.14, entry.hz * 2.2, 18),
          this.materials.brass
        );
        pivotCap.rotation.x = Math.PI / 2;
        g.add(pivotCap);
        break;
      }

      case 'muffler': {
        const shell = new THREE.Mesh(
          new THREE.CylinderGeometry(entry.radius, entry.radius, 0.72, 28),
          this.materials.chrome
        );
        shell.rotation.x = Math.PI / 2;
        shell.castShadow = true;
        g.add(shell);

        [-0.22, 0.22].forEach((oz) => {
          const strap = new THREE.Mesh(
            new THREE.CylinderGeometry(entry.radius * 1.02, entry.radius * 1.02, 0.06, 24),
            this.materials.brass
          );
          strap.rotation.x = Math.PI / 2;
          strap.position.set(0, 0, oz);
          g.add(strap);
        });
        const rib = new THREE.Mesh(
          new THREE.BoxGeometry(entry.radius * 2.04, 0.06, 0.74),
          this.materials.castIron
        );
        g.add(rib);
        break;
      }

      case 'lever':
      case 'trip-lever': {
        const lever = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.56, 0.28), this.materials.brass);
        g.add(lever);
        break;
      }

      case 'glass-louver': {
        const pane = new THREE.Mesh(
          new THREE.BoxGeometry(entry.hx * 2, entry.hy * 2, entry.hz * 2),
          this.materials.glass
        );
        pane.castShadow = true;
        g.add(pane);
        const topClamp = new THREE.Mesh(
          new THREE.BoxGeometry(entry.hx * 2.2, 0.09, entry.hz * 2.05),
          this.materials.brass
        );
        topClamp.position.set(0, entry.hy, 0);
        g.add(topClamp);
        break;
      }

      case 'carafe': {
        const vessel = new THREE.Mesh(
          new THREE.CylinderGeometry(0.12, 0.17, 0.52, 20),
          this.materials.copper
        );
        vessel.castShadow = true;
        g.add(vessel);
        const water = new THREE.Mesh(
          new THREE.CylinderGeometry(0.11, 0.14, 0.28, 16),
          this.materials.sensorPad
        );
        water.position.set(0, 0.08, 0);
        g.add(water);
        break;
      }

      case 'wiper-crawler': {
        const chassis = new THREE.Mesh(
          new THREE.BoxGeometry(0.88, 0.18, 0.48),
          this.materials.gunmetal
        );
        chassis.castShadow = true;
        g.add(chassis);
        const motorCan = new THREE.Mesh(
          new THREE.CylinderGeometry(0.13, 0.13, 0.34, 18),
          this.materials.brass
        );
        motorCan.rotation.z = Math.PI / 2;
        motorCan.position.set(-0.12, 0.14, 0);
        g.add(motorCan);

        [-0.25, 0.25].forEach((ox) => {
          const blade = new THREE.Mesh(
            new THREE.BoxGeometry(0.42, 0.05, 0.56),
            this.materials.tireRubber
          );
          blade.position.set(ox, -0.14, 0);
          g.add(blade);
        });
        break;
      }

      case 'catapult': {
        // Stage 11: Pivoted brass catapult beam + true 7-turn wound Helical Suspension Coil Spring
        const arm = new THREE.Mesh(
          new THREE.BoxGeometry(entry.hx * 2, entry.hy * 2, entry.hz * 2),
          this.materials.brass
        );
        arm.castShadow = true;
        g.add(arm);

        const helicalCoil = createHelicalSpringMesh(
          0.16,
          0.46,
          6.5,
          0.024,
          this.materials.springRed
        );
        helicalCoil.position.set(0.35, -0.25, 0);
        g.add(helicalCoil);

        const damperShaft = new THREE.Mesh(
          new THREE.CylinderGeometry(0.045, 0.045, 0.48, 14),
          this.materials.chrome
        );
        damperShaft.position.set(0.35, -0.25, 0);
        g.add(damperShaft);
        break;
      }

      case 'scale-pan': {
        const tray = new THREE.Mesh(
          new THREE.BoxGeometry(entry.hx * 2, entry.hy * 2, entry.hz * 2),
          this.materials.brass
        );
        tray.castShadow = true;
        g.add(tray);
        break;
      }

      case 'shock-absorber': {
        // Stage 13: Bilstein yellow gas-strut reservoir + chrome rod + true wound Helical Coil Spring
        const strut = new THREE.Mesh(
          new THREE.CylinderGeometry(0.095, 0.095, 0.80, 20),
          this.materials.bilsteinYellow
        );
        strut.castShadow = true;
        g.add(strut);

        const pistonRod = new THREE.Mesh(
          new THREE.CylinderGeometry(0.045, 0.045, 0.92, 16),
          this.materials.chrome
        );
        pistonRod.position.set(0, 0.06, 0);
        g.add(pistonRod);

        const coilSpring = createHelicalSpringMesh(
          0.17,
          0.52,
          7.0,
          0.025,
          this.materials.springRed
        );
        coilSpring.position.set(0, 0.08, 0);
        g.add(coilSpring);

        [-0.18, 0.34].forEach((py) => {
          const perch = new THREE.Mesh(
            new THREE.CylinderGeometry(0.19, 0.19, 0.04, 24),
            this.materials.aluminum
          );
          perch.position.set(0, py, 0);
          g.add(perch);
        });
        break;
      }

      case 'trailer-deck': {
        const deck = new THREE.Mesh(
          new THREE.BoxGeometry(entry.hx * 2, entry.hy * 2, entry.hz * 2),
          this.materials.aluminum
        );
        deck.castShadow = true;
        deck.receiveShadow = true;
        g.add(deck);

        [-entry.hz + 0.04, entry.hz - 0.04].forEach((oz) => {
          const rail = new THREE.Mesh(
            new THREE.BoxGeometry(entry.hx * 2, 0.16, 0.06),
            this.materials.hondaRed
          );
          rail.position.set(0, 0.10, oz);
          g.add(rail);
        });
        break;
      }

      case 'hero-coupe': {
        // Sculpted Accord-Red Fastback Touring Coupe (Extruded aerodynamic silhouette + glasshouse + 5-spoke wheels)
        const bodyShape = new THREE.Shape();
        bodyShape.moveTo(-0.74, -0.14);
        bodyShape.lineTo(0.76, -0.14); // Lower rocker sill
        bodyShape.lineTo(0.82, -0.02); // Front chin splitter
        bodyShape.lineTo(0.78, 0.12);  // Front nose & grille
        bodyShape.lineTo(0.36, 0.18);  // Sloped aerodynamic hood
        bodyShape.lineTo(0.08, 0.42);  // Raked windshield A-pillar
        bodyShape.lineTo(-0.34, 0.42); // Fastback roofline
        bodyShape.lineTo(-0.66, 0.22); // Rear C-pillar fastback slope
        bodyShape.lineTo(-0.76, 0.19); // Rear decklid spoiler
        bodyShape.lineTo(-0.78, -0.04); // Rear bumper valence
        bodyShape.closePath();

        const bodyGeo = new THREE.ExtrudeGeometry(bodyShape, {
          depth: 0.64,
          bevelEnabled: true,
          bevelSegments: 3,
          steps: 1,
          bevelSize: 0.03,
          bevelThickness: 0.03
        });
        bodyGeo.center();
        const bodyMesh = new THREE.Mesh(bodyGeo, this.materials.hondaRed);
        bodyMesh.position.set(0, 0.12, 0);
        bodyMesh.castShadow = true;
        bodyMesh.receiveShadow = true;
        g.add(bodyMesh);

        // Tinted fastback glasshouse cabin inset
        const glassShape = new THREE.Shape();
        glassShape.moveTo(0.30, 0.18);
        glassShape.lineTo(0.06, 0.39);
        glassShape.lineTo(-0.32, 0.39);
        glassShape.lineTo(-0.60, 0.21);
        glassShape.closePath();

        const glassGeo = new THREE.ExtrudeGeometry(glassShape, {
          depth: 0.56,
          bevelEnabled: true,
          bevelSegments: 2,
          steps: 1,
          bevelSize: 0.015,
          bevelThickness: 0.015
        });
        glassGeo.center();
        const cabinMesh = new THREE.Mesh(glassGeo, this.materials.tintedGlass);
        cabinMesh.position.set(-0.11, 0.26, 0);
        g.add(cabinMesh);

        // Front radiator grille + LED projector headlamps
        const grille = new THREE.Mesh(
          new THREE.BoxGeometry(0.05, 0.11, 0.46),
          this.materials.castIron
        );
        grille.position.set(0.80, 0.03, 0);
        g.add(grille);

        [-0.22, 0.22].forEach((oz) => {
          const headlamp = new THREE.Mesh(
            new THREE.BoxGeometry(0.06, 0.06, 0.13),
            this.materials.headlightGlow
          );
          headlamp.position.set(0.79, 0.09, oz);
          g.add(headlamp);

          const taillamp = new THREE.Mesh(
            new THREE.BoxGeometry(0.05, 0.07, 0.16),
            this.materials.taillightGlow
          );
          taillamp.position.set(-0.77, 0.11, oz);
          g.add(taillamp);
        });

        // 4 Sculpted 5-Spoke Radial Tires & Alloy Rims in Recessed Wheel Arches
        [
          [-0.44, -0.17, 0.33],
          [0.44, -0.17, 0.33],
          [-0.44, -0.17, -0.33],
          [0.44, -0.17, -0.33]
        ].forEach(([wx, wy, wz]) => {
          const wheelGroup = new THREE.Group();
          wheelGroup.position.set(wx, wy, wz);

          // Dark wheel well arch liner
          const arch = new THREE.Mesh(
            new THREE.CylinderGeometry(0.24, 0.24, 0.08, 24),
            this.materials.castIron
          );
          arch.rotation.x = Math.PI / 2;
          arch.position.z = wz > 0 ? -0.04 : 0.04;
          wheelGroup.add(arch);

          // Rubber tire tread + sidewall
          const tire = new THREE.Mesh(
            new THREE.CylinderGeometry(0.21, 0.21, 0.13, 28),
            this.materials.tireRubber
          );
          tire.rotation.x = Math.PI / 2;
          tire.castShadow = true;
          wheelGroup.add(tire);

          const sidewall = new THREE.Mesh(
            new THREE.TorusGeometry(0.165, 0.042, 10, 24),
            this.materials.tireRubber
          );
          sidewall.position.z = wz > 0 ? 0.055 : -0.055;
          wheelGroup.add(sidewall);

          // Alloy rim + 5 chrome spokes
          const rim = new THREE.Mesh(
            new THREE.CylinderGeometry(0.135, 0.135, 0.14, 24),
            this.materials.aluminum
          );
          rim.rotation.x = Math.PI / 2;
          wheelGroup.add(rim);

          for (let sp = 0; sp < 5; sp++) {
            const spoke = new THREE.Mesh(
              new THREE.BoxGeometry(0.25, 0.026, 0.15),
              this.materials.chrome
            );
            spoke.rotation.z = (sp / 5) * Math.PI;
            wheelGroup.add(spoke);
          }

          g.add(wheelGroup);
        });
        break;
      }

      default: {
        const box = new THREE.Mesh(
          new THREE.BoxGeometry((entry.hx || 0.25) * 2, (entry.hy || 0.2) * 2, (entry.hz || 0.2) * 2),
          this.materials.chrome
        );
        box.castShadow = true;
        g.add(box);
        break;
      }
    }

    return g;
  }

  setDrawerState(isOpen, drawerWidth = 336) {
    this.drawerOpen = Boolean(isOpen);
    this.drawerWidth = drawerWidth;
    this._applyCameraViewOffset();
  }

  _applyCameraViewOffset() {
    const w = this.canvas.clientWidth || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;
    if (w >= 900 && this.drawerOpen) {
      // Shift optical center left so the 3D scene centers inside the unoccluded (w - drawerWidth) area
      const offsetX = Math.round(this.drawerWidth * 0.50);
      this.camera.setViewOffset(w, h, offsetX, 0, w, h);
    } else {
      this.camera.clearViewOffset();
    }
    this.camera.updateProjectionMatrix();
    this._syncResponsiveSceneScale();
  }

  _syncResponsiveSceneScale() {
    this._syncPlaquePositions(this.desiredCamPos || this.camera.position);

    if (this.overviewCircularMeshes) {
      for (const m of this.overviewCircularMeshes) {
        m.scale.set(1, 1, 1);
      }
    }

    if (this.dynamicMeshes) {
      for (const mesh of this.dynamicMeshes.values()) {
        mesh.scale.set(1, 1, 1);
      }
    }
    if (this.solenoidGroup) {
      this.solenoidGroup.scale.set(1, 1, 1);
    }
  }

  setOverlayFlag(key, value) {
    this.overlays[key] = Boolean(value);
    if (key === 'wireframes') {
      for (const wf of this.wireframeMeshes.values()) {
        wf.visible = this.overlays.wireframes;
      }
    } else if (key === 'comMarkers') {
      for (const cm of this.comMarkers.values()) {
        cm.visible = this.overlays.comMarkers;
      }
    } else if (key === 'velocityVectors') {
      for (const va of this.velocityArrows.values()) {
        if (!this.overlays.velocityVectors) va.visible = false;
      }
    } else if (key === 'impulseArrows') {
      this.impulseArrows.forEach((ia) => {
        if (!this.overlays.impulseArrows) ia.visible = false;
      });
    }
  }

  _getPortraitZoomMultiplier() {
    const w = this.canvas.clientWidth || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;
    const aspect = w / Math.max(1, h);
    return aspect < 1.0 ? 1.54 : 1.0;
  }

  _syncPlaquePositions(camPos = this.camera.position) {
    if (!this.stagePlaques) return;
    const isOv = this.cameraMode === 'overview';
    const isPortrait = this._getPortraitZoomMultiplier() > 1.05;
    for (const [id, entry] of this.stagePlaques.entries()) {
      if (!entry.group) continue;
      entry.group.visible = !(isPortrait && id >= 3 && this.cameraMode === 'dolly');
      let targetPX = isOv ? entry.overviewX : entry.baseX;
      let targetPY = isOv ? entry.overviewY : entry.baseY;
      if (!isOv && isPortrait) {
        if (id === 1) {
          targetPX = -22.55;
          targetPY = 6.05;
        } else if (id === 2) {
          targetPX = -19.05;
          targetPY = 4.95;
        }
      }
      entry.group.position.set(targetPX, targetPY, -1.25);
      entry.group.scale.set(isOv ? 1.2 : 1, isOv ? 1.2 : 1, 1);
      if (entry.stanchions) {
        entry.stanchions.forEach((s) => {
          s.visible = !isOv && !isPortrait;
        });
      }
      const yawToCam = Math.atan2(camPos.x - targetPX, camPos.z - -1.25);
      entry.group.rotation.y = (isOv || isPortrait) ? yawToCam * 0.55 : 0;
    }
  }

  setCameraMode(mode, stageId = null) {
    this.cameraMode = mode;
    if (stageId !== null) {
      this.inspectedStageId = stageId;
    }
    const zMult = this._getPortraitZoomMultiplier();
    if (mode === 'overview') {
      // Elevated 3/4 oblique gallery camera looking down the 58m chain reaction with true 1:1 uniform perspective
      this.desiredCamPos.set(-34.8, 7.2, 24.5 * zMult);
      this.desiredTarget.set(-9.2, 2.35, -0.5);
    } else if (mode === 'stage') {
      const st = STAGE_DEFINITIONS[(this.inspectedStageId || 1) - 1] || STAGE_DEFINITIONS[0];
      this.desiredCamPos.set(st.cameraX, st.cameraY + 0.85, 7.6 * zMult);
      this.desiredTarget.set(st.cameraX, st.cameraY + 0.15, 0);
    }
    this._applyCameraViewOffset();
    this._syncPlaquePositions(this.desiredCamPos);
  }

  focusStage(stageId) {
    this.inspectedStageId = stageId;
    const st = STAGE_DEFINITIONS[stageId - 1] || STAGE_DEFINITIONS[0];
    const zMult = this._getPortraitZoomMultiplier();
    this.cameraMode = 'stage';
    this.desiredCamPos.set(st.cameraX, st.cameraY + 0.85, 7.6 * zMult);
    this.desiredTarget.set(st.cameraX, st.cameraY + 0.15, 0);
    this._applyCameraViewOffset();
  }

  syncFromSnapshot(snapshot, dtMs = 16.6) {
    if (!snapshot) return;
    const camAlpha = Math.min(1.0, 1.0 - Math.pow(0.84, Math.max(1, dtMs / 16.6)));

    // 1. Update all dynamic body transforms, wireframes, CoM markers & velocity arrows
    for (const [id, b] of Object.entries(snapshot.bodies)) {
      const mesh = this.dynamicMeshes.get(id);
      if (mesh) {
        mesh.position.set(b.x, b.y, b.z);
        if (b.kind === 'hero-coupe') {
          const trailer = snapshot.bodies.finalePlatform;
          mesh.rotation.set(0, 0, trailer ? trailer.angleZ : 0);
        } else {
          mesh.quaternion.set(b.qx, b.qy, b.qz, b.qw);
        }
      }

      const wf = this.wireframeMeshes.get(id);
      if (wf) {
        wf.position.set(b.x, b.y, b.z);
        wf.quaternion.set(b.qx, b.qy, b.qz, b.qw);
        wf.visible = this.overlays.wireframes;
      }

      const com = this.comMarkers.get(id);
      if (com) {
        com.position.set(b.comX, b.comY, b.z + 0.32);
        com.rotation.z += 0.03;
        com.visible = this.overlays.comMarkers;
      }

      const velArrow = this.velocityArrows.get(id);
      if (velArrow) {
        if (this.overlays.velocityVectors && b.speed > 0.08) {
          velArrow.visible = true;
          velArrow.position.set(b.x, b.y, b.z + 0.35);
          const dir = new THREE.Vector3(b.vx, b.vy, 0).normalize();
          velArrow.setDirection(dir);
          velArrow.setLength(Math.min(2.4, 0.35 + b.speed * 0.35), 0.18, 0.10);
        } else {
          velArrow.visible = false;
        }
      }
    }

    // 2. Update suspended glass louver cable lines
    for (const item of this.glassCableLines) {
      const b = snapshot.bodies[item.id];
      if (b) {
        const posAttr = item.line.geometry.attributes.position;
        posAttr.setXYZ(0, item.pivotX, item.pivotY, 0);
        posAttr.setXYZ(1, b.x, b.y + 0.40, b.z);
        posAttr.needsUpdate = true;
      }
    }

    // 3. Stage 10 Rain Droplets splash animation
    if (this.rainDropletsGroup) {
      const s10Active = snapshot.stageStatus[10] === 'active' || snapshot.stageStatus[10] === 'complete';
      this.rainDropletsGroup.visible = s10Active;
      if (s10Active) {
        this.rainDropletsGroup.children.forEach((drop, idx) => {
          drop.position.y = -((snapshot.simTime * 1.8 + idx * 0.12) % 0.25);
        });
      }
    }

    // 4. Update Stage Plaques & Beacons (01..13)
    this._syncPlaquePositions(this.desiredCamPos);
    for (const [id, entry] of this.stagePlaques.entries()) {
      const status = snapshot.stageStatus[id] || 'ready';
      if (status !== entry.lastStatus) {
        entry.lastStatus = status;
        entry.mesh.material.map.dispose();
        entry.mesh.material.map = createStagePlaqueTexture(entry.stageDef, status);
        entry.mesh.material.needsUpdate = true;

        const beacon = this.stageBeacons.get(id);
        if (beacon) {
          if (status === 'active') {
            beacon.material.color.setHex(0xfbbf24);
            beacon.material.emissive.setHex(0xf59e0b);
            beacon.material.emissiveIntensity = 1.6;
          } else if (status === 'complete') {
            beacon.material.color.setHex(0x34d399);
            beacon.material.emissive.setHex(0x10b981);
            beacon.material.emissiveIntensity = 0.9;
          } else if (status === 'failed') {
            beacon.material.color.setHex(0xf87171);
            beacon.material.emissive.setHex(0xef4444);
            beacon.material.emissiveIntensity = 1.6;
          } else {
            beacon.material.color.setHex(0x52525b);
            beacon.material.emissive.setHex(0x000000);
            beacon.material.emissiveIntensity = 0.0;
          }
        }
      }
    }

    // 5. Update Contact Impulse Force Arrows
    this.impulseArrows.forEach((ia, idx) => {
      const stId = idx + 1;
      const imp = snapshot.stageImpulses[stId];
      const stDef = STAGE_DEFINITIONS[idx];
      if (this.overlays.impulseArrows && imp && stDef) {
        ia.visible = true;
        ia.position.set(stDef.cameraX - 0.3, stDef.cameraY + 0.45, 0.4);
        ia.setDirection(new THREE.Vector3(0.85, 0.52, 0).normalize());
        ia.setLength(Math.min(2.2, 0.4 + imp * 0.22), 0.22, 0.12);
      } else {
        ia.visible = false;
      }
    });

    // 6. Unfurl Stage 13 Finale Banner when completed
    if (this.finaleBannerMesh) {
      if (snapshot.bannerUnfurled) {
        this.finaleBannerMesh.visible = true;
        const curY = this.finaleBannerMesh.scale.y;
        this.finaleBannerMesh.scale.y = THREE.MathUtils.lerp(curY, 1.0, Math.max(0.18, camAlpha));
      } else {
        this.finaleBannerMesh.visible = false;
        this.finaleBannerMesh.scale.y = 0.01;
      }
    }

    // 7. Update Camera Rig based on selected Camera Mode
    const zMult = this._getPortraitZoomMultiplier();
    const isPortrait = zMult > 1.05;
    if (this.cameraMode === 'dolly') {
      if (!snapshot.started && (snapshot.activeStage || 1) === 1) {
        // Bold hero cold-open framing on Stage 01 Kickoff Bearing, Starter Plunger & Stage 02 Helical Gear (100% uniform 1:1 scale)
        if (isPortrait) {
          this.desiredCamPos.set(-34.95, 4.45, 7.6);
          this.desiredTarget.set(-23.55, 3.35, 0);
        } else {
          this.desiredCamPos.set(-23.35, 4.25, 6.75);
          this.desiredTarget.set(-23.35, 3.90, 0);
        }
      } else if (snapshot.completed) {
        // Heroic Stage 13 Finale payoff framing: centered on the crimson Hero Coupe rolling down the ramp + overhead ribbon banner
        this.desiredTarget.set(29.15, 2.38, 0);
        this.desiredCamPos.set(29.15, 2.75, 6.55 * zMult);
      } else {
        const activeIdx = Math.max(0, Math.min(STAGE_DEFINITIONS.length - 1, (snapshot.activeStage || 1) - 1));
        const stDef = STAGE_DEFINITIONS[activeIdx];
        let targetX = stDef.cameraX;
        let targetY = stDef.cameraY;

        if (snapshot.activeBody && snapshot.started && !snapshot.failedStage) {
          targetX = THREE.MathUtils.lerp(stDef.cameraX, snapshot.activeBody.x, 0.35);
          targetY = THREE.MathUtils.lerp(stDef.cameraY, snapshot.activeBody.y, 0.35);
        }

        if (isPortrait) {
          this.desiredTarget.set(targetX + 0.05, Math.max(1.3, targetY - 0.15), 0);
          this.desiredCamPos.set(targetX - 11.45, Math.max(2.6, targetY + 0.95), 7.6);
        } else {
          this.desiredTarget.set(targetX - 0.35, Math.max(1.3, targetY + 0.15), 0);
          this.desiredCamPos.set(targetX - 0.15, Math.max(2.2, targetY + 1.0), 7.35 * zMult);
        }
      }

      this.camera.position.lerp(this.desiredCamPos, camAlpha);
      this.controls.target.lerp(this.desiredTarget, camAlpha);
    } else if (this.cameraMode === 'overview') {
      this.desiredCamPos.set(-34.8, 7.2, 24.5 * zMult);
      this.desiredTarget.set(-9.2, 2.35, -0.5);
      this.camera.position.lerp(this.desiredCamPos, camAlpha);
      this.controls.target.lerp(this.desiredTarget, camAlpha);
    } else if (this.cameraMode === 'stage') {
      const st = STAGE_DEFINITIONS[(this.inspectedStageId || 1) - 1] || STAGE_DEFINITIONS[0];
      this.desiredCamPos.set(st.cameraX, st.cameraY + 0.85, 7.6 * zMult);
      this.desiredTarget.set(st.cameraX, st.cameraY + 0.15, 0);
      this.camera.position.lerp(this.desiredCamPos, camAlpha);
      this.controls.target.lerp(this.desiredTarget, camAlpha);
    }

    this.controls.update();
  }

  resize() {
    const w = this.canvas.clientWidth || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;
    this.camera.aspect = w / h;
    this.renderer.setSize(w, h, false);
    this._applyCameraViewOffset();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  _clearGroup(group) {
    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
    }
  }
}
