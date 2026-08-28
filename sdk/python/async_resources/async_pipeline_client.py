"""
RelateIQ Enterprise Python SDK - Asynchronous Pipeline Resource Client
Domain: pipeline
Provides non-blocking coroutine-based async/await interactions for high-throughput CRM integrations.
"""

import asyncio
from typing import Dict, List, Optional, Any
from ..resources.pipeline_client import PipelineModel

class AsyncPipelineClient:
    """Asynchronous non-blocking client for Pipelines operations."""
    def __init__(self, async_http_session):
        self._session = async_http_session

    async def get_async(self, pipeline_id: str) -> Optional[PipelineModel]:
        """Asynchronously fetch single Pipeline by ID."""
        async with self._session.get(f"/api/v1/pipelines/{pipeline_id}") as resp:
            if resp.status == 200:
                data = await resp.json()
                return PipelineModel(data.get("data", {}))
            return None

    async def list_async(self, page: int = 1, limit: int = 20, status: Optional[str] = None) -> List[PipelineModel]:
        """Asynchronously list Pipelines records."""
        params = {"page": str(page), "limit": str(limit)}
        if status:
            params["status"] = status
        async with self._session.get(f"/api/v1/pipelines", params=params) as resp:
            if resp.status == 200:
                data = await resp.json()
                items = data.get("items", [])
                return [PipelineModel(item) for item in items]
            return []

    async def create_async(self, payload: Dict[str, Any]) -> PipelineModel:
        """Asynchronously create new Pipeline."""
        async with self._session.post(f"/api/v1/pipelines", json=payload) as resp:
            data = await resp.json()
            return PipelineModel(data.get("data", {}))

    async def update_async(self, pipeline_id: str, payload: Dict[str, Any]) -> PipelineModel:
        """Asynchronously update existing Pipeline."""
        async with self._session.put(f"/api/v1/pipelines/{pipeline_id}", json=payload) as resp:
            data = await resp.json()
            return PipelineModel(data.get("data", {}))

    async def delete_async(self, pipeline_id: str) -> bool:
        """Asynchronously delete Pipeline."""
        async with self._session.delete(f"/api/v1/pipelines/{pipeline_id}") as resp:
            return resp.status == 200
