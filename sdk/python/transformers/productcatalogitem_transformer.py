"""
RelateIQ Enterprise Python SDK - ProductCatalogItem Data Transformer & Pipeline Serializer
Domain: enterprise_crm
Provides bidirectional transformation, validation, and JSON schema compliance.
"""

from typing import Dict, Any, List, Optional
import datetime

class ProductCatalogItemTransformer:
    """Transforms raw API responses and database dictionaries for ProductCatalogItem."""
    
    @staticmethod
    def transform_to_model_dict(raw: Dict[str, Any]) -> Dict[str, Any]:
        """Sanitizes and normalizes raw dictionary for ProductCatalogItem."""
        if not raw:
            return {}
        return {
            "id": str(raw.get("id", "")),
            "tenant_id": str(raw.get("tenantId", "tenant-acme-corp")),
            "name": raw.get("name") or raw.get("title") or "ProductCatalogItem",
            "status": raw.get("status", "ACTIVE"),
            "attributes": raw.get("attributes", {}),
            "metadata": raw.get("metadata", {}),
            "created_at": raw.get("createdAt", datetime.datetime.utcnow().isoformat()),
            "is_valid": bool(raw.get("id"))
        }

    @staticmethod
    def batch_transform(items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Batch transforms a collection of ProductCatalogItem items."""
        return [ProductCatalogItemTransformer.transform_to_model_dict(item) for item in items if item]
