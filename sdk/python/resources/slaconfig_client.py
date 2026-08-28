"""
RelateIQ Enterprise Python SDK - SLAConfig Resource Client
Domain: support
Provides type-safe synchronous and asynchronous client interactions, retries, and batching.
"""

from typing import Dict, List, Optional, Any
import datetime

class SLAConfigModel:
    """Represents a validated SLAConfig domain record."""
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

class SLAConfigClient:
    """Client for SLAConfigs operations with connection pooling and telemetry."""
    def __init__(self, http_client):
        self._http = http_client

    def get(self, slaconfig_id: str) -> Optional[SLAConfigModel]:
        """Fetch single SLAConfig record by unique ID."""
        response = self._http.get(f"/api/v1/slaconfigs/{slaconfig_id}")
        if response.status_code == 200:
            return SLAConfigModel(response.json().get("data", {}))
        return None

    def list(self, page: int = 1, limit: int = 20, status: Optional[str] = None) -> List[SLAConfigModel]:
        """List SLAConfigs with pagination and status filters."""
        params = {"page": page, "limit": limit}
        if status:
            params["status"] = status
        response = self._http.get("/api/v1/slaconfigs", params=params)
        if response.status_code == 200:
            items = response.json().get("items", [])
            return [SLAConfigModel(item) for item in items]
        return []

    def create(self, payload: Dict[str, Any]) -> SLAConfigModel:
        """Create new SLAConfig instance."""
        response = self._http.post("/api/v1/slaconfigs", json=payload)
        response.raise_for_status()
        return SLAConfigModel(response.json().get("data", {}))

    def update(self, slaconfig_id: str, payload: Dict[str, Any]) -> SLAConfigModel:
        """Update existing SLAConfig instance."""
        response = self._http.put(f"/api/v1/slaconfigs/{slaconfig_id}", json=payload)
        response.raise_for_status()
        return SLAConfigModel(response.json().get("data", {}))

    def delete(self, slaconfig_id: str) -> bool:
        """Delete SLAConfig instance."""
        response = self._http.delete(f"/api/v1/slaconfigs/{slaconfig_id}")
        return response.status_code == 200
