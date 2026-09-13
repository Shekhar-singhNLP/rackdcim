"""
Thin async wrapper around pymodbus. Adapters depend on this, never on
pymodbus directly — keeps the transport swappable (e.g. serial RTU
later) without touching adapter code.
"""

from __future__ import annotations

from pymodbus.client import AsyncModbusTcpClient


class ModbusClient:
    def __init__(self, host: str, port: int) -> None:
        self._client = AsyncModbusTcpClient(host, port=port)

    async def connect(self) -> None:
        await self._client.connect()

    async def disconnect(self) -> None:
        self._client.close()

    async def read_holding_registers(self, address: int, count: int) -> list[int]:
        result = await self._client.read_holding_registers(address, count=count)
        if result.isError():
            raise ConnectionError(f"Modbus read failed at address {address}")
        return result.registers

    async def read_discrete_inputs(self, address: int, count: int) -> list[bool]:
        result = await self._client.read_discrete_inputs(address, count=count)
        if result.isError():
            raise ConnectionError(f"Modbus discrete read failed at address {address}")
        return result.bits[:count]