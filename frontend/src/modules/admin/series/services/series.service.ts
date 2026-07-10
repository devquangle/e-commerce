import { apiAuth } from "@/configs/axios";
import type { ApiResponse } from "@/types/api-response";
import type { SeriesFilterRequest, SeriesRequest, SeriesResponse, SeriesWithProductCountResponse  } from "../types/series.type";
import type { Pagination } from "@/types/pagination";

const SeriesService = {
  async fetchSeries() {
    const res = await apiAuth.get<ApiResponse<SeriesWithProductCountResponse[]>>("/api/v1/series");
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Fetch series failed");
    }
    return res.data.data;
  },
  async create(data: SeriesRequest) {
    const res = await apiAuth.post<ApiResponse<SeriesResponse>>(
      "/api/v1/admin/series",
      data,
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Add series failed");
    }
    return res.data.data;
  },

   async update(id:number,data: SeriesRequest) {
    const res = await apiAuth.put<ApiResponse<SeriesResponse>>(
      `/api/v1/admin/series/${id}`,
      data,
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Update series failed");
    }
    return res.data.data;
  },

  async filterSeries(options?: SeriesFilterRequest) {
    const res = await apiAuth.get<ApiResponse<Pagination<SeriesResponse>>>(
      "/api/v1/admin/series/filter",
      { params: options },
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Fetch series failed");
    }
    console.log(res);
    return res.data.data;
  },

  async delete(id: number) {
    const res = await apiAuth.delete<ApiResponse<null>>(
      `/api/v1/admin/series/${id}`
    );
    if (!res.data.success) {
      throw new Error(res.data.message || "Delete series failed");
    }
    return res.data;
  },
};

export default SeriesService;
