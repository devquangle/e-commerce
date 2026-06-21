import { useState, useEffect, useCallback } from 'react';
import ProductSearchService from '../services/product.service';
import type { ProductFilterOptions } from '../types/product.filter.options';
import type { ProductCard } from '@/types/product.card.type';
import type { Pagination } from '@/types/pagination';

export function useProductFilter(initialOptions: ProductFilterOptions = {}) {
  const [filters, setFilters] = useState<ProductFilterOptions>({
    page: 1,
    size: 12,
    sort: 'NEWEST',
    maxPrice: 500000,
    ...initialOptions,
  });

  const [data, setData] = useState<Pagination<ProductCard> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await ProductSearchService.search(filters);
      setData(result);
    } catch (err: unknown) {
      setError(err.message || 'Fetch products failed');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateFilter = useCallback((newFilters: Partial<ProductFilterOptions>) => {
    setFilters(prev => {
      const updated = { ...prev, ...newFilters };
      // Reset page to 1 when filters change (except when page itself changes)
      if (!('page' in newFilters) && !('size' in newFilters)) {
         updated.page = 1;
      }
      return updated;
    });
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);
  
  const handlePageSizeChange = useCallback((size: number) => {
    setFilters(prev => ({ ...prev, size, page: 1 }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ page: 1, size: 12, sort: 'NEWEST', maxPrice: 500000 });
  }, []);

  return {
    filters,
    updateFilter,
    handlePageChange,
    handlePageSizeChange,
    resetFilters,
    data,
    isLoading,
    error,
    refetch: fetchProducts
  };
}
