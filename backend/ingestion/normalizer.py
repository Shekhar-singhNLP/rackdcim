"""
Shared decode logic used by every adapter. A register map defines
address + scale + unit per field; this module has no knowledge of
any specific vendor.
"""

from __future__ import annotations

from typing import Any


def decode_holding_value(raw_int: int, field_meta: dict[str, Any]) -> float:
    return raw_int / field_meta["scale"]


def decode_holding_block(
    raw_values: list[int], holding_map: dict[str, dict[str, Any]]
) -> dict[str, float]:
    decoded: dict[str, float] = {}
    for name, meta in holding_map.items():
        decoded[name] = decode_holding_value(raw_values[meta["address"]], meta)
    return decoded


def decode_discrete_block(
    raw_bits: list[bool], discrete_map: dict[str, dict[str, Any]]
) -> dict[str, bool]:
    return {name: raw_bits[meta["address"]] for name, meta in discrete_map.items()}