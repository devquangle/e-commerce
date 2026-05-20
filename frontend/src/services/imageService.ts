import { apiAuth } from "@/configs/axios";
import type { ApiResponse } from "@/types/api-response";
import type { ImageRequest, ImageResponse } from "@/types/image";

const imageService = {
  async createImage(req: ImageRequest) {
    const res = await apiAuth.get<ApiResponse<ImageResponse>>(
      "/admin/generate",
      { params: { input: req.input } },
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Failed to upload image");
    }
    return res.data.data;
  },
};
export default imageService;
