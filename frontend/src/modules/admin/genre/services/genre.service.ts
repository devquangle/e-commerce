import { apiAuth } from "@/configs/axios";
import type { ApiResponse } from "@/types/api-response";

import type { options } from "@/types/options.type";
import type { Pagination } from "@/types/pagination";
import type { GenreRequest, GenreResponse, GenreWithProductCountResponse } from "../types/genre.type";

const GenreService = {
  async fetchGenre() {
    const res = await apiAuth.get<ApiResponse<GenreWithProductCountResponse[]>>("/api/v1/genres");
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Fetch genres failed");
    }
    return res.data.data;
  },
  async create(data: GenreRequest) {
    const res = await apiAuth.post<ApiResponse<GenreResponse>>(
      "/api/v1/admin/genres",
      data,
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Add genre failed");
    }
    return res.data.data;
  },

   async update(id:number,data: GenreRequest) {
    const res = await apiAuth.put<ApiResponse<GenreResponse>>(
      `/api/v1/admin/genres/${id}`,
      data,
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Update genre failed");
    }
    return res.data.data;
  },

  async filterGenre(options?: options) {
    const res = await apiAuth.get<ApiResponse<Pagination<GenreResponse>>>(
      "/api/v1/admin/genres/filter",
      { params: options },
    );
    console.log(options);
    
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Fetch genres failed");
    }
    console.log(res);
    return res.data.data;
  },

  async delete(id: number) {
    const res = await apiAuth.delete<ApiResponse<null>>(
      `/api/v1/admin/genres/${id}`
    );
    if (!res.data.success) {
      throw new Error(res.data.message || "Delete genre failed");
    }
    return res.data;
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

export default GenreService;
