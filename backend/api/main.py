from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.scheduling.fleet_poller import poll_fleet
from backend.scheduling.power_aggregator import aggregate_current_power, minimum_power_for_target_load
from backend.scheduling.machine_profiles import MACHINE_PROFILES

app = FastAPI(title="RackDynamics API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
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