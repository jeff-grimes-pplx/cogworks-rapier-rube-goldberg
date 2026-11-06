# Cogworks — Take 606 Physics Atelier

Real-time 3D rigid-body Rube Goldberg machine in **Three.js** + **`@dimforge/rapier3d-compat` (120 Hz rigid-body physics)** + **Web Audio API procedural synthesis**, inspired by Honda's 2003 *"Cog"* commercial created by Wieden+Kennedy London and directed by Antoine Bardou-Jacquet.

## Highlights

- **Zero Keyframes — 100% Live 120 Hz Rapier3D Physics**: Every stage of the 56-meter gallery chain reaction is driven by rigid-body collisions, gravity torque, revolute hinge joints, and center-of-mass offsets.
- **Authentic Uphill Rolling Tires (Stage 06)**: Each of the three radial automotive tires (`R = 0.52 m`) contains an internal off-center copper counterweight collider (`5.80 kg` at local offset `(+0.035 m, +0.43 m)`). When the 8th stainless-steel intake valve nudges the first tire past top-dead-center, Rapier3D's gravitational torque rolls all three tires uphill up the inclined timber ramp (`Δx = +0.881 m, +1.640 m, +1.435 m`).
- **13 Continuous Mechanical Stages**:
  1. **Stage 01 — Kickoff Bearing**: Chrome steel transmission bearing rolls down a 14° milled walnut channel.
  2. **Stage 02 — Synchro Hub & Helical Gear**: Bearing strikes a hinged brass synchronizer ring, tipping a 12-tooth helical transmission gear off its ledge.
  3. **Stage 03 — Double-Lobe Camshaft Lever**: Falling helical gear rotates a pivoted cast-iron camshaft, driving its eccentric brass lobe into a horizontal steel pushrod.
  4. **Stage 04 — Braided Cable Zipline Trolley**: The pushrod releases a brass pulley trolley down an inclined tensioned steel rail.
  5. **Stage 05 — Intake Valve Domino Cascade**: Trolley impacts 8 freestanding stainless-steel engine poppet intake valves on a brushed aluminum hood deck.
  6. **Stage 06 — Uphill Counterweighted Tires**: The 8th valve tips 3 copper-weighted radial tires past top-dead-center so they roll uphill up the timber ramp.
  7. **Stage 07 — Piston & Con-Rod Drop Hammer**: The top uphill tire trips a forged aluminum piston down a vertical cylinder guide onto a floor seesaw.
  8. **Stage 08 — Exhaust Muffler Floor Roll**: The seesaw catapults a cylindrical stainless exhaust muffler across the herringbone parquet gallery floor.
  9. **Stage 09 — Suspended Tempered-Glass Mobile**: Floor bellcrank transfers momentum into 5 suspended automotive glass louvers in a Newton pendulum cascade.
  10. **Stage 10 — Rain-Sensor Carafe & Walking Wipers**: The 5th glass louver tips a copper water carafe over an optical rain sensor pad, energizing a motorized windshield-wiper crawler linkage.
  11. **Stage 11 — Coil-Spring Suspension Catapult**: The walking wiper releases a compressed coil-spring catapult arm, launching a chrome ball bearing into the brake rotor chute.
  12. **Stage 12 — Dual-Disc Brake Rotor Track**: The ball accelerates between twin ventilated cast-iron brake rotors onto a brass scale pan.
  13. **Stage 13 — Shock-Absorber Plunger & Key-Fob Finale**: The scale pan drops a Bilstein gas-strut shock absorber onto an illuminated key-fob switch, tilting the cantilever trailer platform, rolling the red kinetic coupe forward, and unfurling the *"TAKE 606 — ISN'T IT NICE WHEN THINGS JUST WORK?"* gallery banner.

## Real-World Headless Rapier3D Verification

Run the deterministic 120 Hz Node.js physics verification suite:

```bash
npm install
npm run verify
```

The harness executes `@dimforge/rapier3d-compat` in headless Node.js across all three Take presets and writes the full telemetry report to `verification/rapier_verification_report.json`:

- **Take #606 (`take606` — Calibrated Golden Run)**: `13 / 13 stages completed` in `18.458 s`; Uphill Tires advance `Δx = +0.881 m, +1.640 m, +1.435 m` (`Δy = +0.116 m, +0.215 m, +0.163 m`).
- **Take #142 (`take142` — Under-Weighted Tire Stalls on Ramp)**: `5 / 13 stages completed`; fails at **Stage 06** when the `0.25 kg` counterweight produces insufficient uphill gravitational torque (`Δx = -0.032 m`).
- **Take #419 (`take419` — Excess Impulse Overshoots Zipline)**: `3 / 13 stages completed`; fails at **Stage 04** when `1.75x` launch impulse causes the zipline trolley to vault over Stage 05.
