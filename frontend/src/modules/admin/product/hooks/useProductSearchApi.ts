import { useMutation } from "@tanstack/react-query";
import ProductSearchApiService from "../services/product.searchapi.service";
import type { ProductSearchApiResponse } from "../types/product.searchapi.type";

export const useProductSearchApi = () => {
  return useMutation<ProductSearchApiResponse, Error, string>({
    mutationFn: (name: string) => ProductSearchApiService.getUrlImages(name),
  });
};
