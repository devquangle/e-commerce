import { useQueries } from "@tanstack/react-query";
// 👇 Import các Service chứa hàm API thuần, không import Hook
import AuthorService from "@/services/authorService";
import GenreService from "@/services/genreService"; // Thay đổi theo đường dẫn thực tế của bạn
import PublisherService from "@/services/publisherService"; // Thay đổi theo đường dẫn thực tế của bạn

export const useBookFormData = () => {
  const results = useQueries({
    queries: [
      { 
        queryKey: ['genres'], 
        queryFn: GenreService.getGenres
      },
      { 
        queryKey: ['authors'], 
        queryFn: AuthorService.getAuthors 
      },
      { 
        queryKey: ['publishers'], 
        queryFn: PublisherService.getPublishers
      },
    ],
  });

  const isLoading = results.some((result) => result.isLoading);
  const isError = results.some((result) => result.isError);

  return {
    genresData: results[0].data ?? [],
    authorsData: results[1].data ?? [],
    publishersData: results[2].data ?? [],
    isLoading,
    isError,
  };
};