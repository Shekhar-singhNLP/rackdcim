"""
Simulated Modbus TCP UPS device.

Serves realistic, drifting telemetry over Modbus TCP so the ingestion
and edge_ai pipelines can be developed and tested before any physical
hardware is connected. Register layout is vendor-agnostic and driven
entirely by a JSON profile, matching how real adapters will later
consume vendor register maps.
"""

from __future__ import annotations

import asyncio
import json
import logging
import random
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from pymodbus.datastore import (
    ModbusSequentialDataBlock,
    ModbusServerContext,
    ModbusSlaveContext,
)
from pymodbus.server import StartAsyncTcpServer

logger = logging.getLogger("rackdynamics.simulator")

PROFILE_PATH = Path(__file__).parent / "dummy_ups_profile.json"


@dataclass(frozen=True)
class SimulatorConfig:
    host: str = "0.0.0.0"
    port: int = 5020
    update_interval_sec: float = 2.0
    anomaly_probability: float = 0.03  # injected per tick, per register


def _load_profile(path: Path = PROFILE_PATH) -> dict[str, Any]:
    with path.open() as f:
        return json.load(f)


class UPSSimulator:
    """Owns the Modbus datastore and drives it with synthetic telemetry."""

    def __init__(self, profile: dict[str, Any], config: SimulatorConfig) -> None:
        self._profile = profile
        self._config = config
        self._holding_map = profile["registers"]["holding"]
        self._discrete_map = profile["registers"]["discrete_input"]

        block_size = max(r["address"] for r in self._holding_map.values()) + 1
        self._holding_block = ModbusSequentialDataBlock(0, [0] * block_size)
        self._discrete_block = ModbusSequentialDataBlock(
            0, [0] * (max(r["address"] for r in self._discrete_map.values()) + 1)
        )

        self._slave_context = ModbusSlaveContext(
            hr=self._holding_block, di=self._discrete_block
        )
        self.server_context = ModbusServerContext(
            slaves=self._slave_context, single=True
        )

    def _encode(self, name: str, value: float) -> int:
        scale = self._holding_map[name]["scale"]
        return int(round(value * scale))

    def _seed_baseline(self) -> None:
        for name, meta in self._holding_map.items():
            self._holding_block.setValues(
                meta["address"] + 1, [self._encode(name, meta["nominal"])]
            )
        for meta in self._discrete_map.values():
            self._discrete_block.setValues(meta["address"] + 1, [0])

    def _tick(self) -> None:
        """Apply small realistic drift, with rare anomaly injection."""
        for name, meta in self._holding_map.items():
            nominal = meta["nominal"]
            drift = random.gauss(0, nominal * 0.01)

            if random.random() < self._config.anomaly_probability:
                drift += nominal * random.uniform(0.15, 0.4)
                logger.warning("Injected anomaly on %s", name)

            new_value = max(0.0, nominal + drift)
            self._holding_block.setValues(
                meta["address"] + 1, [self._encode(name, new_value)]
            )

        on_battery = random.random() < 0.02
        self._discrete_block.setValues(
            self._discrete_map["on_battery"]["address"] + 1, [int(on_battery)]
        )

    async def run_updates(self) -> None:
        self._seed_baseline()
        while True:
            await asyncio.sleep(self._config.update_interval_sec)
            self._tick()


async def main(config: SimulatorConfig | None = None) -> None:
    logging.basicConfig(
        level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s"
    )
    config = config or SimulatorConfig()
    profile = _load_profile()

    simulator = UPSSimulator(profile=profile, config=config)
    logger.info(
        "Starting simulated %s on %s:%d",
        profile["model"],
        config.host,
        config.port,
    )

    await asyncio.gather(
        StartAsyncTcpServer(
            context=simulator.server_context,
            address=(config.host, config.port),
        ),
        simulator.run_updates(),
    )


if __name__ == "__main__":
    asyncio.run(main())