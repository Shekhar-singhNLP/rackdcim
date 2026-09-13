from backend.ingestion.adapters.base_adapter import BaseAdapter


class VertivAdapter(BaseAdapter):
    vendor = "vertiv"
    model = "liebert-nx"
    register_map_file = "vertiv_liebert.json"

    async def _read_raw(self) -> tuple[list[int], list[bool]]:
        # TODO: implement once Vertiv register map is confirmed against
        # the published Liebert IntelliSlot reference guide.
        raise NotImplementedError