"""
RelateIQ Enterprise Python SDK - Asynchronous WebhookEndpoint Resource Client
Domain: integrations
Provides non-blocking coroutine-based async/await interactions for high-throughput CRM integrations.
"""

import asyncio
from typing import Dict, List, Optional, Any
from ..resources.webhookendpoint_client import WebhookEndpointModel

class AsyncWebhookEndpointClient:
    """Asynchronous non-blocking client for WebhookEndpoints operations."""
    def __init__(self, async_http_session):
        self._session = async_http_session

    async def get_async(self, webhookendpoint_id: str) -> Optional[WebhookEndpointModel]:
        """Asynchronously fetch single WebhookEndpoint by ID."""
        async with self._session.get(f"/api/v1/webhookendpoints/{webhookendpoint_id}") as resp:
            if resp.status == 200:
                data = await resp.json()
                return WebhookEndpointModel(data.get("data", {}))
            return None

    async def list_async(self, page: int = 1, limit: int = 20, status: Optional[str] = None) -> List[WebhookEndpointModel]:
        """Asynchronously list WebhookEndpoints records."""
        params = {"page": str(page), "limit": str(limit)}
        if status:
            params["status"] = status
        async with self._session.get(f"/api/v1/webhookendpoints", params=params) as resp:
            if resp.status == 200:
                data = await resp.json()
                items = data.get("items", [])
                return [WebhookEndpointModel(item) for item in items]
            return []

    async def create_async(self, payload: Dict[str, Any]) -> WebhookEndpointModel:
        """Asynchronously create new WebhookEndpoint."""
        async with self._session.post(f"/api/v1/webhookendpoints", json=payload) as resp:
            data = await resp.json()
            return WebhookEndpointModel(data.get("data", {}))

    async def update_async(self, webhookendpoint_id: str, payload: Dict[str, Any]) -> WebhookEndpointModel:
        """Asynchronously update existing WebhookEndpoint."""
        async with self._session.put(f"/api/v1/webhookendpoints/{webhookendpoint_id}", json=payload) as resp:
            data = await resp.json()
            return WebhookEndpointModel(data.get("data", {}))

    async def delete_async(self, webhookendpoint_id: str) -> bool:
        """Asynchronously delete WebhookEndpoint."""
        async with self._session.delete(f"/api/v1/webhookendpoints/{webhookendpoint_id}") as resp:
            return resp.status == 200
