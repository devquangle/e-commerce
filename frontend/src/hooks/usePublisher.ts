
import PublisherService from "@/services/publisherService";
import type { PublisherResponse } from "@/types/publisher";

import { useQuery } from "@tanstack/react-query";

export const usePublisher = () => {
  return useQuery<PublisherResponse[]>({
    queryKey: ["publishers"],
    queryFn: PublisherService.getPublishers,
  });
};


