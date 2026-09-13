"""
Common interface for any telemetry source — Modbus-based device
adapters (Eaton, Vertiv...) and non-Modbus sources (e.g. local
machine sensors used for manual demo) both implement this. Downstream
pipeline code depends only on this interface, never on the specific
source type — this is what keeps the system source-agnostic.
"""

from __future__ import annotations

from abc import ABC, abstractmethod

from backend.common_schema.telemetry_schema import StandardTelemetryReading


class TelemetrySource(ABC):
    @abstractmethod
    async def connect(self) -> None: ...

    @abstractmethod
    async def disconnect(self) -> None: ...

    @abstractmethod
    async def poll(self) -> StandardTelemetryReading: ...