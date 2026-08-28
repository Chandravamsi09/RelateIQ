"""
RelateIQ Enterprise Python SDK - Asynchronous WorkflowExecution Resource Client
Domain: automation
Provides non-blocking coroutine-based async/await interactions for high-throughput CRM integrations.
"""

import asyncio
from typing import Dict, List, Optional, Any
from ..resources.workflowexecution_client import WorkflowExecutionModel

class AsyncWorkflowExecutionClient:
    """Asynchronous non-blocking client for WorkflowExecutions operations."""
    def __init__(self, async_http_session):
        self._session = async_http_session

    async def get_async(self, workflowexecution_id: str) -> Optional[WorkflowExecutionModel]:
        """Asynchronously fetch single WorkflowExecution by ID."""
        async with self._session.get(f"/api/v1/workflowexecutions/{workflowexecution_id}") as resp:
            if resp.status == 200:
                data = await resp.json()
                return WorkflowExecutionModel(data.get("data", {}))
            return None

    async def list_async(self, page: int = 1, limit: int = 20, status: Optional[str] = None) -> List[WorkflowExecutionModel]:
        """Asynchronously list WorkflowExecutions records."""
        params = {"page": str(page), "limit": str(limit)}
        if status:
            params["status"] = status
        async with self._session.get(f"/api/v1/workflowexecutions", params=params) as resp:
            if resp.status == 200:
                data = await resp.json()
                items = data.get("items", [])
                return [WorkflowExecutionModel(item) for item in items]
            return []

    async def create_async(self, payload: Dict[str, Any]) -> WorkflowExecutionModel:
        """Asynchronously create new WorkflowExecution."""
        async with self._session.post(f"/api/v1/workflowexecutions", json=payload) as resp:
            data = await resp.json()
            return WorkflowExecutionModel(data.get("data", {}))

    async def update_async(self, workflowexecution_id: str, payload: Dict[str, Any]) -> WorkflowExecutionModel:
        """Asynchronously update existing WorkflowExecution."""
        async with self._session.put(f"/api/v1/workflowexecutions/{workflowexecution_id}", json=payload) as resp:
            data = await resp.json()
            return WorkflowExecutionModel(data.get("data", {}))

    async def delete_async(self, workflowexecution_id: str) -> bool:
        """Asynchronously delete WorkflowExecution."""
        async with self._session.delete(f"/api/v1/workflowexecutions/{workflowexecution_id}") as resp:
            return resp.status == 200
