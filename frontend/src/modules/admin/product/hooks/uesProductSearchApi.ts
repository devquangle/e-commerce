import { useQuery } from "@tanstack/react-query";
import ProductSearchApiService from "../services/product.searchapi.service";
import type { ProductSearchApiResponse } from "../types/product.searchapi.type";

export const useProductSearchApi = (name: string) => {
  return useQuery<ProductSearchApiResponse>({
    queryKey: ["products-filter", name],
    queryFn: () => ProductSearchApiService.getUrlImages(name),
  });
};
