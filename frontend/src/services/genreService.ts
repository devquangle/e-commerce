import { apiAuth } from "@/configs/axios";
import type { ApiResponse } from "@/types/api-response";
import type { GenreRequest, GenreResponse, options } from "@/types/genre";
import type { Pagination } from "@/types/pagination";

const genreService = {
  async getGenres(options?: options) {
    const res =
      await apiAuth.get<ApiResponse<Pagination<GenreResponse>>>(
        "/admin/genres",
        { params: options }
      );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Fetch addresses failed");
    }
    return res.data.data;
  },
  async createGenre(data: GenreRequest) {
    const res = await apiAuth.post<ApiResponse<GenreResponse>>(
      "/admin/genres",
      data,
    );
    if (!res.data.success ) {
      throw new Error(res.data.message || "Failed to create genre");
    }
    return res.data.data;
  },
  async deleteGenre(id: number) {
    const res = await apiAuth.delete<ApiResponse<void>>(
      `/admin/genres/${id}`,
    );
    if (!res.data.success) {
      throw new Error(res.data.message || "Delete address failed");
    }
    return;
  },
};

export default genreService;
