"""
Contract every vendor adapter must satisfy. Adding a new vendor means
writing one new subclass here — nothing else in the system changes.
"""

from __future__ import annotations

import json
from abc import abstractmethod

from backend.ingestion.protocols.protocols_source import TelemetrySource

from pathlib import Path
from typing import Any

from backend.common_schema.telemetry_schema import StandardTelemetryReading
from backend.ingestion.normalizer import decode_discrete_block, decode_holding_block
from backend.ingestion.protocols.modbus_client import ModbusClient


class BaseAdapter(TelemetrySource):
    vendor: str
    model: str
    register_map_file: str

    def __init__(self, device_id: str, host: str, port: int) -> None:
        self.device_id = device_id
        self._client = ModbusClient(host=host, port=port)
        self._register_map = self._load_register_map()

    def _load_register_map(self) -> dict[str, Any]:
        path = Path(__file__).parent / "register_maps" / self.register_map_file
        with path.open() as f:
            return json.load(f)

    async def connect(self) -> None:
        await self._client.connect()

    async def disconnect(self) -> None:
        await self._client.disconnect()

    @abstractmethod
    async def _read_raw(self) -> tuple[list[int], list[bool]]:
        """Vendor-specific register read. Returns (holding_values, discrete_bits)."""

    async def poll(self) -> StandardTelemetryReading:
        holding_raw, discrete_raw = await self._read_raw()
        registers = self._register_map["registers"]

        holding = decode_holding_block(holding_raw, registers["holding"])
        discrete = decode_discrete_block(discrete_raw, registers["discrete_input"])

        return StandardTelemetryReading(
            device_id=self.device_id,
            vendor=self.vendor,
            model=self.model,
            **holding,
            **discrete,
        )