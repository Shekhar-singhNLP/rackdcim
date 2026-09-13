"""
backend/scheduling/power_aggregator.py

RESEARCH ALIGNMENT — DATAZERO2 (IRIT Toulouse, Da Costa & Stolf)
=============================================================
Reference: "Assessing Power Needs to Run a Workload with Quality of
Service on Green Datacenters" (Springer, DATAZERO2 project)

Their algorithm's core question: given a workload/QoS target, what is
the MINIMUM power demand across a set of heterogeneous machines,
choosing which machine(s) and which power/DVFS state to run at?
Their published method uses a binary search over configurations, and
explicitly flags machine/DVFS-state selection under heterogeneity as
an open sub-problem needing real machine data as input.

This module is a toy, transparent analog of that computation, run on
REAL normalized telemetry (from fleet_poller.py) rather than assumed
values — demonstrating that RackDynamics' adapter/normalization
layer can serve as the real-world data-input layer that problem
needs. This is NOT a reimplementation of their binary-search
algorithm — it is a much simpler greedy selection, built to show the
INPUT PIPELINE working end-to-end, not to match their algorithm's
sophistication.
=============================================================
"""

from __future__ import annotations

from dataclasses import dataclass

from backend.common_schema.telemetry_schema import StandardTelemetryReading
from backend.scheduling.machine_profiles import MACHINE_PROFILES, MachineProfile


@dataclass(frozen=True)
class AggregationResult:
    total_current_power_watts: float
    per_device_power_watts: dict[str, float]
    min_fleet_power_watts: float  # if every machine ran at its lowest state
    max_fleet_power_watts: float  # if every machine ran at its highest state
    devices_considered: int


def aggregate_current_power(readings: list[StandardTelemetryReading]) -> AggregationResult:
    """Rolls up real-time power draw across the fleet, as reported right now."""
    per_device = {r.device_id: r.real_power_watts or 0.0 for r in readings}
    return AggregationResult(
        total_current_power_watts=round(sum(per_device.values()), 2),
        per_device_power_watts=per_device,
        min_fleet_power_watts=_fleet_bound(readings, use_min=True),
        max_fleet_power_watts=_fleet_bound(readings, use_min=False),
        devices_considered=len(readings),
    )


def _fleet_bound(readings: list[StandardTelemetryReading], use_min: bool) -> float:
    total = 0.0
    for r in readings:
        profile: MachineProfile = MACHINE_PROFILES.get(r.machine_class)
        if profile is None:
            continue
        total += profile.min_power() if use_min else profile.max_power()
    return round(total, 2)


def minimum_power_for_target_load(
    readings: list[StandardTelemetryReading], target_load_index: float
) -> dict[str, float | str]:
    """
    Toy analog of DATAZERO2's core question: given a target workload
    (expressed here as a simple relative load index, 0-1), what is the
    minimum total power across the fleet that meets it?

    Simplified method (NOT their binary search): for each device,
    pick the lowest power state whose relative capacity meets the
    target load share. This is deliberately simple — the point is
    proving the real-data pipeline, not the scheduling algorithm.
    """
    if not (0.0 <= target_load_index <= 1.0):
        raise ValueError("target_load_index must be between 0.0 and 1.0")

    total_power = 0.0
    breakdown: dict[str, float] = {}

    for r in readings:
        profile = MACHINE_PROFILES.get(r.machine_class)
        if profile is None:
            breakdown[r.device_id] = 0.0
            continue

        budget = profile.min_power() + target_load_index * (
            profile.max_power() - profile.min_power()
        )
        chosen_state = profile.nearest_state_for_power_budget(budget)
        breakdown[r.device_id] = chosen_state
        total_power += chosen_state

    return {
        "target_load_index": target_load_index,
        "total_power_watts": round(total_power, 2),
        **{f"{k}_watts": v for k, v in breakdown.items()},
    }


async def main() -> None:
    from backend.scheduling.fleet_poller import poll_fleet

    readings = await poll_fleet()

    current = aggregate_current_power(readings)
    print("=== Current Fleet Power (live telemetry) ===")
    print(f"Total right now: {current.total_current_power_watts} W")
    for device_id, watts in current.per_device_power_watts.items():
        print(f"  {device_id}: {watts} W")
    print(f"Fleet range if all min states: {current.min_fleet_power_watts} W")
    print(f"Fleet range if all max states: {current.max_fleet_power_watts} W")

    print("\n=== Minimum Power for Target Load (toy DATAZERO2 analog) ===")
    for load in (0.0, 0.5, 1.0):
        result = minimum_power_for_target_load(readings, load)
        print(result)


if __name__ == "__main__":
    import asyncio
    asyncio.run(main())