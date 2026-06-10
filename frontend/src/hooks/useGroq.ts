import { useMutation } from "@tanstack/react-query";
import GroqService from "@/services/groqService";
import type { BookMetadataResponse } from "@/types/googlebook";

interface GroqRequest {
  name: string;
  description: string;
}

export const useGroqBook = () => {
  return useMutation<BookMetadataResponse, Error, GroqRequest>({
    mutationFn: ({ name, description }) => GroqService.groq(name, description),
  });
};
