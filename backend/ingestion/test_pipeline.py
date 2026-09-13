"""
Manual end-to-end smoke test: connects the EatonAdapter to the running
simulator and prints one normalized reading. Not a pytest suite —
just a quick pipeline sanity check during early development.
"""

import asyncio

from backend.ingestion.adapters.eaton_adapter import EatonAdapter


async def main() -> None:
    adapter = EatonAdapter(device_id="ups-sim-01", host="127.0.0.1", port=5020)
    await adapter.connect()

    reading = await adapter.poll()
    print(reading.model_dump_json(indent=2))

    await adapter.disconnect()


if __name__ == "__main__":
    asyncio.run(main())