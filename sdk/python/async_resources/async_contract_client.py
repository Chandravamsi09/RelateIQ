"""
RelateIQ Enterprise Python SDK - Asynchronous Contract Resource Client
Domain: billing
Provides non-blocking coroutine-based async/await interactions for high-throughput CRM integrations.
"""

import asyncio
from typing import Dict, List, Optional, Any
from ..resources.contract_client import ContractModel

class AsyncContractClient:
    """Asynchronous non-blocking client for Contracts operations."""
    def __init__(self, async_http_session):
        self._session = async_http_session

    async def get_async(self, contract_id: str) -> Optional[ContractModel]:
        """Asynchronously fetch single Contract by ID."""
        async with self._session.get(f"/api/v1/contracts/{contract_id}") as resp:
            if resp.status == 200:
                data = await resp.json()
                return ContractModel(data.get("data", {}))
            return None

    async def list_async(self, page: int = 1, limit: int = 20, status: Optional[str] = None) -> List[ContractModel]:
        """Asynchronously list Contracts records."""
        params = {"page": str(page), "limit": str(limit)}
        if status:
            params["status"] = status
        async with self._session.get(f"/api/v1/contracts", params=params) as resp:
            if resp.status == 200:
                data = await resp.json()
                items = data.get("items", [])
                return [ContractModel(item) for item in items]
            return []

    async def create_async(self, payload: Dict[str, Any]) -> ContractModel:
        """Asynchronously create new Contract."""
        async with self._session.post(f"/api/v1/contracts", json=payload) as resp:
            data = await resp.json()
            return ContractModel(data.get("data", {}))

    async def update_async(self, contract_id: str, payload: Dict[str, Any]) -> ContractModel:
        """Asynchronously update existing Contract."""
        async with self._session.put(f"/api/v1/contracts/{contract_id}", json=payload) as resp:
            data = await resp.json()
            return ContractModel(data.get("data", {}))

    async def delete_async(self, contract_id: str) -> bool:
        """Asynchronously delete Contract."""
        async with self._session.delete(f"/api/v1/contracts/{contract_id}") as resp:
            return resp.status == 200
