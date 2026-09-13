# Alignment with DATAZERO2 (IRIT Toulouse — Da Costa, Stolf)

Reference: "Assessing Power Needs to Run a Workload with Quality of
Service on Green Datacenters" (Springer, DATAZERO2, HAL: hal-04257315v1)

## The gap this project addresses
DATAZERO2's scheduling algorithm assumes clean, per-machine power and
DVFS-state data as input. In real infrastructure this data is locked
behind vendor-specific Modbus/BACnet register maps that differ across
manufacturers (Eaton, Vertiv, Schneider). RackDynamics' adapter +
normalization layer solves exactly this upstream problem.

## What this project contributes
- A vendor-agnostic adapter pattern (`backend/ingestion/adapters/`)
  normalizing heterogeneous device telemetry into one schema
- `StandardTelemetryReading` extended with `real_power_watts`,
  `available_power_states`, and `machine_class` fields — the inputs
  DATAZERO2's binary-search algorithm consumes
- A working demo aggregating real, heterogeneous machine telemetry
  (see `backend/ingestion/adapters/local_machine_adapter.py`) into a
  "minimum power for target load" rollup — a toy analog of the
  paper's core computation, built on real hardware data.