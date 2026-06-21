import { useQueries } from "@tanstack/react-query";

import AuthorService from "@/features/admin/author/services/author.service";
import SeriesService from "@/features/admin/series/services/series.service";
import GenreService from "@/features/admin/genre/services/genre.service";
import PublisherService from "@/features/admin/publisher/services/publisher.service";

export const useBookFormData = () => {
  const results = useQueries({
    queries: [
      {
        queryKey: ["genres"],
        queryFn: GenreService.fetchGenre,
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
