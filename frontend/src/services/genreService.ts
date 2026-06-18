import { apiAuth } from "@/configs/axios";
import type { ApiResponse } from "@/types/api-response";
import type { GenreRequest, GenreResponse } from "@/types/genre";
import type { options } from "@/types/options.type";
import type { Pagination } from "@/types/pagination";

const genreService = {
  async fetchGenre() {
    const res =
      await apiAuth.get<ApiResponse<GenreResponse[]>>("/api/v1/admin/genres");
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Failed to fetch all genres");
    }
    return res.data.data;
  },
  async createGenre(formData: FormData) {
    const res = await apiAuth.post<ApiResponse<GenreResponse>>(
      "/api/v1/admin/genres",
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
      `/api/v1/admin/genres/${id}`,
      data,
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Failed to update genre");
    }
    return res.data.data;
  },
  async deleteGenre(id: number) {
    const res = await apiAuth.delete<ApiResponse<void>>(`/api/v1/admin/genres/${id}`);
    if (!res.data.success) {
      throw new Error(res.data.message || "Delete genre failed");
    }
    return;
  },
  async filterGenre(options?: options) {
    const res = await apiAuth.get<ApiResponse<Pagination<GenreResponse>>>(
      "/api/v1/admin/genres/filter",
      { params: options },
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Fetch addresses failed");
    }
    return res.data.data;
  },
  async importGenre(formData: FormData) {
    const res = await apiAuth.post<ApiResponse<number>>(
      "/api/v1/admin/genres/import",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    if (!res.data.success) {
      throw new Error(res.data.message || "Failed to import genre");
    }
    return res.data;
  },
};

export default genreService;
