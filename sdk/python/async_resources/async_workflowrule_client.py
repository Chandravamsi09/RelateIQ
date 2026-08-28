"""
RelateIQ Enterprise Python SDK - Asynchronous WorkflowRule Resource Client
Domain: automation
Provides non-blocking coroutine-based async/await interactions for high-throughput CRM integrations.
"""

import asyncio
from typing import Dict, List, Optional, Any
from ..resources.workflowrule_client import WorkflowRuleModel

class AsyncWorkflowRuleClient:
    """Asynchronous non-blocking client for WorkflowRules operations."""
    def __init__(self, async_http_session):
        self._session = async_http_session

    async def get_async(self, workflowrule_id: str) -> Optional[WorkflowRuleModel]:
        """Asynchronously fetch single WorkflowRule by ID."""
        async with self._session.get(f"/api/v1/workflowrules/{workflowrule_id}") as resp:
            if resp.status == 200:
                data = await resp.json()
                return WorkflowRuleModel(data.get("data", {}))
            return None

    async def list_async(self, page: int = 1, limit: int = 20, status: Optional[str] = None) -> List[WorkflowRuleModel]:
        """Asynchronously list WorkflowRules records."""
        params = {"page": str(page), "limit": str(limit)}
        if status:
            params["status"] = status
        async with self._session.get(f"/api/v1/workflowrules", params=params) as resp:
            if resp.status == 200:
                data = await resp.json()
                items = data.get("items", [])
                return [WorkflowRuleModel(item) for item in items]
            return []

    async def create_async(self, payload: Dict[str, Any]) -> WorkflowRuleModel:
        """Asynchronously create new WorkflowRule."""
        async with self._session.post(f"/api/v1/workflowrules", json=payload) as resp:
            data = await resp.json()
            return WorkflowRuleModel(data.get("data", {}))

    async def update_async(self, workflowrule_id: str, payload: Dict[str, Any]) -> WorkflowRuleModel:
        """Asynchronously update existing WorkflowRule."""
        async with self._session.put(f"/api/v1/workflowrules/{workflowrule_id}", json=payload) as resp:
            data = await resp.json()
            return WorkflowRuleModel(data.get("data", {}))

    async def delete_async(self, workflowrule_id: str) -> bool:
        """Asynchronously delete WorkflowRule."""
        async with self._session.delete(f"/api/v1/workflowrules/{workflowrule_id}") as resp:
            return resp.status == 200
