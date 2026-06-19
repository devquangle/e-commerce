import { useQueries } from "@tanstack/react-query";
// 👇 Import các Service chứa hàm API thuần, không import Hook
import AuthorService from "@/services/authorService";

import PublisherService from "@/services/publisherService"; // Thay đổi theo đường dẫn thực tế của bạn
import SeriesService from "@/services/seriesService";
import genreService from "@/features/admin/genre/services/genre.service";

export const useBookFormData = () => {
  const results = useQueries({
    queries: [
      {
        queryKey: ["genres"],
        queryFn: genreService.fetchGenre,
      },
      {
        queryKey: ["authors"],
        queryFn: AuthorService.fetchAuthor,
      },
      {
        queryKey: ["publishers"],
        queryFn: PublisherService.fetchPublisher,
      },
      {
        queryKey: ["series"],
        queryFn: SeriesService.fetchSeries,
      },
    ],
  });

  const isLoading = results.some((result) => result.isLoading);
  const isError = results.some((result) => result.isError);

  return {
    genresData: results[0].data ?? [],
    authorsData: results[1].data ?? [],
    publishersData: results[2].data ?? [],
    seriesData: results[3].data ?? [],
    isLoading,
    isError,
  };
};
