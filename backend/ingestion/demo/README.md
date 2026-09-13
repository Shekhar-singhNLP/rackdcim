# ⚠️ DEMO FOLDER — REMOVE BEFORE PUBLIC LAUNCH

This folder exists purely for live, in-person prototype demonstrations
(investors, evaluators, research partners) where no real Modbus/RS485
hardware is present on-site.

## What it does
1. `extract_local_telemetry.py` — manually run on any machine, pulls
   real CPU/power telemetry, saves a raw JSON snapshot.
2. `feed_to_pipeline.py` — reads that snapshot and runs it through the
   exact same `StandardTelemetryReading` normalization used by the
   real vendor adapters (`backend/ingestion/adapters/`).

## Why manual, not automatic
This is intentional for demo transparency — each step is visible and
run on command, so it's clear to a non-technical audience what data
was pulled and how it was processed, rather than happening silently
in the background.

## In production
This manual two-step process is replaced by the automatic adapter
polling loop (`BaseAdapter.poll()` on a scheduled interval) once real
device connections are configured. Delete this folder entirely at
that point.