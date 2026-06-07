import { apiAuth } from "@/configs/axios";
import type { ApiResponse } from "@/types/api-response";
import type { AuthorReq, AuthorRes, AuthorResponse } from "@/types/author";
import type { Pagination } from "@/types/pagination";
import type { options } from "@/types/genre";

const AuthorService = {
  async getAuthors() {
    const res =
      await apiAuth.get<ApiResponse<AuthorResponse[]>>("/admin/authors");
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Fetch authors failed");
    }
    return res.data.data;
  },
  async create(data: AuthorReq) {
    const res = await apiAuth.post<ApiResponse<AuthorRes>>(
      "/admin/authors",
      data,
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Add author failed");
    }
    return res.data.data;
  },

   async update(id:number,data: AuthorReq) {
    const res = await apiAuth.put<ApiResponse<AuthorRes>>(
      `/admin/authors/${id}`,
      data,
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Update author failed");
    }
    return res.data.data;
  },

  async filterAuthor(options?: options) {
    const res = await apiAuth.get<ApiResponse<Pagination<AuthorRes>>>(
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
