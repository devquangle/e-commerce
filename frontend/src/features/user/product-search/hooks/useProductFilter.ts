import {  useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { ProductFilterOptions, SortType } from '../types/product.filter.options';

export function useProductFilter(initialOptions: ProductFilterOptions = {}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialOptionsStr = JSON.stringify(initialOptions);

  // Convert searchParams to ProductFilterOptions
  const filters = useMemo<ProductFilterOptions>(() => {
    const parsedInitialOptions = JSON.parse(initialOptionsStr);
    const params: ProductFilterOptions = {
      page: 1,
      size: 10,
      ...parsedInitialOptions,
    };

    if (searchParams.has('page')) params.page = Number(searchParams.get('page'));
    if (searchParams.has('size')) params.size = Number(searchParams.get('size'));
    if (searchParams.has('sort')) params.sort = searchParams.get('sort') as SortType;
    if (searchParams.has('minPrice')) params.minPrice = Number(searchParams.get('minPrice'));
    if (searchParams.has('maxPrice')) params.maxPrice = Number(searchParams.get('maxPrice'));
    if (searchParams.has('rating')) params.rating = Number(searchParams.get('rating'));
    if (searchParams.has('keyword')) params.keyword = searchParams.get('keyword') || undefined;
    if (searchParams.has('publisher')) params.publisher = searchParams.get('publisher') || undefined;
    if (searchParams.has('series')) params.series = searchParams.get('series') || undefined;
    if (searchParams.has('hasPromotion')) params.hasPromotion = searchParams.get('hasPromotion') || undefined;
    
    // Arrays
    const genresStr = searchParams.get('genres');
    if (genresStr) params.genres = genresStr.split(',');
    
    const authorsStr = searchParams.get('authors');
    if (authorsStr) params.authors = authorsStr.split(',');

    return params;
  }, [searchParams, initialOptionsStr]);

  const updateFilter = useCallback((newFilters: Partial<ProductFilterOptions>) => {
    const current = new URLSearchParams(searchParams);
    
    // Update or delete keys
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
        current.delete(key);
      } else if (Array.isArray(value)) {
        current.delete(key);
        current.set(key, value.join(','));
      } else {
        current.set(key, String(value));
      }
    });

    // Reset page if filtering changes (except page itself or size)
    if (!('page' in newFilters) && !('size' in newFilters)) {
      current.delete('page'); // Let it default to 1
    }

    // Decode %2C back to comma for prettier URL
    const newSearchString = current.toString().replace(/%2C/gi, ',');
    navigate(`?${newSearchString}`, { replace: true });

  }, [searchParams, navigate]);

  const handlePageChange = useCallback((page: number) => {
    updateFilter({ page });
  }, [updateFilter]);
  
  const handlePageSizeChange = useCallback((size: number) => {
    updateFilter({ size, page: 1 });
  }, [updateFilter]);

  const resetFilters = useCallback(() => {
    navigate('?', { replace: true });
  }, [navigate]);

  return {
    filters,
    updateFilter,
    handlePageChange,
    handlePageSizeChange,
    resetFilters
  };
}
