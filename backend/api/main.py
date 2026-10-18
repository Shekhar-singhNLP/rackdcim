from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.scheduling.fleet_poller import poll_fleet
from backend.scheduling.power_aggregator import aggregate_current_power, minimum_power_for_target_load
from backend.scheduling.machine_profiles import MACHINE_PROFILES
from backend.scheduling.binary_search_scheduler import find_minimum_power_for_qos
from backend.scheduling.dvfs_states import get_dvfs_profile
from backend.scheduling.marketplace_simulator import SiteState, compare_strategies

app = FastAPI(title="RackDynamics API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/fleet/status")
async def fleet_status():
    readings = await poll_fleet()
    aggregation = aggregate_current_power(readings)

    devices_payload = []
    for r in readings:
        profile = MACHINE_PROFILES.get(r.machine_class)
        device_data = r.model_dump(mode="json")
        device_data["power_budget"] = {
            "min_watts": profile.min_power() if profile else None,
            "max_watts": profile.max_power() if profile else None,
        }
        devices_payload.append(device_data)

    return {
        "devices": devices_payload,
        "aggregation": {
            "total_current_power_watts": aggregation.total_current_power_watts,
            "per_device_power_watts": aggregation.per_device_power_watts,
            "min_fleet_power_watts": aggregation.min_fleet_power_watts,
            "max_fleet_power_watts": aggregation.max_fleet_power_watts,
        },
    }

@app.get("/fleet/what-if")
async def fleet_what_if(target_load: float = 0.5):
    readings = await poll_fleet()
    result = minimum_power_for_target_load(readings, target_load)
    return result

@app.get("/dvfs/{machine_class}")
async def dvfs_states(machine_class: str):
    profile = get_dvfs_profile(machine_class)
    return {
        "machine_class": machine_class,
        "states": [
            {"frequency_ghz": s.frequency_ghz, "power_watts": s.power_watts, "label": s.label}
            for s in profile.discrete_states()
        ],
    }

@app.get("/scheduler/binary-search")
async def binary_search_scheduler(machine_class: str, target_ratio: float = 0.6):
    profile = get_dvfs_profile(machine_class)
    result = find_minimum_power_for_qos(profile, target_ratio)
    return {
        "machine_class": machine_class,
        "target_performance_ratio": result.target_performance_ratio,
        "found_frequency_ghz": result.found_frequency_ghz,
        "found_power_watts": result.found_power_watts,
        "iterations": result.iterations,
        "convergence_trace": result.convergence_trace,
    }

@app.get("/marketplace/compare")
async def marketplace_compare():
    sites = [
        SiteState(site_id="site-a", renewable_available_watts=120, demand_watts=80),
        SiteState(site_id="site-b", renewable_available_watts=40, demand_watts=100),
        SiteState(site_id="site-c", renewable_available_watts=90, demand_watts=95),
    ]
    return compare_strategies(sites)