
import { apiAuth } from '@/configs/axios';
import type { ApiResponse } from '@/types/api-response';
import type { AuthorResponse } from '@/types/author';

const AuthorService = {
  async getAuthor() {
    const res = await apiAuth.get<ApiResponse<AuthorResponse[]>>("/admin/authors");
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Fetch addresses failed");
    }
    return res.data.data;
  },
};

export default AuthorService;
