import { useQueries } from "@tanstack/react-query";
import ProductDetailService from "../services/product.detail.service";

const useProductDetailData = (slug: string) => {
  const [productInfo] = useQueries({
    queries: [
      {
        queryKey: ["product-info", slug],
        queryFn: () => ProductDetailService.getProductBySlug(slug),
        enabled: !!slug,
      },
    ],
  });

  return {
    productInfo,
  };
};

export default useProductDetailData;
