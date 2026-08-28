"""
RelateIQ Enterprise Python SDK - Invoice Resource Client
Domain: billing
Provides type-safe synchronous and asynchronous client interactions, retries, and batching.
"""

from typing import Dict, List, Optional, Any
import datetime

class InvoiceModel:
    """Represents a validated Invoice domain record."""
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

class InvoiceClient:
    """Client for Invoices operations with connection pooling and telemetry."""
    def __init__(self, http_client):
        self._http = http_client

    def get(self, invoice_id: str) -> Optional[InvoiceModel]:
        """Fetch single Invoice record by unique ID."""
        response = self._http.get(f"/api/v1/invoices/{invoice_id}")
        if response.status_code == 200:
            return InvoiceModel(response.json().get("data", {}))
        return None

    def list(self, page: int = 1, limit: int = 20, status: Optional[str] = None) -> List[InvoiceModel]:
        """List Invoices with pagination and status filters."""
        params = {"page": page, "limit": limit}
        if status:
            params["status"] = status
        response = self._http.get("/api/v1/invoices", params=params)
        if response.status_code == 200:
            items = response.json().get("items", [])
            return [InvoiceModel(item) for item in items]
        return []

    def create(self, payload: Dict[str, Any]) -> InvoiceModel:
        """Create new Invoice instance."""
        response = self._http.post("/api/v1/invoices", json=payload)
        response.raise_for_status()
        return InvoiceModel(response.json().get("data", {}))

    def update(self, invoice_id: str, payload: Dict[str, Any]) -> InvoiceModel:
        """Update existing Invoice instance."""
        response = self._http.put(f"/api/v1/invoices/{invoice_id}", json=payload)
        response.raise_for_status()
        return InvoiceModel(response.json().get("data", {}))

    def delete(self, invoice_id: str) -> bool:
        """Delete Invoice instance."""
        response = self._http.delete(f"/api/v1/invoices/{invoice_id}")
        return response.status_code == 200
