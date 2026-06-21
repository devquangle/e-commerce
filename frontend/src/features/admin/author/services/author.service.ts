import { apiAuth } from "@/configs/axios";
import type { ApiResponse } from "@/types/api-response";

import type { options } from "@/types/options.type";
import type { Pagination } from "@/types/pagination";
import type { AuthorRequest, AuthorResponse } from "../types/author";

const AuthorService = {
  async fetchAuthor() {
    const res = await apiAuth.get<ApiResponse<AuthorResponse[]>>("/admin/authors");
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Fetch authors failed");
    }
    return res.data.data;
  },
  async create(data: AuthorRequest) {
    const res = await apiAuth.post<ApiResponse<AuthorResponse>>(
      "/admin/authors",
      data,
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Add author failed");
    }
    return res.data.data;
  },

   async update(id:number,data: AuthorRequest) {
    const res = await apiAuth.put<ApiResponse<AuthorResponse>>(
      `/admin/authors/${id}`,
      data,
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Update author failed");
    }
    return res.data.data;
  },

  async filterAuthor(options?: options) {
    const res = await apiAuth.get<ApiResponse<Pagination<AuthorResponse>>>(
      "/admin/authors/filter",
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
      `/admin/authors/${id}`
    );
    if (!res.data.success) {
      throw new Error(res.data.message || "Delete author failed");
    }
    return res.data;
  },
};

export default AuthorService;
