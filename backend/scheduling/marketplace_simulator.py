"""
RESEARCH ALIGNMENT — Cooperative vs Non-Cooperative Power Marketplace
Reference: Da Costa & Stolf (2025), Cluster Computing — geo-distributed
data centers on renewable energy.

Compares two strategies for 2+ sites with independent renewable
power surplus/deficit: each site manages its own supply alone
(non-cooperative) vs sites share surplus with each other
(cooperative).
"""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class SiteState:
    site_id: str
    renewable_available_watts: float
    demand_watts: float

    @property
    def surplus_or_deficit(self) -> float:
        return self.renewable_available_watts - self.demand_watts


def non_cooperative(sites: list[SiteState]) -> dict:
    """Each site only uses its own renewable supply; deficit = grid/backup power needed."""
    per_site = {}
    total_backup_needed = 0.0
    for s in sites:
        deficit = max(0.0, -s.surplus_or_deficit)
        per_site[s.site_id] = {"backup_power_watts": round(deficit, 2)}
        total_backup_needed += deficit
    return {"strategy": "non_cooperative", "total_backup_watts": round(total_backup_needed, 2), "per_site": per_site}


def cooperative(sites: list[SiteState]) -> dict:
    """Surplus sites' extra renewable power offsets deficit sites' needs, before falling back to grid/backup."""
    total_surplus = sum(max(0.0, s.surplus_or_deficit) for s in sites)
    total_deficit = sum(max(0.0, -s.surplus_or_deficit) for s in sites)
    shared_surplus_used = min(total_surplus, total_deficit)
    remaining_backup = round(total_deficit - shared_surplus_used, 2)

    per_site = {}
    for s in sites:
        deficit = max(0.0, -s.surplus_or_deficit)
        share = round((deficit / total_deficit) * remaining_backup, 2) if total_deficit > 0 else 0.0
        per_site[s.site_id] = {"backup_power_watts": share}

    return {
        "strategy": "cooperative",
        "total_backup_watts": remaining_backup,
        "shared_surplus_used_watts": round(shared_surplus_used, 2),
        "per_site": per_site,
    }


def compare_strategies(sites: list[SiteState]) -> dict:
    non_coop = non_cooperative(sites)
    coop = cooperative(sites)
    savings = round(non_coop["total_backup_watts"] - coop["total_backup_watts"], 2)
    return {"non_cooperative": non_coop, "cooperative": coop, "backup_power_saved_watts": savings}