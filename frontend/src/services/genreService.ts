import { apiAuth } from "@/configs/axios";
import type { ApiResponse } from "@/types/api-response";
import type { GenreRequest, GenreResponse } from "@/types/genre";

const genreService = {
  async getGenres() {
    const res =
      await apiAuth.get<ApiResponse<GenreResponse[]>>("/admin/genres");
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
    return;
  },
};

export default genreService;
