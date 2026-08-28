"""
RelateIQ Enterprise Python SDK - Asynchronous PaymentTransaction Resource Client
Domain: billing
Provides non-blocking coroutine-based async/await interactions for high-throughput CRM integrations.
"""

import asyncio
from typing import Dict, List, Optional, Any
from ..resources.paymenttransaction_client import PaymentTransactionModel

class AsyncPaymentTransactionClient:
    """Asynchronous non-blocking client for PaymentTransactions operations."""
    def __init__(self, async_http_session):
        self._session = async_http_session

    async def get_async(self, paymenttransaction_id: str) -> Optional[PaymentTransactionModel]:
        """Asynchronously fetch single PaymentTransaction by ID."""
        async with self._session.get(f"/api/v1/paymenttransactions/{paymenttransaction_id}") as resp:
            if resp.status == 200:
                data = await resp.json()
                return PaymentTransactionModel(data.get("data", {}))
            return None

    async def list_async(self, page: int = 1, limit: int = 20, status: Optional[str] = None) -> List[PaymentTransactionModel]:
        """Asynchronously list PaymentTransactions records."""
        params = {"page": str(page), "limit": str(limit)}
        if status:
            params["status"] = status
        async with self._session.get(f"/api/v1/paymenttransactions", params=params) as resp:
            if resp.status == 200:
                data = await resp.json()
                items = data.get("items", [])
                return [PaymentTransactionModel(item) for item in items]
            return []

    async def create_async(self, payload: Dict[str, Any]) -> PaymentTransactionModel:
        """Asynchronously create new PaymentTransaction."""
        async with self._session.post(f"/api/v1/paymenttransactions", json=payload) as resp:
            data = await resp.json()
            return PaymentTransactionModel(data.get("data", {}))

    async def update_async(self, paymenttransaction_id: str, payload: Dict[str, Any]) -> PaymentTransactionModel:
        """Asynchronously update existing PaymentTransaction."""
        async with self._session.put(f"/api/v1/paymenttransactions/{paymenttransaction_id}", json=payload) as resp:
            data = await resp.json()
            return PaymentTransactionModel(data.get("data", {}))

    async def delete_async(self, paymenttransaction_id: str) -> bool:
        """Asynchronously delete PaymentTransaction."""
        async with self._session.delete(f"/api/v1/paymenttransactions/{paymenttransaction_id}") as resp:
            return resp.status == 200
