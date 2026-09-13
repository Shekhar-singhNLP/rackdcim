"""
backend/scheduling/fleet_poller.py

Connects to every device in the simulated rack fleet (see
multi_device_simulator.py) and returns normalized readings for all
of them. This is the data-collection step feeding the aggregation
layer (next file) — the layer that reasons about heterogeneous
machine/power-state selection, per the DATAZERO2 problem framing.

Unlike EatonAdapter/VertivAdapter (which represent real vendor
integrations), this poller is generic by design: the simulated fleet
devices all share the same register-map JSON shape, so one reader
handles all of them without a per-vendor subclass.
"""

from __future__ import annotations

import asyncio
import json
from pathlib import Path
from typing import Any

from backend.common_schema.telemetry_schema import StandardTelemetryReading
from backend.ingestion.normalizer import decode_discrete_block, decode_holding_block
from backend.ingestion.protocols.modbus_client import ModbusClient
from backend.ingestion.protocols.simulator.multi_device_simulator import FLEET, SimulatedDevice

SIMULATOR_DIR = Path(__file__).parent.parent / "ingestion" / "protocols" / "simulator"


def _load_device_register_map(device: SimulatedDevice) -> dict[str, Any]:
    with (SIMULATOR_DIR / device.profile_file).open() as f:
        return json.load(f)


async def poll_device(device: SimulatedDevice, host: str = "127.0.0.1") -> StandardTelemetryReading:
    register_map = _load_device_register_map(device)
    holding_map = register_map["registers"]["holding"]
    discrete_map = register_map["registers"]["discrete_input"]

    client = ModbusClient(host=host, port=device.port)
    await client.connect()
    try:
        holding_raw = await client.read_holding_registers(0, len(holding_map))
        discrete_raw = await client.read_discrete_inputs(0, len(discrete_map))
    finally:
        await client.disconnect()

    holding = decode_holding_block(holding_raw, holding_map)
    discrete = decode_discrete_block(discrete_raw, discrete_map)

    # Fields not present in a given device's register map (e.g. PDU
    # has no battery_voltage) default to 0.0 / False rather than
    # erroring — devices are heterogeneous by design.
    return StandardTelemetryReading(
        device_id=device.device_id,
        vendor=register_map["vendor"],
        model=register_map["model"],
        input_voltage=holding.get("input_voltage", 0.0),
        output_voltage=holding.get("output_voltage", 0.0),
        load_current=holding.get("load_current", 0.0),
        battery_voltage=holding.get("battery_voltage", 0.0),
        battery_capacity=holding.get("battery_capacity", 0.0),
        internal_temperature=holding.get("internal_temperature", 0.0),
        on_battery=discrete.get("on_battery", False),
        on_bypass=discrete.get("on_bypass", False),
        battery_low=discrete.get("battery_low", False),
        real_power_watts=holding.get("total_power_watts")
            or (holding.get("output_voltage", 0.0) * holding.get("load_current", 0.0)),
        machine_class=device.machine_class,
    )


async def poll_fleet(host: str = "127.0.0.1") -> list[StandardTelemetryReading]:
    readings = await asyncio.gather(*(poll_device(d, host) for d in FLEET))
    return list(readings)


async def main() -> None:
    readings = await poll_fleet()
    for r in readings:
        print(r.model_dump_json(indent=2))


if __name__ == "__main__":
    asyncio.run(main())