import { apiGuest } from "@/configs/axios";
import type { ApiResponse } from "@/types/api-response";
import type { BookMetadataResponse } from "@/types/googlebook";

const GroqService = {
  async groq(name: string, description: string) {
    const res = await apiGuest.post<ApiResponse<BookMetadataResponse>>(
      "/public/book-metadata",
      {
        name,
        description,
      },
    );

    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Failed to generate metadata");
    }

    return res.data.data;
  },
};
export default GroqService;
