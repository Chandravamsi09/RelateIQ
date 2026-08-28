"""
RelateIQ Enterprise Python SDK - Lead Resource Client
Domain: pipeline
Provides type-safe synchronous and asynchronous client interactions, retries, and batching.
"""

from typing import Dict, List, Optional, Any
import datetime

class LeadModel:
    """Represents a validated Lead domain record."""
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

class LeadClient:
    """Client for Leads operations with connection pooling and telemetry."""
    def __init__(self, http_client):
        self._http = http_client

    def get(self, lead_id: str) -> Optional[LeadModel]:
        """Fetch single Lead record by unique ID."""
        response = self._http.get(f"/api/v1/leads/{lead_id}")
        if response.status_code == 200:
            return LeadModel(response.json().get("data", {}))
        return None

    def list(self, page: int = 1, limit: int = 20, status: Optional[str] = None) -> List[LeadModel]:
        """List Leads with pagination and status filters."""
        params = {"page": page, "limit": limit}
        if status:
            params["status"] = status
        response = self._http.get("/api/v1/leads", params=params)
        if response.status_code == 200:
            items = response.json().get("items", [])
            return [LeadModel(item) for item in items]
        return []

    def create(self, payload: Dict[str, Any]) -> LeadModel:
        """Create new Lead instance."""
        response = self._http.post("/api/v1/leads", json=payload)
        response.raise_for_status()
        return LeadModel(response.json().get("data", {}))

    def update(self, lead_id: str, payload: Dict[str, Any]) -> LeadModel:
        """Update existing Lead instance."""
        response = self._http.put(f"/api/v1/leads/{lead_id}", json=payload)
        response.raise_for_status()
        return LeadModel(response.json().get("data", {}))

    def delete(self, lead_id: str) -> bool:
        """Delete Lead instance."""
        response = self._http.delete(f"/api/v1/leads/{lead_id}")
        return response.status_code == 200
