"""
RelateIQ Enterprise Python SDK - Asynchronous CustomFieldDefinition Resource Client
Domain: customization
Provides non-blocking coroutine-based async/await interactions for high-throughput CRM integrations.
"""

import asyncio
from typing import Dict, List, Optional, Any
from ..resources.customfielddefinition_client import CustomFieldDefinitionModel

class AsyncCustomFieldDefinitionClient:
    """Asynchronous non-blocking client for CustomFieldDefinitions operations."""
    def __init__(self, async_http_session):
        self._session = async_http_session

    async def get_async(self, customfielddefinition_id: str) -> Optional[CustomFieldDefinitionModel]:
        """Asynchronously fetch single CustomFieldDefinition by ID."""
        async with self._session.get(f"/api/v1/customfielddefinitions/{customfielddefinition_id}") as resp:
            if resp.status == 200:
                data = await resp.json()
                return CustomFieldDefinitionModel(data.get("data", {}))
            return None

    async def list_async(self, page: int = 1, limit: int = 20, status: Optional[str] = None) -> List[CustomFieldDefinitionModel]:
        """Asynchronously list CustomFieldDefinitions records."""
        params = {"page": str(page), "limit": str(limit)}
        if status:
            params["status"] = status
        async with self._session.get(f"/api/v1/customfielddefinitions", params=params) as resp:
            if resp.status == 200:
                data = await resp.json()
                items = data.get("items", [])
                return [CustomFieldDefinitionModel(item) for item in items]
            return []

    async def create_async(self, payload: Dict[str, Any]) -> CustomFieldDefinitionModel:
        """Asynchronously create new CustomFieldDefinition."""
        async with self._session.post(f"/api/v1/customfielddefinitions", json=payload) as resp:
            data = await resp.json()
            return CustomFieldDefinitionModel(data.get("data", {}))

    async def update_async(self, customfielddefinition_id: str, payload: Dict[str, Any]) -> CustomFieldDefinitionModel:
        """Asynchronously update existing CustomFieldDefinition."""
        async with self._session.put(f"/api/v1/customfielddefinitions/{customfielddefinition_id}", json=payload) as resp:
            data = await resp.json()
            return CustomFieldDefinitionModel(data.get("data", {}))

    async def delete_async(self, customfielddefinition_id: str) -> bool:
        """Asynchronously delete CustomFieldDefinition."""
        async with self._session.delete(f"/api/v1/customfielddefinitions/{customfielddefinition_id}") as resp:
            return resp.status == 200
