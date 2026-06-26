import { apiGuest } from "@/configs/axios";
import type { ApiResponse } from "@/types/api-response";
import type { GeminiBookMetaResponse } from "../types/gemini.type";

const GeminiService = {
  async getBookMeta(name: string, authors: string[]) {
    const res = await apiGuest.get<ApiResponse<GeminiBookMetaResponse>>(
      "/public/book-meta",
      {
        params: {
          name,
          authors,
        },
      }
    );

    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Failed to generate metadata");
    }

    return res.data.data;
  },
};

export default GeminiService;