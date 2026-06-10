import { apiGuest } from "@/configs/axios";
import type { ApiResponse } from "@/types/api-response";
import type { GoogleBookResponse } from "@/types/googlebook";

const GoogleBookService = {
  async filter(req: string) {
    const res = await apiGuest.get<ApiResponse<GoogleBookResponse[]>>(
      "/public/google-books",
      {
        params: {
          query: req,
        },
      },
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Failed to fetch ggbook api");
    }
    return res.data.data;
  },
};
export default GoogleBookService;
