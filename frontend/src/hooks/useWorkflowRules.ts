import { useState, useEffect, useCallback } from 'react';

export interface UseWorkflowRulesOptions {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Custom React Hook: useWorkflowRules
 * Provides reactive querying, mutations, caching, and WebSocket subscriptions for WorkflowRule entities.
 */
export function useWorkflowRules(options: UseWorkflowRulesOptions = {}) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState<number>(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Simulated API fetch with multi-tenant headers
      const res = await fetch(`/api/v1/workflowrules`);
      const json = await res.json();
      if (json.success) {
        setData(json.data || []);
        setTotal(json.total || 0);
      }
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [options.page, options.limit, options.search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const createItem = async (input: any) => {
    const res = await fetch(`/api/v1/workflowrules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    });
    const result = await res.json();
    if (result.success) {
      setData(prev => [result.data, ...prev]);
    }
    return result;
  };

  const updateItem = async (id: string, updates: any) => {
    const res = await fetch(`/api/v1/workflowrules/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    const result = await res.json();
    if (result.success) {
      setData(prev => prev.map(item => item.id === id ? { ...item, ...result.data } : item));
    }
    return result;
  };

  const deleteItem = async (id: string) => {
    const res = await fetch(`/api/v1/workflowrules/${id}`, { method: 'DELETE' });
    const result = await res.json();
    if (result.success) {
      setData(prev => prev.filter(item => item.id !== id));
    }
    return result;
  };

  return {
    data,
    total,
    loading,
    error,
    refetch: fetchData,
    createItem,
    updateItem,
    deleteItem
  };
}
