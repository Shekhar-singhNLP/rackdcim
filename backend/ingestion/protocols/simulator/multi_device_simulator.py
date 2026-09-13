"""
backend/ingestion/protocols/simulator/multi_device_simulator.py

Runs multiple heterogeneous simulated devices concurrently, each on
its own TCP port, using the existing UPSSimulator engine (a generic
Modbus register simulator, despite its name — it works for any
device whose registers follow the holding/discrete_input JSON shape).

Models a realistic small rack: UPS, PDU, and a cooling unit (CRAC)
running simultaneously, each with a machine-class-driven power
profile. This is the input fleet for the aggregation layer, which
implements the DATAZERO2 heterogeneous power/DVFS-state selection
problem (see backend/scheduling/machine_profiles.py).
"""

from __future__ import annotations

import asyncio
import logging
from dataclasses import dataclass
from pathlib import Path

from pymodbus.server import StartAsyncTcpServer

from backend.ingestion.protocols.simulator.modbus_simulator import (
    SimulatorConfig,
    UPSSimulator,
    _load_profile,
)
from backend.scheduling.machine_profiles import MACHINE_PROFILES, MachineProfile

logger = logging.getLogger("rackdynamics.simulator.multi")

SIMULATOR_DIR = Path(__file__).parent


@dataclass(frozen=True)
class SimulatedDevice:
    device_id: str
    machine_class: str
    port: int
    profile_file: str  # which register-map JSON to load


# --- Simulated small-rack fleet: UPS + PDU + cooling, heterogeneous classes ---
FLEET: list[SimulatedDevice] = [
    SimulatedDevice(device_id="ups-hp-01", machine_class="high_performance", port=5020, profile_file="dummy_ups_profile.json"),
    SimulatedDevice(device_id="pdu-eff-01", machine_class="efficiency", port=5021, profile_file="dummy_pdu_profile.json"),
    SimulatedDevice(device_id="crac-base-01", machine_class="baseline", port=5022, profile_file="dummy_crac_profile.json"),
]


def _build_simulator_for_device(device: SimulatedDevice) -> UPSSimulator:
    profile = _load_profile(SIMULATOR_DIR / device.profile_file)
    machine_profile: MachineProfile = MACHINE_PROFILES[device.machine_class]

    mid_power = machine_profile.power_states_watts[len(machine_profile.power_states_watts) // 2]
    nominal_voltage = profile["registers"]["holding"]["output_voltage"]["nominal"]
    nominal_current = round(mid_power / nominal_voltage, 2)
    profile["registers"]["holding"]["load_current"]["nominal"] = nominal_current

    # Some device types (e.g. PDU) expose a dedicated total_power_watts
    # register instead of relying on voltage x current. Keep it
    # consistent with the same machine-class power target.
    if "total_power_watts" in profile["registers"]["holding"]:
        profile["registers"]["holding"]["total_power_watts"]["nominal"] = mid_power

    config = SimulatorConfig(host="0.0.0.0", port=device.port)
    return UPSSimulator(profile=profile, config=config)


async def _run_device(device: SimulatedDevice) -> None:
    simulator = _build_simulator_for_device(device)
    logger.info(
        "Starting '%s' (%s, class=%s) on port %d",
        device.device_id, device.profile_file, device.machine_class, device.port,
    )
    await asyncio.gather(
        StartAsyncTcpServer(context=simulator.server_context, address=("0.0.0.0", device.port)),
        simulator.run_updates(),
    )


async def main() -> None:
    logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
    logger.info("Starting simulated rack fleet: %d heterogeneous devices...", len(FLEET))
    await asyncio.gather(*(_run_device(d) for d in FLEET))


if __name__ == "__main__":
    asyncio.run(main())