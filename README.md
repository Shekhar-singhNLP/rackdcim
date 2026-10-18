# RackDCIM

**A vendor-agnostic telemetry normalization layer for critical power infrastructure (UPS, PDU, cooling), built as real-world input for power/DVFS-state scheduling research.**

Live demo: [rackdcim.com](https://rackdcim.com) · Independent student project (B.Tech CSE-AIML, PSIT Kanpur)

---

## The problem

Power telemetry from UPS, PDU and cooling units is locked in vendor-specific Modbus register maps. Scheduling and power-modeling research usually *assumes* clean, per-device power data as input. In real facilities that data has to be extracted and normalized first. RackDCIM is a testbed for that missing layer.

## What is built

| Component | Status | Notes |
|---|---|---|
| Modbus TCP simulator (UPS / PDU / CRAC, 3 heterogeneous devices) | **Live** | Simulated values; the protocol path is real |
| Vendor-adapter pattern (`BaseAdapter`, Eaton, Vertiv) | **Live** | Register maps are JSON-driven; adding a vendor = one adapter + one JSON |
| Normalization into one schema (`StandardTelemetryReading`) | **Live** | Pydantic model, vendor-independent |
| Fleet power aggregation + What-If simulator | **Live** | Min fleet power for a target load |
| DVFS power model | **Live** | Cubic dynamic-power scaling, P ∝ f³ |
| Binary-search QoS scheduler | **Live** | Single-machine analog, with convergence trace |
| Cooperative vs non-cooperative power sharing | **Live** | Simplified rule-based illustration |
| Corporate-style dashboard (10 pages) | **Live** | Overview, Health, Inventory, Power, Cooling, etc. |
| Predictive (ML) DVFS optimization | Roadmap | Needs real production telemetry; not built |
| AI copilot (natural-language telemetry Q&A) | Roadmap | Not built |
| Validation on physical UPS/PDU hardware | Pending | Everything runs on a simulator today |

## Research modules

Each module is *inspired by* published work. None is a replication of the original methods.

1. **DVFS power modeling** (`backend/scheduling/dvfs_states.py`): per-machine-class frequency states, with power from the standard cubic approximation. Informed by *Hardware and application aware performance, power and energy models for modern HPC servers with DVFS* (Sustainable Computing, 2025).
2. **QoS-constrained power search** (`backend/scheduling/binary_search_scheduler.py`): finds minimum power for a performance target by exploiting monotonicity of power in frequency. A simplified single-machine analog of the approach in *Assessing Power Needs to Run a Workload with Quality of Service on Green Datacenters* (DATAZERO2).
3. **Cooperative vs non-cooperative power sharing** (`backend/scheduling/marketplace_simulator.py`): rule-based illustration of why sharing surplus renewable power across sites reduces backup draw. Informed by *Cooperative vs. non-cooperative marketplace for computing jobs on geo-distributed data centers supplied by renewable energies* (Cluster Computing, 2025).

RackDCIM is independent and is not affiliated with or endorsed by the authors or their institutions. Please refer to the original papers for the actual methods.

## Architecture

```
Device (Modbus) → Protocol client → Vendor adapter → Normalizer → StandardTelemetryReading
                                                                        │
                                   Aggregation / DVFS / QoS search ◄────┘
                                                │
                                          FastAPI REST  →  React dashboard
```

## Repository layout

```
backend/
  api/                 FastAPI app and routes
  common_schema/       Unified telemetry schema
  ingestion/
    adapters/          Per-vendor adapters + JSON register maps
    protocols/         Modbus client + device simulator
    normalizer.py      Vendor-agnostic register decoding
  scheduling/          Aggregation, DVFS, binary search, marketplace
frontend/dashboard/    React + Vite + Tailwind (landing, research pages, dashboard)
docs/                  Architecture, research alignment, security notes
```

## Run locally

```bash
# 1. Python environment
python -m venv venv
venv\Scripts\activate            # Windows
pip install -r backend/requirements.txt

# 2. Terminal 1: simulated device fleet
python -m backend.ingestion.protocols.simulator.multi_device_simulator

# 3. Terminal 2: API
python -m uvicorn backend.api.main:app --reload --port 8000

# 4. Terminal 3: frontend
cd frontend/dashboard
npm install
npm run dev                      # http://localhost:5173
```

For local testing, point the `API_URL` constants in the frontend components to `http://127.0.0.1:8000`.

## API (selected)

| Route | Purpose |
|---|---|
| `GET /fleet/status` | Normalized live readings + fleet aggregation |
| `GET /fleet/what-if?target_load=` | Minimum fleet power for a target load |
| `GET /dvfs/{machine_class}` | DVFS states and power per state |
| `GET /scheduler/binary-search?machine_class=&target_ratio=` | QoS search result with convergence trace |
| `GET /marketplace/compare` | Cooperative vs non-cooperative comparison on sample sites |

## Stack

Python, FastAPI, pymodbus 3.8.3, Pydantic · React, Vite, Tailwind CSS v4, React Query, Zustand, Recharts, Framer Motion · Deployed on Render (API) and Vercel (frontend).

## Known limitations

- All telemetry is simulated; no physical hardware validation yet.
- The sample-site data in the marketplace module is hardcoded for illustration.
- The DVFS model is the standard cubic approximation, not a calibrated per-CPU model.
- Backend runs on a free tier, so the first request after idle time can take up to a minute.

## Contact

Shekhar Singh · shekharsingh7ai@gmail.com