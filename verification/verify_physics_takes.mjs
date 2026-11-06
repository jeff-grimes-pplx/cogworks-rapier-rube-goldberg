import fs from 'node:fs';
import path from 'node:path';
import { ensureRapier, CogworksPhysicsSimulation, TAKE_PRESETS, STAGE_DEFINITIONS } from '../src/physics-engine.js';

await ensureRapier();

function runTakeVerification(takeKey, maxSeconds = 26.0) {
  const preset = TAKE_PRESETS[takeKey];
  const sim = new CogworksPhysicsSimulation(preset.params);

  // Verify initial stability for 0.5 seconds before launch
  for (let i = 0; i < 60; i++) {
    sim.step();
  }
  const preLaunchTire1Delta = Math.abs(sim.uphillTires[0].rb.translation().x - sim.uphillTires[0].initX);

  // Reset simTime for clean launch telemetry
  const simRun = new CogworksPhysicsSimulation(preset.params);
  simRun.launch();

  const totalSteps = Math.round(maxSeconds / simRun.dt);
  const timeSeries = [];

  for (let step = 0; step < totalSteps; step++) {
    simRun.step();
    if (step % 12 === 0 || simRun.completed || simRun.failedStage) {
      const snap = simRun.getTelemetrySnapshot();
      timeSeries.push({
        t: snap.simTime,
        activeStage: snap.activeStage,
        completedStages: snap.completedStages,
        totalKE: snap.totalKE,
        totalPE: snap.totalPE,
        tire1X: Number((snap.bodies.uphillTire_1.x - simRun.uphillTires[0].initX).toFixed(4)),
        tire3X: Number((snap.bodies.uphillTire_3.x - simRun.uphillTires[2].initX).toFixed(4)),
        activeBody: snap.activeBody
      });
    }
    if (simRun.completed || simRun.failedStage) {
      // Step 60 more frames after completion/failure for settle logging
      for (let extra = 0; extra < 60; extra++) simRun.step();
      break;
    }
  }

  const finalSnap = simRun.getTelemetrySnapshot();
  return {
    takeKey,
    takeNumber: preset.takeNumber,
    label: preset.label,
    params: preset.params,
    expectedOutcome: preset.expectedOutcome,
    preLaunchTire1StabilityDeltaM: Number(preLaunchTire1Delta.toFixed(5)),
    completedAllStages: finalSnap.completed,
    completedStagesCount: finalSnap.completedStages,
    totalStagesCount: finalSnap.totalStages,
    durationSeconds: finalSnap.simTime,
    failedStage: finalSnap.failedStage,
    failedReason: finalSnap.failedReason,
    bannerUnfurled: finalSnap.bannerUnfurled,
    stageTimestamps: finalSnap.stageTimestamps,
    stageImpulsesNs: finalSnap.stageImpulses,
    stageStatus: finalSnap.stageStatus,
    uphillTiresSummary: {
      tire1DeltaX_m: Number((finalSnap.bodies.uphillTire_1.x - simRun.uphillTires[0].initX).toFixed(3)),
      tire1DeltaY_m: Number((finalSnap.bodies.uphillTire_1.y - simRun.uphillTires[0].initY).toFixed(3)),
      tire2DeltaX_m: Number((finalSnap.bodies.uphillTire_2.x - simRun.uphillTires[1].initX).toFixed(3)),
      tire2DeltaY_m: Number((finalSnap.bodies.uphillTire_2.y - simRun.uphillTires[1].initY).toFixed(3)),
      tire3DeltaX_m: Number((finalSnap.bodies.uphillTire_3.x - simRun.uphillTires[2].initX).toFixed(3)),
      tire3DeltaY_m: Number((finalSnap.bodies.uphillTire_3.y - simRun.uphillTires[2].initY).toFixed(3))
    },
    eventsCount: simRun.eventsQueue.length,
    events: simRun.eventsQueue,
    sampledTimeSeries: timeSeries
  };
}

const results = {
  generatedAt: new Date().toISOString(),
  engine: '@dimforge/rapier3d-compat (120Hz fixed timestep)',
  stageDefinitions: STAGE_DEFINITIONS.map((s) => ({
    id: s.id,
    code: s.code,
    name: s.name,
    material: s.material
  })),
  takes: {
    take606: runTakeVerification('take606'),
    take142: runTakeVerification('take142'),
    take419: runTakeVerification('take419')
  }
};

console.log('=== COGWORKS RAPIER3D VERIFICATION SUMMARY ===');
for (const [k, r] of Object.entries(results.takes)) {
  console.log(`\n[${r.label}]`);
  console.log(`  Completed: ${r.completedAllStages} (${r.completedStagesCount}/${r.totalStagesCount} stages) in ${r.durationSeconds}s`);
  console.log(`  Pre-launch Tire #1 drift: ${r.preLaunchTire1StabilityDeltaM} m`);
  console.log(`  Uphill Tires Δx (m): T1=${r.uphillTiresSummary.tire1DeltaX_m}, T2=${r.uphillTiresSummary.tire2DeltaX_m}, T3=${r.uphillTiresSummary.tire3DeltaX_m}`);
  console.log(`  Uphill Tires Δy (m): T1=${r.uphillTiresSummary.tire1DeltaY_m}, T2=${r.uphillTiresSummary.tire2DeltaY_m}, T3=${r.uphillTiresSummary.tire3DeltaY_m}`);
  if (r.failedStage) {
    console.log(`  Failed at Stage ${r.failedStage}: ${r.failedReason}`);
  }
  console.log(`  Stage Timestamps (s):`, JSON.stringify(r.stageTimestamps));
}

const outPath = path.resolve('verification/rapier_verification_report.json');
fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
console.log(`\nWrote full telemetry report to ${outPath}`);
