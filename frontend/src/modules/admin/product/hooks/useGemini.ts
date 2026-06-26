import { useMutation } from "@tanstack/react-query";
import GeminiService from "../services/gemini.service";
import type { GeminiBookMetaResponse } from "../types/gemini.type";

interface UseGeminiParams {
  name: string;
  authors: string[];
}

export const useGemini = () => {
  return useMutation<GeminiBookMetaResponse, Error, UseGeminiParams>({
    mutationFn: ({ name, authors }) => GeminiService.getBookMeta(name, authors),
  });
};
