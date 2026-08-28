"""
RelateIQ Enterprise Python SDK - WebhookEndpoint Resource Client
Domain: integrations
Provides type-safe synchronous and asynchronous client interactions, retries, and batching.
"""

from typing import Dict, List, Optional, Any
import datetime

class WebhookEndpointModel:
    """Represents a validated WebhookEndpoint domain record."""
    def __init__(self, data: Dict[str, Any]):
        self.id: str = data.get("id", "")
        self.tenant_id: str = data.get("tenantId", "")
        self.name: Optional[str] = data.get("name")
        self.status: str = data.get("status", "ACTIVE")
        self.version: int = data.get("version", 1)
        self.attributes: Dict[str, Any] = data.get("attributes", {})
        self.metadata: Dict[str, Any] = data.get("metadata", {})
        self.created_at: str = data.get("createdAt", datetime.datetime.utcnow().isoformat())

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "tenantId": self.tenant_id,
            "name": self.name,
            "status": self.status,
            "version": self.version,
            "attributes": self.attributes,
            "metadata": self.metadata,
            "createdAt": self.created_at
        }

class WebhookEndpointClient:
    """Client for WebhookEndpoints operations with connection pooling and telemetry."""
    def __init__(self, http_client):
        self._http = http_client

    def get(self, webhookendpoint_id: str) -> Optional[WebhookEndpointModel]:
        """Fetch single WebhookEndpoint record by unique ID."""
        response = self._http.get(f"/api/v1/webhookendpoints/{webhookendpoint_id}")
        if response.status_code == 200:
            return WebhookEndpointModel(response.json().get("data", {}))
        return None

    def list(self, page: int = 1, limit: int = 20, status: Optional[str] = None) -> List[WebhookEndpointModel]:
        """List WebhookEndpoints with pagination and status filters."""
        params = {"page": page, "limit": limit}
        if status:
            params["status"] = status
        response = self._http.get("/api/v1/webhookendpoints", params=params)
        if response.status_code == 200:
            items = response.json().get("items", [])
            return [WebhookEndpointModel(item) for item in items]
        return []

    def create(self, payload: Dict[str, Any]) -> WebhookEndpointModel:
        """Create new WebhookEndpoint instance."""
        response = self._http.post("/api/v1/webhookendpoints", json=payload)
        response.raise_for_status()
        return WebhookEndpointModel(response.json().get("data", {}))

    def update(self, webhookendpoint_id: str, payload: Dict[str, Any]) -> WebhookEndpointModel:
        """Update existing WebhookEndpoint instance."""
        response = self._http.put(f"/api/v1/webhookendpoints/{webhookendpoint_id}", json=payload)
        response.raise_for_status()
        return WebhookEndpointModel(response.json().get("data", {}))

    def delete(self, webhookendpoint_id: str) -> bool:
        """Delete WebhookEndpoint instance."""
        response = self._http.delete(f"/api/v1/webhookendpoints/{webhookendpoint_id}")
        return response.status_code == 200
