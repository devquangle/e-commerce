import { apiGuest } from "@/configs/axios";
import type { ApiResponse } from "@/types/api-response";
import type { WikipediaResponse } from "@/types/wikipedia";

const wikipediaService = {
  async fetchAuthor(req: string) {
    const res = await apiGuest.get<ApiResponse<WikipediaResponse>>("/public/wikipedia", {
      params: { name: req },
    });
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Lỗi khi lấy thông tin từ wiki");
    }
    return res.data.data;
  },
};
export default wikipediaService;
