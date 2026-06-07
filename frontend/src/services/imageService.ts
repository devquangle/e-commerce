import { apiAuth } from "@/configs/axios";
import type { ApiResponse } from "@/types/api-response";
import type {
  ImageGenrenResponse,
  ImageGenreRequest,
  ImageProductRequest,
  ImageProductResponse,
  UrlImageResponse,
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
          "Content-Type": "multipart/form-data",
        },
      },
    );

    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Failed to upload image");
    }
    return res.data.data;
  },

  async upload(req: { url: string }) {
    const res = await apiAuth.post<ApiResponse<UrlImageResponse>>(
      "/admin/upload",
      null,
      { params: { url: req.url } },
    );

    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Failed to upload image");
    }
    return res.data.data;
  },
  async uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await apiAuth.post<ApiResponse<UrlImageResponse>>(
      "/admin/upload",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );

    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Failed to upload file");
    }
    return res.data.data;
  },
};

export default imageService;
