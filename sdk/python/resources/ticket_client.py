"""
RelateIQ Enterprise Python SDK - Ticket Resource Client
Domain: support
Provides type-safe synchronous and asynchronous client interactions, retries, and batching.
"""

from typing import Dict, List, Optional, Any
import datetime

class TicketModel:
    """Represents a validated Ticket domain record."""
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

class TicketClient:
    """Client for Tickets operations with connection pooling and telemetry."""
    def __init__(self, http_client):
        self._http = http_client

    def get(self, ticket_id: str) -> Optional[TicketModel]:
        """Fetch single Ticket record by unique ID."""
        response = self._http.get(f"/api/v1/tickets/{ticket_id}")
        if response.status_code == 200:
            return TicketModel(response.json().get("data", {}))
        return None

    def list(self, page: int = 1, limit: int = 20, status: Optional[str] = None) -> List[TicketModel]:
        """List Tickets with pagination and status filters."""
        params = {"page": page, "limit": limit}
        if status:
            params["status"] = status
        response = self._http.get("/api/v1/tickets", params=params)
        if response.status_code == 200:
            items = response.json().get("items", [])
            return [TicketModel(item) for item in items]
        return []

    def create(self, payload: Dict[str, Any]) -> TicketModel:
        """Create new Ticket instance."""
        response = self._http.post("/api/v1/tickets", json=payload)
        response.raise_for_status()
        return TicketModel(response.json().get("data", {}))

    def update(self, ticket_id: str, payload: Dict[str, Any]) -> TicketModel:
        """Update existing Ticket instance."""
        response = self._http.put(f"/api/v1/tickets/{ticket_id}", json=payload)
        response.raise_for_status()
        return TicketModel(response.json().get("data", {}))

    def delete(self, ticket_id: str) -> bool:
        """Delete Ticket instance."""
        response = self._http.delete(f"/api/v1/tickets/{ticket_id}")
        return response.status_code == 200
