"""
RelateIQ Enterprise Python SDK - Asynchronous ProductCatalogItem Resource Client
Domain: cpq
Provides non-blocking coroutine-based async/await interactions for high-throughput CRM integrations.
"""

import asyncio
from typing import Dict, List, Optional, Any
from ..resources.productcatalogitem_client import ProductCatalogItemModel

class AsyncProductCatalogItemClient:
    """Asynchronous non-blocking client for ProductCatalogItems operations."""
    def __init__(self, async_http_session):
        self._session = async_http_session

    async def get_async(self, productcatalogitem_id: str) -> Optional[ProductCatalogItemModel]:
        """Asynchronously fetch single ProductCatalogItem by ID."""
        async with self._session.get(f"/api/v1/productcatalogitems/{productcatalogitem_id}") as resp:
            if resp.status == 200:
                data = await resp.json()
                return ProductCatalogItemModel(data.get("data", {}))
            return None

    async def list_async(self, page: int = 1, limit: int = 20, status: Optional[str] = None) -> List[ProductCatalogItemModel]:
        """Asynchronously list ProductCatalogItems records."""
        params = {"page": str(page), "limit": str(limit)}
        if status:
            params["status"] = status
        async with self._session.get(f"/api/v1/productcatalogitems", params=params) as resp:
            if resp.status == 200:
                data = await resp.json()
                items = data.get("items", [])
                return [ProductCatalogItemModel(item) for item in items]
            return []

    async def create_async(self, payload: Dict[str, Any]) -> ProductCatalogItemModel:
        """Asynchronously create new ProductCatalogItem."""
        async with self._session.post(f"/api/v1/productcatalogitems", json=payload) as resp:
            data = await resp.json()
            return ProductCatalogItemModel(data.get("data", {}))

    async def update_async(self, productcatalogitem_id: str, payload: Dict[str, Any]) -> ProductCatalogItemModel:
        """Asynchronously update existing ProductCatalogItem."""
        async with self._session.put(f"/api/v1/productcatalogitems/{productcatalogitem_id}", json=payload) as resp:
            data = await resp.json()
            return ProductCatalogItemModel(data.get("data", {}))

    async def delete_async(self, productcatalogitem_id: str) -> bool:
        """Asynchronously delete ProductCatalogItem."""
        async with self._session.delete(f"/api/v1/productcatalogitems/{productcatalogitem_id}") as resp:
            return resp.status == 200
