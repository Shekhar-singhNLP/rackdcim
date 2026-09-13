"""
backend/ingestion/demo/extract_local_telemetry.py

DEMO / PROTOTYPE DEMONSTRATION SCRIPT — NOT PRODUCTION CODE
=============================================================
Manually run this on any machine to extract its real telemetry
(CPU frequency states, battery power draw) as a live snapshot, for
in-person investor/evaluator demos before real Modbus/RS485 hardware
is integrated.

Each field is extracted independently with its own fallback — if one
sensor is unavailable on a given machine (e.g. no battery on a
desktop), the rest of the pipeline still runs. Nothing is guessed or
fabricated; unavailable fields are explicitly marked as such.

DELETE this entire `demo/` folder before public launch. Production
telemetry acquisition happens automatically via `backend/ingestion/
adapters/`, not by manually running a script.
=============================================================
"""

from __future__ import annotations

import json
import logging
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Callable

import psutil

logger = logging.getLogger("rackdynamics.demo.extractor")

OUTPUT_PATH = Path(__file__).parent / "output" / "local_snapshot.json"


@dataclass
class FieldResult:
    value: Any
    available: bool
    reason: str | None = None


def _safe_extract(name: str, fn: Callable[[], Any]) -> FieldResult:
    """Runs one extraction independently — a failure here never stops the others."""
    try:
        value = fn()
        if value is None:
            return FieldResult(value=None, available=False, reason="source returned no data")
        return FieldResult(value=value, available=True)
    except Exception as exc:
        logger.warning("Field '%s' unavailable: %s", name, exc)
        return FieldResult(value=None, available=False, reason=str(exc))


def _extract_cpu_freq() -> dict | None:
    freq = psutil.cpu_freq()
    if freq is None:
        return None
    return {
        "current_mhz": freq.current,
        "min_mhz": freq.min or 0.0,
        "max_mhz": freq.max or freq.current,
    }


def _extract_battery() -> dict | None:
    battery = psutil.sensors_battery()
    if battery is None:
        return None
    return {"percent": battery.percent, "power_plugged": battery.power_plugged}


def _extract_power_watts() -> float | None:
    """Windows-only, via WMI. Returns None cleanly on any other platform or failure."""
    import wmi

    w = wmi.WMI(namespace="root/wmi")
    status = w.BatteryStatus()
    if not status:
        return None
    s = status[0]
    rate = s.ChargeRate or s.DischargeRate
    if rate is None:
        return None
    return abs(rate) / 1000


def collect_snapshot(device_id: str, machine_class: str) -> dict[str, Any]:
    cpu = _safe_extract("cpu_freq", _extract_cpu_freq)
    battery = _safe_extract("battery", _extract_battery)
    power = _safe_extract("power_watts", _extract_power_watts)

    return {
        "device_id": device_id,
        "machine_class": machine_class,
        "collected_at": datetime.now(timezone.utc).isoformat(),
        "fields": {
            "cpu_freq": vars(cpu),
            "battery": vars(battery),
            "power_watts": vars(power),
        },
    }


def main() -> None:
    logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

    device_id = input("Device ID (e.g. 'sirs-laptop-01'): ").strip() or "unnamed-device"
    machine_class = input("Machine class label (e.g. 'high-performance'): ").strip() or "unclassified"

    print("\nExtracting live telemetry from this machine...\n")
    snapshot = collect_snapshot(device_id, machine_class)

    for name, data in snapshot["fields"].items():
        status = "available" if data["available"] else f"NOT available ({data['reason']})"
        print(f"  {name}: {status}")

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(snapshot, indent=2))
    print(f"\nSaved raw snapshot -> {OUTPUT_PATH}")


if __name__ == "__main__":
    main()