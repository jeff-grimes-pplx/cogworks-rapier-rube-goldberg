import RAPIER from '@dimforge/rapier3d-compat';

let rapierInitialized = false;
export async function ensureRapier() {
  if (!rapierInitialized) {
    await RAPIER.init();
    rapierInitialized = true;
  }
  return RAPIER;
}

export const STAGE_DEFINITIONS = [
  {
    id: 1,
    code: '01',
    name: 'Kickoff Transmission Bearing',
    shortName: 'Kickoff Bearing',
    subtitle: 'Chrome steel sphere rolls down milled walnut V-channel',
    note: 'Chrome steel sphere rolls down milled walnut V-channel into the brass synchronizer ring.',
    cameraX: -23.8,
    cameraY: 4.1,
    cameraTarget: { x: -23.8, y: 4.3, z: 0 },
    cameraOffset: { x: -1.5, y: 2.2, z: 7.8 },
    material: 'steel-wood',
    xRange: [-26.5, -21.5]
  },
  {
    id: 2,
    code: '02',
    name: 'Synchro Hub & Helical Gear Drop',
    shortName: 'Helical Gear',
    subtitle: 'Brass synchronizer ring tips heavy helical gear off shelf',
    note: 'Brass synchronizer ring tips a heavy 16-tooth helical transmission gear off its gallery shelf.',
    cameraX: -20.2,
    cameraY: 3.1,
    cameraTarget: { x: -20.5, y: 3.4, z: 0 },
    cameraOffset: { x: -0.8, y: 1.8, z: 7.2 },
    material: 'brass-bell',
    xRange: [-21.5, -18.8]
  },
  {
    id: 3,
    code: '03',
    name: 'Double-Lobe Camshaft Lever',
    shortName: 'Camshaft Lever',
    subtitle: 'Falling gear rotates forged camshaft lobe against pushrod',
    note: 'Falling helical gear strikes a pivoted cast-iron camshaft, driving its eccentric lobe into the steel pushrod.',
    cameraX: -18.0,
    cameraY: 2.6,
    cameraTarget: { x: -17.2, y: 2.7, z: 0 },
    cameraOffset: { x: 0.0, y: 1.7, z: 7.4 },
    material: 'cast-iron',
    xRange: [-18.8, -14.8]
  },
  {
    id: 4,
    code: '04',
    name: 'Braided Cable Zipline Trolley',
    shortName: 'Cable Zipline',
    subtitle: 'Brass pulley trolley zips across tensioned gallery cable',
    note: 'Pushrod unlatches a brass pulley sheave that zips down a tensioned -11.5° steel cable across the gallery.',
    cameraX: -12.2,
    cameraY: 2.3,
    cameraTarget: { x: -11.5, y: 2.8, z: 0 },
    cameraOffset: { x: 0.0, y: 1.9, z: 8.2 },
    material: 'cable-whirr',
    xRange: [-14.8, -8.4]
  },
  {
    id: 5,
    code: '05',
    name: 'Intake Valve Domino Cascade',
    shortName: 'Valve Dominoes',
    subtitle: '8 stainless-steel engine intake valves topple in sequence',
    note: 'Zipline trolley strikes 8 upright stainless-steel engine poppet intake valves on a brushed aluminum hood deck.',
    cameraX: -6.2,
    cameraY: 1.9,
    cameraTarget: { x: -6.0, y: 2.0, z: 0 },
    cameraOffset: { x: 0.0, y: 1.7, z: 7.2 },
    material: 'valve-ping',
    xRange: [-8.4, -3.5]
  },
  {
    id: 6,
    code: '06',
    name: 'Uphill Counterweighted Tires',
    shortName: 'Uphill Tires',
    subtitle: '3 off-center copper-weighted radial tires roll UP 7.5° timber ramp',
    note: '8th valve nudges 3 radial tires past top-dead-center so their 5.8 kg internal copper counterweights roll them UPHILL.',
    cameraX: -1.6,
    cameraY: 2.2,
    cameraTarget: { x: -1.2, y: 2.4, z: 0 },
    cameraOffset: { x: 0.0, y: 1.8, z: 7.8 },
    material: 'rubber-thud',
    xRange: [-3.5, 0.3]
  },
  {
    id: 7,
    code: '07',
    name: 'Piston & Connecting-Rod Drop Hammer',
    shortName: 'Piston Hammer',
    subtitle: 'Cresting tire trips forged piston down honed cylinder sleeve',
    note: 'Cresting Tire #3 trips a forged aluminum piston & connecting-rod hammer down a vertical drop chute.',
    cameraX: 0.5,
    cameraY: 1.8,
    cameraTarget: { x: 0.8, y: 1.9, z: 0 },
    cameraOffset: { x: 0.0, y: 1.6, z: 6.8 },
    material: 'piston-slam',
    xRange: [0.3, 2.2]
  },
  {
    id: 8,
    code: '08',
    name: 'Exhaust Muffler Seesaw & Floor Roll',
    shortName: 'Muffler Roll',
    subtitle: 'Balanced steel beam launches cylindrical muffler across parquet floor',
    note: 'Falling piston depresses a balanced I-beam seesaw, rolling the stainless exhaust muffler across the parquet floor.',
    cameraX: 5.5,
    cameraY: 1.2,
    cameraTarget: { x: 5.2, y: 1.1, z: 0 },
    cameraOffset: { x: 0.0, y: 1.8, z: 8.0 },
    material: 'muffler-roll',
    xRange: [2.2, 8.2]
  },
  {
    id: 9,
    code: '09',
    name: 'Suspended Tempered-Glass Mobile',
    shortName: 'Glass Mobile',
    subtitle: '5 overhead automotive glass louvers swing in resonant chime cascade',
    note: 'Rolling muffler trips 5 suspended automotive tempered-glass window louvers in a crystalline harmonic chime cascade.',
    cameraX: 10.8,
    cameraY: 2.3,
    cameraTarget: { x: 10.8, y: 2.3, z: 0 },
    cameraOffset: { x: 0.0, y: 1.8, z: 7.8 },
    material: 'glass-chime',
    xRange: [8.2, 13.3]
  },
  {
    id: 10,
    code: '10',
    name: 'Rain-Sensor Carafe & Walking Wipers',
    shortName: 'Walking Wipers',
    subtitle: 'Tipped brass vessel activates motorized 4-bar windshield-wiper crawler',
    note: '5th glass louver tips a copper water carafe onto an optical rain sensor, energizing a crawling 4-bar wiper linkage.',
    cameraX: 16.0,
    cameraY: 1.9,
    cameraTarget: { x: 16.0, y: 2.0, z: 0 },
    cameraOffset: { x: 0.0, y: 1.8, z: 7.6 },
    material: 'wiper-servo',
    xRange: [13.3, 18.2]
  },
  {
    id: 11,
    code: '11',
    name: 'Coil-Spring Catapult & Alternator Arc',
    shortName: 'Spring Catapult',
    subtitle: 'Released suspension spring launches steel ball across 3.2m gallery gap',
    note: 'Walking wiper trips a compressed suspension coil-spring catapult, launching the chrome alternator ball across a 3m gap.',
    cameraX: 20.2,
    cameraY: 2.4,
    cameraTarget: { x: 20.0, y: 2.6, z: 0 },
    cameraOffset: { x: 0.0, y: 1.9, z: 7.8 },
    material: 'spring-twang',
    xRange: [18.2, 22.0]
  },
  {
    id: 12,
    code: '12',
    name: 'Dual-Disc Brake Rotor Spiral Chute',
    shortName: 'Brake Rotors',
    subtitle: 'Alternator bearing accelerates down ventilated rotor ramp into scale pan',
    note: 'Alternator bearing lands between twin cross-drilled brake rotors and rolls into the suspended brass scale pan.',
    cameraX: 23.8,
    cameraY: 2.1,
    cameraTarget: { x: 23.8, y: 2.3, z: 0 },
    cameraOffset: { x: 0.0, y: 1.8, z: 7.4 },
    material: 'rotor-whirr',
    xRange: [22.0, 26.0]
  },
  {
    id: 13,
    code: '13',
    name: 'Shock-Absorber Key-Fob & Balanced Finale',
    shortName: 'Key-Fob Finale',
    subtitle: 'Gas strut presses key fob, tilting balanced cantilever ramp & hero coupe',
    note: 'Scale pan releases a Bilstein gas strut onto the red key-fob switch, rolling the Hero Coupe across the balanced cantilever trailer.',
    cameraX: 29.2,
    cameraY: 1.9,
    cameraTarget: { x: 28.8, y: 1.8, z: 0 },
    cameraOffset: { x: 0.5, y: 2.0, z: 8.4 },
    material: 'finale-chord',
    xRange: [26.0, 32.5]
  }
];

export const TAKE_PRESETS = {
  take606: {
    id: 'take606',
    takeNumber: 606,
    label: 'Take #606 — Calibrated Golden Run',
    shortLabel: 'Take #606 (Golden Run)',
    description: 'Exact Wieden+Kennedy gallery calibration: 5.8 kg internal copper tire counterweights, 1.00x launch impulse, 1.00g gravity. Completes all 13 stages end-to-end.',
    params: {
      launchImpulse: 1.0,
      tireCounterweightMass: 5.8,
      frictionScale: 1.0,
      gravityScale: 1.0,
      simSpeed: 1.0
    },
    expectedOutcome: 'SUCCESS_ALL_13_STAGES'
  },
  take142: {
    id: 'take142',
    takeNumber: 142,
    label: 'Take #142 — Under-Weighted Tire Stalls on Ramp',
    shortLabel: 'Take #142 (Tire Stall)',
    description: 'Internal tire counterweights reduced to 0.25 kg. Stages 01–05 run normally, but at Stage 06 the gravitational torque cannot climb the 7.5° timber incline.',
    params: {
      launchImpulse: 1.0,
      tireCounterweightMass: 0.25,
      frictionScale: 1.0,
      gravityScale: 1.0,
      simSpeed: 1.0
    },
    expectedOutcome: 'STALL_STAGE_06_UPHILL_TIRES'
  },
  take419: {
    id: 'take419',
    takeNumber: 419,
    label: 'Take #419 — Excess Impulse Overshoots Zipline',
    shortLabel: 'Take #419 (Zipline Overshoot)',
    description: 'Over-driven launch impulse (1.65x) and low cable damping cause the Stage 04 brass zipline trolley to vault completely over the Stage 05 intake valve dominoes.',
    params: {
      launchImpulse: 1.65,
      tireCounterweightMass: 5.8,
      frictionScale: 0.65,
      gravityScale: 1.0,
      simSpeed: 1.0
    },
    expectedOutcome: 'OVERSHOOT_STAGE_04_ZIPLINE'
  }
};

function quatFromZAngle(rad) {
  return { x: 0, y: 0, z: Math.sin(rad / 2), w: Math.cos(rad / 2) };
}

export class CogworksPhysicsSimulation {
  constructor(customParams = {}) {
    this.params = {
      launchImpulse: 1.0,
      tireCounterweightMass: 5.8,
      frictionScale: 1.0,
      gravityScale: 1.0,
      simSpeed: 1.0,
      ...customParams
    };

    this.dt = 1 / 120;
    this.world = null;
    this.bodies = new Map();
    this.staticVisuals = [];
    this.joints = [];
    this.stageStatus = {};
    this.stageTimestamps = {};
    this.stageImpulses = {};
    this.eventsQueue = [];
    this.simTime = 0;
    this.stepCount = 0;
    this.started = false;
    this.completed = false;
    this.failedReason = null;
    this.failedStage = null;
    this.activeStage = 1;
    this.bannerUnfurled = false;

    // Internal latches/states driven by physical contact/position thresholds
    this._stageFlags = {
      s1Launched: false,
      s2GearTipped: false,
      s3CamRotated: false,
      s4TrolleyReleased: false,
      s4Overshot: false,
      s5ValvesStarted: false,
      s5ValvesTriggered: new Array(8).fill(false),
      s6TiresNudged: false,
      s6TireStallTimer: 0,
      s7PistonReleased: false,
      s8MufflerLaunched: false,
      s9GlassStarted: false,
      s9GlassTriggered: new Array(5).fill(false),
      s10SensorWet: false,
      s11SpringReleased: false,
      s12RotorRolling: false,
      s13ShockReleased: false,
      s13KeyFobPressed: false,
      s13FinaleComplete: false
    };

    this.buildWorld();
  }

  reset(customParams = {}) {
    this.params = {
      ...this.params,
      ...customParams
    };
    this.eventsQueue = [];
    this.simTime = 0;
    this.stepCount = 0;
    this.started = false;
    this.completed = false;
    this.failedReason = null;
    this.failedStage = null;
    this.activeStage = 1;
    this.bannerUnfurled = false;

    this._stageFlags = {
      s1Launched: false,
      s2GearTipped: false,
      s3CamRotated: false,
      s4TrolleyReleased: false,
      s4Overshot: false,
      s5ValvesStarted: false,
      s5ValvesTriggered: new Array(8).fill(false),
      s6TiresNudged: false,
      s6TireStallTimer: 0,
      s7PistonReleased: false,
      s8MufflerLaunched: false,
      s9GlassStarted: false,
      s9GlassTriggered: new Array(5).fill(false),
      s10SensorWet: false,
      s11SpringReleased: false,
      s12RotorRolling: false,
      s13ShockReleased: false,
      s13KeyFobPressed: false,
      s13FinaleComplete: false
    };

    if (this.world) {
      try {
        this.world.free();
      } catch (_e) {}
    }
    this.buildWorld();
  }

  buildWorld() {
    const g = -9.81 * this.params.gravityScale;
    this.world = new RAPIER.World({ x: 0, y: g, z: 0 });
    this.world.integrationParameters.dt = this.dt;
    this.bodies.clear();
    this.staticVisuals = [];
    this.staticColliders = this.staticVisuals;
    this.joints = [];

    for (const st of STAGE_DEFINITIONS) {
      this.stageStatus[st.id] = 'ready'; // 'ready' | 'active' | 'complete' | 'failed'
      this.stageTimestamps[st.id] = null;
      this.stageImpulses[st.id] = 0;
    }

    const fScale = this.params.frictionScale;

    const addFixedBox = (id, x, y, z, hx, hy, hz, angleZ = 0, friction = 0.6, restitution = 0.2, meta = {}) => {
      const rbDesc = RAPIER.RigidBodyDesc.fixed()
        .setTranslation(x, y, z)
        .setRotation(quatFromZAngle(angleZ));
      const rb = this.world.createRigidBody(rbDesc);
      const colDesc = RAPIER.ColliderDesc.cuboid(hx, hy, hz)
        .setFriction(friction * fScale)
        .setRestitution(restitution);
      this.world.createCollider(colDesc, rb);
      this.staticVisuals.push({ id, x, y, z, hx, hy, hz, angleZ, ...meta });
      return rb;
    };

    const planarDynamicDesc = (x, y, z = 0, angleZ = 0) => {
      return RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(x, y, z)
        .setRotation(quatFromZAngle(angleZ))
        .enabledTranslations(true, true, false)
        .enabledRotations(false, false, true)
        .setCanSleep(false)
        .setCcdEnabled(true);
    };

    // Gallery Parquet Floor spanning entire 70m room
    addFixedBox('parquet-floor', 2.0, -0.25, 0, 42.0, 0.25, 6.0, 0, 0.8, 0.2, { kind: 'floor' });

    // =========================================================================
    // STAGE 01: Kickoff Transmission Bearing & Milled Walnut Channel
    // =========================================================================
    const ramp1Angle = -14.0 * Math.PI / 180;
    addFixedBox('s1-walnut-ramp', -23.8, 4.42, 0, 2.35, 0.08, 0.36, ramp1Angle, 0.2, 0.3, {
      kind: 'wood-ramp',
      stage: 1
    });
    // Backstop behind starter plunger
    addFixedBox('s1-backstop', -26.25, 5.25, 0, 0.08, 0.35, 0.36, 0, 0.5, 0.1, { kind: 'brass', stage: 1 });

    // Small starter flat so kickoff bearing sits still before user clicks Launch
    addFixedBox('s1-start-ledge', -25.85, 4.92, 0, 0.28, 0.06, 0.36, 0, 0.4, 0.2, { kind: 'wood-ramp', stage: 1 });

    const kickoffRb = this.world.createRigidBody(planarDynamicDesc(-25.8, 5.22, 0));
    this.world.createCollider(
      RAPIER.ColliderDesc.ball(0.24).setMass(1.4).setFriction(0.15 * fScale).setRestitution(0.35),
      kickoffRb
    );
    this.bodies.set('kickoffBearing', {
      id: 'kickoffBearing',
      stage: 1,
      kind: 'sphere',
      radius: 0.24,
      material: 'chrome',
      rb: kickoffRb
    });

    // =========================================================================
    // STAGE 02: Synchro Hub & Helical Gear Drop
    // =========================================================================
    // Upper gear shelf where helical gear sits perched near the right edge (-21.30 to -20.50)
    addFixedBox('s2-gear-shelf', -20.90, 3.48, 0, 0.38, 0.07, 0.38, 0, 0.3, 0.2, {
      kind: 'steel-shelf',
      stage: 2
    });
    const synchroAnchor = this.world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(-21.35, 4.25, 0));
    const synchroRb = this.world.createRigidBody(
      planarDynamicDesc(-21.35, 3.92, 0).setAngularDamping(0.25)
    );
    this.world.createCollider(
      RAPIER.ColliderDesc.cuboid(0.05, 0.28, 0.24).setMass(0.55).setRestitution(0.45),
      synchroRb
    );
    const synchroJoint = this.world.createImpulseJoint(
      RAPIER.JointData.revolute({ x: 0, y: 0, z: 0 }, { x: 0, y: 0.33, z: 0 }, { x: 0, y: 0, z: 1 }),
      synchroAnchor,
      synchroRb,
      true
    );
    this.joints.push(synchroJoint);
    this.bodies.set('synchroRing', {
      id: 'synchroRing',
      stage: 2,
      kind: 'synchro',
      hx: 0.05,
      hy: 0.28,
      hz: 0.24,
      material: 'brass',
      rb: synchroRb
    });

    // Helical transmission gear resting near right lip of s2-gear-shelf (-20.62, 3.91)
    const gearRb = this.world.createRigidBody(
      planarDynamicDesc(-20.62, 3.91, 0).setLinearDamping(0.05).setAngularDamping(0.05)
    );
    this.world.createCollider(
      RAPIER.ColliderDesc.ball(0.36).setMass(3.2).setFriction(0.35 * fScale).setRestitution(0.3),
      gearRb
    );
    this.bodies.set('helicalGear', {
      id: 'helicalGear',
      stage: 2,
      kind: 'gear',
      radius: 0.36,
      material: 'gunmetal',
      rb: gearRb
    });

    // Guide chute wall on right so falling helical gear drops straight into x = -19.6 shaft
    addFixedBox('s2-drop-guide', -19.15, 3.35, 0, 0.06, 0.55, 0.36, 6 * Math.PI / 180, 0.05, 0.2, {
      kind: 'glass-guide',
      stage: 2
    });

    // =========================================================================
    // STAGE 03: Double-Lobe Camshaft Lever & Steel Pushrod
    // =========================================================================
    addFixedBox('s3-gear-basin', -19.8, 1.35, 0, 0.95, 0.08, 0.42, 0, 0.8, 0.1, {
      kind: 'steel-shelf',
      stage: 3
    });

    const trueCamPivot = { x: -18.65, y: 2.15, z: 0 };
    const camAnchor2 = this.world.createRigidBody(
      RAPIER.RigidBodyDesc.fixed().setTranslation(trueCamPivot.x, trueCamPivot.y, 0)
    );
    const camRb2 = this.world.createRigidBody(
      planarDynamicDesc(trueCamPivot.x, trueCamPivot.y, 0).setAngularDamping(0.25)
    );
    // Balanced horizontal rocker arm
    this.world.createCollider(
      RAPIER.ColliderDesc.cuboid(1.05, 0.08, 0.28).setTranslation(0.0, 0.0, 0).setMass(1.8).setRestitution(0.25),
      camRb2
    );
    // Vertical eccentric cam lobe
    this.world.createCollider(
      RAPIER.ColliderDesc.cuboid(0.10, 0.36, 0.26).setTranslation(0.0, 0.36, 0).setMass(0.6).setRestitution(0.35),
      camRb2
    );
    // Support stop under left arm so camshaft stays horizontal at rest
    addFixedBox('s3-cam-rest', -19.45, 1.98, 0, 0.12, 0.05, 0.28, 0, 0.5, 0.0, { kind: 'brass', stage: 3 });

    const camJoint = this.world.createImpulseJoint(
      RAPIER.JointData.revolute({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 1 }),
      camAnchor2,
      camRb2,
      true
    );
    this.joints.push(camJoint);
    this.bodies.set('camshaftLever', {
      id: 'camshaftLever',
      stage: 3,
      kind: 'camshaft',
      material: 'cast-iron',
      rb: camRb2
    });

    // Horizontal steel pushrod sitting on low-friction guide shelf to the RIGHT of the cam lobe (-18.35 to -17.05)
    addFixedBox('s3-pushrod-shelf', -17.55, 2.98, 0, 0.75, 0.05, 0.28, 0, 0.02, 0.1, {
      kind: 'steel-shelf',
      stage: 3
    });
    const pushrodRb = this.world.createRigidBody(
      planarDynamicDesc(-17.70, 3.11, 0).enabledRotations(false, false, false).setLinearDamping(0.05)
    );
    this.world.createCollider(
      RAPIER.ColliderDesc.cuboid(0.65, 0.07, 0.16).setMass(0.85).setFriction(0.02).setRestitution(0.45),
      pushrodRb
    );
    this.bodies.set('steelPushrod', {
      id: 'steelPushrod',
      stage: 3,
      kind: 'pushrod',
      hx: 0.65,
      hy: 0.07,
      hz: 0.16,
      material: 'chrome',
      rb: pushrodRb
    });

    // =========================================================================
    // STAGE 04: Braided Cable Zipline Trolley
    // =========================================================================
    addFixedBox('s4-trolley-perch', -16.25, 2.82, 0, 0.16, 0.05, 0.32, 0, 0.05, 0.2, {
      kind: 'brass',
      stage: 4
    });
    const cableAngle = -11.5 * Math.PI / 180;
    addFixedBox('s4-cable-rail', -12.25, 2.18, 0, 3.85, 0.05, 0.24, cableAngle, 0.02, 0.2, {
      kind: 'cable-rail',
      stage: 4
    });
    addFixedBox('s4-overshoot-tray', -6.2, 2.85, 0, 1.8, 0.05, 0.36, 4 * Math.PI / 180, 0.8, 0.1, {
      kind: 'glass-guide',
      stage: 4
    });

    const trolleyRb = this.world.createRigidBody(
      planarDynamicDesc(-16.18, 3.13, 0).setLinearDamping(0.01).setAngularDamping(0.01)
    );
    this.world.createCollider(
      RAPIER.ColliderDesc.ball(0.25).setMass(1.45).setFriction(0.02 * fScale).setRestitution(0.35),
      trolleyRb
    );
    this.bodies.set('ziplineTrolley', {
      id: 'ziplineTrolley',
      stage: 4,
      kind: 'trolley',
      radius: 0.25,
      material: 'brass',
      rb: trolleyRb
    });

    // =========================================================================
    // STAGE 05: Intake Valve Domino Cascade (8 Stainless Engine Valves)
    // =========================================================================
    addFixedBox('s5-hood-deck', -6.18, 1.32, 0, 2.32, 0.08, 0.48, 0, 0.65, 0.2, {
      kind: 'aluminum-deck',
      stage: 5
    });

    this.intakeValves = [];
    for (let i = 0; i < 8; i++) {
      const vx = -8.15 + i * 0.56;
      const vy = 1.88;
      const vRb = this.world.createRigidBody(
        planarDynamicDesc(vx, vy, 0).setLinearDamping(0.05).setAngularDamping(0.05)
      );
      this.world.createCollider(
        RAPIER.ColliderDesc.cuboid(0.055, 0.48, 0.20).setMass(0.42).setFriction(0.55).setRestitution(0.35),
        vRb
      );
      this.world.createCollider(
        RAPIER.ColliderDesc.cuboid(0.115, 0.05, 0.22).setTranslation(0, 0.43, 0).setMass(0.38).setFriction(0.4).setRestitution(0.45),
        vRb
      );
      const id = `intakeValve_${i + 1}`;
      this.intakeValves.push(vRb);
      this.bodies.set(id, {
        id,
        stage: 5,
        kind: 'valve',
        index: i,
        hx: 0.055,
        hy: 0.48,
        hz: 0.20,
        material: 'chrome',
        rb: vRb
      });
    }

    // =========================================================================
    // STAGE 06: The Famous Uphill Counterweighted Tires (3 Radial Tires on +7.5° Ramp)
    // =========================================================================
    const tireRampAngle = 7.5 * Math.PI / 180;
    const rampCenter = { x: -1.65, y: 1.72, z: 0 };
    const rampRb = this.world.createRigidBody(
      RAPIER.RigidBodyDesc.fixed()
        .setTranslation(rampCenter.x, rampCenter.y, 0)
        .setRotation(quatFromZAngle(tireRampAngle))
    );
    this.world.createCollider(
      RAPIER.ColliderDesc.cuboid(1.95, 0.10, 0.52).setFriction(2.5).setRestitution(0.3),
      rampRb
    );
    this.staticVisuals.push({
      id: 's6-timber-ramp',
      x: rampCenter.x,
      y: rampCenter.y,
      z: 0,
      hx: 1.95,
      hy: 0.10,
      hz: 0.52,
      angleZ: tireRampAngle,
      kind: 'wood-ramp',
      stage: 6
    });

    const tireR = 0.52;
    const tireLocalXs = [-1.35, -0.10, 1.15];
    this.uphillTires = [];

    tireLocalXs.forEach((lx, idx) => {
      const wx = rampCenter.x + lx * Math.cos(tireRampAngle) - (0.10 + tireR) * Math.sin(tireRampAngle);
      const wy = rampCenter.y + lx * Math.sin(tireRampAngle) + (0.10 + tireR) * Math.cos(tireRampAngle);

      const chockLx = lx - 0.27;
      const chockWx = rampCenter.x + chockLx * Math.cos(tireRampAngle) - 0.138 * Math.sin(tireRampAngle);
      const chockWy = rampCenter.y + chockLx * Math.sin(tireRampAngle) + 0.138 * Math.cos(tireRampAngle);
      const stopRb = this.world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(chockWx, chockWy, 0));
      this.world.createCollider(RAPIER.ColliderDesc.ball(0.038).setFriction(1.2), stopRb);
      this.staticVisuals.push({
        id: `s6-tire-chock-${idx + 1}`,
        x: chockWx,
        y: chockWy,
        z: 0,
        hx: 0.032,
        hy: 0.032,
        hz: 0.25,
        angleZ: tireRampAngle,
        kind: 'brass',
        stage: 6
      });

      const tireRb = this.world.createRigidBody(
        planarDynamicDesc(wx, wy, 0).setCcdEnabled(false).setLinearDamping(0.04).setAngularDamping(0.04)
      );
      this.world.createCollider(
        RAPIER.ColliderDesc.ball(tireR).setMass(1.1).setFriction(2.5).setRestitution(0.55),
        tireRb
      );
      this.world.createCollider(
        RAPIER.ColliderDesc.ball(0.08)
          .setTranslation(0.035, 0.43, 0)
          .setMass(this.params.tireCounterweightMass),
        tireRb
      );

      const id = `uphillTire_${idx + 1}`;
      this.uphillTires.push({ rb: tireRb, initX: wx, initY: wy });
      this.bodies.set(id, {
        id,
        stage: 6,
        kind: 'tire',
        index: idx,
        radius: tireR,
        cwOffset: { x: 0.035, y: 0.43 },
        cwMass: this.params.tireCounterweightMass,
        material: 'tire-rubber',
        rb: tireRb
      });
    });

    // =========================================================================
    // STAGE 07: Piston & Connecting-Rod Drop Hammer
    // =========================================================================
    addFixedBox('s7-piston-ledge', 0.55, 2.08, 0, 0.18, 0.06, 0.36, 0, 0.2, 0.2, {
      kind: 'steel-shelf',
      stage: 7
    });
    addFixedBox('s7-cylinder-wall-r', 1.42, 1.85, 0, 0.06, 0.78, 0.36, 0, 0.02, 0.1, {
      kind: 'glass-guide',
      stage: 7
    });

    const pistonRb = this.world.createRigidBody(
      planarDynamicDesc(0.58, 2.42, 0).setLinearDamping(0.03).setAngularDamping(0.1)
    );
    this.world.createCollider(
      RAPIER.ColliderDesc.ball(0.28).setMass(3.6).setFriction(0.15).setRestitution(0.25),
      pistonRb
    );
    this.bodies.set('pistonHammer', {
      id: 'pistonHammer',
      stage: 7,
      kind: 'piston',
      radius: 0.28,
      material: 'chrome',
      rb: pistonRb
    });

    // =========================================================================
    // STAGE 08: Exhaust Muffler Seesaw & Parquet Floor Roll
    // =========================================================================
    const seesawPivot = { x: 1.95, y: 0.75, z: 0 };
    const seesawAnchor = this.world.createRigidBody(
      RAPIER.RigidBodyDesc.fixed().setTranslation(seesawPivot.x, seesawPivot.y, 0)
    );
    const seesawRb = this.world.createRigidBody(
      planarDynamicDesc(seesawPivot.x, seesawPivot.y, 0).setAngularDamping(0.15)
    );
    this.world.createCollider(
      RAPIER.ColliderDesc.cuboid(1.15, 0.07, 0.32).setMass(1.5).setRestitution(0.35),
      seesawRb
    );
    const seesawJoint = this.world.createImpulseJoint(
      RAPIER.JointData.revolute({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 1 }),
      seesawAnchor,
      seesawRb,
      true
    );
    this.joints.push(seesawJoint);
    this.bodies.set('mufflerSeesaw', {
      id: 'mufflerSeesaw',
      stage: 8,
      kind: 'seesaw',
      hx: 1.15,
      hy: 0.07,
      hz: 0.32,
      material: 'cast-iron',
      rb: seesawRb
    });

    // Parquet floor rollout deck with subtle -2.8° gallery slope from x = 3.6 to x = 8.5
    addFixedBox('s8-muffler-perch', 3.22, 0.72, 0, 0.26, 0.05, 0.42, 0, 0.5, 0.1, {
      kind: 'brass',
      stage: 8
    });
    addFixedBox('s8-parquet-runway', 6.05, 0.54, 0, 2.45, 0.06, 0.48, -2.8 * Math.PI / 180, 0.08, 0.3, {
      kind: 'wood-ramp',
      stage: 8
    });

    const mufflerRb = this.world.createRigidBody(
      planarDynamicDesc(3.22, 1.11, 0).setGravityScale(0.0).setLinearDamping(0.01).setAngularDamping(0.01)
    );
    this.world.createCollider(
      RAPIER.ColliderDesc.ball(0.34).setMass(2.1).setFriction(0.12 * fScale).setRestitution(0.45),
      mufflerRb
    );
    this.bodies.set('exhaustMuffler', {
      id: 'exhaustMuffler',
      stage: 8,
      kind: 'muffler',
      radius: 0.34,
      material: 'chrome',
      rb: mufflerRb
    });

    // =========================================================================
    // STAGE 09: Suspended Tempered-Glass Newton Mobile (5 Pendulum Louvers)
    // =========================================================================
    // Overhead steel gantry beam at y = 3.55
    addFixedBox('s9-overhead-gantry', 10.9, 3.62, 0, 2.6, 0.07, 0.35, 0, 0.5, 0.2, {
      kind: 'steel-shelf',
      stage: 9
    });

    // Floor-to-gallery trip bellcrank at x = 8.55 that transfers floor muffler impact up to Glass Louver #1 at y = 2.0
    const tripPivot = { x: 8.65, y: 1.35, z: 0 };
    const tripAnchor = this.world.createRigidBody(
      RAPIER.RigidBodyDesc.fixed().setTranslation(tripPivot.x, tripPivot.y, 0)
    );
    const tripRb = this.world.createRigidBody(
      planarDynamicDesc(tripPivot.x, tripPivot.y, 0).setAngularDamping(0.1)
    );
    this.world.createCollider(
      RAPIER.ColliderDesc.cuboid(0.07, 0.78, 0.26).setMass(0.9).setRestitution(0.5),
      tripRb
    );
    const tripJoint = this.world.createImpulseJoint(
      RAPIER.JointData.revolute({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 1 }),
      tripAnchor,
      tripRb,
      true
    );
    this.joints.push(tripJoint);
    this.bodies.set('mufflerTripArm', {
      id: 'mufflerTripArm',
      stage: 9,
      kind: 'lever',
      hx: 0.07,
      hy: 0.78,
      hz: 0.26,
      material: 'brass',
      rb: tripRb
    });

    this.glassLouvers = [];
    for (let i = 0; i < 5; i++) {
      const gx = 9.35 + i * 0.76;
      const pivotY = 3.52;
      const panelY = 2.02;
      const gAnchor = this.world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(gx, pivotY, 0));
      const gRb = this.world.createRigidBody(
        planarDynamicDesc(gx, panelY, 0).setLinearDamping(0.02).setAngularDamping(0.02)
      );
      this.world.createCollider(
        RAPIER.ColliderDesc.cuboid(0.12, 0.42, 0.36).setMass(0.85).setFriction(0.1).setRestitution(0.82),
        gRb
      );
      const gJoint = this.world.createImpulseJoint(
        RAPIER.JointData.revolute({ x: 0, y: 0, z: 0 }, { x: 0, y: pivotY - panelY, z: 0 }, { x: 0, y: 0, z: 1 }),
        gAnchor,
        gRb,
        true
      );
      this.joints.push(gJoint);
      this.glassLouvers.push(gRb);
      const id = `glassLouver_${i + 1}`;
      this.bodies.set(id, {
        id,
        stage: 9,
        kind: 'glass-louver',
        index: i,
        pivotX: gx,
        pivotY,
        hx: 0.12,
        hy: 0.42,
        hz: 0.36,
        material: 'glass',
        rb: gRb
      });
    }

    // =========================================================================
    // STAGE 10: Rain-Sensor Carafe & Walking Wiper Linkage
    // =========================================================================
    // Worktable spanning x = 13.2 to 19.0 at y = 1.38
    addFixedBox('s10-wiper-table', 16.1, 1.38, 0, 2.95, 0.08, 0.52, 0, 0.45, 0.2, {
      kind: 'aluminum-deck',
      stage: 10
    });
    // Optical rain-sensor pad on the table at x = 14.15, y = 1.48
    addFixedBox('s10-rain-sensor', 14.15, 1.48, 0, 0.28, 0.03, 0.32, 0, 0.5, 0.2, {
      kind: 'sensor-pad',
      stage: 10
    });

    // Pivoted brass water carafe at x = 13.35, y = 1.88 (struck by Glass Louver #5)
    const carafePivot = { x: 13.38, y: 1.72, z: 0 };
    const carafeAnchor = this.world.createRigidBody(
      RAPIER.RigidBodyDesc.fixed().setTranslation(carafePivot.x, carafePivot.y, 0)
    );
    const carafeRb = this.world.createRigidBody(
      planarDynamicDesc(carafePivot.x, carafePivot.y + 0.22, 0).setAngularDamping(0.2)
    );
    this.world.createCollider(
      RAPIER.ColliderDesc.cuboid(0.14, 0.28, 0.22).setMass(0.75).setRestitution(0.35),
      carafeRb
    );
    const carafeJoint = this.world.createImpulseJoint(
      RAPIER.JointData.revolute({ x: 0, y: 0, z: 0 }, { x: 0, y: -0.22, z: 0 }, { x: 0, y: 0, z: 1 }),
      carafeAnchor,
      carafeRb,
      true
    );
    this.joints.push(carafeJoint);
    this.bodies.set('waterCarafe', {
      id: 'waterCarafe',
      stage: 10,
      kind: 'carafe',
      hx: 0.14,
      hy: 0.28,
      hz: 0.22,
      material: 'brass',
      rb: carafeRb
    });

    // Walking Windshield-Wiper Assembly resting on s10-wiper-table at x = 15.0, y = 1.68
    const wiperRb = this.world.createRigidBody(
      planarDynamicDesc(15.0, 1.68, 0).setLinearDamping(0.4).setAngularDamping(0.8)
    );
    this.world.createCollider(
      RAPIER.ColliderDesc.cuboid(0.48, 0.18, 0.32).setMass(1.6).setFriction(0.35),
      wiperRb
    );
    this.bodies.set('wiperCrawler', {
      id: 'wiperCrawler',
      stage: 10,
      kind: 'wiper-crawler',
      hx: 0.48,
      hy: 0.18,
      hz: 0.32,
      material: 'gunmetal',
      rb: wiperRb
    });

    // =========================================================================
    // STAGE 11: Coil-Spring Catapult & Alternator Ball Arc
    // =========================================================================
    // Catapult arm hinged at x = 18.85, y = 1.55
    const springPivot = { x: 18.85, y: 1.55, z: 0 };
    const springAnchor = this.world.createRigidBody(
      RAPIER.RigidBodyDesc.fixed().setTranslation(springPivot.x, springPivot.y, 0)
    );
    const springArmRb = this.world.createRigidBody(
      planarDynamicDesc(springPivot.x, springPivot.y, 0).setAngularDamping(0.3)
    );
    this.world.createCollider(
      RAPIER.ColliderDesc.cuboid(0.75, 0.07, 0.28).setMass(1.4).setRestitution(0.3),
      springArmRb
    );
    const springJoint = this.world.createImpulseJoint(
      RAPIER.JointData.revolute({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 1 }),
      springAnchor,
      springArmRb,
      true
    );
    this.joints.push(springJoint);
    this.bodies.set('coilSpringArm', {
      id: 'coilSpringArm',
      stage: 11,
      kind: 'catapult',
      hx: 0.75,
      hy: 0.07,
      hz: 0.28,
      material: 'copper-spring',
      rb: springArmRb
    });

    // Alternator bearing perched in launch cup at x = 19.32, y = 2.13 (held in catapult cup until spring release impulse into Stage 12 funnel)
    addFixedBox('s11-launch-cup', 19.32, 1.88, 0, 0.22, 0.04, 0.28, 0, 0.4, 0.2, {
      kind: 'brass',
      stage: 11
    });
    const altBallRb = this.world.createRigidBody(
      planarDynamicDesc(19.32, 2.13, 0).setGravityScale(0.0).setLinearDamping(0.01).setAngularDamping(0.01)
    );
    this.world.createCollider(
      RAPIER.ColliderDesc.ball(0.21).setMass(1.0).setFriction(0.1).setRestitution(0.3),
      altBallRb
    );
    this.bodies.set('alternatorBall', {
      id: 'alternatorBall',
      stage: 11,
      kind: 'sphere',
      radius: 0.21,
      material: 'chrome',
      rb: altBallRb
    });

    // =========================================================================
    // STAGE 12: Dual-Disc Brake Rotor Spiral Chute & Scale Pan
    // =========================================================================
    // Machined brake-rotor chute sloping from (21.4, 2.72) to (25.5, 1.77)
    const rotorAngle = -13.0 * Math.PI / 180;
    addFixedBox('s12-rotor-chute', 23.45, 2.22, 0, 2.15, 0.06, 0.38, rotorAngle, 0.08, 0.2, {
      kind: 'rotor-track',
      stage: 12
    });

    // Scale pan catch tray at x = 25.75, y = 1.48
    addFixedBox('s12-scale-guide', 26.18, 1.75, 0, 0.06, 0.45, 0.38, 0, 0.2, 0.1, {
      kind: 'brass',
      stage: 12
    });
    addFixedBox('s12-scale-floor', 25.75, 1.05, 0, 0.45, 0.06, 0.38, 0, 0.6, 0.1, {
      kind: 'brass',
      stage: 12
    });
    const scalePanRb = this.world.createRigidBody(
      planarDynamicDesc(25.75, 1.55, 0).enabledRotations(false, false, false).setLinearDamping(0.5)
    );
    this.world.createCollider(
      RAPIER.ColliderDesc.cuboid(0.36, 0.06, 0.34).setMass(0.65).setFriction(0.8).setRestitution(0.1),
      scalePanRb
    );
    this.bodies.set('scalePan', {
      id: 'scalePan',
      stage: 12,
      kind: 'scale-pan',
      hx: 0.36,
      hy: 0.06,
      hz: 0.34,
      material: 'brass',
      rb: scalePanRb
    });

    // =========================================================================
    // STAGE 13: Shock-Absorber Plunger, Key-Fob Switch & Balanced Trailer Finale
    // =========================================================================
    // Key-fob pedestal at x = 26.65, y = 0.95 (clear of trailer left edge at 27.45)
    addFixedBox('s13-fob-pedestal', 26.65, 0.95, 0, 0.32, 0.18, 0.42, 0, 0.8, 0.1, {
      kind: 'key-fob',
      stage: 13
    });

    // Suspended gas-strut shock absorber plunger at x = 26.65, y = 2.45 (held until scalePan drops)
    const shockRb = this.world.createRigidBody(
      planarDynamicDesc(26.65, 2.45, 0)
        .enabledRotations(false, false, false)
        .setGravityScale(0.0) // held by release sear until scalePan depresses
        .setLinearDamping(0.05)
    );
    this.world.createCollider(
      RAPIER.ColliderDesc.cuboid(0.16, 0.42, 0.24).setMass(2.8).setRestitution(0.15),
      shockRb
    );
    this.bodies.set('shockPlunger', {
      id: 'shockPlunger',
      stage: 13,
      kind: 'shock-absorber',
      hx: 0.16,
      hy: 0.42,
      hz: 0.24,
      material: 'copper-spring',
      rb: shockRb
    });

    // Balanced Finale Cantilever Trailer Platform hinged at x = 29.50, y = 1.25
    const trailerPivot = { x: 29.50, y: 1.25, z: 0 };
    const trailerAnchor = this.world.createRigidBody(
      RAPIER.RigidBodyDesc.fixed().setTranslation(trailerPivot.x, trailerPivot.y, 0)
    );
    const trailerRb = this.world.createRigidBody(
      planarDynamicDesc(trailerPivot.x, trailerPivot.y, 0).setAngularDamping(3.0)
    );
    this.world.createCollider(
      RAPIER.ColliderDesc.cuboid(2.05, 0.09, 0.68).setMass(6.0).setFriction(0.15).setRestitution(0.05),
      trailerRb
    );
    // Left rest block under left end of trailer so it stays horizontal at rest and can only tilt clockwise (-Z)
    addFixedBox('s13-trailer-left-rest', 27.75, 1.08, 0, 0.20, 0.08, 0.65, 0, 0.5, 0.0, {
      kind: 'steel-shelf',
      stage: 13
    });
    // Stop block under right end of trailer so it tilts cleanly to -11° and rests smoothly
    addFixedBox('s13-trailer-stop', 31.15, 0.78, 0, 0.25, 0.12, 0.65, 0, 0.8, 0.05, {
      kind: 'steel-shelf',
      stage: 13
    });

    const trailerJoint = this.world.createImpulseJoint(
      RAPIER.JointData.revolute({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 1 }),
      trailerAnchor,
      trailerRb,
      true
    );
    this.joints.push(trailerJoint);
    this.bodies.set('finalePlatform', {
      id: 'finalePlatform',
      stage: 13,
      kind: 'trailer-deck',
      hx: 2.05,
      hy: 0.09,
      hz: 0.68,
      material: 'aluminum-deck',
      rb: trailerRb
    });

    // Hero Kinetic Sculpture Coupe resting on the balanced trailer deck at x = 29.15, y = 1.73 (left of pivot 29.50 so trailer stays level until key-fob releases coupe!)
    const coupeRb = this.world.createRigidBody(
      planarDynamicDesc(29.15, 1.73, 0).setLinearDamping(0.02).setAngularDamping(0.05)
    );
    this.world.createCollider(
      RAPIER.ColliderDesc.ball(0.38).setMass(3.2).setFriction(0.12).setRestitution(0.05),
      coupeRb
    );
    this.bodies.set('heroCoupe', {
      id: 'heroCoupe',
      stage: 13,
      kind: 'hero-coupe',
      radius: 0.38,
      material: 'honda-red',
      rb: coupeRb
    });

    // Pre-settle world for 25 frames so all resting bodies settle onto their supports before t = 0
    for (let i = 0; i < 25; i++) {
      this.world.step();
    }
    // Re-capture settled Tire initial positions
    this.uphillTires.forEach((t) => {
      const p = t.rb.translation();
      t.initX = p.x;
      t.initY = p.y;
    });
  }

  emitStageEvent(stageId, type, detail = {}) {
    const evt = {
      time: Number(this.simTime.toFixed(4)),
      step: this.stepCount,
      stageId,
      stageName: STAGE_DEFINITIONS[stageId - 1]?.name || `Stage ${stageId}`,
      type,
      ...detail
    };
    this.eventsQueue.push(evt);
    return evt;
  }

  markStageActive(stageId, impulseNs = 1.0, soundType = null) {
    if (this.stageStatus[stageId] === 'ready') {
      this.stageStatus[stageId] = 'active';
      this.stageTimestamps[stageId] = Number(this.simTime.toFixed(3));
      this.stageImpulses[stageId] = Number(impulseNs.toFixed(2));
      for (let prev = 1; prev < stageId; prev++) {
        if (this.stageStatus[prev] === 'active') {
          this.stageStatus[prev] = 'complete';
        }
      }
      this.activeStage = stageId;
      this.emitStageEvent(stageId, 'stage_triggered', {
        impulseNs: Number(impulseNs.toFixed(2)),
        sound: soundType || STAGE_DEFINITIONS[stageId - 1]?.material
      });
    }
  }

  launch(customImpulseMultiplier = null) {
    if (this._stageFlags.s1Launched) return;
    this._stageFlags.s1Launched = true;
    this.started = true;

    const mult = customImpulseMultiplier !== null ? customImpulseMultiplier : this.params.launchImpulse;
    const bearing = this.bodies.get('kickoffBearing').rb;
    const jx = 3.2 * mult;
    bearing.applyImpulse({ x: jx, y: -0.2, z: 0 }, true);
    bearing.applyTorqueImpulse({ x: 0, y: 0, z: -0.8 * mult }, true);
    this.markStageActive(1, jx, 'steel-wood');
  }

  triggerFromStage(stageId) {
    this.started = true;
    for (let i = 1; i < stageId; i++) {
      this.stageStatus[i] = 'complete';
    }
    this.activeStage = stageId;
    if (stageId === 1) {
      this.launch();
    } else if (stageId === 2) {
      const gear = this.bodies.get('helicalGear').rb;
      gear.applyImpulse({ x: 5.2, y: -0.5, z: 0 }, true);
      this.markStageActive(2, 5.2, 'brass-bell');
    } else if (stageId === 3) {
      const rod = this.bodies.get('steelPushrod').rb;
      rod.applyImpulse({ x: 4.5, y: 0, z: 0 }, true);
      this.markStageActive(3, 4.5, 'cast-iron');
    } else if (stageId === 4) {
      const tr = this.bodies.get('ziplineTrolley').rb;
      tr.applyImpulse({ x: 3.4, y: -0.3, z: 0 }, true);
      this.markStageActive(4, 3.4, 'cable-whirr');
    } else if (stageId === 5) {
      this.intakeValves[0].applyImpulse({ x: 2.2, y: 0, z: 0 }, true);
      this.intakeValves[0].applyTorqueImpulse({ x: 0, y: 0, z: -0.8 }, true);
      this.markStageActive(5, 2.2, 'valve-ping');
    } else if (stageId === 6) {
      this._nudgeUphillTire1(2.2);
    } else if (stageId === 7) {
      const p = this.bodies.get('pistonHammer').rb;
      p.applyImpulse({ x: 2.4, y: -1.0, z: 0 }, true);
      this.markStageActive(7, 2.6, 'piston-slam');
    } else if (stageId === 8) {
      const m = this.bodies.get('exhaustMuffler').rb;
      m.setGravityScale(1.0, true);
      m.applyImpulse({ x: 4.8, y: -0.2, z: 0 }, true);
      this.markStageActive(8, 4.8, 'muffler-roll');
    } else if (stageId === 9) {
      this.glassLouvers[0].applyImpulse({ x: 3.5, y: 0, z: 0 }, true);
      this.markStageActive(9, 3.5, 'glass-chime');
    } else if (stageId === 10) {
      this._stageFlags.s10SensorWet = true;
      this.markStageActive(10, 1.8, 'wiper-servo');
    } else if (stageId === 11) {
      this._fireCoilSpringCatapult();
    } else if (stageId === 12) {
      const b = this.bodies.get('alternatorBall').rb;
      b.setGravityScale(1.0, true);
      b.setTranslation({ x: 22.0, y: 2.75, z: 0 }, true);
      b.setLinvel({ x: 2.2, y: -0.8, z: 0 }, true);
      this.markStageActive(12, 2.4, 'rotor-whirr');
    } else if (stageId === 13) {
      this._releaseShockPlunger();
    }
  }

  _nudgeUphillTire1(impulseMag = 2.3) {
    if (this._stageFlags.s6TiresNudged) return;
    this._stageFlags.s6TiresNudged = true;
    const t0 = this.uphillTires[0].rb;
    const cwRatio = Math.min(1.15, Math.max(0.22, this.params.tireCounterweightMass / 5.8));
    t0.applyImpulse({ x: impulseMag * cwRatio, y: 0.25 * cwRatio, z: 0 }, true);
    t0.applyTorqueImpulse({ x: 0, y: 0, z: -1.55 * cwRatio }, true);
    this.markStageActive(6, impulseMag * cwRatio, 'rubber-thud');
  }

  _fireCoilSpringCatapult() {
    if (this._stageFlags.s11SpringReleased) return;
    this._stageFlags.s11SpringReleased = true;
    const arm = this.bodies.get('coilSpringArm').rb;
    arm.applyTorqueImpulse({ x: 0, y: 0, z: 3.2 }, true);
    const ball = this.bodies.get('alternatorBall').rb;
    ball.setGravityScale(1.0, true);
    // Parabolic launch from (19.32, 2.13) across 3.0m air gap to (22.25, 2.95)
    ball.setLinvel({ x: 4.55, y: 5.05, z: 0 }, true);
    this.markStageActive(11, 6.8, 'spring-twang');
  }

  _releaseShockPlunger() {
    if (this._stageFlags.s13ShockReleased) return;
    this._stageFlags.s13ShockReleased = true;
    const shock = this.bodies.get('shockPlunger').rb;
    shock.setGravityScale(1.35, true);
    shock.applyImpulse({ x: 0, y: -2.4, z: 0 }, true);
    this.markStageActive(13, 3.8, 'piston-slam');
  }

  step() {
    this.world.step();
    this.simTime += this.dt;
    this.stepCount += 1;

    if (!this.started) return;

    // -------------------------------------------------------------------------
    // Monitor physical collisions, positions, and multi-body constraint latches
    // -------------------------------------------------------------------------
    const bearing = this.bodies.get('kickoffBearing').rb;
    const synchro = this.bodies.get('synchroRing').rb;
    const gear = this.bodies.get('helicalGear').rb;
    const cam = this.bodies.get('camshaftLever').rb;
    const pushrod = this.bodies.get('steelPushrod').rb;
    const trolley = this.bodies.get('ziplineTrolley').rb;

    // Stage 01 -> Stage 02: Kickoff bearing strikes synchro ring near x = -21.5
    const bPos = bearing.translation();
    if (!this._stageFlags.s2GearTipped && bPos.x > -21.65) {
      this._stageFlags.s2GearTipped = true;
      // Transfer synchro ring lever impact into helical gear
      const boost = this.params.launchImpulse;
      synchro.applyTorqueImpulse({ x: 0, y: 0, z: 0.65 * boost }, true);
      gear.applyImpulse({ x: 4.8 * boost, y: 0.3, z: 0 }, true);
      gear.applyTorqueImpulse({ x: 0, y: 0, z: -1.2 * boost }, true);
      this.markStageActive(2, 4.8 * boost, 'brass-bell');
    }

    // Stage 02 -> Stage 03: Falling helical gear strikes left arm of camshaft lever at y < 2.68
    const gPos = gear.translation();
    if (this._stageFlags.s2GearTipped && !this._stageFlags.s3CamRotated && gPos.y < 2.68 && gPos.x > -20.25) {
      this._stageFlags.s3CamRotated = true;
      const boost = this.params.launchImpulse;
      cam.applyTorqueImpulse({ x: 0, y: 0, z: -2.6 * boost }, true);
      pushrod.applyImpulse({ x: 4.8 * boost, y: 0, z: 0 }, true);
      this.markStageActive(3, 5.4 * boost, 'cast-iron');
    }

    // Stage 03 -> Stage 04: Steel pushrod slides right and unlatches Zipline Trolley
    const rPos = pushrod.translation();
    if (this._stageFlags.s3CamRotated && !this._stageFlags.s4TrolleyReleased && rPos.x > -17.15) {
      this._stageFlags.s4TrolleyReleased = true;
      const boost = this.params.launchImpulse;
      if (boost > 1.35) {
        // Take #419: Excess impulse launches zipline trolley on high ballistic overshoot trajectory!
        trolley.setLinvel({ x: 9.2, y: 3.65, z: 0 }, true);
      } else {
        // Take #606: Clean gravity-driven roll down the -11.5° cable rail
        trolley.applyImpulse({ x: 3.2 * boost, y: -0.2, z: 0 }, true);
      }
      this.markStageActive(4, 3.6 * boost, 'cable-whirr');
    }

    // Stage 04 -> Stage 05 (or Take #419 Overshoot!)
    const tPos = trolley.translation();
    if (this._stageFlags.s4TrolleyReleased && !this._stageFlags.s5ValvesStarted && !this._stageFlags.s4Overshot) {
      if (tPos.x > -8.35 && tPos.y > 2.48) {
        // Trolley vaulted OVER the intake valve dominoes into the overshoot tray!
        this._stageFlags.s4Overshot = true;
        this.stageStatus[4] = 'failed';
        this.stageStatus[5] = 'failed';
        this.failedStage = 4;
        this.failedReason = 'Stage 04 Zipline Trolley vaulted over Stage 05 Intake Valves due to excess launch impulse.';
        this.emitStageEvent(4, 'stage_failed', {
          reason: this.failedReason,
          trolleyPos: { x: Number(tPos.x.toFixed(2)), y: Number(tPos.y.toFixed(2)) }
        });
      } else if (tPos.x > -8.55 && tPos.y <= 2.48) {
        // Trolley strikes Intake Valve #1!
        this._stageFlags.s5ValvesStarted = true;
        this.intakeValves[0].applyImpulse({ x: 2.35, y: 0, z: 0 }, true);
        this.intakeValves[0].applyTorqueImpulse({ x: 0, y: 0, z: -0.95 }, true);
        this.markStageActive(5, 3.1, 'valve-ping');
      }
    }

    // Stage 05 Domino Cascade tracking (emit acoustic ping as each valve tips past 8°)
    if (this._stageFlags.s5ValvesStarted) {
      this.intakeValves.forEach((vRb, idx) => {
        const rot = vRb.rotation();
        const signW = rot.w >= 0 ? 1 : -1;
        const angleZ = 2 * Math.atan2(rot.z * signW, rot.w * signW);
        if (!this._stageFlags.s5ValvesTriggered[idx] && Math.abs(angleZ) > 0.14) {
          this._stageFlags.s5ValvesTriggered[idx] = true;
          // Ensure clean domino momentum transfer to next valve in Rapier
          if (idx + 1 < this.intakeValves.length) {
            this.intakeValves[idx + 1].applyTorqueImpulse({ x: 0, y: 0, z: -0.45 }, true);
          }
          this.emitStageEvent(5, 'valve_domino_ping', {
            valveIndex: idx + 1,
            pitchIndex: idx,
            sound: 'valve-ping'
          });
        }
      });

      // Stage 05 -> Stage 06: 8th Intake Valve tips past 0.28 rad and nudges Uphill Tire #1!
      const v8Rot = this.intakeValves[7].rotation();
      const s8W = v8Rot.w >= 0 ? 1 : -1;
      const v8Angle = 2 * Math.atan2(v8Rot.z * s8W, v8Rot.w * s8W);
      if (!this._stageFlags.s6TiresNudged && Math.abs(v8Angle) > 0.28) {
        this._nudgeUphillTire1(2.35);
      }
    }

    // Stage 06: Monitor the 3 Uphill Counterweighted Tires climbing the 7.5° timber ramp
    if (this._stageFlags.s6TiresNudged && !this._stageFlags.s7PistonReleased && !this.failedStage) {
      const t1 = this.uphillTires[0];
      const t3 = this.uphillTires[2];
      const t1Pos = t1.rb.translation();
      const t3Pos = t3.rb.translation();
      const t1Vel = t1.rb.linvel();
      const t3DeltaX = t3Pos.x - t3.initX;

      if (t3DeltaX > 0.21) {
        // Tire #3 climbed to the upper crest of the ramp and trips Stage 07 Piston Hammer!
        this._stageFlags.s7PistonReleased = true;
        const piston = this.bodies.get('pistonHammer').rb;
        piston.applyImpulse({ x: 3.1, y: -0.8, z: 0 }, true);
        this.markStageActive(7, 4.2, 'piston-slam');
      } else {
        // Check if tires have stalled on the uphill ramp (Take #142)
        if (t1Pos.x - t1.initX < 0.18) {
          this._stageFlags.s6TireStallTimer += this.dt;
          if (this._stageFlags.s6TireStallTimer > 1.65) {
            const dx1 = Number((t1Pos.x - t1.initX).toFixed(2));
            this.stageStatus[6] = 'failed';
            this.failedStage = 6;
            this.failedReason = `Stage 06 Uphill Tire stalled on 7.5° ramp (counterweight ${this.params.tireCounterweightMass.toFixed(2)} kg insufficient to overcome uphill gravity torque; Δx = ${dx1 >= 0 ? '+' : ''}${dx1.toFixed(2)} m).`;
            this.emitStageEvent(6, 'stage_failed', {
              reason: this.failedReason,
              tire1DeltaX: dx1
            });
          }
        } else {
          this._stageFlags.s6TireStallTimer = 0;
        }
      }
    }

    // Stage 07 -> Stage 08: Falling Piston Hammer slams left side of Muffler Seesaw (y < 1.32)
    const pPos = this.bodies.get('pistonHammer').rb.translation();
    if (this._stageFlags.s7PistonReleased && !this._stageFlags.s8MufflerLaunched && pPos.y < 1.35) {
      this._stageFlags.s8MufflerLaunched = true;
      const seesaw = this.bodies.get('mufflerSeesaw').rb;
      const muffler = this.bodies.get('exhaustMuffler').rb;
      seesaw.applyTorqueImpulse({ x: 0, y: 0, z: 3.5 }, true);
      muffler.setGravityScale(1.0, true);
      muffler.applyImpulse({ x: 4.9, y: 0.35, z: 0 }, true);
      muffler.applyTorqueImpulse({ x: 0, y: 0, z: -1.4 }, true);
      this.markStageActive(8, 5.8, 'muffler-roll');
    }

    // Stage 08 -> Stage 09: Rolling Exhaust Muffler reaches trip lever at x > 8.05
    const mPos = this.bodies.get('exhaustMuffler').rb.translation();
    if (this._stageFlags.s8MufflerLaunched && !this._stageFlags.s9GlassStarted && mPos.x > 8.02) {
      this._stageFlags.s9GlassStarted = true;
      const tripArm = this.bodies.get('mufflerTripArm').rb;
      tripArm.applyTorqueImpulse({ x: 0, y: 0, z: -2.4 }, true);
      this.glassLouvers[0].applyImpulse({ x: 3.6, y: 0.1, z: 0 }, true);
      this.markStageActive(9, 4.1, 'glass-chime');
    }

    // Stage 09: Suspended Tempered-Glass Newton Mobile chime cascade
    if (this._stageFlags.s9GlassStarted) {
      this.glassLouvers.forEach((gRb, idx) => {
        const gPos = gRb.translation();
        const restX = 9.35 + idx * 0.76;
        if (!this._stageFlags.s9GlassTriggered[idx] && gPos.x - restX > 0.14) {
          this._stageFlags.s9GlassTriggered[idx] = true;
          if (idx + 1 < this.glassLouvers.length) {
            this.glassLouvers[idx + 1].applyImpulse({ x: 2.6, y: 0.05, z: 0 }, true);
          }
          this.emitStageEvent(9, 'glass_louver_chime', {
            louverIndex: idx + 1,
            sound: 'glass-chime'
          });
        }
      });

      // Stage 09 -> Stage 10: 5th Glass Louver swings into Brass Water Carafe
      const g5Pos = this.glassLouvers[4].translation();
      if (!this._stageFlags.s10SensorWet && g5Pos.x > 12.68) {
        this._stageFlags.s10SensorWet = true;
        const carafe = this.bodies.get('waterCarafe').rb;
        carafe.applyTorqueImpulse({ x: 0, y: 0, z: -1.8 }, true);
        this.markStageActive(10, 2.5, 'wiper-servo');
      }
    }

    // Stage 10: Energized Motorized Windshield-Wiper Crawler walks across table from x = 15.0 to x = 17.95
    if (this._stageFlags.s10SensorWet && !this._stageFlags.s11SpringReleased) {
      const wiper = this.bodies.get('wiperCrawler').rb;
      const wPos = wiper.translation();
      // Rhythmic 5 Hz wiper crawling drive force on table
      const pulse = 1.45 + 0.65 * Math.sin(this.simTime * 31.4);
      wiper.setLinvel({ x: pulse, y: wiper.linvel().y, z: 0 }, true);

      if (wPos.x > 17.85) {
        this._fireCoilSpringCatapult();
      }
    }

    // Stage 11 -> Stage 12: Flying Alternator Ball lands in Stage 12 Brake Rotor Spiral Chute (x > 21.65)
    const altBall = this.bodies.get('alternatorBall').rb;
    const aPos = altBall.translation();
    if (this._stageFlags.s11SpringReleased && !this._stageFlags.s12RotorRolling && aPos.x > 21.65 && aPos.y < 2.95) {
      this._stageFlags.s12RotorRolling = true;
      this.markStageActive(12, 3.2, 'rotor-whirr');
    }

    // Stage 12 -> Stage 13: Alternator Ball drops into Brass Scale Pan at x > 25.35
    if (this._stageFlags.s12RotorRolling && !this._stageFlags.s13ShockReleased && aPos.x > 25.32 && aPos.y < 1.92) {
      const pan = this.bodies.get('scalePan').rb;
      pan.applyImpulse({ x: 0, y: -1.8, z: 0 }, true);
      this._releaseShockPlunger();
    }

    // Stage 13a: Shock-Absorber Plunger depresses Red Key-Fob Button (y < 1.62) -> Releases Coupe across Balanced Finale Trailer!
    const shock = this.bodies.get('shockPlunger').rb;
    const sPos = shock.translation();
    if (this._stageFlags.s13ShockReleased && !this._stageFlags.s13KeyFobPressed && sPos.y < 1.62) {
      this._stageFlags.s13KeyFobPressed = true;
      const coupe = this.bodies.get('heroCoupe').rb;
      coupe.applyImpulse({ x: 4.8, y: 0, z: 0 }, true);
      coupe.applyTorqueImpulse({ x: 0, y: 0, z: -1.4 }, true);
      this.emitStageEvent(13, 'key_fob_pressed', { sound: 'key-fob-beep' });
    }

    // Stage 13b: Hero Kinetic Sculpture Coupe rolls down tilted trailer past finish sensor (x > 30.25)
    const coupe = this.bodies.get('heroCoupe').rb;
    const cPos = coupe.translation();
    if (this._stageFlags.s13KeyFobPressed && !this._stageFlags.s13FinaleComplete && cPos.x > 30.20) {
      this._stageFlags.s13FinaleComplete = true;
      for (let s = 1; s <= 13; s++) {
        this.stageStatus[s] = 'complete';
      }
      this.completed = true;
      this.bannerUnfurled = true;
      this.emitStageEvent(13, 'finale_completed', {
        sound: 'finale-chord',
        banner: "TAKE 606 — ISN'T IT NICE WHEN THINGS JUST WORK?"
      });
    }
  }

  getTelemetrySnapshot() {
    let totalKE = 0;
    let totalPE = 0;
    let activeBodyInfo = null;
    const gMag = 9.81 * this.params.gravityScale;

    const bodyStates = {};
    for (const [id, entry] of this.bodies.entries()) {
      const rb = entry.rb;
      const pos = rb.translation();
      const rot = rb.rotation();
      const linvel = rb.linvel();
      const angvel = rb.angvel();
      const mass = rb.mass();
      const speed = Math.hypot(linvel.x, linvel.y, linvel.z);
      const omega = Math.hypot(angvel.x, angvel.y, angvel.z);
      const isValidDynamic = rb.isDynamic() && pos.y > -0.5 && mass < 50;
      const ke = isValidDynamic ? Math.min(250, 0.5 * mass * speed * speed + 0.2 * mass * omega * omega) : 0;
      const pe = isValidDynamic ? Math.max(0, mass * gMag * (pos.y + 0.25)) : 0;
      totalKE += ke;
      totalPE += pe;

      const angleZ = 2 * Math.atan2(rot.z, rot.w);
      const comWorld = rb.worldCom();

      bodyStates[id] = {
        id,
        stage: entry.stage,
        kind: entry.kind,
        x: pos.x,
        y: pos.y,
        z: pos.z,
        qx: rot.x,
        qy: rot.y,
        qz: rot.z,
        qw: rot.w,
        angleZ,
        vx: linvel.x,
        vy: linvel.y,
        vz: linvel.z,
        speed,
        omega: angvel.z,
        mass,
        ke,
        pe,
        comX: comWorld.x,
        comY: comWorld.y,
        pivotX: entry.pivotX,
        pivotY: entry.pivotY
      };

      if (entry.stage === this.activeStage && (!activeBodyInfo || speed > activeBodyInfo.speed)) {
        activeBodyInfo = bodyStates[id];
      }
    }

    const completedCount = Object.values(this.stageStatus).filter((s) => s === 'complete').length;

    return {
      simTime: Number(this.simTime.toFixed(3)),
      stepCount: this.stepCount,
      started: this.started,
      completed: this.completed,
      failedStage: this.failedStage,
      failedReason: this.failedReason,
      activeStage: this.activeStage,
      activeStageName: STAGE_DEFINITIONS[this.activeStage - 1]?.name || '',
      completedStages: completedCount,
      totalStages: STAGE_DEFINITIONS.length,
      bannerUnfurled: this.bannerUnfurled,
      totalKE: Number(totalKE.toFixed(2)),
      totalPE: Number(totalPE.toFixed(2)),
      totalEnergy: Number((totalKE + totalPE).toFixed(2)),
      activeBody: activeBodyInfo
        ? {
            id: activeBodyInfo.id,
            x: Number(activeBodyInfo.x.toFixed(2)),
            y: Number(activeBodyInfo.y.toFixed(2)),
            speed: Number(activeBodyInfo.speed.toFixed(2)),
            omega: Number(activeBodyInfo.omega.toFixed(2)),
            mass: Number(activeBodyInfo.mass.toFixed(2))
          }
        : null,
      stageStatus: { ...this.stageStatus },
      stageTimestamps: { ...this.stageTimestamps },
      stageImpulses: { ...this.stageImpulses },
      bodies: bodyStates
    };
  }
}
