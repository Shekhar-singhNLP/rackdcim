#!/bin/bash
python -m ingestion.protocols.simulator.multi_device_simulator &
uvicorn api.main:app --host 0.0.0.0 --port 10000