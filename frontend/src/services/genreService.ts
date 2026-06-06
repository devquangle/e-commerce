import { apiAuth } from "@/configs/axios";
import type { ApiResponse } from "@/types/api-response";
import type { GenreRequest, GenreResponse, options } from "@/types/genre";
import type { Pagination } from "@/types/pagination";

const genreService = {
  async getGenres() {
    const res =
      await apiAuth.get<ApiResponse<GenreResponse[]>>("/admin/genres");
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Failed to fetch all genres");
    }
    return res.data.data;
  },
  async createGenre(formData: FormData) {
    const res = await apiAuth.post<ApiResponse<GenreResponse>>(
      "/admin/genres",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    if (!res.data.success) {
      throw new Error(res.data.message || "Failed to create genre");
    }
    return res.data.data;
  },
  async updateGenre(id: number, data: GenreRequest) {
    const res = await apiAuth.put<ApiResponse<GenreResponse>>(
      `/admin/genres/${id}`,
      data,
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Failed to update genre");
    }
    return res.data.data;
  },
  async deleteGenre(id: number) {
    const res = await apiAuth.delete<ApiResponse<void>>(`/admin/genres/${id}`);
    if (!res.data.success) {
      throw new Error(res.data.message || "Delete genre failed");
    }
    return;
  },
  async filterGenre(options?: options) {
    const res = await apiAuth.get<ApiResponse<Pagination<GenreResponse>>>(
      "/admin/genres/filter",
      { params: options },
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Fetch addresses failed");
    }
    return res.data.data;
  },
};

export default genreService;
