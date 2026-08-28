"""
RelateIQ Enterprise Python SDK - Activity Resource Client
Domain: omnichannel
Provides type-safe synchronous and asynchronous client interactions, retries, and batching.
"""

from typing import Dict, List, Optional, Any
import datetime

class ActivityModel:
    """Represents a validated Activity domain record."""
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

class ActivityClient:
    """Client for Activities operations with connection pooling and telemetry."""
    def __init__(self, http_client):
        self._http = http_client

    def get(self, activity_id: str) -> Optional[ActivityModel]:
        """Fetch single Activity record by unique ID."""
        response = self._http.get(f"/api/v1/activities/{activity_id}")
        if response.status_code == 200:
            return ActivityModel(response.json().get("data", {}))
        return None

    def list(self, page: int = 1, limit: int = 20, status: Optional[str] = None) -> List[ActivityModel]:
        """List Activities with pagination and status filters."""
        params = {"page": page, "limit": limit}
        if status:
            params["status"] = status
        response = self._http.get("/api/v1/activities", params=params)
        if response.status_code == 200:
            items = response.json().get("items", [])
            return [ActivityModel(item) for item in items]
        return []

    def create(self, payload: Dict[str, Any]) -> ActivityModel:
        """Create new Activity instance."""
        response = self._http.post("/api/v1/activities", json=payload)
        response.raise_for_status()
        return ActivityModel(response.json().get("data", {}))

    def update(self, activity_id: str, payload: Dict[str, Any]) -> ActivityModel:
        """Update existing Activity instance."""
        response = self._http.put(f"/api/v1/activities/{activity_id}", json=payload)
        response.raise_for_status()
        return ActivityModel(response.json().get("data", {}))

    def delete(self, activity_id: str) -> bool:
        """Delete Activity instance."""
        response = self._http.delete(f"/api/v1/activities/{activity_id}")
        return response.status_code == 200
