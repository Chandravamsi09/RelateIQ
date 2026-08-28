"""
RelateIQ Enterprise Python SDK - Asynchronous CustomerSatisfactionSurvey Resource Client
Domain: support
Provides non-blocking coroutine-based async/await interactions for high-throughput CRM integrations.
"""

import asyncio
from typing import Dict, List, Optional, Any
from ..resources.customersatisfactionsurvey_client import CustomerSatisfactionSurveyModel

class AsyncCustomerSatisfactionSurveyClient:
    """Asynchronous non-blocking client for CustomerSatisfactionSurveys operations."""
    def __init__(self, async_http_session):
        self._session = async_http_session

    async def get_async(self, customersatisfactionsurvey_id: str) -> Optional[CustomerSatisfactionSurveyModel]:
        """Asynchronously fetch single CustomerSatisfactionSurvey by ID."""
        async with self._session.get(f"/api/v1/customersatisfactionsurveys/{customersatisfactionsurvey_id}") as resp:
            if resp.status == 200:
                data = await resp.json()
                return CustomerSatisfactionSurveyModel(data.get("data", {}))
            return None

    async def list_async(self, page: int = 1, limit: int = 20, status: Optional[str] = None) -> List[CustomerSatisfactionSurveyModel]:
        """Asynchronously list CustomerSatisfactionSurveys records."""
        params = {"page": str(page), "limit": str(limit)}
        if status:
            params["status"] = status
        async with self._session.get(f"/api/v1/customersatisfactionsurveys", params=params) as resp:
            if resp.status == 200:
                data = await resp.json()
                items = data.get("items", [])
                return [CustomerSatisfactionSurveyModel(item) for item in items]
            return []

    async def create_async(self, payload: Dict[str, Any]) -> CustomerSatisfactionSurveyModel:
        """Asynchronously create new CustomerSatisfactionSurvey."""
        async with self._session.post(f"/api/v1/customersatisfactionsurveys", json=payload) as resp:
            data = await resp.json()
            return CustomerSatisfactionSurveyModel(data.get("data", {}))

    async def update_async(self, customersatisfactionsurvey_id: str, payload: Dict[str, Any]) -> CustomerSatisfactionSurveyModel:
        """Asynchronously update existing CustomerSatisfactionSurvey."""
        async with self._session.put(f"/api/v1/customersatisfactionsurveys/{customersatisfactionsurvey_id}", json=payload) as resp:
            data = await resp.json()
            return CustomerSatisfactionSurveyModel(data.get("data", {}))

    async def delete_async(self, customersatisfactionsurvey_id: str) -> bool:
        """Asynchronously delete CustomerSatisfactionSurvey."""
        async with self._session.delete(f"/api/v1/customersatisfactionsurveys/{customersatisfactionsurvey_id}") as resp:
            return resp.status == 200
