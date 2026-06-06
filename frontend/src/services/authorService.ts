import { apiAuth } from "@/configs/axios";
import type { ApiResponse } from "@/types/api-response";
import type { AuthorRes, AuthorResponse } from "@/types/author";
import type { Pagination } from "@/types/pagination";
import type { options } from "@/types/status";

const AuthorService = {
  async getAuthors() {
    const res =
      await apiAuth.get<ApiResponse<AuthorResponse[]>>("/admin/authors");
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Fetch authors failed");
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
};

export default AuthorService;
