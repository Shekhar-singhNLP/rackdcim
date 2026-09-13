"""
backend/ingestion/demo/feed_to_pipeline.py

DEMO / PROTOTYPE DEMONSTRATION SCRIPT — NOT PRODUCTION CODE
=============================================================
Reads the raw snapshot produced by extract_local_telemetry.py and
feeds it through the SAME normalization schema (StandardTelemetryReading)
used by real vendor adapters (Eaton, Vertiv). This is the proof point:
the pipeline behaves identically regardless of where the data came
from — a real UPS or a laptop's own sensors.

DELETE this file with the rest of `demo/` before public launch.
=============================================================
"""

from __future__ import annotations

import json
import logging
from pathlib import Path

from backend.common_schema.telemetry_schema import StandardTelemetryReading

logger = logging.getLogger("rackdynamics.demo.feeder")

SNAPSHOT_PATH = Path(__file__).parent / "output" / "local_snapshot.json"


def _field_value(snapshot: dict, name: str, default):
    field = snapshot["fields"].get(name, {})
    if field.get("available"):
        return field["value"]
    logger.warning(
        "Field '%s' unavailable (%s) — falling back to default %r",
        name, field.get("reason"), default,
    )
    return default


def build_reading(snapshot: dict) -> StandardTelemetryReading:
    cpu = _field_value(snapshot, "cpu_freq", {"current_mhz": 0.0, "min_mhz": 0.0, "max_mhz": 0.0})
    battery = _field_value(snapshot, "battery", {"percent": 0.0, "power_plugged": False})
    power_watts = _field_value(snapshot, "power_watts", None)

    return StandardTelemetryReading(
        device_id=snapshot["device_id"],
        vendor="local",
        model="host-machine",
        input_voltage=0.0,
        output_voltage=0.0,
        load_current=0.0,
        battery_voltage=0.0,
        battery_capacity=battery["percent"],
        internal_temperature=0.0,
        on_battery=not battery["power_plugged"],
        on_bypass=False,
        battery_low=battery["percent"] < 20,
        real_power_watts=power_watts,
        available_power_states=[cpu["min_mhz"], cpu["current_mhz"], cpu["max_mhz"]],
        machine_class=snapshot["machine_class"],
        sampling_interval_ms=1000,
    )


def main() -> None:
    logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

    if not SNAPSHOT_PATH.exists():
        print(f"No snapshot found at {SNAPSHOT_PATH}. Run extract_local_telemetry.py first.")
        return

    snapshot = json.loads(SNAPSHOT_PATH.read_text())
    print(f"Loaded raw snapshot for device '{snapshot['device_id']}'\n")

    reading = build_reading(snapshot)

    print("Normalized output (same StandardTelemetryReading schema used by Eaton/Vertiv adapters):\n")
    print(reading.model_dump_json(indent=2))


if __name__ == "__main__":
    main()