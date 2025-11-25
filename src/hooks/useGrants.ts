"use client";

import { useState, useEffect, useCallback } from "react";
import { grantsApi } from "@/lib/api/grants";
import { Grant } from "@/types/grant";

export function useGrants(initialFilters?: Record<string, string>) {
  const [grants, setGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState(initialFilters || {});

  const fetchGrants = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await grantsApi.getGrants(filters);
      setGrants(response.data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchGrants();
  }, [fetchGrants]);

  const updateFilters = useCallback((newFilters: Record<string, string>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  return {
    grants,
    loading,
    error,
    filters,
    updateFilters,
    refetch: fetchGrants,
  };
}
