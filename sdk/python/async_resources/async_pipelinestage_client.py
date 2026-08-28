"""
RelateIQ Enterprise Python SDK - Asynchronous PipelineStage Resource Client
Domain: pipeline
Provides non-blocking coroutine-based async/await interactions for high-throughput CRM integrations.
"""

import asyncio
from typing import Dict, List, Optional, Any
from ..resources.pipelinestage_client import PipelineStageModel

class AsyncPipelineStageClient:
    """Asynchronous non-blocking client for PipelineStages operations."""
    def __init__(self, async_http_session):
        self._session = async_http_session

    async def get_async(self, pipelinestage_id: str) -> Optional[PipelineStageModel]:
        """Asynchronously fetch single PipelineStage by ID."""
        async with self._session.get(f"/api/v1/pipelinestages/{pipelinestage_id}") as resp:
            if resp.status == 200:
                data = await resp.json()
                return PipelineStageModel(data.get("data", {}))
            return None

    async def list_async(self, page: int = 1, limit: int = 20, status: Optional[str] = None) -> List[PipelineStageModel]:
        """Asynchronously list PipelineStages records."""
        params = {"page": str(page), "limit": str(limit)}
        if status:
            params["status"] = status
        async with self._session.get(f"/api/v1/pipelinestages", params=params) as resp:
            if resp.status == 200:
                data = await resp.json()
                items = data.get("items", [])
                return [PipelineStageModel(item) for item in items]
            return []

    async def create_async(self, payload: Dict[str, Any]) -> PipelineStageModel:
        """Asynchronously create new PipelineStage."""
        async with self._session.post(f"/api/v1/pipelinestages", json=payload) as resp:
            data = await resp.json()
            return PipelineStageModel(data.get("data", {}))

    async def update_async(self, pipelinestage_id: str, payload: Dict[str, Any]) -> PipelineStageModel:
        """Asynchronously update existing PipelineStage."""
        async with self._session.put(f"/api/v1/pipelinestages/{pipelinestage_id}", json=payload) as resp:
            data = await resp.json()
            return PipelineStageModel(data.get("data", {}))

    async def delete_async(self, pipelinestage_id: str) -> bool:
        """Asynchronously delete PipelineStage."""
        async with self._session.delete(f"/api/v1/pipelinestages/{pipelinestage_id}") as resp:
            return resp.status == 200
