"""
RelateIQ Enterprise Python SDK - Asynchronous Task Resource Client
Domain: omnichannel
Provides non-blocking coroutine-based async/await interactions for high-throughput CRM integrations.
"""

import asyncio
from typing import Dict, List, Optional, Any
from ..resources.task_client import TaskModel

class AsyncTaskClient:
    """Asynchronous non-blocking client for Tasks operations."""
    def __init__(self, async_http_session):
        self._session = async_http_session

    async def get_async(self, task_id: str) -> Optional[TaskModel]:
        """Asynchronously fetch single Task by ID."""
        async with self._session.get(f"/api/v1/tasks/{task_id}") as resp:
            if resp.status == 200:
                data = await resp.json()
                return TaskModel(data.get("data", {}))
            return None

    async def list_async(self, page: int = 1, limit: int = 20, status: Optional[str] = None) -> List[TaskModel]:
        """Asynchronously list Tasks records."""
        params = {"page": str(page), "limit": str(limit)}
        if status:
            params["status"] = status
        async with self._session.get(f"/api/v1/tasks", params=params) as resp:
            if resp.status == 200:
                data = await resp.json()
                items = data.get("items", [])
                return [TaskModel(item) for item in items]
            return []

    async def create_async(self, payload: Dict[str, Any]) -> TaskModel:
        """Asynchronously create new Task."""
        async with self._session.post(f"/api/v1/tasks", json=payload) as resp:
            data = await resp.json()
            return TaskModel(data.get("data", {}))

    async def update_async(self, task_id: str, payload: Dict[str, Any]) -> TaskModel:
        """Asynchronously update existing Task."""
        async with self._session.put(f"/api/v1/tasks/{task_id}", json=payload) as resp:
            data = await resp.json()
            return TaskModel(data.get("data", {}))

    async def delete_async(self, task_id: str) -> bool:
        """Asynchronously delete Task."""
        async with self._session.delete(f"/api/v1/tasks/{task_id}") as resp:
            return resp.status == 200
