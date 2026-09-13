"""
Canonical telemetry shape that every source — vendor Modbus adapters
and non-Modbus sources alike — must produce. Downstream modules
(edge_ai, api, storage) only ever depend on this shape, never on a
specific vendor's or source's raw format.
"""

from __future__ import annotations

from datetime import datetime, timezone

from pydantic import BaseModel, Field


class StandardTelemetryReading(BaseModel):
    device_id: str
    vendor: str
    model: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    input_voltage: float
    output_voltage: float
    load_current: float
    battery_voltage: float
    battery_capacity: float
    internal_temperature: float

    on_battery: bool
    on_bypass: bool
    battery_low: bool

    # --- Power / DVFS-state fields (added for research alignment) ---
    real_power_watts: float | None = None
    available_power_states: list[float] = Field(default_factory=list)
    machine_class: str = "unclassified"
    sampling_interval_ms: int = 1000