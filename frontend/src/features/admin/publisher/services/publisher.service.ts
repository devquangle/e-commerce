import { apiAuth } from "@/configs/axios";
import type { ApiResponse } from "@/types/api-response";
import type { PublisherRequest, PublisherResponse  } from "../types/publisher.type";
import type { options } from "@/types/options.type";
import type { Pagination } from "@/types/pagination";

const PublisherService = {
  async fetchPublisher() {
    const res = await apiAuth.get<ApiResponse<PublisherResponse[]>>("/admin/publishers");
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Fetch publishers failed");
    }
    return res.data.data;
  },
  async create(data: PublisherRequest) {
    const res = await apiAuth.post<ApiResponse<PublisherResponse>>(
      "/admin/publishers",
      data,
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Add publisher failed");
    }
    return res.data.data;
  },

   async update(id:number,data: PublisherRequest) {
    const res = await apiAuth.put<ApiResponse<PublisherResponse>>(
      `/admin/publishers/${id}`,
      data,
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Update publisher failed");
    }
    return res.data.data;
  },

  async filterPublisher(options?: options) {
    const res = await apiAuth.get<ApiResponse<Pagination<PublisherResponse>>>(
      "/admin/publishers/filter",
      { params: options },
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Fetch publishers failed");
    }
    console.log(res);
    return res.data.data;
  },

  async delete(id: number) {
    const res = await apiAuth.delete<ApiResponse<null>>(
      `/admin/publishers/${id}`
    );
    if (!res.data.success) {
      throw new Error(res.data.message || "Delete publisher failed");
    }
    return res.data;
  },
};

export default PublisherService;
