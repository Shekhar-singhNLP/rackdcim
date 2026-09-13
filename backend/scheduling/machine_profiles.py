"""
backend/scheduling/machine_profiles.py

RESEARCH ALIGNMENT — DATAZERO2 (IRIT Toulouse, Da Costa & Stolf)
=============================================================
Reference: "Assessing Power Needs to Run a Workload with Quality of
Service on Green Datacenters" (Springer, DATAZERO2 project)

Finding this module implements: the paper's own stated open
sub-problem is that when machines are heterogeneous, choosing which
machine to use and at what DVFS (power/performance) state remains
unsolved — their algorithm needs this classification as input, but
does not define how to obtain it from real hardware.

This module is that missing input layer: it defines heterogeneous
machine "classes" (analogous to DVFS states — discrete power/
performance tiers per machine) so that normalized telemetry
(StandardTelemetryReading.machine_class) can be grouped and reasoned
about, exactly as DATAZERO2's scheduling algorithm requires.
=============================================================
"""

from __future__ import annotations

from dataclasses import dataclass, field


@dataclass(frozen=True)
class MachineProfile:
    """
    One heterogeneous machine class. `power_states` are discrete,
    ordered power/performance tiers (low -> high) — the same shape
    as a DVFS state table, whether the underlying source is a real
    CPU frequency scaling table or a UPS/PDU load profile.
    """

    class_name: str
    description: str
    power_states_watts: list[float]  # ordered: lowest power -> highest power
    performance_index: float  # relative compute/throughput capacity, arbitrary scale

    def min_power(self) -> float:
        return min(self.power_states_watts)

    def max_power(self) -> float:
        return max(self.power_states_watts)

    def nearest_state_for_power_budget(self, budget_watts: float) -> float:
        """
        Given an available power budget, returns the highest power
        state this machine can run at without exceeding it. Returns
        the minimum state if even that exceeds the budget (caller
        must check feasibility separately).
        """
        feasible = [s for s in self.power_states_watts if s <= budget_watts]
        return max(feasible) if feasible else self.min_power()


# --- Registry of machine classes used across simulator + demo ---
MACHINE_PROFILES: dict[str, MachineProfile] = {
    "high_performance": MachineProfile(
        class_name="high_performance",
        description="High compute capacity, high power draw across states",
        power_states_watts=[45.0, 65.0, 95.0],
        performance_index=1.0,
    ),
    "efficiency": MachineProfile(
        class_name="efficiency",
        description="Lower compute capacity, optimized for low power draw",
        power_states_watts=[15.0, 25.0, 35.0],
        performance_index=0.5,
    ),
    "baseline": MachineProfile(
        class_name="baseline",
        description="Mid-range general-purpose profile, used as default",
        power_states_watts=[20.0, 40.0, 60.0],
        performance_index=0.75,
    ),
}


def get_profile(class_name: str) -> MachineProfile:
    if class_name not in MACHINE_PROFILES:
        raise KeyError(
            f"Unknown machine class '{class_name}'. "
            f"Known classes: {list(MACHINE_PROFILES.keys())}"
        )
    return MACHINE_PROFILES[class_name]