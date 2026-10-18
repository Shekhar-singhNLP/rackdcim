"""
backend/scheduling/dvfs_states.py

RESEARCH ALIGNMENT — DVFS Power Modeling
=============================================================
Reference: "Hardware and Application Aware Performance, Power and
Energy Models for Modern HPC Servers with DVFS"
(Sustainable Computing: Informatics and Systems, 2025 — Da Costa,
Stolf et al.)

Finding this module implements: DVFS (Dynamic Voltage and Frequency
Scaling) exposes discrete performance/power states per machine.
Power does not scale linearly with frequency — it follows an
approximately cubic relationship (P ∝ f³), a standard result in
CMOS power modeling that the referenced paper's power model builds
on for HPC servers specifically.

This module replaces the previous static 3-point power list
(machine_profiles.py) with an explicit DVFS state model: each
machine class gets a frequency range, and power at each frequency
is derived from the cubic relationship rather than hardcoded.
=============================================================
"""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class DVFSState:
    """One discrete frequency/power operating point."""
    frequency_ghz: float
    power_watts: float
    label: str  # e.g. "low", "nominal", "boost"


@dataclass(frozen=True)
class DVFSProfile:
    """
    Defines a machine class's DVFS behavior: its frequency range and
    a reference (frequency, power) point used to derive the cubic
    power curve. This lets us compute power at ANY frequency in
    range, not just a few hardcoded steps.
    """
    class_name: str
    min_freq_ghz: float
    max_freq_ghz: float
    reference_freq_ghz: float
    reference_power_watts: float
    num_states: int = 5  # how many discrete DVFS steps this machine exposes

    def power_at_frequency(self, freq_ghz: float) -> float:
        """
        P(f) = P_ref * (f / f_ref)^3

        This is the standard dynamic-power cubic scaling law used in
        CMOS DVFS modeling: dynamic power scales with V^2 * f, and
        voltage itself scales roughly linearly with frequency at a
        given process node, giving an effective f^3 relationship.
        """
        if not (self.min_freq_ghz <= freq_ghz <= self.max_freq_ghz):
            raise ValueError(
                f"{freq_ghz} GHz outside valid range "
                f"[{self.min_freq_ghz}, {self.max_freq_ghz}] for {self.class_name}"
            )
        ratio = freq_ghz / self.reference_freq_ghz
        return round(self.reference_power_watts * (ratio ** 3), 2)

    def discrete_states(self) -> list[DVFSState]:
        """
        Generates evenly-spaced discrete DVFS states across this
        machine's frequency range — the operating points a real
        governor would expose (e.g. Linux cpufreq "performance
        states").
        """
        if self.num_states < 2:
            raise ValueError("num_states must be at least 2")

        step = (self.max_freq_ghz - self.min_freq_ghz) / (self.num_states - 1)
        labels = self._state_labels(self.num_states)

        states = []
        for i in range(self.num_states):
            freq = round(self.min_freq_ghz + step * i, 2)
            states.append(
                DVFSState(
                    frequency_ghz=freq,
                    power_watts=self.power_at_frequency(freq),
                    label=labels[i],
                )
            )
        return states

    @staticmethod
    def _state_labels(n: int) -> list[str]:
        if n == 2:
            return ["idle", "boost"]
        if n == 3:
            return ["idle", "nominal", "boost"]
        middle = ["nominal"] * (n - 2)
        return ["idle", *middle, "boost"]


# --- DVFS profiles per machine class, keyed to match machine_profiles.py ---
DVFS_PROFILES: dict[str, DVFSProfile] = {
    "high_performance": DVFSProfile(
        class_name="high_performance",
        min_freq_ghz=1.2,
        max_freq_ghz=3.6,
        reference_freq_ghz=2.4,
        reference_power_watts=65.0,  # matches existing mid-point in machine_profiles.py
        num_states=5,
    ),
    "efficiency": DVFSProfile(
        class_name="efficiency",
        min_freq_ghz=0.8,
        max_freq_ghz=2.0,
        reference_freq_ghz=1.4,
        reference_power_watts=25.0,
        num_states=5,
    ),
    "baseline": DVFSProfile(
        class_name="baseline",
        min_freq_ghz=1.0,
        max_freq_ghz=2.8,
        reference_freq_ghz=1.9,
        reference_power_watts=40.0,
        num_states=5,
    ),
}


def get_dvfs_profile(class_name: str) -> DVFSProfile:
    if class_name not in DVFS_PROFILES:
        raise KeyError(
            f"Unknown machine class '{class_name}'. "
            f"Known classes: {list(DVFS_PROFILES.keys())}"
        )
    return DVFS_PROFILES[class_name]