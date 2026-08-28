"""
RelateIQ Enterprise Python SDK - Asynchronous CallLog Resource Client
Domain: omnichannel
Provides non-blocking coroutine-based async/await interactions for high-throughput CRM integrations.
"""

import asyncio
from typing import Dict, List, Optional, Any
from ..resources.calllog_client import CallLogModel

class AsyncCallLogClient:
    """Asynchronous non-blocking client for CallLogs operations."""
    def __init__(self, async_http_session):
        self._session = async_http_session

    async def get_async(self, calllog_id: str) -> Optional[CallLogModel]:
        """Asynchronously fetch single CallLog by ID."""
        async with self._session.get(f"/api/v1/calllogs/{calllog_id}") as resp:
            if resp.status == 200:
                data = await resp.json()
                return CallLogModel(data.get("data", {}))
            return None

    async def list_async(self, page: int = 1, limit: int = 20, status: Optional[str] = None) -> List[CallLogModel]:
        """Asynchronously list CallLogs records."""
        params = {"page": str(page), "limit": str(limit)}
        if status:
            params["status"] = status
        async with self._session.get(f"/api/v1/calllogs", params=params) as resp:
            if resp.status == 200:
                data = await resp.json()
                items = data.get("items", [])
                return [CallLogModel(item) for item in items]
            return []

    async def create_async(self, payload: Dict[str, Any]) -> CallLogModel:
        """Asynchronously create new CallLog."""
        async with self._session.post(f"/api/v1/calllogs", json=payload) as resp:
            data = await resp.json()
            return CallLogModel(data.get("data", {}))

    async def update_async(self, calllog_id: str, payload: Dict[str, Any]) -> CallLogModel:
        """Asynchronously update existing CallLog."""
        async with self._session.put(f"/api/v1/calllogs/{calllog_id}", json=payload) as resp:
            data = await resp.json()
            return CallLogModel(data.get("data", {}))

    async def delete_async(self, calllog_id: str) -> bool:
        """Asynchronously delete CallLog."""
        async with self._session.delete(f"/api/v1/calllogs/{calllog_id}") as resp:
            return resp.status == 200
