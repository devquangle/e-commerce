import { apiAuth } from "@/configs/axios";
import type { ApiResponse } from "@/types/api-response";
import type { ProductRequest, ProductResponse } from "@/types/product";

const productService = {
  async add(req: ProductRequest) {
    const res= await apiAuth.post<ApiResponse<ProductResponse>>(
        "/admin/products",
        req
    );
    console.log(res);
    
     if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Failed add product"+res.data.message);
    }
    return res.data.data;
  },
};

export default productService;
