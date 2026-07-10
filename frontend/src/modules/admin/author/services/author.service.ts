import { apiAuth } from "@/configs/axios";
import type { ApiResponse } from "@/types/api-response";

import type { Pagination } from "@/types/pagination";
import type { AuthorRequest, AuthorResponse, AuthorWithProductCountResponse, AuthorFilterRequest } from "../types/author.type";

const AuthorService = {
  async fetchAuthor() {
    const res = await apiAuth.get<ApiResponse<AuthorWithProductCountResponse[]>>("/api/v1/authors");
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Fetch authors failed");
    }
    return res.data.data;
  },
  async create(data: AuthorRequest) {
    const res = await apiAuth.post<ApiResponse<AuthorResponse>>(
      "/api/v1/admin/authors",
      data,
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Add author failed");
    }
    return res.data.data;
  },

   async update(id:number,data: AuthorRequest) {
    const res = await apiAuth.put<ApiResponse<AuthorResponse>>(
      `/api/v1/admin/authors/${id}`,
      data,
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Update author failed");
    }
    return res.data.data;
  },

  async filterAuthor(options?: AuthorFilterRequest) {
    const res = await apiAuth.get<ApiResponse<Pagination<AuthorResponse>>>(
      "/api/v1/admin/authors/filter",
      { params: options },
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Fetch authors failed");
    }
    console.log(res);
    return res.data.data;
  },

  async delete(id: number) {
    const res = await apiAuth.delete<ApiResponse<null>>(
      `/api/v1/admin/authors/${id}`
    );
    if (!res.data.success) {
      throw new Error(res.data.message || "Delete author failed");
    }
    return res.data;
  },
};

export default AuthorService;
