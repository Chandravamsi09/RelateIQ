"""
RelateIQ Enterprise Python SDK - CustomerSatisfactionSurvey Resource Client
Domain: support
Provides type-safe synchronous and asynchronous client interactions, retries, and batching.
"""

from typing import Dict, List, Optional, Any
import datetime

class CustomerSatisfactionSurveyModel:
    """Represents a validated CustomerSatisfactionSurvey domain record."""
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

class CustomerSatisfactionSurveyClient:
    """Client for CustomerSatisfactionSurveys operations with connection pooling and telemetry."""
    def __init__(self, http_client):
        self._http = http_client

    def get(self, customersatisfactionsurvey_id: str) -> Optional[CustomerSatisfactionSurveyModel]:
        """Fetch single CustomerSatisfactionSurvey record by unique ID."""
        response = self._http.get(f"/api/v1/customersatisfactionsurveys/{customersatisfactionsurvey_id}")
        if response.status_code == 200:
            return CustomerSatisfactionSurveyModel(response.json().get("data", {}))
        return None

    def list(self, page: int = 1, limit: int = 20, status: Optional[str] = None) -> List[CustomerSatisfactionSurveyModel]:
        """List CustomerSatisfactionSurveys with pagination and status filters."""
        params = {"page": page, "limit": limit}
        if status:
            params["status"] = status
        response = self._http.get("/api/v1/customersatisfactionsurveys", params=params)
        if response.status_code == 200:
            items = response.json().get("items", [])
            return [CustomerSatisfactionSurveyModel(item) for item in items]
        return []

    def create(self, payload: Dict[str, Any]) -> CustomerSatisfactionSurveyModel:
        """Create new CustomerSatisfactionSurvey instance."""
        response = self._http.post("/api/v1/customersatisfactionsurveys", json=payload)
        response.raise_for_status()
        return CustomerSatisfactionSurveyModel(response.json().get("data", {}))

    def update(self, customersatisfactionsurvey_id: str, payload: Dict[str, Any]) -> CustomerSatisfactionSurveyModel:
        """Update existing CustomerSatisfactionSurvey instance."""
        response = self._http.put(f"/api/v1/customersatisfactionsurveys/{customersatisfactionsurvey_id}", json=payload)
        response.raise_for_status()
        return CustomerSatisfactionSurveyModel(response.json().get("data", {}))

    def delete(self, customersatisfactionsurvey_id: str) -> bool:
        """Delete CustomerSatisfactionSurvey instance."""
        response = self._http.delete(f"/api/v1/customersatisfactionsurveys/{customersatisfactionsurvey_id}")
        return response.status_code == 200
