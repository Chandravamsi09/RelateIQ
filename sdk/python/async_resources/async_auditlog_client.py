"""
RelateIQ Enterprise Python SDK - Asynchronous AuditLog Resource Client
Domain: compliance
Provides non-blocking coroutine-based async/await interactions for high-throughput CRM integrations.
"""

import asyncio
from typing import Dict, List, Optional, Any
from ..resources.auditlog_client import AuditLogModel

class AsyncAuditLogClient:
    """Asynchronous non-blocking client for AuditLogs operations."""
    def __init__(self, async_http_session):
        self._session = async_http_session

    async def get_async(self, auditlog_id: str) -> Optional[AuditLogModel]:
        """Asynchronously fetch single AuditLog by ID."""
        async with self._session.get(f"/api/v1/auditlogs/{auditlog_id}") as resp:
            if resp.status == 200:
                data = await resp.json()
                return AuditLogModel(data.get("data", {}))
            return None

    async def list_async(self, page: int = 1, limit: int = 20, status: Optional[str] = None) -> List[AuditLogModel]:
        """Asynchronously list AuditLogs records."""
        params = {"page": str(page), "limit": str(limit)}
        if status:
            params["status"] = status
        async with self._session.get(f"/api/v1/auditlogs", params=params) as resp:
            if resp.status == 200:
                data = await resp.json()
                items = data.get("items", [])
                return [AuditLogModel(item) for item in items]
            return []

    async def create_async(self, payload: Dict[str, Any]) -> AuditLogModel:
        """Asynchronously create new AuditLog."""
        async with self._session.post(f"/api/v1/auditlogs", json=payload) as resp:
            data = await resp.json()
            return AuditLogModel(data.get("data", {}))

    async def update_async(self, auditlog_id: str, payload: Dict[str, Any]) -> AuditLogModel:
        """Asynchronously update existing AuditLog."""
        async with self._session.put(f"/api/v1/auditlogs/{auditlog_id}", json=payload) as resp:
            data = await resp.json()
            return AuditLogModel(data.get("data", {}))

    async def delete_async(self, auditlog_id: str) -> bool:
        """Asynchronously delete AuditLog."""
        async with self._session.delete(f"/api/v1/auditlogs/{auditlog_id}") as resp:
            return resp.status == 200
