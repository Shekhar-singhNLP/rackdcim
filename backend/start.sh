#!/bin/bash
python -m backend.ingestion.protocols.simulator.multi_device_simulator &
uvicorn backend.api.main:app --host 0.0.0.0 --port 10000