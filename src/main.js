import {
  ensureRapier,
  STAGE_DEFINITIONS,
  TAKE_PRESETS,
  CogworksPhysicsSimulation
} from './physics-engine.js';
import { CogworksSceneView } from './scene-builder.js';
import { CogworksAudioEngine } from './audio-engine.js';

// ============================================================================
// COGWORKS — TAKE 606 PHYSICS ATELIER
// Main Interactive Application Controller
// ============================================================================

class CogworksAtelierApp {
  constructor() {
    this.canvas = document.getElementById('atelier-canvas');
    this.audio = new CogworksAudioEngine();
    this.sceneView = new CogworksSceneView(this.canvas);
    this.sim = null;

    this.activePresetId = 'take606';
    this.params = { ...TAKE_PRESETS.take606.params };
    this.simSpeed = 1.0;
    this.paused = false;
    this.selectedStageId = 1;
    this.manualTimeMode = new URLSearchParams(window.location.search).has('manual');

    this._bindDOM();
    this._renderStageStrip();
  }

  async init() {
    await ensureRapier();
    this.sim = new CogworksPhysicsSimulation(this.params);
    this.sceneView.rebuildFromSimulation(this.sim);
    this._syncResponsiveDrawer();
    this._syncUI();
    this.sceneView.render();

    window.addEventListener('resize', () => {
      this._syncResponsiveDrawer();
      this.sceneView.resize();
      this.sceneView.render();
    });

    this._startLoop();
  }

  _syncResponsiveDrawer() {
    const isMobile = window.innerWidth <= 900;
    this.drawer.classList.toggle('collapsed', isMobile);
    this.btnToggleDrawer.classList.toggle('active', !isMobile);
    this.btnToggleDrawer.setAttribute('aria-expanded', String(!isMobile));
    this.sceneView.setDrawerState(!isMobile, 336);
  }

  _bindDOM() {
    this.elStatusPill = document.getElementById('run-status-pill');
    this.btnLaunch = document.getElementById('btn-launch');
    this.btnPause = document.getElementById('btn-pause');
    this.btnReset = document.getElementById('btn-reset');
    this.btnAudio = document.getElementById('btn-audio');
    this.btnToggleDrawer = document.getElementById('btn-toggle-drawer');
    this.drawer = document.getElementById('sandbox-drawer');

    this.elOutcomeBanner = document.getElementById('outcome-banner');
    this.elOutcomeCode = document.getElementById('outcome-code');
    this.elOutcomeText = document.getElementById('outcome-text');

    this.elClock = document.getElementById('telemetry-clock');
    this.elStages = document.getElementById('metric-stages');
    this.elSpeed = document.getElementById('metric-speed');
    this.elEnergy = document.getElementById('metric-energy');
    this.elTires = document.getElementById('metric-tires');

    this.elMobStages = document.getElementById('mob-stages');
    this.elMobSpeed = document.getElementById('mob-speed');
    this.elMobTires = document.getElementById('mob-tires');
    this.elMobClock = document.getElementById('mob-clock');

    this.elInspectorCode = document.getElementById('inspector-stage-code');
    this.elInspectorDesc = document.getElementById('inspector-stage-desc');
    this.btnTriggerStage = document.getElementById('btn-trigger-stage');
    this.elPresetTag = document.getElementById('active-preset-tag');

    this.sliderImpulse = document.getElementById('slider-impulse');
    this.valImpulse = document.getElementById('val-impulse');
    this.sliderCwMass = document.getElementById('slider-cw-mass');
    this.valCwMass = document.getElementById('val-cw-mass');
    this.sliderFriction = document.getElementById('slider-friction');
    this.valFriction = document.getElementById('val-friction');
    this.sliderGravity = document.getElementById('slider-gravity');
    this.valGravity = document.getElementById('val-gravity');

    this.stageStrip = document.getElementById('stage-strip');

    // Launch button
    this.btnLaunch.addEventListener('click', () => {
      this.audio.init();
      if (!this.sim) return;
      if (this.sim.started) {
        this.resetSimulation();
      }
      this.paused = false;
      this.sim.launch();
      this._syncUI();
    });

    // Pause / Resume button
    this.btnPause.addEventListener('click', () => {
      if (!this.sim || !this.sim.started) return;
      this.paused = !this.paused;
      this._syncUI();
    });

    // Reset button
    this.btnReset.addEventListener('click', () => {
      this.resetSimulation();
    });

    // Audio toggle
    this.btnAudio.addEventListener('click', () => {
      const on = this.audio.toggle();
      this.btnAudio.textContent = on ? 'Audio: ON' : 'Audio: OFF';
      this.btnAudio.classList.toggle('active', on);
      this.btnAudio.setAttribute('aria-pressed', String(on));
    });

    // Drawer toggle
    this.btnToggleDrawer.addEventListener('click', () => {
      const collapsed = this.drawer.classList.toggle('collapsed');
      this.btnToggleDrawer.classList.toggle('active', !collapsed);
      this.btnToggleDrawer.setAttribute('aria-expanded', String(!collapsed));
      this.sceneView.setDrawerState(!collapsed, 336);
      this.sceneView.render();
    });

    // Preset buttons
    document.querySelectorAll('[data-preset]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const presetKey = btn.getAttribute('data-preset');
        this.applyPreset(presetKey, true);
      });
    });

    // Camera mode buttons
    document.querySelectorAll('[data-cam]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const camMode = btn.getAttribute('data-cam');
        this.setCameraMode(camMode);
      });
    });

    // Trigger selected stage button
    this.btnTriggerStage.addEventListener('click', () => {
      this.audio.init();
      this.triggerStage(this.selectedStageId);
    });

    // Physics Tuning Sliders
    const onSliderChange = () => {
      this.params.launchImpulse = Number(this.sliderImpulse.value);
      this.params.tireCounterweightMass = Number(this.sliderCwMass.value);
      this.params.frictionScale = Number(this.sliderFriction.value);
      this.params.gravityScale = Number(this.sliderGravity.value);
      this.activePresetId = 'custom';
      this._updateSliderLabels();
      this.resetSimulation();
    };

    this.sliderImpulse.addEventListener('input', onSliderChange);
    this.sliderCwMass.addEventListener('input', onSliderChange);
    this.sliderFriction.addEventListener('input', onSliderChange);
    this.sliderGravity.addEventListener('input', onSliderChange);

    // Simulation Speed buttons
    document.querySelectorAll('[data-speed]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.simSpeed = Number(btn.getAttribute('data-speed'));
        document.querySelectorAll('[data-speed]').forEach((b) => b.classList.toggle('active', b === btn));
      });
    });

    // Debug Vector Overlays
    document.querySelectorAll('[data-overlay]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-overlay');
        const nextVal = !this.sceneView.overlays[key];
        this.sceneView.setOverlayFlag(key, nextVal);
        btn.classList.toggle('active', nextVal);
        this.sceneView.render();
      });
    });
  }

  _renderStageStrip() {
    this.stageStrip.innerHTML = '';
    this.stageCardElements = new Map();

    STAGE_DEFINITIONS.forEach((st) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.id = `stage-card-${st.id}`;
      btn.className = `stage-card${st.id === this.selectedStageId ? ' is-selected' : ''}`;
      btn.innerHTML = `
        <div class="stage-card-top">
          <span class="stage-card-code">${st.code}</span>
          <span class="stage-card-time" id="stage-time-${st.id}">READY</span>
        </div>
        <div class="stage-card-name">${st.shortName}</div>
      `;
      btn.addEventListener('click', () => {
        this.selectStage(st.id, true);
      });
      this.stageStrip.appendChild(btn);
      this.stageCardElements.set(st.id, btn);
    });
  }

  selectStage(stageId, focusCamera = true) {
    this._syncInspectorCard(stageId);
    if (focusCamera) {
      this.setCameraMode('stage', stageId);
    }
  }

  _syncInspectorCard(stageId) {
    this.selectedStageId = stageId;
    const st = STAGE_DEFINITIONS[stageId - 1] || STAGE_DEFINITIONS[0];
    this.elInspectorCode.textContent = `STAGE ${st.code} • ${st.shortName.toUpperCase()}`;
    if (st.id === 6 && this.params) {
      const cw = Number(this.params.tireCounterweightMass).toFixed(2);
      this.elInspectorDesc.textContent =
        Number(this.params.tireCounterweightMass) >= 2.5
          ? `8th valve nudges 3 radial tires past top-dead-center so their ${cw} kg internal copper counterweights roll them UPHILL.`
          : `8th valve nudges Tire #1, but its ${cw} kg internal copper counterweight cannot overcome uphill gravity torque on the 7.5° ramp.`;
    } else {
      this.elInspectorDesc.textContent = st.note;
    }
    this.btnTriggerStage.textContent = `Trigger Stage ${st.code}`;

    for (const [id, el] of this.stageCardElements.entries()) {
      const selected = id === stageId;
      el.classList.toggle('is-selected', selected);
      if (selected && el.scrollIntoView) {
        el.scrollIntoView({ block: 'nearest', inline: 'center' });
      }
    }
  }

  setCameraMode(mode, stageId = null) {
    this.sceneView.setCameraMode(mode, stageId !== null ? stageId : this.selectedStageId);
    document.querySelectorAll('[data-cam]').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-cam') === mode);
    });
  }

  applyPreset(presetKey, autoLaunch = false) {
    const preset = TAKE_PRESETS[presetKey];
    if (!preset) return;
    this.activePresetId = presetKey;
    this.params = { ...preset.params };

    this.sliderImpulse.value = String(this.params.launchImpulse);
    this.sliderCwMass.value = String(this.params.tireCounterweightMass);
    this.sliderFriction.value = String(this.params.frictionScale);
    this.sliderGravity.value = String(this.params.gravityScale);
    this._updateSliderLabels();

    document.querySelectorAll('[data-preset]').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-preset') === presetKey);
    });

    this.resetSimulation();
    if (autoLaunch) {
      if (!this.manualTimeMode) {
        this.audio.init();
      }
      this.setCameraMode('dolly');
      this.sim.launch();
      this._syncUI();
    }
  }

  triggerStage(stageId) {
    if (!this.sim) return;
    this.resetSimulation();
    this.selectStage(stageId, true);
    this.paused = false;
    this.sim.triggerFromStage(stageId);
    this._syncUI();
  }

  resetSimulation() {
    if (!this.sim) return;
    this.paused = false;
    this.sim.reset(this.params);
    this.sceneView.rebuildFromSimulation(this.sim);
    if (this.sceneView.cameraMode === 'dolly') {
      this._syncInspectorCard(1);
      const zMult = this.sceneView._getPortraitZoomMultiplier();
      const isPortrait = zMult > 1.05;
      if (isPortrait) {
        this.sceneView.desiredCamPos.set(-34.95, 4.45, 7.6);
        this.sceneView.desiredTarget.set(-23.55, 3.35, 0);
      } else {
        this.sceneView.desiredCamPos.set(-23.35, 4.25, 6.75);
        this.sceneView.desiredTarget.set(-23.35, 3.90, 0);
      }
      this.sceneView.camera.position.copy(this.sceneView.desiredCamPos);
      this.sceneView.controls.target.copy(this.sceneView.desiredTarget);
      this.sceneView._applyCameraViewOffset();
      this.sceneView._syncPlaquePositions(this.sceneView.desiredCamPos);
      this.sceneView.controls.update();
    }
    this._syncUI();
    this.sceneView.render();
  }

  _updateSliderLabels() {
    this.valImpulse.textContent = `${Number(this.params.launchImpulse).toFixed(2)}x`;
    this.valCwMass.textContent = `${Number(this.params.tireCounterweightMass).toFixed(2)} kg`;
    this.valFriction.textContent = `${Number(this.params.frictionScale).toFixed(2)}x`;
    const gVal = Number(this.params.gravityScale);
    this.valGravity.textContent = `${gVal.toFixed(2)}g (${(gVal * 9.81).toFixed(2)} m/s²)`;

    if (this.activePresetId === 'take606') {
      this.elPresetTag.textContent = 'TAKE #606';
    } else if (this.activePresetId === 'take142') {
      this.elPresetTag.textContent = 'TAKE #142';
    } else if (this.activePresetId === 'take419') {
      this.elPresetTag.textContent = 'TAKE #419';
    } else {
      this.elPresetTag.textContent = 'CUSTOM TUNING';
    }
  }

  stepSimulationByMs(ms, shouldRender = true) {
    if (!this.sim) return null;
    const chunkMs = 50;
    let remainingMs = Math.max(1, ms);
    let snapshot = null;

    while (remainingMs > 0) {
      const dtMs = Math.min(remainingMs, chunkMs);
      remainingMs -= dtMs;
      const scaledSeconds = (dtMs / 1000) * this.simSpeed;
      const steps = Math.max(1, Math.round(scaledSeconds / this.sim.dt));

      if (this.sim.started && !this.paused && !this.sim.completed && !this.sim.failedStage) {
        for (let i = 0; i < steps; i++) {
          this.sim.step();
          if (this.sim.completed || this.sim.failedStage) break;
        }
      }

      snapshot = this.sim.getTelemetrySnapshot();
      const newEvents = this.sim.eventsQueue.splice(0, this.sim.eventsQueue.length);
      if (!this.manualTimeMode) {
        this.audio.processSimulationEvents(newEvents, snapshot);
      }
      this.sceneView.syncFromSnapshot(snapshot, dtMs);
    }

    this._syncUI(snapshot);
    if (shouldRender) {
      this.sceneView.render();
    }
    return snapshot;
  }

  _syncUI(snapshot = null) {
    if (!this.sim) return;
    const snap = snapshot || this.sim.getTelemetrySnapshot();

    // Update top status pill & buttons
    this.btnPause.disabled = !snap.started || snap.completed || Boolean(snap.failedStage);
    this.btnPause.textContent = this.paused ? 'Resume' : 'Pause';
    this.btnLaunch.textContent = snap.started ? 'Re-Launch Bearing' : 'Flick Transmission Bearing';

    if (snap.completed) {
      this.elStatusPill.className = 'status-pill status-complete';
      this.elStatusPill.textContent = `COMPLETE • 13/13 (${snap.simTime.toFixed(2)}s)`;
      // Do not show a duplicate bottom toast on completion — the unfurled 3D banner at Stage 13 is the payoff
      this.elOutcomeBanner.className = 'outcome-banner hidden';
    } else if (snap.failedStage) {
      this.elStatusPill.className = 'status-pill status-failed';
      this.elStatusPill.textContent = `FAILED AT STAGE 0${snap.failedStage}`;
      this.elOutcomeBanner.className = 'outcome-banner is-failed';
      this.elOutcomeCode.textContent = `${this.elPresetTag.textContent} • CHAIN INTERRUPTED AT STAGE 0${snap.failedStage}`;
      this.elOutcomeText.textContent = snap.failedReason;
    } else if (snap.started) {
      const code = String(snap.activeStage).padStart(2, '0');
      const stDef = STAGE_DEFINITIONS[snap.activeStage - 1];
      this.elStatusPill.className = 'status-pill status-running';
      const isNarrow = window.innerWidth <= 640;
      this.elStatusPill.textContent = isNarrow
        ? `${this.paused ? 'PAUSED' : 'ACTIVE'} • STAGE ${code}`
        : `${this.paused ? 'PAUSED' : 'STAGE'} ${code} • ${stDef ? stDef.shortName.toUpperCase() : ''}`;
      this.elOutcomeBanner.className = 'outcome-banner hidden';
    } else {
      this.elStatusPill.className = 'status-pill status-ready';
      this.elStatusPill.textContent = 'READY • STAGE 01';
      this.elOutcomeBanner.className = 'outcome-banner hidden';
    }

    // Keep Stage Inspector Card & selected bottom chip synchronized with the active stage during runs
    if (snap.started && this.sceneView.cameraMode !== 'stage') {
      const targetStage = snap.completed ? 13 : (snap.failedStage || snap.activeStage || 1);
      if (this.selectedStageId !== targetStage) {
        this._syncInspectorCard(targetStage);
      }
    }

    // Keep Overlay Toggle Button states strictly synchronized with sceneView.overlays
    document.querySelectorAll('[data-overlay]').forEach((btn) => {
      const key = btn.getAttribute('data-overlay');
      const isOn = Boolean(this.sceneView.overlays[key]);
      btn.classList.toggle('active', isOn);
      btn.setAttribute('aria-pressed', String(isOn));
    });

    // Update Telemetry Readouts (Desktop & Mobile)
    const speedStr = `${snap.activeBody ? snap.activeBody.speed.toFixed(2) : '0.00'} m/s`;
    this.elClock.textContent = `T = ${snap.simTime.toFixed(2)}s`;
    this.elStages.textContent = `${snap.completedStages} / ${snap.totalStages}`;
    this.elSpeed.textContent = speedStr;
    this.elEnergy.textContent = `${snap.totalKE.toFixed(1)} / ${snap.totalPE.toFixed(0)} J`;

    let tireDxStr = '+0.00 m';
    if (this.sim.uphillTires.length > 0 && snap.bodies.uphillTire_1) {
      const t1 = this.sim.uphillTires[0];
      const dx = Number((snap.bodies.uphillTire_1.x - t1.initX).toFixed(2));
      tireDxStr = `${dx >= 0 ? '+' : ''}${dx.toFixed(2)} m`;
      this.elTires.textContent = tireDxStr;
    }

    if (this.elMobStages) {
      this.elMobStages.textContent = `${snap.completedStages}/${snap.totalStages} STAGES`;
      this.elMobSpeed.textContent = `|V| ${speedStr}`;
      this.elMobTires.textContent = `TIRES ${tireDxStr}`;
      this.elMobClock.textContent = `T=${snap.simTime.toFixed(2)}s`;
    }

    // Update Bottom 13-Stage Cards
    STAGE_DEFINITIONS.forEach((st) => {
      const card = this.stageCardElements.get(st.id);
      const timeEl = document.getElementById(`stage-time-${st.id}`);
      const status = snap.completed ? 'complete' : (snap.stageStatus[st.id] || 'ready');
      const ts = snap.stageTimestamps[st.id];

      if (card) {
        card.classList.toggle('st-active', status === 'active');
        card.classList.toggle('st-complete', status === 'complete');
        card.classList.toggle('st-failed', status === 'failed');
        if (snap.completed && this.sceneView.cameraMode !== 'stage') {
          card.classList.remove('is-selected');
        }
      }
      if (timeEl) {
        if (status === 'failed') {
          timeEl.textContent = 'FAIL';
        } else if (ts !== null && ts !== undefined) {
          timeEl.textContent = `${ts.toFixed(2)}s`;
        } else {
          timeEl.textContent = 'READY';
        }
      }
    });
  }

  _startLoop() {
    let lastTime = performance.now();
    const tick = (now) => {
      if (this.manualTimeMode) return;
      requestAnimationFrame(tick);
      const dtMs = Math.min(50, Math.max(4, now - lastTime));
      lastTime = now;
      this.stepSimulationByMs(dtMs);
    };
    if (!this.manualTimeMode) {
      requestAnimationFrame(tick);
    }
  }

  renderToText() {
    if (!this.sim) return JSON.stringify({ status: 'initializing' });
    const snap = this.sim.getTelemetrySnapshot();
    return JSON.stringify({
      preset: this.activePresetId,
      cameraMode: this.sceneView.cameraMode,
      simTime: snap.simTime,
      started: snap.started,
      paused: this.paused,
      completed: snap.completed,
      failedStage: snap.failedStage,
      failedReason: snap.failedReason,
      activeStage: snap.activeStage,
      activeStageName: snap.activeStageName,
      completedStages: snap.completedStages,
      totalStages: snap.totalStages,
      bannerUnfurled: snap.bannerUnfurled,
      params: this.params,
      overlays: this.sceneView.overlays,
      activeBody: snap.activeBody,
      stageTimestamps: snap.stageTimestamps
    });
  }
}

const app = new CogworksAtelierApp();
window.cogworksApp = app;
window.render_game_to_text = () => app.renderToText();
window.advanceTime = (ms) => {
  app.manualTimeMode = true;
  return app.stepSimulationByMs(ms);
};

app.init();
