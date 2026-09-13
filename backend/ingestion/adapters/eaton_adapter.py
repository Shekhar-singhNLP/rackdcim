from backend.ingestion.adapters.base_adapter import BaseAdapter


class EatonAdapter(BaseAdapter):
    vendor = "eaton"
    model = "9395-UPS"
    register_map_file = "eaton_ups.json"

    async def _read_raw(self) -> tuple[list[int], list[bool]]:
        registers = self._register_map["registers"]
        holding_count = len(registers["holding"])
        discrete_count = len(registers["discrete_input"])

        holding = await self._client.read_holding_registers(0, holding_count)
        discrete = await self._client.read_discrete_inputs(0, discrete_count)
        return holding, discrete