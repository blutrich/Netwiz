import { useState, useEffect, useCallback } from 'react';
import { getExperts, getRequests, Expert, Request } from '../lib/services/google-sheets';

export interface UseExpertsOptions {
  filterBySector?: string;
}

export function useExperts(options: UseExpertsOptions = {}) {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);
  
  const refreshExperts = useCallback(() => {
    setRefreshCount(prev => prev + 1);
  }, []);
  
  useEffect(() => {
    async function fetchExperts() {
      try {
        setLoading(true);
        const data = await getExperts();
        
        // Apply filters if provided
        let filteredData = data;
        if (options.filterBySector) {
          filteredData = data.filter(expert => expert.sector === options.filterBySector);
        }
        
        setExperts(filteredData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch experts'));
      } finally {
        setLoading(false);
      }
    }
    
    fetchExperts();
  }, [options.filterBySector, refreshCount]);
  
  return { experts, loading, error, refreshExperts };
}

export interface UseRequestsOptions {
  filterByStatus?: Request['status'];
}

export function useRequests(options: UseRequestsOptions = {}) {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    async function fetchRequests() {
      try {
        setLoading(true);
        const data = await getRequests();
        
        // Apply filters if provided
        let filteredData = data;
        if (options.filterByStatus) {
          filteredData = data.filter(request => request.status === options.filterByStatus);
        }
        
        setRequests(filteredData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch requests'));
      } finally {
        setLoading(false);
      }
    }
    
    fetchRequests();
  }, [options.filterByStatus]);
  
  // Calculate statistics
  const stats = {
    total: requests.length,
    expertContacted: requests.filter(r => r.status === 'expert_contacted').length,
    matched: requests.filter(r => r.status === 'matched').length,
    completed: requests.filter(r => r.status === 'completed').length,
    declined: requests.filter(r => r.status === 'expert_declined').length,
  };
  
  return { requests, loading, error, stats };
} 