import { apiAuth } from "@/configs/axios";
import type { ApiResponse } from "@/types/api-response";
import type {
  ImageGenrenResponse,
  ImageGenreRequest,
  ImageProductRequest,
  ImageProductResponse,
} from "@/types/image";

const imageService = {
  async createImage(req: ImageGenreRequest) {
    const res = await apiAuth.get<ApiResponse<ImageGenrenResponse>>(
      "/admin/generate",
      { params: { input: req.input } },
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Failed to upload image");
    }
    return res.data.data;
  },

  async uploadImage(items: ImageProductRequest[]) {
    const formData = new FormData();
    
    items.forEach((img, index) => {
      if (img.file) {
        formData.append(`imageRequests[${index}].file`, img.file);
      } else {
        formData.append(`imageRequests[${index}].url`, img.url ?? "");
      }
      
      formData.append(
        `imageRequests[${index}].isThumbnail`,
        String(img.isThumbnail ?? false),
      );
    });

    const res = await apiAuth.post<ApiResponse<ImageProductResponse[]>>(
      "/admin/upload-image",
      formData,
      {
        headers: {
          // Nên thêm config này để Axios hiểu đúng định dạng gửi đi của Form có file
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Failed to upload image");
    }
    return res.data.data;
  },
  
};

export default imageService;