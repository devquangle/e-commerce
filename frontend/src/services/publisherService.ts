import { apiAuth } from "@/configs/axios";
import type { ApiResponse } from "@/types/api-response";
import type { PublisherResponse } from "@/types/publisher";

const PublisherService = {
  async getPublishers() {
    const res = await apiAuth.get<ApiResponse<PublisherResponse[]>>("/admin/publishers");
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Fetch publishers failed");
    }       
    return res.data.data;
  },
};

export default PublisherService;